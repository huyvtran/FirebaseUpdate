import { SEARCH_CUSTOMER } from "../types/customer";


export const searchCustomer = (text = '', keySearch) => ({
  type: SEARCH_CUSTOMER,
  payload: {
    text,
    keySearch
  }
});
