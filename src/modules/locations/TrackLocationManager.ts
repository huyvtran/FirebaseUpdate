import Moment from "moment/moment";
import {
    NativeModules,
    Platform
} from 'react-native';
import Geolocation from '../../components/geolocation/Geolocation';
import FirebaseAnalyticsManager from '../../firebase/FirebaseAnalyticsManager';
import FirebaseDatabaseManager from '../../firebase/FirebaseDatabaseManager';
import UserActions from '../../firebase/UserActions';
import API from '../../network/API';
import { API_UPDATE_LOCATIONS } from '../../network/URL';
import store from '../../store/store';
import { startTrackLocation, stopTrackLocation } from './trackLocal';

const { RNTrackLocationService } = NativeModules;


const isValidateTrackLoccation = (taskList, dateSelect) => {
    if (!taskList || taskList.length === 0) {
        return false
    }
    const today = Moment()
    if (!dateSelect || !today.isSame(Moment(dateSelect), 'day')) {
        return false
    }

    return true

}
const trackLocationAndroid = (routeId, shipmentId, vehicleId = "", shipmentAssignedList = []) => {
    FirebaseAnalyticsManager.logEvent(UserActions.START_TRACKING)

    const storeState = store.getState();
    const orgSelectIds = storeState.org.orgSelectIds[0];
    const accessToken = storeState.user.token;
    const URL = API.baseUrl() + API_UPDATE_LOCATIONS;

    console.log('BackgroundGeolocation location trackLocationAndroid:', URL);

    RNTrackLocationService.startTrackLocation(URL, accessToken, orgSelectIds, shipmentId, routeId, vehicleId, shipmentAssignedList)
}

const trackLocationIos = (routeId, shipmentId) => {
    FirebaseAnalyticsManager.logEvent(UserActions.START_TRACKING)
    startTrackLocation(routeId, shipmentId)
}

const stopTrackLocationIos = () => {
    FirebaseAnalyticsManager.logEvent(UserActions.STOP_TRACKING)
    stopTrackLocation()
}

const stopTrackLocationAndroid = () => {
    FirebaseAnalyticsManager.logEvent(UserActions.STOP_TRACKING)
    RNTrackLocationService.stopTrackLocation();
}

const trackLocation = Platform.select({
    ios: trackLocationIos,
    android: trackLocationAndroid,
});

const removeTrackLocation = Platform.select({
    ios: () => stopTrackLocationIos(),
    android: () => stopTrackLocationAndroid(),
});

const getCurrentLocation = (onSuccess, onError, enableHighAccuracy = true) => {
    Geolocation.getCurrentPosition(
        (position) => {
            onSuccess(position)
            FirebaseDatabaseManager.reportUserLocationInfo(position ? position.coords : null)
        },
        onError,
        { enableHighAccuracy, timeout: 15000, maximumAge: 5000 }
    );
}

export default { trackLocation, removeTrackLocation, getCurrentLocation, isValidateTrackLoccation }