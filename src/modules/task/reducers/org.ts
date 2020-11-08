import { IOrganizationData } from "../../../network/organization/IOrganizations";
import store from "../../../store/store";
import { FETCH_ORG_LIST, ORG_SELECT } from "../actions/types/OrgActions";
import { getRoleOrderDelete } from "../helper/FunctionHelper";

export interface IOrganizationState {
  orgList: IOrganizationData[],
  orgSelect: IOrganizationData[],
  //danh sách id của tổ chức
  orgSelectIds: string[],
}

export interface IOrganizationStore {
  type: string;
  data: IOrganizationData[];
}

const INITIAL_STATE: IOrganizationState = {
  orgList: [],
  orgSelect: null,
  orgSelectIds: [],
};

export default (state = INITIAL_STATE, action: IOrganizationStore) => {
  switch (action.type) {
    case FETCH_ORG_LIST:
      return { ...state, orgList: action.data };
    case ORG_SELECT:
      const storeApp = store.getState();
      const roleIds = storeApp.user.readUser.roleIds;
      const orgSelectIds = action.data.map(e => e.id);
      const orderRole = roleIds.length && getRoleOrderDelete(roleIds, orgSelectIds);
      console.log("orgSelect: ", action.data);
      return { ...state, orgSelect: action.data, orgSelectIds, orderRole };
    default:
      return state;
  }
};
