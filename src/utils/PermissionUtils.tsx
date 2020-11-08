
import SystemSetting from 'react-native-system-setting'
import { Platform } from 'react-native'
import Permissions from 'react-native-permissions'
import messages from '../constant/Messages';
import { Localize } from '../modules/setting/languages/LanguageManager';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import TabsCode from '../modules/navigation/tabs/TabsCode';
import store from '../store/store';
import _ from 'lodash'
import AlertUtils from './AlertUtils';

const PERMISSIONS_STATUS = {
    /**
     * User has authorized this permission
     */
    AUTHORIZED: 'authorized',

    /**
     * User has denied this permission at least once. On iOS this means that the user will not be prompted again. 
     * Android users can be prompted multiple times until they select 'Never ask me again'
     */
    DENIED: 'denied',
    /**
     * iOS - this means user is not able to grant this permission, either because it's not supported 
     * by the device or because it has been blocked by parental controls. 
     * Android - this means that the user has selected 'Never ask me again' while denying permission
     */

    RESTRICTED: 'restricted',
    /**
     * User has not yet been prompted with a permission dialog
     */
    UNDETERMINED: 'undetermined',


    /**
     * not enable location service (GPS)
     */
    DISABLEGPS: 'disablegps'
}
/**
 * check location is enable and user allow you user location permission, or not
 */
function checkLocationPermission() {
    const isLocationEnable = SystemSetting.isLocationEnabled();
    const permisstionCheckLocation = Permissions.check('location');
    const checkLocationInHighAccuracy = Platform.OS === 'android' ? LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: Localize(messages.requestPermissonInHightAccuracy),
        ok: 'YES',
        cancel: 'NO',
        enableHighAccuracy: true,
        showDialog: true,
        openLocationServices: true,
        preventOutSideTouch: false,
        preventBackClick: false,
    }) : Promise.resolve(true);
    return Promise.all([isLocationEnable, permisstionCheckLocation, checkLocationInHighAccuracy]).then(values => {
        if (!values[0]) {
            AlertUtils.showWarning(messages.notEnableLocationForCheckIn)
            return PERMISSIONS_STATUS.DISABLEGPS;
        }
        else if (values[1] !== PERMISSIONS_STATUS.AUTHORIZED) {

            return Permissions.request('location').then(response => {
                // Returns once the user has chosen to 'allow' or to 'not allow' access
                // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
                if (response !== PERMISSIONS_STATUS.AUTHORIZED) {
                    AlertUtils.showWarning(messages.notAllowLocation)

                }
                return response;
            })

        } else if (!values[2]) {
            return PERMISSIONS_STATUS.DISABLEGPS;
        } else {
            return PERMISSIONS_STATUS.AUTHORIZED
        }
    }).catch(err => {
        return PERMISSIONS_STATUS.DISABLEGPS;
    });
}
const checkReadPhoneStatePermission = () => {
    if (Platform.OS === 'android') {
        return Permissions.check('readPhoneState').then(response => {
            if (response !== PERMISSIONS_STATUS.AUTHORIZED) {
                return Permissions.request('readPhoneState')
            }
            return PERMISSIONS_STATUS.AUTHORIZED
        });
    }
    return Promise.resolve(PERMISSIONS_STATUS.RESTRICTED)

}

const checkMicroPhonePermission = ()=> {
    return Permissions.check('microphone').then(response => {
        if (response !== PERMISSIONS_STATUS.AUTHORIZED) {
            return Permissions.request('microphone')
        }
        return PERMISSIONS_STATUS.AUTHORIZED
    });
}

const getUserPermission = (userData) => {
    let permission = {}
    userData.roleIds.forEach(role => {
        permission[role.organizationId] = role.permissions[0]
    })
    return permission
}

const isGrantViewPermission = (orgSelectedId, tabCode) => {
    const { permissions } = store.getState().user
    if (!orgSelectedId || !permissions[orgSelectedId]) {
        return false
    }
    return _.includes(permissions[orgSelectedId].view, tabCode);
}

const isGrantUpdatePermission = (orgSelectedId, tabCode) => {
    const { permissions } = store.getState().user
    return _.includes(permissions[orgSelectedId].update, tabCode)
}

const isGrantCreatePermission = (orgSelectedId, tabCode) => {
    const { permissions } = store.getState().user
    return _.includes(permissions[orgSelectedId].insert, tabCode)
}

const isGrantDeletePermission = (orgSelectedId, tabCode) => {
    const { permissions } = store.getState().user
    return _.includes(permissions[orgSelectedId].delete, tabCode)
}

const isGrantCreateOrder = (orgSelectedId) => {
    return isGrantCreatePermission(orgSelectedId, TabsCode.ORDERS)
}

const isGrantUpdateOrder = (orgSelectedId) => {
    return isGrantUpdatePermission(orgSelectedId, TabsCode.ORDERS)
}

const isGrantDeleteOrder = (orgSelectedId) => {
    return isGrantDeletePermission(orgSelectedId, TabsCode.ORDERS)
}

export default {
    PERMISSIONS_STATUS,
    checkLocationPermission,
    isGrantCreateOrder,
    isGrantUpdateOrder,
    isGrantDeleteOrder,
    getUserPermission,
    isGrantViewPermission,
    checkReadPhoneStatePermission,
    checkMicroPhonePermission
}