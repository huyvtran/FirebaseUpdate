import _ from "lodash";
import React, { Component } from "react";
import {
  Alert,
  Image, NativeModules, StyleSheet,
  Text,

  TouchableOpacity, View
} from "react-native";
import AwesomeListComponent from "react-native-awesome-list";
import DeviceInfo from "react-native-device-info";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/MaterialIcons";
import { connect } from "react-redux";
import ErrorAbivinView from "../../components/ErrorAbivinView";
import HeaderView from "../../components/HeaderView";
import Progress from "../../components/Progress";
import SectionsHeaderText from "../../components/SectionsHeaderText";
import TagView from "../../components/TagInputs";
import messages from "../../constant/Messages";
import OrgConfig from "../../constant/OrgConfig";
import API from "../../network/API";
import eventTypes from "../../store/constant/eventTypes";
import AppColors from "../../theme/AppColors";
import AppSizes from "../../theme/AppSizes";
import AppStyles from "../../theme/AppStyles";
import AlertUtils from "../../utils/AlertUtils";
import DeviceUtil from "../../utils/DeviceUtil";
import OrgHelper from "../../utils/OrgUtils";
import PermissionUtils from "../../utils/PermissionUtils";
import { dateWithFormat, DOB_FORMAT } from "../../utils/TimeUtils";
import FreightConstant from "../freight/FreightConstant";
import TrackLocationManager from "../locations/TrackLocationManager";
import { Localize } from "../setting/languages/LanguageManager";
import ShipmentBargeItem from "./barge/ShipmentBargeItem";
import ShipmentControl from "./ShipmentControl";
import ShipmentListManager from "./ShipmentListManager";
import ShipmentTruckItem from "./truck/ShipmentTruckItem";


const moment = require("moment");

const { RNImeiModule } = NativeModules;

class ShipmentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      currentShipment: null,
      latestCompletedShipment: null,
      vehicle: {},
      isVisibleShipmentInfo: false,
      filterSearch: [],
    };
    typeShipment = OrgHelper.getShipmentType();
    this.isShipmentBarge = typeShipment === FreightConstant.SHIPMENT_TRANSPORT_MODE.BARGE;
  }
  // ============================================= COMPONENT LIFE CYCLE =========================================//

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.event && (nextProps.event.types === eventTypes.REFRESH_SHIPMENT_LIST || nextProps.event.types === eventTypes.REFRESH_TASK_LIST)) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.shipmentList.refresh();
      }
    }

    if (nextProps.isHistory !== this.props.isHistory) {
      this.resetStateShipment();
      this.setState({ filterSearch: [] }, () => {
        this.shipmentList.refresh();
      });
    }
  }
    resetStateShipment = () => {
      this.shipmentCodeSearch = "";
      this.arrivalFullNameSearch = "";
      this.departureFullNameSearch = "";
      this.startDate = "";
      this.endDate = "";
    }

    // ============================================= UI CONTROL =========================================//


    source = async pagingData => {
      const { org } = this.props;
      const orgSelected = org && org[0] ? org[0] : null;
      const organizationIds = orgSelected ? orgSelected.id : undefined;
      const typeShipment = OrgHelper.getShipmentType();

      const listStatus = [
        FreightConstant.SHIPMENT_STATUS.APPROVAL_REQUIRED,
        FreightConstant.SHIPMENT_STATUS.VEHICLE_ASSIGNED,
        FreightConstant.SHIPMENT_STATUS.ASSIGNED_AWAITING,
        FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED,
      ];

      const listStatusHistory = [
        FreightConstant.SHIPMENT_STATUS.SHIPPING_COMPLETED,

      ];
      const { startDate, endDate, shipmentCodeSearch, departureFullNameSearch, arrivalFullNameSearch, feeStatus } = this;
      if (!this.props.isHistory) {
        pagingData = { pageIndex: 1, pageSize: 500 };
      }
      const deviceIdType = OrgHelper.getDeviceIdType();
      if (deviceIdType === OrgConfig.DEVICE_TYPE.MAC) {
        return DeviceUtil.getMACAddress().then(macNumber => {
          // AppConfig.DEV_MODE && Toast.show("MAC Address " + macNumber)
          return API.shipmentList(macNumber, null, this.props.isHistory ? listStatusHistory : listStatus, organizationIds, typeShipment, startDate, endDate, shipmentCodeSearch, departureFullNameSearch, arrivalFullNameSearch, feeStatus, pagingData).catch(error => {
            Alert.alert(Localize(messages.error), error?.response?.data?.message);
          });
        }).catch(err => {
          AlertUtils.showError(messages.cannotGetMACNumber);
          return Promise.reject(err);
        });
      } else {
        const apiLevel = await DeviceInfo.getAPILevel();
        if (apiLevel >= 29) {
          return Alert.alert("Thông báo", "Không lấy được IMEI, vui lòng lấy địa chỉ MAC!");
        } else {
          return PermissionUtils.checkReadPhoneStatePermission().then(res => {
            if (res !== PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
              AlertUtils.showError(messages.notGrantedPhoneState);
              return Promise.resolve([]);
            } else {
              return RNImeiModule.getImei().then(imeiList => {
                // AppConfig.DEV_MODE && Toast.show("IMEI number " + imeiList?.[0])
                if (imeiList && imeiList[0]) {
                  return API.shipmentList(imeiList[0], null, this.props.isHistory ? listStatusHistory : listStatus, organizationIds, typeShipment, startDate, endDate, shipmentCodeSearch, departureFullNameSearch, arrivalFullNameSearch, feeStatus, pagingData).catch(error => {
                    Alert.alert(Localize(messages.error), error?.response?.data?.message);
                  });
                } else {
                  return Promise.resolve([]);
                }
              }).catch(err => {
                return Promise.resolve([]);
              });
            }
          });
        }
      }
    }

    keyExtractor = item => item._id


    transformer = res => {
      if (!res || !res.data) {
        return [];
      }
      const { shipments, vehicle, latestCompletedShipment } = res.data;

      let shipmentResult = shipments.map(shipment => {
        return ShipmentControl.transformShipmentFromServer(shipment);
      });

      if (this.props.isHistory) {
        shipmentResult = _.reverse(_.sortBy(shipmentResult, shipment => shipment.shipmentLastProgressDate ? shipment.shipmentLastProgressDate : 0));
      } else {
        shipmentResult = _.sortBy(shipmentResult, shipment => shipment.shipmentCode);
      }

      const currentShipment = _.find(shipmentResult, shipment => ShipmentControl.isShipmentStarted(shipment.shipmentStatus));

      if (currentShipment && currentShipment._id) {
        ShipmentListManager.saveShipmentDoing(currentShipment);
      }

      if (!this.props.isHistory) {
        if (ShipmentControl.isValidaToTracking(shipmentResult)) {
          const shipmentAssignedList = shipments
            .filter(shipment => {
              return shipment.shipmentStatus === FreightConstant.SHIPMENT_STATUS.ASSIGNED_AWAITING ||
                            shipment.shipmentStatus === FreightConstant.SHIPMENT_STATUS.VEHICLE_ASSIGNED ||
                            shipment.shipmentStatus === FreightConstant.SHIPMENT_STATUS.APPROVAL_REQUIRED;
            }).map(shipment => shipment._id);
          TrackLocationManager.trackLocation("", currentShipment?._id, vehicle?._id, shipmentAssignedList);
        } else {
          TrackLocationManager.removeTrackLocation();
        }
      }

      this.setState({ currentShipment, vehicle, latestCompletedShipment });

      ShipmentListManager.saveShimentList(shipmentResult);
      return shipmentResult;
    }

    createSections = shipmentList => {
      let sections = [];
      const sectionGroup = [];

      const groupShipment = _.groupBy(shipmentList, shipment => {
        if (ShipmentControl.isShipmentStarted(shipment.shipmentStatus)) {
          return FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED;
        }
        return shipment.shipmentStatus;
      });

      // const shipmentStartedList = groupShipment[FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED] ? groupShipment[FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED] : []
      groupShipment[FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED] && sectionGroup.push(groupShipment[FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED]);
      groupShipment[FreightConstant.SHIPMENT_STATUS.APPROVAL_REQUIRED] && sectionGroup.push(groupShipment[FreightConstant.SHIPMENT_STATUS.APPROVAL_REQUIRED]);


      const vehicleAssignShippment = groupShipment[FreightConstant.SHIPMENT_STATUS.VEHICLE_ASSIGNED] || [];
      const approvalRequirenShippment = groupShipment[FreightConstant.SHIPMENT_STATUS.ASSIGNED_AWAITING] || [];
      const waitingShipmentList = [...approvalRequirenShippment, ...vehicleAssignShippment];

      waitingShipmentList.length > 0 && sectionGroup.push(waitingShipmentList);


      sections = sectionGroup.map((secGroup, index) => {
        let title = Localize(ShipmentControl.getStatusShipmentString(secGroup[0].shipmentStatus));
        title += ` (${secGroup.length})`;

        return {
          title,
          data: secGroup,
        };
      });

      return sections;
    }

    getVehicleInfo = vehicle => {
      let licensePlateInfo = `${Localize(messages.vehicle)}: ${vehicle.licensePlate ? vehicle.licensePlate : ""}`;
      if (!_.isEmpty(vehicle.vehicleInternalCode)) {
        licensePlateInfo += ` (${vehicle.vehicleInternalCode})`;
      }
      return licensePlateInfo;
    }

    getVehicleInfoMooc = vehicle => {
      let licensePlateInfo = `${Localize(messages.trailer)}: `;
      if (vehicle.attachedTrailerId && !_.isEmpty(vehicle.attachedTrailerId.licensePlate)) {
        licensePlateInfo += vehicle.attachedTrailerId.licensePlate;
      }

      if (vehicle.attachedTrailerId && !_.isEmpty(vehicle.attachedTrailerId.trailerInitialCode)) {
        licensePlateInfo += ` (${vehicle.attachedTrailerId.trailerInitialCode})`;
      }

      return licensePlateInfo;
    }

    onChangeTextSearch = text => {
      if (_.isEmpty(text)) {
        this.shipmentList.removeFilter();
        return;
      }
      this.shipmentList.applyFilter((item, index) => {
        return item.shipmentCode.toLowerCase().includes(text.toLowerCase());
      });
    }

    callBackShipmentSearch = (textSearch, mode, startDate, endDate, feeStatus) => {
      this.shipmentCodeSearch = "";
      this.departureFullNameSearch = "";
      this.arrivalFullNameSearch = "";

      const filterSearch = [];

      if (!_.isEmpty(textSearch)) {
        switch (mode.id) {
          case messages.shipmentNumber:
            this.shipmentCodeSearch = textSearch;
            filterSearch.push({ content: `${Localize(messages.shipmentNumber)}: ${textSearch}`, key: messages.shipmentNumber });

            break;
          case messages.departure:
            this.departureFullNameSearch = textSearch;
            filterSearch.push({ content: `${Localize(messages.departure)}: ${textSearch}`, key: messages.departure });

            break;
          case messages.arrival:
            this.arrivalFullNameSearch = textSearch;
            filterSearch.push({ content: `${Localize(messages.arrival)}: ${textSearch}`, key: messages.arrival });

            break;
        }
      }

      if (startDate) {
        const startDateString = moment(startDate).format("YYYY-MM-DD");
        this.startDate = `${startDateString}T00:00:00.000Z`;
        filterSearch.push({ content: `${Localize(messages.startDate)}: ${startDateString}`, key: messages.startDate });
      }
      if (endDate) {
        const endDateString = moment(endDate).format("YYYY-MM-DD");
        this.endDate = `${endDateString}T00:00:00.000Z`;
        filterSearch.push({ content: `${Localize(messages.endDate)}: ${endDateString}`, key: messages.endDate });
      }

      if (!_.isEmpty(feeStatus)) {
        this.feeStatus = feeStatus;
        switch (feeStatus) {
          case FreightConstant.FEE_SHIPMENT_STATUS.APPROVED:
            this.feeStatus = FreightConstant.FEE_SHIPMENT_STATUS.APPROVED;
            filterSearch.push({ content: Localize(messages.approved), key: messages.approved });
            break;
          case FreightConstant.FEE_SHIPMENT_STATUS.NOT_APPROVED:
            this.feeStatus = [FreightConstant.FEE_SHIPMENT_STATUS.OPEN, FreightConstant.FEE_SHIPMENT_STATUS.SENT_TO_BE_APPROVED];

            filterSearch.push({ content: Localize(messages.notApproved), key: messages.notApproved });
            break;
        }
      }

      this.setState({ filterSearch }, () => {
        this.shipmentList.refresh();
      });
    }

    onPressSearch = () => {
      Actions.shipmentSearch({ callBack: this.callBackShipmentSearch.bind(this) });
    }

    onDetachTrailer = trailerId => {
      Progress.show(API.detachTrailer, [trailerId], res => {
        this.shipmentList.refresh();
        AlertUtils.showSuccess(messages.trailerDetachSuccess);
      });
    }

    onClickAddNFR = () => {
      AlertUtils.showConfirm(messages.areYouAgreeAddNFR, () => {
        Actions.shipmentAddNFR({ shipment: this.state.latestCompletedShipment });
      });
    }

    onClickDetachTrailer = (trailerName, trailerId) => {
      const { currentShipment } = this.state;
      if (currentShipment && currentShipment._id) {
        AlertUtils.showError(messages.doingOtherShipment);
        return;
      }
      Alert.alert(Localize(messages.confirm), Localize(messages.areYouAgreeDetachTrailer) + trailerName, [
        {
          text: Localize(messages.cancel),
        },
        {
          text: messages.ok,
          onPress: () => {
            this.onDetachTrailer(trailerId);
          },
        },
      ]);
    }


    onCloseTagView = (item, index) => {
      let { filterSearch } = this.state;
      switch (filterSearch[index].key) {
        case messages.startDate:
        case messages.endDate:
          this.startDate = "";
          this.endDate = "";
          filterSearch = filterSearch.filter(item => item.key !== messages.startDate && item.key !== messages.endDate);
          break;
        case messages.notApproved:
        case messages.approved:
          this.feeStatus = null;
          filterSearch = filterSearch.filter(item => item.key !== messages.approved && item.key !== messages.notApproved);
          break;
        default:

          this.shipmentCodeSearch = "";
          this.departureFullNameSearch = "";
          this.arrivalFullNameSearch = "";
          filterSearch = filterSearch.filter(item => item.key !== messages.arrival && item.key !== messages.departure && item.key !== messages.shipmentNumber);
      }
      this.setState({ filterSearch }, () => {
        this.shipmentList.refresh();
      });
    }


    // ============================================= UI RENDER =========================================//

    renderItem = ({ item }) => {
      if (this.isShipmentBarge) {
        return <ShipmentBargeItem shipmentTask={item} />;
      }
      return <ShipmentTruckItem shipmentTask={item} />;
    }


    renderSectionHeader = ({ section }) => {
      return (<SectionsHeaderText
        title={section.title}
              />);
    }

    renderRequestNFR = () => {
      if (this.props.isHistory || this.isShipmentBarge) {
        return <View />;
      }

      if (!this.state.latestCompletedShipment) {
        return <View />;
      }
      const { vehicle } = this.state;
      const currentLocation = vehicle && vehicle.locationId ? vehicle.locationId.customerCode : Localize(messages.notDetectLocation);
      const locationName = vehicle && vehicle.locationId ? vehicle.locationId.fullName : Localize(messages.notDetectLocation);
      return (<TouchableOpacity style={styles.addNFRContainer} onPress={() => this.onClickAddNFR()}>
        <Icon
          name={"my-location"}
          color={AppColors.abi_blue}
          size={AppSizes.paddingXXLarge}
        />
        <View style={{ flex: 1, height: AppSizes.padding * 2.5 }}>
          <Text style={[styles.myLocationText, { fontSize: AppSizes.fontXXMedium }]}>{currentLocation}</Text>
          <Text style={[styles.myLocationText, { color: AppColors.textSubContent, marginTop: AppSizes.paddingTiny }]}>{locationName}</Text>
        </View>

      </TouchableOpacity >);
    }

    renderTrailerInfo = vehicle => {
      const trailerInfo = this.getVehicleInfoMooc(vehicle);
      const attachedTrailerId = vehicle && vehicle.attachedTrailerId ? vehicle.attachedTrailerId._id : null;
      return (<View style={{ justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
        <Text style={{ ...AppStyles.regularText, color: "white", marginTop: AppSizes.paddingTiny }}>{trailerInfo}</Text>
        {attachedTrailerId && <TouchableOpacity onPress={() => this.onClickDetachTrailer(trailerInfo, attachedTrailerId)}>

          <Image
            style={{ width: AppSizes.paddingLarge, height: AppSizes.paddingLarge }}
            source={require("../../assets/icon/iconTrailerDetach.png")}
          />
        </TouchableOpacity>}
      </View>);
    }

    renderShipmentOverviewInfo = vehicle => {
      if (this.props.isHistory || !vehicle) {
        return <View />;
      }
      if (this.isShipmentBarge) {
        return this.renderOverViewInfoBarge(vehicle);
      }
      return this.renderOverViewInfoRoad(vehicle);
    }

    renderOverViewInfoBarge = vehicle => {
      const { isVisibleShipmentInfo } = this.state;
      return (<View style={styles.viewInfoContainer}>
        <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between" }} onPress={() => this.setState({ isVisibleShipmentInfo: !isVisibleShipmentInfo })}>
          <Text style={styles.shipmentOverviewText}>{this.getVehicleInfo(vehicle)}</Text>
          <Icon
            name={isVisibleShipmentInfo ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            color={"white"}
            size={AppSizes.paddingXXLarge}
          />
        </TouchableOpacity>
        {isVisibleShipmentInfo && <View>
          <Text style={styles.shipmentOverviewText}>{`${Localize(messages.weight)}: ${vehicle.grossVehicleWeight ? `${vehicle.grossVehicleWeight} ${Localize(messages.tons)}` : ""}`}</Text>
          <Text style={styles.shipmentOverviewText}>{`${Localize(messages.realWeight)}: ${vehicle.realWeight ? `${vehicle.realWeight} ${Localize(messages.tons)}` : ""}`}</Text>
          <Text style={styles.shipmentOverviewText}>{`${Localize(messages.deadLineRegis)}: ${vehicle.registrationDate ? dateWithFormat(vehicle.registrationDate, DOB_FORMAT) : ""}`}</Text>
        </View>}

      </View >);
    }

    renderOverViewInfoRoad = vehicle => {
      const displayName = this.props.user !== null ? this.props.user.displayName : "";
      return (<View style={styles.viewInfoContainer}>
        <Text style={{ ...AppStyles.regularText, color: "white" }}>{`${Localize(messages.driverName)}: ${displayName}`}</Text>
        <Text style={{ ...AppStyles.regularText, color: "white", marginTop: AppSizes.paddingTiny }}>{this.getVehicleInfo(vehicle)}</Text>
        {
          this.renderTrailerInfo(vehicle)
        }
      </View>);
    }

    render() {
      const { vehicle, filterSearch } = this.state;
      return (
        <View style={styles.container}>
          <HeaderView
            onBackSearch={() => this.shipmentList.removeFilter()}
            onChangeText={text => this.onChangeTextSearch(text)}
            displayAvatar={true}
            displaySearch={this.props.isHistory}
            onPressFilter={() => {
              this.setState({ isModalFilter: true }); 
            }}
            onPressSearch={() => this.onPressSearch()}
          />
          {this.renderShipmentOverviewInfo(vehicle)}

          {this.renderRequestNFR()}
          {this.props.isHistory && filterSearch.length > 0 && <TagView
            tagList={filterSearch}
            extractorValue={item => item.content}
            onClose={(item, index) => this.onCloseTagView(item, index)}
                                                              />}
          <AwesomeListComponent
            listStyle={{ backgroundColor: AppColors.graytrans, width: "100%", height: "100%" }}
            ref={ref => this.shipmentList = ref}
            isSectionList={!this.props.isHistory}
            isPaging={this.props.isHistory}
            source={pagingData => this.source(pagingData)}
            renderItem={item => this.renderItem(item)}
            keyExtractor={item => this.keyExtractor(item)}
            emptyText={Localize(messages.noResult)}
            transformer={response => this.transformer(response)}
            renderSectionHeader={section => this.renderSectionHeader(section)}
            createSections={data => this.createSections(data)}
            renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.shipmentList.onRetry()} />}

          />

        </View >
      );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  viewInfoContainer: {
    paddingHorizontal: AppSizes.paddingMedium,
    paddingVertical: AppSizes.paddingTiny,
    backgroundColor: AppColors.abi_blue,
  },
  addNFRContainer: {
    paddingHorizontal: AppSizes.paddingMedium,
    paddingVertical: AppSizes.paddingTiny,
    backgroundColor: "rgba(3, 154, 227, 0.2)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

  },
  myLocationText: {
    ...AppStyles.regularText,
    color: AppColors.abi_blue,
    flex: 1,
    paddingLeft: AppSizes.paddingMedium,
  },
  shipmentOverviewText: {
    ...AppStyles.regularText,
    color: "white",
    marginTop: AppSizes.paddingTiny,
  },


});
export default connect(state => ({
  event: state.refresh.event,
  locale: state.i18n.locale,
  user: state.user.user,
  org: state.org.orgSelect,
}), {
})(ShipmentScreen);

