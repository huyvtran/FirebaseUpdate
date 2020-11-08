import _ from 'lodash';
import { Moment } from 'moment';
import React from 'react';
import { Component } from 'react';
import {
  ActivityIndicator,
  Alert, BackHandler,
  ScrollView, StyleSheet, Text,
  TextInput, View
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import TestID from '../../../../test/constant/TestID';
import HeaderDetail from '../../../components/HeaderDetail';
import Progress from '../../../components/Progress';
import FormType from '../../../constant/FormType';
import { default as Messages, default as messages } from "../../../constant/Messages";
import TaskCode from '../../../constant/TaskCode';
import TaskImplementingManager from '../../../data/TaskImplementingManager';
import API from '../../../network/API';
import { ITask } from '../../../network/tasks/TaskListModel';
import { refresh } from '../../../store/actions/refresh';
import eventTypes from '../../../store/constant/eventTypes';
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import AlertUtils from '../../../utils/AlertUtils';
import PermissionUtils from '../../../utils/PermissionUtils';
import StringUtils from '../../../utils/StringUtils';
import CustomerView from '../../customer/components/CustomerView';
import { resetForm, resetTaskDetail } from "../../form/actions/creater/form";
import formCreator from '../../form/formCreator';
import FreightConstant from '../../freight/FreightConstant';
import TrackLocationManager from '../../locations/TrackLocationManager';
import NotificationManager from '../../notification/NotificationManager';
import TranslateText from '../../setting/languages/components/TranslateText';
import { Localize } from '../../setting/languages/LanguageManager';
import ShipmentListManager from '../../shipment/ShipmentListManager';
import {
  addTaskResult, loadTaskDetail,
  loadTaskImplementing
} from "../actions/creater/task";
import { AbstractTaskProps, AbstractTaskStates } from '../helper/AbstractTaskProps';
import {
  checkBaseAction,
  getForm, isAoSmithTask, isDeliveryTask,
  isInitiativeTask,
  isPhototAppTask,
  isSnpTask, isVisibilityTask, numberDistributed,
  numberSKUMiss,
  validateDeliveryTrips, validateForm, validateOrder,
  validateShipmentTask
} from "../helper/FunctionHelper";
import TaskHelper from '../helper/TaskHelper';
import { SURVEY_ANSWER_TYPE, survey_attributes } from '../mockdata/QuestionSurveyVn';



const moment = require('moment');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    marginLeft: 0,
    marginRight: 0,
  },
  resultText: {
    ...AppStyles.regularText,
    borderWidth: AppSizes.paddingXXTiny,
    borderRadius: AppSizes.paddingXXSml,
    borderColor: AppColors.spaceGrey,
    marginTop: AppSizes.paddingMedium,
    height: AppSizes.paddingSml * 10,
    padding: AppSizes.paddingMedium,
    fontSize: AppSizes.fontXXMedium,
    color: AppColors.spaceGrey,
    fontWeight: '400',
  },
  textHeaderTitle: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontXXMedium,
    backgroundColor: 'transparent',
    color: 'white',
    width: '50%',
    textAlign: 'center',
  }
});
interface Props extends AbstractTaskProps {

  //task lựa chọn
  item:ITask,

  //thời gian hiện tại
  currentDate: Moment,

  //hiện tại đang bằng null
  taskDetail: any,

  //trạng thái load dữ liệu
  loadingTaskDetail: any,

  taskList:any,

  //undefined
  validate: any,

  //undefined
  form: any,

  //undefined
  shipmentId:any,

  //undefined
  isAddNewTask:any,

  //thời gian lựa chọn
  selectedDate:Moment,
  resetForm: () => void,
  resetTaskDetail: () => void,
  refresh: (type:string, now:number) => void,
  addTaskResult: (text:string) => void,
  loadTaskDetail: ({taskAction: any, id: string}, item:any) => void,
  loadTaskImplementing: ({data:any}) => void
}

interface States extends AbstractTaskStates {
  text: string,
  isConnected: boolean,
}
class TaskDetail extends Component<Props,States> {
  item: any;
  content: any;
  taskList: any;

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      isConnected: null,
      loading: true,
    };
    this.item = props.item;
    this.content = null;

    //in case, after check in, we refresh task list => API call error => task List will empty
    //so we pass props task list to this.taskList of this component
    this.taskList = props.taskList;

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    console.log("TaskDetail item>> ", this.props.item);
    // console.log("TaskDetail currentDate>> ", this.props.currentDate);
    
    // console.log("TaskDetail taskList>> ", this.props.taskList);
    // console.log("TaskDetail loadingTaskDetail>> ", this.props.loadingTaskDetail);
    // console.log("TaskDetail validate>> ", this.props.validate);
    // console.log("TaskDetail user>> ", this.props.user);
    // console.log("TaskDetail form>> ", this.props.form);
    // console.log("TaskDetail shipmentId>> ", this.props.shipmentId);
    // console.log("TaskDetail isAddNewTask>> ", this.props.isAddNewTask);
    // console.log("TaskDetail selectedDate>> ", this.props.selectedDate);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.onLoadTaskDetail();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  onLoadTaskDetail = () => {
    setTimeout(() => {
      const { item } = this.props;
      const taskImplementing = TaskImplementingManager.findTaskImplemeting({ task: item })
      console.log("onLoadTaskDetail ===", taskImplementing);
      if (taskImplementing) {
        this.props.loadTaskImplementing({ data: taskImplementing });
      } else {
        this.props.loadTaskDetail({
          taskAction: item.taskAction._id,
          id: item._id,
        }, item);
      }
      this.setState({ loading: false })
    }, 300)
  }

  handleBackButtonClick() {
    const key = Actions.currentScene;

    if (key === 'taskDetail') {
      this.onBackPress();
    } else if (key === 'progress') {
      return true;
    } else {
      Actions.pop();
    }
    return true;
  }

  getTotalSku() {
    if (this.props && this.props.taskDetail && this.props.taskDetail.task && this.props.taskDetail.task.lastResponse) {
      const eavs = this.props.taskDetail.task.lastResponse.eAVs;
      const eAvsLat = _.uniqBy(eavs, eav => {
        return eav.entityId && eav.entityName;
      });
      return eAvsLat.length;
    }
    return 0;

  }

  confirmSubmitTaskDelivery(taskActionCode) {

    if (taskActionCode === TaskCode.GIAO_HANG) {
      AlertUtils.showConfirm(messages.confirmSubmit, () => {
        this.doSubmitTask();
      });
      return;
    }
    this.doSubmitTask();


  }

  checkContainerInputField = (taskDetail) => {
    const labelContainerNumber = Localize(Messages.taskDetail.labelContainerNumber);
    const labelSealNumber = Localize(Messages.taskDetail.labelSealNumber);
    const labelTareWeight = Localize(Messages.taskDetail.labelTareWeight);
    const labelMaxGross = Localize(Messages.taskDetail.labelMaxGross);

    let errorCode = -1;
    let indexCont = -1;
    const componentLength = taskDetail?.components?.length ?? 0;
    for (let index = 0; index < componentLength; index++) {
      const component = taskDetail.components[index];
      if (component.type === FormType.PANEL) {
        indexCont = index;
        const componentList = component.components;
        const contNumberComponent = componentList.find(comp => comp.label === labelContainerNumber);
        const sealNumberComponent = componentList.find(comp => comp.label === labelSealNumber);
        const tareWeightComponent = componentList.find(comp => comp.label === labelTareWeight);
        const maxGrossComponent = componentList.find(comp => comp.label === labelMaxGross);

        const contNumberValue = contNumberComponent && contNumberComponent.defaultValues && contNumberComponent.defaultValues[0] && contNumberComponent.defaultValues[0].value ? contNumberComponent.defaultValues[0].value : '';
        const maxGrossValue = maxGrossComponent && maxGrossComponent.defaultValues && maxGrossComponent.defaultValues[0] && maxGrossComponent.defaultValues[0].value ? maxGrossComponent.defaultValues[0].value : '';
        const tareWeightValue = tareWeightComponent && tareWeightComponent.defaultValues && tareWeightComponent.defaultValues[0] && tareWeightComponent.defaultValues[0].value ? tareWeightComponent.defaultValues[0].value : '';

        if (!_.isEmpty(contNumberValue)) {
          const headContainerNumber = contNumberValue.slice(0, 4);
          const tailContainerNumber = contNumberValue.slice(4, 11);

          if (contNumberValue.length !== 11 || !StringUtils.isAllCharacter(headContainerNumber) || !StringUtils.isAllDigit(tailContainerNumber)) {
            errorCode = FreightConstant.LIFT_1_ERROR_CODE.CONTAINER_WRONG_FORMAT;

            break;
          }

          if (!StringUtils.isValidateContainerNumber(contNumberValue)) {
            errorCode = FreightConstant.LIFT_1_ERROR_CODE.CONTAINER_WRONG_ISO_FORMAT;
          }

        }

        if (!_.isEmpty(maxGrossValue) && (maxGrossValue.length !== 5 || !StringUtils.isAllDigit(maxGrossValue))) {
          errorCode = FreightConstant.LIFT_1_ERROR_CODE.MAX_GROSS_WRONG_FORMAT;
          break;
        }

        if (!_.isEmpty(tareWeightValue) && (tareWeightValue.length !== 4 || !StringUtils.isAllDigit(tareWeightValue))) {
          errorCode = FreightConstant.LIFT_1_ERROR_CODE.TARE_WRONG_FORMAT;
          break;
        }
      }
    }

    return {
      errorCode,
      indexCont
    };

  };

  /**
   * Gửi báo cáo lên server
   */
  submitTotal = () => {
    const { taskDetail } = this.props;
    console.log("submitTotal ===", taskDetail);
    if (!taskDetail || !taskDetail.task || !taskDetail.task.taskAction || !taskDetail.task.lastResponse) {
      return;
    }
    const org = this.props.org[0];
    const taskActionCode = taskDetail.task.taskAction.taskActionCode;
    /**
     * check task is completed and task is in preventSubmit organization => not submit
     */
    if (org &&
      org.configurations &&
      org.configurations.preventReSubmit &&
      taskDetail.task &&
      taskDetail.task.status === TaskHelper.status.COMPLETE
    ) {
      return alert(Localize(messages.taskIsDone));
    }

    /**
     * with GIAO_HANG task, user must enable location in device and allow location permisstion for app
     */
    if (isDeliveryTask(taskActionCode)) {

      PermissionUtils.checkLocationPermission()
        .then(value => {
          if (value === PermissionUtils.PERMISSIONS_STATUS.DISABLEGPS) {
            alert(Localize(messages.notEnableLocation));
            return;
          } else if (value !== PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
            alert(Localize(messages.notAllowLocation));
            return;
          } else {
            this.confirmSubmitTaskDelivery(taskActionCode);
          }
        });

    }
    /**
     * with SOOS task, before submit task, alert a noti about quatity of miss PSKU and distributed PSKU
     */
    else if (checkBaseAction(taskActionCode)) {
      if (taskActionCode === TaskCode.SOOS) {
        const eavs = taskDetail.task.lastResponse.eAVs;
        const distributed = numberDistributed(eavs);
        const skuMiss = numberSKUMiss(eavs);
        const total = this.getTotalSku();
        console.log("checkBaseAction total>>", total);
        Alert.alert(
          Localize(Messages.taskDetail.tdReportShortage),
          `
          ${Localize(Messages.taskDetail.tdDelivered)}: ${distributed}/${total}.
          ${Localize(Messages.taskDetail.tdOutOfStock)}: ${skuMiss}/${total}.
          `,
          [
            {
              text: Localize(Messages.button.cancelBtn),
              onPress: () => console.log('Submit Confirm Cancel'),
              style: 'cancel'
            },
            {
              text: Localize(Messages.button.reportBtn),
              onPress: () => {
                this.doSubmitTask();
              }
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          Localize(Messages.taskDetail.tdReportConfirmTitle),
          Localize(Messages.taskDetail.tdReportConfirmDesc),
          [
            {
              text: Localize(Messages.button.cancelBtn),
              onPress: () => console.log('Submit Confirm Cancel'),
              style: 'cancel'
            },
            {
              text: Localize(Messages.button.okBtn),
              onPress: () => {
                this.doSubmitTask();
              }
            },
          ],
          { cancelable: false }
        );
      }
    } else if (taskActionCode === TaskCode.LIFT_ON_1) {
      const resultCheck = this.checkContainerInputField(taskDetail);
      const containerString = Localize(messages.container) + ' ' + (resultCheck.indexCont + 1);
      switch (resultCheck.errorCode) {
        case FreightConstant.LIFT_1_ERROR_CODE.CONTAINER_WRONG_FORMAT:
          Alert.alert(containerString, Localize(messages.containerWrongFormat));
          return;
        case FreightConstant.LIFT_1_ERROR_CODE.MAX_GROSS_WRONG_FORMAT:
          Alert.alert(containerString, Localize(messages.maxWeightWrongFormat));
          return;
        case FreightConstant.LIFT_1_ERROR_CODE.TARE_WRONG_FORMAT:
          Alert.alert(containerString, Localize(messages.tareWrongFormat));
          return;
        case FreightConstant.LIFT_1_ERROR_CODE.CONTAINER_WRONG_ISO_FORMAT:
          Alert.alert(containerString, Localize(messages.containerWrongISOFormat), [
            { text: Localize(messages.reCheck) },
            {
              text: Localize(messages.keepSubmit),
              onPress: () => {
                this.doSubmitTask();
              }
            },
          ]);
          break;
        default:
          this.doSubmitTask();
      }

    } else {
      console.log("before Submit task ");
      this.doSubmitTask();
    }

  };


  doSubmitTask() {
    this.props.taskDetail && this.props.taskDetail.task &&
      (this.props.taskDetail.task.status === TaskHelper.status.OPEN
        || this.props.taskDetail.task.status === TaskHelper.status.INPROCESS
        || this.props.taskDetail.task.status === TaskHelper.status.COMPLETE) &&
      this.loadSubmitTask();
  }


  loadSubmitTask() {
    try {
      const { taskDetail, orgConfig, shipmentId } = this.props;

      const taskId = taskDetail.task._id;
      const formComponents = taskDetail.components;
      const eAVs = taskDetail.task.lastResponse.eAVs;
      const taskAction = taskDetail.task.taskAction;
      const taskActionCode = taskAction.taskActionCode;

      if (!this.isValidSepecificTaskBeforSubmit()) {
        return;
      }
      /**
       * with delivery task, check user have fill infomations or not
       * if not, alert warning
       */
      const form = getForm(formComponents);
      if (!validateOrder(form)) return alert(Localize(Messages.haveNotStatusOrEnterPrice));

      if (validateForm(form)) {
        console.log("loadSubmitTask validateForm>>", form);
        Progress.show(API.submitForm, [taskId, form, eAVs, taskAction, taskDetail, orgConfig.configurations.telematics, shipmentId], (resForm) => {
          if (resForm.problem === "CLIENT_ERROR") return alert(Localize(Messages.submitTimeOver));
          if (taskActionCode === TaskCode.SOAN_HANG || taskActionCode === TaskCode.SHIPPING_STARTED) {
            ShipmentListManager.saveShipmentDoing(ShipmentListManager.shipmentSelected);
            TrackLocationManager.trackLocation(taskDetail && taskDetail.task && taskDetail.task.routeDetailId ? taskDetail.task.routeDetailId : '', ShipmentListManager.shipmentSelected && ShipmentListManager.shipmentSelected._id ? ShipmentListManager.shipmentSelected._id : '');
          }
          if (taskActionCode === TaskCode.HET_NGAY || taskActionCode === TaskCode.SHIPPING_COMPLETED) {
            ShipmentListManager.saveShipmentDoing(null);
            TrackLocationManager.removeTrackLocation();
          }
          /**
           * reupdate  status of task in taskList in shipment in case the shipmentList isn't reloaded
           */
          if (isSnpTask(taskActionCode)) {
            let shipmentList = ShipmentListManager.shipmentList;
            const indexShipmentSelected = shipmentList.findIndex(shipment => {
              return shipment._id === ShipmentListManager.shipmentSelected._id;
            });
            const newShipmentSelected = {
              ...ShipmentListManager.shipmentSelected,
              taskIds: ShipmentListManager.shipmentSelected.taskIds ? ShipmentListManager.shipmentSelected.taskIds.map(task => {
                if (task._id === taskId) {
                  return {
                    ...task,
                    status: TaskHelper.status.COMPLETE
                  };
                }
                return task;
              }) : []
            };
            // shipmentList[indexShipmentSelected] === newShipmentSelected
            indexShipmentSelected !== -1 && shipmentList.splice(indexShipmentSelected, 1, newShipmentSelected);
            ShipmentListManager.saveShimentList(shipmentList);
          }

          switch (resForm.data.pod) {
            case '1':
              alert(Localize(Messages.taskDetail.tdPodSubmitSuccess));
              break;
            case '2':
              alert(Localize(Messages.taskDetail.tdPodSubmitFail));
              break;
            default:
              NotificationManager.showMessageBar(Localize(messages.submitSuccess), undefined, undefined);

              break;
          }

          this.props.refresh(eventTypes.REFRESH_TASK_LIST, _.now());

          //back to taskList
          TaskImplementingManager.removeTaskImplementing(taskDetail);
          Actions.pop();
          this.props.resetTaskDetail();
        }, (err) => {
          // alert(err.response.data.message)
        }, (hadleError) => {
          if (!hadleError || !hadleError.response || !hadleError.response.data || _.isEmpty(hadleError.response.data.message)) {
            return false;
          }
          alert(hadleError.response.data.message);
          if (hadleError.response.data.isRequestingNFR) {
            this.props.refresh(eventTypes.REFRESH_TASK_LIST, _.now());
          }
          return true;

        });


      } else {
        alert(isDeliveryTask(taskActionCode) ? Localize(Messages.confirmTakeGoods) :
          Localize(Messages.pleaseEnterFullfillElement));
      }
    } catch (error) {
      alert(error.message);
    }
  }


  isValidSepecificTaskBeforSubmit() {
    const { taskDetail } = this.props;
    const eAVs = taskDetail.task.lastResponse.eAVs;
    const taskAction = taskDetail.task.taskAction;
    const taskActionCode = taskAction.taskActionCode;
    /**
     * ******************************************check validate with INITIATIVE task********************************
     */
    if (isInitiativeTask(taskActionCode)) {

      let isWarning = false;
      //check all list eavs
      //if all items of check is uncheck => alert warning 
      let indexNotNull = _.findIndex(eAVs, (eav) => {
        return eav.value !== null;
      });

      console.log("isValidSepecificTaskBeforSubmit indexNotNull>>", indexNotNull);

      if (indexNotNull < 0) {
        isWarning = true;
        AlertUtils.showError(Messages.fillAllField);
        return false;
      }

      const eavGroup = _.groupBy(eAVs, (eav) => {
        return eav.entityCode;
      });

      _.forEach(eavGroup, eavPro => {
        let indexNotNull = _.findIndex(eavPro, (eav) => {
          return eav.value !== null;
        });
        let indexNull = _.findIndex(eavPro, (eav) => {
          return eav.value === null;
        });

        if (indexNotNull >= 0 && indexNull >= 0) {
          isWarning = true;
          return;
        }
      });

      if (isWarning) {
        AlertUtils.showError(Messages.fillAllField);

        return false;
      }
    }
    /**
     * ******************************************check validate with VISIBILITY task********************************
     */
    else if (isVisibilityTask(taskActionCode)) {
      let isWarning = false;
      const questionEav = _.filter(eAVs, eav => {
        const index = eav.attributeCode ? parseInt(eav.attributeCode, 10) : undefined;
        return index && survey_attributes[index] && survey_attributes[index].answerType === SURVEY_ANSWER_TYPE.BOOLEAN;
      });

      _.forEach(questionEav, (eav) => {

        if (eav.value === undefined) {
          isWarning = true;
          return;
        }
      });
      console.log("isValidSepecificTaskBeforSubmit isWarning>>", isWarning);
      if (isWarning) {
        AlertUtils.showError(Messages.fillAllField);

        return false;
      }
    }
    /**
     * ******************************************check validate with PHOTO APP task********************************
     */
    else if (isPhototAppTask(taskActionCode)) {
      console.log("isValidSepecificTaskBeforSubmit taskDetail>>", taskDetail);
      if (!taskDetail || !taskDetail.task || !taskDetail.task.lastResponse || !taskDetail.task.lastResponse.eAVs || taskDetail.task.lastResponse.eAVs.length === 0) {
        AlertUtils.showError(Messages.fillAllField);
        return false;
      }

    } else if (isDeliveryTask(taskActionCode)) {
      if (!validateDeliveryTrips(this.taskList, taskDetail)) {
        return false;
      }
    } else if (isSnpTask(taskActionCode)) {
      if (!this.props.isAddNewTask && !validateShipmentTask(ShipmentListManager.shipmentList, taskDetail)) {
        return false;
      }
    }


    return true;
  }

  /**
   * thoi gian hien tai tren app (current time app) co nam trong pham vi dueDate (startDate -> dueDate)
   * thoi gian thuc co nam trong pham vi dueDate hay khong.
   * co cho phep reSubmit mot task da thanh cong hay khong (tham so server tra ve/ preventResubmit)
   * preventSubmitOverTime = false thi lay theo date/ true thi lay theo gio/ phut
   * @param {*} configurations
   * @param {*} task
   */
  getSubmitText(configurations, task) {
    //incase task is prevented submiting or task is complete => not show submit
    let result = null;

    if (configurations) {
      const preventReSubmit = configurations.preventReSubmit;
      const preventSubmitOverTime = configurations.preventSubmitOverTime;
      const allowSubmitOverTime = configurations.allowSubmitOverTime;

      const dueDate = moment(task.dueDate);
      const startDate = moment(task.startAt);
      const todayDate = moment();
      const currentDate = (typeof this.props.currentDate === 'string' ? moment(this.props.currentDate) : this.props.currentDate);

      //get hour from currentDate and date from todaydate(or now()) in case today dat is changed and current date is not
      const currentString = currentDate.format('YYYY-MM-DD') + 'T' + todayDate.format('HH:mm:ss') + '.000Z';
      const _currentDate = moment(currentString);

      let todayVsDue = todayDate.isBetween(startDate, dueDate, "day", '[]');
      if (preventSubmitOverTime) {
        todayVsDue = todayDate.isBetween(startDate, dueDate, "minute");
      } else {
        if (
          startDate.isSame(dueDate, 'day') &&
          todayDate.isSame(startDate, 'day')
        ) {
          todayVsDue = true;
        }
      }

      const todayVsCurrent = preventSubmitOverTime ? todayDate.isSameOrBefore(_currentDate, 'minute') : todayDate.isSameOrBefore(_currentDate, 'days');

      // console.log(todayVsCurrent)

      if (todayVsDue && todayVsCurrent) {
        result = Localize(Messages.submit);
      }

      if (preventReSubmit && task.status === TaskHelper.status.COMPLETE) {
        result = null;
      }

      if (allowSubmitOverTime) {
        result = Localize(Messages.submit);
      }

      // return Localize(Messages.submit);
    }

    return result;
  }


  onBackPress() {
    const { taskDetail } = this.props;

    

    this.props.resetForm();

    if (this.props.isAddNewTask) {
      this.props.refresh(eventTypes.REFRESH_TASK_LIST, _.now());

    }
    const taskActionCode = taskDetail?.task?.taskAction?.taskActionCode ?? "";

    if (taskDetail && taskDetail.isImplemeting && taskDetail.task && (taskDetail.task.status !== TaskHelper.status.COMPLETE || checkBaseAction(taskActionCode))) {

      AlertUtils.showConfirm(messages.doYouWantToSave, () => {
        taskDetail.isImplemeting = false;
        if (TaskImplementingManager.findTaskImplemeting(taskDetail)) {
          TaskImplementingManager.editTaskImplementing(taskDetail);
        } else {
          TaskImplementingManager.saveTaskImplementing(taskDetail);
        }
      });

    }
    Actions.pop();
  }

  getEnableSubmitButton() {
    const { taskDetail } = this.props;
    return taskDetail && taskDetail.isValidateSubmit;
  }

  isShowResultField() {
    const { taskDetail } = this.props;
    if (taskDetail && taskDetail.task && taskDetail.task.taskAction && taskDetail.task.taskAction) {
      return isAoSmithTask(taskDetail.task.taskAction.taskActionCode);

    }
    return false;
  }


  onResultTaskChange = _.debounce((text) => {
    this.props.addTaskResult(text);
  }, 300);


  renderResultField() {
    return <View style={{
      paddingHorizontal: 16,
      paddingBottom: 12,
      paddingTop: 10
    }}>

      <TranslateText
        params={{
          style: {
            fontSize: 16,
            color: AppColors.spaceGrey,
            fontWeight: '400',
          }
        }}
        value={messages.result} />

      <TextInput
        multiline={true}
        numberOfLines={4}
        onChangeText={(resultTask) => this.onResultTaskChange(resultTask)}
        defaultValue={(this.props && this.props.taskDetail && this.props.taskDetail.task) ? this.props.taskDetail.task.note : ''}
        style={styles.resultText}
        placeholder={Localize(messages.inputTextHere)}
        underlineColorAndroid={'transparent'}
      />
    </View>;
  }
  renderContentTaskDetail = () => {

    const { taskDetail } = this.props;
    if (this.props.loadingTaskDetail === true || this.state.loading) {
      return <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        flex: 1
      }}>
        <ActivityIndicator />
      </View>
    } else if (taskDetail && taskDetail.components && ((this.item && this.item.taskCode === taskDetail.task.taskCode) || !this.item)) {
      const jsonForm = taskDetail.components;
      const form = formCreator(jsonForm);

      return <ScrollView testID={TestID.taskDetailView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {
            taskDetail.task && taskDetail.task.customer && (taskDetail.task.customer.fullName !== '') &&
            taskDetail.task.taskAction &&
            !isSnpTask(taskDetail.task.taskAction.taskActionCode) &&
            <CustomerView
              customer={taskDetail.task.customer}
              {...taskDetail.task}
            />
          }
          {this.isShowResultField() && this.renderResultField()}
          {form}
        </View>
        <View style={{ height: 300 }} />

      </ScrollView>

    } else {
      return <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: AppSizes.paddingMedium
      }}>
        <Text style={{
          ...AppStyles.regularText,
          fontSize: AppSizes.fontXXMedium
        }}>{Localize(Messages.taskDetailUnavailble)}</Text>
      </View>
    }
  }
  render() {
    const { taskDetail } = this.props;

    console.log("FETCH_TASK_DETAIL taskDetail 123>> ", taskDetail);

    if (!this.props.org) {
      return <View />;
    }
    const { orgConfig } = this.props;
    return (
      <View style={styles.container} keyboardShouldPersistTaps='always'>
        <HeaderDetail
          title={this.item && this.item.subject}
          subTitle={moment(this.props.selectedDate)
            .format('DD/MM/YYYY')}
          leftButtonAction={() => {
            this.onBackPress();
          }}
          rightButtonTitle={taskDetail && this.getSubmitText(orgConfig && orgConfig.configurations, taskDetail.task)}
          rightButtonAction={() => {
            this.submitTotal();
          }}
          rightButtonEnable={this.getEnableSubmitButton()}
          rightButtonTestId={TestID.submitTaskButton}
          leftButtonTestId={TestID.backButton}
        />
        {this.renderContentTaskDetail()}
      </View>

    );
  }
}

export default connect(state => ({
  currentDate: state.task.currentDate,
  taskDetail: state.task.taskDetail,
  taskList: state.task.data,
  loadingTaskDetail: state.task.loadingTaskDetail,
  validate: state.validate,
  user: state.user.data,
  form: state.form,
  org: state.org.orgSelect,
  orgConfig: state.user.orgConfig
}), {
  resetForm,
  resetTaskDetail,
  refresh,
  addTaskResult,
  loadTaskDetail,
  loadTaskImplementing
})(TaskDetail);

