import _ from 'lodash';
import Moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    View
} from 'react-native';
import ActionButton from 'react-native-action-button';
import AwesomeListComponent from 'react-native-awesome-list';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import ErrorAbivinView from '../../../components/ErrorAbivinView';
import HeaderView from '../../../components/HeaderView';
import { ListRowTask } from '../../../components/index';
import Progress from '../../../components/Progress';
import messages from '../../../constant/Messages';
import OrderInfo from '../../../constant/OrderInfo';
import API from '../../../network/API';
import eventsType from '../../../store/constant/eventTypes';
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import OrgHelper from '../../../utils/OrgUtils';
import { dateToDDMM, dateToHHMM } from '../../../utils/TimeUtils';
import { resetForm } from "../../form/actions/creater/form";
import TrackLocationManager from '../../locations/TrackLocationManager';
import OrderTotal from '../../orders/components/OrderTotal';
import OrderHelper from '../../orders/helpers/OrderHelper';
import { Localize } from '../../setting/languages/LanguageManager';
import { fetchTaskList, fetchTaskOrders, loadTask, loadTaskDetail, loadTaskImplementing } from "../actions/creater/task";
import { getContentSecondRowTaskItem, hasSubTasks, isTMSTasks, isValidateStartTrackLocation, totalFulfillmentStatus } from '../helper/FunctionHelper';
import TaskHelper from '../helper/TaskHelper';
import TaskMapView from './TaskMapView';



const Profiler = React.unstable_Profiler;

const styles = {
    headerConainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: AppColors.abi_blue,
        paddingHorizontal: AppSizes.paddingXXMedium,
        height: AppSizes.padding * 2,
    },
    actionButtonIcon: {
        fontSize: AppSizes.fontMedium,
        height: AppSizes.paddingXLarge,
        color: 'white',
    },
    customStylesDatePicker: {
        dateInput: {
            borderWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },
        dateText: {
            ...AppStyles.regularText,
            fontSize: AppSizes.fontXXMedium,
            color: 'white',
            fontWeight: '500',
        },
    },

}
const TaskListScreen = (props) => {
    const [endDate, setEndDate] = useState(new Date)
    const [toggleMap, setToggleMap] = useState(false)
    const [taskListData, setTaskListData] = useState([])
    const [firstTime, setFirstTime] = useState(true)
    const [event, setEvent] = useState(props.event)

    /****************************************************************STATE CONTROL ************************************************ */
    useEffect(() => {
        //save to redux
        props.fetchTaskList(taskListData)
        //Load order list
        getOrderData(taskListData)

        //check tracking
        if (isValidateStartTrackLocation(taskListData, endDate)) {
            TrackLocationManager.trackLocation()
        }
    }, [taskListData])

    useEffect(() => {
        if (firstTime) {
            setFirstTime(false)
            return
        }
        refreshTaskList()

    }, [endDate])

    useEffect(() => {
        if (firstTime) {
            return
        }
        if (props && props.event && props.event.types === eventsType.REFRESH_TASK_LIST) {
            if (!event || event.timeUnix != props.event.timeUnix) {
                taskAwesomwList.refresh()
                refreshTaskList()
            }
        }
    }, [props.event])
    /****************************************************************LOGIC CONTROL ************************************************ */
    async function getOrderData(taskList) {
        if (!taskListData || taskListData.length == 0) {
            return;

        }
        const orderIds = OrderHelper.getOrderIdFromTask(taskList);
        if (!orderIds || orderIds.length === 0) {
            return;
        }
        const { orgConfig } = props

        const orderResponse = await API.orderListFromOrderIds(orderIds, orgConfig.configurations.longhaul)
        if (orderResponse && orderResponse.data && orderResponse.data.data && orderResponse.data.data.length > 0) {
            props.fetchTaskOrders(orderResponse.data.data)
        }
    }

    const getFulfillmentStatusIconColor = (taskItem) => {
        if (props.orgConfig.configurations.longhaul) {
            return null
        }
        return OrderInfo.FULFILLMENT_STATUS_COLOR[totalFulfillmentStatus(taskItem.orderList !== undefined ? taskItem.orderList : null)]
    }

    /****************************************************************UI CONTROL ************************************************ */
    const refreshTaskList = _.debounce(() => {
        taskAwesomwList.refresh()
        props.resetForm();
    }, 500)

    const source = () => {
        const { org } = props
        return API.getTaskList(endDate, org[0]._id)
    }

    const transformer = (res) => {
        const taskListRaw = res.data.data
        const isTMSTask = isTMSTasks(taskListRaw);
        const transformedTaskList = _.map(taskListRaw, (taskItem) => {
            return {
                ...taskItem,
                contentSecondRow: getContentSecondRowTaskItem(isTMSTask, taskItem),
                fulfillmentStatusIconColor: getFulfillmentStatusIconColor(taskItem)
            }
        })

        setTaskListData(transformedTaskList)

        return transformedTaskList
    }

    const taskItemPress = _.throttle((item, index) => {
        if (hasSubTasks(item)) {
            Actions.subTaskList({ taskDetail: item, selectedDate: endDate });
            return;
        }

        Actions.taskDetail({ item, selectedDate: endDate, index });

    }, 200, { 'trailing': false })

    const isVisibleCreateTaskExtra = () => {
        if (!taskListData || taskListData.length === 0) {
            return false
        }

        const firstTask = taskListData[0]

        if (!firstTask || firstTask.status !== TaskHelper.status.COMPLETE) {
            return false
        }

        return OrgHelper.shouldCreateExtraTask()
    }

    function onClickAddTask() {
        const routeDetailId = taskListData[0].routeDetailId

        Progress.show(API.createExtraTask, [routeDetailId], res => {
            if (res.data) {
                const task = res.data;
                Actions.taskDetail({ item: task, isAddNewTask: true });
            }
        })
    }

    const changeDate = (dnumber) => {
        const endDateParams = Moment(endDate).add(dnumber, 'days');
        setEndDate(endDateParams)
    }


    const onDateChange = (date) => {
        const dateParams = date.split('/');
        const endDateParams = Moment(`${dateParams[2]}-${dateParams[1]}-${dateParams[0]}`);
        setEndDate(endDateParams)
    }

    const keyExtractor = (item) => item._id

    const onPageLayout = () => {

    }


    const logProfile = (id, phase, actualTime, baseTime, startTime, commitTime) => {
        console.log(`${id}'s ${phase} phase:`);
        console.log(`Actual time: ${actualTime}`);
        console.log(`Base time: ${baseTime}`);
        console.log(`Start time: ${startTime}`);
        console.log(`Commit time: ${commitTime}`);
    };
    /****************************************************************UI RENDER ************************************************ */
    const renderItem = (item, index) => {
        return (<ListRowTask
            status={item.status}
            onPress={() => taskItemPress(item, index)}
            subject={item.subject}
            address={item.contentSecondRow}
            startAndDueDate={`${dateToDDMM(item.startDate)}-${dateToDDMM(item.dueDate)}`}
            hourStart={dateToHHMM(item.startDate)}
            hourEnd={dateToHHMM(item.dueDate)}
            fulfillmentStatusIconColor={item.fulfillmentStatusIconColor}
        />
        )
    }
    const renderDataView = () => {


        return (
            <View style={{ flex: 1 }}>
                <OrderTotal
                    taskList={taskListData}
                />

                <AwesomeListComponent
                    ref={ref => taskAwesomwList = ref}
                    source={() => source()}
                    transformer={(response) => transformer(response)}
                    renderItem={({ item, index }) => renderItem(item, index)}
                    keyExtractor={(item) => keyExtractor(item)}
                    emptyText={Localize(messages.emptyTextTask)}
                    renderErrorView={() => <ErrorAbivinView onPressRetry={() => taskAwesomwList.onRetry()} />}
                />

                {isVisibleCreateTaskExtra() && <ActionButton buttonColor={AppColors.orange}>
                    <ActionButton.Item buttonColor={AppColors.orange} title={Localize(messages.newTask)} onPress={() => onClickAddTask()}>
                        <Icon name="md-create" style={styles.actionButtonIcon} />
                    </ActionButton.Item>

                </ActionButton>}
            </View>

        )
    }

    return <Profiler id={(new Date()).getTime()} onRender={logProfile}>
        <View style={{ flex: 1, }}>
            <HeaderView
                displayMapView
                displayAvatar
                onPressMap={() => setToggleMap(!toggleMap)}
            />

            <View style={styles.headerConainer}>
                <TouchableOpacity
                    style={{ width: AppSizes.paddingSml * 6 }}
                    onPress={() => changeDate(-1)}
                >

                    <Icon name='ios-arrow-back' size={AppSizes.paddingXXLarge} color='#FFFFFF' />
                </TouchableOpacity>
                <DatePicker
                    style={{ alignItems: 'center' }}
                    customStyles={styles.customStylesDatePicker}
                    date={Moment(endDate).format('DD-MM-YYYY')}
                    mode="date"
                    placeholder="select date"
                    format="DD/MM/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    onDateChange={(date) => onDateChange(date)}
                />
                <TouchableOpacity
                    style={{ width: AppSizes.paddingSml * 6, justifyContent: 'flex-end', alignItems: 'flex-end' }}
                    onPress={() => changeDate(+1)}
                >
                    <Icon name='ios-arrow-forward' size={AppSizes.paddingXXLarge} color='#FFFFFF' />
                </TouchableOpacity>
            </View>

            {
                toggleMap ? <TaskMapView endDate={endDate} /> : renderDataView()
            }
        </View >
    </Profiler>

}

export default connect(state => ({
    event: state.refresh.event,
    task: state.task,
    org: state.org.orgSelect,
    isLoadingTasksError: state.task.isLoadingTasksError,
    locale: state.i18n.locale,
    orgConfig: state.user.orgConfig,
}), { resetForm, loadTask, loadTaskDetail, loadTaskImplementing, fetchTaskList, fetchTaskOrders })(TaskListScreen);