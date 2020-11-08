
import {
  SEARCH_CUSTOMER,
} from "../actions/types/customer";

const INITIAL_STATE = {
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_CUSTOMER:
      return { ...state, textSearchCustomer: action.payload.text, keySearch: action.payload.keySearch };
    default:
      return state;
  }
};
