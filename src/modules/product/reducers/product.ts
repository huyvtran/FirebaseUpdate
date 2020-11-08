import {
  SEARCH_PRODUCT
} from "../actions/types/ProductActions";

const INITIAL_STATE = {
  data: [],
  inventoryList: [],
  searchData: [],
  loading: true,
  page: 1,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case SEARCH_PRODUCT:
      return { ...state, textSearchProduct: action.payload.text, keySearch: action.payload.keySearch };
      
    default:
      return state;
  }
};
