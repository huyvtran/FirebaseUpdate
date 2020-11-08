import {
  FETCH_ORDER_LIST,
  SEARCH_ORDER_LIST
} from "../types/OrderActions";
import {
  CHANGE_DISCOUNT,
  CHANGE_SKU_NUMBER
} from "../../../product/actions/types/ProductActions";


export const changeSkuNumber = (payload) => ({
  type: CHANGE_SKU_NUMBER,
  payload,
});
export const changeDiscount = (payload) => ({
  type: CHANGE_DISCOUNT,
  payload,
});

export const searchOrder = (text) => ({
  type: SEARCH_ORDER_LIST,
  payload: text,
});

