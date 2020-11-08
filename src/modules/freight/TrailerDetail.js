import React, { Component } from "react";
import { Alert, NativeModules, ScrollView, Text, TouchableOpacity, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import HeaderDetail from "../../components/HeaderDetail";
import Progress from "../../components/Progress";
import TextInfoInLine from "../../components/TextInfoInLine";
import AppConfig from "../../config/AppConfig";
import messages from "../../constant/Messages";
import OrgConfig from "../../constant/OrgConfig";
import DynamicServerManager from "../../data/DynamicServerManager";
import API from "../../network/API";
import AppColors from "../../theme/AppColors";
import AppSizes from "../../theme/AppSizes";
import AppStyles from "../../theme/AppStyles";
import AlertUtils from "../../utils/AlertUtils";
import DeviceUtil from "../../utils/DeviceUtil";
import OrgUtils from "../../utils/OrgUtils";
import PermissionUtils from "../../utils/PermissionUtils";
import Divider from "../form/components/Divider";
import { Localize } from "../setting/languages/LanguageManager";



const { RNImeiModule } = NativeModules;

class TrailerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trailerDetail: props.trailer,
    };
  }

  /** ***************************************************COMPONENT LYFE CYCLE*************************************************** */
  componentDidMount() {
  }

  /** ***************************************************UI CONTROL*************************************************** */
  getTrailerDetail() {
    const { trailerDetail } = this.state;
    const orgId = this.props.org[0]._id;
    API.getTrailerDetail(trailerDetail._id, [orgId]).then(res => {
      if (res && res.data && res.data.data) {
        this.setState({ trailerDetail: res.data.data });
      }
      console.log("getTrailerDetail >>", res);
    });
  }

    isHideRequstButton = () => {
      const { trailerDetail } = this.state;
      return (trailerDetail.attachedVehicleId && trailerDetail.attachedVehicleId._id) || trailerDetail.isRequesting;
    }

    onClickRequestTrailer = async() => {
      if (AppConfig.DEV_MODE) {
        const deviceId = DynamicServerManager.getDynamicServer().imeiNumber;
        this.onRequestTrailer(deviceId);
        return;
      }


      if (OrgUtils.getDeviceIdType() === OrgConfig.DEVICE_TYPE.MAC) {
        DeviceUtil.getMACAddress().then(macNumber => {
          this.onRequestTrailer(macNumber);
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
                  this.onRequestTrailer(imeiList[0]);
                }
              });
            }
          });
        }
      }
    }

    onRequestTrailer = deviceId => {
      const trailerId = this.state.trailerDetail._id;
      const orgId = this.props.org[0]._id;
      Progress.show(API.requestTrailer, [trailerId, deviceId, orgId], res => {
        if (res && res.data.trailers && res.data.trailers[0]) {
          AlertUtils.showSuccess(messages.requestTrailerSuccess);

          this.props.refreshList();
          Actions.pop();
        }
      });
    }

    /** ***************************************************RENDER*************************************************** */

    renderContent() {
      const { trailerDetail } = this.state;
      const { locationId } = trailerDetail;

      return (<View style={{ flex: 1, backgroundColor: "white" }}>

        <View style={{ padding: AppSizes.paddingMedium }}>

          <Text style={styles.containerCode}>{trailerDetail.trailerCode}</Text>
          <TextInfoInLine
            title={`${Localize(messages.licensePlate)}: `}
            content={trailerDetail.licensePlate}
          />
          <TextInfoInLine
            title={`${Localize(messages.trailerType)}: `}
            content={trailerDetail.trailerType}
          />
          <TextInfoInLine
            title={`${Localize(messages.weightLevel)}: `}
            content={trailerDetail.weightLevel}
          />
          <TextInfoInLine
            title={`${Localize(messages.location)}: `}
            content={trailerDetail.locationId && trailerDetail.locationId.customerCode ? trailerDetail.locationId.customerCode : ""}
          />
        </View>
        <Divider />
        <View style={{ height: AppSizes.paddingXSml * 10 }} />
      </View>);
    }
    render() {
      return (
        <View style={{ flex: 1, height: AppSizes.screenHeight }}>
          <HeaderDetail
            title={Localize(messages.trailerDetail)}
          />

          <ScrollView style={{ backgroundColor: "white" }}>
            {this.renderContent()}
          </ScrollView>
          {!this.isHideRequstButton() && <TouchableOpacity style={styles.containerRequestButton} onPress={() => this.onClickRequestTrailer()}>
            <Text style={{ ...AppStyles.regularText, color: "white" }}>{Localize(messages.requestTrailer)}</Text>
          </TouchableOpacity>}

        </View>
      );
    }
}


export default connect(state => ({
  org: state.org.orgSelect,
}), {})(TrailerDetail);
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
    fontSize: AppSizes.fontXXMedium,
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
    color: AppColors.spaceGrey,
    marginVertical: AppSizes.paddingTiny,

  },
};
