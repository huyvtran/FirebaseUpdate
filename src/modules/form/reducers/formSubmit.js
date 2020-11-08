import {
  SUBMIT_FORM_ERROR,
  SUBMIT_FORM_RESET, SUBMIT_FORM_SUCCESS,
  SUBMIT_FORM_UN_SUCCESS
} from "../actions/types/FormActions";

const INITIAL_STATE = {
  data: [],
  message: null,
  error: null,
  success: false,
  loading: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SUBMIT_FORM_RESET:
      return { ...INITIAL_STATE };
    case SUBMIT_FORM_SUCCESS:
      return { ...state, data: action.data, message: action.message, success: true };
    case SUBMIT_FORM_UN_SUCCESS:
      return { ...state, message: action.message };
    case SUBMIT_FORM_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
