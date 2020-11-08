import _ from "lodash";
import Moment from "moment";
import React from 'react';
import { Component } from 'react';
import {
  ActivityIndicator,
  Alert, FlatList,
  LayoutAnimation,
  Platform, SectionList,
  Text, TouchableOpacity,
  UIManager, View
} from "react-native";
import { AwesomeListMode, EmptyView } from "react-native-awesome-list";
import DatePicker from "react-native-datepicker";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import TestID from "../../../../test/constant/TestID";
import ErrorAbivinView from "../../../components/ErrorAbivinView";
import HeaderView from "../../../components/HeaderView";
import Progress from "../../../components/Progress";
import messages from "../../../constant/Messages";
import OrderInfo from "../../../constant/OrderInfo";
import TaskCode from "../../../constant/TaskCode";
import API from "../../../network/API";
import AppColors from "../../../theme/AppColors";
import AppSizes from "../../../theme/AppSizes";
import AppStyles from "../../../theme/AppStyles";
import { dateToDDMM, dateToHHMM } from "../../../utils/TimeUtils";
import { resetForm } from "../../form/actions/creater/form";
import OrderTotal from "../../orders/components/OrderTotal";
import { Localize, LocalizeReplace } from "../../setting/languages/LanguageManager";
import {
  loadTask,
  loadTaskDetail,
  loadTaskImplementing
} from "../actions/creater/task";
import {
  getContentSecondRowTaskItem,
  getDisableValueTask, isDepotTMSTasks,
  isTMSTasks,


  totalFulfillmentStatus
} from "../helper/FunctionHelper";
import { ITask, TaskStatus } from "../../../network/tasks/TaskListModel";
import { ListArrangeRow } from "./ListArrangeRow";
import { MoveTaskResponseMessage } from "../../../network/router/IMoveTask";
import Toast from "../../../components/Toast";
import { AbstractTaskProps, AbstractTaskStates } from "../helper/AbstractTaskProps";
import Messages from "../../../constant/Messages";

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
      fontWeight: "500" as 'bold',
    },
  },
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
interface Props extends AbstractTaskProps {
  isLoadingTasksError: any,
  locale: any,
  date: any,
  list: ITask[],
  loadTask: (now) => void
}

interface States extends AbstractTaskStates {

  endDate: any,

  //danh sách task
  taskAfterTransform: ITask[],

  //danh sách người dùng lựa chọn
  selectedList: ITask[],

  //hiện thị thông báo áp dụng thay đổi hay không
  showApply: boolean,
}

// Main Component
class TaskListArrange extends Component<Props, States> {

  /**
   * Trạng thái có refreshTaskList hay không khi đã gửi move Task lên server thành công
   */
  isRefreshTaskList = false;
  // taskActionList: string[];
  newArrTemp: ITask[];

  //danh sách vị trí các điểm trước movetask
  arrPrePosition: number[];

  //trang thái có nhiều shift hay không
  private isMultipleShift = false;

  /** tìm task cuối cùng là task giao hàng và về kho với trạng thái đang giao hàng và hoàn thành */
  private lastProgressPosition: number;

  /** Lấy vị trí kết thúc, hết ngày */
  private hetNgayIndex: number;

  //soan hàng
  private soanHangIndex: number;

  constructor(props) {
    super(props);

    this.state = {
      endDate: this.props.date,
      loading: false,
      taskAfterTransform: [...this.props.list],
      selectedList: [],
      showApply: false,
    };

     //vị trí cuối cùng có trạng thái đã thực hiên
    this.lastProgressPosition = this.lastNotOpenPosition();
    this.hetNgayIndex = this.endDatePosition();
    this.soanHangIndex = this.startPosition();
    this.newArrTemp = [...this.props.list];
    this.arrPrePosition = [];
    this.isMultipleShift = this.isMultipleTrips(this.state.taskAfterTransform);
    // console.log("TaskListArrange this.this.props.list[0].organizationId._id=>", this.props.list[0]?.organizationId._id);
    // console.log("TaskListArrange this.props.orgConfig._id=>", this.props.orgConfig?._id);
    // console.log("TaskListArrange this.props.org=>", this.props.org);
  }

  componentDidUpdate() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }

  componentWillUnmount() {

    //nếu có thay đổi thì load lại TaskList
    if (this.isRefreshTaskList) {
      this.props.loadTask(this.state.endDate);
    } else {

      //trả về list với trạng thái ban đầu khi ko refresh lại list
      //hiện tại khi thay đổi trạng thái bị tham chiếu đến đối tượng list
      _.forEach(this.props.list,
        (item:ITask) => {
          item.isMarked = false;
          item.isChecked = false;
        },
      );
    }
  }

  /**
   * làm mới dữ liệu theo thời gian
   */
  onRefresh = _.debounce(() => {
    this.props.loadTask(this.state.endDate);
  }, 300);

  /**
   * Không cho phép click vào task đã hoàn thành, hết ngày, mở rộng
   * Extra task được hành xử như 1 task có trạng thái Completed,
   * là dù nó ở trạng thái nào cũng sẽ không được move
   * Task là giao hàng và trạng thái đang open
   */
  private isDeliveryOpen = (item: ITask) => {

    let taskActionCode = item.taskAction.taskActionCode;
    return (taskActionCode === TaskCode.GIAO_HANG
      && item.status === TaskStatus.Open);
  }

  private enableSelection = (item:ITask, index:number) =>{
     return this.isDeliveryOpen(item) && index > this.lastProgressPosition;
  }

  /**
   * Vị trí cuối cùng của các task hoàn thành, và đang xử lý
   */
  private lastNotOpenPosition = () => {

    //tìm task cuối cùng là task giao hàng và về kho với trạng thái đang giao hàng và hoàn thành
    return _.findLastIndex(this.props.list, (o) => (o.status == TaskStatus.Completed || o.status == TaskStatus.Progressing) 
              && (o.taskAction.taskActionCode === TaskCode.GIAO_HANG || o.taskAction.taskActionCode === TaskCode.VE_KHO));
  }

  /**
   * Không cho phép move task,
   * - Extra task nằm trên task Soạn hàng, nhưng Extra task sẽ không được move, 
   * và cũng không có Move tasks to here ở vị trí trên task Soạn hàng
   * - Extra task chỉ được move khi nằm ở trên task Hết Ngày 
   */
  private enableMoveTask = (item: ITask, index:number) => {
    return !item.isChecked 
            && !this.isDisableMoveTask(item, index)
            && this.arrPrePosition.every(position => index !== position)
            && index >= this.lastProgressPosition
  }

  /**
   * Không cho phép move task,
   * - Extra task nằm trên task Soạn hàng, nhưng Extra task sẽ không được move, 
   * và cũng không có Move tasks to here ở vị trí trên task Soạn hàng
   * - Extra task chỉ được move khi nằm ở trên task Hết Ngày 
   */
  private isDisableMoveTask = (item: ITask, index:number) => {
    const { taskAction } = item;

    return (taskAction.taskActionCode === TaskCode.HET_NGAY
      || (taskAction.taskActionCode === TaskCode.EXTRA_TASK 
        && index > this.hetNgayIndex));
  }

  /**
   * Thực hiện trạng thái check hay không
   * @param item 
   * @param index 
   */
  isCheckedOrNot = (item: ITask, index: number) => {

    console.log("TaskListArrange isCheckedOrNot", item);

    //nếu là soạn hàng và hết ngày thì ko cho phép click
    if (!this.enableSelection(item, index)) {
      return;
    } else {
      let activeTask = this.state.taskAfterTransform[index];
      console.log("TaskListArrange activeTask", activeTask);

      activeTask.isChecked = !activeTask.isChecked;

      //lưu trữ vị trí của item trước đó, sử dụng để ẩn movetask phía trên 
      //task được chọn
      const preIndex = index - 1;
      if (activeTask.isChecked) {
        this.arrPrePosition.push(preIndex);
      } else {
        this.arrPrePosition = this.arrPrePosition.filter(position => preIndex !== position);
      }

      if (activeTask.isChecked) {
        //xóa phần tử được chọn ra tập danh sách lưu tạm
        this.newArrTemp.splice(this.newArrTemp.indexOf(item), 1);

        //thêm phần tử lựa chọn vào mảng lựa chọn
        this.setState({ selectedList: [...this.state.selectedList, activeTask] });
      } else {

        //add phần tử mới vào danh sách

        //loại bỏ phần từ trong danh sách chọn
        const filterArr = this.state.selectedList.filter(item => {
          return item._id !== activeTask._id;
        });
        //thiết lập lại danh sách thay đổi
        this.setState({ selectedList: filterArr });

        //cập nhật lại mảng ko lựa chọn
        if(!filterArr){
          this.newArrTemp = [...this.state.taskAfterTransform]
        }else{
          //lấy các item ko nằm trong mảng lựa chọn
          this.newArrTemp = this.state.taskAfterTransform.filter((item1) =>{
              return filterArr.findIndex((item2) => item1._id === item2._id) == -1
          })
        }
      }
    }
  };

  /**
   * Thực hiện move task
   * @param oldList: danh sách các task ban đầu 
   * @param changeList: danh sách các task được lựa chọn 
   * @param positionToMove: vị trí task được move 
   */
  startMoveTaskList = (positionToMove = 0) => {

    //nếu không có task nào được lựa chọn thì bỏ qua
    if (this.state.selectedList.length <= 0) {
      Toast.show(Localize(Messages.taskListArrange.selectTaskFirst));
      return;
    }

    //kiểm tra nếu là nhiều trip thì thông báo gộp shift nếu có
    if (this.isMultipleShift) {

      //kiểm tra danh sách đã lựa chọn có cùng shift không
      const shifts = _.groupBy(this.state.selectedList, task => {
        return task.tripCode;
      });

      // console.log("startMoveTaskList shifts", shifts);

      //nếu cùng shift
      if (Object.keys(shifts).length == 1) {

        //trip code của trip được chọn
        var tripCode = Object.keys(shifts)[0];
        // console.log("startMoveTaskList tripCode", tripCode);

        //lấy danh sách các task giao hàng ban đầu theo trip code
        var parentArr = this.state.taskAfterTransform.filter(item => {
          return this.isDeliveryOpen(item) && item.tripCode === tripCode;
        });

        // console.log("startMoveTaskList parentArr", parentArr);

        //kiểm tra e mảng bằng nhau
        var difference = _.differenceWith(parentArr, this.state.selectedList, (a, b) => {
          return a._id === b._id;
        });

        // console.log("startMoveTaskList difference", difference);

        //nếu bằng nhau thì thông báo
        if (difference.length == 0) {
          Alert.alert(Localize(Messages.taskListArrange.combineTripTitle),
            Localize(Messages.taskListArrange.combineTripDesc).replace("#", tripCode), [
            {
              text: Localize(Messages.button.cancelBtn).toLocaleUpperCase()
            },
            {
              text: Localize(Messages.button.combineBtn).toLocaleUpperCase(),
              onPress: () => {
                this.doingMoveTaskList(positionToMove);
              }
            },
          ]);
          return;
        }
      }
    }
    this.doingMoveTaskList(positionToMove);
  };


  /**
   * thực hiện move task
   * @param oldList
   * @param changeList 
   * @param positionToMove 
   */
  doingMoveTaskList = (positionToMove = 0) => {

    //xóa các id được ẩn trước đó
    this.arrPrePosition = [];

    //di chuyển các task lựa chọn vào danh sách mới
    this.newArrTemp.splice(positionToMove, 0, ...this.state.selectedList);
   
    //cập nhật trạng thái đánh dấu
    this.state.selectedList.map(changed => {
      changed.isChecked = false;
      changed.isMarked = true;
    });

    //thiết lập lại danh sách mới
    this.setState({
      taskAfterTransform: [...this.newArrTemp],
      selectedList: [],
      showApply: true,
    }, () => {
      // this.newArrTemp = [...newList];
    });

  }

  /**
   * Lấy vị trí bắt đầu, soạn hàng
   */
  private startPosition = () => {
    let position = _.findIndex(this.state.taskAfterTransform, item => {
      return item.taskAction.taskActionCode === TaskCode.SOAN_HANG;
    });

    if (position == -1) position = 0;

    return position
  }

  /**
   * Lấy vị trí kết thúc, hết ngày
   */
  private endDatePosition = () => {
    let position = _.findLastIndex(this.state.taskAfterTransform, item => {
      return item.taskAction.taskActionCode === TaskCode.HET_NGAY;
    });
    if (position == -1) position = this.state.taskAfterTransform.length - 1;

    return position
  }

  listRowRender = (item: ITask, index: number) => {
    const taskActionsName = item?.taskAction?.taskActionName ?? "";
    const taskActionCode = item?.taskAction?.taskActionCode ?? "";
    return (
      <ListArrangeRow
        isChecked={item.isChecked}
        isMarked={item.isMarked}
        // hideButtonPosition={this.arrPrePosition}
        // startPosition={this.soanHangIndex}
        // endPosition={this.hetNgayIndex}
        index={index}
        testID={TestID.taskItemView + taskActionCode + index}
        key={item ? item._id : index}
        status={item.status}
        onPress={() => this.isCheckedOrNot(item, index)}
        onMove={() => {
          this.startMoveTaskList(this.newArrTemp.indexOf(item) + 1);
        }}
        subject={item.subject}
        address={item.contentSecondRow}
        startAndDueDate={`${dateToDDMM(item.startDate)}-${dateToDDMM(
          item.dueDate,
        )} -- ${taskActionsName}`}
        hourStart={dateToHHMM(item.startDate)}
        hourEnd={dateToHHMM(item.dueDate)}
        fulfillmentStatusIconColor={item.fulfillmentStatusIconColor}
        // taskModel={item}
        enableSelection={this.enableSelection(item, index)}
        enableMoveTask = {this.enableMoveTask(item, index)}
      />
    );
  };

  /**
   * Hủy move task
   */
  cancelArrange = () => {

      //trả về list với trạng thái ban đầu khi ko refresh lại list
      //hiện tại khi thay đổi trạng thái bị tham chiếu đến đối tượng list
      _.forEach(this.props.list,
        (item:ITask) => {
          item.isMarked = false;
          item.isChecked = false;
        },
      );

    this.setState({ showApply: false, taskAfterTransform: [...this.props.list], selectedList: [] }, () => {

    });
    this.newArrTemp = [...this.props.list];
    this.arrPrePosition = [];
  }

  /**
   * Thực hiện gửi move task lên server xử lý
   */
  onMoveOrder = () => {
    this.setState({ showApply: false });
    let dataDate = Moment(this.props.date).unix();
    Progress.show(
      API.moveOrder, [dataDate, this.props.list[0].organizationId._id, this.state.taskAfterTransform], response => {
        console.log("onMoveOrder ===> ", response);
        if (response.data.message === MoveTaskResponseMessage.Done) {
          //gán trạng thái refresh
          this.isRefreshTaskList = true;

          Alert.alert(Localize(Messages.success),
            Localize(Messages.taskListArrange.sendingToPlanner), [
            {
              text: Localize(Messages.button.okBtn),
              onPress: () => Actions.pop()
            },
          ]);
        } else {
          Alert.alert(Localize(Messages.error),
            Localize(Messages.taskListArrange.sendingNotPlanner), [
            {
              text: Localize(Messages.button.okBtn),
              onPress: () => this.setState({ showApply: true })
            },
          ]);
        }
      });
  }

  getEmptyViewMode() {
    const taskData = this.props.task;
    if (
      taskData.data &&
      taskData.data.length === 0 &&
      this.props.isLoadingTasksError
    ) {
      return AwesomeListMode.ERROR;
    } else if (
      taskData.data &&
      taskData.data.length === 0 &&
      !taskData.loading &&
      !this.props.isLoadingTasksError
    ) {
      return AwesomeListMode.EMPTY;
    } else if (taskData && taskData.loading) {
      return AwesomeListMode.PROGRESS;
    } else {
      return AwesomeListMode.HIDDEN;
    }
  }

  calculateSections(taskList) {
    let sections = [];
    const sectionGroup = [];
    _.forEach(
      _.groupBy(taskList, task => {
        return task.tripCode;
      }),
      (value) => {
        sectionGroup.push(value);
      },
    );
    sections = sectionGroup.map((secGroup, index) => {
      return {
        title: `${Localize(messages.trip)} ${index + 1}`,
        data: secGroup,
      };
    });
    console.log("calculateSections sections=>", sections);
    return sections;
  }

  /**
   * Kiểm tra xem có nhiều trip hay không? chỉ check các task giao hàng
   * nếu một task không có id của shift thì sẽ ko được xem là nhiều shift
   * @param taskList 
   */
  isMultipleTrips(taskList: ITask[]) {

    //lấy các trip có mã và đang là giao hàng
    const tastListWithTripCode = _.filter(taskList, task => {
      return task.tripCode && task.taskAction.taskActionCode === TaskCode.GIAO_HANG;
    });

    console.log("isMultipleTrips tastListWithTripCode=>", tastListWithTripCode);

    //nếu số lượng task mà nhỏ hơn 1 thì xem như chỉ có 1 trip
    if (tastListWithTripCode.length <= 1) {
      return false;
    }

    //nhom trip theo tripcode để kiểm tra có nhiều trip trong shift hay không
    const trips = _.groupBy(tastListWithTripCode, task => {
      return task.tripCode;
    });

    console.log("isMultipleTrips Object.keys(trips).length>", Object.keys(trips));

    return Object.keys(trips).length > 1;
  }

  transformTaskList(taskListBefore) {
    const isTMSTask = isTMSTasks(taskListBefore);
    const isDepotTMSTask = isDepotTMSTasks(taskListBefore);
    const { user } = this.props;
    return _.map(taskListBefore, taskItem => {
      return {
        ...taskItem,
        contentSecondRow: getContentSecondRowTaskItem(
          isTMSTask,
          isDepotTMSTask,
          taskItem,
        ),
        fulfillmentStatusIconColor: this.getFulfillmentStatusIconColor(
          taskItem,
        ),
        isDisabled: getDisableValueTask(taskItem, user),
      };
    });
  }

  getFulfillmentStatusIconColor = taskItem => {
    if (this.props.orgConfig.configurations.longhaul) {
      return null;
    }
    return OrderInfo.FULFILLMENT_STATUS_COLOR[
      totalFulfillmentStatus(
        taskItem.orderList !== undefined ? taskItem.orderList : null,
      )
    ];
  };

  renderLoadingTaskList() {
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: AppColors.graytrans,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  /**
   * kiểm tra task soạn hàng
   */
  private isSoanHang = () => {

    //nếu không có task nào thì bỏ qua
    if (!this.state.taskAfterTransform) return false;

    let itask = this.state.taskAfterTransform[0];

    //nếu ko có task nào
    if (!itask || !itask.taskActionIds) return false;

    let actionIds = itask.taskActionIds[0];

    if (!actionIds) return false;

    return actionIds.taskActionCode === TaskCode.SOAN_HANG;
  }

  dataView = () => {
    // const taskAfterTransform = this.transformTaskList(this.props.task.data);

    

    return (
      <View style={{ flex: 1 }}>
        {this.isSoanHang() && (
          <OrderTotal taskList={this.props.task.data} />
        )}

        {/* {this.isMultipleShift ? (
          <SectionList
            renderItem={({ item, index }) => this.listRowRender(item, index)}
            renderSectionHeader={({ section: { title } }) => <SectionsHeaderText title={title} />}
            sections={this.calculateSections(this.state.taskAfterTransform)}
            keyExtractor={item => item._id}
          />
        ) : ( */}
        <FlatList
          testID={TestID.taskListView}
          style={{ backgroundColor: "white" }}
          data={this.state.taskAfterTransform}
          renderItem={({ item, index }) => this.listRowRender(item, index)}
          keyExtractor={item => item._id}
          refreshing={false}
          removeClippedSubviews={false}
          legacyImplementation={true}
        />
        {/* )} */}

        <EmptyView
          renderProgress={() => this.renderLoadingTaskList()}
          mode={this.getEmptyViewMode()}
          retry={() => {
            this.onRefresh();
          }}
          emptyText={Localize(messages.emptyTextTask)}
          renderErrorView={() => {
            return (
              <ErrorAbivinView onPressRetry={() => this.onRefresh()} />
            );
          }}
        />
      </View>
    );
  };

  /**
   * Tạo giao diện hiện thị só lượng task được lựa chọn
   */
  private renderSelected() {

    //nếu không có task nào được lựa chọn thì bỏ qua
    if (this.state.selectedList.length <= 0) return null;

    return (<View style={{
      backgroundColor: "#3A9AE0",
      height: 44,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
    >
      <Text style={{ color: "#FFFFFF" }}>{LocalizeReplace(Messages.taskListArrange.numberTaskSelected, this.state.selectedList.length)}</Text>
    </View>)
  }

  /**
   * xác nhận có movetask hay không
   */
  private renderConfirmMoveTask() {

    //nếu ko ở trạng thái hiện thị hoặc đăng có danh sách thay đổi thì không hiện thị
    if (!this.state.showApply || this.state.selectedList.length > 0) return null;

    return (
      <View style={{
        backgroundColor: "#F7902F",
        height: 44,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      >
        <View style={{ width: "100%", paddingHorizontal: AppSizes.paddingXXLarge, flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={this.cancelArrange}>
            <Text style={{ color: "#FFFFFF" }}>{Localize(Messages.button.cancelBtn)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onMoveOrder}>
            <Text style={{ color: "#FFFFFF" }}>{Localize(Messages.button.applyBtn)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    const dateFormat = Moment(this.state.endDate).format("DD/MM/YYYY");

    return (
      <View style={{ flex: 1 }}>
        <HeaderView
          displayAvatar={true}
        />

        <View style={styles.headerConainer}>
          <View
            testID={TestID.datePreButton}
            style={{ width: AppSizes.paddingSml * 6 }}
          >
            <Icon
              name="ios-arrow-back"
              size={AppSizes.paddingXXLarge}
              color="#FFFFFF"
            />
          </View>
          {/* <DatePicker
            style={{ alignItems: "center" }}
            customStyles={styles.customStylesDatePicker}
            date={dateFormat}
            mode="date"
            disabled={false}
            placeholder={Localize(Messages.selectDate)}
            format="DD/MM/YYYY"
            confirmBtnText={Localize(Messages.button.confirmBtn)}
            cancelBtnText={Localize(Messages.button.cancelBtn)}
            showIcon={false}
          // onDateChange={date => this.onDateChange(date)}
          /> */}
          <View style = {{flex:1, borderWidth: 0, alignItems: "center", justifyContent: "center"}}>
              <Text style={styles.customStylesDatePicker.dateText}>{dateFormat}</Text>
          </View>
          <View
            testID={TestID.dateNextButton}
            style={{
              width: AppSizes.paddingSml * 6,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Icon
              name="ios-arrow-forward"
              size={AppSizes.paddingXXLarge}
              color="#FFFFFF"
            />
          </View>
        </View>
        {this.dataView()}
        {this.state.loading && (
          <ActivityIndicator
            color={AppColors.abi_blue}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              backgroundColor: AppColors.lightGrayTrans,
            }}
            size="small"
          />
        )}
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}
          style={{
            alignSelf: "center",
            top: AppSizes.paddingXMedium * 4 + 40,
            backgroundColor: AppColors.abi_blue,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 18,
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: AppColors.white, marginRight: AppSizes.paddingXXSml }}>{Localize(Messages.taskListArrange.arrangeMode)}</Text>
          <Icon
            name="ios-close"
            size={AppSizes.paddingLarge}
            color={AppColors.white}
          />
        </TouchableOpacity>

        {this.renderSelected()}

        {this.renderConfirmMoveTask()}

      </View>
    );
  }
}

export default connect(
  state => ({
    event: state.refresh.event,
    task: state.task,
    org: state.org.orgSelect,
    isLoadingTasksError: state.task.isLoadingTasksError,
    locale: state.i18n.locale,
    orgConfig: state.user.orgConfig,
    user: state.user.user,
  }),
  {
    resetForm,
    loadTask,
    loadTaskDetail,
    loadTaskImplementing,
  },
)(TaskListArrange);
