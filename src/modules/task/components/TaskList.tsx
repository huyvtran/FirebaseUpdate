import _ from "lodash";
import Moment from "moment";
import React from 'react';
import { PureComponent } from 'react';
import {
  ActivityIndicator, Alert, FlatList,
  SectionList, TouchableOpacity,
  View
} from "react-native";
import ActionButton from "react-native-action-button";
import { AwesomeListMode, EmptyView } from "react-native-awesome-list";
import DatePicker from "react-native-datepicker";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import TestID from "../../../../test/constant/TestID";
import ErrorAbivinView from "../../../components/ErrorAbivinView";
import HeaderView from "../../../components/HeaderView";
import { ListRowTask } from "../../../components/index";
import SectionsHeaderText from "../../../components/SectionsHeaderText";
import messages from "../../../constant/Messages";
import OrderInfo from "../../../constant/OrderInfo";
import TaskCode from "../../../constant/TaskCode";
import API from "../../../network/API";
import eventsType from "../../../store/constant/eventTypes";
import AppColors from "../../../theme/AppColors";
import AppSizes from "../../../theme/AppSizes";
import AppStyles from "../../../theme/AppStyles";
import AlertUtils from "../../../utils/AlertUtils";
import OrgHelper from "../../../utils/OrgUtils";
import { dateToDDMM, dateToHHMM } from "../../../utils/TimeUtils";
import { resetForm } from "../../form/actions/creater/form";
import OrderTotal from "../../orders/components/OrderTotal";
import { Localize } from "../../setting/languages/LanguageManager";
import { loadTask, loadTaskDetail, loadTaskImplementing } from "../actions/creater/task";
import {
  getContentSecondRowTaskItem,
  getDisableValueTask, hasSubTasks,
  isDepotTMSTasks,
  isTMSTasks,
  totalFulfillmentStatus
} from "../helper/FunctionHelper";
import TaskHelper from "../helper/TaskHelper";
import { ITask, ITaskList } from "../../../network/tasks/TaskListModel";
import TaskMapView from "./TaskMapView";
import { ICheckMoveTaskResponse } from "../../../network/router/ICheckMoveTask";
import { IResponse } from "../../../network/IResponse";
import moment from "moment";
import { AbstractTaskProps, AbstractTaskStates } from "../helper/AbstractTaskProps";
import Messages from "../../../constant/Messages";
import Toast from "../../../components/Toast";

const styles = {
  headerConainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: AppColors.abi_blue,
    paddingHorizontal: AppSizes.paddingXXMedium,
    height: AppSizes.padding * 2,
  },
  actionButtonIcon: {
    fontSize: AppSizes.fontMedium,
    height: AppSizes.paddingXLarge,
    color: "white",
  },
  customStylesDatePicker: {
    dateInput: {
      borderWidth: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    dateText: {
      ...AppStyles.regularText,
      fontSize: AppSizes.fontXXMedium,
      color: "white",
      fontWeight: "500",
    },
  },
};

interface Props extends AbstractTaskProps {
  isLoadingTasksError: any,
  locale: any,
  loadTask: (now) => void,
  resetForm: () => void
}

interface States extends AbstractTaskStates {
  actions: any[],
  text: string,
  //thời gian lựa chọn
  endDate: moment.Moment,

  active: boolean,

  toggleMap: boolean,

  refreshTracking: boolean,

  //trạng thái có hiện thị chức năng move task trên header hay không
  displayArrange:boolean
}

// Main Component
class TaskList extends PureComponent<Props, States> {
  taskActionList: string[];
  listToArrange: any[];
  constructor(props) {
    super(props);
    this.state = {
      actions: [],
      text: "",
      //endDate: new Moment("20200908", "YYYYMMDD"),
      endDate: Moment(),
      active: false,
      toggleMap: false,
      loading: false,
      refreshTracking: false,
      displayArrange:false
    };
    this.taskActionList = ["DYNAMIC_FORM", "SOAN_HANG", "GIAO_HANG"];
    this.listToArrange = [];

    console.log("TaskList orgConfig>> ", this.props.orgConfig);
  }

  componentDidMount = () => {
    // console.log("TaskList componentDidMount types>> ");
    this.props.loadTask(Moment());


    //kiểm tra mô hình, nếu PDP thì cũng ko được hiện thị
    if(this.props.orgConfig.configurations.longhaul){
      this.setState({ displayArrange: false});
      return;
    }

    // console.log("TaskList checkMoveTask this.props.org[0].algoConfig>> ", this.props.org[0].algoConfig);
    //lấy trạng thái movetask
    API.checkMoveTask(this.props.org[0]._id)
    .then((res:IResponse<ICheckMoveTaskResponse>) => {
      // console.log("TaskList checkMoveTask data>> ", res.data);
      this.setState({ displayArrange: res.data.status||false});
      // this.setState({ displayArrange: true});
    })
    .catch(err => {
      // console.log("TaskList checkMoveTask error>> ", err);
      this.setState({ displayArrange: false });
    });
  };


  makeAPITaskList = (intanceAxios, url, body) => {
    return intanceAxios.post(url, body);
  };

  componentWillReceiveProps = nextProps => {
    // refresh task list when receive prop refresh
     
    if (nextProps && nextProps.event && nextProps.event.types === eventsType.REFRESH_TASK_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        console.log("TaskList componentWillReceiveProps onRefresh>> ");
        this.onRefresh();
      }
    }
  };

  onRefresh = _.debounce(() => {
    // console.log("TaskList onRefresh>> ");
    this.props.loadTask(this.state.endDate);
  }, 300);

  onDateChange(date) {
    const date1 = date.split("/");
    const endDate = Moment(`${date1[2]}-${date1[1]}-${date1[0]}`);
    this.setState({
      endDate,
    });
    this.props.loadTask(endDate);
  }

  /**
   * with tasks have subTask => navigate to SubTaskList screen before navigating to task detail.
   * with tasks have no subTask => navigate to task detail.
   */

  taskItemPress = _.throttle((item, index) => {
    if (item.isDisabled) {
      AlertUtils.showWarning(messages.thisTaskIsDisable);
      return;
    }
    if (hasSubTasks(item)) {
      Actions.subTaskList({
        taskDetail: item,
        selectedDate: this.state.endDate,
      });
      return;
    }

    Actions.taskDetail({
      item,
      selectedDate: this.state.endDate,
      index,
    });
  }, 200, { trailing: false });

  onClickAddTask() {
    this.setState({ loading: true });
    const routeDetailId = this.props.task.data[0].routeDetailId;
    API.createExtraTask(routeDetailId)
      .then(res => {
        this.setState({ loading: false });

        if (res.data) {
          const task = res.data;
          Actions.taskDetail({
            item: task,
            isAddNewTask: true,
          });
        }
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  onPageLayout = () => {

  };

  taskActionFormCheck(taskActionIds) {
    const taskActionCode = taskActionIds[0].taskActionCode;
    return this.taskActionList.indexOf(taskActionCode) > 0;
  }

  listRowRender = ({ item, index }) => {
    const taskActionsName = item?.taskAction?.taskActionName ?? "";
    const taskActionCode = item?.taskAction?.taskActionCode ?? "";
    return (
      <ListRowTask
        testID={TestID.taskItemView + taskActionCode + index}
        key={item ? item._id : index}
        status={item.status}
        onPress={() => this.taskItemPress(item, index)}
        subject={item.subject}
        address={item.contentSecondRow}
        startAndDueDate={`${dateToDDMM(item.startDate)}-${dateToDDMM(item.dueDate)} -- ${taskActionsName}`}
        hourStart={dateToHHMM(item.startDate)}
        hourEnd={dateToHHMM(item.dueDate)}
        fulfillmentStatusIconColor={item.fulfillmentStatusIconColor}
      />
    );
  };
  keyExtractor = item => item._id;

  changeDate(dnumber) {
    const tDate = this.state.endDate;
    const endDate = Moment(tDate)
      .add(dnumber, "days");
    this.setState({
      endDate,
    });
    this.props.loadTask(endDate);
    this.props.resetForm();
  }

  onSelectOrg() {
    this.props.loadTask(this.state.endDate);
  }

  getEmptyViewMode() {
    const taskData = this.props.task;
    if (taskData.data && taskData.data.length === 0 && this.props.isLoadingTasksError) {
      return AwesomeListMode.ERROR;
    } else if (taskData.data && taskData.data.length === 0 && !taskData.loading && !this.props.isLoadingTasksError) {
      return AwesomeListMode.EMPTY;
    } else if (taskData && taskData.loading) {
      return AwesomeListMode.PROGRESS;
    } else {
      return AwesomeListMode.HIDDEN;
    }
  }

  /**
   * value return depend on OrgHelper.shouldCreateExtraTask()
   * beside it, user can't create extra task if :
   * + that day, user doesn't have any tasks
   * + user have not commplete loading task
   * + user completed the end task.
   * + if this trip is long haul(this trip doesn't has endtask),get the last ta
   */
  isVisibleCreateTaskExtra() {
    const listTask = this.props.task.data;
    if (!listTask || listTask.length === 0) {
      return false;
    }

    const deliveryTask = listTask[0];

    if (!deliveryTask || deliveryTask.status !== TaskHelper.status.COMPLETE) {
      return false;
    }

    return OrgHelper.shouldCreateExtraTask();
  }

  calculateSections(taskList) {
    let sections = [];
    const sectionGroup = [];
    _.forEach(_.groupBy(taskList, task => {
      return task.routeDetailId;
    }), (value, key) => {
      sectionGroup.push(value);
    });
    sections = sectionGroup.map((secGroup, index) => {
      return {
        title: `${Localize(messages.trip)} ${index + 1}`,
        data: secGroup,
      };
    });

    return sections;
  }

  

  /**
   * Kiểm tra hàm có nhiều trip hay không
   * @param taskList 
   */
  isMultipleTrips(taskList:ITask[]) {
    const routeIdFail = _.findIndex(taskList, task => {
      return _.isEmpty(task.routeDetailId);
    });

    if (routeIdFail >= 0) {
      return false;
    }

    const trips = _.groupBy(taskList, task => {
      return task.routeDetailId;
    });

    return Object.keys(trips).length > 1;
  }

  transformTaskList(taskListBefore) {
    const isTMSTask = isTMSTasks(taskListBefore);
    const isDepotTMSTask = isDepotTMSTasks(taskListBefore);
    const { user } = this.props;
    return _.map(taskListBefore, taskItem => {
      return {
        ...taskItem,
        contentSecondRow: getContentSecondRowTaskItem(isTMSTask, isDepotTMSTask, taskItem),
        fulfillmentStatusIconColor: this.getFulfillmentStatusIconColor(taskItem),
        isDisabled: getDisableValueTask(taskItem, user),
      };
    });
  }

  getFulfillmentStatusIconColor = taskItem => {
    if (this.props.orgConfig.configurations.longhaul) {
      return null;
    }
    return OrderInfo.FULFILLMENT_STATUS_COLOR[totalFulfillmentStatus(taskItem.orderList !== undefined ? taskItem.orderList : null)];
  };

  renderLoadingTaskList() {
    console.log("TaskList renderLoadingTaskList>> ");
    return (<View style={{
      height: "100%",
      width: "100%",
      backgroundColor: AppColors.graytrans,
      justifyContent: "center",
      alignItems: "center",
    }}
            >
      <ActivityIndicator />
    </View>);
  }

/**
     * kiểm tra task soạn hàng
     */
    private isSoanHang = (taskAfterTransform) => {

      //nếu không có task nào thì bỏ qua
      if(!taskAfterTransform) return false;

      let itask = taskAfterTransform[0];

      //nếu ko có task nào
      if(!itask || !itask.taskActionIds) return false;

      let actionIds = itask.taskActionIds[0];

      if(!actionIds) return false;

      return actionIds.taskActionCode === TaskCode.SOAN_HANG;
  }

  dataView = () => {
    const taskAfterTransform = this.transformTaskList(this.props.task.data);
    this.listToArrange = taskAfterTransform;
    // console.log("TaskList this.props.task.data=>", this.props.task.data);
    return (
      <View style={{ flex: 1 }}>
        {
          this.isSoanHang(taskAfterTransform) &&
          <OrderTotal
            taskList={this.props.task.data}
          />
        }


        {this.isMultipleTrips(taskAfterTransform) ?
          <SectionList
            renderItem={this.listRowRender}
            renderSectionHeader={({ section: { title } }) => <SectionsHeaderText title={title} />}
            sections={this.calculateSections(taskAfterTransform)}
            keyExtractor={this.keyExtractor}
            refreshing={this.props.task.loading}
            onRefresh={this.onRefresh}
          />
          :
          <FlatList
            testID={TestID.taskListView}
            style={{ backgroundColor: "white" }}
            data={taskAfterTransform}
            renderItem={this.listRowRender}
            keyExtractor={this.keyExtractor}
            refreshing={false}
            onRefresh={this.onRefresh}
            removeClippedSubviews={false}
            legacyImplementation={true}
          />
        }


        <EmptyView
          renderProgress={() => this.renderLoadingTaskList()}
          mode={this.getEmptyViewMode()}
          retry={() => {
            console.log("TaskList EmptyView retry>> ");
            this.onRefresh();
          }}
          emptyText={Localize(messages.emptyTextTask)}
          renderErrorView={() => {
            return <ErrorAbivinView onPressRetry={() => this.onRefresh()} />;
          }}
        />

        {this.isVisibleCreateTaskExtra() && <ActionButton buttonColor={AppColors.orange}>
          <ActionButton.Item buttonColor={AppColors.orange} title={Localize(messages.newTask)}
            onPress={() => this.onClickAddTask()}
          >
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>

        </ActionButton>}
      </View>

    );
  };

  render() {
    const dateFormat = Moment(this.state.endDate)
      .format("DD-MM-YYYY");

    return (
      <View style={{ flex: 1 }}>
        <HeaderView
          displayMapView={true}
          displayAvatar={true}
          onPressMap={() => this.setState({ toggleMap: !this.state.toggleMap })}
          onSelect={() => {
            this.onSelectOrg();
          }}
          displayArrange={this.state.displayArrange}
          onPressArrange={() => {

            // if(!this.listToArrange || this.listToArrange.length == 0){
            //   Alert.alert(Localize(messages.emptyTextTask));
            //   return;
            // }

            Actions.taskListArrange({
              date: this.state.endDate,
              list: this.listToArrange,
            });
          }}
        />

        <View style={styles.headerConainer}>
          <TouchableOpacity
            testID={TestID.datePreButton}
            style={{ width: AppSizes.paddingSml * 6 }}
            onPress={() => this.changeDate(-1)}
          >

            <Icon name="ios-arrow-back" size={AppSizes.paddingXXLarge}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <DatePicker
            style={{ alignItems: "center" }}
            customStyles={styles.customStylesDatePicker}
            date={dateFormat}
            mode="date"
            placeholder={Localize(Messages.selectDate)}
            format="DD/MM/YYYY"
            confirmBtnText={Localize(Messages.button.confirmBtn)}
            cancelBtnText={Localize(Messages.button.cancelBtn)}
            showIcon={false}
            onDateChange={date => this.onDateChange(date)}
          />
          <TouchableOpacity
            testID={TestID.dateNextButton}
            style={{
              width: AppSizes.paddingSml * 6,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
            onPress={() => this.changeDate(+1)}
          >
            <Icon name="ios-arrow-forward" size={AppSizes.paddingXXLarge}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {
          this.state.toggleMap ? <TaskMapView
            endDate={this.state.endDate}
          /> : this.dataView()
        }
        {this.state.loading && <ActivityIndicator color={AppColors.abi_blue} style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: AppColors.lightGrayTrans,
        }}
          size="small"
        />}
      </View>
    );
  }
}

export default connect(state => ({
  event: state.refresh.event,
  task: state.task,
  org: state.org.orgSelect,
  isLoadingTasksError: state.task.isLoadingTasksError,
  locale: state.i18n.locale,
  orgConfig: state.user.orgConfig,
  user: state.user.user,
}), {
  resetForm,
  loadTask,
  loadTaskDetail,
  loadTaskImplementing,
})(TaskList);
