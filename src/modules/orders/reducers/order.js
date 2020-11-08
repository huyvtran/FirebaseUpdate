import {
  SEARCH_ORDER_LIST,

} from "../actions/types/OrderActions";
import {
  CHANGE_DISCOUNT,
  CHANGE_SKU_NUMBER
} from "../../product/actions/types/ProductActions";

const INITIAL_STATE = {
  dataSaleOrder: [],
  dataPurchaseOrder: [],
  orderDataDetail: {
    skuList: [],
    promotionDiscount: 0,
    saleDiscount: 0,
    customerDiscount: 0,
    totalPrice: 0,
  },
  customerFillOrderEdit: null,
  loading: true,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case CHANGE_SKU_NUMBER:
      const skuListChange = calculateSkuPrice(action.payload, state.orderDataDetail.skuList);
      return {
        ...state,
        orderDataDetail: { ...state.orderDataDetail, skuListChange },
        loading: false
      };
    case CHANGE_DISCOUNT:
      return {
        ...state,
        orderDataDetail: { ...state.orderDataDetail, [action.payload.discountType]: action.payload.discountPrice },
        loading: false
      };

    case SEARCH_ORDER_LIST:
      return {
        ...state,
        textSearchOrder: action.payload
      }
    default:
      return state;
  }
};

const calculateSkuPrice = (payload, skuList) => {
  const sku = payload.sku;

  return skuList.map(e => {
    if (e.sku === sku) {
      const numberOfCase = payload.numberOfCase === '' ? 0 : (payload.numberOfCase || e.numberOfCase);
      const numberOfItem = payload.numberOfItem === '' ? 0 : (payload.numberOfItem || e.numberOfItem);
      const SKUPrice = numberOfCase * e.casePrice + numberOfItem * e.itemPrice;
      return { ...e, numberOfCase, numberOfItem, SKUPrice };
    }
    return e;
  });
};

