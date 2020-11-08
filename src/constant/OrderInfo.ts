import AppColors from '../theme/AppColors';
export default {
    TYPE: {
        SALE: 'SALE',
        PURCHASE: 'PURCHASE',
    },

    STATUS: {
        '1': 'Open',
        '2': 'Picking packing',
        '3': 'Pick & Packed',
        '4': 'Shipping',
        '5': 'Recerved',
        '6': 'Canceled',
    },
    SALE_STATUS: {
        '0': 'Open',
        '1': 'Pick & Packed',
        '2': 'Shipper'

    },
    PURCHASE_STATUS: {
        '0': 'Open',
        '1': 'Recerved',
        '2': 'Put Away',

    },
    ORDER_STATUS_VALUE: {
        PENDING: -2,
        REJECT: -1,
        OPEN: 1,
        PICKING_PACKING: 2,
        PICK_PACKED: 3,
        SHIPPING: 4,
        RECERVED: 5,
        CANCELED: 6,
    },
    STATUS_COLOR: {
        'Open': AppColors.orderBlueskin,
        'Pick & Packed': AppColors.orderOrangerYellow,
        'Shipper': AppColors.orderGreen,
        'Recerved': AppColors.orderOrangerYellow,
        'Put Away': AppColors.orderGreen,
        'Canceled': AppColors.orderRed,
    },
    ORDER_STATUS: {
        NOT_COMPLETE: 0,
        PARTLY_DELIVERY: 1,
        COMPLETED: 2,
        REDUDANT: 3

    },
    ORDER_STATUS_LOCALE: {
        0: 'notCompleted',
        1: 'partlyDeliver',
        2: 'completed',
    },
    STATUS_ORDER_UN_PARTLY: {
        0: 'notCompleted',
        2: 'completed',
    },
    ORDER_STATUS_KEY: {
        '0': 'NOT Fulfiled',
        '1': 'Partially Fulfiled',
        '2': 'Fulfiled',
    },
    STATUS_SHIPMENT: {
        'NOT Fulfiled': 'circle-thin',
        'Partially Fulfiled': 'dot-circle-o',
        'Fulfiled': 'circle',
    },
    STATUS_SHIPMENT_COLOR: {
        'NOT Fulfiled': AppColors.grayLight,
        'Partially Fulfiled': AppColors.orangeLight,
        'Fulfiled': AppColors.greenLight,
    },
    STATUS_PAYMENT: {
        '0': 'Not Payment',
        '1': 'Not Payment',
        '2': 'Payment',
    },

    TYPE_TRANSPORTER: {
        TWO_WAYS: '2 ways'
    },
    //Status Order

    FULLFILLMENT_STATUS: {
        NOT_FULFILLED: 'NOT_FULFILLED', // Chua giao //Trang
        FULFILLED: 'FULFILLED',   //xanh
        PARTIALLY_FULFILLED: 'PARTIALLY_FULFILLED',//cam
        UNFULFILLED: 'UNFULFILLED' // Khong giao duoc //xam
    },
    FULFILLMENT_STATUS_COLOR: {
        'NOT_FULFILLED': AppColors.white,
        'FULFILLED': AppColors.greenLight,
        'PARTIALLY_FULFILLED': AppColors.orangeLight,
        'UNFULFILLED': AppColors.grayLight,

    },

    ORDER_FULLFILLMENT_STATUS: [
        { fulfillmentStatus: '', text: '', color: null },
        { fulfillmentStatus: '1', text: 'NOT FULFILLED', color: AppColors.white },
        { fulfillmentStatus: '2', text: 'FULFILLED', color: AppColors.greenLight },
        { fulfillmentStatus: '3', text: 'PARTIALLY FULFILLED', color: AppColors.orangeLight },
        { fulfillmentStatus: '4', text: 'UNFULFILLED', color: AppColors.grayLight },
    ],
    STATUS_LOCALIZE: {
        '-2': 'pending',
        '-1': 'reject',
        '1': 'Open',
        '2': 'Pickingpacking',
        '3': 'PickPacked',
        '4': 'Shipping',
        '5': 'Recerved',
        '6': 'Canceled',
    },
    STATUS_PAYMENT_LOCALIZE: {
        '0': 'NotPayment',
        '1': 'NotPayment',
        '2': 'Payment',
    },
    FULLFILLMENT_STATUS_LOCALIZE: {
        '1': 'NOT_FULFILLED',
        '2': 'FULFILLED',
        '3': 'PARTIALLY_FULFILLED',
        '4': 'UNFULFILLED'
    },
    FULLFILLMENT_STATUS_STRING: {
        NOT_FULFILLED: '1',
        FULFILLED: '2',
        PARTIALLY_FULFILLED: '3',
        UNFULFILLED: '4'
    },

    PROMOTION_TYPE: {
        CHANGE_PRODUCT: 'by-present',
        CHANGE_PRICE: 'by-percent'
    },
}