import { call, put } from 'redux-saga/effects';
import API from '../../../network/API';
import { FETCH_ORG_LIST, ORG_SELECT } from "../actions/types/OrgActions";

const roleIds = state => state.user.readUser.roleIds;

/**
 * Lấy danh sách tổ chức
 * IOrganizations
 */
const fetchOrg = function* fetchOrg() {
  const org = yield call(API.getOrganizationList);
  // console.log('fetchOrgList', org);
  if (!org || !org.data || !org.data.data) {
    yield put({ type: ORG_SELECT, error: 'error' });

    return;
  }
  yield put({ type: FETCH_ORG_LIST, data: org.data.data });
  yield put({ type: ORG_SELECT, data: org.data.data });

};


export { fetchOrg };

