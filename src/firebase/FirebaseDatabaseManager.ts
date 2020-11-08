import _ from 'lodash';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import database from '@react-native-firebase/database';
import AppConfig from '../config/AppConfig';
import API from '../network/API';
import store from '../store/store';

const FirebaseDatabase = database();


function trackRouteLocation(routeId, locationBody) {
    // FirebaseDatabase.ref('trackLocation').child("route").child(routeId).push().set(locationBody);
    FirebaseDatabase.ref('trackLocation')
        .child("route")
        .child(routeId)
        .set(locationBody);
}

function trackShipmentLocation(shipmentId, locationBody) {
    // FirebaseDatabase.ref('trackLocation').child("shipment").child(shipmentId).push().set(locationBody);
    FirebaseDatabase.ref('trackLocation')
        .child("shipment")
        .child(shipmentId)
        .set(locationBody);
}

function reportUserMockLocation(user) {
    FirebaseDatabase.ref('usersMockLocation/' + (new Date()).getTime())
        .set({
            displayName: user.displayName,
            email: user.email,
            username: user.username,
            organizationIds: user.organizationIds,
            platform: Platform.OS,
            brand: DeviceInfo.getBrand(),
            OSVersion: DeviceInfo.getVersion()
        });

}

function reportOrgInfomations(orgInfomations) {
    FirebaseDatabase.ref('orgInfomations/')
        .set(orgInfomations);

}

function reportUserInfomation(user) {
    if (!AppConfig.isRunLog) {
        return;
    }

    try {
        const userInfo = {
            displayName: user.displayName,
            email: user.email,
            username: user.username,
            organizationIds: user.organizationIds,
        };
        // FirebaseDatabase.ref('userInfomation/' + user._id).set(userInfo);
        API.reportUserInfomation(user, userInfo);
    } catch (error) {
        console.log("reportUserInfomation error>>", error);
    }

}

function reportUserDeviceInfo(user) {
    if (!AppConfig.isRunLog) {
        return;
    }
    if (user) {
        try {
            const uniqueId = DeviceInfo.getUniqueID();

            let lastUpdateTime:string|number = 'none';
            let apiLevel:string|number = 'none';
            if (Platform.OS === 'android') {
                lastUpdateTime = DeviceInfo.getLastUpdateTime();
                // phoneNumber = DeviceInfo.getPhoneNumber();
                apiLevel = DeviceInfo.getAPILevel();
            }
            const versionCurent = DeviceInfo.getVersion();
            const deviceName = DeviceInfo.getDeviceName();
            const deviceId = DeviceInfo.getDeviceId();
            const systemVersion = DeviceInfo.getSystemVersion();
            const deviceInfo = {
                apiLevel,
                appVersion: versionCurent,
                brand: DeviceInfo.getBrand(),
                deviceId,
                deviceName,
                lastLoginTime: (new Date()).getTime(),
                lastUpdateTime,
                platform: Platform.OS,
                systemVersion,

            };

            API.reportUserDivceInfo(user, uniqueId, deviceInfo);
        } catch (err) {
            console.log("reportUserDeviceInfo error>>", err);
        }

    }
}

function reportUserLocationInfo(location) {
    if (!AppConfig.isRunLog) {
        return;
    }
    if (location) {
        try {
            const user = store && store.getState() && store.getState().user && store.getState().user.user ? store.getState().user.user : null;
            // FirebaseDatabase.ref('userInfomation/' + user._id).child('location').set(location)
            const uniqueId = DeviceInfo.getUniqueID();
            user && uniqueId && API.reportUserLocationInfo(user, uniqueId, location);

        } catch (err) {

        }


    }

}

function logUserActions(actions, bodyParams = {}) {
    return;
    if (!AppConfig.isRunLog) {
        return;
    }
    try {
        const timestamp = (new Date()).getTime();
        const actionsId = timestamp + '_' + actions;
        const uniqueId = DeviceInfo.getUniqueID();
        let body = {
            ...bodyParams,
            timestamp
        };

        FirebaseDatabase.ref('userActionsLogs/' + uniqueId)
            .child(actionsId)
            .set(body);
    } catch (err) {
        console.log("logUserActions error>>", err);
    }
}

function chatWithCustomer(contentChat, orderId) {
    if (!orderId || !contentChat || _.isEmpty(orderId) || _.isEmpty(contentChat.content)) {
        return;
    }
    FirebaseDatabase.ref('chat/' + orderId)
        .child(contentChat.id)
        .set(contentChat);
}

function onListenCustomerChat(orderId, onReceiveMessage) {
    FirebaseDatabase.ref('chat/' + orderId)
        .on('value', (snapshot) => {
            const chatSnap = snapshot.val();
            let chatList = [];
            for (let key in chatSnap) {
                chatList.push(chatSnap[key]);
            }
            chatList = _.sortBy(chatList, chatItem => chatItem.timeStamp).reverse();
            onReceiveMessage && onReceiveMessage(chatList);
        });
}


export default {
    reportUserMockLocation,
    reportOrgInfomations,
    reportUserInfomation,
    reportUserLocationInfo,
    reportUserDeviceInfo,
    logUserActions,
    trackShipmentLocation,
    trackRouteLocation,
    onListenCustomerChat,
    chatWithCustomer
};