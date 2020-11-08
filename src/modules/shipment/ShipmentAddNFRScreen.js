import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput, TouchableOpacity,
    StyleSheet,
    Platform
} from 'react-native';
import HeaderDetail from '../../components/HeaderDetail';
import { Actions } from 'react-native-router-flux';
import AppStyles from '../../theme/AppStyles';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import InputField from '../../components/InputField';
import Icon from 'react-native-vector-icons/Ionicons';
import AppColors from '../../theme/AppColors';
import AppSizes from '../../theme/AppSizes';
import AddPhotoComponent from '../../components/AddPhotoComponent';
import ButtonText from '../../components/ButtonText';
import { connect } from 'react-redux';
import Progress from '../../components/Progress';
import API from '../../network/API';
import FreightConstant from '../freight/FreightConstant';
import MapViewComponent from '../../components/MapViewComponent';
import MarkerImage from '../../components/MarkerImage';
import TaskHelper from '../task/helper/TaskHelper';
import eventTypes from '../../store/constant/eventTypes';
import { refresh } from '../../store/actions/refresh'
import _ from 'lodash'
import SVGMarkerIndex from '../../components/svg/SVGMarkerIndex';
import AlertUtils from '../../utils/AlertUtils';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white'
    },
    contentContainer: {
        backgroundColor: 'white',
        paddingHorizontal: AppSizes.paddingMedium
    },
    inputContainer: {
        color: AppColors.textColor,
        fontSize: AppSizes.fontBase,
        height: AppSizes.paddingLarge * 2,
        width: '80%'
    },
    slectFeeContainer: {
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40
    },
})
class ShipmentAddNFRScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            location: null
        }
    }

    onClickAddLocation = () => {

        Actions.freightMapSearch({ onSelectLocation: (location) => this.callBackSelectLocation(location) })
    }

    callBackSelectLocation = (location) => {
        console.log("callBackSelectLocation location>>", location)
        this.setState({ location })
    }

    onClickSave = () => {
        const { location } = this.state;
        const { org, shipment } = this.props
        if (!location || !location._id) {
            AlertUtils.showError(messages.pleaseEnterFullfillElement)

            return
        }

        if (!shipment || !shipment.vehicleId) {
            AlertUtils.showError(messages.vehicleNotFound)

            return
        }

        const lastIndex = shipment.shipmentStopIds ? shipment.shipmentStopIds.length : 0

        const organizationId = org[0]._id
        const approvalRequired = true
        // shipmentID, locationId, approvalRequired, lastLocationIndex, vehicle

        Progress.show(API.addNFR, [shipment._id, location._id, approvalRequired, lastIndex, shipment.vehicleId._id, organizationId], (res) => {
            if (res && res.data) {
                this.props.refresh(eventTypes.REFRESH_TASK_LIST, _.now())
                AlertUtils.showSuccess(messages.addNFRSuccess)

                if (shipment.shipmentStatus === FreightConstant.SHIPMENT_STATUS.SHIPPING_COMPLETED) {
                    Actions.reset('drawer')
                } else {
                    Actions.pop()
                }
            }
        },
            (err) => {
            }, (hadleError) => {
                if (!hadleError || !hadleError.response || !hadleError.response.data || _.isEmpty(hadleError.response.data.message)) {
                    return false
                }
                alert(hadleError.response.data.message)

                return true;

            }
        )

    }


    renderRightView = () => {
        return <View style={{ flexDirection: 'row' }}>
            <ButtonText
                content={Localize(messages.save)}
                onClick={() => this.onClickSave()}
            />
        </View>
    }
    renderLocationSelect = () => {
        return <TouchableOpacity style={styles.slectFeeContainer} onPress={() => { this.onClickAddLocation() }}>

            <TextInput
                style={styles.inputContainer}
                pointerEvents="none"
                editable={false}
                autoCapitalize='none'
                autoCorrect={false}
                underlineColorAndroid='transparent'
                placeholder={Localize(messages.location)}
                placeholderTextColor={AppColors.textSecondary}
                value={this.state.location && this.state.location.fullName}
            />
            <Icon name='md-arrow-dropdown' size={16} />
        </TouchableOpacity>
    }
    render() {
        const { shipment } = this.props
        const { location } = this.state
        return (
            <View style={styles.container}>
                <HeaderDetail
                    rightView={this.renderRightView()}
                    title={Localize(messages.addNFR)}
                />

                {location && <View style={{ width: '100%', height: 200 }}>
                    <MapViewComponent
                        camera={{
                            center: location.coordinate,
                            pitch: 10,
                            heading: 10,
                            zoom: 15,
                            altitude: 18,
                        }}
                        allCoords={[location.coordinate]}
                        markerList={[<MarkerImage
                            coordinate={location.coordinate}

                            description={location.fullName}
                            title={location.fullName}
                            renderMarker={<SVGMarkerIndex />}

                        />]}
                    />
                </View>}
                <View style={styles.contentContainer}>
                    <InputField
                        title={messages.location}
                        renderContent={this.renderLocationSelect()} />

                </View>
            </View>

        );
    }
}

export default connect(state => ({
    org: state.org.orgSelect,

}), { refresh })(ShipmentAddNFRScreen);

