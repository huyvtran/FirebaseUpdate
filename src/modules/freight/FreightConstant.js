import messages from "../../constant/Messages";

export default {
    FILTER_LIST: [
        { content: 'active', checked: true },
        { content: 'deactive', checked: true }
    ],
    SHIPMENT_STATUS: {
        // NOT_ASSIGNED: chưa gán tài, xe trailer gì

        // SHIPPING_STARTED: đã gán tài và xe, trailer có thể có có thể không và đã submit ít nhất 1 event

        // APPROVAL_REQUIRED: tài request shipment và approval từ điều hành để chạy

        // SHIPPING_COMPLETED: Đã hoàn thành hết các event trong shipment

        // ASSIGNED_AWAITING: Tài và xe đã được gán cho shipment, trailer có thể có có thể không nhưng chưa chạy (do đang chạy shipment khác, không thể chạy shipment mới)

        // VEHICLE_ASSIGNED: xe đã được gán bởi điều hành, tài chưa được gán, tài xế cần lên xe để nhận shipment 
        SHIPPING_COMPLETED: 'SHIPPING_COMPLETED',
        NOT_ASSIGNED: "NOT_ASSIGNED",
        APPROVAL_REQUIRED: "APPROVAL_REQUIRED",
        VEHICLE_ASSIGNED: 'VEHICLE_ASSIGNED',

        ASSIGNED_AWAITING: "ASSIGNED_AWAITING",
        SHIPPING_STARTED: 'SHIPPING_STARTED',
        CANCELLED: 'CANCELLED',


        LINE_UP_AWAITING: "LINE_UP_AWAITING",
        UNLOAD_AWAITING: "UNLOAD_AWAITING",
        IN_WHARVES_LINE_UP_AWAITING: "IN_WHARVES_LINE_UP_AWAITING", // đã vào cầu - chờ xếp hàng
        IN_WHARVES_UNLOAD_AWAITING: "IN_WHARVES_UNLOAD_AWAITING",   // đã vào cầu - chờ dỡ hàng
        LINE_UP_STARTED: "LINE_UP_STARTED",
        UNLOAD_STARTED: "UNLOAD_STARTED",
        LINE_UP_COMPLETED: "LINE_UP_COMPLETED",
        UNLOAD_COMPLETED: "UNLOAD_COMPLETED",
        IN_TRANSIT: "IN_TRANSIT",
        PLAN_RECEIVED: 'PLAN_RECEIVED'
    },


    FEE_STATUS_CONTENT: {
        0: 'waiting',
        1: 'approved'
    },
    FEE_STATUS: {
        PENDING: 0,
        SENT: 1,
        APPROVED: 2
    },

    FEE_SHIPMENT_STATUS: {
        APPROVED: 'APPROVED',
        NOT_APPROVED: 'NOT_APPROVED',
        SENT_TO_BE_APPROVED: "SENT_TO_BE_APPROVED",
        OPEN: 'OPEN'
    },


    SHIPMENT_STOP_TYPES: {
        PICK: 'P',
        DROP: 'D',
        OTHER: 'O',

        NOT_FREIGHT_RELATED: "NFR",
        PICKUP_AND_DELIVERY: "PD",
    },
    SHIPMENT_TRANSPORT_MODE: {
        ROAD: 'TL',
        BARGE: 'BARGE'
    },
    FILTER_SHIPMENT_PROPERTIES: [
        {
            id: messages.shipmentNumber,
            value: messages.shipmentNumber,
        },
        {
            id: messages.departure,
            value: messages.departure,
        },
        {
            id: messages.arrival,
            value: messages.arrival,
        },
    ],

    SHIPMENT_BARGE_TYPE: {
        DUMMY: "DUMMY",
        ACTUAL: "ACTUAL",
        NFR: 'NFR'
    },
    CONTAINER_LENGTH: {
        LONG_2: 20,
        LONG_4: 40,
        LONG_L: 45,
    },
    CONTAINER_ATTR: {
        DRY: 'GP',
        COLD: 'RF',
        TK: 'TK',
        PL: 'PL',
        OT: 'OT'
    },


    LIFT_1_ERROR_CODE: {
        CONTAINER_WRONG_FORMAT: 0,
        CONTAINER_WRONG_ISO_FORMAT: 1,
        MAX_GROSS_WRONG_FORMAT: 2,
        TARE_WRONG_FORMAT: 3,
    }

}