import { CHANGE_FINGER_PRINT_SETTING, ADD_USER_FINGER_PRINT_DATA, FORCE_FINGER_PRINT } from "../constant/actionTypes"
export function changeFingerPrintSetup(isEnable) {
    return {
        type: CHANGE_FINGER_PRINT_SETTING,
        data: isEnable,
    }
}

export function forceFingerPrint(isOpen) {
    return {
        type: FORCE_FINGER_PRINT,
        data: isOpen,
    }
}


export function addUserMetaData(userData) {
    return {
        type: ADD_USER_FINGER_PRINT_DATA,
        data: userData,
    }
}