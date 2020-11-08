import messaging from "@react-native-firebase/messaging";

//lấy token
export const getToken = async () => await messaging().getToken();

/**
 * Kiểm tra quyền
 */
export const hasPermission = async () => await messaging().hasPermission();

/**
 * Yêu cầu quyền
 */
export const requestPermission = async () => await messaging().requestPermission();

/**
 * Lấy notification
 * @param listener 
 */
export const onMessage = (listener: (message: any) => any) => messaging().onMessage(listener);

/**
 * xử lý notification
 * @param listener 
 */
export const onNotification = (listener: (notification: Notification) => any) => notifications().onNotification(listener);