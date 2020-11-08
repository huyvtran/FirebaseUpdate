import React, { Component } from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import HeaderDetail from '../../components/HeaderDetail';
import MapViewComponent from '../../components/MapViewComponent';
import { Actions } from 'react-native-router-flux';
import AppStyles from '../../theme/AppStyles';
import ShipmentControl from './ShipmentControl';
import API from '../../network/API';
import AppSizes from '../../theme/AppSizes';
import AppColors from '../../theme/AppColors';
import ButtonText from '../../components/ButtonText';
import Divider from '../form/components/Divider';
import Progress from '../../components/Progress';
import MarkerImage from '../../components/MarkerImage';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import ActionButton from 'react-native-action-button';
import { Icon } from 'react-native-elements';
import Geolocation from '../../components/geolocation/Geolocation';
import SVGMarkerDepot from '../../components/svg/SVGMarkerDepot';
import SVGMarkerIndex from '../../components/svg/SVGMarkerIndex';

const MAP_MODE = {
    PLAN: 0,
    ACTUAL: 1
}

const LATITUDE = 10.776252;
const LONGITUDE = 106.655364;
class ShipmentViewLocationMap extends Component {

    constructor(props) {
        super(props)
        this.state = {
            locationactual: [],
            mapMode: MAP_MODE.ACTUAL
        }
        this.userLocation = []
        this.planPoliline = ShipmentControl.calculatePoliline(props.shipment)

        this.camera = {
            center: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
            },
            pitch: 10,
            heading: 10,
            zoom: 18,
            altitude: 18,

        }
    }

    componentDidMount() {
        const { shipment } = this.props
        Progress.show(API.getShipmentLocationList, [shipment._id], res => {
            if (res && res.data && res.data.data) {
                let locationactual = []
                res.data.data.forEach(shipmentInfo => {
                    locationactual = locationactual.concat(shipmentInfo.location.map(location => {
                        return { ...location, latlng: location.latitude + ',' + location.longitude }
                    }))
                })
                this.setState({ locationactual }, () => {
                    this.isDoneLoadServer = true
                })
            }
        })


        this.watchId = Geolocation.watchPosition(
            (position) => {
                if (position && position.coords) {


                    this.camera = {
                        ...this.camera,
                        center: {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }
                    }
                }

            },
            (error) => {

            },
            { enableHighAccuracy: true, showLocationDialog: true, distanceFilter: 10, fastestInterval: 5000, interval: 5000 }
        );


    }


    getMarkerList = (poliline) => {
        if (this.state.mapMode === MAP_MODE.PLAN) {
            return poliline.map((latlng, idx) => {
                return <MarkerImage
                    key={idx}
                    coordinate={{ latitude: latlng.latitude, longitude: latlng.longitude }}
                    description={latlng.description ? latlng.description : ''}
                    title={latlng.description ? latlng.description : ''}
                    renderMarker={<SVGMarkerIndex content={idx + 1} />}

                />
            })
        } else {

            if (!poliline || !poliline[0]) {
                return []
            }
            return [<MarkerImage
                coordinate={{ latitude: poliline[0].latitude, longitude: poliline[0].longitude }}
                renderMarker={<SVGMarkerDepot />}

            />]
        }
    }
    onUserLocationChange = (coordinate) => {
        if (this.isDoneLoadServer) {
            this.userLocation.push(coordinate.nativeEvent.coordinate);
            if (this.userLocation.length > 5 && !this.updating) {
                this.updating = true
                let { locationactual } = this.state
                locationactual = locationactual.concat(this.userLocation)
                this.userLocation = []
                this.setState({ locationactual }, () => { this.updating = false })

            }
        }

    }

    animatePolylineStart = (locationList) => {
        if (this.state.locationactual.length < locationList.length) {
            const locationactual = [
                ...locationList.slice(0, this.state.locationactual.length > 2 ? this.state.locationactual.length + 1 : 3)
            ];
            this.setState({ locationactual });
        } else {
            this.stopWatching()
        }
    }

    navigateToMyLocation = () => {
        this.shipmentMapView && this.shipmentMapView.animateCamera(this.camera)

    }



    render() {
        const { shipment } = this.props
        const poliline = this.state.mapMode === MAP_MODE.PLAN ? this.planPoliline : this.state.locationactual
        const markerList = this.getMarkerList(poliline)


        return (
            <View style={styles.container}>
                <HeaderDetail
                    title={shipment.shipmentCode}
                />

                <View style={{ flex: 1, width: '100%', height: '100%' }}>
                    <MapViewComponent
                        ref={ref => { this.shipmentMapView = ref }}

                        allCoords={poliline}
                        camera={{
                            center: {
                                latitude: poliline[0] ? poliline[0].latitude : 21.0412535,
                                longitude: poliline[0] ? poliline[0].longitude : 105.8113495,
                            },
                            pitch: 10,
                            heading: 10,
                            zoom: 15,
                            altitude: 18,
                        }}
                        markerList={markerList}
                        onUserLocationChange={(coordinate) => {
                            this.onUserLocationChange(coordinate)
                        }}
                        isShowViewCoords={this.state.mapMode === MAP_MODE.ACTUAL}
                    />
                </View>
                <View style={styles.controlContainer}>
                    <ButtonText
                        content={Localize(messages.actual)}
                        textStyle={{ color: this.state.mapMode === MAP_MODE.ACTUAL ? 'white' : AppColors.abi_blue }}
                        containerStyle={{ ...styles.controlButtonContainer, backgroundColor: this.state.mapMode === MAP_MODE.ACTUAL ? AppColors.abi_blue : AppColors.white, }}
                        onClick={() => { this.setState({ mapMode: MAP_MODE.ACTUAL }) }}
                    />
                    <ButtonText
                        content={Localize(messages.plan)}
                        textStyle={{ color: this.state.mapMode === MAP_MODE.PLAN ? 'white' : AppColors.abi_blue }}
                        containerStyle={{ ...styles.controlButtonContainer, backgroundColor: this.state.mapMode === MAP_MODE.PLAN ? AppColors.abi_blue : AppColors.white, }}
                        onClick={() => { this.setState({ mapMode: MAP_MODE.PLAN }) }}

                    />

                    {/* <Divider vertical /> */}


                </View>
                <ActionButton
                    buttonColor={AppColors.white}
                    icon={<Icon name='my-location' size={25} color={AppColors.abi_blue} />}
                    onPress={() => this.navigateToMyLocation()}
                />

            </View>

        );
    }
}
export default ShipmentViewLocationMap

const styles = {
    container: {
        flex: 1,

    },
    sourceDesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    controlContainer: {
        position: 'absolute',
        backgroundColor: 'transparent',
        width: AppSizes.paddingLarge * 10,
        flexDirection: 'row',
        top: AppSizes.paddingMedium * 4,
        alignSelf: 'center',
        justifyContent: 'space-between'
    },
    controlButtonContainer: {
        flex: 1,
        height: '100%',
        marginHorizontal: AppSizes.paddingSml,
        paddingHorizontal: AppSizes.paddingXSml,
        paddingVertical: AppSizes.paddingXXSml,
        borderRadius: AppSizes.paddingXSml

    }
}