import _ from "lodash";
import React, { Component } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import DeviceInfo from "react-native-device-info";
import Orientation from "react-native-orientation";
import { Actions } from "react-native-router-flux";
import VersionCheck from "react-native-version-check";
import { connect } from "react-redux";
import { AbstractProps, AbstractStates } from "../../../base/AbstractProperty";
import AppConfig from "../../../config/AppConfig";
import DynamicServerManager from "../../../data/DynamicServerManager";
import TaskImplementingManager from "../../../data/TaskImplementingManager";
import UserFreshChatManager from "../../../data/UserFreshChatManager";
import API from "../../../network/API";
import { IReadData } from "../../../network/user/IRead";
import AppSizes from "../../../theme/AppSizes";
import { setLocale } from "../../setting/languages/actions/creater/i18";
import NavigationHelper from "../helpers/NavigationHelper";
// const loadLocalizeAPI = (phrase, targetLan) => axios.create({
//     timeout: 100000,
//     baseURL: `https://api.localizejs.com/v2.0/projects/X9fam10mJfuSZ/machine-translations/translate?phrase=${phrase}&target=${targetLan}&source=en`,
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer 8a87091489ce2761cdf01dff7f1bb40f'
//     },
// });

interface Props extends AbstractProps {
    locale: any,
  user: any,
  userInfo: IReadData,
  deviceBuildNumber: {buildNumber:string},
  storeRehydrated: any,
  setLocale:(locale) =>void;
}

interface States extends AbstractStates {
    storeRehydrated:any;
}
/**
 * storeRehydrated state : to detect store is rehydrated or not
 * if store is rehydrated, check verify token (user login or not) to navigate to right screen
 * if not, no more action
 */
class SplashScreen extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      storeRehydrated: props.storeRehydrated,
    };
  }
  componentWillMount() {
    this.lockScreen();
  }

  lockScreen = () => {
    if (AppConfig.isForceLockPortrait) {
      Orientation.lockToPortrait();
      return;
    }
    if (DeviceInfo.isTablet() && !AppConfig.isForceLockPortrait) {
      Orientation.lockToLandscapeLeft();
      return;
    }
    Orientation.lockToPortrait();
  };

  componentDidUpdate() {
    if (this.state.storeRehydrated) {
      this.initializeAppData();
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("Splash component will receive props ");

    if (nextProps.storeRehydrated !== this.props.storeRehydrated) {
      this.setState({ storeRehydrated: nextProps.storeRehydrated });
    }
  }

  //UI CONTROL ---------------------------------------------------------------------------------

  async initializeAppData() {
    const locale = DeviceInfo.getDeviceLocale();
    if (_.isEmpty(this.props.locale) && !_.isEmpty(locale)) {
      this.props.setLocale(locale);
    }

    if (AppConfig.PRODUCTION_MODE && (await this.isOldVersionVersion())) {
      Actions.reset("forceUpdate");
      return;
    }
    await TaskImplementingManager.initialize();
    await UserFreshChatManager.initialize();
    if (TaskImplementingManager.getTaskImplementing()) {
      this.setupDevMode();
    }
  }
  setupDevMode() {
    if (AppConfig.DEV_MODE) {
      DynamicServerManager.initialize().then(() => {
        if (DynamicServerManager.getDynamicServer()) {
          API.switchServer();
          this.checkVerifyToken();
        }
      });
    } else {
      this.checkVerifyToken();
    }
  }

  checkVerifyToken() {
    if (
      !this.isFirstTimeUpdateApp() &&
      this.props.user &&
      this.props.userInfo
    ) {
      NavigationHelper.navigateRoleMainScene(this.props.userInfo);
      return;
    }
    Actions.reset("login");
  }
  /**
   * check is first time user update or not
   * if true, force to login screen and will update deviceBuildNumber after user login
   *
   */
  isFirstTimeUpdateApp() {
    const currentBuildNumber = DeviceInfo.getBuildNumber();
    if (
      !this.props.deviceBuildNumber ||
      !this.props.deviceBuildNumber.buildNumber ||
      parseInt(this.props.deviceBuildNumber.buildNumber) < parseInt(currentBuildNumber)
    ) {
      return true;
    }
    return false;
  }
  /**
   * check version on store
   * if current version is old version, navigate to ForceUpdateScreen
   * if not, app work normal
   */
  async isOldVersionVersion() {
    try {
      const versionApp = await VersionCheck.getLatestVersion({
        provider: Platform.OS === "android" ? "playStore" : "appStore",
      });
      const versionCurent = DeviceInfo.getVersion();
      const versionCurrentString =
        typeof versionCurent === "string" && versionCurent.split(".").join("");
      const versionAppString =
        typeof versionApp === "string" && versionApp.split(".").join("");

      if (
        versionCurrentString &&
        versionAppString &&
        parseInt(versionCurrentString) < parseInt(versionAppString)
      ) {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    } catch (err) {
      console.log("isOldVersionVersion err>>", err);
    }

    return Promise.resolve(false);
  }

  //UI RENDER ----------------------------------------------------------------------------------
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{
            width: AppSizes.screenWidth,
            height: AppSizes.screenHeight,
            resizeMode: "cover",
          }}
          source={AppConfig.SPLASH_SCREEN}
        />
      </View>
    );
  }
}

// Redux
const mapStateToProps = (state) => ({
  locale: state.i18n.locale,
  user: state.user.isAuthenticated,
  userInfo: state.user.readUser,
  deviceBuildNumber: state.device.deviceBuildNumber,
  storeRehydrated: state._persist.rehydrated,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  setLocale,
};

//Connect everything
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    width: AppSizes.screenWidth,
    height: AppSizes.screenHeight,
  },
});
