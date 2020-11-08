import {LOAD_ORG, ORG_SELECT} from "../types/OrgActions";

export const orgSelect = (data) => ({
  type: ORG_SELECT,
  data,
});
export const loadOrg = () => ({type: LOAD_ORG});

