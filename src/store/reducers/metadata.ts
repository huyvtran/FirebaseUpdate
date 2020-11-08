import { CHANGE_FINGER_PRINT_SETTING, ADD_USER_FINGER_PRINT_DATA, FORCE_FINGER_PRINT, ADD_REMEMBER_LOGIN_DATA } from "../constant/actionTypes";

// Set initial state
const initialState = {
};

export default function metadata(state = initialState, action) {
    switch (action.type) {
        case CHANGE_FINGER_PRINT_SETTING:
            return {
                ...state,
                isEnableFingerPrint: action.data,
            }
        case ADD_USER_FINGER_PRINT_DATA:
            return {
                ...state,
                userFingerPrintData: action.data,
            }
        case FORCE_FINGER_PRINT:
            return {
                ...state,
                fingerPrintClose: action.data
            }
        case ADD_REMEMBER_LOGIN_DATA:
            return {
                ...state,
                rememberSigninData: action.data
            }

        default:
            return state;
    }
}