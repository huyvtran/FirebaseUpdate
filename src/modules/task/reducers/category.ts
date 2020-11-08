import {
  FETCH_CATEGORY_START
} from "../../product/actions/types/ProductActions";
import {FETCH_CATEGORY_LIST} from "../../product/actions/types/ProductActions";

const INITIAL_STATE = {
  data: [],
  loading: true,
};


export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_START:
      return { ...state, loading: true };
    case FETCH_CATEGORY_LIST:
      return { ...state, data: action.data, loading: false };
    default:
      return state;
  }
};
