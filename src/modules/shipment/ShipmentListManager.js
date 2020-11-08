
const ShipmentListManager = {
    shipmentList: [],
    shipmentSelected: null,
    shipmentDoing: null
};

ShipmentListManager.saveShimentList = (shipmentList) => {
    ShipmentListManager.shipmentList = shipmentList
};

ShipmentListManager.saveShimentSelected = (shipment) => {
    ShipmentListManager.shipmentSelected = shipment
};

ShipmentListManager.saveShipmentDoing = (shipment) => {
    ShipmentListManager.shipmentDoing = shipment
};

export default ShipmentListManager;