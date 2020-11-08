import _ from 'lodash';
import analytics from '@react-native-firebase/analytics';
import { Actions } from "react-native-router-flux";

const FirebaseAnalytics = analytics();

FirebaseAnalytics.setAnalyticsCollectionEnabled(true);

/**
 * được sử dụng để gửi thông tin màn hình sử dụng hiện tại lên firebase
 */
const sendScreenInfoToFirebase = () => {
    const key = Actions.currentScene
    if (_.isEmpty(key)) {
        return
    }
    // FirebaseAnalytics.logEvent(key.toUpperCase(), { key });
    FirebaseAnalytics.logScreenView({screen_name: key.toUpperCase()})
}

/**
 * Định danh userid cho firebase, hiện tại chưa sử dụng
 * @param userId 
 */
const setUserIdFirebaseAnalytics = (userId) => {
    FirebaseAnalytics.setUserId(userId)
}

/**
 * sử dụng để thiết lập thông tin tài khoản, hiện tại chưa sử dụng
 * @param user 
 */
const sendUserInfoToFirebase = (user:any) => {
    !_.isEmpty(user.email) && FirebaseAnalytics.setUserProperty('email', user.email)
    !_.isEmpty(user.username) && FirebaseAnalytics.setUserProperty('username', user.username)
    !_.isEmpty(user.phoneNumber) && FirebaseAnalytics.setUserProperty('phoneNumber', user.phoneNumber)
    !_.isEmpty(user.displayName) && FirebaseAnalytics.setUserProperty('displayName', user.displayName)
}

/**
 * Dùng để gửi các sự kiện lên server
 * @param eventName 
 * @param params 
 */
const logEvent = (eventName: string, params?: { [key: string]: any }) => {
    FirebaseAnalytics.logEvent(eventName, params)
}

export default { sendScreenInfoToFirebase, setUserIdFirebaseAnalytics, sendUserInfoToFirebase, logEvent }