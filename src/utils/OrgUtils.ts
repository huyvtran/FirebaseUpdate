import store from "../store/store";
import OrgConfig from "../constant/OrgConfig";

const isOutsourcingOrg = () => {
  const orgConfig = store.getState().user.orgConfig;
  return orgConfig && orgConfig.configurations && orgConfig.configurations.typeTransportation && orgConfig.configurations.typeTransportation === OrgConfig.TYPE_TRANSPORT.OUTSOURCING;
};

const isInHouseOrg = () => {
  const orgConfig = store.getState().user.orgConfig;
  return orgConfig && orgConfig.configurations && (!orgConfig.configurations.typeTransportation || orgConfig.configurations.typeTransportation === OrgConfig.TYPE_TRANSPORT.IN_HOUSE);
};

const shouldCreateExtraTask = () => {
  const orgConfig = store.getState().user.orgConfig;
  return orgConfig && orgConfig.configurations && orgConfig.configurations.allowCreateExtraTask;
};

const hideNumberCollected = () => {
  const orgConfig = store.getState().user.orgConfig;
  return orgConfig && orgConfig.configurations && orgConfig.configurations.hideNumberCollected;
};

const hidePartlyDelivery = () => {
  const orgConfig = store.getState().user.orgConfig;
  return orgConfig && orgConfig.configurations && orgConfig.configurations.hidePartlyDelivery;
};

const getShipmentType = () => {
  const orgSelect = store.getState().org.orgSelect[0];
  return orgSelect && orgSelect.configurations ? orgSelect.configurations.typeShipment : null;
};

const getDeviceIdType = () => {
  const orgSelect = store.getState().org.orgSelect[0];
  return orgSelect?.configurations?.deviceIdType ?? "MAC_ADDRESS";
};

export default {
  isOutsourcingOrg,
  isInHouseOrg,
  shouldCreateExtraTask,
  hideNumberCollected,
  hidePartlyDelivery,
  getShipmentType,
  getDeviceIdType,
};

