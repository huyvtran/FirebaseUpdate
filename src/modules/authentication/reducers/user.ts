import messages from "../../../constant/Messages";
import { Localize } from "../../setting/languages/LanguageManager";
import {
  FETCH_ORG_CONFIG, FETCH_USER_VEHICLE, READ_USER_SUCCESS, SIGN_IN_ERROR,
  SIGN_IN_FINISH,
  SIGN_IN_START, SIGN_IN_SUCCESS, SIGN_IN_UN_SUCCESS, TOKEN_KEY
} from "../actions/types/user";

const initialState = {
  isAuthenticated: false,
  user: null,
  readUser: null,
  message: null,
  loading: false,
  token: null
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN_START:
      return { ...state, loading: true };
    case READ_USER_SUCCESS:
      return { ...state, readUser: action.data.data };
    case SIGN_IN_FINISH:
      return { ...state, loading: false };
    case SIGN_IN_SUCCESS:
      return { ...state, user: action.user, pushInfo: action.pushInfo, isAuthenticated: true, permissions: action.permissions };
    case TOKEN_KEY:
      return { ...state, token: action.token };
    case SIGN_IN_UN_SUCCESS:
      return { ...state, message: action.payload, isAuthenticated: false, loading: false };
    case FETCH_USER_VEHICLE:
      return { ...state, vehicle: action.data }
    case FETCH_ORG_CONFIG:
      return { ...state, orgConfig: action.data }
    case SIGN_IN_ERROR:
      let message = '';
      if (action.error && action.error.response && action.error.response.data && action.error.response.data.message) {
        message = action.error.response.data.message
      } else if (action.error.message) {
        message = action.error.message
      } else {
        message = Localize(messages.networkError)
      }
      return { ...state, message, loading: false };
    default:
      return state;
  }
};
