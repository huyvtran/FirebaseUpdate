import {
    Freshchat,
    FreshchatConfig,
    FreshchatNotificationConfig, FreshchatUser
} from 'react-native-freshchat-sdk';
import AppConfig from '../../config/AppConfig';
import UserFreshChatManager from '../../data/UserFreshChatManager';
import { getToken } from '../../firebase/FirebaseMessage';


const initFreshChat = () => {
    var freshchatConfig = new FreshchatConfig(AppConfig.FRESH_CHAT_APP_ID, AppConfig.FRESH_CHAT_APP_KEY);
    Freshchat.init(freshchatConfig);
}

const setUser = (user) => {
    var freshchatUser = new FreshchatUser();
    freshchatUser.firstName = user.displayName;
    freshchatUser.lastName = "";
    freshchatUser.email = user.email;
    freshchatUser.phoneCountryCode = "+84";
    freshchatUser.phone = user.phoneNumber;
    Freshchat.setUser(freshchatUser, (error) => {
        console.log("FreshChat setUser error>>", error);
    });


}

const resetUser = () => {
    Freshchat.resetUser();
}

const configNotification = async () => {
    const deviceToken = await getToken();

    var freshchatNotificationConfig = new FreshchatNotificationConfig();
    freshchatNotificationConfig.priority = FreshchatNotificationConfig.NotificationPriority.PRIORITY_HIGH;
    freshchatNotificationConfig.notificationSoundEnabled = false;
    Freshchat.setNotificationConfig(freshchatNotificationConfig);
    Freshchat.setPushRegistrationToken(deviceToken);
}

const identifyUser = (user) => {
    Freshchat.identifyUser(user.externalId, user.restoreId, (error) => {
        console.log("Freshchat.identifyUser error>>", error);
    });
}

const getUser = () => {
    Freshchat.getUser((user) => {
        if (user.externalId && user.restoreId) {
            UserFreshChatManager.saveUserChatInfo(user)
        }
    })
}
const eventRestoreIdGenerate = () => {
    Freshchat.addEventListener(
        Freshchat.EVENT_USER_RESTORE_ID_GENERATED,
        () => {
            console.log("onRestoreIdUpdated triggered");
            getUser()
        }
    );
}

export default { initFreshChat, setUser, resetUser, configNotification, getUser, identifyUser, eventRestoreIdGenerate }