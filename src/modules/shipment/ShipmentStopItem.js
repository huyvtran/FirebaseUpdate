import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity, View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { ListRowTask } from '../../components';
import messages from '../../constant/Messages';
import AppColors from '../../theme/AppColors';
import AppSizes from '../../theme/AppSizes';
import AppStyles from '../../theme/AppStyles';
import { dateToDDMM, dateToHHMM } from '../../utils/TimeUtils';
import FreightConstant from '../freight/FreightConstant';
import { Localize } from '../setting/languages/LanguageManager';
import TaskHelper from '../task/helper/TaskHelper';
class ShipmentStopItem extends Component {
    handleTaskViewRef = ref => this.taskView = ref;

    constructor(props) {
        super(props)
        this.state = {
            isShowTaskList: props.isParentControl ? this.getDefaultShowFromParent(props.shipmentStop) : this.getDefaultShowOffTaskList(props.shipmentStop ? props.shipmentStop.taskIds : [])
        }
    }

    getDefaultShowFromParent = (shipmentStop) => {
        return shipmentStop.isSelected
    }

    getDefaultShowOffTaskList = (taskIds) => {
        const notCompletedTasks = taskIds.filter(task => task.status !== TaskHelper.status.COMPLETE)
        if (notCompletedTasks && notCompletedTasks.length > 0) {
            return true
        }
        return false
    }

    getShipmentStopName = (shipmentStop) => {
        if (shipmentStop.stopType === FreightConstant.SHIPMENT_STOP_TYPES.NOT_FREIGHT_RELATED) {
            return Localize(messages.nfr) + ' - ' + shipmentStop.customerId.fullName
        }
        return shipmentStop.customerId.fullName
    }

    listRowRender = (item) => {
        const { taskItemPress } = this.props
        return (
            <ListRowTask
                status={item.status}
                onPress={() => taskItemPress(item)}
                subject={item.subject}
                startAndDueDate={`${dateToDDMM(item.startAt)}-${dateToDDMM(item.dueDate)}`}
                hourStart={dateToHHMM(item.startAt)}
                hourEnd={dateToHHMM(item.lastUpdatedAt)}
            />
        )
    }
    render() {
        const { shipmentStop } = this.props
        const { isShowTaskList } = this.state

        return <View style={styles.shipmentStopContainer}>
            <TouchableOpacity style={styles.headerStopContainer} onPress={() => {
                this.setState({ isShowTaskList: !isShowTaskList })
            }}>
                <Text style={styles.shipmentStopName}>{this.getShipmentStopName(shipmentStop)}</Text>
                {/* <Divider style={{ backgroundColor: AppColors.abi_blue, width: AppSizes.screenWidth - AppSizes.fontXXMedium - AppSizes.paddingXXSml * 2 - AppSizes.paddingMedium * 2 - AppSizes.paddingXXLarge * 2 }} /> */}
                <View style={styles.iconArrowContainer}>
                    <Icon
                        name={isShowTaskList ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
                        color={AppColors.white}
                        size={AppSizes.paddingXLarge}
                    />
                </View>


            </TouchableOpacity>
            <View ref={this.handleTaskViewRef} >
                {isShowTaskList && shipmentStop.taskIds.map(task => {
                    const taskResult = {
                        ...task,
                        location: shipmentStop.customerId
                    }
                    return this.listRowRender(taskResult)
                })}
            </View>
        </View>
    }
}
export default ShipmentStopItem

const styles = {
    shipmentStopContainer: {
        width: '100%'
    },
    headerStopContainer: {
        flexDirection: 'row',
        paddingHorizontal: AppSizes.paddingMedium,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.naviBlue,
        borderBottomWidth: AppSizes.paddingMicro,
        borderTopWidth: AppSizes.paddingMicro,
        borderColor: AppColors.grayLight
    },
    shipmentStopName: {
        ...AppStyles.regularText,
        color: AppColors.white,
        fontSize: AppSizes.fontXXMedium,
        margin: AppSizes.paddingXXSml,
        flex: 1
    },
    iconArrowContainer: {
        height: AppSizes.paddingXXLarge,
        width: AppSizes.paddingXXLarge,
        borderRadius: AppSizes.paddingXXLarge,
        borderWidth: AppSizes.paddingXXTiny,
        borderColor: AppColors.white,
        justifyContent: 'center',
        alignItems: 'center',
        margin: AppSizes.paddingSml
    }
}