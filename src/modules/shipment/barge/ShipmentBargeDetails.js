import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import eventTypes from '../../../store/constant/eventTypes';
import Progress from '../../../components/Progress';
import API from '../../../network/API';
import ShipmentControl from '../ShipmentControl';
import TaskHelper from '../../task/helper/TaskHelper';
import AppSizes from '../../../theme/AppSizes';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import HeaderDetail from '../../../components/HeaderDetail';
import AppStyles from '../../../theme/AppStyles';
import AppColors from '../../../theme/AppColors';
import ButtonIcon from '../../../components/ButtonIcon';
import ShipmentBargeInfoView from './ShipmentBargeInfoView';
import ShipmentBargeListTask from './ShipmentBargeListTask';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ShipmentBargeBayMap from './ShipmentBargeBayMap';
import ShipmentBargeContainer from './ShipmentBargeContainer';
import OrgHelper from '../../../utils/OrgUtils';
import _ from 'lodash'
import ActionButton from 'react-native-action-button';
import { loadTaskDetail, loadTaskImplementing } from "../../task/actions/creater/task";
import { refresh } from '../../../store/actions/refresh'
import Snackbar from '../../../components/Snackbar';
import AlertUtils from '../../../utils/AlertUtils';

class ShipmentBargeDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shipmentDetail: this.transfromSelectedShipment(props.taskDetail),
            tabList: [
                { key: messages.stopList, iconName: 'location-on', content: Localize(messages.stopList), selected: true },
                { key: messages.container, iconName: 'list', content: Localize(messages.container), selected: false },
                { key: messages.containerBargeMap, iconName: 'device-hub', content: Localize(messages.containerBargeMap), selected: false },
            ],

            containerNote: {
                content: "",
                title: "",
                visible: false
            }
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.event && (nextProps.event.types === eventTypes.REFRESH_TASK_LIST || nextProps.event.types === eventTypes.REFRESH_SHIPMENT_LIST)) {
            if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
                this.getShipmentDetail()
            }
        }
    }

    transfromSelectedShipment = (shipmentDetail) => {
        const indexSelectedParam = this.findIndexStopDoing(shipmentDetail)
        return {
            ...shipmentDetail,
            shipmentStopIds: shipmentDetail.shipmentStopIds.map((shipmentStop, index) => {
                return {
                    ...shipmentStop,
                    isSelected: index === indexSelectedParam
                }

            })
        }
    }

    findIndexStopDoing = (shipmentDetail) => {
        let index = _.findIndex(shipmentDetail.shipmentStopIds, stop => {
            const taskCompleteds = stop.taskIds.filter(task => task.status === TaskHelper.status.COMPLETE)
            return (taskCompleteds.length >= 0 && taskCompleteds.length < stop.taskIds.length)
        });
        return index === -1 ? 0 : index
    }

    getShipmentDetail() {
        const { shipmentDetail } = this.state
        const typeShipment = OrgHelper.getShipmentType()

        Progress.show(API.shipmentDetail, [shipmentDetail._id, typeShipment], res => {
            if (res && res.data && res.data.shipments && res.data.shipments[0]) {
                const shipmentDetailParam = ShipmentControl.transformShipmentFromServer(res.data.shipments[0])
                const shipmentTransformSelect = this.transfromSelectedShipment(shipmentDetailParam)
                this.setState({ shipmentDetail: shipmentTransformSelect })
            } else {
                AlertUtils.showWarning(messages.canNotLoadShipmentDetail)

            }
        })
    }

    onClickChangeMainContent = (key) => {
        const selectedItem = this.state.tabList.find(tab => tab.selected)
        if (selectedItem.key === key) {
            return;
        }
        const tabResult = this.state.tabList.map(tab => {
            if (tab.key === key) {
                return {
                    ...tab, selected: true
                }
            }
            return {
                ...tab, selected: false
            }
        })
        this.setState({
            tabList: tabResult
        })
    }

    onClickShipmentStop = (shipmentStop, index) => {
        const { shipmentDetail } = this.state
        const shipmentDetailParams = {
            ...shipmentDetail,
            shipmentStopIds: shipmentDetail.shipmentStopIds.map((shipmentStop, indexParam) => {

                return {
                    ...shipmentStop,
                    isSelected: index === indexParam
                }

            })
        }

        this.setState({ shipmentDetail: shipmentDetailParams })
    }

    isVisibleCreateOtherTask = () => {
        const { shipmentDetail } = this.state

        if (shipmentDetail && ShipmentControl.isShipmentStarted(shipmentDetail.shipmentStatus)) {
            return true
        }

        return false
    }


    onClickAddOtherTask = () => {
        const { shipmentDetail } = this.state
        const indexStopDoing = this.findIndexStopDoing(shipmentDetail)
        const stopDoing = shipmentDetail.shipmentStopIds[indexStopDoing]
        const orgSelectId = this.props.org[0].id
        Progress.show(API.createOtherTaskShipment, [stopDoing._id, [orgSelectId]], (res) => {
            if (res.data && res.data.task) {
                const { task } = res.data;
                Actions.taskDetail({ item: task, isAddNewTask: true });

            }
        })
    }


    renderRightView() {
        return <View style={{ flexDirection: 'row' }}>


            <ButtonIcon
                iconName={'map'}
                iconSize={AppSizes.paddingXXLarge}
                onPress={() => { Actions.shipmentViewLocation({ shipment: this.state.shipmentDetail }) }}
                iconColor={'white'}
            />

            <ButtonIcon
                iconName={'restore'}
                iconSize={AppSizes.paddingXXLarge}
                onPress={() => { Actions.shipmentViewFee({ shipment: this.state.shipmentDetail }) }}
                iconColor={'white'}
            />
        </View>
    }

    renderShipmentInfo = () => {
        const { shipmentDetail } = this.state

        return <View >
            <ShipmentBargeInfoView
                style={{ paddingHorizontal: AppSizes.paddingMedium, backgroundColor: '#C2DEFC', paddingVertical: AppSizes.paddingXSml }}
                shipmentDetail={shipmentDetail}
                onDetail
                onClickShipmentStop={(shipmentStop, index) => this.onClickShipmentStop(shipmentStop, index)}
            />
        </View>
    }

    renderMainContent = () => {
        const { shipmentDetail } = this.state
        if (!shipmentDetail || !shipmentDetail._id) {
            return <View />
        }
        const tabSelected = this.state.tabList.find(tab => tab.selected)
        switch (tabSelected.key) {
            case messages.stopList:
                return <ShipmentBargeListTask
                    shipment={shipmentDetail}
                />
            case messages.container:
                return <ShipmentBargeContainer
                    shipment={shipmentDetail}
                    openNoteView={(containerCode, noteContent) => this.setState({ containerNote: { title: containerCode, content: noteContent, visible: true } })}
                />
            case messages.containerBargeMap:
                return <ShipmentBargeBayMap
                    shipment={shipmentDetail}
                />
            default:
                return <ShipmentBargeListTask
                    shipment={shipmentDetail} />
        }
    }

    renderTabBar = () => {
        return <View style={{ height: AppSizes.paddingLarge * 2, flexDirection: 'row', width: '100%' }}>
            {this.state.tabList.map(tab => this.renderTabItem(tab))}
        </View>
    }

    renderTabItem = (tabItem) => {
        const { content, key, selected, iconName } = tabItem
        return <TouchableOpacity
            style={[styles.tabBarItemContainer, { borderBottomWidth: selected ? AppSizes.paddingXTiny : AppSizes.paddingMicro, borderColor: selected ? AppColors.orange : AppColors.lightgray }]}
            onPress={() => this.onClickChangeMainContent(key)}
        >
            <Icon
                size={AppSizes.paddingLarge}
                color={AppColors.textContent}
                name={iconName}
            />
            <Text style={{ ...AppStyles.regularText, marginLeft: AppSizes.paddingTiny, color: AppColors.textContent }} numberOfLines={1}>{content}</Text>
        </TouchableOpacity>
    }

    renderNoteView = () => {
        const { shipmentDetail } = this.state

        return <View style={styles.noteContainer}>
            <View style={{ justifyContent: 'center' }}>
                <Text style={styles.noteText} >{Localize(messages.note).toUpperCase()}</Text>
            </View>
            <View style={{ width: '80%' }}>
                <Text style={{ ...AppStyles.regularText, color: AppColors.textTitle, }} numberOfLines={2} >{shipmentDetail.shipmentNote}</Text>
            </View>
        </View>
    }

    render() {
        const { shipmentDetail, containerNote } = this.state

        return (
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
                <HeaderDetail
                    title={shipmentDetail.shipmentCode}
                    subTitle={ShipmentControl.getTypeOfShipment(shipmentDetail.orderType)}
                    rightView={this.renderRightView()}
                />
                <ScrollView>
                    {this.renderShipmentInfo()}
                    {this.renderNoteView()}
                    {this.renderTabBar()}
                    {this.renderMainContent()}

                </ScrollView>
                <Snackbar
                    label={Localize(messages.note)}
                    title={containerNote.title}
                    content={containerNote.content}
                    visible={containerNote.visible} onRequestClose={() => this.setState({ containerNote: { visible: false, content: "", title: '' } })} />

                {/* {this.isVisibleCreateOtherTask() && <ActionButton size={AppSizes.paddingXXLarge * 2} buttonColor={AppColors.orange} offsetY={60}>

                    <ActionButton.Item size={AppSizes.paddingXXLarge * 2} buttonColor={AppColors.orange} title={Localize(messages.createOtherTask)} onPress={() => this.onClickAddOtherTask()}>
                        <Icon name="create" style={styles.actionButtonIcon} color={'white'} />
                    </ActionButton.Item>

                </ActionButton>} */}


            </View>
        );
    }
}

const styles = {

    actionButtonIcon: {
        fontSize: AppSizes.fontXXLarge,
        height: AppSizes.paddingXLarge,
        color: 'white',
    },

    statusContainer: {
        backgroundColor: 'rgba(3,154,227, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: AppSizes.paddingTiny,
        paddingHorizontal: AppSizes.paddingMedium,
        width: '100%'
    },
    statusBarText: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontSmall,
        color: AppColors.abi_blue,
    },
    tabBarItemContainer: {
        flex: 1,

        backgroundColor: 'white',
        paddingVertical: AppSizes.paddingXSml,
        paddingHorizontal: AppSizes.paddingTiny,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    noteContainer: {
        width: '100%',
        paddingHorizontal: AppSizes.paddingMedium,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: AppSizes.paddingSml
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
export default connect(state => ({
    task: state.task,
    event: state.refresh.event,
    locale: state.i18n.locale,
    org: state.org.orgSelect,
    orgConfig: state.user.orgConfig,
    user: state.user.user,

}), { loadTaskDetail, refresh })(ShipmentBargeDetail);
