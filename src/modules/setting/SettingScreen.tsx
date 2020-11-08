import _ from "lodash";
import React from "react";
import { Component } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CodePush from "react-native-code-push";
import DeviceInfo from "react-native-device-info";
import { Icon } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import TestID from "../../../test/constant/TestID";
import IconAssets from "../../assets/IconAssets";
import { AbstractProps, AbstractStates } from "../../base/AbstractProperty";
import FreshChatButton from "../../components/freshchat/FreshChatButton";
import Progress from "../../components/Progress";
import AppConfig from "../../config/AppConfig";
import messages from "../../constant/Messages";
import API from "../../network/API";
import AppColors from "../../theme/AppColors";
import AppSizes from "../../theme/AppSizes";
import AppStyles from "../../theme/AppStyles";
import { H1, H3 } from "../../theme/styled";
import { logout } from "../authentication/actions/creater/auth";
import Divider from "../form/components/Divider";
import { Localize } from "./languages/LanguageManager";

const CONTENT_DRAWER = [
  {
    key: messages.notification,
    title: messages.notification.notification,
    iconName: "notifications",
    actions: () => Actions.notification(),
  },
  {
    key: messages.setting,
    title: messages.tabs.settings,
    iconName: "settings",
    actions: () => Actions.setting(),
  },
  // { key: messages.changePass, title: messages.changePass, iconName: 'autorenew', actions: () => Actions.changePassword() },
  // { key: messages.tutorial, title: messages.tutorial, iconName: 'speaker-notes', actions: () => Linking.openURL('https://www.youtube.com/channel/UCThr-SfR4VcS7P6KMcGUdHQ') }
];

interface Props extends AbstractProps {
  pushInfo: any;
  user: any;
  logout: () => void;
}

interface States extends AbstractStates {
  index: number;
  version: string;
}
class SettingScreen extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      version:
        AppConfig.APP_NAME +
        ` ${DeviceInfo.getVersion()} - ${DeviceInfo.getBuildNumber()}${
          AppConfig.VERSION_MODE
        }`,
    };
  }

  componentDidMount() {
    if (AppConfig.PRODUCTION_MODE) return;

    CodePush.getUpdateMetadata().then((metadata) => {
      if (metadata && metadata.label) {
        this.setState({
          version:
            AppConfig.APP_NAME +
            ` ${DeviceInfo.getVersion()}.${
              metadata.label
            } - ${DeviceInfo.getBuildNumber()}${AppConfig.VERSION_MODE}`,
        });
      }
    });
  }

  onClickLogout() {
    if (this.props.pushInfo && !_.isEmpty(this.props.pushInfo.deviceToken)) {
      const body = {
        deviceToken: this.props.pushInfo.deviceToken,
        platform: this.props.pushInfo.platform,
      };
      Progress.show(
        API.signOut,
        [body],
        (res) => {
          if (res.data) {
            this.resetData();
          }
        },
        (err) => {
          console.log("onClickLogout err>>", err);
        }
      );
      return;
    }
    this.resetData();
  }

  resetData = () => {
    this.props.logout();
  };

  renderItemSetting(item, index) {
    // console.log("renderItemSetting ==", index)
    return (
      <TouchableOpacity
        key={index + ""}
        style={styles.containerItemSetting}
        onPress={item.actions}
      >
        <Icon name={item.iconName} color={AppColors.sectionText} size={24} />
        <Text style={styles.textContentsetting}>{Localize(item.title)}</Text>
      </TouchableOpacity>
    );
  }

  renderContentSetting() {
    let drawerContentView = [];
    CONTENT_DRAWER.forEach((item, index) => {
      drawerContentView.push(this.renderItemSetting(item, index));
    });

    return drawerContentView;
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.containerInfo}>
          <View style={styles.containerAva}>
            <Image style={styles.avatar} source={IconAssets.iconPerson} />
          </View>
          <View style={styles.containerInfoContent}>
            <Text style={[H1, { color: "white" }]} numberOfLines={1}>
              {this.props.user && this.props.user.displayName}
            </Text>
            <Text
              style={[
                H3,
                { opacity: 0.6, top: AppSizes.paddingXSml, color: "white" },
              ]}
              numberOfLines={1}
            >
              {this.props.user && this.props.user.email}
            </Text>
          </View>
        </View>
        <View style={{ width: "100%", marginBottom: AppSizes.paddingXSml }}>
          {this.renderContentSetting()}
        </View>
        <Divider />
        <TouchableOpacity
          testID={TestID.logoutButton}
          style={[
            styles.containerItemSetting,
            { marginTop: AppSizes.paddingXSml },
          ]}
          onPress={() => this.onClickLogout()}
        >
          <Icon
            name={"settings-power"}
            color={AppColors.sectionText}
            size={AppSizes.paddingXXLarge}
          />
          <Text style={styles.textContentsetting}>
            {Localize(messages.logout)}
          </Text>
        </TouchableOpacity>
        <View style={styles.containerVersion}>
          <Text style={styles.textVersion} numberOfLines={1}>
            {this.state.version}
          </Text>
        </View>

        <FreshChatButton />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },
  containerVersion: {
    position: "absolute",
    bottom: AppSizes.paddingSml,
    width: "100%",
  },
  textVersion: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontSmall,
    backgroundColor: "transparent",
    color: AppColors.hintText,
    textAlign: "center",
    justifyContent: "center",
  },
  containerInfo: {
    flexDirection: "row",
    width: "100%",
    marginBottom: AppSizes.paddingSml,
    alignItems: "center",
    justifyContent: "center",
    // height : 76,
    backgroundColor: AppColors.abi_blue,
  },
  avatar: {
    height: AppSizes.paddingSml * 5,
    width: AppSizes.paddingSml * 5,
  },
  containerAva: {
    flex: 1,
    padding: AppSizes.paddingMedium,
  },
  containerInfoContent: {
    flex: 4,
    justifyContent: "center",
    marginLeft: AppSizes.paddingXSml,
  },
  containerItemSetting: {
    flexDirection: "row",
    paddingHorizontal: AppSizes.paddingMedium,
    width: "100%",
    paddingVertical: AppSizes.paddingMedium,
  },
  textContentsetting: {
    ...AppStyles.regularText,
    color: AppColors.sectionText,
    fontSize: AppSizes.fontXXMedium,
    marginLeft: AppSizes.paddingXLarge,
    paddingVertical: AppSizes.paddingTiny,
  },
};

export default connect(
  (state) => ({
    user: state.user.user,
    pushInfo: state.user.pushInfo,
    i18n: state.i18n,
  }),
  { logout }
)(SettingScreen);
