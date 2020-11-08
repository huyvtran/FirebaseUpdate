import _ from "lodash";
import React, { Component } from "react";
import {
  Alert,


  NativeModules,
  ScrollView, StyleSheet, Text, TouchableOpacity,
  View
} from "react-native";
import AwesomeListComponent from "react-native-awesome-list";
import DeviceInfo from "react-native-device-info";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import ErrorAbivinView from "../../components/ErrorAbivinView";
import SearchIconMapComponent from "../../components/SearchIconMapComponent";
import messages from "../../constant/Messages";
import OrgConfig from "../../constant/OrgConfig";
import API from "../../network/API";
import eventTypes from "../../store/constant/eventTypes";
import AppColors from "../../theme/AppColors";
import AppSizes from "../../theme/AppSizes";
import AppStyles from "../../theme/AppStyles";
import AlertUtils from "../../utils/AlertUtils";
import DeviceUtil from "../../utils/DeviceUtil";
import OrgUtils from "../../utils/OrgUtils";
import PermissionUtils from "../../utils/PermissionUtils";
import { Localize } from "../setting/languages/LanguageManager";
import ContainerItem from "./ContainerItem";
import FreightConstant from "./FreightConstant";


const { RNImeiModule } = NativeModules;

const ALL_LOCATION = {
  customerCode: Localize(messages.all),
  fullName: Localize(messages.all),
  _id: messages.all,
  isSelected: true,
};
class ContainerBargeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      tagFilterList: FreightConstant.FILTER_LIST,
      locationShipment: [],
      locationSelected: ALL_LOCATION,
      shipmentList: [],
    };
  }
  // ============================================= COMPONENT LIFE CYCLE =========================================//
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.org && nextProps.org[0] && nextProps.org[0].id && nextProps.org[0].id != this.props.org[0].id) {
      this.containerBargeList.refresh();
    }

    if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_CONTAINER_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.containerBargeList.refresh();
      }
    }
  }


  // ============================================= UI CONTROL =========================================//


    source = async() => {
      const { org } = this.props;
      const orgSelected = org && org[0] ? org[0] : null;
      const organizationIds = orgSelected ? orgSelected.id : undefined;
      const typeShipment = orgSelected && orgSelected.configurations ? orgSelected.configurations.typeShipment : undefined;

      const listStatus = [
        // FreightConstant.SHIPMENT_STATUS.NOT_ASSIGNED,
        FreightConstant.SHIPMENT_STATUS.APPROVAL_REQUIRED,
        FreightConstant.SHIPMENT_STATUS.VEHICLE_ASSIGNED,
        FreightConstant.SHIPMENT_STATUS.ASSIGNED_AWAITING,
        FreightConstant.SHIPMENT_STATUS.SHIPPING_STARTED,
      ];

      if (OrgUtils.getDeviceIdType() === OrgConfig.DEVICE_TYPE.MAC) {
        return DeviceUtil.getMACAddress().then(macNumber => {
          return API.shipmentList(macNumber, false, listStatus, organizationIds, typeShipment);
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
                if (imeiList && imeiList[0]) {
                  return API.shipmentList(imeiList[0], false, listStatus, organizationIds, typeShipment);
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

    keyExtractor = (item, index) => item._id + index

    transformer(res) {
      if (res.data && res.data.shipments) {
        let containerList = [];
        let locationShipment = [ALL_LOCATION];
        res.data.shipments.forEach(shipment => {
          locationShipment = locationShipment.concat(shipment.shipmentStopIds.map(stopId => stopId.customerId));
          shipment.shipmentStopIds.forEach(stopId => {
            containerList = containerList.concat(stopId.containerIds.map(containerId => {
              return {
                ...containerId,
                customerCode: stopId.customerId.customerCode,
              };
            }));
          });
        });
        locationShipment = _.uniqBy(locationShipment, location => location._id);
        this.setState({ locationShipment, locationSelected: ALL_LOCATION, shipmentList: res.data.shipments });

        return containerList;
      }
      return [];
    }

    onChangeTextSearch = _.debounce(text => {
      this.textSearch = text;
      this.onFilterShipment();
    }, 300);


    // ============================================= LOGIC CONTROL =========================================//

    onFilterShipment = () => {
      const { locationSelected } = this.state;
      this.containerBargeList.applyFilter((item, index) => {
        if (!_.isEmpty(this.textSearch) && locationSelected._id === ALL_LOCATION._id) {
          return item && !_.isEmpty(item.containerNumber) && item.containerNumber.toLowerCase().includes(this.textSearch.toLowerCase());
        } else if (_.isEmpty(this.textSearch) && locationSelected._id !== ALL_LOCATION._id) {
          return locationSelected.customerCode === item.customerCode;
        } else if (!_.isEmpty(this.textSearch) && locationSelected._id !== ALL_LOCATION._id) {
          return locationSelected.customerCode === item.customerCode &&
                    !_.isEmpty(item.containerNumber) && item.containerNumber.toLowerCase().includes(this.textSearch.toLowerCase());
        }
        return true;
      });
    }

    onSelectLocationItem = location => {
      this.setState({ locationSelected: location }, () => {
        this.onFilterShipment();
      });
    }

    onClickBayMap() {
      const { shipmentList } = this.state;
      if (!shipmentList || shipmentList.length === 0) {
        return;
      }
      Actions.shipmentBayMap({ shipmentData: shipmentList[0] });
    }
    // ============================================= UI RENDER =========================================//

    renderItem = ({ item }) => {
      return (<ContainerItem
        isBargeMode={true}
        container={item}
              />);
    }

    renderSearchView = () => {
      const { locationShipment } = this.state;
      return (<SearchIconMapComponent
        onChangeTextSearch={text => this.onChangeTextSearch(text)}
        onPressMap={() => Actions.freightMapSearch({ locationDataList: locationShipment, onSelectLocation: location => this.onSelectLocationItem(location) })}
              />);
    }
    renderLocationFilter = () => {
      const { locationShipment, locationSelected } = this.state;

      return (<View style={{ backgroundColor: AppColors.lightGrayTrans, paddingHorizontal: AppSizes.paddingMedium, paddingVertical: AppSizes.paddingXXSml, width: "100%" }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {locationShipment.map(location => {
            const isSelected = locationSelected._id === location._id;
            return (<TouchableOpacity onPress={() => this.onSelectLocationItem(location)} style={[styles.locationItemContainer, { backgroundColor: isSelected ? AppColors.abi_blue : AppColors.white }]}>
              <Text style={{ ...AppStyles.regularText, color: isSelected ? AppColors.white : AppColors.abi_blue }}>{location.customerCode}</Text>
            </TouchableOpacity>);
          })}
        </ScrollView>
      </View>);
    }
    render() {
      return (
        <View style={styles.container}>
          {this.renderSearchView()}
          {this.renderLocationFilter()}
          <AwesomeListComponent
            ref={ref => this.containerBargeList = ref}
            source={() => this.source()}
            renderItem={item => this.renderItem(item)}
            keyExtractor={(item, index) => this.keyExtractor(item, index)}
            emptyText={Localize(messages.noResult)}
            transformer={response => this.transformer(response)}
            renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.containerBargeList.onRetry()} />}
            filterEmptyText={Localize(messages.filterNoContainer)}
          />


        </View >
      );
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerSearch: {
    paddingHorizontal: AppSizes.paddingMedium,
    width: AppSizes.screenWidth,
    flexDirection: "row",
    borderBottomWidth: AppSizes.paddingTiny,
    borderBottomColor: AppColors.lightgray,
    backgroundColor: AppColors.white,
  },
  containerSearchInput: {
    flex: 9,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.white,

  },
  textInput: {
    flex: 12,
    fontSize: AppSizes.fontBase,
    marginLeft: AppSizes.paddingXSml,
    backgroundColor: AppColors.white,

  },
  noFilterContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  locationItemContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: AppSizes.paddingXSml,
    paddingVertical: AppSizes.paddingTiny,
    borderRadius: AppSizes.paddingTiny,
    borderWidth: AppSizes.paddingXXTiny,
    borderColor: AppColors.lightgray,
    backgroundColor: "white",
    marginRight: AppSizes.paddingXSml,
  },

});
export default connect(state => ({
  org: state.org.orgSelect,
  event: state.refresh.event,

}), {
}, null, { withRef: true })(ContainerBargeScreen);

