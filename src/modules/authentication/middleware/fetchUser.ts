import Moment from "moment/moment";
import { call, put, select } from 'redux-saga/effects';

import { fetchOrg } from '../../task/middleware/fetchOrg';
import {
    READ_USER_SUCCESS, SIGN_IN_ERROR,
    SIGN_IN_FINISH,
    SIGN_IN_START,
    SIGN_IN_SUCCESS, SIGN_IN_UN_SUCCESS, TOKEN_KEY, FETCH_USER_VEHICLE, FETCH_ORG_CONFIG
} from "../actions/types/user";
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import { Actions } from 'react-native-router-flux';
import API from "../../../network/API";
import NavigationHelper from "../../navigation/helpers/NavigationHelper";
import FreshChatManager from "../../../components/freshchat/FreshChatManager";
import UserFreshChatManager from "../../../data/UserFreshChatManager";
import PermissionUtils from "../../../utils/PermissionUtils";
import FirebaseAnalyticsManager from "../../../firebase/FirebaseAnalyticsManager";
import NotificationManager from "../../notification/NotificationManager";
import { Localize } from "../../setting/languages/LanguageManager";
import messages from "../../../constant/Messages";
import FirebaseDatabaseManager from "../../../firebase/FirebaseDatabaseManager";
import UserActions from "../../../firebase/UserActions";
import { FORCE_FINGER_PRINT, ADD_REMEMBER_LOGIN_DATA } from "../../../store/constant/actionTypes";
import { ISignIn } from "../../../network/auth/ISignIn";

const SERVER_ERROR = 502;

const org = state => state.org.orgSelectIds;

const fetchSignIn = function* fetchSignIn(action) {
    try {
        yield put({ type: SIGN_IN_START });
        const res = yield call(API.signIn, action.payload.body);
        console.log("APIResponse fetchSignIn resSignin>>", res);
        if (res.status === 200) {
            yield call(fetchDataAfterSignIn, { resSignin: res, bodySignin: action.payload.body });
        } else if (res && res.data && res.data.two_step_actived) {
            console.log("APIResponse fetchSignIn action.payload.body>>", action.payload.body);
            Actions.secondStepSign({ resSignin: res.data, bodySignin: action.payload.body, });

        } else {
            if (res.status == SERVER_ERROR) {
                yield put({
                    type: SIGN_IN_UN_SUCCESS,
                    payload: 'Server error'
                });
                return;
            }
            res.problem == "TIMEOUT_ERROR" ?
                yield put({
                    type: SIGN_IN_UN_SUCCESS,
                    payload: 'Kiểm tra kết nối mạng'
                }) :
                yield put({
                    type: SIGN_IN_UN_SUCCESS,
                    payload: res.data
                });
        }
    } catch (error) {
        console.log("APIResponse fetchSignIn error>>", error);
        yield put({
            type: SIGN_IN_ERROR,
            error
        });
    }
};

const fetchUserVehicle = function* fetchUserVehicle(bodyUserReadVehicle) {
    const vehicle = yield call(API.userReadVehicle, bodyUserReadVehicle);
    return vehicle && vehicle.data && (yield put({
        type: FETCH_USER_VEHICLE,
        data: vehicle.data
    }));
};

const fetchOrgConfig = function* fetchOrgConfig() {
    const _org = yield select(org);
    const orgConfig = yield call(API.userOrgConfig, { organizationIds: _org });
    // console.log("APIResponse fetchOrgConfig >>", orgConfig);
    return orgConfig && orgConfig.data && (yield put({
        type: FETCH_ORG_CONFIG,
        data: orgConfig.data
    }));
};

const fetchDataAfterSignIn = function* fetchDataAfterSignIn({ resSignin, bodySignin }) {

    const user:ISignIn = resSignin && resSignin.data ? resSignin.data : {};

    const { username, rememberMe } = bodySignin;
    
    if (user._id) {
        //save token in local storage
        const cookie = resSignin.headers["set-cookie"][0];
        const tokenKey = cookie.substring(
            cookie.indexOf("=") + 1,
            cookie.indexOf(";")
        );
        yield put({
            type: TOKEN_KEY,
            token: tokenKey
        });
        if (user && !_.isEmpty(user.pwd_warning)) {
            NotificationManager.showMessageBar(Localize(messages.yourPassSoWeak), undefined, undefined);

            Actions.changePassword();
            yield put({ type: SIGN_IN_FINISH });

            return;

        }

        //fetch user profile/data
        const readUserData = yield call(API.readUser, user._id);
        const userDetail = readUserData && readUserData.data && readUserData.data.data ? readUserData.data.data : null;
        yield put({
            type: READ_USER_SUCCESS,
            data: readUserData.data
        });

        //fetch user's organization
        yield call(fetchOrg);

        //navigation to task list or view vehicle with deliver
        const bodyUserReadVehicle = {
            dataDate: Moment()
                .startOf('day'),
            organizationId: user.organizationIds && user.organizationIds.length > 0 ? user.organizationIds[0] : []
        };
        // console.log("APIResponse fetchDataAfterSignIn bodyUserReadVehicle>>", bodyUserReadVehicle);
        const actionUserVehicle = yield call(fetchUserVehicle, bodyUserReadVehicle);

        // fetch org config
        yield call(fetchOrgConfig);

        //init Fresh chat
        FreshChatManager.initFreshChat();
        FreshChatManager.setUser(userDetail);
        const userFreshChat = {
            externalId: userDetail.email
        };
        const userFreshChatInfo = UserFreshChatManager.findUserChatInfo(userFreshChat);

        if (userFreshChatInfo) {
            FreshChatManager.identifyUser(userFreshChatInfo);
        } else {
            FreshChatManager.identifyUser(userFreshChat);
        }
        FreshChatManager.eventRestoreIdGenerate();


        //FirebaseAnalytics
        userDetail && FirebaseDatabaseManager.reportUserInfomation(userDetail);
        userDetail && FirebaseDatabaseManager.reportUserDeviceInfo(userDetail);
        userDetail && FirebaseAnalyticsManager.logEvent(UserActions.LOGIN, {
            username: userDetail.username,
            email: userDetail.email
        });

        const permissions = PermissionUtils.getUserPermission(readUserData.data.data);

        yield put({
            type: SIGN_IN_SUCCESS,
            user: resSignin.data,
            pushInfo: bodySignin,
            token: tokenKey,
            permissions
        });
        yield put({
            type: FORCE_FINGER_PRINT,
            date: false
        });

        yield put({
            type: 'DEVICE_BUILD_NUMBER',
            data: { buildNumber: DeviceInfo.getBuildNumber() },
        });
        yield put({
            type: ADD_REMEMBER_LOGIN_DATA,
            data: {
                username,
                rememberMe
            },
        });
        yield put({ type: SIGN_IN_FINISH });


        // in case user is deliverer => navigate to view vehicle screen
        if (actionUserVehicle && actionUserVehicle.data && actionUserVehicle.data.vehicleCode) {
            Actions.reset('viewVehicle');
        } else {
            NavigationHelper.navigateRoleMainScene(readUserData.data.data);
        }

    } else {
        yield put({
            type: SIGN_IN_UN_SUCCESS,
            payload: resSignin.problem
        });
    }
};

export { fetchSignIn, fetchDataAfterSignIn };

//IN house , outsourcing, 
