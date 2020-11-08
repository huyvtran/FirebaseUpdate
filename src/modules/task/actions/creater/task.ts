import {
  LOAD_TASK,
  LOAD_TASK_DETAIL,
  RELOAD_TASK_LIST,
  READ_TASK,
  ADD_TASK_RESULT,
  FETCH_TASK_DETAIL,
  FETCH_TASK_LIST,
  FETCH_TASK_ORDERS
} from "../types/task";

export const reloadTaskList = () => ({
  type: RELOAD_TASK_LIST,
});

export const loadTask = (date) => ({
  type: LOAD_TASK,
  payload: { date }
});

export const fetchTaskList = (taskList) => ({
  type: FETCH_TASK_LIST,
  data: taskList
});

export const fetchTaskOrders = (orderList) => ({
  type: FETCH_TASK_ORDERS,
  data: orderList
});

export const addTaskResult = (taskResult) => ({
  type: ADD_TASK_RESULT,
  payload: taskResult
});

export const loadTaskDetail = (body, item) => ({
  type: LOAD_TASK_DETAIL,
  payload: {
    body,
    item
  }
});

export const loadTaskImplementing = (action) => ({
  type: FETCH_TASK_DETAIL,
  data: action.data
})

export const readTask = (taskId) => ({
  type: READ_TASK,
  payload: {
    taskId
  }
});

