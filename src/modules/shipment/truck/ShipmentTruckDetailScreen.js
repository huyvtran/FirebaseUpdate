import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Linking} from 'react-native';
import {connect} from 'react-redux';

import {Actions} from 'react-native-router-flux';

import {callOnce} from '../../../utils/callOnce';
import {Localize} from '../../setting/languages/LanguageManager';
import {dateToDDMM, dateToHHMM, dateWithFormat} from '../../../utils/TimeUtils';
import {loadTaskDetail, loadTaskImplementing} from "../../task/actions/creater/task";

import messages from '../../../constant/Messages';
import HeaderDetail from '../../../components/HeaderDetail';
import API from '../../../network/API';
import eventTypes from '../../../store/constant/eventTypes';
import AppColors from '../../../theme/AppColors';
import ButtonIcon from '../../../components/ButtonIcon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Divider from '../../form/components/Divider';
import AppStyles from '../../../theme/AppStyles';
import AwesomeListComponent from 'react-native-awesome-list';
import TaskImplementingManager from '../../../data/TaskImplementingManager';
import {HeaderSearchComponent} from '../../../components/HeaderSearchComponent';
import DashLines from '../../../components/DashLines';
import {ListRowTask} from '../../../components/index';
import Progress from '../../../components/Progress';
import {refresh} from '../../../store/actions/refresh';
import ErrorAbivinView from '../../../components/ErrorAbivinView';
import ActionButton from 'react-native-action-button';
import TaskHelper from '../../task/helper/TaskHelper';
import _ from 'lodash';
import ShipmentControl from '../ShipmentControl';
import ShipmentListManager from '../ShipmentListManager';
import StringUtils from '../../../utils/StringUtils';
import FreightConstant from '../../freight/FreightConstant';
import AppSizes from '../../../theme/AppSizes';
import TaskCode from '../../../constant/TaskCode';
import ShipmentStopItem from '../ShipmentStopItem';
import OrgHelper from '../../../utils/OrgUtils';
import AlertUtils from '../../../utils/AlertUtils';


class ShipmentTruckDetailScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchMode: false,
            shipmentDetail: props.taskDetail
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.event && (nextProps.event.types === eventTypes.REFRESH_TASK_LIST || nextProps.event.types === eventTypes.REFRESH_SHIPMENT_LIST)) {
            if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
                this.getShipmentDetail();
            }
        }
    }

    getShipmentDetail() {
        const {shipmentDetail} = this.state;

        Progress.show(API.shipmentDetail, [shipmentDetail._id], res => {
            if (res && res.data && res.data.shipments && res.data.shipments[0]) {
                const shipmentDetailParam = ShipmentControl.transformShipmentFromServer(res.data.shipments[0]);
                this.setState({shipmentDetail: shipmentDetailParam}, () => {
                    this.subShipmentTaskList.refresh();
                });
            } else {
                AlertUtils.showError(messages.canNotLoadShipmentDetail);
            }
        });
    }

    source = () => {
        return Promise.resolve(this.state.shipmentDetail.shipmentStopIds);
    };

    listRowRender = (item) => {

        return (
            <ListRowTask
                status={item.status}
                onPress={callOnce(() => this.taskItemPress(item), 1000)}
                subject={item.subject}
                // i3={item.taskAction && (item.taskAction.taskActionCode === TaskCode.SHIPPING_STARTED || item.taskAction.taskActionCode === TaskCode.SHIPPING_COMPLETED) ? null : item.location.fullName}
                startAndDueDate={`${dateToDDMM(item.startAt)}-${dateToDDMM(item.dueDate)}`}
                hourStart={dateToHHMM(item.startAt)}
                hourEnd={dateToHHMM(item.dueDate)}
            />
        );
    };

    taskItemPress(item) {
        const {shipmentDetail} = this.state;

        Actions.taskDetail({
            item,
            selectedDate: this.props.selectedDate,
            index: 0,
            shipmentId: shipmentDetail._id
        });

    }

    transformer(res) {
        return res;
    }

    keyExtractor = (item) => item._id;

    onChangeSearchText = _.debounce((text) => {
        if (_.isEmpty(text)) {
            this.subShipmentTaskList.removeFilter();
            return;
        }
        this.subShipmentTaskList.applyFilter((item, index) => {
            return item.subject.toLowerCase()
                .includes(text.toLowerCase());
        });

    }, 300);

    onClickRequestShipment = () => {
        const {shipmentDetail} = this.state;
        Progress.show(API.requestShipment, [shipmentDetail._id, this.props.user._id], (res) => {
            if (res && res.data && res.data.shipments) {
                AlertUtils.showSuccess(messages.requestShipmentSuccess);
                const shipmentParams = ShipmentControl.transformShipmentFromServer(res.data.shipments[0]);
                this.setState({shipmentDetail: shipmentParams}, () => {
                    this.props.refresh(eventTypes.REFRESH_SHIPMENT_LIST, _.now());
                    this.subShipmentTaskList.refresh();
                });

            }
        }, (err) => {
        }, (hadleError) => {
            alert(hadleError.response.data.message);
            return true;

        });
    };

    onCLickAddNFR = () => {
        Actions.shipmentAddNFR({shipment: this.state.shipmentDetail});
    };

    onClickAddChargeFee = () => {
        const {shipmentDetail} = this.state;

        Actions.shipmentAddFee({shipment: shipmentDetail});
        return;

    };

    isAssignedShipment() {
        const {shipmentDetail} = this.state;
        return shipmentDetail && (
            (shipmentDetail.assignedTo && shipmentDetail.assignedTo.length > 0) ||
            shipmentDetail.shipmentStatus === FreightConstant.SHIPMENT_STATUS.SHIPPING_COMPLETED ||
            shipmentDetail.shipmentStatus === FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED);
    }

    isVisibleAddChargeFee = () => {
        return false;
        const {shipmentDetail} = this.state;

        if (shipmentDetail && shipmentDetail.shipmentStatus === FreightConstant.SHIPMENT_STATUS.SHIPPING_COMPLETED) {
            return true;
        }

        if (shipmentDetail && shipmentDetail.shipmentStatus === FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED) {
            return true;
        }

        return false;
    };

    isVisibleActionButton = () => {
        return this.isVisibleAddChargeFee() || this.isVisibleAddNFR();
    };

    isVisibleAddNFR = () => {
        const {shipmentDetail} = this.state;

        if (!shipmentDetail || !shipmentDetail.taskIds || shipmentDetail.taskIds.length === 0) {
            return false;
        }

        if (shipmentDetail.shipmentStatus === FreightConstant.SHIPMENT_STATUS.SHIPPING_COMPLETED) {
            return ShipmentControl.isShipmentLastUpdate(shipmentDetail, ShipmentListManager.shipmentList);
        }

        if (this.isNotRemainShippingStarted(shipmentDetail.taskIds)) {
            return false;
        }
        return true;
    };


    isNotRemainShippingStarted = (listTask) => {
        if (listTask.length < 3) {
            return true;
        }
        return listTask[listTask.length - 3].status !== TaskHelper.status.COMPLETE;
    };

    getContainerListFollowStopType = (shipmentStopIds, stopType) => {
        let containerIdList = [];
        const shipmentPick = shipmentStopIds.filter(stop => {
            return stop.stopType === stopType;
        });
        shipmentPick.forEach(shipment => {
            containerIdList = containerIdList.concat(shipment.containerIds);
        });
        return containerIdList;
    };

    getStringContainerPick = (shipment) => {
        const containerIdList = this.getContainerListFollowStopType(shipment.shipmentStopIds, FreightConstant.SHIPMENT_STOP_TYPES.PICK);
        let containerString = '';

        containerIdList.forEach((containId, index) => {
            if (index !== 0 && !_.isEmpty(containerString)) {
                containerString += ',';
            }
            containerString += containId.containerNumber;
        });

        return containerString;
    };

    getStringContainerDrop = (shipment) => {
        const containerIdList = this.getContainerListFollowStopType(shipment.shipmentStopIds, FreightConstant.SHIPMENT_STOP_TYPES.DROP);
        let containerString = '';

        containerIdList.forEach((containId, index) => {
            if (index !== 0 && !_.isEmpty(containerString)) {
                containerString += ',';
            }
            containerString += containId.containerNumber;
        });

        return containerString;
    };

    getShipmentVehile = (shipment) => {
        let vehicleString = '';
        if (shipment.vehicleId) {
            vehicleString += shipment.vehicleId.vehicleCode;
        }
        if (shipment.vehicleId && shipment.vehicleId.vehicleInternalCode) {
            vehicleString += ' (' + shipment.vehicleId.vehicleInternalCode + ') ';
        }

        return vehicleString;
    };

    getTrailerDetail = (shipment) => {

        let trailerInfo = '';

        if (!shipment.trailerId) {
            return trailerInfo;
        }
        if (shipment.trailerId.trailerCode) {
            trailerInfo += shipment.trailerId.trailerCode;
        }

        if (shipment.trailerId.trailerInitialCode) {
            trailerInfo += ' (' + shipment.trailerId.trailerInitialCode + ')';
        }
        return trailerInfo;
    };

    renderHeaderTitle() {
        const {shipmentDetail} = this.state;
        if (!shipmentDetail) {
            return <View/>;
        }
        if (this.state.searchMode) {
            return <HeaderSearchComponent
                onChangeText={(text) => this.onChangeSearchText(text)}
                onPressCloseSearch={() => {
                    this.setState({searchMode: false}, () => {
                        this.subShipmentTaskList.removeFilter();
                    });
                }}
            />;
        } else {
            return null;
        }

    }

    renderInfoContent(title, content, alignItems = 'flex-start') {
        return <View style={{
            flex: 1,
            alignItems
        }}>
            <Text style={styles.textHeaderTitle} numberOfLines={1}>{title}</Text>
            <Text style={[styles.textSecond,]} numberOfLines={1}
                  ellipsizeMode={'head'}>{content}</Text>
        </View>;
    }

    renderIconText = (iconName, content, color = AppColors.textSubContent, onPress) => {
        return <TouchableOpacity disabled={!onPress} onPress={onPress && onPress} style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: AppSizes.paddingTiny,
        }}>
            <Icon
                name={iconName}
                size={AppSizes.paddingMedium}
                color={color}
            />
            <Text style={[styles.textSecond, {
                marginTop: 0,
                paddingLeft: AppSizes.paddingTiny,
                color
            }]} numberOfLines={1}>{content}</Text>
        </TouchableOpacity>;
    };

    renderTaskParentView() {
        const {shipmentDetail} = this.state;
        if (!shipmentDetail || !shipmentDetail.departure || !shipmentDetail.departure.departureCode || !shipmentDetail.arrival || !shipmentDetail.arrival.arrivalCode) {
            return <View/>;
        }
        const containerPickString = this.getStringContainerPick(shipmentDetail);
        const containerDropString = this.getStringContainerDrop(shipmentDetail);

        return <View style={styles.containerTaskParent}>
            <View style={styles.containerSourceView}>
                <View style={styles.iconHeaderContainer}>
                    <Icon
                        name={'donut-large'}
                        size={20}
                        color={AppColors.abi_blue}/>
                    {/* <View style={{ width: 1, height: '100%', backgroundColor: 'red' }} /> */}
                    <DashLines width={1} height={80} dashLength={4} dashGap={8}/>
                </View>
                <View style={styles.contentHeaderContainer}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <Text style={styles.textHeaderTitle}
                              numberOfLines={1}>{shipmentDetail.departure.departureCode}</Text>
                        <Text style={[styles.textSecond, {
                            textAlign: 'right',
                            marginTop: 0
                        }]}
                              numberOfLines={1}>{dateWithFormat(shipmentDetail.departure.departureTime, 'DD/MM/YY | HH:mm')}</Text>
                    </View>
                    <Text style={[styles.textSecond, {marginTop: AppSizes.paddingXSml}]}
                          numberOfLines={1}>{
                        shipmentDetail && shipmentDetail.departure &&
                        shipmentDetail.departure ?
                            shipmentDetail.departure.departureFullName : ''
                    }</Text>
                    <View style={{marginTop: AppSizes.paddingXSml,}}>
                        {this.renderIconText('publish', containerPickString)}
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: AppSizes.paddingXSml
                    }}>
                        {!_.isEmpty(shipmentDetail.departure.departureId.title) && this.renderIconText('account-circle', shipmentDetail.departure.departureId.title)}
                        {!_.isEmpty(shipmentDetail.departure.departureId.mobileNumber) && this.renderIconText('local-phone', shipmentDetail.departure.departureId.mobileNumber, AppColors.abi_blue, () => {
                            Linking.openURL(`tel:${shipmentDetail.departure.mobileNumber}`);
                        })}
                    </View>

                </View>
            </View>

            <View style={styles.containerSourceView}>
                <View style={styles.iconHeaderContainer}>
                    <Icon
                        name={'flag'}
                        size={20}
                        color={AppColors.abi_blue}/>
                </View>
                <View style={styles.contentHeaderContainer}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingRight: AppSizes.paddingTiny
                    }}>
                        <Text style={styles.textHeaderTitle}
                              numberOfLines={1}>{shipmentDetail.arrival.arrivalCode}</Text>
                        <Text style={[styles.textSecond, {
                            textAlign: 'right',
                            marginTop: 0
                        }]}
                              numberOfLines={1}>{dateWithFormat(shipmentDetail.arrival.arrivalTime, 'DD/MM/YY | HH:mm')}</Text>

                    </View>
                    <Text style={[styles.textSecond, {marginTop: AppSizes.paddingXSml}]}
                          numberOfLines={1}>{
                        shipmentDetail && shipmentDetail.arrival &&
                        shipmentDetail.arrival ?
                            shipmentDetail.arrival.arrivalFullName : ''
                    }</Text>
                    <View style={{marginTop: AppSizes.paddingXSml}}>
                        {this.renderIconText('get-app', containerDropString)}

                    </View>
                </View>
            </View>
            <View style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Divider style={{width: AppSizes.screenWidth - 32}}/>
            </View>
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                justifyContent: 'space-between',
                paddingVertical: 16
            }}>
                {this.renderInfoContent(
                    Localize(messages.vehicle),
                    this.getShipmentVehile(shipmentDetail),
                    'flex-start')}
                {this.renderInfoContent(Localize(messages.trailer), this.getTrailerDetail(shipmentDetail), 'center')}
                {this.renderInfoContent(Localize(messages.stopPoint), shipmentDetail.shipmentStopIds ? shipmentDetail.shipmentStopIds.length : 0, 'flex-end')}
            </View>
        </View>;
    }

    renderRightView() {
        return <View style={{flexDirection: 'row'}}>
            <ButtonIcon
                onPress={() => {
                    Actions.shipmentViewFee({shipment: this.state.shipmentDetail});
                }}
                iconColor={'white'}
                source={require('../../../assets/icon/iconChargeList.png')}
            />
            <ButtonIcon
                iconName={'map'}
                iconSize={AppSizes.paddingXXLarge}
                onPress={() => {
                    Actions.shipmentViewLocation({shipment: this.state.shipmentDetail});
                }}
                iconColor={'white'}
            />


        </View>;
    }

    renderRequestShipmentButton() {
        if (this.isAssignedShipment()) {
            return null;
        }
        return <TouchableOpacity style={styles.shipmentRequestButton} onPress={() => {
            this.onClickRequestShipment();
        }}>
            <Text style={styles.requestText}>{Localize(messages.request)
                .toString()
                .toUpperCase()}</Text>
        </TouchableOpacity>;
    }

    renderStatusShipment = () => {
        const {shipmentDetail} = this.state;

        if (shipmentDetail.nfr && shipmentDetail.nfr.isRequesting) {
            return <View style={styles.statusContainer}>
                <Text style={styles.statusBarText}
                      numberOfLines={1}>{Localize(messages.checkingCurrentLocation)}</Text>
            </View>;
        }

        return <View/>;

    };

    renderShipmentStopItem = ({item}) => {

        return <ShipmentStopItem
            shipmentStop={item}
            taskItemPress={(item) => this.taskItemPress(item)}
        />;

    };

    render() {
        const {shipmentDetail} = this.state;

        return (
            <View style={{
                flex: 1,
                width: '100%',
                height: '100%'
            }}>
                <HeaderDetail
                    leftButtonAction={() => !this.state.searchMode ? Actions.pop() : this.setState({searchMode: false}, () => this.subShipmentTaskList.removeFilter())}
                    contentView={this.renderHeaderTitle()}
                    rightView={this.renderRightView()}
                    title={shipmentDetail.shipmentCode}
                    subTitle={ShipmentControl.getTypeOfShipment(shipmentDetail.movePerspective)}
                />
                {this.renderStatusShipment()}

                <AwesomeListComponent
                    containerStyle={[styles.containerTaskList, {marginBottom: this.isAssignedShipment() ? 0 : AppSizes.paddingMedium * 2}]}
                    ref={ref => this.subShipmentTaskList = ref}
                    source={() => this.source()}
                    transformer={(response) => this.transformer(response)}
                    renderItem={(item) => this.renderShipmentStopItem(item)}
                    keyExtractor={(item) => this.keyExtractor(item)}
                    listHeaderComponent={this.renderTaskParentView()}
                    emptyText={Localize(messages.noResult)}
                    renderErrorView={() => <ErrorAbivinView
                        onPressRetry={() => this.subShipmentTaskList.onRetry()}/>}

                />
                {this.renderRequestShipmentButton()}

                {this.isVisibleActionButton() &&
                <ActionButton size={AppSizes.paddingXXLarge * 2} buttonColor={AppColors.orange}
                              offsetY={60}>

                    {this.isVisibleAddNFR() && <ActionButton.Item size={AppSizes.paddingXXLarge * 2}
                                                                  buttonColor={AppColors.orange}
                                                                  title={Localize(messages.addNFR)}
                                                                  onPress={() => this.onCLickAddNFR()}>
                        <Icon name="shopping-basket" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>}

                    {this.isVisibleAddChargeFee() &&
                    <ActionButton.Item size={AppSizes.paddingXXLarge * 2}
                                       buttonColor={AppColors.orange}
                                       title={Localize(messages.newChargeFee)}
                                       onPress={() => this.onClickAddChargeFee()}>
                        <Icon name="create" style={styles.actionButtonIcon}/>
                    </ActionButton.Item>}

                </ActionButton>}


            </View>
        );
    }
}

const styles = StyleSheet.create({
    textHeaderTitle: {
        fontSize: AppSizes.fontXXMedium,
        backgroundColor: 'transparent',
        color: AppColors.abi_blue,
        flex: 1
        // width: '100%',
    },
    containerTaskParent: {
        // backgroundColor: '#3b79ba',
        backgroundColor: 'white',
        width: '100%',
        paddingTop: AppSizes.paddingXSml,
        paddingBottom: AppSizes.paddingXSml,

        borderColor: AppColors.gray,
        borderWidth: 1
    },
    iconHeaderContainer: {
        flex: 2,
        alignItems: 'center',
    },
    contentHeaderContainer: {
        flex: 10,
        width: '100%',
        marginBottom: AppSizes.paddingXSml
    },
    containerSourceView: {
        flexDirection: 'row',
        paddingRight: AppSizes.paddingMedium
    },
    textSecond: {
        ...AppStyles.regularText,
        color: AppColors.textSubContent,
        marginTop: AppSizes.paddingTiny,
        fontSize: AppSizes.fontBase
    },

    containerInfoSection: {
        flexDirection: 'row',
        flex: 1,
        marginTop: AppSizes.paddingXMedium
    },
    textInput: {
        flex: 1,
        fontSize: AppSizes.fontBase,
        backgroundColor: 'white',
        padding: 0,
        color: AppColors.textContent,
        paddingLeft: AppSizes.paddingXSml,
        paddingRight: AppSizes.paddingXSml,
        borderRadius: AppSizes.paddingTiny,
        width: AppSizes.screenWidth - AppSizes.paddingXSml * 10,
        margin: AppSizes.paddingXSml
    },
    shipmentRequestButton: {
        width: '100%',
        position: 'absolute',
        backgroundColor: AppColors.abi_blue,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: AppSizes.paddingXXMedium
    },
    requestText: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
        color: 'white'
    },
    containerTaskList: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },
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

});
export default connect(state => ({
    task: state.task,
    event: state.refresh.event,
    locale: state.i18n.locale,
    org: state.org.orgSelect,
    orgConfig: state.user.orgConfig,
    user: state.user.user,

}), {
    loadTaskDetail,
    loadTaskImplementing,
    refresh
})(ShipmentTruckDetailScreen);
