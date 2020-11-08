import React, { Component } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions, Image,
  PermissionsAndroid,
} from "react-native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import { CardTitle } from "../../../../theme/styled";
import { PanelContainer } from "./components/styled";
import {
  checkToDayInOut,
  validateDeliveryTrips,
  isDeliveryTask,
  isGeometryTask,
  isSnpTask,
} from "../../../task/helper/FunctionHelper";
import _ from "lodash";
import Messages from "../../../../constant/Messages";
import { addForm } from "../../actions/creater/form";
import Moment from "moment/moment";

import messages from "../../../../constant/Messages";
import FirebaseStorageManager from "../../../../firebase/FirebaseStorageManager";
import { Localize } from "../../../setting/languages/LanguageManager";
import AppColors from "../../../../theme/AppColors";
import TaskHelper from "../../../task/helper/TaskHelper";
import TaskCode from "../../../../constant/TaskCode";
import PermissionUtils from "../../../../utils/PermissionUtils";
import { SIMPLE_DATE_TIME_FULL_FORMAT } from "../../../../utils/TimeUtils";
import API from "../../../../network/API";
import { refresh } from "../../../../store/actions/refresh";
import eventTypes from "../../../../store/constant/eventTypes";
import Progress from "../../../../components/Progress";
import FormType from "../../../../constant/FormType";
import TrackLocationManager from "../../../locations/TrackLocationManager";
import AppStyles from "../../../../theme/AppStyles";
import { Actions } from "react-native-router-flux";
import ImageLoading from "../../../../components/ImageLoading";
import FirebaseDatabaseManager from "../../../../firebase/FirebaseDatabaseManager";
import AppSizes from "../../../../theme/AppSizes";
import UserActions from "../../../../firebase/UserActions";
import MapUtils from "../../../../utils/MapUtils";
import FirebaseAnalyticsManager from "../../../../firebase/FirebaseAnalyticsManager";
import AlertUtils from "../../../../utils/AlertUtils";
import TestID from "../../../../../test/constant/TestID";
import ImagePicker from "../../../../components/imagePicker/ImagePicker";

const styles = StyleSheet.create({
  containerLabel: {
    alignItems: "center",
    padding: AppSizes.paddingMedium,
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: AppSizes.paddingXXSml,
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: AppSizes.paddingMedium,
    paddingLeft: AppSizes.paddingMedium,
    backgroundColor: "transparent",
    paddingTop: AppSizes.paddingXSml,
    paddingBottom: AppSizes.paddingXSml,
    width: "100%",
  },
  containerInfo: {
    paddingTop: AppSizes.paddingTiny,
    paddingBottom: AppSizes.paddingTiny,
    flexDirection: "row",
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
    justifyContent: "space-between",
  },
  textPicker: {
    fontSize: AppSizes.fontXXMedium,
    color: "#455A64",
  },
  image: {
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
    height: AppSizes.paddingLarge * 10,
    borderColor: AppColors.gray,
    borderWidth: 0.2,
    borderRadius: AppSizes.paddingXXSml,
  },
  imageContainer: {
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
    height: AppSizes.paddingLarge * 10,
    borderRadius: AppSizes.paddingXXSml,

  },
});


// Component...
class PickerImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: this.props.defaultValues || "",
      latitude: null,
      longitude: null,
      loadingLocation: false,
    };
    const { ...item } = this.props;
    this.item = item;
    this.taskList = props.taskList;
    this.hasDistanceFilter = props.properties && props.properties.distanceFilter;
    this.distanceFilter = props.properties && props.properties.distanceFilter ? parseInt(props.properties.distanceFilter) : 0;
    this.hasGeofencing = props.properties && props.properties.Geofencing;
    this.Geofencing = props.properties && props.properties.Geofencing 
      ? parseInt(props.properties.Geofencing)
      : 0;
  }


  componentWillReceiveProps(props) {
    if (!_.isEqual(this.props.defaultValues, props.defaultValues)) {
      this.setState({
        uri: props.defaultValues || [],
      });
    }
    const { ...item } = props;
    this.item = item;
  }


  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.uri !== nextState.uri ||
      !_.isEqual(this.props.defaultValues, nextProps.defaultValues) ||
      this.state.loadingLocation !== nextState.loadingLocation
    );
  }

  checkDistanceFromStore(storeLocation) {
    const distance = MapUtils._calculateGreatCircleDistance(this.location, storeLocation);
    return distance > this.distanceFilter;
  }

  checkGeofencing() {
    const distance = MapUtils._calculateGreatCircleDistance(
      this.location,
      this.props.taskDetail.customer.coordinate,
    );
    return distance > this.Geofencing;
  }

  checkDistanceFilter = () => {
    if (!this.hasDistanceFilter) {
      this.openImagePicker();
      return;
    }
    const storeLocation = this?.props?.taskDetail?.customer?.coordinate ?? null;
    if (storeLocation === null) {
      AlertUtils.showWarning(messages.notHaveStoreLocation, () => {
        this.openImagePicker();
      });
      return;
    }
    if (this.hasDistanceFilter && this.checkDistanceFromStore(storeLocation)) {
      Alert.alert(Localize(messages.warning), `${Localize(messages.youAreTooFarStore)} (> ${this.distanceFilter}m) `, [
        {
          text: Localize(messages.retrieve),
          onPress: () => {
            this.getCurrentLocation();
          },
        },
        {
          text: Localize(messages.continue),
          onPress: () => {
            this.openImagePicker();
          },
        },
      ]);
      return;
    }
  };

  /**
   * after get current location =>
   * finish loading get current location =>
   * user take picture from device
   */
  openImagePicker() {
    this.setState({
      loadingLocation: false,
    });
    const options = {
      title: Localize(messages.chooseYourImage),
      chooseFromLibraryButtonTitle: Localize(messages.chooseFromLibrary),
      takePhotoButtonTitle: Localize(messages.takePhoto),
      quality: 0.6,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: "Pictures/myAppPicture/",
        privateDirectory: true,
      },
      cancelButtonTitle: Localize(messages.cancel),
    };

    // launch directly to camera, if has props isHideSelectFromLibrary
    if (this.isHideSelectFromLibrary()) {
      ImagePicker.launchCamera(options, response => {
        console.log("ImagePicker.launchCamera: ", response);
        this.onCallBackMedia(response);
      });
    } else {
      ImagePicker.showImagePicker(options, response => {
        console.log("Response = ", response);
        this.onCallBackMedia(response);
      });
    }
  }

  /**
   * receive image's uri after user delect from local
   * upload this iamge to firebase => get the firebase link
   * => upload link url to abivin's server
   * @param {*} response
   */
  onCallBackMedia(response) {
    if (response.didCancel) {
      FirebaseAnalyticsManager.logEvent(UserActions.LOAD_IMAGE, {
        taskId: this.props.taskDetail._id,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        error: "User cancelled image picker"
      });
    } else if (response.error) {
      Alert.alert('Lỗi chọn ảnh', response.error)
      FirebaseAnalyticsManager.logEvent(UserActions.LOAD_IMAGE, {
        taskId: this.props.taskDetail._id,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        error: response.error
      });
    } else if (response.customButton) {
      // console.log("User tapped custom button: ", response.customButton);
      FirebaseAnalyticsManager.logEvent(UserActions.LOAD_IMAGE, {
        taskId: this.props.taskDetail._id,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        error: "User tapped custom button"
      });
    } else {
      console.log("onCallBackMedia >>", response);
      Progress.show(FirebaseStorageManager.uploadImgaeFirebaseStorage, [response], url => {
        url && this.submitUrl(url);
      });
    }
  }

  submitUrl(url) {
    const params = {
      value: url,
      timestamp: new Date(),
      label: null,
    };
    this.submitCheckIn(params);
  }

  submitCheckIn(body) {
    const { taskDetail, username } = this.props;
    if (!this.location) {
      AlertUtils.showError(messages.locationIsnotDetect);
      return;
    }
    const bodyParams = {
      taskId: taskDetail._id,
      checkIn: {
        imageUrls: body.value,
        latitude: this.location.latitude,
        longitude: this.location.longitude,
        status: 1,
        timestamp: new Date(),
        username,
      },
      lastResponse: {
        entities: [
          {
            data: [{
              value: body.value,
              timestamp: new Date(),
            }],
            validate: true,
            label: "Check in",
            multiple: false,
            propertyName: "undefinedFile",
            propertyType: "file",
            referenceId: null,
          },
        ],
      },
      status: 1,
      isCheckin: true,
    };
    Progress.show(API.submitCheckIn, [bodyParams], res => {
      Progress.show(this.props.addForm, [this.item, [body]], () => {
        this.props.refresh(eventTypes.REFRESH_TASK_LIST, _.now());
        FirebaseAnalyticsManager.logEvent(UserActions.CHECK_IN, {
          taskId: bodyParams.taskId,
          latitude: this.location.latitude,
          longitude: this.location.longitude,
        });
      });
    });
  }

  addData(item, data) {
    this.props.addForm(item, data);
  }

  // -----------------------------------------UI CONTROL -----------------------------------
  /**
   * onClickList when user click pick Image + change Image
   * check some logics befor check loccation permission
   */
  onClickCapture = _.throttle(() => {
    const { configurations } = this.props.orgConfig;
    const allowSubmitOverTime = configurations.allowSubmitOverTime;

    /**
     * if task is completed and is not geometry task => do not allow resubmit
     */
    if (this.props.taskDetail &&
      this.props.taskDetail.status === TaskHelper.status.COMPLETE && !isGeometryTask(this.props.taskActionCode)) {
      AlertUtils.showError(messages.taskIsCompleted);

      return;
    }
    /**
     * if task is check in or check out task => do not allow submit when date is not today
     */
    if (!checkToDayInOut(this.props.currentDate) && !allowSubmitOverTime) {
      return;
    }

    if (isDeliveryTask(this.props.taskActionCode) && !validateDeliveryTrips(this.taskList, this.props.taskDetailContain)) {
      return;
    }


    this.onCheckPermission();
  }, 300, { trailing: false });

  /**
   * check location permission that user grant to app.
   * If user not grant location permission => do not allow to capture image
   * this function is called before call getCurrentLocation
   */
  onCheckPermission() {
    PermissionUtils.checkLocationPermission()
      .then(value => {
        if (value === PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
          this.setState({ loadingLocation: true }, () => {
            this.getCurrentLocation();
          });
        } else {
          AlertUtils.showError(messages.canotCheckLocation);
        }
      });
  }

  /**
   * get user's current location, after check location permission
   * and must get current location before picking image
   * @param {accuracy GPS enable} enableAccracy
   * @param {count retry} count
   */
  getCurrentLocation(enableAccracy = true, count = 0) {
    TrackLocationManager.getCurrentLocation(position => {
      if (Platform.OS === "android" && position.mocked) {
        FirebaseDatabaseManager.reportUserMockLocation(this.props.user);
        this.setState({
          loadingLocation: false,
        });
        AlertUtils.showError(messages.youAreUsingMockLocation);
        return;
      }
      if (position && position.coords) {
        this.location = position.coords;
        if (this.hasGeofencing && this.checkGeofencing()) {
          this.setState({ loadingLocation: false });
          AlertUtils.showError(messages.notNearEnough);
          return;
        }
        this.checkDistanceFilter();
      }
    }, error => {
      if (isDeliveryTask(this.props.taskActionCode)) {
        if (count >= 5) {
          this.setState({ loadingLocation: false });
          AlertUtils.showError(messages.canotCheckLocation);
          return;
        }
        this.getCurrentLocation(false, count + 1);
      } else {
        this.checkDistanceFilter();
      }
    }, enableAccracy);
  }

  isHideSelectFromLibrary = () => {
    return this.props && this.props.properties && this.props.properties.isHideSelectFromLibrary && this.props.properties.isHideSelectFromLibrary === "true";
  };

  renderPicker() {
    return (
      <TouchableOpacity testID={TestID.addPhotoButton} style={styles.containerLabel}
        onPress={() => this.onClickCapture()}
      >
        <Icon name="add-a-photo" color="#5c91e2"/>
      </TouchableOpacity>
    );
  }

  getCheckInTimeServer() {
    const { defaultValues } = this.props;
    if (this.props.components) {
      const component = this.props.components.find(component => component.type === FormType.PICK_IMAGE && component.defaultValue === defaultValues);
      if (component && component.defaultValues && component.defaultValues[0] && component.defaultValues[0].timestamp) {
        const checkInServer = (component.defaultValues[0].timestamp);
        const gmtDateTime = Moment.utc(checkInServer);
        return gmtDateTime.local()
          .format(SIMPLE_DATE_TIME_FULL_FORMAT);
      }
    }
  }


  renderImage() {
    return (
      <View>
        <View style={styles.containerInfo}>
          <Text style={[styles.textPicker, { color: "#5c91e2" }]}>{this.getCheckInTimeServer()}</Text>
          <TouchableOpacity
            testID={TestID.addPhotoButton}
            style={{ marginRight: 0 }}
            onPress={() => this.onClickCapture()}
          >
            <Text style={[styles.textPicker, { color: "#5c91e2" }]}>{Localize(Messages.change)}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.imageContainer}
          onPress={() => Actions.viewImage({ imageList: [this.state.uri] })}
        >
          <ImageLoading
            resizeMode={"cover"}
            style={styles.image}
            source={{ uri: this.state.uri }}
          />
        </TouchableOpacity>
      </View>

    );
  }

  renderLoadingLocation() {
    return (<View style={styles.containerLabel}>
      <ActivityIndicator/>
    </View>);
  }

  render() {
    return (
      <View style={{
        marginHorizontal: AppSizes.paddingXTiny,
        marginVertical: AppSizes.paddingXXSml,
        borderRadius: AppSizes.paddingXTiny,
      }}
      >
        <PanelContainer>
          <Text style={CardTitle}>{this.props.label}</Text>
        </PanelContainer>
        <View style={styles.contentContainer}>
          {_.isEmpty(this.state.uri) && !this.state.loadingLocation && this.renderPicker()}
          {this.state.loadingLocation && this.renderLoadingLocation()}
          {!_.isEmpty(this.state.uri) && !this.state.loadingLocation && this.renderImage()}

        </View>

      </View>
    );
  }
}

export default connect(state => ({
  currentDate: state.task.currentDate,
  taskList: state.task.data,
  taskDetail: state.task.taskDetail.task,
  username: state.user.user.username,
  taskActionCode: state.task.taskDetail.task.taskAction.taskActionCode,
  org: state.org.orgSelect,
  taskDetailContain: state.task.taskDetail,
  components: state.task.taskDetail.components,
  orgConfig: state.user.orgConfig,
  user: state.user.user,

}), {
  addForm,
  refresh,
})(PickerImg);