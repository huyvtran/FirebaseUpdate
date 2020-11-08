import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Animated, Text,
    TouchableOpacity,
    TextInput,
    Keyboard
} from 'react-native';

import { connect } from 'react-redux';
import MapViewComponent from '../../components/MapViewComponent';
import HeaderDetail from '../../components/HeaderDetail';
import { Actions } from 'react-native-router-flux';
import Interactable from 'react-native-interactable';
import AppSizes from '../../theme/AppSizes';
import AppColors from '../../theme/AppColors';
import { Icon } from 'react-native-elements';
import AwesomeListComponent from 'react-native-awesome-list';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import ErrorAbivinView from '../../components/ErrorAbivinView';
import API from '../../network/API';
import AppStyles from '../../theme/AppStyles';
import ButtonIcon from '../../components/ButtonIcon';
import _ from 'lodash'
import TrackLocationManager from '../locations/TrackLocationManager';
import MarkerImage from '../../components/MarkerImage';
import SVGMarkerIndex from '../../components/svg/SVGMarkerIndex';
class FreightMapSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            currentLocation: { latitude: 0, longitude: 0 },
            customerList: []
        };
        this._deltaY = new Animated.Value(AppSizes.screenHeight - 100);
        this.searchText = ''
    }
    //============================================= COMPONENT LIFE CYCLE =========================================//
    componentDidMount() {
        Keyboard.dismiss()
    }

    //============================================= UI CONTROL =========================================//

    source = (pagingData) => {
        const { locationDataList } = this.props;
        if (locationDataList && locationDataList.length > 0) {

            return Promise.resolve({ data: { data: locationDataList } })
        }
        const organizationIds = this.props.orgList.map(org => org._id)
        const { currentLocation } = this.state
        return API.customerListAll(organizationIds, this.searchText, pagingData, currentLocation)
    }

    keyExtractor = (item) => item._id


    transformer(res) {
        const customerList = res.data.data
        this.setState({ customerList })
        return customerList
    }


    //============================================= LOGIC CONTROL =========================================//


    onChangeText = _.debounce((text) => {
        this.searchText = text
        this.locationShipmentList.refresh()
    }, 300)

    onClickSelectLocation = (location) => {
        this.props.onSelectLocation(location)
        Actions.pop()
    }
    //============================================= UI RENDER =========================================//

    renderItem = ({ item }) => {
        return <TouchableOpacity onPress={() => { this.onClickSelectLocation(item) }} style={styles.itemLocationContainer}>

            <ButtonIcon
                iconName={'location-on'}
                iconSize={AppSizes.paddingLarge * 2}
                iconColor={AppColors.abi_blue}
                containerStyle={{ flex: 1 }}
                isIcon
            />
            <View style={styles.itemContentContainer}>
                <Text style={{ ...AppStyles.regularText, color: AppColors.textContent, fontSize: AppSizes.fontXXMedium }} numberOfLines={1}>{item.fullName}</Text>
                <Text style={{ ...AppStyles.regularText, color: AppColors.textSubContent, marginTop: AppSizes.paddingXSml }} numberOfLines={1}>{item.customerCode}</Text>
                <Text style={{ ...AppStyles.regularText, color: AppColors.textSubContent, marginTop: AppSizes.paddingXSml }} numberOfLines={1}>{item.streetAddress}</Text>
            </View>
            <ButtonIcon
                iconName={'keyboard-arrow-right'}
                iconSize={AppSizes.paddingLarge * 1.5}
                iconColor={AppColors.textSubContent}
                containerStyle={{ flex: 1 }}
                isIcon
            />

        </TouchableOpacity>
    }

    renderLocationList = () => {
        return <View style={{ flex: 1 }}>
            <View style={styles.searchContainer}>
                <Icon
                    style={{ flex: 1 }}
                    size={AppSizes.paddingXLarge}
                    name={'search'}
                    color={AppColors.textSubContent}
                />
                <TextInput
                    keyboardShouldPersistTaps='always'
                    style={styles.textInput}
                    onChangeText={text => this.onChangeText(text)}
                    placeholder={Localize(messages.search)}
                    autoCorrect={false}
                    autoCapitalize='none'
                    underlineColorAndroid='rgba(0,0,0,0)'
                    onFocus={() => {
                        this.dragView.snapTo({ index: 0 })
                    }}
                />
            </View>

            <AwesomeListComponent
                ref={ref => this.locationShipmentList = ref}
                isPaging
                source={(pagingData) => this.source(pagingData)}
                renderItem={(item) => this.renderItem(item)}
                keyExtractor={(item) => this.keyExtractor(item)}
                emptyText={Localize(messages.noResult)}
                transformer={(response) => this.transformer(response)}
                renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.locationShipmentList.onRetry()} />}

            />
        </View>
    }
    render() {
        const markerList = this.state.customerList.map((customer, index) => {
            return <MarkerImage
                coordinate={customer.coordinate}
                description={customer.fullName}
                title={customer.fullName}
                renderMarker={<SVGMarkerIndex content={index + 1} />}

            />
        })
        return (
            <View style={styles.container}>

                <View style={{ flex: 1 }}>
                    <MapViewComponent
                        camera={{
                            center: this.state.currentLocation,
                            pitch: 10,
                            heading: 10,
                            zoom: 15,
                            altitude: 18,
                        }}
                        markerList={markerList}
                    />
                </View>
                <TouchableOpacity style={styles.backButtonContainer} onPress={() => Actions.pop()}>
                    <Icon
                        name={'arrow-back'}
                        color={'white'}
                        size={AppSizes.paddingXXLarge}
                    />
                </TouchableOpacity>
                <View style={styles.panelContainer} pointerEvents={'box-none'}>
                    <Animated.View
                        pointerEvents={'box-none'}
                        style={[styles.panelContainer, {
                            backgroundColor: 'black',
                            opacity: this._deltaY.interpolate({
                                inputRange: [0, AppSizes.screenHeight - 100],
                                outputRange: [0.5, 0],
                                extrapolateRight: 'clamp'
                            })
                        }]} />
                    <Interactable.View
                        ref={ref => this.dragView = ref}
                        verticalOnly={true}
                        snapPoints={[{ y: 40 }, { y: AppSizes.screenHeight - 300 }, { y: AppSizes.screenHeight - 90 }]}
                        boundaries={{ top: -300 }}
                        initialPosition={{ y: AppSizes.screenHeight - 300 }}
                        animatedValueY={this._deltaY}>
                        <View style={styles.panel}>
                            <View style={styles.panelHeader}>
                                <View style={styles.panelHandle} />
                                <Text style={{ fontSize: AppSizes.fontMedium, color: AppColors.textContent }}>{Localize(messages.locationList)}</Text>
                            </View>
                            {this.renderLocationList()}
                        </View>
                    </Interactable.View>
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContent: {
        flex: 1
    },
    panelContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    panel: {
        height: AppSizes.screenHeight,
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: AppSizes.paddingMedium,
        borderTopRightRadius: AppSizes.paddingMedium,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowOpacity: 0.4
    },
    panelHeader: {
        alignItems: 'center'
    },
    panelHandle: {
        width: 40,
        height: AppSizes.paddingTiny,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10
    },
    panelTitle: {
        fontSize: 27,
        height: 35
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10
    },

    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    photo: {
        width: AppSizes.screenWidth - 40,
        height: 225,
        marginTop: 30
    },
    map: {
        height: AppSizes.screenHeight,
        width: AppSizes.screenWidth
    },
    backButtonContainer: {
        position: 'absolute',
        backgroundColor: AppColors.abi_blue,
        top: AppSizes.paddingMedium,
        left: AppSizes.paddingMedium,
        borderRadius: AppSizes.paddingXXLarge,
        height: AppSizes.paddingXLarge * 2,
        width: AppSizes.paddingXLarge * 2,
        borderColor: AppColors.textContent,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 2,
    },
    itemLocationContainer: {
        flexDirection: 'row',
        // paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
        borderBottomColor: AppColors.lightgray,
        borderBottomWidth: AppSizes.paddingMicro,
        width: '100%',
        justifyContent: 'space-between'
    },
    itemContentContainer: {
        flex: 8,
        marginHorizontal: AppSizes.paddingMedium
    },
    textInput: {
        flex: 12,
        fontSize: AppSizes.fontBase,
        padding: 0
    },
    searchContainer: {
        backgroundColor: 'white',
        marginVertical: AppSizes.paddingSml,
        flexDirection: 'row',
        padding: AppSizes.paddingTiny,
        justifyContent: "center",
        alignItems: 'center',
        width: '100%',
        height: AppSizes.paddingXLarge * 2,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: AppColors.lightgray
    }
});
export default connect(state => ({
    orgList: state.org.orgList,

    event: state.refresh.event,

}), {
    })(FreightMapSearch);

