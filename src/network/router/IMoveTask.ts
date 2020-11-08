import { ITask } from "../tasks/TaskListModel";

/**
 * nội dung request gửi lên server
 */
export interface MoveTaskRequest{

    //ngày move
    dataDate:any;

    //tổ chức
    organizationId:number;

    //danh sách task
    listTasks:ITask[]
}

export interface MoveTaskResponse{

    //ngày move
    message:string;
}

/**
 * Trạng thái khi gửi move task
 */
export enum MoveTaskResponseMessage{
    Done = "Done"
}