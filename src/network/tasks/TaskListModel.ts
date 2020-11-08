import TaskCode from "../../constant/TaskCode";
import AppColors from "../../theme/AppColors";

/**
 * mẫu dữ liệu api tasks/list trả về
 */
export interface ITaskListData {
    data: {
        data: ITask[]
    }
}

/**
 * mẫu dữ liệu 
 */
export interface ITaskList {
    data: ITask[],
    taskDetailInitial: any,
    taskDetail: any,
    componentsWithoutCalculate: any,
    taskAction: any[],
    loading: boolean,
    loadingTaskDetail: boolean,
    reloadTaskList: boolean,
}

/**
 * Đối tượng yêu cầu
 * { _id: '5f87ae9999fe9303b8da5e10',
      subject: '1.CO HONG - CHO DAU DAY AP TRAN',
      description: 'Giao Hàng - CO HONG - CHO DAU DAY AP TRAN',
      organizationId: 
       { _id: '5c34755faf9737c702c16536',
         organizationName: 'Kho Long Khanh' },
      notInCharge: [],
      productId: [],
      customerId: 
       { id: '5c4f160eddb3c46ad325801d',
         customerName: 'CO HONG - CHO DAU DAY AP TRAN',
         customerAddress: 'CHO DAU DAY AP TRAN CAO VAN, Xã Bàu Hàm Huyện Trảng Bom',
         customerPhone: '0976204088',
         customerGroup: [],
         customerCode: 'LK011046',
         coordinate: { latitude: 10.9442338, longitude: 107.1391651 } },
      dueDate: '2020-10-14T23:52:00.000Z',
      status: 0,
      createdBy: { _id: '5bff569fa59c5d4b5e9b1629', displayName: 'png' },
      assignedTo: 
       [ { _id: '5c35deaa8cb02c7603b7eec1',
           displayName: 'Nguyễn Trung Trọng' } ],
      updatedAt: '2020-10-15T02:06:17.916Z',
      taskActionIds: 
       [ { _id: '5afe91638fd3933328d0e33b',
           taskActionName: 'Giao Hàng',
           taskActionCode: 'GIAO_HANG' } ],
      taskAction: 
       { _id: '5afe91638fd3933328d0e33b',
         taskActionCode: 'GIAO_HANG',
         taskActionName: 'Giao Hàng' },
      createdAt: '2020-10-15T02:06:19.252Z',
      startDate: '2020-10-14T23:47:00.000Z',
      lastResponse: { entities: [] },
      taskCode: 'GH-201015020617-918965',
      orderList: 
       [ { _id: '5f87ac744b2beb049e55be64',
           totalPrice: 253508,
           fulfillmentStatus: '1',
           fulfillmentStatusSecondWay: '1' } ],
      checkIn: 
       { timestamp: null,
         status: 0,
         username: null,
         imageUrls: [],
         latitude: null,
         longitude: null },
      checkOut: 
       { timestamp: null,
         status: 0,
         username: null,
         imageUrls: [],
         latitude: null,
         longitude: null },
      encodedPath: 'sqxaAyr|lSAfAGlC??B?P?d@BJ?nAB???l@?d@Ab@?HApAAlA?X?d@Cf@A~@AxA?X?l@@t@@bA??`AEF?X?jABfAB???`AC`B?N?b@?lE?r@?f@@j@Fl@@PBPFZ@BHd@FXHXVr@Xr@P^HPXl@LVBF`@~@HPp@vAFLv@fB`AvBb@dAN`@|@vBdAhC`FfLh@jAx@jB^|@\\t@f@fANb@R`@z@hBDHRf@p@~Ah@lAt@dBLXh@nALXLZRt@Hb@FjAAf@Ar@UvB[|DCZe@fEGr@c@tEs@lHo@xGKdAKnAGt@[lC[|CGn@c@xEQnB]rDS~A?FW|AYjBc@jBCFi@~B??LB??m@rCADQbAMh@iAtFa@pBu@hDe@jB]|A?DGTCL?BSbAKdAGt@CdAAx@@fE@fD?dF@xD?lA@pB?lECfE?d@AfFE`CGrASbBOvAO~Am@~FUxBi@dFQjBWlC_@bD[nCUhC]zCEd@',
      customer: 
       { id: '5c4f160eddb3c46ad325801d',
         customerName: 'CO HONG - CHO DAU DAY AP TRAN',
         customerAddress: 'CHO DAU DAY AP TRAN CAO VAN, Xã Bàu Hàm Huyện Trảng Bom',
         customerPhone: '0976204088',
         customerGroup: [],
         customerCode: 'LK011046',
         coordinate: { latitude: 10.9442338, longitude: 107.1391651 } },
      routeDetailId: '5f87ad95c9798803b832cf21',
      cost: 0,
      taskIndex: '1',
      extraType: false,
      routeDeliveryDetailId: '5f87ad9599fe9303b8da5d16',
      licensePlate: 'LK567',
      tripCode: "TRIP-201015-0001#1"
      contentSecondRow: 'Địa chỉ: CHO DAU DAY AP TRAN CAO VAN, Xã Bàu Hàm Huyện Trảng Bom',
      fulfillmentStatusIconColor: 'rgba(255,255,255,1)',
      isDisabled: false }
      */
export interface ITask {

    //id của task
    _id: string;

    //tiêu đề task
    subject: string;

    //miêu tả của task
    description: string;

    //tổ chức của task
    organizationId: IOrganization;

    notInCharge: any[];

    productId: any[];

    customerId: any;

    dueDate: string;

    /** Trạng thái của task */
    status: TaskStatus;

    createdBy: { _id: string; displayName: string; }

    assignedTo: { _id: string; displayName: string; updatedAt: string }[];

    cost: number;

    //'2020-10-05T03:14:23.935Z',
    updatedAt: string;

    taskActionIds: { _id: string; taskActionName: string; taskActionCode: TaskCode; }[];

    taskAction: ITaskAction;

    /**
     * '2020-10-05T03:14:24.874Z'
     */
    createdAt: string;

    /**
     * '2020-10-04T23:00:00.000Z',
     */
    startDate: string;

    lastResponse: {
        entities: any[]
    };

    /**
     * SH-201005031423-936977
     */
    taskCode: string;

    orderList: any[];

    checkIn: ICheckIn;

    checkOut: ICheckIn;

    encodedPath: string;

    customer:
    {
        id: string,
        customerName: string,
        customerAddress: string,
        customerPhone: string,
        customerGroup: any[],
        customerCode: string,
        coordinate: { latitude: number, longitude: number}
    },
    taskIndex: string,
    routeDeliveryDetailId: string,
    licensePlate: string,
    isDisabled: boolean

    /**
     * mã cuốc khách
     */
    tripCode:string,

    /**
     * Id chi tiết tuyến
     */
    routeDetailId: string;

    depot: IDepot;

    extraType: boolean;

    contentSecondRow: any;

    fulfillmentStatusIconColor: any;

    //---Start định nghĩa từ tsx
    /**
     * trạng thái lựa chọn
     */
    isChecked: boolean;

    isMarked: boolean;
    //---End định nghĩa từ tsx
}

/**
 * { _id: '5c34755faf9737c702c16536', organizationName: 'Kho Long Khanh' },
 */
export interface IOrganization {

    _id: string;
    organizationName: string;
}



/**
 * taskAction: 
{ _id: '5afe91638fd3933328d0e33a', taskActionCode: 'SOAN_HANG', taskActionName: 'Soạn Hàng' },
 */
export interface ITaskAction {
    _id: string;
    taskActionCode: TaskCode;
    taskActionName: string;
}

export interface ICheckIn {
    imageUrls: string,
    latitude: number,
    longitude: number,
    status: number,
    timestamp: string,
    username: string,
    userId: string
}

/**
 * Trạng thái của task
 */
export enum TaskStatus {

    /** Trạng thái chưa thực hiện*/
    Open = 0,

    /** Trạng thái đang thực hiện */
    Progressing = 1,

    /** Trạng thái đã hoàn thành*/
    Completed = 2
}

export const TaskStatusColor = [
    { type: TaskStatus.Open, borderColor: AppColors.spaceGrey, color: "#FFFFFF", textColor: AppColors.spaceGrey },
    { type: TaskStatus.Progressing, color: AppColors.orangeLight, borderColor: "transparent", textColor: "#FFFFFF" },
    { type: TaskStatus.Completed, color: AppColors.greenLight, borderColor: "transparent", textColor: "#FFFFFF" },
];

/**
 * depot:
coordinate:
latitude: 10.939841
longitude: 107.270417
organizationCode: "PSLKWH100"
organizationName: "Kho Long Khanh"
streetAddress: "Hàm Nghi, Bảo Vinh, Long Khánh, Đồng Nai"
 */
export interface IDepot {
    coordinate: {
        latitude: number
        longitude: number
    }
    organizationCode: string,
    organizationName: string,
    streetAddress: string,
}