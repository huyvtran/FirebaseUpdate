import _ from "lodash";
import React, { Component } from "react";
import {
  Alert,


  NativeModules, StyleSheet, Text, View
} from "react-native";
import AwesomeListComponent from "react-native-awesome-list";
import DeviceInfo from "react-native-device-info";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import ErrorAbivinView from "../../components/ErrorAbivinView";
import SearchIconMapComponent from "../../components/SearchIconMapComponent";
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
import OrgUtils from "../../utils/OrgUtils";
import PermissionUtils from "../../utils/PermissionUtils";
import { Localize } from "../setting/languages/LanguageManager";
import ContainerItem from "./ContainerItem";
import FreightConstant from "./FreightConstant";


const { RNImeiModule } = NativeModules;
class ContainerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      tagFilterList: FreightConstant.FILTER_LIST,
      locationSearch: [],
    };
  }
  // ============================================= COMPONENT LIFE CYCLE =========================================//
  componentWillReceiveProps(nextProps) {
    // if (this.props.textSearch !== nextProps.textSearch) {
    //     this.onChangeTextSearch(nextProps.textSearch)
    // }
    if (this.isDiffArray(nextProps.filterList, this.props.filterList)) {
      this.containerList.refresh();
    }

    if (nextProps && nextProps.org && nextProps.org[0] && nextProps.org[0].id && nextProps.org[0].id != this.props.org[0].id) {
      this.containerList.refresh();
    }

    if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_CONTAINER_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.containerList.refresh();
      }
    }
  }


  // ============================================= UI CONTROL =========================================//

  isDiffArray(filterF, filterS) {
    if (filterF.length !== filterS.length) {
      return true;
    }
    if (filterF[0].content !== filterS[0].content) {
      return true;
    }
    return false;
  }

    source = async() => {
      const { textSearch, filterList, org } = this.props;
      let filterBy = null;
      const orgSelected = org && org[0] ? org[0] : null;
      const organizationIds = orgSelected ? orgSelected.id : undefined;
      const typeShipment = orgSelected && orgSelected.configurations ? orgSelected.configurations.typeShipment : undefined;
      filterBy = {
        organizationIds: [organizationIds],
      };
      if (filterList.length === 1) {
        if (filterList[0].content === "active") {
          filterBy = {
            ...filterBy,
            isActive: true,
          };
        } else {
          filterBy = {
            ...filterBy,
            isActive: false,
          };
        }
      }

      const listStatus = [
        FreightConstant.SHIPMENT_STATUS.NOT_ASSIGNED,
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

    keyExtractor = item => item._id

    transformer(res) {
      if (res.data && res.data.shipments) {
        const shipmentList = res.data.shipments;
        console.log(shipmentList.map(shipment => shipment.shipmentCode));
        return shipmentList;
      }
      return [];
    }

    onChangeTextSearch = _.debounce(text => {
      this.textSearch = text;
      this.onFilterShipment();
    }, 300);


    // ============================================= LOGIC CONTROL =========================================//

    onCloseTagView = content => {
      this.setState({ locationSearch: [] }, () => {
        this.onFilterShipment();
      });
    }

    onSelectLocation = location => {
      this.setState({ locationSearch: [location] }, () => {
        this.onFilterShipment();
      });
    }

    onFilterShipment = () => {
      const { locationSearch } = this.state;
      this.containerList.applyFilter((item, index) => {
        if (!_.isEmpty(this.textSearch) && (!locationSearch || !locationSearch[0] || !locationSearch[0]._id)) {
          return item.containerIds && item.containerIds[0] && !_.isEmpty(item.containerIds[0].containerNumber) && item.containerIds[0].containerNumber.toLowerCase().includes(this.textSearch.toLowerCase());
        } else if (_.isEmpty(this.textSearch) && (locationSearch && locationSearch[0] && locationSearch[0]._id)) {
          const location = this.state.locationSearch[0];
          return item &&
                    item.departure &&
                    item.departure.departureCode &&
                    item.departure.departureCode === location.customerCode;
        } else if (!_.isEmpty(this.textSearch) && (locationSearch && locationSearch[0] && locationSearch[0]._id)) {
          const locationFilter = this.state.locationSearch[0];
          return item &&
                    item.departure &&
                    item.departure.departureCode &&
                    item.departure.departureCode === locationFilter.customerCode &&
                    item.containerIds && item.containerIds[0] && !_.isEmpty(item.containerIds[0].containerNumber) && item.containerIds[0].containerNumber.toLowerCase().includes(this.textSearch.toLowerCase());
        }
        return true;
      });
    }
    // ============================================= UI RENDER =========================================//

    renderItem = ({ item }) => {
      if (item && item.containerIds && item.containerIds[0]) {
        return (<ContainerItem
          shipment={item}
          container={item.containerIds[0]}
          onPress={() => {
            Actions.containerDetail({ container: item.containerIds[0], shipment: item }); 
          }}
                />);
      }
      return <View />;
    }

    renderSearchView = () => {
      return (<SearchIconMapComponent
        onChangeTextSearch={text => this.onChangeTextSearch(text)}
        onPressMap={() => Actions.freightMapSearch({ onSelectLocation: location => this.onSelectLocation(location) })}
              />);
    }

    renderFilterEmptyView = () => {
      return (<View style={styles.noFilterContainer}>
        <Text style={{ ...AppStyles.regularText, color: AppColors.textSubContent }}>{Localize(messages.noFilterContainer)}</Text>
      </View>);
    }
    render() {
      const { locationSearch } = this.state;
      return (
        <View style={styles.container}>
          {this.renderSearchView()}
          {locationSearch.length > 0 && <TagView
            tagList={locationSearch}
            extractorValue={item => item.fullName}
            title={`${Localize(messages.location)}: `}
            onClose={item => this.onCloseTagView(item)}
                                        />}
          <AwesomeListComponent
            ref={ref => this.containerList = ref}
            source={() => this.source()}
            renderItem={item => this.renderItem(item)}
            keyExtractor={item => this.keyExtractor(item)}
            emptyText={Localize(messages.noResult)}
            transformer={response => this.transformer(response)}
            renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.containerList.onRetry()} />}
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

});
export default connect(state => ({
  org: state.org.orgSelect,
  event: state.refresh.event,

}), {
})(ContainerScreen);

