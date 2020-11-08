import _ from 'lodash';
import React, { Component } from 'react';
import {
  Dimensions,
  Keyboard, ScrollView, Text,
  TextInput,
  TouchableOpacity, View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { connect } from 'react-redux';
import HeaderDetail from '../../../components/HeaderDetail';
import Progress from '../../../components/Progress';
import AppConfig from '../../../config/AppConfig';
import messages from '../../../constant/Messages';
import API from '../../../network/API';
import AppColors from '../../../theme/AppColors';
import AppFonts from '../../../theme/AppFonts';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import AlertUtils from '../../../utils/AlertUtils';
import { callOnce } from "../../../utils/callOnce";
import StringUtils from '../../../utils/StringUtils';
import { Localize } from '../../setting/languages/LanguageManager';
import { loadSignIn, logout } from "../actions/creater/auth";



const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;
const widthContent = widthScreen - AppSizes.paddingXSml * 8;


class ChangePasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowKeyBoard: true,
      isShowVerifyPass: true,
      isShowCurrentPass: true,
      isShowNewPass: true,

      containUppercase: false,
      containLowercase: false,
      containNumber: false,
      containerSpecialLetter: false,
      atLeast8Character: false,

      isVerifyPass: false,


      verifyPassword: '',
      currentPass: '',
      newPassword: ''

    };
    this.LEVEL_STRENGTH = [
      {
        key: messages.containUppercase,
        content: Localize(messages.containUppercase),
        isPassed: false
      },
      {
        key: messages.containLowercase,
        content: Localize(messages.containLowercase),
        isPassed: false
      },
      {
        key: messages.containNumber,
        content: Localize(messages.containNumber),
        isPassed: false
      },
      {
        key: messages.containerSpecialLetter,
        content: Localize(messages.containerSpecialLetter),
        isPassed: false
      },
      {
        key: messages.atLeast8Character,
        content: Localize(messages.atLeast8Character),
        isPassed: false
      },
    ]
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({ isShowKeyBoard: true })

  }

  _keyboardDidHide() {
    this.setState({ isShowKeyBoard: false })

  }

  componentDidMount() {

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardDidShow());
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());
  }


  onClickChangePassword = () => {
    const { isRecoverPass } = this.props
    const { currentPass, newPassword, verifyPassword } = this.state
    if ((_.isEmpty(currentPass) && !isRecoverPass) || _.isEmpty(newPassword) || _.isEmpty(verifyPassword)) {
      AlertUtils.showError(messages.needToFill)

      return
    }
    const { containUppercase, containLowercase, containNumber, containerSpecialLetter, atLeast8Character, isVerifyPass } = this.state

    if (!containUppercase || !containLowercase || !containNumber || !containerSpecialLetter || !atLeast8Character) {
      AlertUtils.showError(messages.yourNewPassNotStrongEnough)

      return;
    }
    if (!isVerifyPass) {
      AlertUtils.showError(messages.veryfyPassFail)
      return;
    }

    const { username, verifyCode } = this.props
    Progress.show(API.changePass, [currentPass, newPassword, verifyPassword, isRecoverPass, username, verifyCode], res => {
      if (res && res.data) {
        this.onChangePassSuccess()
      }
    })
  }

  onChangePassSuccess = () => {
    this.props.logout()
  }

  onChangeNewPassword = (text) => {
    const containUppercase = StringUtils.isContainUpperCaseLetter(text)
    const containLowercase = StringUtils.isContainLowerCaseLetter(text)
    const containNumber = StringUtils.isContainDigit(text)
    const containerSpecialLetter = StringUtils.isContainNonWord(text)
    const atLeast8Character = StringUtils.isMoreThan8Char(text)

    const isVerifyPass = !_.isEmpty(text) && !_.isEmpty(this.state.verifyPassword) && text === this.state.verifyPassword
    this.setState({ containUppercase, containLowercase, containNumber, containerSpecialLetter, atLeast8Character, isVerifyPass, newPassword: text })
  }

  onChangeVerifyPass = (verifyPassword) => {
    const isVerifyPass = !_.isEmpty(this.state.newPassword) && !_.isEmpty(verifyPassword) && this.state.newPassword === verifyPassword

    this.setState({ verifyPassword, isVerifyPass })
  }



  renderCurrentInput() {
    const { isShowCurrentPass } = this.state
    return (<View style={styles.containerInput}>
      <Text style={[AppStyles.regularText, styles.textTitle, { width: widthContent, }]}>{Localize(messages.currentPass)}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          keyboardShouldPersistTaps='always'
          accessibilityLabel="username" testID="user_id"
          style={styles.textInput}
          onChangeText={(currentPass) => this.setState({ currentPass })}
          placeholder={Localize(messages.enterYourCurrentPass)}
          returnKeyType='next'
          autoFocus
          autoCorrect={false}
          autoCapitalize='none'
          onSubmitEditing={() => this.refs.txtPassword.focus()}
          underlineColorAndroid='rgba(0,0,0,0)'
          secureTextEntry={isShowCurrentPass}

        />
        {this.renderEyeIcon(() => this.setState({ isShowCurrentPass: !isShowCurrentPass }), isShowCurrentPass)}

      </View>
      <View style={styles.divider} />
    </View>)
  }

  renderNewPasswordInput() {
    const { isShowNewPass } = this.state
    return (<View style={[styles.containerInput, { marginTop: AppSizes.paddingMedium, }]}>
      <Text style={[AppStyles.regularText, styles.textTitle, { width: widthContent, }]}>{Localize(messages.newPass)}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          keyboardShouldPersistTaps='always'
          style={styles.textInput}
          secureTextEntry={isShowNewPass}
          placeholder={Localize(messages.enterNewPass)}
          returnKeyType='next'
          autoCorrect={false}
          autoCapitalize='none'
          ref={"txtPassword"}
          underlineColorAndroid='rgba(0,0,0,0)'
          onChangeText={(newPassword) => this.onChangeNewPassword(newPassword)}


        />
        {this.renderEyeIcon(() => this.setState({ isShowNewPass: !isShowNewPass }), isShowNewPass)}

      </View>

      <View style={styles.divider} />
    </View>)
  }


  renderVerifyPasswordInput = () => {
    const { isShowVerifyPass } = this.state
    return (<View style={[styles.containerInput, { marginTop: AppSizes.paddingMedium, }]}>
      {<View style={{ flexDirection: 'row', width: widthContent, alignItems: 'center' }}>
        <Text style={[AppStyles.regularText, styles.textTitle]}>{Localize(messages.verifyPassword)}</Text>
        {this.state.isVerifyPass && <Icon
          style={{ marginLeft: AppSizes.paddingXSml, }}
          name={'done'}
          size={AppSizes.paddingXXLarge}
          color={AppColors.greenLight}
        />}
      </View>}
      <View style={styles.inputContainer}>
        <TextInput
          keyboardShouldPersistTaps='always'
          style={styles.textInput}
          secureTextEntry={isShowVerifyPass}
          placeholder={Localize(messages.enterVerifyPass)}
          returnKeyType='go'
          autoCorrect={false}
          autoCapitalize='none'
          ref={"txtPassword"}
          underlineColorAndroid='rgba(0,0,0,0)'
          onSubmitEditing={() => this.onClickChangePassword()}
          onChangeText={(verifyPass) => this.onChangeVerifyPass(verifyPass)}


        />

        {this.renderEyeIcon(() => this.setState({ isShowVerifyPass: !isShowVerifyPass }), isShowVerifyPass)}
      </View>

      <View style={styles.divider} />
    </View>)
  }

  renderEyeIcon = (onPress, isDeactiveIcon) => {
    return <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={onPress && onPress}>
      <Icon
        name={'remove-red-eye'}
        size={AppSizes.paddingLarge}
        color={isDeactiveIcon ? AppColors.hintText : AppColors.abi_blue}
      />
    </TouchableOpacity>
  }

  renderStrengthPassInfo = () => {
    return <View style={styles.strengthPassInfo}>
      <Text style={styles.strengthTitleText}>{Localize(messages.passwordStrength)}</Text>
      {this.renderProgressStrength()}

      {this.renderContentStrength()}
    </View>
  }

  renderProgressStrength = () => {
    return <View style={styles.progressStrengthContain}>
      {this.LEVEL_STRENGTH.map(levelItem => { return <View style={[styles.levelStrengthItem, { backgroundColor: this.state[levelItem.key] ? AppColors.greenLight : AppColors.greySight, }]} /> })}
    </View>
  }

  renderContentStrength = () => {
    return <View style={styles.contentStrengthContainer}>
      {this.LEVEL_STRENGTH.map(levelItem => {
        return this.renderItemLevelStrength(levelItem)
      })}

    </View>
  }


  renderItemLevelStrength = (levelItem) => {
    return <View style={{ flexDirection: 'row', marginTop: AppSizes.paddingSml, alignItems: 'center' }}>
      <Icon
        name={'check-circle'}
        size={AppSizes.paddingXXLarge}
        color={this.state[levelItem.key] ? AppColors.greenLight : AppColors.greySight}
      />
      <Text style={{ ...AppStyles.regularText, color: AppColors.textSubContent, marginLeft: AppSizes.paddingMedium }}>{levelItem.content}</Text>
    </View>
  }

  render() {

    const { isRecoverPass } = this.props
    return (<View
      style={styles.imageContainer}
    >
      {!isRecoverPass && <HeaderDetail
        title={Localize(messages.changePass)}
      />}

      <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
        <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: AppSizes.paddingLarge }}>

          {isRecoverPass && <Text style={{ fontSize: AppSizes.fontMedium, color: AppColors.textTitle, width: '100%', paddingHorizontal: AppSizes.paddingMedium, marginBottom: AppSizes.paddingMedium }}>{Localize(messages.recoverPass)}</Text>}

          {!isRecoverPass && this.renderCurrentInput()}
          {this.renderNewPasswordInput()}
          {this.renderVerifyPasswordInput()}
          {this.renderStrengthPassInfo()}
          <View style={styles.signContainer}>
            <TouchableOpacity style={[styles.buttonSignIn, {}]} onPress={callOnce(() => this.onClickChangePassword())}>
              <Text style={styles.textSignIn}>{Localize(messages.changePass).toLocaleUpperCase()}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={[styles.buttonSignIn, { backgroundColor: 'white', marginTop: AppSizes.paddingSml }]} onPress={callOnce(() => Actions.pop())}>
              <Text style={[styles.textSignIn, { color: AppColors.textTitle }]}>{Localize(messages.changePass).toLocaleUpperCase()}</Text>
            </TouchableOpacity> */}

          </View>
          {this.state.isShowKeyBoard && <View style={{ height: AppConfig.DEV_MODE ? AppSizes.screenHeight / 3 : 150, backgroundColor: 'white' }} />}
          <View style={{ height: AppSizes.paddingLarge }} />
        </View>

      </ScrollView>
      <View style={{ height: AppSizes.paddingLarge }} />
    </View>
    )
  }

}

const styles = {
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: widthContent
  },
  logoContainer: {
    backgroundColor: 'white',
    height: AppSizes.paddingXXLarge * 3.5,
    width: AppSizes.paddingXXLarge * 3.5,
    borderRadius: AppSizes.paddingSml,
    borderWidth: AppSizes.paddingMicro,
    borderColor: AppColors.lightGrayTrans,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.gray,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: AppSizes.paddingXXLarge,
    marginTop: AppSizes.paddingXXLarge,
  },
  imageContainer: {
    height: AppSizes.screenHeight,
    width: AppSizes.screenWidth,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInLogo: {
    width: '70%',
    height: verticalScale(60),
  },
  textTitle: {
    fontSize: AppSizes.fontBase,
    color: '#1B64B0',
    backgroundColor: 'transparent',
    // width: widthContent,
  },
  divider: {
    width: widthContent,
    backgroundColor: AppColors.hintText,
    height: AppSizes.paddingMicro
  },
  containerInput: {
    // justifyContent: 'center',
    alignItems: 'center'
  },
  buttonSignIn: {
    backgroundColor: '#1B64B0',
    borderRadius: AppSizes.paddingXTiny,
    borderWidth: AppSizes.paddingMicro,
    borderColor: '#d6d7da',
    justifyContent: 'center',
    alignItems: 'center',
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
    height: AppSizes.paddingLarge * 2
  },
  textSignIn: {
    ...AppStyles.regularText,
    color: 'white',
    // fontSize: AppSizes.fontXXMedium,
    fontFamily: AppFonts.base.family
  },
  textInput: {
    fontSize: AppSizes.fontBase,
    // width: widthContent,
    backgroundColor: 'transparent',
    padding: 0,
    height: verticalScale(40),
    width: '90%'

  },
  containerVersion: {
    position: 'absolute',
    bottom: AppSizes.paddingLarge + AppSizes.paddingXSml
  },
  containerTestConfig: {
    marginTop: AppSizes.paddingLarge
  },
  viewContainer: {
    flex: 1,
    width: widthScreen,
    height: heightScreen,
    backgroundColor: 'red'
  },
  container: {
    flex: 1,
    paddingTop: moderateScale(50),
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  textVersion: {
    fontSize: AppSizes.fontSmall,
    backgroundColor: 'transparent',
    color: AppColors.abi_blue
  },

  textMessageError: {
    fontSize: AppSizes.fontSmall,
    marginTop: moderateScale(10),
    backgroundColor: 'transparent',
    color: 'red'
  },
  infoEnterContainer: {
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
    backgroundColor: 'white',
    paddingVertical: AppSizes.paddingXXMedium,
    paddingHorizontal: AppSizes.paddingXSml,
    borderRadius: AppSizes.paddingTiny,
    borderColor: AppColors.lightGrayTrans,
    borderWidth: AppSizes.paddingMicro,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppColors.gray,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    marginTop: AppSizes.paddingXXLarge
  },
  signContainer: {
    justifyContent: 'space-between',
    alignItems: 'space-between',
    marginTop: AppSizes.paddingXXLarge,
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2
  },

  strengthPassInfo: {
    width: widthContent,
    borderColor: AppColors.greySight,
    borderWidth: AppSizes.paddingXXTiny,
    borderRadius: AppSizes.paddingXTiny,
    padding: AppSizes.paddingSml,
    marginTop: AppSizes.paddingMedium,

  },
  strengthTitleText: {
    ...AppStyles.regularText,
  },
  progressStrengthContain: {
    flexDirection: 'row',
    marginTop: AppSizes.paddingSml
  },
  levelStrengthItem: {
    width: AppSizes.paddingLarge * 2,
    height: AppSizes.paddingXTiny,
    marginRight: AppSizes.paddingTiny
  },
  contentStrengthContainer: {
    marginTop: AppSizes.paddingMedium,
  }
};

export default connect(state => ({
  message: state.user.message,
  loading: state.user.loading,
  org: state.org.orgSelect,
}), {
  loadSignIn,
  logout
})(ChangePasswordScreen);
