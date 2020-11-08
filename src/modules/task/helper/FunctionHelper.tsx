import React, { Component } from 'react';
import DeviceInfo from 'react-native-device-info';
import Moment from "moment/moment";
import { API_PROMOTION_VFAST } from "../../../network/URL";
import listReasonMissingData from "../../form/helpers/ListReasonMissingData";
import { surveyConfig } from "../mockdata/SurveyConfig";

const isTablet = DeviceInfo.isTablet();
import _ from 'lodash';
import TaskCode from '../../../constant/TaskCode';
import TaskHelper from './TaskHelper';
import Messages from '../../../constant/Messages';
import { Localize } from '../../setting/languages/LanguageManager';
import FormType from '../../../constant/FormType';
import messages from '../../../constant/Messages';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Platform } from 'react-native';
import OrderInfo from '../../../constant/OrderInfo';
import store from '../../../store/store';
import FreightConstant from '../../freight/FreightConstant';
import { Image } from 'react-native';
import AppSizes from '../../../theme/AppSizes';
import MarkerImage from '../../../components/MarkerImage';
import ShipmentControl from '../../shipment/ShipmentControl';
import AppColors from '../../../theme/AppColors';
import SVGMarkerIndex from '../../../components/svg/SVGMarkerIndex';
import SVGMarkerDepot from '../../../components/svg/SVGMarkerDepot';
import SvgMarkerTruck from '../../../components/svg/SVGMarkerTruck';
import AlertUtils from '../../../utils/AlertUtils';

const FULLFILLMENT_STATUS = {
    NOT_FULFILLED: 1,
    FULFILLED: 2,
    PARTIALLY_FULFILLED: 3,
    UNFULFILLED: 4
};

// const editO
export const checkBaseAction = actionCode => [TaskCode.SOS, TaskCode.SOD, TaskCode.SOOS, TaskCode.VFAST, TaskCode.SURVEYHSM, TaskCode.SURVEYCCC, TaskCode.SURVEYIS, TaskCode.SURVEYCVS, TaskCode.SURVEYMM, TaskCode.INITIATIVE, TaskCode.SURVEYHM, TaskCode.SURVEYSM, TaskCode.INITIATIVE_MR, TaskCode.INITIATIVE_IS, TaskCode.INITIATIVE_CVS, TaskCode.INITIATIVE_MM, TaskCode.INITIATIVE_CCC, TaskCode.INITIATIVE_HM, TaskCode.INITIATIVE_SM, TaskCode.PHOTO_APP, TaskCode.INITIATIVE_MMTIER1, TaskCode.INITIATIVE_MMTIER2, TaskCode.INITIATIVE_HB, TaskCode.INITIATIVE_DP, TaskCode.SURVEYMM_TIER_1, TaskCode.SURVEYMM_TIER_2, TaskCode.SURVEYHB, TaskCode.SURVEYDP].find(code => code === actionCode);

export const isVisibilityTask = actionCode => [TaskCode.SURVEYHSM, TaskCode.SURVEYCCC, TaskCode.SURVEYIS, TaskCode.SURVEYCVS, TaskCode.SURVEYMM, TaskCode.SURVEYHM, TaskCode.SURVEYSM, TaskCode.SURVEYMM_TIER_1, TaskCode.SURVEYMM_TIER_2, TaskCode.SURVEYHB, TaskCode.SURVEYDP].find(code => code === actionCode);

export const isInitiativeTask = actionCode => [TaskCode.INITIATIVE_IS, TaskCode.INITIATIVE_MR, TaskCode.INITIATIVE, TaskCode.INITIATIVE_CVS, TaskCode.INITIATIVE_MM, TaskCode.INITIATIVE_CCC, TaskCode.INITIATIVE_HM, TaskCode.INITIATIVE_SM, TaskCode.INITIATIVE_MMTIER1, TaskCode.INITIATIVE_MMTIER2, TaskCode.INITIATIVE_HB, TaskCode.INITIATIVE_DP,].find(code => code === actionCode);

export const isDeliveryTask = actionCode => [TaskCode.GIAO_HANG, TaskCode.HET_NGAY, TaskCode.SOAN_HANG, TaskCode.LOADING_AT_STORE, TaskCode.TRANSIT, TaskCode.EXTRA_TASK].find(code => code === actionCode);

export const isAoSmithTask = actionCode => [TaskCode.LAP_DAT, TaskCode.THAY_THE_LINH_KIEN, TaskCode.CAP_NHAT_PHAN_MEM, TaskCode.BAO_DUONG, TaskCode.BAO_HANH, TaskCode.KHAO_SAT, TaskCode.TAI_LAP_DAT, TaskCode.SUA_CHUA, TaskCode.KHAC, TaskCode.THAY_THE_LOI_LOC, TaskCode.LAP_BOM_TANG_AP, TaskCode.LAP_PRE_FILTER, TaskCode.KM_BO_LOC_PRE_FILTER, TaskCode.DOI_CAU_HINH_MAY, TaskCode.HAPPY_CALL, TaskCode.GIAI_QUYET_KHIEU_NAI, TaskCode.TAI_LAP_DAT_BOM, TaskCode.KIEM_NGHIEM_NUOC, TaskCode.THAO_MAY].find(code => code === actionCode);

export const isSaigonNewPortTask = actionCode => [TaskCode.SAIGON_NEWPORT].find(code => code === actionCode);

export const isPhototAppTask = actionCode => [TaskCode.PHOTO_APP].find(code => code === actionCode);

export const isGeometryTask = actionCode => [TaskCode.CHECK_IN, TaskCode.CHECK_OUT, TaskCode.SOS, TaskCode.SOD, TaskCode.SOOS, TaskCode.VFAST, TaskCode.SURVEYHSM, TaskCode.SURVEYCCC, TaskCode.SURVEYIS, TaskCode.SURVEYCVS, TaskCode.SURVEYMM, TaskCode.INITIATIVE, TaskCode.SURVEYHM, TaskCode.SURVEYSM, TaskCode.INITIATIVE_MR, TaskCode.INITIATIVE_IS, TaskCode.INITIATIVE_CVS, TaskCode.INITIATIVE_MM, TaskCode.INITIATIVE_CCC, TaskCode.INITIATIVE_HM, TaskCode.INITIATIVE_SM, TaskCode.PHOTO_APP, TaskCode.INITIATIVE_MMTIER1, TaskCode.INITIATIVE_MMTIER2, TaskCode.INITIATIVE_HB, TaskCode.INITIATIVE_DP, TaskCode.SURVEYMM_TIER_1, TaskCode.SURVEYMM_TIER_2, TaskCode.SURVEYHB, TaskCode.SURVEYDP].find(code => code === actionCode);

export const isSnpTask = actionCode => [TaskCode.GATE_IN, TaskCode.LIFT_ON_1, TaskCode.GATE_OUT, TaskCode.LIFT_ON_0, TaskCode.LIFT_OFF, TaskCode.STUFFING_START, TaskCode.STUFFING_FINISH, TaskCode.DESTUFFING_START, TaskCode.DESTUFFING_FINISH, TaskCode.TRAILER_ATTACH, TaskCode.TRAILER_DETACH, TaskCode.CHARGE_FEE, TaskCode.SHIPPING_COMPLETED, TaskCode.SHIPPING_STARTED, TaskCode.IN_PORT, TaskCode.IN_WHARVES, TaskCode.LINED_UP_COMPLETED, TaskCode.LINED_UP_STARTED, TaskCode.OUT_WHARVES, TaskCode.OUT_PORT, TaskCode.UNLOAD_STARTED, TaskCode.UNLOAD_COMPLETED, TaskCode.OTHER_TASK].find(code => code === actionCode);

export const hasSubTasks = (task) => {
    return task && task.subTask;
};

export const isTMSTasks = (taskList) => {
    return taskList.filter(task => task.taskAction && (task.taskAction.taskActionCode === TaskCode.SOAN_HANG || task.taskAction.taskActionCode === TaskCode.GIAO_HANG)).length > 0;
};

export const isDepotTMSTasks = (taskList) => {
    return taskList.filter(task => task.taskAction && (task.taskAction.taskActionCode === TaskCode.DEPOT_DELIVERY || task.taskAction.taskActionCode === TaskCode.DEPOT_RECEIVING)).length > 0;
};
/**
 * return true when profit cases:
 * List tasks has length > 0
 * the first task in list(SOAN HANG) was complated
 * the last task in list (HET NGAY) was not completed
 * and the first task must be Loading task
 * @param {current list task} listTask
 */
export const isValidateStartTrackLocation = (listTask, dateSelected) => {
    if (listTask.length <= 0) {
        return false;
    }

    const today = Moment();
    if (!dateSelected || !today.isSame(Moment(dateSelected), 'day')) {
        return false;
    }

    if (!listTask[0] || !listTask[0].taskActionIds || !listTask[0].taskActionIds[0] || !isDeliveryTask(listTask[0].taskActionIds[0].taskActionCode)) {
        return false;
    }

    const deliveryTask = listTask.find(task => {
        return task.taskActionIds && task.taskActionIds.length > 0 && task.taskActionIds[0].taskActionCode === TaskCode.SOAN_HANG;
    });

    if (!deliveryTask || deliveryTask.status !== TaskHelper.status.COMPLETE) {
        return false;
    }

    const endTaskList = listTask.filter(task => {
        return task.taskActionIds && task.taskActionIds.length > 0 && task.taskActionIds[0].taskActionCode === TaskCode.HET_NGAY;
    });

    const isAllEndTaskDone = _.every(endTaskList, task => {
        return task && task.status === TaskHelper.status.COMPLETE;
    });

    /**
     * endTaskList.length = 0 when this is longhaul trip
     */
    if (isAllEndTaskDone && endTaskList.length !== 0) {
        return false;
    }

    return true;
};

export const getRouteIdWorking = (listTask) => {
    let routeIdWorking = "";
    if (!listTask || listTask.length === 0) {
        return routeIdWorking;
    }
    const routeGroup = _.groupBy(listTask, (task) => {
        if (_.isEmpty(task.routeDetailId)) {
            return "";
        }
        return task.routeDetailId;
    });
    for (let routeId in routeGroup) {
        const listTaskRoute = routeGroup[routeId];
        const isAllTaskDone = _.every(listTaskRoute, task => {
            return task && task.status === TaskHelper.status.COMPLETE;
        });
        const isAllTaskNotDone = _.every(listTaskRoute, task => {
            return task && task.status !== TaskHelper.status.COMPLETE;
        });
        if (!isAllTaskDone && !isAllTaskNotDone) {
            routeIdWorking = routeId;
            break;
        }
    }

    return routeIdWorking;

};

export const checkToDayOrNot = input => {
    const today = Moment();
    if (typeof input === 'string') {
        return today.diff(Moment(input), 'days') >= 0;
    } else {
        return today.diff(input, 'days') >= 0;
    }
};

export const checkToDayInOut = input => {
    let result = false;

    if (typeof input === 'string') {
        result = Moment(input)
            .format('YYYY-MM-DD') === Moment()
                .format('YYYY-MM-DD');
    } else {
        result = input.format('YYYY-MM-DD') === Moment()
            .format('YYYY-MM-DD');
    }
    return result;
};

export const getRoleOrderDelete = (roleIds, orgSelectIds) => {
    const orderRoleKey = [
        'delete',
        'update',
        'view_all',
        'view',
        'insert'
    ];
    const roleId = roleIds.find(e => e.organizationId === orgSelectIds[0]);
    const orderRole = {};
    orderRoleKey.forEach((e) => {
        if (roleId && roleId.permissions[0][e].indexOf('ORDERS') !== -1) {
            orderRole[e] = true;
        } else {
            orderRole[e] = false;
        }
    });
    return orderRole;
};

export const getRegionForCoordinates = (points) => {
    // points should be an array of { latitude: X, longitude: Y }
    let minX,
        maxX,
        minY,
        maxY;

    // init first point
    ((point) => {
        minX = point.latitude;
        maxX = point.latitude;
        minY = point.longitude;
        maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
        minX = Math.min(minX, point.latitude);
        maxX = Math.max(maxX, point.latitude);
        minY = Math.min(minY, point.longitude);
        maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);

    return {
        latitude: midX,
        longitude: midY,
        latitudeDelta: deltaX,
        longitudeDelta: deltaY
    };
};

export const getPointOfCatPE = (state, panelTitle) => {
    let result = null;


    if (state.task.taskDetail.task.taskAction.taskActionCode.includes('SURVEY')) {
        result = 0;

        const cateResult = state.category.data.find(cate => cate.categoryName === panelTitle);

        if (cateResult) {
            const cateCode = cateResult.categoryCode;
            const eav = state.task.taskDetail.task.lastResponse.eAVs
                .filter(data => data.entityId === cateCode && data.entityCode === cateCode && data.value && data.value.toString()
                    .toLowerCase() === 'yes');

            if (eav.length > 0) {
                result = eav.reduce((total, eav) => {
                    const question = surveyConfig[state.task.taskDetail.task.taskAction.taskActionCode]
                        .find(obj => obj.id === eav.attributeCode && obj.category === cateCode);

                    if (question) {
                        total += parseInt(question.value, 10);
                    }
                    return total;
                }, 0);

                state.task.taskDetail.task.lastResponse.eAVs
                    .find(ea => ea.attributeCode === 'Golden Point of Cat' && ea.entityId === cateCode)
                    .value = `${result}`;

            }
        }
    }
    return result;
};

export const numberSKUMiss = (eavs) => {
    let result = 0;

    const missEavs = eavs.filter(eav => eav.attributeCode === '2');

    if (missEavs) {
        result = missEavs.length;
    }

    return result;
};

export const numberDistributed = (eavs) => {
    let result = 0;

    const eAvsLat = _.uniqBy(eavs, eav => {
        return eav.entityId && eav.entityName;
    });

    const disEavs = eAvsLat.filter(eav => eav.attributeCode === '3' || eav.attributeCode === '2');

    if (disEavs) {
        result = disEavs.length;
    }

    return result;
};

export const getAvePointPE = (state, ownProps) => {
    let result = null;

    if (state.task.taskDetail.task.taskAction.taskActionCode.includes('SURVEY') &&
        ownProps.index === undefined &&
        ownProps.typeText === 'title'
    ) {
        let resultTotal = 0;
        const eav = state.task.taskDetail.task.lastResponse.eAVs
            .filter(data => data.value && data.value.toString()
                .toLowerCase() === 'yes');

        if (eav.length > 0) {
            resultTotal = eav.reduce((total, eav) => {
                const question = surveyConfig[state.task.taskDetail.task.taskAction.taskActionCode]
                    .find(obj => obj.id === eav.attributeCode && obj.category === eav.entityCode);

                if (question) {
                    total += parseInt(question.value, 10);
                }
                return total;
            }, 0);

            result = parseInt(resultTotal / 5, 10);

            state.task.taskDetail.task.lastResponse.eAVs
                .find(ea => ea.attributeCode === 'Golden Point')
                .value = `${result}`;

            if (result > 90) {
                state.task.taskDetail.task.lastResponse.eAVs
                    .find(ea => ea.attributeCode === 'Golden Store')
                    .value = 'Yes';
            }
        }

    }
    return result;
};

export const isDisablePicker = (currentDate, taskActionCode, value) => {
    let result = false;
    if (taskActionCode === 'SOOS' &&
        (!checkToDayOrNot(currentDate) || value === 'No')
    ) {
        result = true;
    }
    return result;
};

export const defaultValueToggle = (value) => {
    let result = null;
    if (value === 'Yes') {
        result = [{ value: true }];
    } else if (value === 'No') {
        result = [{ value: false }];
    }
    return result;
};

export const defaultDataPicker = (item) => {
    // console.log("=================ITEM================", item);
    let result = item.data;
    if (item.properties && item.properties.url && item.properties.url === API_PROMOTION_VFAST) {
        result = item.proData;
    } else if (item.properties && item.properties.resource && item.properties.resource === 'value') {
        result = listReasonMissingData;
    }
    return result;
};

export const defaultValuesPicker = (item) => {
    let result = item.defaultValues ? item.defaultValues : null;
    if (item.properties && item.properties.url && item.properties.url === API_PROMOTION_VFAST) {
        result = item.defaultValues;
    }

    if (item.value && item.value !== 'Yes' && item.value !== 'No') {
        result = [{ value: item.item }];
    }
    return result;
};

export const textSizeHTMLToText = (type) => {
    if (type === 'sub_title') return AppSizes.fontSmall;
    return AppSizes.fontBase;
};

export const borderSizeHTMLToText = (type) => {
    if (type === 'title') {
        return 1;
    }// else if (type === 'sub_title') return 0.5;
    else if (type === 'sub_title') return 1;
    return 0;
};

export const valueOfSurvey = (task, index) => {
    let value = '';
    // console.log('valueOfSurvey', 'Task', task);
    // console.log('valueOfSurvey', 'index', index);

    const question = surveyConfig[task.taskAction.taskActionCode].find(q =>
        q.id === task.lastResponse.eAVs[index].attributeCode &&
        q.category === task.lastResponse.eAVs[index].entityCode);
    const questionValue = question.value;

    if (task.lastResponse.eAVs[index].value && task.lastResponse.eAVs[index].value.toString()
        .toLowerCase() === 'yes') {
        value = `${questionValue}${'/'}${questionValue}`;
    } else if (task.lastResponse.eAVs[index].value && task.lastResponse.eAVs[index].value.toString()
        .toLowerCase() === 'no') {
        value = `${'0/'}${questionValue}`;
    } else {
        value = ' ';
    }
    return value;
};


export const itemTypeCompareBaseAction = (item, _action, baseAction) => {
    if (item.key === _action.data.propertyName && item.index === _action.data.index) {
        if (isInitiativeTask(baseAction) || isPhototAppTask(baseAction)) {
            return {
                ...item,
                defaultValues: _action.data.data,
                _id: _action.data._id
            };
        } else {
            return {
                ...item,
                defaultValues: _action.data.data,
                value: _action.data.data[0].value,
                _id: _action.data._id
            };
        }
    }

    let result = item;
    switch (item.type) {
        case 'panel':
            result = {
                ...item,
                components: item.components.map(com => itemTypeCompareBaseAction(com, _action, baseAction))
            };
            break;
        case 'columns':
            result = {
                ...item,
                columns: item.columns.map(com =>
                    ({
                        ...com,
                        components: com.components.map(value => itemTypeCompareBaseAction(value, _action, baseAction))
                    }))
            };
            // item.columns.locations(com => com.components.locations(value => findElementChangeByKey(value, _action) ) ) ;
            break;

        default:
            result = item;
    }

    return result;
};

export const itemTypeCompare = (item, _action) => {
    if (item.key === _action.data.propertyName) {
        return {
            ...item,
            defaultValues: _action.data.data
        };
    }
    return item;
};


export const addFormINITask = (state, action, components) => {
    const eavs = state.taskDetail.task.lastResponse.eAVs;

    if (action.data && action.data.propertyType === FormType.SELECT) {
        // const programSelect = action.data.data[0].value;
        const programList = action.data.programList;
        const programSelects = programList.filter((pro) => {
            return pro.title === action.data.data[0].value;
        });

        const programSelect = programSelects[0];

        //get all products of selected program
        let proEavs = eavs.filter(eav => {
            return eav.entityName === programSelect.title && (!eav.value || !eav.value.includes('http'));
        });

        let columnDefault = _.cloneDeep(components[2].components[1].columns);
        components[2].components.splice(2, components[2].components.length - 2);


        if (proEavs && proEavs.length > 0) {
            proEavs.forEach(product => {
                let columns = _.cloneDeep(columnDefault);
                columns[0].components[0].content = product.productName;
                columns[1].components[0].value = product.value;
                columns[1].components[0].product = product;
                columns[1].components[0].program = programSelect.title;

                components[2].components.push({
                    columns,
                    input: false,
                    key: "undefinedPanelColumns2",
                    tableView: false,
                    tags: [],
                    type: "columns"
                });
            });
        }
        //change imgae
        components[3].program = programSelect;
        components[4].program = programSelect;

        const eavsInput1 = _.filter(eavs, (eav) => {
            return eav.attributeCode === components[3].key && eav.entityName === programSelect.title;
        });

        if (eavsInput1 && eavsInput1.length > 0) {
            components[3].defaultValues = [{ value: eavsInput1[0].value }];
            components[3].defaultValue = eavsInput1[0].value;
        } else {
            components[3].defaultValues = [];
            components[3].defaultValue = '';
        }

        const eavsInput2 = _.filter(eavs, (eav) => {
            return eav.attributeCode === components[4].key && eav.entityName === programSelect.title;
        });

        if (eavsInput2 && eavsInput2.length > 0) {
            components[4].defaultValues = [{ value: eavsInput2[0].value }];
            components[4].defaultValue = eavsInput2[0].value;
        } else {
            components[4].defaultValues = [];
            components[4].defaultValue = '';
        }
        console.log("addFormINITask FormType>>", components);
    } else if (action.data && action.data.propertyType === 'checkbox') {
        //find index of PSKU that user click checkbox
        let index = _.findIndex(eavs, (eav) => {
            return eav.entityName === action.data.program && eav.productCode === action.data.product.productCode;
        });

        //find index of component that user click checkbox
        let indexComponent = _.findIndex(components[2].components, (component) => {
            return component.columns[1].components[0].program === action.data.program && component.columns[1].components[0].product.productCode === action.data.product.productCode;
        });
        if (index >= 0) {
            eavs[index].value = action.data.data[0].value;
        }
        if (indexComponent >= 0) {
            components[2].components[indexComponent].columns[1].components[0].value = action.data.data[0].value;
        }
    } else if (action.data && action.data.propertyType === 'file') {
        const index = eavs.findIndex((eav) => eav.attributeCode && eav.attributeCode === action.data.propertyName && action.data.program.title === eav.entityName);
        console.log("addFormINITask file>>", index);
        if (!index || index < 0) {
            eavs.push({
                label: action.data.label,
                value: action.data.data[0].value,
                attributeCode: action.data.propertyName,
                entityName: action.data.program.title,
                entityCode: action.data.program.code,
                // _id: '5af18360a9f0fd7414908790'
            });
        } else {
            //in case remove all
            if (_.isEmpty(action.data.data)) {
                _.remove(eavs, function (eav, indexFilter) {
                    return index === indexFilter;
                });
            } else {
                eavs[index].value = action.data.data[0].value;
            }

        }
    }
};

export const addFormPhotoAppTask = (action) => {
    // const eavs = state.taskDetail.task.lastResponse.eAVs;
    let eavResult = [];
    if (action.data && action.data.propertyType === FormType.PICK_IMAGE && action.data.data && action.data.data.length > 0) {

        eavResult = action.data.data.map(imageData => {
            return {
                label: action.data.label,
                value: imageData.value,
                attributeCode: action.data.propertyName,
                entityName: imageData.timestamp,
                entityCode: imageData.latlng,
            };
        });
    }
    return eavResult;
};

export const addFormBaseActionHandle = (state, action, components) => {
    const dataChange = state.taskDetail.task.lastResponse.eAVs[action.data.index];

    if (dataChange) {
        dataChange.value = action.data.data[0].value;

        if (state.taskDetail.task.taskAction.taskActionCode === 'SOOS') {
            console.log("action.data.data[0].value change at reducer", action.data.data[0].value);

            if (action.data.data[0].value === 'Yes') {
                dataChange.value = "Yes";
                dataChange.attributeCode = '3';
            } else if (action.data.data[0].value === 'No') {
                dataChange.attributeCode = '4';

                const eavsRight = _.filter(state.taskDetail.task.lastResponse.eAVs, eav => {
                    return !(eav.entityName === dataChange.entityName && (eav.attributeCode === '3' || eav.attributeCode === '1'));
                });
                console.log("addFormBaseActionHandle eavsRight>>", eavsRight);
                state.taskDetail.task.lastResponse.eAVs = eavsRight;
                console.log("addFormBaseActionHandle lastResponse.eAVs>>", state.taskDetail.task.lastResponse.eAVs);
            } else {
                dataChange.value = "Yes";
                dataChange.attributeCode = '2';
                dataChange.value = action.data.data[0].value;

                const eavsList = state.taskDetail.task.lastResponse.eAVs;
                const index = _.findIndex(eavsList, eav => {
                    return eav.entityName === dataChange.entityName && eav.attributeCode === '3';
                });
                if (index < 0) {
                    state.taskDetail.task.lastResponse.eAVs.push(
                        {
                            ...dataChange,
                            attributeCode: '3',
                            value: 'Yes'
                        },
                        {
                            ...dataChange,
                            attributeCode: '1',
                            value: 'Yes'
                        }
                    );
                }

            }
        } else {
        }

    } else {
    }

    if (state.taskDetail.task.taskAction.taskActionCode === 'V-FAST' && action.data.propertyType === 'select') {

        const promotionCode = state.promotion.find(pro => pro.title === action.data.data[0].value).code;

        state.taskDetail.task.lastResponse.eAVs
            .forEach((pro, index) => {


                if (pro.entityCode === promotionCode) {
                    const element = components
                        .find(value => pro.attributeCode === value.properties.resource);

                    if (element) {
                        element.defaultValues = [{ value: pro.value }];
                        element._id = pro._id;
                        element.index = index;
                    } else {
                        console.log("addFormBaseActionHandle", "Couldn't find the element", pro);
                    }
                } else {
                    console.log("addFormBaseActionHandle", "Another promotion code", pro);
                }
            });

        console.log("addFormBaseActionHandle", "components", components);
    }

    console.log("CHECK ALL THE THING CHANGE", state.taskDetail.task.lastResponse.eAVs);
};

export const validateDeliveryTripTasks = (tripTasks, taskDetail) => {
    /**
     * Check delivery task with rules:
     *      + not allow to submit HET_NGAY task, when have not completed SOAN_HANG, GIAO_HANG tasks
     *      + not allow to submit GIAO_HANG task, when have not completed SOAN_HANG task
     *      + when you doing one GIAO_HANG task, you can not do the an other
     */
    const taskActionsCode = taskDetail.task.taskAction.taskActionCode;
    const taskId = taskDetail.task._id;
    const vehicle = store.getState().user.vehicle;
    const isPairTruck = vehicle && (!_.isEmpty(vehicle.associateTo) || (vehicle.associates && vehicle.associates.length > 0));
    const isDeleveryTask = taskActionsCode === TaskCode.GIAO_HANG || taskActionsCode == TaskCode.TRANSIT || taskActionsCode == TaskCode.LOADING_AT_STORE || taskActionsCode === TaskCode.VE_KHO;
    const checkTaskStatus = _.every(tripTasks, (task) => {
        if (task && task.taskActionIds && task.taskActionIds[0] && task.taskActionIds[0].taskActionCode !== TaskCode.HET_NGAY) {
            return task.status === TaskHelper.status.COMPLETE;
        }
        return true;
    });
    const checkTaskStatusCheckOut = tripTasks.every(task => {
        if (task._id !== taskId) {
            return task.status !== TaskHelper.status.INPROCESS;
        }
        return true;
    });

    if (tripTasks[0].status === TaskHelper.status.COMPLETE && taskActionsCode && taskActionsCode === TaskCode.SOAN_HANG) {
        AlertUtils.showError(Messages.notAllowPickTwice);
        return false;
    }

    if (tripTasks[0].status === TaskHelper.status.OPEN && taskActionsCode && isDeleveryTask) {
        AlertUtils.showError(Messages.haveNotLoaddingProduct);
        return false;
    }

    if (!checkTaskStatusCheckOut && !isPairTruck && taskActionsCode && isDeleveryTask && taskDetail.task.status !== TaskHelper.status.INPROCESS) {
        AlertUtils.showError(Messages.doingAnotherDeliveryTask);
        return false;

    }
    if (!checkTaskStatus && taskActionsCode && taskActionsCode === TaskCode.HET_NGAY) {
        AlertUtils.showError(Messages.haveToDoAllTask);
        return false;

    }

    return true;
};
/**
 * with multiple trips, when user have not completed the first trip => they can not to submit the second trip
 * @param {list of today tasks } taskList
 * @param {task that user is submitting} taskDetail
 */
export const validateDeliveryTrips = (taskList, taskDetail) => {
    const taskActionsCode = taskDetail.task.taskAction.taskActionCode;

    const tripTasks = _.filter(taskList, (task) => {
        return taskDetail.task.routeDetailId === task.routeDetailId;
    });

    if (!validateDeliveryTripTasks(tripTasks, taskDetail)) {
        return false;
    }

    if (taskActionsCode === TaskCode.SOAN_HANG) {
        const endTaskPreviousList = findEndTaskPreviousTrip(taskList, taskDetail);
        if (endTaskPreviousList && endTaskPreviousList.status !== TaskHelper.status.COMPLETE) {
            AlertUtils.showError(Messages.haveNotDonePreviousTrip);
            return false;
        }
    }

    return true;
};

export const findEndTaskPreviousTrip = (taskList, taskDetail) => {
    const indexTaskDetail = _.findIndex(taskList, task => {
        return task._id === taskDetail.task._id;
    });

    const endTasks = _.filter(taskList, (task, index) => {
        const taskActionsCode = task.taskAction.taskActionCode;

        return taskActionsCode === TaskCode.HET_NGAY && index < indexTaskDetail;
    });

    return endTasks[endTasks.length - 1];
};

export const getContentSecondRowTaskItem = (isTMSTasks, isDepotTMSTasks, taskItem) => {
    if (isTMSTasks) {
        const { taskActionCode } = taskItem.taskAction;
        if (taskActionCode === TaskCode.SOAN_HANG || taskActionCode === TaskCode.HET_NGAY) {
            return Localize(messages.shippingAddress) + `: ${taskItem.depot && taskItem.depot.streetAddress ? taskItem.depot && taskItem.depot.streetAddress : ""}`;

        }
        return Localize(messages.shippingAddress) + `: ${taskItem.customerId && taskItem.customerId.customerAddress}`;

    }
    if (isDepotTMSTasks) {
        return Localize(messages.licensePlate) + ': ' + taskItem.licensePlate;
    }
    return Localize(messages.createdBy) + `: ${taskItem.createdBy && taskItem.createdBy.displayName !== null ? taskItem.createdBy.displayName : ''}`;
};

export const getDisableValueTask = (taskItem, user) => {
    if (!taskItem.notInCharge || taskItem.notInCharge.length === 0) {
        return false;
    }
    
    return taskItem.notInCharge.filter(assigneeId => {
        return user && assigneeId === user._id;
    }).length > 0;
};

const getMarkerColor = (orderList) => {
    if (orderList.length === 0) {
        return AppColors.ornagerMarker;
    }

    const partlyIndex = orderList.findIndex(o => o.fulfillmentStatus == FULLFILLMENT_STATUS.PARTIALLY_FULFILLED);
    const fullFillIndex = orderList.findIndex(o => o.fulfillmentStatus == FULLFILLMENT_STATUS.FULFILLED);
    const notFullfillIndex = orderList.findIndex(o => o.fulfillmentStatus == FULLFILLMENT_STATUS.NOT_FULFILLED);
    const unFullfillIndex = orderList.findIndex(o => o.fulfillmentStatus == FULLFILLMENT_STATUS.UNFULFILLED);

    if (partlyIndex !== -1 || (fullFillIndex !== -1 && unFullfillIndex !== -1)) return AppColors.ornagerMarker;

    if (_.every(orderList, order => {
        return order.fulfillmentStatus == FULLFILLMENT_STATUS.UNFULFILLED;
    })) {
        return AppColors.redMarker;
    }
    if (_.every(orderList, order => {
        return order.fulfillmentStatus == FULLFILLMENT_STATUS.NOT_FULFILLED;
    })) {
        return AppColors.blueMarker;
    }
    if (_.every(orderList, order => {
        return order.fulfillmentStatus == FULLFILLMENT_STATUS.FULFILLED;
    })) {
        return AppColors.greenMarker;
    }

    return AppColors.ornagerMarker;
};

export const getCoordinates = (task, index) => {
    if (task.depot && task.depot.coordinate) {
        const { coordinate, organizationCode, streetAddress } = task.depot;
        return {
            coordinate,
            name: organizationCode,
            address: streetAddress
        };
    }
    if (task.customer && task.customer.coordinate) {
        const { coordinate, customerName, customerAddress } = task.customer;
        return {
            coordinate,
            name: customerName,
            address: customerAddress
        };
    }
};

const renderMarkerItem = (color, index) => {
    if (index === 0) {
        // return <SvgMarkerTruck color={color} />
        return <SVGMarkerDepot color={color} />;
    }
    return <SVGMarkerIndex color={color} content={index} />;
};

const generateMarkerListIos = (taskList, renderCalloutMarker) => {
    let markerList = [];
    const markers = {};
    taskList.map((edge, idx) => {

        let taskAddress = getCoordinates(edge, idx); // this return me the coordinates of my event
        if (!taskAddress || taskAddress.coordinate === null || idx === taskList.length - 1) {
            return;
        }
        let coordinate = taskAddress.coordinate;


        // i think the most interesting part of the function for you is there :

        const markerStr = coordinate.latitude + '_' + coordinate.longitude;
        if (markerStr in markers) {
            let newLat = markers[markerStr].coordinates.latitude;
            let newLng = markers[markerStr].coordinates.longitude;
            if (markers[markerStr].nb % 6 === 0) {
                newLat = coordinate.latitude;
            } else {
                newLng = newLng + (0.03 / 3000);
            }
            newLat = newLat + (0.03 / 3000);
            coordinate = {
                latitude: newLat,
                longitude: newLng
            };
            markers[markerStr] = {
                'coordinates': coordinate,
                'nb': markers[markerStr].nb + 1
            };
        } else {
            markers[markerStr] = {
                'coordinates': coordinate,
                'nb': 1
            };
        }

        const color = getMarkerColor(edge.orderList);
        markerList.push(
            <MarkerImage
                coordinate={{
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude
                }}
                title={taskAddress.name}
                description={`Address: ${taskAddress.address}`}
                renderCalloutMarker={renderCalloutMarker(edge, idx)}
                renderMarker={renderMarkerItem(color, idx)}
            />);
    });

    return markerList;
};

const generateMarkerListAndroid = (taskList, renderCalloutMarker) => {

    return taskList && taskList.map((task, index) => {
        if (!getCoordinates(task, index) || index === taskList.length - 1) {
            return false;
        }

        let taskAddress = getCoordinates(task, index);

        const colorPicker = getMarkerColor(task.orderList);

        return <MarkerImage
            renderMarker={renderMarkerItem(colorPicker, index)}
            coordinate={taskAddress.coordinate}
            title={taskAddress.name}
            description={`Address: ${taskAddress.address}`}
            renderCalloutMarker={renderCalloutMarker(task, index)}
        />;


    });
};

export const generateMarkerList = Platform.select({
    ios: (taskList, renderCalloutMarker) => generateMarkerListIos(taskList, renderCalloutMarker),
    android: (taskList, renderCalloutMarker) => generateMarkerListAndroid(taskList, renderCalloutMarker),
});

// START SUBMIT TASK =========================================
// BUG: Không bắt được panel=> vẫn lấy nguyên component trong panel
// FIX: return _form not return form

export const getForm = (formList) => {
    const _form = [];
    const pushData = (item, keyData) => {
        _form.push({
            validate: item.validate ? item.validate.required : false,
            label: item.label,
            propertyName: item.key,
            propertyType: item.type,
            multiple: false,
            referenceId: null,
            [keyData]: item.defaultValues,
        });
    };
    formList && formList.forEach((form) => {
        switch (form.type) {
            case 'panel':
                form.components && form.components.forEach(component => {
                    if (component.type === FormType.TEXT_FIELD) {
                        if (component && component.properties && component.properties.isAutoCapitalize === 'true') {
                            console.log("getForm isAutoCapitalize component>>", component);

                            component = {
                                ...component,
                                defaultValues: component.defaultValues && component.defaultValues[0] ? [
                                    {
                                        ...component.defaultValues[0],
                                        value: !_.isEmpty(component.defaultValues[0].value) ? component.defaultValues[0].value.toUpperCase() : ''
                                    }
                                ] : []
                            };
                        }
                    }
                    console.log("getForm component>>", component);
                    pushData(component, 'data');
                });
                break;
            case 'container':
                pushData(form, 'datas');
                break;
            default:
                pushData(form, 'data');
                break;
        }
    });
    return _form;
};

// Order validate: Do not submit when don't complete amount information

export const validateOrder = formList => formList.every((form) => {
    if (form.datas) {
        return form.datas.every((order) => {
            if (order.status !== undefined) {
                if (order.status === OrderInfo.ORDER_STATUS.PARTLY_DELIVERY || order.status === OrderInfo.ORDER_STATUS.COMPLETED || order.status === OrderInfo.ORDER_STATUS.REDUDANT) return true;
                if (order.reason) return true;
            }
            return false;
        });
    }
    return true;
});

export const validateForm = forms => forms.every(form => {
    if (!form.validate) {
        return true;
    }
    if (form.data) {
        return form.data[0] && (form.data[0].value === 'No' ? false : form.data[0].value);
    }
    return false;

});


const checkNotFulfillmentStatus = (orderList) => {
    const notFulfillOrders = orderList.filter(order => {
        return order.fulfillmentStatus === OrderInfo.FULLFILLMENT_STATUS_STRING.NOT_FULFILLED;
    });

    return orderList.length === notFulfillOrders.length;
};

const checkFulfillmentStatus = (orderList) => {
    const fulfillOrders = orderList.filter(order => {
        return order.fulfillmentStatus === OrderInfo.FULLFILLMENT_STATUS_STRING.FULFILLED;
    });

    return orderList.length === fulfillOrders.length;
};

const checkUnFulfillmentStatus = (orderList) => {
    const unFulfillOrders = orderList.filter(order => {
        return order.fulfillmentStatus === OrderInfo.FULLFILLMENT_STATUS_STRING.UNFULFILLED;
    });
    return orderList.length === unFulfillOrders.length;
};
/**
 * return 1 when all order's fulfillment status = 1
 * return 2 when all order's fulfillment status = 2
 * return 4 when all order's fulfillment status = 4
 * else return 3
 */
export const totalFulfillmentStatus = (orderList) => {
    if (!orderList || orderList.length === 0) {
        return null;
    }
    if (checkNotFulfillmentStatus(orderList)) {
        return OrderInfo.FULLFILLMENT_STATUS.NOT_FULFILLED;
    }
    if (checkFulfillmentStatus(orderList)) {
        return OrderInfo.FULLFILLMENT_STATUS.FULFILLED;
    }
    if (checkUnFulfillmentStatus(orderList)) {
        return OrderInfo.FULLFILLMENT_STATUS.UNFULFILLED;
    }

    return OrderInfo.FULLFILLMENT_STATUS.PARTIALLY_FULFILLED;
};


export const validateShipmentTask = (shipmentList, taskDetail) => {
    if (!shipmentList || shipmentList.length == 0) {
        alert('Danh sách shipment rỗng');
        return false;
    }

    const currentShipment = _.find(shipmentList, shipment => {
        const taskDoning = shipment.taskIds.filter(task => {
            return task.status === TaskHelper.status.COMPLETE;
        });
        return taskDoning.length > 0 && taskDoning.length < shipment.taskIds.length;
    });

    const shipmentOfTask = _.find(shipmentList, shipment => {
        return shipment.taskIds.filter(task => {
            return task._id === taskDetail.task._id;
        }).length > 0;
    });

    if (!shipmentOfTask) {
        AlertUtils.showError(messages.canNotGetShipmentData);

        return;
    }

    if (!ShipmentControl.isShipmentStarted(shipmentOfTask.shipmentStatus) && shipmentOfTask.shipmentStatus !== FreightConstant.SHIPMENT_STATUS.ASSIGNED_AWAITING) {
        AlertUtils.showError(messages.shipmentNotEnoughCondition);
        return false;
    }

    const indexCurrentTask = shipmentOfTask.taskIds.findIndex(task => {
        return task._id === taskDetail.task._id;
    });

    if (!currentShipment) {
        if (indexCurrentTask !== 0) {
            AlertUtils.showError(messages.mustBeRightOrderTask);

            return false;
        }
        return true;
    }


    if (shipmentOfTask._id !== currentShipment._id) {
        AlertUtils.showError(messages.doingOtherShipment);
        return false;
    }

    if (shipmentOfTask.taskIds[indexCurrentTask - 1] && shipmentOfTask.taskIds[indexCurrentTask - 1].status !== TaskHelper.status.COMPLETE) {
        AlertUtils.showError(messages.mustBeRightOrderTask);
        return false;
    }

    return true;
};

export const speedToColour = (speed) => {
    var AVERAGE_SPEED = 30; //kmph
    if (!speed || speed <= 0) return "red";
    if (speed >= AVERAGE_SPEED) return "green";

    //intermediate colour between red and green
    var rate = Math.round((255 * speed) / AVERAGE_SPEED);
    var red = 255 - rate;
    var green = rate;
    var r = red.toString(16);
    var g = green.toString(16);
    var b = "00";

    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;

    return "#" + r + g + b;
}

export const getActualRouteColorList = (locationList = []) => {
    return locationList.map(location => speedToColour(location.speed))
}