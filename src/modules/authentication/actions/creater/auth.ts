import { Actions } from "react-native-router-flux";
import FreshChatManager from "../../../../components/freshchat/FreshChatManager";
import TaskImplementingManager from "../../../../data/TaskImplementingManager";
import FirebaseAnalyticsManager from "../../../../firebase/FirebaseAnalyticsManager";
import UserActions from "../../../../firebase/UserActions";
import TrackLocationManager from "../../../locations/TrackLocationManager";
import { FETCH_DATA_AFTER_SIGN_IN, LOAD_SIGN_IN, USER_LOGOUT } from "../types/user";


export const loadSignIn = (body) => ({
    type: LOAD_SIGN_IN,
    payload: { body }
});

export const loadDataAfterSignIn = (resSignin, bodySignin) => ({
    type: FETCH_DATA_AFTER_SIGN_IN,
    resSignin,
    bodySignin

});

export function logout() {
    return async (dispatch) => {
        // Should accept user login without deviceId or deviceToken
        FirebaseAnalyticsManager.logEvent(UserActions.LOGOUT);
        FreshChatManager.resetUser();
        TrackLocationManager.removeTrackLocation();
        TaskImplementingManager.clear();
        Actions.reset('login');
        return dispatch({
            type: USER_LOGOUT,
        });
    };
}

