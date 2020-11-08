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
import { dateWithFormat, DATE_TIME_FORMAT, DATE_TIME_ISO_FORMAT } from '../../../utils/TimeUtils';
import AppSizes from '../../../theme/AppSizes';
import ShipmentListManager from '../ShipmentListManager';
import _ from 'lodash'
import FreightConstant from '../../freight/FreightConstant';
import DatePicker from 'react-native-datepicker';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import moment from 'moment';
import Progress from '../../../components/Progress';
import API from '../../../network/API';
import eventTypes from '../../../store/constant/eventTypes';
import { refresh } from '../../../store/actions/refresh'
import { connect } from 'react-redux';
import NotificationManager from '../../notification/NotificationManager';
import TaskHelper from '../../task/helper/TaskHelper';
import ShipmentControl from '../ShipmentControl';

class ShipmentBargeInfoView extends Component {


    keyExtractor = (item, index) => {
        if (!item.id) {
            return index.toString();
        }
        return item.id
    }

    onDateChange = (shipmentStop, date, index) => {
        const { shipmentDetail } = this.props

        if (!shipmentStop || !shipmentStop._id) {
            alert('Không xác định được stop bạn đang chọn!')
            return
        }
        const dateSelectMoment = moment(date, DATE_TIME_ISO_FORMAT)
        if (dateSelectMoment.isBefore(moment())) {
            NotificationManager.showMessageBar(Localize(messages.thisTimeIsInHistory), NotificationManager.messageType.ERROR, undefined)
            return
        }
        const dateData = dateSelectMoment.format('YYYY-MM-DD[T]HH:mm:ss+07:00')
        const shipmentId = shipmentDetail._id
        Progress.show(API.changeShipmentBargeETA, [shipmentStop._id, dateData, shipmentDetail.shipmentCode, shipmentId], (res) => {
            this.props.refresh(eventTypes.REFRESH_SHIPMENT_LIST, _.now())
            NotificationManager.showMessageBar(Localize(messages.requestEtaSuccess), undefined, undefined)

        })
    }

    getArrivalRawTime = (shipmentStop) => {
        const isHaveActualArrival = !!shipmentStop.actualArrival
        return isHaveActualArrival ? shipmentStop.actualArrival : shipmentStop.estimatedArrival ? shipmentStop.estimatedArrival : shipmentStop.plannedArrival

    }

    getDepartureRawTime = (shipmentStop) => {
        return shipmentStop.actualDeparture ? shipmentStop.actualDeparture : (shipmentStop.plannedDeparture ? shipmentStop.plannedDeparture : '')
    }

    isPossibleSelectTime = (shipmentStop, index, stopList) => {
        if (!!shipmentStop.actualArrival) {
            return false
        }

        if (index === 0) {
            return true
        }

        const taskDoneOfPreStop = stopList[index - 1].taskIds.filter(task => task.status === TaskHelper.status.COMPLETE)
        return taskDoneOfPreStop.length > 0
    }

    renderIconContentItem = (iconName, contentString, iconColor = AppColors.abi_blue, textColor = AppColors.textContent) => {
        return <View style={styles.iconContentContainer}>
            <Icon
                size={AppSizes.padding}
                name={iconName}
                color={iconColor}
            />
            <Text style={{ ...AppStyles.regularText, marginLeft: AppSizes.paddingTiny, color: textColor }}>{contentString}</Text>
        </View>

    }

    renderContainerInfo = (shipmentStop) => {
        const { shipmentDetail } = this.props

        const quantityContainer = ShipmentControl.getContainerQuantity(shipmentDetail, shipmentStop)
        if (shipmentStop.stopType === FreightConstant.SHIPMENT_STOP_TYPES.DROP) {
            return this.renderIconContentItem('publish', quantityContainer, AppColors.red, AppColors.red)

        }
        return this.renderIconContentItem('get-app', quantityContainer, AppColors.naviBlue, AppColors.naviBlue)
    }

    renderPlanTimeBarge = (content, shipmentStop, isPossibleSelectTime, index) => {
        return <View
            style={[styles.iconContentContainer,
            {
                borderWidth: AppSizes.paddingXXTiny,
                borderColor: shipmentStop && isPossibleSelectTime ? AppColors.hintText : 'white',
                paddingHorizontal: AppSizes.paddingXXSml,
                paddingVertical: AppSizes.paddingTiny,
                borderRadius: AppSizes.paddingXTiny
            }]}>
            <Icon
                size={AppSizes.padding}
                name={'alarm-on'}
                color={AppColors.hintText}
            />
            {shipmentStop && isPossibleSelectTime && <DatePicker
                date={moment(content, DATE_TIME_ISO_FORMAT)}
                mode="datetime"
                format={DATE_TIME_ISO_FORMAT}
                confirmBtnText={messages.ok}
                cancelBtnText={Localize(messages.cancel)}
                showIcon={false}
                onDateChange={(date) => this.onDateChange(shipmentStop, date, index)}
                customStyles={styles.customStylesDatePicker}
            />}
            {shipmentStop && shipmentStop.estimatedArrivalPendding && <Icon
                name={'timelapse'}
                color={AppColors.textContent}
                size={AppSizes.paddingLarge}
            />}
            {(!shipmentStop || !isPossibleSelectTime) && <Text style={{ ...AppStyles.regularText, marginLeft: AppSizes.paddingTiny, color: AppColors.hintText }}>{content}</Text>}
        </View>
    }

    renderSubContentStop = (shipmentStop, index) => {
        const { onDetail, onHistory, shipmentDetail } = this.props
        const isPossibleSelectTime = this.isPossibleSelectTime(shipmentStop, index, shipmentDetail.shipmentStopIds)
        // const isHaveActualArrival = !!shipmentStop.actualArrival
        const arrivalTimeRaw = this.getArrivalRawTime(shipmentStop)
        const arrivalTime = dateWithFormat(arrivalTimeRaw, DATE_TIME_ISO_FORMAT)


        const departureTimeRaw = this.getDepartureRawTime(shipmentStop)
        const departureTime = dateWithFormat(departureTimeRaw, DATE_TIME_ISO_FORMAT)

        if (onDetail) {
            return <View>
                {this.renderIconContentItem('alarm-on', arrivalTime, AppColors.hintText, AppColors.hintText)}
                {this.renderIconContentItem('call', shipmentStop && shipmentStop.customerId ? shipmentStop.customerId.mobileNumber : '', AppColors.hintText, AppColors.hintText)}

            </View>
        }

        if (onHistory) {
            return <View>
                {this.renderIconContentItem('alarm-on', arrivalTime, AppColors.hintText, AppColors.hintText)}
                {this.renderIconContentItem('alarm-on', departureTime, AppColors.hintText, AppColors.hintText)}

            </View>
        }

        return <View>
            {this.renderPlanTimeBarge(arrivalTime, shipmentStop, isPossibleSelectTime, index)}
            {this.renderPlanTimeBarge(departureTime)}

        </View>
    }
    renderShipmentStopItem = (shipmentStop, index) => {
        const { shipmentDetail, onDetail, onClickShipmentStop } = this.props
        const isNFR = shipmentDetail && shipmentDetail.bargeShipmentType === FreightConstant.SHIPMENT_BARGE_TYPE.NFR;
        return <View style={[styles.shipmentStopItemContainer,]}>
            <TouchableOpacity disabled={!onClickShipmentStop} onPress={() => onClickShipmentStop && onClickShipmentStop(shipmentStop, index)} style={{ ...styles.mainContent, backgroundColor: shipmentStop.isSelected ? 'white' : 'transparent', }}>
                <Text style={{ ...AppStyles.semiboldText, color: AppColors.textContent, fontSize: AppSizes.fontXXMedium }} numberOfLines={1}>{shipmentStop && shipmentStop.customerId ? shipmentStop.customerId.fullName : ''}</Text>
                {this.renderContainerInfo(shipmentStop)}

                {this.renderSubContentStop(shipmentStop, index)}
            </TouchableOpacity>
            {index + 1 !== shipmentDetail.shipmentStopIds.length && <View style={{ marginLeft: AppSizes.paddingXSml }}>
                {isNFR && <Text style={{ ...AppStyles.regularText, fontSize: AppSizes.fontSmall }}>{Localize(messages.nonFreight).toUpperCase()}</Text>}
                <Icon

                    size={AppSizes.paddingXXLarge * 1.5}
                    color={AppColors.abi_blue}
                    name={'trending-flat'}
                />
            </View>}



        </View>
    }



    render() {
        const { shipmentDetail, style } = this.props
        return (
            <FlatList
                style={style && style}
                renderItem={({ item, index }) => this.renderShipmentStopItem(item, index)}
                data={shipmentDetail.shipmentStopIds}
                keyExtractor={this.keyExtractor}
                horizontal={true}
                extraData={this.props}
                showsHorizontalScrollIndicator={false}
            />
        );
    }
}
export default connect(state => ({

}), { refresh })(ShipmentBargeInfoView);
const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
        backgroundColor: AppColors.lightGrayTrans
    },
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: AppSizes.paddingTiny,
        borderWidth: AppSizes.paddingXXTiny,
        borderColor: AppColors.lightgray,
    },
    mainContent: {
        padding: AppSizes.paddingTiny,
        minWidth: (AppSizes.screenWidth - 2 * AppSizes.paddingMedium - (AppSizes.paddingXXLarge * 1.5 + AppSizes.paddingXSml) * 3) / 4
    },
    shipmentStopItemContainer: {
        flexDirection: 'row',
        paddingHorizontal: AppSizes.paddingXSml,
        justifyContent: 'center',
        alignItems: 'center',

    },
    iconContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: AppSizes.paddingXSml,

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
        alignItems: 'center'
    },
    infoMainContainer: {

    },
    customStylesDatePicker: {
        dateInput: {
            borderWidth: 0,
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 0,
            margin: 0,
            marginLeft: AppSizes.paddingTiny,
        },
        dateText: {
            ...AppStyles.regularText,
            color: AppColors.hintText,
            width: 200

        },
        dateTouchBody: {
            height: AppSizes.paddingXMedium
        }
    },

}