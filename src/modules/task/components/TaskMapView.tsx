
import Polyline from '@mapbox/polyline';
import _ from 'lodash';
import Moment from "moment/moment";
import React from 'react';
import { PureComponent } from 'react';
import { Dimensions, Image, Platform, StyleSheet, Text, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import * as Animatable from 'react-native-animatable';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import MapViewComponent from '../../../components/MapViewComponent';
import MarkerImage from '../../../components/MarkerImage';
import Progress from '../../../components/Progress';
import SVGMarkerDepot from '../../../components/svg/SVGMarkerDepot';
import Switch from '../../../components/Switch';
import messages from '../../../constant/Messages';
import FirebaseDatabaseManager from '../../../firebase/FirebaseDatabaseManager';
import API from '../../../network/API';
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import AlertUtils from '../../../utils/AlertUtils';
import MapUtils from '../../../utils/MapUtils';
import PermissionUtils from '../../../utils/PermissionUtils';
import TrackLocationManager from '../../locations/TrackLocationManager';
import { generateMarkerList, getActualRouteColorList, getCoordinates, isDeliveryTask } from '../helper/FunctionHelper';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 10.776252;
const LONGITUDE = 106.655364;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CAMERA_DEFAULT = {
  center: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
  },
  pitch: 10,
  heading: 10,
  zoom: 11,
  altitude: 18,
}
const MAP_MODE = {
  ACTUAL: true,
  PLAN: false
}
class TaskMapView extends PureComponent {
  markerList: any;
  orgCoordinate: any;
  currentCamera: { center: { latitude: any; longitude: any; }; pitch: number; heading: number; zoom: number; altitude: number; };
  mapView: any;
  constructor(props) {
    super(props);
    this.markerList = generateMarkerList(props.task, this.renderCalloutMarker)
    this.orgCoordinate = props?.org?.[0]?.coordinate ?? { latitude: 0, longitude: 0 }
  }
  state = {

    planLocationList: [],
    mapCompleted: false,

    camera: CAMERA_DEFAULT,
    actualLocationList: {
      date: this.props.endDate,
      datas: []
    },
    mapMode: MAP_MODE.PLAN,
    isWatchingMode: false,
  }

  componentDidMount = async () => {
    this.onCheckCurrentLocation();
    this.onGetPlanLocationList(this.props)
  }

  componentWillReceiveProps = (nextProps) => {
    this.markerList = generateMarkerList(nextProps.task, this.renderCalloutMarker)

    this.onGetPlanLocationList(nextProps, () => {
      if (this.state.mapMode === MAP_MODE.ACTUAL) {
        this.onGetActualLocationList()
      }
    })
  }

  onCheckCurrentLocation = async () => {
    const locationPermission = await PermissionUtils.checkLocationPermission();
    if (locationPermission !== PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
      return
    }

    TrackLocationManager.getCurrentLocation((position) => {
      if (Platform.OS === 'android' && position.mocked) {
        FirebaseDatabaseManager.reportUserMockLocation(this.props.user)
        AlertUtils.showError(messages.youAreUsingMockLocation)
        return
      }

      this.currentCamera = {
        ...CAMERA_DEFAULT,
        center: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
      }
    }, (error) => {
      console.log("onCheckCurrentLocation error>>", error)
    })
  }

  onGetPlanLocationList = ({ task: taskList, endDate }, onDone) => {
    const planLocationList = this.getPlanLocationList(taskList);

    if (!planLocationList || planLocationList.length === 0) {
      this.setState({
        planLocationList: [],
        actualLocationList: {
          date: endDate,
          datas: []
        },
        camera: {
          ...CAMERA_DEFAULT,
          center: this.orgCoordinate,
          camera: 15
        }
      });
      return
    }

    const camera = this.getProperlyCamera(planLocationList)
    this.setState({ planLocationList, camera }, () => onDone && onDone());
  }

  onGetActualLocationList = () => {
    const { task, user, org, endDate } = this.props;

    const userId = user._id
    const organizationIds = org[0]._id
    const routeId = task?.[0]?.routeDetailId ?? null
    Progress.show(API.getRouteLocation, [[userId], [organizationIds], endDate, [routeId]], res => {
      const locationList = res?.data?.data?.[0]?.location ?? [];
      this.setState({
        actualLocationList: {
          date: this.props.endDate,
          datas: locationList
        }
      })
    })
  }

  getPlanLocationList(task) {
    const planLocationList = [];
    task.forEach(e => {
      const coords = e.encodedPath && this.getDirections(e.encodedPath);
      coords && planLocationList.push(coords);
    });
    let coordResult = []
    planLocationList.forEach(coord => {
      coordResult.push(...coord)
    })
    return coordResult;
  }

  getProperlyCamera = (locationList) => {
    const latitudeMin = _.minBy(locationList, location => location.latitude)?.latitude ?? 0;
    const latitudeMax = _.maxBy(locationList, location => location.latitude)?.latitude ?? 0;
    const longitudeMin = _.minBy(locationList, location => location.longitude)?.longitude ?? 0;
    const longitudeMax = _.maxBy(locationList, location => location.longitude)?.longitude ?? 0;
    const distanceLongest = MapUtils._calculateGreatCircleDistance({ latitude: latitudeMin, longitude: longitudeMin }, { latitude: latitudeMax, longitude: longitudeMax })
    if (!distanceLongest || distanceLongest === 0) {
      return {
        ...CAMERA_DEFAULT,
        center: {
          latitude: latitudeMin,
          longitude: longitudeMin,
        },
      }
    }
    return {
      ...CAMERA_DEFAULT,
      center: {
        latitude: (latitudeMin + latitudeMax) / 2,
        longitude: (longitudeMin + longitudeMax) / 2,
      },

    }
  }

  getDirections(encodedPath) {
    try {
      const points = Polyline.decode(encodedPath);
      const coords = points.map((point) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      return coords;
    } catch (error) {
      return error;
    }
  }

  navigateToMyLocation = () => {
    if (!this.currentCamera) {
      return
    }
    this.mapView && this.mapView.animateCamera(this.currentCamera)

  }

  onChangeMapMode = () => {
    const { actualLocationList, mapMode } = this.state
    if (mapMode === MAP_MODE.ACTUAL &&
      ((actualLocationList.date && this.props.endDate && !Moment(actualLocationList.date).isSame(Moment(this.props.endDate), 'day')) ||
        (!actualLocationList.datas || actualLocationList.datas.length === 0))
    ) {
      this.onGetActualLocationList()
    }
  }

  isShowViewCoords = () => {
    const { task } = this.props
    if (!task || task.length === 0 || !task[0] || !task[0].taskAction) {
      return false
    }
    const taskActionCode = task[0].taskAction.taskActionCode
    return isDeliveryTask(taskActionCode)
  }


  getRouteDrawColor = () => {
    const { mapMode, actualLocationList } = this.state
    if (mapMode === MAP_MODE.ACTUAL) {
      return getActualRouteColorList(actualLocationList.datas)
    }
    return null
  }

  renderCalloutMarker = (task, index) => {
    let taskAddress = getCoordinates(task, index)
    return (<MapView.Callout
      tooltip={true}
      onPress={() => {
        // this.props.taskItemPress(task, index)
      }}>
      <View style={{ width: 200, heihgt: 100, backgroundColor: 'white', padding: 8 }}>
        <Text style={{ fontSize: 14, color: AppColors.textContent, marginBottom: 8 }}>{`Address: ${taskAddress.address}`}</Text>
        {!_.isEmpty(task.checkIn.imageUrls[0]) && <Image style={{ width: 200, height: 100, resizeMode: 'contain' }} source={{ uri: task.checkIn.imageUrls[0] }} />}
      </View>
    </MapView.Callout>)

  }

  render() {
    const orgSelect = this.props.org[0]
    if (orgSelect && orgSelect.coordinate && orgSelect.coordinate.latitude && orgSelect.coordinate.longitude && !this.isShowViewCoords()) {
      const markerOrg = <MarkerImage
        coordinate={{ latitude: orgSelect.coordinate.latitude, longitude: orgSelect.coordinate.longitude }}
        title={orgSelect.organizationDescription}
        description={orgSelect.organizationDescription}
        renderMarker={<SVGMarkerDepot />}
      />
      this.markerList.push(markerOrg)
    }

    return (
      <Animatable.View animation="zoomIn" style={{ flex: 1 }} >
        <MapViewComponent
          ref={ref => { this.mapView = ref }}
          allCoords={this.state.mapMode ? this.state.actualLocationList.datas : this.state.planLocationList}
          markerList={this.markerList}
          camera={this.state.camera}
          isShowViewCoords={this.isShowViewCoords()}
          onChangeWatchingMode={(isWatching) => {
            this.setState({ isWatchingMode: isWatching })
          }}
          strokeColors={this.getRouteDrawColor()}
        />

        <ActionButton
          buttonColor={AppColors.white}
          icon={<Icon name='my-location' size={25} color={AppColors.abi_blue} />}
          onPress={() => this.navigateToMyLocation()}
        />
        {this.isShowViewCoords() && <View style={styles.switchContainer}>

          <Switch
            value={this.state.mapMode}
            onValueChange={(value) => {

              this.setState({ mapMode: value }, () => {
                this.onChangeMapMode()
              })
            }}
            disabled={this.state.isWatchingMode}
            activeText={'Actual'}
            inActiveText={'Plan'}
            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
            outerCircleStyle={{}} // style for outer animated circle
            switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
          />
        </View>}

      </Animatable.View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },

  switchContainer: {
    position: 'absolute',
    top: AppSizes.paddingMedium,
    left: AppSizes.paddingMedium,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }

});

export default connect(state => ({
  user: state.user.user,
  task: state.task.data,
  org: state.org.orgSelect,
}), {})(TaskMapView);
