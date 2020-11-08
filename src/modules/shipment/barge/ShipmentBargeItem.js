import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';
import AppColors from '../../../theme/AppColors';
import AppStyles from '../../../theme/AppStyles';
import { Actions } from 'react-native-router-flux';
import { H1, H2 } from '../../../theme/styled';
import { Icon } from 'react-native-elements'
import { dateWithFormat, SIMPLE_DATE_TIME_FULL_FORMAT } from '../../../utils/TimeUtils';
import AppSizes from '../../../theme/AppSizes';
import ShipmentListManager from '../ShipmentListManager';
import _ from 'lodash'
import ShipmentBargeInfoView from './ShipmentBargeInfoView';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import FreightConstant from '../../freight/FreightConstant';

class ShipmentBargeItem extends Component {


    onCLickShipmentItem() {
        const { shipmentTask } = this.props
        ShipmentListManager.saveShimentSelected(shipmentTask)
        Actions.shipmentBargeDetail({ taskDetail: shipmentTask, selectedDate: _.now() })
    }


    render() {
        const { shipmentTask } = this.props
        return (
            <View style={styles.container} >
                <View style={styles.mainContainer}>
                    <ShipmentBargeInfoView
                        style={{ paddingHorizontal: AppSizes.paddingXSml, width: AppSizes.screenWidth - AppSizes.paddingMedium * 2 - AppSizes.paddingXSml * 2 }}
                        shipmentDetail={shipmentTask}
                        onHistory={shipmentTask.shipmentStatus === FreightConstant.SHIPMENT_STATUS.SHIPPING_COMPLETED}
                    />

                    <View style={styles.shipmentInfoContent}>
                        <View style={styles.infoMainContainer}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={styles.noteText} >{Localize(messages.note).toUpperCase()}</Text>
                            </View>
                            <View style={{ width: '80%' }}>
                                <Text style={{ ...AppStyles.regularText, color: AppColors.textTitle, }} numberOfLines={2} >{shipmentTask.shipmentNote}</Text>
                            </View>

                        </View>
                        <TouchableOpacity style={styles.detailShipmentTextContainer} onPress={() => this.onCLickShipmentItem()}>
                            <Text style={{ ...H1, fontSize: AppSizes.fontXXMedium, marginHorizontal: AppSizes.paddingXSml, color: AppColors.textTitle }}>{Localize(messages.detail)}</Text>
                            <Icon
                                color={AppColors.textTitle}
                                name={'keyboard-arrow-right'}
                                size={AppSizes.paddingXXLarge}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
export default ShipmentBargeItem

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingTiny,
        backgroundColor: AppColors.lightGrayTrans,
    },
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: AppSizes.paddingTiny,
        borderWidth: AppSizes.paddingXXTiny,
        borderColor: AppColors.lightgray,
        paddingVertical: AppSizes.paddingXSml
    },
    shipmentStopItemContainer: {
        flexDirection: 'row',
        padding: AppSizes.paddingXSml,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: AppSizes.paddingTiny
    },
    shipmentInfoContent: {
        flexDirection: 'row',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
        justifyContent: 'space-between',
        borderTopWidth: AppSizes.paddingXXTiny,
        borderColor: AppColors.darkgraytrans,
        // backgroundColor: AppColors.darkgraytrans,
    },
    detailShipmentTextContainer: {
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3
    },
    infoMainContainer: {
        flexDirection: 'row',
        flex: 7,
        alignItems: 'center',
    },
    noteText: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
        color: AppColors.hintText,
        marginHorizontal: AppSizes.paddingSml,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingVeritical: AppSizes.paddingMedium,
        justifyContent: 'center',
        alignItems: 'center'
    }

}