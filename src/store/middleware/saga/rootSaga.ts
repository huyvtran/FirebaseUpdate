import 'regenerator-runtime/runtime';

import { all, takeLatest } from 'redux-saga/effects';
import { fetchTask, fetchTaskDetail, fetchReadTask } from '../../../modules/task/middleware/fetchTask';
import {
  fetchDataAfterSignIn,
  fetchSignIn
} from '../../../modules/authentication/middleware/fetchUser';
import { LOAD_TASK, LOAD_TASK_DETAIL, READ_TASK } from "../../../modules/task/actions/types/task";
import {
  FETCH_DATA_AFTER_SIGN_IN,
  LOAD_SIGN_IN
} from '../../../modules/authentication/actions/types/user';



const rootSaga = function* root() {
  yield all([
    takeLatest(LOAD_TASK, fetchTask),
    takeLatest(LOAD_TASK_DETAIL, fetchTaskDetail),
    takeLatest(READ_TASK, fetchReadTask),
    takeLatest(LOAD_SIGN_IN, fetchSignIn),
    takeLatest(FETCH_DATA_AFTER_SIGN_IN, fetchDataAfterSignIn),
  ]);
};

export default rootSaga;
