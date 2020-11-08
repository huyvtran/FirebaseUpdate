import {
  SEARCH_PRODUCT
} from "../types/ProductActions";

export const searchProduct = (text = '', keySearch) => ({type: SEARCH_PRODUCT,
  payload: {
    text,
    keySearch
  }
});

