import _ from "lodash";
import React, { Component } from "react";
import { Alert, NativeModules, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import { connect } from "react-redux";
import ButtonIcon from "../../components/ButtonIcon";
import HeaderDetail from "../../components/HeaderDetail";
import MapViewComponent from "../../components/MapViewComponent";
import MarkerImage from "../../components/MarkerImage";
import Progress from "../../components/Progress";
import SVGMarkerIndex from "../../components/svg/SVGMarkerIndex";
import TextInfoInLine from "../../components/TextInfoInLine";
import messages from "../../constant/Messages";
import OrgConfig from "../../constant/OrgConfig";
import API from "../../network/API";
import { refresh } from "../../store/actions/refresh";
import eventTypes from "../../store/constant/eventTypes";
import AppColors from "../../theme/AppColors";
import AppSizes from "../../theme/AppSizes";
import AppStyles from "../../theme/AppStyles";
import AlertUtils from "../../utils/AlertUtils";
import DeviceUtil from "../../utils/DeviceUtil";
import OrgUtils from "../../utils/OrgUtils";
import PermissionUtils from "../../utils/PermissionUtils";
import Divider from "../form/components/Divider";
import { Localize } from "../setting/languages/LanguageManager";
import ShipmentControl from "../shipment/ShipmentControl";
import FreightConstant from "./FreightConstant";
const { RNImeiModule } = NativeModules;

class ContainerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      container: props.container,
      shipment: props.shipment,
    };
  }


  /** ***************************************************COMPONENT LYFE CYCLE*************************************************** */
  componentDidMount() {
    if (!this.state.container) {
      this.getContainerDetail();
    }
  }

  /** ***************************************************UI CONTROL*************************************************** */
  getContainerDetail() {
    const { container } = this.props;
    Progress.show(API.getContainerDetail, container._id, res => {
      this.setState({ container: res.data.data });
    });
  }

  async onClickRequestContainer() {
    if (OrgUtils.getDeviceIdType() === OrgConfig.DEVICE_TYPE.MAC) {
      DeviceUtil.getMACAddress().then(macNumber => {
        this.onRequestContainer(macNumber);
      }).catch(err => {
        AlertUtils.showError(messages.cannotGetMACNumber);
        return Promise.reject(err);
      });
    } else {
      const apiLevel = await DeviceInfo.getAPILevel();
      if (apiLevel >= 29) {
        return Alert.alert("Thông báo", "Không lấy được IMEI, vui lòng lấy địa chỉ MAC!");
      } else {
        PermissionUtils.checkReadPhoneStatePermission().then(res => {
          if (res !== PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
            AlertUtils.showError(messages.notGrantedPhoneState);
          } else {
            RNImeiModule.getImei().then(imeiList => {
              if (imeiList && imeiList[0]) {
                this.onRequestContainer(imeiList[0]);
              }
            });
          }
        });
      }
    }
  }

  onRequestContainer(imeiNumber) {
    const { shipment } = this.state;
    const userId = this.props.user._id;
    const { org } = this.props;
    const organizationId = org && org[0] ? org[0]._id : "";
    Progress.show(API.reuqestContainer, [shipment._id, userId, imeiNumber, organizationId], res => {
      if (res && res.data && res.data.shipments) {
        this.setState({ shipment: res.data.shipments[0] }, () => {
          AlertUtils.showSuccess(messages.requestContainerSuccess);
          this.props.refresh(eventTypes.REFRESH_CONTAINER_LIST, _.now());
        });
      }
    }, err => {
    }, hadleError => {
      Alert.alert(Localize(messages.error), hadleError.response.data.message);

      return true;
    });
  }

  isShowRequstButton() {
    const { shipment } = this.state;
    return shipment.shipmentStatus === FreightConstant.SHIPMENT_STATUS.NOT_ASSIGNED;
  }

  /** ***************************************************RENDER*************************************************** */
  renderShipmentContent(title, destination, address) {
    return (<View style={{ paddingVertical: AppSizes.paddingXSml }}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{destination}</Text>
      <Text style={styles.content}>{address}</Text>
    </View>);
  }


  renderContent() {
    const { container, shipment } = this.state;
    if (!container) {
      return;
    }

    if (!ShipmentControl.isValidateLatLng(shipment)) {
      AlertUtils.showWarning(messages.inValidLatlng);
    }

    const poliline = ShipmentControl.calculatePoliline(shipment);

    // const marker = 

    const markerList = poliline.map((latlng, idx) => {
      return (<MarkerImage
        key={idx}
        coordinate={{ latitude: latlng.latitude, longitude: latlng.longitude }}
        description={latlng.description}
        title={latlng.description}
        renderMarker={<SVGMarkerIndex content={idx} />}
      />);
    });

    return (<View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ width: "100%", height: AppSizes.screenHeight * 2 / 5 }}>
        <MapViewComponent
          markerList={markerList}
          allCoords={poliline}
          camera={{
            center: {
              latitude: poliline[0] && poliline[0].latitude !== null ? poliline[0].latitude : 21.0412535,
              longitude: poliline[0] && poliline[0].longitude !== null ? poliline[0].longitude : 105.8113495,
            },
            pitch: 10,
            heading: 10,
            zoom: 10,
            altitude: 18,

          }
          }
        />

      </View>
      <View style={{ padding: AppSizes.paddingMedium, backgroundColor: "white" }}>
        <Text style={styles.containerCode}>{container.containerNumber}</Text>
        <TextInfoInLine
          title={`${Localize(messages.seal)}: `}
          content={container.sealNo}
        />
        <TextInfoInLine
          title={`${Localize(messages.type)}: `}
          content={container.containerType.containerTypeCode}
        />
        <TextInfoInLine
          title={`${Localize(messages.length)}: `}
          content={`${container.containerType.containerLength} feet`}
        />
        <TextInfoInLine
          title={`${Localize(messages.grossWeight)}: `}
          content={`${container.netWeight} ${Localize(messages.tons)}`}
        />
        <TextInfoInLine
          title={`${Localize(messages.tareWeight)}: `}
          content={`${container.tareWeight} ${Localize(messages.tons)}`}
        />
        <TextInfoInLine
          title={`${Localize(messages.totalWeight)}: `}
          content={`${container.grossWeight} ${Localize(messages.tons)}`}
        />
        <TextInfoInLine
          title={`${Localize(messages.note)}: `}
          content={container.containerNote}
        />
      </View>
      <Divider />

      <View style={{ flexDirection: "row", backgroundColor: "white", padding: 16 }}>
        <ButtonIcon
          iconName={"directions-boat"}
          iconSize={AppSizes.paddingXSml * 3}
          iconColor={AppColors.spaceGrey}
        />
        <View style={{ paddingLeft: AppSizes.paddingXSml, width: "100%", paddingRight: AppSizes.paddingXSml }}>
          <Text style={styles.containerCode}>{Localize(messages.shipments)}</Text>
          {this.renderShipmentContent(Localize(messages.startAt), shipment.departure.departureCode, shipment.departure.departureFullName)}
          <Divider />
          {this.renderShipmentContent(Localize(messages.deliveryTo), shipment.arrival.arrivalCode, shipment.arrival.arrivalFullName)}
        </View>
      </View>
      <View style={{ height: AppSizes.paddingXSml * 10 }} />
    </View>);
  }
  render() {
    return (
      <View style={{ flex: 1, height: AppSizes.screenHeight }}>
        <HeaderDetail
          title={Localize(messages.containerDetail)}
        />

        <ScrollView >
          {this.renderContent()}
        </ScrollView>

        {this.isShowRequstButton() && <TouchableOpacity style={styles.containerRequestButton} onPress={() => this.onClickRequestContainer()}>
          <Text style={{ ...AppStyles.regularText, color: "white" }}>{Localize(messages.requestContainer)}</Text>
        </TouchableOpacity>}
      </View>
    );
  }
}

export default connect(state => ({
  task: state.task,
  event: state.refresh.event,
  locale: state.i18n.locale,
  org: state.org.orgSelect,
  orgConfig: state.user.orgConfig,
  user: state.user.user,

}), {
  refresh,
})(ContainerDetail);


const styles = {
  container: {
    height: AppSizes.paddingXSml * 20,
    width: AppSizes.screenWidth,
  },
  containerRequestButton: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: AppSizes.paddingMedium,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.abi_blue,
  },
  containerCode: {
    ...AppStyles.h4,
    fontSize: AppSizes.paddingMedium,
    color: AppColors.abi_blue,
    marginVertical: AppSizes.paddingTiny,
  },
  containerSeal: {
    ...AppStyles.regularText,
    marginVertical: AppSizes.paddingTiny,

  },
  title: {
    ...AppStyles.regularText,
    color: AppColors.hintText,
    marginVertical: AppSizes.paddingTiny,

  },
  content: {
    ...AppStyles.regularText,
    marginVertical: AppSizes.paddingTiny,

  },
};
