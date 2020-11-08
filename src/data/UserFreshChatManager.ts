import _ from 'lodash';
import * as LocalStorage from './LocalStorage';

const UserFreshChatStore = {
    userChatInfo: []
};

const USER_FRESH_CHAT = 'userFreshChat';

class UserFreshChatManager {
    public static initialize = () => {
        return LocalStorage.get(USER_FRESH_CHAT, (error, result) => {
            UserFreshChatStore.userChatInfo = _.isEmpty(result) ? [] : JSON.parse(result);
        });
    };

    public static saveUserChatInfo = (user) => {
        const userFreshChat = {
            restoreId: user.restoreId,
            externalId: user.externalId,
        }

        const index = _.findIndex(UserFreshChatStore.userChatInfo, (userItem) => {
            return user.externalId === userItem.externalId
        })
        if (index >= 0) {
            UserFreshChatStore.userChatInfo[index] = userFreshChat;
        } else {
            UserFreshChatStore.userChatInfo.push(userFreshChat);
        }

        return LocalStorage.set(USER_FRESH_CHAT, UserFreshChatStore.userChatInfo);
    };

    public static clear = () => {
        UserFreshChatStore.userChatInfo = [];
        LocalStorage.set(USER_FRESH_CHAT, UserFreshChatStore.userChatInfo);
    };

    public static getUserChatInfo = () => {
        return UserFreshChatStore.userChatInfo;
    };

    public static removeUserChatInfo = (user) => {
        UserFreshChatStore.userChatInfo = UserFreshChatStore.userChatInfo.filter(userItem => {
            return user.externalId !== userItem.externalId
        });

        return LocalStorage.set(USER_FRESH_CHAT, UserFreshChatStore.userChatInfo);
    };


    public static findUserChatInfo = (user) => {
        const index = _.findIndex(UserFreshChatStore.userChatInfo, (userItem) => {
            return user.externalId === userItem.externalId
        })
        if (index >= 0) {
            return UserFreshChatStore.userChatInfo[index]
        }

        return null;
    };

    public static editUserChatInfo = (user) => {
        const index = _.findIndex(UserFreshChatStore.userChatInfo, (userItem) => {
            return user.externalId === userItem.externalId
        })

        if (index >= 0) {
            UserFreshChatStore.userChatInfo[index] = user;
        }
        return LocalStorage.set(USER_FRESH_CHAT, UserFreshChatStore.userChatInfo);
    }
}




export default UserFreshChatManager;