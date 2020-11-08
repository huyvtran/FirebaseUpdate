import { AppState } from 'react-native';
import _ from 'lodash';
import NotificationManager from './NotificationManager';
import NavigationHelper from "../navigation/helpers/NavigationHelper";
import store from '../../store/store';
import { refresh } from '../../store/actions/refresh';
import eventTypes from '../../store/constant/eventTypes';
const MessageBarManager = require('react-native-message-bar').MessageBarManager;

const DURATION_NOTI = 6000;

export default {
  DURATION: {
    DEBUG: 60000000,
    LONG: 6000,
    MEDIUM: 3000,
    SHORT: 1000
  },
  notificationType: {
    TASKS: "TASKS",
    SHIPMENTS: "SHIPMENTS",
    SHIPMENTS_BARGE: "SHIPMENTS-BARGE",
  },
  messageType: {
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
    INFO: 'INFO',
    WARNING: 'WARNING',
    EXTRA: 'EXTRA',

  },
  showMessageBar: (message, messageType = NotificationManager.messageType.INFO, onTapped, duration = NotificationManager.DURATION.MEDIUM) => {
    MessageBarManager.showAlert({
      message,
      alertType: messageType,
      duration: duration,
      onTapped: _.throttle(() => {
        onTapped && onTapped();
        MessageBarManager.hideAlert();
      }, 5000, { trailing: false })
    });
  },

  onNotification(notificationParam) {
    console.log("onNotification AppState.currentState>>", AppState.currentState);
    const notification = notificationParam && notificationParam.data ? notificationParam.data : notificationParam
    //in case app is foreground
    if (AppState.currentState === 'active') {
      NotificationManager.actionBeforShowNotification(notification);
      NotificationManager.showMessageBar(notification.body, notification.notificationStatus, () => {
        NavigationHelper.handleNotification(notification);
      }, NotificationManager.DURATION.LONG);
    } else if (AppState.currentState === 'background' || AppState.currentState === 'inactive') { //incase app is background
      NavigationHelper.handleNotification(notification);
    }
  },

  actionBeforShowNotification(notification) {
    switch (notification.notificationType) {
      case NotificationManager.notificationType.SHIPMENTS:
      case NotificationManager.notificationType.SHIPMENTS_BARGE:
        store.dispatch(refresh(eventTypes.REFRESH_SHIPMENT_LIST, _.now()))
        break;
      case NotificationManager.notificationType.TASKS:
        break;
      default:

    }
  },

  showErrorMessage: (message, onTapped, duration) => {
    NotificationManager.showMessageBar(message, NotificationManager.messageType.ERROR, onTapped, duration)
  },

  showInfoMessage: (message, onTapped, duration) => {
    NotificationManager.showMessageBar(message, NotificationManager.messageType.INFO, onTapped, duration)
  },

  showSuccessMessage: (message, onTapped, duration) => {
    NotificationManager.showMessageBar(message, NotificationManager.messageType.SUCCESS, onTapped, duration)
  },

  showWarningMessage: (message, onTapped, duration) => {
    NotificationManager.showMessageBar(message, NotificationManager.messageType.WARNING, onTapped, duration)
  },



};
