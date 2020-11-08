import React, { Component } from 'react'
import { View, ActivityIndicator } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import AppColors from '../theme/AppColors';
import ActionButton from 'react-native-action-button';
import { Icon } from 'react-native-elements';
import AppSizes from '../theme/AppSizes';
import MarkerImage from './MarkerImage';
import SvgMarkerTruck from './svg/SVGMarkerTruck';

class MapViewComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mapCompleted: false,
            allCoords: props.allCoords
        }
    }

    componentWillReceiveProps(newsProps) {
        if (this.props.allCoords && newsProps.allCoords && !this.isWatching) {
            this.setState({ allCoords: newsProps.allCoords })
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    animateCamera = (camera) => {
        this.mapView && this.mapView.animateCamera(camera, 500)
    }

    onClickReWatchTrans = () => {
        const { onChangeWatchingMode } = this.props
        if (this.isWatching) {
            this.stopWatching()
            this.setState({ allCoords: this.allCoordsWatch })
        } else {
            const { allCoords } = this.state
            this.isWatching = true
            onChangeWatchingMode && onChangeWatchingMode(this.isWatching)

            this.allCoordsWatch = [...allCoords];
            const len = allCoords.length;
            let completed = 0;
            this.state.allCoords = [];
            const steps = parseInt((this.allCoordsWatch.length / 20), 10);
            clearInterval(this.interval);

            this.interval = setInterval(() => {
                const coords = this.state.allCoords.slice(0);
                for (let i = completed; i < (completed + steps) && i <= len; i += 1) {
                    if (this.allCoordsWatch[i]) {
                        coords.push(this.allCoordsWatch[i]);
                    }
                }
                this.setState({ allCoords: coords });
                if (completed >= len) {
                    this.stopWatching()
                    this.forceUpdate()
                }
                completed += steps;
            }, (this.props.interval || 100));
        }
    }

    animatePolylineStart = (locationList) => {
        if (this.state.allCoords.length < locationList.length) {
            const allCoords = [
                ...locationList.slice(0, this.state.allCoords.length > 2 ? this.state.allCoords.length + 10 : 3)
            ];
            this.setState({ allCoords });
        } else {
            this.stopWatching()
            this.forceUpdate()
        }
    }

    stopWatching = () => {
        clearInterval(this.interval);
        this.isWatching = false
        this.props.onChangeWatchingMode && this.props.onChangeWatchingMode(this.isWatching)
    }

    render() {
        const { camera, onUserLocationChange, isShowViewCoords, strokeColors } = this.props
        let markerListParam = [...this.props.markerList]
        const { allCoords } = this.state
        if (this.isWatching && allCoords && allCoords.length > 0) {

            markerListParam.push(
                <MarkerImage
                    coordinate={{ latitude: allCoords[allCoords.length - 1].latitude, longitude: allCoords[allCoords.length - 1].longitude }}
                    renderMarker={<SvgMarkerTruck />}
                />
            )
        }

        let mapView;
        /**
         * on Android will crash when childs of map view is removed. In this case is allCoords. 
         * So we must be seperate to two map view
         */
        if ((!allCoords || allCoords.length === 0) && (!markerListParam || markerListParam.length === 0)) {

            mapView = <MapView
                ref={ref => { this.mapView = ref }}
                provider={PROVIDER_GOOGLE}
                camera={camera}
                showsUserLocation
                showsMyLocationButton={false}
                style={{
                    // height: window.height / 2,
                    // width: window.width,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
                onRegionChangeComplete={() => { this.setState({ mapCompleted: true }) }}
                onUserLocationChange={onUserLocationChange && onUserLocationChange}
            />
        }
        else if ((!allCoords || allCoords.length === 0) && markerListParam && markerListParam.length > 0) {
            mapView = <MapView
                ref={ref => { this.mapView = ref }}
                provider={PROVIDER_GOOGLE}
                camera={camera}
                showsUserLocation
                showsMyLocationButton={false}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
                onRegionChangeComplete={() => { this.setState({ mapCompleted: true }) }}
                onUserLocationChange={onUserLocationChange && onUserLocationChange}
            >

                {
                    markerListParam
                }

            </MapView>
        }
        else {
            mapView = <MapView
                ref={ref => { this.mapView = ref }}
                provider={PROVIDER_GOOGLE}
                camera={camera}
                showsUserLocation
                showsMyLocationButton={false}
                style={{
                    // height: window.height / 2,
                    // width: window.width,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
                onRegionChangeComplete={() => { this.setState({ mapCompleted: true }) }}
                onUserLocationChange={onUserLocationChange && onUserLocationChange}
            >
                {
                    this.state.mapCompleted && allCoords && allCoords.length > 0 && <View
                    >
                        <MapView.Polyline
                            strokeColor={AppColors.naviBlue}
                            strokeColors={strokeColors}
                            strokeWidth={3.5}
                            coordinates={allCoords}
                        />
                    </View>
                }
                {
                    markerListParam && markerListParam.length > 0 && markerListParam
                }

            </MapView>
        }
        return (
            <View style={{ height: '100%', width: '100%' }}>
                {mapView}
                {isShowViewCoords && <ActionButton position={'left'} buttonColor={AppColors.white} renderIcon={() => <Icon name={'remove-red-eye'} size={AppSizes.paddingXXLarge} color={this.isWatching ? AppColors.lightgray : AppColors.abi_blue} />} onPress={() => this.onClickReWatchTrans()} />}

            </View>

        )
    }
}
export default MapViewComponent;
