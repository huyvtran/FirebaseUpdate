import {
  API_CREATE_EXTRA_TASK,
  API_PRODUCT_LIST,
  API_TASK_DETAIL_FORM,
  API_CONTACT_LIST,
  API_ORDERS_LIST,
  API_INVENTORY_LIST,
  API_NOTIFICATION_LIST,
  API_NOTIFICATION_UPDATE,
  API_ORDERS_CREATE_CODE,
  API_INVENTORY_ALL_LIST,
  API_SUBMIT_FORM,
  API_UPDATE_LOCATIONS,
  API_ORDERS_CREATE,
  API_ORG_LIST,
  API_REFER_INVENT,
  API_ODER_LIST_INVENT,
  API_CATEGORY_LIST,
  API_TASK_LIST,
  API_TASK_READ,
  API_PROMOTION_VFAST,
  API_PROMOTION_INITIATIVE,
  API_SIGN_IN,
  API_USERS_VEHICLE,
  API_ORG_CONFIG,
  API_USERS_READ,
  API_SIGN_OUT,
  API_ORG_BRANCH_LIST,
  API_ORG_READ,
  API_ORG_PARENT_BRANCH,
  API_SNAP_TO_ROAD,
  API_ORGANIZATION_CONFIG,
  API_CONTAINER_LIST,
  API_CONTAINER_DETAIL,
  API_CONTAINER_UPDATE,
  API_TRAILER_LIST,
  API_TRAILER_DETAIL,
  API_TRAILER_UPDATE,
  API_ORDERS_READ,
  API_REQUEST_SHIPMENT,
  API_SHIPMENT_DETAIL,
  API_SHIPMENT_LIST,
  API_DISCOUNT_LIST,
  API_CONTAINER_REQUEST,
  API_PROMOTION_LIST,
  API_CHARGE_LIST,
  API_SHIPMENT_ADD_CHARGE,
  API_SHIPMENT_CHARGE_LIST,
  API_SHIPMENT_LOCATION_LIST,
  API_ROUTE_LOCATION_LIST,
  API_CHANGE_PASSWORD,
  API_ABIVIN_USER_CONSOLE,
  API_ABIVIN_USER_DEVICES,
  API_FORGOT_PASSWORD,
  API_FORGOT_PASS_CODE,
  API_CONTACT_LIST_ALL,
  API_TWO_STEP_VERIFY,
  API_RESEND_TWO_STEP_CODE,
  API_MOVE_ORDER, API_CHECK_MOVE_TASK
} from "./URL";
import axios from "axios";
import AppConfig from "../config/AppConfig";
import DynamicServerManager from "../data/DynamicServerManager";
import Moment from "moment";
import FreightConstant from "../modules/freight/FreightConstant";
import { AccessTokenInterceptor, LanguageInterceptor, AppVersionInterceptor, LogInterceptor, UnauthorizeInterceptor, DevConfigInterceptor } from "./Interceptors";

const getBaseUrl = () => {
  const dynamicServer = DynamicServerManager.getDynamicServer();
  return dynamicServer.protocol + dynamicServer.host;
};

const getInstance = () => {
  const BASE_URL = AppConfig.PRODUCTION_MODE ? AppConfig.PRODUCTION_ENDPOINT : getBaseUrl();

  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 45000,
  });

  instance.interceptors.response.use(
    UnauthorizeInterceptor.onFullfilled,
    UnauthorizeInterceptor.onRejected,
  );

  instance.interceptors.request.use(
    LogInterceptor.requestLog,
    LogInterceptor.requestError,
  );

  instance.interceptors.response.use(
    LogInterceptor.responseLog,
    LogInterceptor.responseError,
  );

  instance.interceptors.request.use(
    AccessTokenInterceptor.addAccessToken,
    AccessTokenInterceptor.onRejected
  );

  instance.interceptors.request.use(
    LanguageInterceptor.addLanguage,
    LanguageInterceptor.onRejected
  );

  instance.interceptors.request.use(
    AppVersionInterceptor.appVersion,
    AppVersionInterceptor.onRejected
  );

  instance.interceptors.request.use(
    DevConfigInterceptor.devConfig,
    AppVersionInterceptor.onRejected
  );

  return instance;
};

const ApiConfig = { instance: getInstance() };

const post = async (methodName: string, params: any = null) => {
  var response = await ApiConfig.instance.post(methodName, params);
  console.log(`APIResponse Post ${methodName} response.data>>`, response.data);
  return response;
}

class API {

  public static baseUrl = () =>{
     return ApiConfig.instance.defaults.baseURL
  }

  public static switchServer = () => {
    ApiConfig.instance = getInstance();
  };

  public static callApiPost = (URL, body) => {
    return post(URL, body);
  };

  public static signIn = body => {
    return post(API_SIGN_IN, body);
  };

  public static userReadVehicle = body => {
    return post(API_USERS_VEHICLE, body);
  };


  public static userOrgConfig = body => {
    return post(API_ORGANIZATION_CONFIG);
    // return post(API_ORG_CONFIG, body)
  };

  public static readUser = userId => {
    return post(API_USERS_READ, { userId });
  };

  public static signOut = body => {
    return post(API_SIGN_OUT, body);
  };

  public static submitCheckIn = body => {
    return post(API_SUBMIT_FORM, body);
  };
  public static submitSignature = body => {
    return post(API_SUBMIT_FORM, body);
  };

  public static createExtraTask = routeDetailId => {
    return post(API_CREATE_EXTRA_TASK, { routeDetailId });
  };

  public static getTaskDetail = (taskId, taskAction) => {
    const body = {
      id: taskId,
      taskAction,
    };
    return post(API_TASK_DETAIL_FORM, body);
  };

  public static productList = (org, text = "", pagingData = { pageSize: 500, pageIndex: 1 }) => {
    const body = {
      organizationIds: org,
      pageLimit: pagingData.pageSize,
      currentPage: pagingData.pageIndex,
      orderBy: {
        createdAt: 1,
      },
      searchInput: text,
    };

    return post(API_PRODUCT_LIST, body);
  };

  public static inventoryAllList = (orgId, date, text = "", pagingData = { pageIndex: 1, pageSize: 500 }) => {
    const body = {
      organizationIds: [orgId],
      orderBy: { createdAt: 1 },
      searchInput: text,
      currentPage: pagingData.pageIndex,
      pageLimit: pagingData.pageSize,
      date,
    };
    return post(API_INVENTORY_ALL_LIST, body);
  };


  public static supplierList = (orgId, text = "", pagingData = { pageSize: 500, pageIndex: 1 }) => {
    const body = {
      city: {},
      currentPage: pagingData.pageIndex,
      customerGroup: [],
      customerType: "1",
      orderBy: {
        createdAt: 1,
        fullName: 1,
        city: 1,
        title: 1,
      },
      organizationIds: [orgId],
      pageLimit: pagingData.pageSize,
      searchInput: text,
      species: "SUPPLIERS",
    };
    return post(API_CONTACT_LIST, body);
  };

  public static orderListFromOrderIds = (orderIds, longhaul) => {
    return post(API_ORDERS_LIST, { orderIds, longhaul });
  };

  public static inventoryList = (org, text, date, pagingData = { pageSize: 500, pageIndex: 1 }) => {
    const body = {
      organizationIds: [org],
      searchInput: text,
      currentPage: pagingData.pageIndex,
      pageLimit: pagingData.pageSize,
      date: `${date.format("YYYY-MM-DDTHH:mm:ss")}.000Z`,
    };
    return post(API_INVENTORY_LIST, body);
  };

  public static customerList = (org, text = "", pagingData = { pageSize: 2000, pageIndex: 1 }, currentLocation) => {
    const body = {
      customerType: "1",
      organizationIds: org,
      pageLimit: pagingData.pageSize,
      currentPage: pagingData.pageIndex,
      orderBy: {
        title: -1,
        city: -1,
        createdAt: 1,
      },
      searchInput: text,
      currentLocation,
    };
    return post(API_CONTACT_LIST, body);
  };

  public static customerListAll = (org, text = "", pagingData = { pageSize: 2000, pageIndex: 1 }, currentLocation) => {
    const body = {
      customerType: "1",
      organizationIds: org,
      pageLimit: pagingData.pageSize,
      currentPage: pagingData.pageIndex,
      orderBy: {
        title: -1,
        city: -1,
        createdAt: 1,
      },
      searchInput: text,
      currentLocation,
    };
    return post(API_CONTACT_LIST_ALL, body);
  };

  public static notificationList = (recipientId, pagingData = { pageSize: 500, pageIndex: 1 }) => {
    const body = {
      recipientId,
      pageLimit: pagingData.pageSize,
      currentPage: pagingData.pageIndex,
    };
    return post(API_NOTIFICATION_LIST, body);
  };

  public static updateStatusNotification = (recipientId, objectId, markAll = false) => {
    const body = {
      recipientId,
      objectId,
      markAll,
    };

    return post(API_NOTIFICATION_UPDATE, body);
  };


  public static orderList = (text = "", date, purchase, page, orgIds, salesCode) => {
    const endDate = Moment(date).format("YYYY-MM-DD");
    const startDate = Moment(date).subtract(1, "days").format("YYYY-MM-DD");
    const body = {
      purchase,
      organizationIds: orgIds,
      searchInput: text,
      currentPage: page.pageIndex,
      pageLimit: page.pageSize,
      orderBy: { createdAt: -1 },
      startDate: `${startDate}T17:00:00.000Z`,
      endDate: `${endDate}T16:59:59.999Z`,
      salesCode,
      manuallySort: true,
      timeZone: "Asia/Saigon",
    };
    return post(API_ORDERS_LIST, body);
  };

  public static createOrderCode = () => {
    const body = {
      connection: "SALES-ORDER",
      endTime: Moment().endOf("day"),
      organizationIds: [],
      startTime: Moment().startOf("day"),
    };
    return post(API_ORDERS_CREATE_CODE, body);
  };

  public static pushLocation = body => {
    return post(API_UPDATE_LOCATIONS, body);
  };

  public static createOrder = body => {
    return post(API_ORDERS_CREATE, body);
  };

  public static getOrganizationList = text => {
    return post(API_ORG_LIST, {
      pageLimit: 300,
      currentPage: 1,
      orderBy: {
        roleGroupName: 1,
        createdAt: 1,
      },

      searchInput: "",
    });
  };
  public static getOrgBranchList = organizationIds => {
    return post(API_ORG_BRANCH_LIST, {
      // organizationIds: organizationIds,
      organizationCategoryCode: ["BRANCH"],
      // orderBy: {
      //     createdAt: 1,
      // },
      // pageLimit: 300,
      // currentPage: 1,
    });
  };

  public static getOrgRead = organizationIds => {
    return post(API_ORG_READ, {
      organizationId: organizationIds,
      // organizationCategoryCode: ['BRANCH'],
      // orderBy: {
      //     createdAt: 1,
      // },
      // pageLimit: 300,
      // currentPage: 1,
    });
  };
  public static getOrgParentBranch = (organizationCategoryCode, organizationId) => {
    return post(API_ORG_PARENT_BRANCH, {

      organizationCategoryCode,
      organizationId,
      // orderBy: {
      //     createdAt: 1,
      // },
      // pageLimit: 300,
      // currentPage: 1,
    });
  };

  public static inventoryReferenceApi = (organizationIds, date, listSku) => {
    const body = {
      currentPage: 1,
      date,
      orderBy: {
        createdAt: 1,
      },
      organizationIds,
      pageLimit: 25,
      query: { listSku },
      searchInput: "",
    };

    return post(API_REFER_INVENT, body);
  };

  public static orderListInventoryApi = (organizationIds, date, listSku) => {
    const body = {
      currentPage: 1,
      date,
      orderBy: {
        lastUpdatedOnhandQty: -1,
      },
      organizationIds,
      pageLimit: 1000,
      query: { listSku },
      searchInput: "",
    };
    return post(API_ODER_LIST_INVENT, body);
  };

  public static categoryListApi = org => {
    const body = {
      organizationIds: org,
      pageLimit: 500,
      currentPage: 1,
      orderBy: {
        createdAt: 1,
      },
      searchInput: "",
    };

    return post(API_CATEGORY_LIST, body);
  };

  public static submitForm = (taskId, form, eAVs = [], taskAction, taskDetail, isTelematic, shipmentId) => {
    const body = {
      taskId,
      lastResponse: {
        entities: form,
        eAVs,
      },
      checkOut: {
        imageUrls: [],
        latitude: null,
        longitude: null,
        status: 2,
        timestamp: new Date(),
        username: null,
      },
      status: taskDetail.task.status,
      taskAction,
      note: taskDetail.note,
      customerId: (taskDetail.task && taskDetail.task.customer) ? taskDetail.task.customer._id : null,
      taskActionCode: taskAction.taskActionCode,
      isTelematic,
      shipmentId,
    };
    return post(API_SUBMIT_FORM, body);
  };

  public static getTaskList = (date, org) => {
    const endDate = Moment(date).format("YYYY-MM-DD");
    const startDate = Moment(date).subtract(1, "days").format("YYYY-MM-DD");

    const body = {
      organizationIds: [org],
      searchInput: "",
      currentPage: 1,
      pageLimit: 200,
      orderBy: { startAt: 1 },
      startDate: `${startDate}T17:00:00.000Z`,
      endDate: `${endDate}T16:59:59.999Z`,
      status: [],
      filterBy: {
        taskActionIds: [],
        organizationsIds: [org],
      },
      listUserOrgs: Array.isArray(org) ? [org[0]] : [org],
      assignTo: [],
      isMobile: true,
    };

    return post(API_TASK_LIST, body);
  };

  public static taskDetail = body => {
    return post(API_TASK_DETAIL_FORM, body);
  };

  public static taskRead = body => {
    return post(API_TASK_READ, body);
  };

  public static vfastPromotionApi = body => {
    return post(API_PROMOTION_VFAST, body);
  };


  public static initiativePromotionApi = body => {
    return post(API_PROMOTION_INITIATIVE, body);
  };

  public static getSubTaskList = (date, org, taskIds) => {
    const endDate = Moment(date).format("YYYY-MM-DD");
    const startDate = Moment(date).subtract(1, "days").format("YYYY-MM-DD");

    const body = {
      organizationIds: [org],
      searchInput: "",
      currentPage: 1,
      pageLimit: 200,
      orderBy: { startAt: 1 },
      startDate: `${startDate}T17:00:00.000Z`,
      endDate: `${endDate}T16:59:59.999Z`,
      status: [],
      filterBy: {
        taskActionIds: [],
        organizationsIds: [org],
      },
      listUserOrgs: Array.isArray(org) ? [org[0]] : [org],
      assignTo: [],
      isMobile: true,
      isIds: taskIds,

    };

    return post(API_TASK_LIST, body);
  };

  public static snapToRoad = latlng => {
    return axios.get(`${API_SNAP_TO_ROAD}?path=${latlng}&key=${AppConfig.GOOGLE_API_KEY}`);
  };

  public static containerList = (pagingData, textSearch, filterBy) => {
    const body = {
      orderBy: {
        createdAt: -1,
      },
      pageLimit: pagingData.pageSize,
      currentPage: pagingData.pageIndex,
      searchInput: textSearch,
      filterBy,
    };
    return post(API_CONTAINER_LIST, body);
  };


  public static getContainerDetail = containerId => {
    const body = {
      containerId,
    };
    return post(API_CONTAINER_DETAIL, body);
  };

  public static updateContainer = containerId => {
    const body = {
      containerId,
    };
    return post(API_CONTAINER_UPDATE, body);
  };

  public static trailerList = (textSearch, filterBy, locationId, pagingData = { pageIndex: 1, pageSize: 500 }) => {
    const body = {
      orderBy: {
        createdAt: -1,
      },
      pageLimit: pagingData.pageSize,
      currentPage: pagingData.pageIndex,
      searchInput: textSearch,
      filterBy,
      locationId,
      attachedContainerIds: false,
    };
    return post(API_TRAILER_LIST, body);
  };


  public static getTrailerDetail = (trailerId, organizationIds) => {
    const body = {
      trailerId,
      organizationIds,
    };
    return post(API_TRAILER_DETAIL, body);
  };

  public static updateTrailer = containerId => {
    const body = {
      containerId,
    };
    return post(API_TRAILER_UPDATE, body);
  };


  public static orderDetail = orderId => {
    return post(API_ORDERS_READ, { orderId });
  };

  public static requestShipment = (shipmentId, userId) => {
    const body = {
      shipmentId, userId,
    };
    return post(API_REQUEST_SHIPMENT, body);
  };

  public static shipmentList = (deviceId, is_assigned, shipmentStatus = [], organizationIds, transportMode = FreightConstant.SHIPMENT_TRANSPORT_MODE.ROAD, startDate = "", endDate = "", shipmentCodeSearchString = "", departureFullNameSearchString = "", arrivalFullNameSearchString = "", feeStatus = "", pagingData = { pageIndex: 1, pageSize: 500 }) => {
    const body = {
      deviceId,
      currentPage: pagingData.pageIndex,
      pageLimit: pagingData.pageSize,

      is_assigned,
      shipmentStatus,
      organizationIds: [organizationIds],
      transportMode,
      startDate,
      endDate,
      shipmentCodeSearchString,
      departureFullNameSearchString,
      arrivalFullNameSearchString,
      feeStatus,
    };
    return post(API_SHIPMENT_LIST, body);
  };

  public static shipmentDetail = (shipmentId, transportMode) => {
    const body = {
      shipmentId,
      transportMode,
    };
    return post(API_SHIPMENT_DETAIL, body);
  };

  public static reuqestContainer = (shipmentId, userId, deviceId, organizationId) => {
    return post(API_CONTAINER_REQUEST, { shipmentId, userId, deviceId, organizationId });
  };


  public static discountList = (organizationId, timestamp, pagingData = { pageIndex: 1, pageSize: 500 }) => {
    const body = {
      inputSearh: "",
      fromDate: "",
      dueDate: "",
      filterBy: {
        organizationIds: [organizationId],
      },
      createdAtFrom: "",
      createdAtTo: "",
      currentPage: pagingData.pageIndex,
      pageLimit: pagingData.pageSize,
      timestamp,
    };
    return post(API_DISCOUNT_LIST, body);
  };

  public static promotionList = (organizationId, timestamp, pagingData = { pageIndex: 1, pageSize: 500 }) => {
    const body = {
      filterBy: {
        organizationIds: [organizationId],
      },
      inputSearh: "",
      fromDate: "",
      dueDate: "",
      currentPage: pagingData.pageIndex,
      pageLimit: pagingData.pageSize,
      timestamp,
    };
    return post(API_PROMOTION_LIST, body);
  };

  public static chargeList = (orgId, pagingData = { pageIndex: 1, pageSize: 500 }) => {
    const body = {
      searchInput: "",
      currentPage: pagingData.pageIndex,
      pageLimit: pagingData.pageSize,
      orderBy: {
        createdAt: -1,
      },
      orgId,

    };
    return post(API_CHARGE_LIST, body);
  };

  public static addChargeShipment = body => {
    return post(API_SHIPMENT_ADD_CHARGE, body);
  };

  public static reportUserInfomation = (user, userInfo) => {
    return ApiConfig.instance.put(`${API_ABIVIN_USER_CONSOLE}${user._id}.json`, userInfo).then();
  };

  public static reportUserLocationInfo = (user, uniqueID, location) => {
    return ApiConfig.instance.put(`${API_ABIVIN_USER_DEVICES}${user._id}/${uniqueID}/location.json`, location).then();
  };

  public static reportUserDivceInfo = (user, uniqueID, deviceInfo) => {
    return ApiConfig.instance.put(`${API_ABIVIN_USER_DEVICES}${user._id}/${uniqueID}.json`, deviceInfo).then();
  };


  public static addChargeListShipment = (orgId, shipmentId, isOtmRefreshing, pagingData = { pageIndex: 1, pageSize: 500 }) => {
    const body = {
      searchInput: "",
      currentPage: pagingData.pageIndex,
      pageLimit: pagingData.pageSize,
      orderBy: { createdAt: -1 },
      orgId,
      organizationId: orgId,
      shipmentId,
      isOtmRefreshing,
    };
    return post(API_SHIPMENT_CHARGE_LIST, body);
  };

  public static getShipmentLocationList = shipmentId => {
    const body = {
      shipmentId,
    };
    return post(API_SHIPMENT_LOCATION_LIST, body);
  };


  public static requestTrailer = (trailerId, deviceId, organizationId) => {
    const body = {
      deviceId,
      organizationId,
    };
    return post(`/freights/trailers/${trailerId}/request`, body);
  };


  public static detachTrailer = trailerId => {
    const body = {
      isMobile: true,
    };
    return post(`/freights/trailers/${trailerId}/detach`, body);
  };

  /**
   * shipmentID : currentShipment
   * locationID: location that user select 
   * newStopIndex: if adding to head , = 0; if adding to last, = shipment.shipmentStopIds.length,
   * organizationIds: organaization ID,
   * approvalRequired
   */
  public static addNFR = (shipmentID, locationId, approvalRequired, lastLocationIndex, vehicleId, organizationId) => {
    const body = {
      nfrApprovalRequired: approvalRequired,
      locationId,
      newStopIndex: lastLocationIndex,
      taskFinishDate: new Date(),
      vehicleId,
      organizationId,
    };
    return post(`/shipments/${shipmentID}/nfr`, body);
  };

  public static getRouteLocation = (userIds, organizationIds, endDate, routeDetailIds) => {
    const endTime = Moment(endDate).format("YYYY-MM-DD");
    const startTime = Moment(endDate).subtract(1, "days").format("YYYY-MM-DD");
    const body = {
      userIds,
      organizationIds,
      startTime: `${startTime}T17:00:00.000Z`,
      endTime: `${endTime}T16:59:59.999Z`,
      routeDetailIds,
    };
    return post(API_ROUTE_LOCATION_LIST, body);
  };

  public static getAddressFromLatlng = latlng => {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${AppConfig.GOOGLE_API_KEY}`);
  };

  public static changePass = (password, newPassword, verifyPassword, isRecoverPass, username, verifyCode) => {
    const body = {
      password,
      newPassword,
      verifyPassword,
      force: isRecoverPass,
      username,
      verifyCode,
    };

    return post(API_CHANGE_PASSWORD, body);
  };


  public static changeShipmentBargeETA = (shipmentStopId, estimatedArrival, shipmentCode, shipmentId) => {
    const body = {
      estimatedArrival,
      shipmentCode,
      shipmentId,
    };

    return post(`shipments-stop/${shipmentStopId}/eta`, body);
  };


  public static updateImageShipmentStop = (shipmentStopId, images) => {
    const body = {
      images,
    };

    return post(`shipments-stop/${shipmentStopId}/images`, body);
  };

  public static createOtherTaskShipment = (shipmentStopId, organizationIds) => {
    const body = {
      organizationIds,
    };

    return post(`/shipment-stops/${shipmentStopId}/other-task`, body);
  };

  public static forgotPassword = username => {
    const body = {
      username,
    };
    return post(API_FORGOT_PASSWORD, body);
  };

  public static verifyCodeForgotPass = (username, code) => {
    const body = {
      username, code,
    };
    return post(API_FORGOT_PASS_CODE, body);
  };

  public static twoStepVerify = (twoStepData, loginData, code) => {
    const body = {
      twoStepData,
      loginData,
      code,
    };
    return post(API_TWO_STEP_VERIFY, body);
  };

  public static resendTwoStepCode = twoStepData => {
    const body = {
      data: twoStepData.two_step_data,
      type: "email",
    };
    return post(API_RESEND_TWO_STEP_CODE, body);
  };

  public static moveOrder = (dataDate, organizationId, listTasks) => {
    const body = {
      dataDate,
      organizationId,
      listTasks,
    };
    return post(API_MOVE_ORDER, body);
  };

  public static checkMoveTask = (organizationId) => {
    const body = {
      organizationId: organizationId
    };
    return post(API_CHECK_MOVE_TASK, body);
  };
}


export default API;


