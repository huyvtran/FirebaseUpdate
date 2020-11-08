import { AbstractProps, AbstractStates } from "../../../base/AbstractProperty";
import { IOrganizationData } from "../../../network/organization/IOrganizations";
import { IOrgConfig } from "../../../network/organization/IOrgConfig";
import { ITaskList } from "../../../network/tasks/TaskListModel";
/**
 * thuộc tính của các component trong tasklist
 */
interface AbstractTaskProps extends AbstractProps {

    //sự kiện
    event?: any,

    //danh sách task
    task?: ITaskList,
    //danh sách tổ chức
    org?: IOrganizationData[],

    //cấu hình tổ chức
    orgConfig?: IOrgConfig,

    //thông tin tài khoản
    user: any,
}

/**
 * Trạng thái của các component trong tasklist
 */
interface AbstractTaskStates extends AbstractStates {
    //trạng thái load dữ liệu
    loading?: boolean,
}
export { AbstractTaskProps, AbstractTaskStates };
