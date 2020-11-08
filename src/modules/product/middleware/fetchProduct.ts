import { call, put, select } from 'redux-saga/effects';
import API from '../../../network/API';
import {
  FETCH_CATEGORY_LIST,
  FETCH_CATEGORY_START
} from "../actions/types/ProductActions";



const _org = state => state.org.orgSelectIds;
const _page = state => state.product.page;

const fetchCategory = function* fetchCategory() {
  const org = yield select(_org);
  try {
    const category = yield call(API.categoryListApi, org);
    if (!category.data || !category.data.data) {
      yield put({ type: FETCH_CATEGORY_LIST, error: 'err' });
      return;
    }
    yield put({ type: FETCH_CATEGORY_START });
    yield put({ type: FETCH_CATEGORY_LIST, data: category.data.data });
  } catch (error) {
    yield put({ type: FETCH_CATEGORY_LIST, error });
  }
};

export { fetchCategory };

