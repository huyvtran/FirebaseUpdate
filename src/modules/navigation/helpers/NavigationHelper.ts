import { Actions } from "react-native-router-flux";
import store from "../../../store/store";
import NotificationManager from "../../notification/NotificationManager";
import { readTask, reloadTaskList } from "../../task/actions/creater/task";

export default {
  handleNotification(notification) {
    switch (notification.notificationStatus) {
      case NotificationManager.messageType.INFO:
        this.processNotification(notification)
        break;
      case NotificationManager.messageType.WARNING:
        return;
      default:
        return;
    }
  },

  processNotification(notification) {
    try {
      if (!notification || !notification.target)
        return;

      if (typeof notification.target === "string") {
        if (!notification.target.includes('taskAction') || !notification.target.includes('id')) {
          return;
        }

        var target = JSON.parse(notification.target);
      } else {
        var target = notification.target;
      }

      if (!target || !target.id || !target.taskAction) {
        return;
      }

      const params = {
        payload: {
          body: {
            id: target.id,
            taskAction: target.taskAction
          },
          item: target.task
        }
      }

      // store.dispatch(loadTaskDetail(), params)

      store.dispatch(readTask(target.id))

      store.dispatch(reloadTaskList());
    }
    catch (error) {
      console.error(error);
    }
  },

  navigateRoleMainScene(userInfo) {

    // Actions.reset('main')
    Actions.reset('drawer');

  }
};
