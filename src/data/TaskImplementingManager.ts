import _ from 'lodash';
import * as LocalStorage from './LocalStorage';

const TaskImplementingStore = {
    taskImplementing: []
};

const IMPLEMEMTING_TASK = 'implementingTask';

/**
 * Lớp tiện ích lưu trữ thông tin task
 */
class TaskImplementingManager {
    public static initialize = () => {
        return LocalStorage.get(IMPLEMEMTING_TASK, (error, result) => {
            TaskImplementingStore.taskImplementing = _.isEmpty(result) ? [] : JSON.parse(result);
        });
    };

    public static saveTaskImplementing = (task) => {
        TaskImplementingStore.taskImplementing.push(task);
        return LocalStorage.set(IMPLEMEMTING_TASK, TaskImplementingStore.taskImplementing);
    };

    public static clear = () => {
        TaskImplementingStore.taskImplementing = [];
        // LocalStorage.remove(IMPLEMEMTING_TASK);
        LocalStorage.set(IMPLEMEMTING_TASK, TaskImplementingStore.taskImplementing);
    };

    public static getTaskImplementing = () => {
        return TaskImplementingStore.taskImplementing;
    };

    public static removeTaskImplementing = (task) => {
        TaskImplementingStore.taskImplementing = TaskImplementingStore.taskImplementing.filter(taskItem => {
            return taskItem._id !== task._id
        });

        return LocalStorage.set(IMPLEMEMTING_TASK, TaskImplementingStore.taskImplementing);
    };


    public static findTaskImplemeting = (task) => {
        const index = _.findIndex(TaskImplementingStore.taskImplementing, (taskItem) => {
            return task.task._id === taskItem.task._id
        })
        if (index >= 0) {
            return TaskImplementingStore.taskImplementing[index]
        }

        return null;
    };

    public static editTaskImplementing = (task) => {
        const index = _.findIndex(TaskImplementingStore.taskImplementing, (taskItem) => {
            return task.task._id === taskItem.task._id
        })

        if (index >= 0) {
            TaskImplementingStore.taskImplementing[index] = task;
        }
        return LocalStorage.set(IMPLEMEMTING_TASK, TaskImplementingStore.taskImplementing);
    }
}

export default TaskImplementingManager;