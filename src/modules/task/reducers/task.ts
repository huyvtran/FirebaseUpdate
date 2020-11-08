import _ from 'lodash';
import Moment from "moment/moment";
import FormType from "../../../constant/FormType";
import { ADD_FORM, SET_VALIDATE_SUBMIT } from "../../form/actions/types/FormActions";
import {
  ADD_TASK_RESULT, EDIT_TASK_DETAIL,
  FETCH_PROMOTION_INITIATIVE, FETCH_PROMOTION_VFAST,
  FETCH_TASK_DETAIL, FETCH_TASK_DETAIL_ERROR,
  FETCH_TASK_DETAIL_START,
  FETCH_TASK_LIST,
  FETCH_TASK_LIST_ERROR,
  FETCH_TASK_LIST_START, FETCH_TASK_ORDERS, RELOAD_TASK_LIST, RESET_TASK_DETAIL
} from "../actions/types/task";
import {
  addFormBaseActionHandle,
  addFormINITask,
  addFormPhotoAppTask, checkBaseAction,
  isInitiativeTask,
  isPhototAppTask, itemTypeCompare,
  itemTypeCompareBaseAction
} from "../helper/FunctionHelper";

const INITIAL_STATE = {
  data: [],
  taskDetailInitial: null,
  taskDetail: null,
  componentsWithoutCalculate: null,
  taskAction: [],
  loading: true,
  loadingTaskDetail: true,
  reloadTaskList: false,
  currentDate: Moment(),
  promotion: null,
  orders: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_TASK_LIST_START:
      return { ...state, currentDate: action.data ? action.data : state.currentDate, loading: true };
    case FETCH_TASK_LIST:
      return { ...state, data: action.data, loading: false, isLoadingTasksError: false };
    case FETCH_TASK_ORDERS:
      return { ...state, orders: action.data, loading: false };
    case FETCH_TASK_LIST_ERROR:
      return { ...state, loading: false, isLoadingTasksError: true, data: [] };
    case RELOAD_TASK_LIST:
      return { ...state, reloadTaskList: !state.reloadTaskList };

    case FETCH_TASK_DETAIL_START:
      return { ...state, loadingTaskDetail: true };

    case FETCH_TASK_DETAIL:
      return {
        ...state, taskDetailInitial: _.cloneDeep(action.data), taskDetail: _.cloneDeep(action.data), loadingTaskDetail: false
      };
    case FETCH_TASK_DETAIL_ERROR:
      return { ...state, loadingTaskDetail: false };

    case FETCH_PROMOTION_VFAST:
      return { ...state, promotion: action.data };

    case FETCH_PROMOTION_INITIATIVE:
      return { ...state, promotion: action.data };

    case EDIT_TASK_DETAIL:

      return { ...state, taskDetail: action.data, loadingTaskDetail: false };

    case SET_VALIDATE_SUBMIT:

      return { ...state, taskDetail: { ...state.taskDetail, isValidateSubmit: action.data } };
    case ADD_TASK_RESULT:

      return { ...state, taskDetail: { ...state.taskDetail, note: action.payload } };

    case ADD_FORM:

      const baseAction = checkBaseAction(state.taskDetail.task.taskAction.taskActionCode);
      const { taskActionCode } = state.taskDetail.task.taskAction
      const components = state.taskDetail && state.taskDetail.components && state.taskDetail.components.map((e) => {
        if (e.type === FormType.PANEL) {
          const subComponent = e.components && e.components.map(e1 => (baseAction ?
            itemTypeCompareBaseAction(e1, action, baseAction) :
            itemTypeCompare(e1, action)));
          return { ...e, components: subComponent };
        }
        return baseAction ?
          itemTypeCompareBaseAction(e, action, baseAction) :
          itemTypeCompare(e, action);
      });

      if (isInitiativeTask(taskActionCode)) {
        addFormINITask(state, action, components);
      } else if (isPhototAppTask(taskActionCode)) {
        state.taskDetail.task.lastResponse.eAVs = addFormPhotoAppTask(action);

      } else if (baseAction) {
        addFormBaseActionHandle(state, action, components);
      } else if (state.taskDetail.task.taskAction.taskActionCode === 'CheckIn' || state.taskDetail.task.taskAction.taskActionCode === 'CheckOut') {
        state.taskDetail.task.lastResponse.eAVs = [];
        const taskInit = state.taskDetailInitial.task;
        const entityId = taskInit.organization._id;
        const attributeCode = state.taskDetail.task.taskAction.taskActionCode === 'CheckIn' ? 'CheckIn Photo' : 'CheckOut Photo'
        const evas = {
          value: action.data.data[0].value,
          entityId,
          attributeCode
        }
        state.taskDetail.task.lastResponse.eAVs.unshift(evas)
      }

      return {
        ...state, taskDetail: { ...state.taskDetail, components, isImplemeting: true },
      };

    case RESET_TASK_DETAIL:
      return { ...state, taskDetail: null };

    default:
      return state;
  }
};
