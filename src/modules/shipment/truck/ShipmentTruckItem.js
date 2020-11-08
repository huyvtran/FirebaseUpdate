import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import AppColors from '../../../theme/AppColors';
import AppStyles from '../../../theme/AppStyles';
import { Actions } from 'react-native-router-flux';
import { H1, H2 } from '../../../theme/styled';
import { Icon } from 'react-native-elements'
import ProgressLine from '../../../components/ProgressLine';
import Divider from '../../form/components/Divider';
import { dateWithFormat } from '../../../utils/TimeUtils';
import TaskHelper from '../../task/helper/TaskHelper';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import AppSizes from '../../../theme/AppSizes';
import ShipmentListManager from '../ShipmentListManager';
import ShipmentControl from '../ShipmentControl';
import _ from 'lodash'
import FreightConstant from '../../freight/FreightConstant';
const bookmarkIcon = require("../../../assets/icon/iconBookmark.png")
const bookmarkOutlineIcon = require("../../../assets/icon/iconBookmarkOutline.png")
class ShipmentTruckItem extends Component {

    calculateProgressShipment() {
        const { shipmentTask } = this.props
        if (!shipmentTask.taskIds || shipmentTask.taskIds.length === 0) {
            return 0
        }
        const completeTask = shipmentTask.taskIds.filter(task => {
            return task.status === TaskHelper.status.COMPLETE
        })
        return (completeTask.length / shipmentTask.taskIds.length) * 100
    }

    renderSourceDesInfo(title, time, alignItems) {
        return <View style={{ flex: 1, alignItems }}>
            <Text
                style={[H1,]}
                numberOfLines={1}
                ellipsizeMode='tail' >{title}</Text>
            <Text style={[H2, { marginTop: AppSizes.paddingTiny }]}>{time}</Text>
        </View>
    }

    renderSourceDesView() {
        const { shipmentTask } = this.props
        return <View style={styles.sourceDesContainer}>
            {this.renderSourceDesInfo(shipmentTask.departure.departureCode, dateWithFormat(shipmentTask.departure.departureTime, 'DD/MM/YY | HH:mm'), 'flex-start')}
            <Icon
                name={'arrow-forward'}
                size={AppSizes.paddingMedium * 2}
                color={AppColors.abi_blue}
            />
            {this.renderSourceDesInfo(shipmentTask.arrival.arrivalCode, dateWithFormat(shipmentTask.arrival.arrivalTime, 'DD/MM/YY | HH:mm'), 'flex-end')}

        </View>
    }

    renderProgressTask() {
        const progress = this.calculateProgressShipment()
        const { shipmentTask } = this.props;
        const statusString = Localize(ShipmentControl.getStatusShipmentString(shipmentTask.shipmentStatus))
        return <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: AppSizes.paddingXSml }}>
            <Text style={{ ...H2, fontStyle: 'italic', color: AppColors.textSubContent }}>{statusString}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: AppSizes.screenWidth - AppSizes.paddingMedium * 2 }}>
                <Icon
                    name={'adjust'}
                    size={AppSizes.paddingXXLarge}
                    color={AppColors.abi_blue}
                />
                <View style={{ width: AppSizes.screenWidth - AppSizes.paddingMedium * 2 - AppSizes.paddingXXLarge * 2 - AppSizes.paddingXSml * 2, marginHorizontal: AppSizes.paddingXSml }}>
                    <ProgressLine progress={progress} />
                </View>

                <Icon
                    name={'adjust'}
                    size={AppSizes.paddingXXLarge}
                    color={AppColors.abi_blue}
                />
            </View>
            <View style={{ width: AppSizes.screenWidth - AppSizes.paddingMedium * 2, marginTop: AppSizes.paddingXSml }}>
                <Divider />

            </View>
        </View>
    }

    getContainerWeight(containerList) {
        let grossWieghtTotal = 0
        containerList.forEach(container => {
            if (container.grossWeight && container.grossWeight > 0) {
                grossWieghtTotal += container.grossWeight;

            }
        })
        return grossWieghtTotal
    }

    onCLickShipmentItem() {
        const { shipmentTask } = this.props
        ShipmentListManager.saveShimentSelected(shipmentTask)
        Actions.shipmentRoadDetail({ taskDetail: shipmentTask, selectedDate: _.now() })
    }

    isShowApprovedStatusFee = () => {
        const { shipmentTask } = this.props
        return shipmentTask && shipmentTask.feeStatus && shipmentTask.feeStatus === FreightConstant.FEE_SHIPMENT_STATUS.APPROVED
    }

    renderFooterItem() {
        const { shipmentTask } = this.props
        let containerIdString = ''
        shipmentTask.containerIds.forEach((container, index) => {
            if (index !== 0 && !_.isEmpty(containerIdString)) {
                containerIdString += ',';
            }
            containerIdString += container.containerNumber
        })
        const containerType = _.join(shipmentTask.containerIds.map(shipment => shipment.containerType.containerLength), ', ')
        return <View style={{ paddingVertical: AppSizes.paddingXSml }}>
            {this.renderFooterInfo('Cont', containerIdString)}
            {this.renderFooterInfo(Localize(messages.bookingOrBOL), shipmentTask.bookingOrBOL)}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {this.renderFooterInfo(Localize(messages.containerType), containerType)}
                {this.renderFooterInfo(Localize(messages.grossWeight), this.getContainerWeight(shipmentTask.containerIds))}
                {this.renderFooterInfo(Localize(messages.numberOfContainer), shipmentTask.containerIds.length)}

            </View>
        </View>

    }
    renderFooterInfo(title, content, alignItems = 'flex-start') {
        return <View style={{ flex: 1, alignItems, flexDirection: 'row', marginTop: AppSizes.paddingXSml }}>
            <Text style={{ ...H2, }} numberOfLines={1}>
                {title + ': '}
            </Text>

            <Text style={{ ...H2, color: AppColors.abi_blue, flex: 1 }} numberOfLines={1} ellipsizeMode={'head'}>
                {content}
            </Text>
        </View>
    }
    render() {
        const { shipmentTask } = this.props
        const iconFeeStatus = this.isShowApprovedStatusFee() ? bookmarkIcon : bookmarkOutlineIcon
        return (
            <TouchableOpacity style={styles.container} onPress={() => this.onCLickShipmentItem()}>
                <Text style={[H1, { color: AppColors.textSecondary }]}>{shipmentTask.shipmentCode + ' (' + ShipmentControl.getTypeOfShipment(shipmentTask.movePerspective) + ')'}</Text>
                <Divider style={{ marginTop: AppSizes.paddingXXSml, marginBottom: AppSizes.paddingXXSml }} />
                {this.renderSourceDesView()}
                {this.renderProgressTask()}
                {this.renderFooterItem()}


                <Image
                    style={styles.feeStatusContainer}
                    // resizeMode={'contain'}
                    source={iconFeeStatus}
                />
            </TouchableOpacity>

        );
    }
}
export default ShipmentTruckItem

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
        margin: AppSizes.paddingXSml,
        borderRadius: AppSizes.paddingXXSml,
        borderWidth: 0.5,
        borderColor: AppColors.grayLight
    },
    sourceDesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    feeStatusContainer: {
        position: 'absolute',
        top: 0,
        right: AppSizes.paddingLarge,
        padding: 0,
        margin: 0,
        height: AppSizes.paddingXXXLarge,
        width: AppSizes.paddingLarge
    }
}