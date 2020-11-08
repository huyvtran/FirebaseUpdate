/**
 * Trạng thái trả về cho api
 */
export interface ICheckMoveTaskResponse{
    /**
     * Trạng thái trả về
     */
    status:boolean;

    /**
     * thông báo nếu có lỗi
     */
    message:string;
}