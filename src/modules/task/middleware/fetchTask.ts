import _ from 'lodash';
import Moment from "moment/moment";
import { Actions } from 'react-native-router-flux';
import { call, put, select } from 'redux-saga/effects';
import Messages from "../../../constant/Messages";
import TaskCode from '../../../constant/TaskCode';
import API from '../../../network/API';
import TrackLocationManager from '../../locations/TrackLocationManager';
import { fetchCategory } from '../../product/middleware/fetchProduct';
import ShipmentListManager from '../../shipment/ShipmentListManager';
import {
  FETCH_PROMOTION_INITIATIVE, FETCH_PROMOTION_VFAST,

  FETCH_TASK_DETAIL,
  FETCH_TASK_DETAIL_ERROR,
  FETCH_TASK_DETAIL_START,
  FETCH_TASK_LIST,
  FETCH_TASK_LIST_ERROR,
  FETCH_TASK_LIST_START
} from "../actions/types/task";
import {
  addDataToCheckInForm, addDataToInitiativeForm, addDataToSODForm,
  addDataToSOOSForm,
  addDataToSOSForm, addDataToSurveyForm, addDataToVFastForm,




  calculateComponentLiftOn1, calculateComponentPhotoApp, findCategory
} from "../helper/DataHelper";
import { checkBaseAction, getRouteIdWorking, isSnpTask } from "../helper/FunctionHelper";




const org = state => state.org.orgSelectIds;
const orgName = state => state.org.orgSelect[0].organizationName;
const currentDate = state => state.task.currentDate;
const selectTask = state => state.task.data;
const category = state => state.category.data;
const eAVs = state => state.task.taskDetail.task.lastResponse.eAVs;
const taskAction = state => state.task.taskDetail.task.taskAction
const taskDetail = state => state.task.taskDetail
const orgConfig = state => state.user.orgConfig;


// fetch TaskAction then fetch TaskList->loading: false
const fetchTask = function* fetchTask(action) {
  try {
    yield put({ type: FETCH_TASK_LIST_START, data: action.payload.date });

    const _org = yield select(org);

    let orgParam = _org;
    if (Array.isArray(_org)) {
      orgParam = _org[0];
    }


    const task = yield call(API.getTaskList, action.payload.date, orgParam);

    console.log("fetchTask task>>", task)
    //fetch today's order list, for TMS
    // if (task && task.data && task.data.data && task.data.data.length > 0) {
    //   const orderIds = OrderHelper.getOrderIdFromTask(task.data.data);
    //   const orgConfigData = yield select(orgConfig);

    //   if (orderIds && orderIds.length > 0) {
    //     const orderResponse = yield call(API.orderListFromOrderIds, orderIds, orgConfigData.configurations.longhaul);
    //     console.log(orderResponse)
    //     if (orderResponse && orderResponse.data && orderResponse.data.data && orderResponse.data.data.length > 0) {
    //       yield put({ type: FETCH_TASK_ORDERS, data: orderResponse.data.data })
    //     }
    //   }
    // }


    task.status === 200 ?
      yield put({ type: FETCH_TASK_LIST, data: task.data.data, loading: false })
      :
      yield put({ type: FETCH_TASK_LIST_ERROR });

    if (task && task.data && task.data.data && TrackLocationManager.isValidateTrackLoccation(task.data.data, action.payload.date)) {
      const routeDetailId = getRouteIdWorking(task.data.data)
      if (!_.isEmpty(routeDetailId)) {
        TrackLocationManager.trackLocation(routeDetailId, '')
      }

    }
  } catch (error) {
    yield put({ type: FETCH_TASK_LIST_ERROR, error });
  }
};



const fetchTaskDetail = function* fetchTaskDetail(action) {
  try {

    yield put({ type: FETCH_TASK_DETAIL_START });

    const _orgName = yield select(orgName);
    const _org = yield select(org);
    let orgParam = _org;
    if (Array.isArray(_org)) {
      orgParam = _org[0];
    }
    const _currentDate = yield select(currentDate);

    const taskDetailRes = yield call(API.taskDetail, action.payload.body);
    const taskDetail = taskDetailRes.data;
    console.log("fetchTaskDetail taskDetail>>", taskDetail);
    if (taskDetailRes.status !== 200) {
      yield put({ type: FETCH_TASK_DETAIL_ERROR });
    } else {

      if (checkBaseAction(taskDetail.data.task.taskAction.taskActionCode)) {
        // fetch user's category list from organization 
        yield call(fetchCategory);
        const _category = yield select(category);

        switch (taskDetail.data.task.taskAction.taskActionCode) {
          case "SOOS":
            //check old data in last month
            if (!taskDetail.data.task.lastResponse.eAVs || taskDetail.data.task.lastResponse.eAVs.length === 0) {
              alert('Tác vụ SOOS tuần 4 của tháng trước chưa nhập dữ liệu');
            }
            //fetch inventory list
            const inventoryRes = yield call(API.inventoryList, orgParam, '', _currentDate);
            console.log("fetchTaskDetail inventoryRes>>", inventoryRes)
            if (!inventoryRes || !inventoryRes.data || !inventoryRes.data.data) {
              return;
            }
            const inventory = inventoryRes.data.data;


            let newAVs = []
            const inventoryListToMap = inventory
              .filter(inv =>
                inv.categoryIds.length > 0 &&
                (inv.categoryIds[0].categoryType === "Category" ||
                  inv.categoryIds[0].categoryType === "Sub-Category" ||
                  inv.categoryIds[0].categoryType === "Brand"))

            _.forEach(inventoryListToMap, (inven) => {
              const cate = _category.find(value => value.categoryCode === inven.categoryIds[0].categoryCode);
              const topParentCate = findCategory(_category, cate, 'Category');
              const eAVs = taskDetail.data.task.lastResponse.eAVs;
              const eavInvens = eAVs && eAVs.length > 0 ? _.filter(eAVs, (eav) => { return eav.entityCode === inven.productCode }) : [];
              const isTaskNew = !(eavInvens && eavInvens[0] && eavInvens[0].value)

              if (isTaskNew) {
                newAVs.push({
                  entityId: inven._id,
                  topParentCode: topParentCate.categoryCode,
                  topParentName: topParentCate.categoryName,
                  directParentCode: inven.categoryIds[0].categoryCode,
                  directParentName: inven.categoryIds[0].categoryName,
                  entityCode: inven.productCode || inven.sku,
                  entityName: inven.productName,
                  attributeCode: inven.attributeCode ? inven.attributeCode : '3',
                  value: inven.value ? inven.value : "Yes",
                  _id: inven._id
                })
              } else {
                newAVs.push({
                  entityId: inven._id,
                  topParentCode: topParentCate.categoryCode,
                  topParentName: topParentCate.categoryName,
                  directParentCode: inven.categoryIds[0].categoryCode,
                  directParentName: inven.categoryIds[0].categoryName,
                  entityCode: inven.productCode || inven.sku,
                  entityName: inven.productName,
                  attributeCode: eavInvens[0].attributeCode,
                  value: eavInvens[0].value,
                  _id: inven._id
                })

              }

            })
            console.log("fetchTaskDetail newAVs>>", newAVs)
            const rawEavs = newAVs;
            _.forEach(rawEavs, rawEav => {
              if (rawEav.attributeCode === '2') {
                newAVs.push({
                  ...rawEav,
                  attributeCode: '1',
                  value: 'Yes',
                })

                newAVs.push({
                  ...rawEav,
                  attributeCode: '3',
                  value: 'Yes',
                })
              }
            })


            taskDetail.data.task.lastResponse.eAVs = newAVs;

            console.log("taskDetail.data.task.lastResponse.eAVs before push to form", taskDetail.data.task.lastResponse.eAVs);
            addDataToSOOSForm(taskDetail.data.components, taskDetail.data.task.lastResponse.eAVs, _category, _orgName);

            break;

          case "SOD":
            addDataToSODForm(taskDetail.data.components, taskDetail.data.task.lastResponse.eAVs, _category, _orgName);
            break;

          case "SOS":

            if (!taskDetail.data.task.lastResponse.eAVs || taskDetail.data.task.lastResponse.eAVs.length === 0) {
              alert('Tác vụ SOS cũ của tháng trước chưa nhập dữ liệu');
            }

            addDataToSOSForm(taskDetail.data.components, taskDetail.data.task.lastResponse.eAVs, _category, _orgName);
            break;

          case "V-FAST":

            let date = `${Moment().format('YYYY-MM-DD')}T01:00:00.000Z`;
            if (typeof _currentDate === "string") {
              date = `${Moment(_currentDate).format('YYYY-MM-DD')}T01:00:00.000Z`;
            } else {
              date = `${_currentDate.format('YYYY-MM-DD')}T01:00:00.000Z`;
            }

            const promotionRes = yield call(API.vfastPromotionApi, { queryDate: date });
            const promotion = promotionRes.data
            yield put({ type: FETCH_PROMOTION_VFAST, data: promotion.data });

            console.log("Fetch promotion", promotion.data);

            if (promotion.data) {
              addDataToVFastForm(taskDetail.data.components, taskDetail.data.task.lastResponse.eAVs, promotion.data, _orgName);
            } else {
              console.log("Fetch promotion error", promotion);
            }
            break;
          case TaskCode.INITIATIVE_IS:
          case TaskCode.INITIATIVE_MR:
          case TaskCode.INITIATIVE_MM:
          case TaskCode.INITIATIVE_CVS:
          case TaskCode.INITIATIVE_CCC:
          case TaskCode.INITIATIVE_HM:
          case TaskCode.INITIATIVE_SM:
          case TaskCode.INITIATIVE:
          case TaskCode.INITIATIVE_MMTIER1:
          case TaskCode.INITIATIVE_MMTIER2:
          case TaskCode.INITIATIVE_HB:
          case TaskCode.INITIATIVE_DP:

            let dateInitiative = `${Moment().format('YYYY-MM-DD')}T01:00:00.000Z`;
            if (typeof _currentDate === "string") {
              dateInitiative = `${Moment(_currentDate).format('YYYY-MM-DD')}T01:00:00.000Z`;
            } else {
              dateInitiative = `${_currentDate.format('YYYY-MM-DD')}T01:00:00.000Z`;
            }

            const programRes = yield call(API.initiativePromotionApi, { queryDate: dateInitiative, actionCode: taskDetail.data.task.taskAction.taskActionCode });
            const program = programRes.data;
            yield put({ type: FETCH_PROMOTION_INITIATIVE, data: program.data });

            if (program.data) {
              addDataToInitiativeForm(taskDetail.data.components, taskDetail.data.task.lastResponse.eAVs, program.data, _orgName);
            } else {
              console.log("Fetch promotion error", program);
            }
            break;
          case TaskCode.PHOTO_APP:
            console.log("fetchTaskDetail PHOTO_APP taskDetail>>", taskDetail)
            taskDetail.data.components = calculateComponentPhotoApp(taskDetail.data.components, taskDetail.data.task.lastResponse.eAVs, taskDetail.data)
            break;
          default:
            addDataToSurveyForm(taskDetail.data, _category, _orgName, _org);
        }
      }
      //if task check in
      else if (taskDetail.data.task && taskDetail.data.task.taskAction && (taskDetail.data.task.taskAction.taskActionCode === "CheckIn" ||
        taskDetail.data.task.taskAction.taskActionCode === "CheckOut")) {
        addDataToCheckInForm(taskDetail.data.components, taskDetail.data.task.lastResponse.eAVs);
      }

      else if (isSnpTask(taskDetail.data.task.taskAction.taskActionCode)) {
        switch (taskDetail.data.task.taskAction.taskActionCode) {
          case TaskCode.LIFT_ON_1:
            const currentShipment = ShipmentListManager.shipmentSelected

            taskDetail.data.components = calculateComponentLiftOn1(taskDetail.data.components, currentShipment, taskDetail.data.task)

            break;
          default:
        }
      }
      console.log('FETCH_TASK_DETAIL FROM SUCCESS AFFTER', taskDetail.data);
      taskDetail.data.isValidateSubmit = true;

      yield put({ type: FETCH_TASK_DETAIL, data: taskDetail.data });
    }
  } catch (error) {
    yield put({ type: FETCH_TASK_DETAIL_ERROR, error });
  }
};
/**
 * when receive notification, server just give taskId, so we must use this action to get actionId
 * after this, we call fetchTaskDetail to get task detail of all task
 * @param {contain taskId that need to read task info} action
 */
const fetchReadTask = function* fetchReadTask(action) {
  const response = yield call(API.taskRead, action.payload);
  const res = response.data;
  if (res && res.data && res.data.taskActionIds) {
    const readTask = res.data;
    const fetchTask = {
      payload: {
        body: {
          id: readTask.id,
          taskAction: readTask.taskActionIds[0]._id
        },
        item: readTask
      }
    };
    const item = {
      ...res.data,
    }
    Actions.taskDetail({ item })
    yield call(fetchTaskDetail, fetchTask);
  } else {
    return alert(Messages.notification.task_not_in_system);
  }
};


export { fetchTask, fetchTaskDetail, fetchReadTask };

