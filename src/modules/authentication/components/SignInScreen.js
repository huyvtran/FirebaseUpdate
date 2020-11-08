import LottieView from "lottie-react-native";
import React, { PureComponent } from "react";
import {
  ActivityIndicator,
  Dimensions, Image,
  Modal, Platform, Text,
  TextInput,
  TouchableOpacity,
  Vibration, View
} from "react-native";
import * as Animatable from "react-native-animatable";
import DeviceInfo from "react-native-device-info";
import { Icon } from "react-native-elements";
import FingerprintScanner from "react-native-fingerprint-scanner";
import { Actions } from "react-native-router-flux";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { connect } from "react-redux";
import TestID from "../../../../test/constant/TestID";
import IconAssets from "../../../assets/IconAssets";
import ButtonText from "../../../components/ButtonText";
import AppConfig from "../../../config/AppConfig";
import messages from "../../../constant/Messages";
import { getToken } from "../../../firebase/FirebaseMessage";
import { forceFingerPrint } from "../../../store/actions/metadata";
import AppColors from "../../../theme/AppColors";
import AppFonts from "../../../theme/AppFonts";
import AppSizes from "../../../theme/AppSizes";
import AppStyles from "../../../theme/AppStyles";
import AlertUtils from "../../../utils/AlertUtils";
import { callOnce } from "../../../utils/callOnce";
import PermissionUtils from "../../../utils/PermissionUtils";
import NotificationManager from "../../notification/NotificationManager";
import { Localize } from "../../setting/languages/LanguageManager";
import { loadSignIn } from "../actions/creater/auth";
import AuthenticateWrapComponent from "./AuthenticateWrapComponent";
import TestSetting from "./TestSetting";



const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
const widthContent = widthScreen - AppSizes.paddingXXLarge * 4;

class SignInScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getDefaultInfoSignIn(),

      latitude: null,
      longitude: null,
      getInitialNotification: null,
      hidePassText: true,
      userNameTextFocus: true,
      passTextFocus: false,
      visibleModalFingerSprint: false,
    };
    this.onSignIn = this.onSignIn.bind(this);
  }

    getDefaultInfoSignIn = () => {
      const { rememberSigninData } = this.props.metadata;
      let username = "";
      let password = "";
      let rememberMe = false;
      if (rememberSigninData && rememberSigninData.rememberMe) {
        username = rememberSigninData.username;
        rememberMe = true;
      }

      if (__DEV__) {
        username = AppConfig.USER_TEST;
        password = AppConfig.PASS_TEST;
      }

      return {
        username,
        password,
        rememberMe,
      };
    }

    componentWillUnmount() {
      FingerprintScanner.release();
    }

    

    onSignIn = async(username, password) => {
      const locationGrantResult = await PermissionUtils.checkLocationPermission();
      if (locationGrantResult === PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
        const deviceToken = await getToken();
        const { rememberMe } = this.state;
        const user = {
          username,
          password,
          deviceToken,
          platform: Platform.OS,
          rememberMe,
        };
        await this.props.loadSignIn(user);
      }
    };

    testAPIClick() {
      Actions.testAPI();
    }

    _buttonDisabled() {
      if (!this.state.username || !this.state.password) {
        return true;
      }
      return false;
    }

    onClickSignInFingerPrint = () => {
      FingerprintScanner.isSensorAvailable()
        .then(biometryType => {
          const { metadata } = this.props;
          if (metadata.isEnableFingerPrint) {
            this.onFingerPrint();
          } else {
            AlertUtils.showWarning(messages.youHaveNotEnableFingerPrint);
          }
        })
        .catch(error => {
          NotificationManager.showErrorMessage(Localize(messages.notSupportFingerPrint));
        });
    };

    onFingerPrint() {
      this.setState({ visibleModalFingerSprint: true });
      FingerprintScanner
        .authenticate({ onAttempt: this.handleAuthenticationAttempted })
        .then(() => {
          this.setState({ visibleModalFingerSprint: false });
          const { username, password } = this.props.metadata.userFingerPrintData;
          this.onSignIn(username, password);
        })
        .catch(error => {
          this.setState({ visibleModalFingerSprint: false }, () => {
            this.props.forceFingerPrint(true);
            AlertUtils.showError(messages.authenErorrCauseFinger);
          });
        });
    }

    handleAuthenticationAttempted = error => {
      this.setState({ retryFingerPrintMode: true }, () => {
        Vibration.vibrate(1000);
        this.retryFingerText.shake(800);
      });
    };

    onClickRememberMe = () => {
      this.setState({ rememberMe: !this.state.rememberMe });
    }

    renderUserNameInput() {
      const { userNameTextFocus } = this.state;
      return (<View style={styles.containerInput}>
        <View style={styles.inputContainer}>
          <TextInput
            testID={TestID.userNameTextInput}
            keyboardShouldPersistTaps="always"
            accessibilityLabel="username"
            style={styles.textInput}
            onChangeText={username => this.setState({ username })}
            value={this.state.username}
            placeholder={Localize(messages.yourUserName)}
            returnKeyType="next"
            autoFocus={true}
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={() => this.refs.txtPassword.focus()}
            underlineColorAndroid="rgba(0,0,0,0)"
            onFocus={() => {
              this.setState({ userNameTextFocus: true });
            }}
            onBlur={() => {
              this.setState({ userNameTextFocus: false });
            }}
          />
          <Icon
            name={"ios-person"}
            type="ionicon"
            size={AppSizes.paddingLarge}
            color={userNameTextFocus ? AppColors.abi_blue : AppColors.hintText}
          />
        </View>
        <View
          style={[styles.divider, { backgroundColor: userNameTextFocus ? AppColors.abi_blue : AppColors.hintText }]}
        />

      </View>);
    }

    renderPasswordInput() {
      const { passTextFocus } = this.state;
      return (<View style={[styles.containerInput, { marginTop: AppSizes.paddingMedium }]}>
        <View style={styles.inputContainer}>
          <TextInput
            testID={TestID.passTextInput}
            keyboardShouldPersistTaps="always"
            style={styles.textInput}
            secureTextEntry={this.state.hidePassText}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
            placeholder={Localize(messages.yourPassword)}
            returnKeyType="go"
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={() => this.onSignIn(this.state.username, this.state.password)}
            ref={"txtPassword"}
            underlineColorAndroid="rgba(0,0,0,0)"
            onFocus={() => {
              this.setState({ passTextFocus: true });
            }}
            onBlur={() => {
              this.setState({ passTextFocus: false });
            }}
          />
          <TouchableOpacity
            onPress={() => this.setState({ hidePassText: !this.state.hidePassText })} style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon
              name={this.state.hidePassText ? "ios-eye-off" : "ios-eye"}
              size={AppSizes.paddingLarge}
              type="ionicon"
              color={passTextFocus ? AppColors.abi_blue : AppColors.hintText}
            />
          </TouchableOpacity>

        </View>

        <View
          style={[styles.divider, { backgroundColor: passTextFocus ? AppColors.abi_blue : AppColors.hintText }]}
        />
      </View>);
    }

    renderButtonSignIn() {
      const { metadata } = this.props;
      return (
        <View style={styles.buttonSignInContainer}>
          <TouchableOpacity testID={TestID.signInButton} style={styles.buttonSignIn}
            onPress={callOnce(() => !this._buttonDisabled() && this.onSignIn(this.state.username, this.state.password))}
          >
            {!this.props.loading &&
            <Text style={styles.textSignIn}>{Localize(messages.signIn)
              .toLocaleUpperCase()}</Text>}
            {this.props.loading &&
            <ActivityIndicator />
            }
          </TouchableOpacity>

          {!metadata.fingerPrintClose && <TouchableOpacity style={styles.buttonFingerSprint}
            onPress={() => this.onClickSignInFingerPrint()}
          >
            <Image
              source={IconAssets.iconFingerPrint}
              style={{
                height: AppSizes.paddingMedium * 2.5,
                width: AppSizes.paddingMedium * 2.5,
              }}
            />
          </TouchableOpacity>}
        </View>

      );
    }

    renderForgetPassword = () => {
      return (<TouchableOpacity style={styles.forgetPassContainer}
        onPress={() => {
          Actions.forgotPass();
          // Actions.recoverPass()
        }}
              >
        <Text style={{
          ...AppStyles.regularText,
          color: AppColors.naviBlue,
        }}
        >{Localize(messages.forgetPass)
            .toUpperCase()}</Text>
      </TouchableOpacity>);
    };

    renderButtonTestAPI() {
      return (<TouchableOpacity style={[styles.buttonSignIn, { marginTop: 16 }]}
        onPress={callOnce(() => this.testAPIClick())}
      >
        <Text style={styles.textSignIn}>{messages.login.testAPI.toLocaleUpperCase()}</Text>
      </TouchableOpacity>
      );
    }

    renderVersionCode() {
      return (<View style={styles.containerVersion}>
        <Text
          style={styles.textVersion}
        >{`${AppConfig.APP_NAME} ${DeviceInfo.getVersion()} - ${DeviceInfo.getBuildNumber()}${AppConfig.VERSION_MODE}`}</Text>
      </View>);
    }

    renderTestConfig() {
      return (AppConfig.DEV_MODE && <View style={styles.containerTestConfig}>
        <TestSetting width={widthScreen} />
      </View>);
    }

    renderContentFingerSprintModal() {
      const { retryFingerPrintMode } = this.state;
      return (<View style={styles.fingerSprintModal}>
        <View style={styles.fingerSprintModalContainer}>
          <LottieView style={styles.fingerLottieView}
            source={require("../../../assets/animation/aniFingerSprint.json")}
            autoPlay={true} loop={true}
          />
          <Text
            style={[AppStyles.h3, { marginTop: AppSizes.paddingLarge }]}
          >{Localize(messages.scanYourFinger)}</Text>
          <Animatable.View ref={ref => this.retryFingerText = ref}>
            <Text style={[AppStyles.h5, {
              color: retryFingerPrintMode ? AppColors.redGoogle : AppColors.headingPrimary,
              marginTop: AppSizes.paddingSml,
            }]}
            >{retryFingerPrintMode ? Localize(messages.retry) : Localize(messages.signInByScanFinger)}</Text>
          </Animatable.View>
          <ButtonText containerStyle={{
            width: "100%",
            marginTop: AppSizes.paddingLarge,
          }} textStyle={[AppStyles.h5, { color: AppColors.hintText }]}
            content={Localize(messages.backToSignIn)}
            onClick={() => this.setState({ visibleModalFingerSprint: false })}
          />
        </View>
      </View>);
    }

    render() {
      const { message } = this.props;
      const { rememberMe } = this.state;
      return (<AuthenticateWrapComponent>

        <View style={AppStyles.authenticateInputContainer}>
          {this.renderUserNameInput()}
          {this.renderPasswordInput()}

          {message && <Text
            style={styles.textMessageError} numberOfLines={2}
                      >{message}</Text>}

          <TouchableOpacity style={{
            width: widthContent,
            marginTop: AppSizes.paddingMedium,
            flexDirection: "row",
            alignItems: "center",
          }} onPress={() => this.onClickRememberMe()}
          >
            <Icon name={rememberMe ? "check-box" : "check-box-outline-blank"} size={AppSizes.paddingXXLarge}
              color={AppColors.abi_blue}
            />
            <Text style={styles.titleCheckbox}>{Localize(messages.rememberMe)}</Text>
          </TouchableOpacity>
        </View>


        {this.renderButtonSignIn()}
        {this.renderForgetPassword()}

        {/* {this.renderButtonTestAPI()} */}
        {this.renderTestConfig()}

        <View style={{ height: AppSizes.paddingLarge }} />
        <Modal
          transparent={true} ref="modal"
          visible={this.state.visibleModalFingerSprint}
          animationType={"fade"}
        >
          {this.renderContentFingerSprintModal()}
        </Modal>

      </AuthenticateWrapComponent>);
    }
}

const styles = {
  fingerLottieView: {
    height: AppSizes.paddingXXXLarge * 4,
    width: AppSizes.paddingXXXLarge * 4,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: widthContent,
    alignItems: "center",

  },

  imageContainer: {
    height: AppSizes.screenHeight,
    width: AppSizes.screenWidth,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  textTitle: {
    fontSize: AppSizes.fontBase,
    color: "#1B64B0",
    backgroundColor: "transparent",
    width: widthContent,
  },
  divider: {
    width: widthContent,
    backgroundColor: AppColors.hintText,
    height: AppSizes.paddingMicro,
  },
  containerInput: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSignIn: {
    backgroundColor: "#1B64B0",
    borderRadius: AppSizes.paddingXXXLarge,
    marginTop: moderateScale(70),
    padding: AppSizes.paddingXMedium,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  buttonFingerSprint: {
    backgroundColor: AppColors.transparent,
    borderRadius: AppSizes.paddingSml,
    marginTop: moderateScale(70),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: AppSizes.paddingMedium,
    width: AppSizes.paddingXLarge * 3,

  },
  buttonSignInContainer: {
    flexDirection: "row",
    width: AppSizes.screenWidth - AppSizes.paddingXXLarge * 2,

  },
  textSignIn: {
    color: "white",
    fontSize: AppSizes.fontMedium,
    fontFamily: AppFonts.base.family,
  },
  textInput: {
    fontSize: AppSizes.fontBase,

    backgroundColor: "transparent",
    padding: 0,
    height: verticalScale(40),
    width: "90%",

  },
  containerVersion: {
    position: "absolute",
    bottom: AppSizes.paddingLarge + AppSizes.paddingXSml,
  },
  containerTestConfig: {
    marginTop: AppSizes.paddingLarge,
  },
  viewContainer: {
    flex: 1,
    width: widthScreen,
    height: heightScreen,
    backgroundColor: "red",
  },
  container: {
    flex: 1,
    paddingTop: moderateScale(50),
    alignItems: "center",
    backgroundColor: "transparent",
  },

  textVersion: {
    fontSize: AppSizes.fontSmall,
    backgroundColor: "transparent",
    color: AppColors.abi_blue,
  },

  textMessageError: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontSmall,
    marginTop: AppSizes.paddingMedium,
    backgroundColor: "transparent",
    color: AppColors.red,
    width: "100%",
    justifyContent: "flex-start",
  },
  forgetPassContainer: {
    marginTop: AppSizes.paddingXXLarge,
  },
  fingerSprintModal: {
    backgroundColor: AppColors.darkgraytrans,
    height: AppSizes.screenHeight,
    width: AppSizes.screenWidth,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: AppSizes.paddingXXXLarge * 1.5,

  },
  fingerSprintModalContainer: {
    backgroundColor: "white",
    padding: AppSizes.paddingMedium,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: AppSizes.paddingSml,
    borderColor: AppColors.lightGrayTrans,
    borderWidth: AppSizes.paddingMicro,
  },
  titleCheckbox: {
    ...AppStyles.regularText,
    marginLeft: AppSizes.paddingMedium,
  },
};

export default connect(state => ({
  message: state.user.message,
  loading: state.user.loading,
  org: state.org.orgSelect,
  metadata: state.metadata,
}), {
  loadSignIn,
  forceFingerPrint,
})(SignInScreen);
