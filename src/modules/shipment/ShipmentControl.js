import TaskHelper from "../task/helper/TaskHelper";
import _ from 'lodash'
import messages from "../../constant/Messages";
import FreightConstant from "../freight/FreightConstant";
import { Localize } from "../setting/languages/LanguageManager";
const transformShipmentFromServer = (shipment) => {
    let taskListIds = [];
    shipment.shipmentStopIds && shipment.shipmentStopIds.forEach(shipmentStop => {
        taskListIds = taskListIds.concat(shipmentStop.taskIds.map(taskId => {
            return {
                ...taskId,
                location: shipmentStop.customerId
            }
        }))
    })
    return {
        ...shipment,
        taskIds: taskListIds
    }
}

const isDoingAnotherShipment = (shipment, shipmentList) => {
    return shipmentList.filter(shipmentItem => {
        return shipment._id !== shipmentItem._id && shipmentItem.taskIds.filter(task => {
            return task.status === TaskHelper.status.COMPLETE
        }).length > 0
    }).length > 0
}

const calculatePoliline = (shipment) => {
    const coordinateList = shipment.shipmentStopIds.map(stop => {
        if (!stop || !stop.customerId || !stop.customerId.coordinate || !stop.customerId.coordinate.latitude || !stop.customerId.coordinate.longitude) {
            return { latitude: 0, longitude: 0, description: stop.customerId ? stop.customerId.fullName : '' }

        }
        return {
            latitude: stop.customerId.coordinate.latitude,
            longitude: stop.customerId.coordinate.longitude,
            description: stop.customerId ? stop.customerId.fullName : ''
        }
    })
    return coordinateList
}

const getStatusShipmentString = (shipmentStatus) => {

    switch (shipmentStatus) {
        case FreightConstant.SHIPMENT_STATUS.LINE_UP_AWAITING:
        case FreightConstant.SHIPMENT_STATUS.UNLOAD_AWAITING:
        case FreightConstant.SHIPMENT_STATUS.IN_WHARVES_LINE_UP_AWAITING:
        case FreightConstant.SHIPMENT_STATUS.IN_WHARVES_UNLOAD_AWAITING:
        case FreightConstant.SHIPMENT_STATUS.LINE_UP_STARTED:
        case FreightConstant.SHIPMENT_STATUS.UNLOAD_STARTED:
        case FreightConstant.SHIPMENT_STATUS.LINE_UP_COMPLETED:
        case FreightConstant.SHIPMENT_STATUS.UNLOAD_COMPLETED:
        case FreightConstant.SHIPMENT_STATUS.IN_TRANSIT:
        case FreightConstant.SHIPMENT_STATUS.PLAN_RECEIVED:
        case FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED:
            return messages.shipmentShipping
            break;
        case FreightConstant.SHIPMENT_STATUS.APPROVAL_REQUIRED:
            return messages.shipmentApprovalRequire
            break;
        case FreightConstant.SHIPMENT_STATUS.SHIPPING_COMPLETED:
            return messages.shipmentCompleted
            break;
        default:
            return messages.shipmentWait
    }
}

const isValidateLatLng = (shipment) => {
    return _.every(shipment.shipmentStopIds, (stop) => {
        return (stop && stop.customerId && stop.customerId.coordinate && stop.customerId.coordinate.latitude && stop.customerId.coordinate.longitude)
    })

}

const getLastShipmentUpdate = (shipmentList) => {
    const shipmentNeedCompare = shipmentList.map(shipment => {
        return {
            ...shipment,
            shipmentLastProgressDate: shipment.shipmentLastProgressDate ? shipment.shipmentLastProgressDate : 0
        }
    })
    let shipment = shipmentNeedCompare[0]
    shipmentNeedCompare.forEach(shipmentParam => {
        if (shipmentParam.shipmentLastProgressDate &&
            shipment.shipmentLastProgressDate &&
            (new Date(shipmentParam.shipmentLastProgressDate)).getTime() > (new Date(shipment.shipmentLastProgressDate)).getTime()) {
            shipment = shipmentParam;
        }
    })
    return shipment
}

const isShipmentLastUpdate = (shipment, shipmentList) => {
    if (!shipment || !shipment._id || !shipmentList || shipmentList.length === 0)
        return false
    const lastShipmentUpdate = getLastShipmentUpdate(shipmentList)
    if (!lastShipmentUpdate) {
        return false
    }
    return shipment._id === lastShipmentUpdate._id
}

const getTypeOfShipment = (orderType) => {
    switch (orderType) {
        case 'INTERNAL':
            return Localize(messages.internal)
        case 'EXTERNAL':
            return Localize(messages.external)
        case 'I':
            return Localize(messages.internal)
        case 'E':
            return Localize(messages.external)
        default:
            return ''
    }
}

const isShipmentStarted = (shipmentStatus) => {
    return (shipmentStatus === FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.LINE_UP_AWAITING ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.UNLOAD_AWAITING ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.IN_WHARVES_LINE_UP_AWAITING ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.IN_WHARVES_UNLOAD_AWAITING ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.LINE_UP_STARTED ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.UNLOAD_STARTED ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.LINE_UP_COMPLETED ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.UNLOAD_COMPLETED ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.IN_TRANSIT ||
        shipmentStatus === FreightConstant.SHIPMENT_STATUS.PLAN_RECEIVED
    )
}

wrapNumberOfContainer = (full20, full40, full45, cold20, cold40, empty20, empty40, empty45) => {
    let numberOfContainer = ''
    let isAnd = false

    if (full20 !== 0 || full40 !== 0 || full45 !== 0) {
        numberOfContainer += full20 + '/' + full40 + '/' + full45 + ' F' + " (" + cold20 + '/' + cold40 + ' RF' + ")"
        isAnd = true
    }


    if (empty20 !== 0 || empty40 !== 0 || empty45 !== 0) {

        if (isAnd) {
            numberOfContainer += ' & '

        }

        numberOfContainer += empty20 + '/' + empty40 + '/' + empty45 + ' E'
    }

    return numberOfContainer
}
//check attribute container
isDryContainer = (containerTypeCode) => {
    return containerTypeCode.includes(FreightConstant.CONTAINER_ATTR.DRY) ||
        containerTypeCode.includes(FreightConstant.CONTAINER_ATTR.TK) ||
        containerTypeCode.includes(FreightConstant.CONTAINER_ATTR.PL)
}

isColdContainer = (containerTypeCode) => {
    return containerTypeCode.includes(FreightConstant.CONTAINER_ATTR.COLD)
}

isTooLargeContainer = (containerTypeCode) => {
    return containerTypeCode.includes(FreightConstant.CONTAINER_ATTR.OT)

}

// check length of container
is20Container = (containerLength) => {
    return containerLength === FreightConstant.CONTAINER_LENGTH.LONG_2
}

is40Container = (containerLength) => {
    return containerLength === FreightConstant.CONTAINER_LENGTH.LONG_4
}

is45Container = (containerLength) => {
    return containerLength === FreightConstant.CONTAINER_LENGTH.LONG_L
}

//check length + attribute container

isDry20Container = (container) => {

    const { containerTypeCode, containerLength } = container.containerType;

    return containerTypeCode && is20Container(containerLength) && isDryContainer(containerTypeCode)
}

isDry40Container = (container) => {

    const { containerTypeCode, containerLength } = container.containerType;

    return containerTypeCode && is40Container(containerLength) && isDryContainer(containerTypeCode)
}

isDry45Container = (container) => {

    const { containerTypeCode, containerLength } = container.containerType;

    return containerTypeCode && is45Container(containerLength) && isDryContainer(containerTypeCode)
}

isCold20Container = (container) => {

    const { containerTypeCode, containerLength } = container.containerType;

    return containerTypeCode && is20Container(containerLength) && isColdContainer(containerTypeCode)
}

isCold40Container = (container) => {

    const { containerTypeCode, containerLength } = container.containerType;

    return containerTypeCode && is40Container(containerLength) && isColdContainer(containerTypeCode)
}


getContainerQuantity = (shipment, shipmentStop) => {
    const containerList = shipmentStop.countContainers;

    if (!containerList || containerList.length === 0) {
        return ''
    }

    let full20 = 0
    let full40 = 0
    let full45 = 0

    let cold20 = 0
    let cold40 = 0
    let empty20 = 0
    let empty40 = 0
    let empty45 = 0
    containerList.forEach(container => {

        const shipUnitCount = container && container.shipUnitCount ? parseInt(container.shipUnitCount) : 0
        const { containerId } = container
        const { containerLength } = containerId?.containerType ?? {};

        if (container && container.isFull && container.containerId && container.containerId.containerType) {
            if (is20Container(containerLength)) {
                full20 += shipUnitCount;
            }
            if (is40Container(containerLength)) {
                full40 += shipUnitCount;
            }
            if (is45Container(containerLength)) {
                full45 += shipUnitCount;
            }

            if (isCold20Container(containerId)) {
                cold20 += shipUnitCount;
            }
            if (isCold40Container(containerId)) {
                cold40 += shipUnitCount;
            }


        } else if (container && !container.isFull && container.containerId && container.containerId.containerType) {
            const { containerLength } = container.containerId.containerType;
            if (is20Container(containerLength)) {
                empty20 += shipUnitCount;
            }
            if (is40Container(containerLength)) {
                empty40 += shipUnitCount;
            }
            if (is45Container(containerLength)) {
                empty45 += shipUnitCount;
            }

        }
    })
    return wrapNumberOfContainer(full20, full40, full45, cold20, cold40, empty20, empty40, empty45)
}

const isValidaToTracking = (shipmentList) => {

    if (!shipmentList || shipmentList.length === 0) {
        return false
    }
    return true

}

export default {
    getContainerQuantity,
    isShipmentStarted,
    transformShipmentFromServer,
    isDoingAnotherShipment,
    calculatePoliline,
    isValidateLatLng,
    getLastShipmentUpdate,
    isShipmentLastUpdate,
    getTypeOfShipment,
    getStatusShipmentString,
    isValidaToTracking,

    is20Container,
    is40Container,
    is45Container,
    isDryContainer,
    isColdContainer,
    isTooLargeContainer,
    isDry20Container,
    isDry40Container,
    isDry45Container,
    isCold20Container,
    isCold40Container,
}