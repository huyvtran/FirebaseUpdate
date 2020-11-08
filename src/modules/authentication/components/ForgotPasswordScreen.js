import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import InputField from '../../../components/InputField';
import { Icon } from 'react-native-elements';
import AppFonts from '../../../theme/AppFonts';
import { Actions } from 'react-native-router-flux';
import Divider from '../../form/components/Divider';
import Progress from '../../../components/Progress';
import API from '../../../network/API';
import _ from 'lodash';
import AlertUtils from '../../../utils/AlertUtils';
import AuthenticateWrapComponent from "./AuthenticateWrapComponent";

const styles = {
    container: {
        width: '100%',
        backgroundColor: 'transparent',
        paddingHorizontal: AppSizes.paddingXXLarge,
        justifyContent: 'center',
        alignItems: 'flex-start',

    },
    buttonSignIn: {
        backgroundColor: '#1B64B0',
        borderRadius: AppSizes.paddingTiny,
        justifyContent: 'center',
        alignItems: 'center',
        width: AppSizes.screenWidth - AppSizes.paddingXXLarge * 2,
        height: AppSizes.paddingXXLarge * 2,
        marginTop: AppSizes.paddingLarge
    },
    textSignIn: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
        lineHeight: 24,
        letterSpacing: 1,
        color: 'rgba(255,255,255,0.9)'
    },
    backContaner: {
        flexDirection: 'row',
        width: '100%',
        marginTop: AppSizes.paddingMedium * 2,
        justifyContent: 'center',
    }
};

class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.FILL_USERNAME_MODE = {
            title: Localize(messages.forgetPass),
            description: Localize(messages.forgetPassInstruction),
            titleInput: messages.userName,
            placeholderInput: Localize(messages.yourUserName),
            inputKey: 'username',
            buttonTitle: Localize(messages.emailARecoverLink),
            isDisplayResendEmail: false,
            onClickButton: () => this.onClickSendEmail(),
            iconInputName: 'ios-person',

        };

        this.VERIFY_CODE_MODE = {
            title: Localize(messages.recoverPass),
            description: Localize(messages.verifyCodeInstruction),
            titleInput: messages.verifyCode,
            placeholderInput: Localize(messages.enterYourCode),
            inputKey: 'verifyCode',
            buttonTitle: Localize(messages.changePass),
            isDisplayResendEmail: true,
            onClickButton: () => this.onClickCheckCode(),
            iconInputName: null,
        };
        this.state = {
            mode: this.FILL_USERNAME_MODE
        };
    }

    //LOGIC CONTROL ---------------------------------------------------------------------------------

    //UI CONTROL ---------------------------------------------------------------------------------
    onClickSendEmail = () => {

        if (_.isEmpty(this.username)) {
            AlertUtils.showError(messages.youMustFillUserNameBefore);

            return;
        }

        Progress.show(API.forgotPassword, [this.username], res => {
            if (res) {
                this.setState({ mode: this.VERIFY_CODE_MODE }, () => {
                    this.inputField.clear();
                });

            }
        }, () => { },
            error => {
                this.setState({
                    error: {
                        code: error?.response?.status,
                        message: error?.response?.data?.message ?? Localize(messages.somethingWentWrong)
                    }
                })

                return true
            });
    };

    onClickCheckCode = () => {
        if (_.isEmpty(this.username)) {
            AlertUtils.showError(messages.yourVerifyCodeIsEmpty);
            return;
        }
        Progress.show(API.verifyCodeForgotPass, [this.username, this.verifyCode], res => {
            if (res) {
                // Actions.changePassword({
                //     isRecoverPass: true,
                //     username: this.username,
                //     verifyCode: this.verifyCode
                // });
                Keyboard.dismiss()
                Actions.recoverPass({
                    username: this.username,
                    verifyCode: this.verifyCode
                })

            }
        });
    };

    isErrorMode = () => {
        return !!this.state.error
    }


    //UI RENDER ----------------------------------------------------------------------------------
    renderUserNameInput = () => {
        const { mode, error } = this.state;

        return <View style={{ width: AppSizes.screenWidth - AppSizes.paddingXXLarge * 4 }}>

            <View style={{ width: '100%', marginVertical: AppSizes.paddingXSml, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                    ref={ref => {
                        this.inputField = ref;
                    }}
                    autoFocus
                    onChangeText={(text) => this[mode.inputKey] = text}
                    autoCorrect={false}
                    blurOnSubmit
                    autoCapitalize="none"
                    placeholderTextColor={AppColors.hintText}
                    placeholder={mode.placeholderInput}
                    style={{
                        paddingTop: AppSizes.paddingXSml,
                        paddingBottom: AppSizes.paddingXSml,
                        color: AppColors.textColor,
                        flex: 1
                    }}
                    underlineColorAndroid='rgba(0,0,0,0)'
                />
                {mode.iconInputName && <Icon
                    name={mode.iconInputName}
                    type='ionicon'
                    size={AppSizes.paddingLarge}
                    color={'rgb(119,119,119)'}
                />}
            </View>


            <Divider color={this.isErrorMode() ? AppColors.red : null} />
            {error && <Text style={{ ...AppStyles.regularText, color: AppColors.red, fontSize: AppSizes.fontSmall, marginTop: AppSizes.paddingXSml }}>{error.message}</Text>}
            {mode.isDisplayResendEmail &&
                <TouchableOpacity style={{ marginTop: AppSizes.paddingXXLarge, alignItems: 'center' }}
                    onPress={() => this.onClickSendEmail()}>
                    <Text style={{
                        ...AppStyles.regularText,
                        color: AppColors.naviBlue,
                        lineHeight: 16,
                        letterSpacing: 0.75,
                    }}>{Localize(messages.resendEmail).toUpperCase()}</Text>
                </TouchableOpacity>}
        </View>;
    };

    render() {
        const { mode } = this.state;

        return (<AuthenticateWrapComponent hideVersion>
            <View style={styles.container}>
                <View style={AppStyles.authenticateInputContainer}>
                    <Image
                        source={require('../../../assets/icon/iconSecurity.png')}
                        resizeMode={'cover'}
                        style={{
                            height: AppSizes.screenHeight * 0.12,
                            width: AppSizes.screenHeight * 0.12
                        }} />
                    <Text style={{
                        ...AppStyles.regularText,
                        fontSize: AppSizes.fontLarge,
                        color: 'rgba(65, 65, 66)',
                        letterSpacing: 0.25,
                        lineHeight: 30,
                        marginTop: AppSizes.paddingMedium
                    }}>{mode.title}</Text>
                    <Text style={{
                        ...AppStyles.regularText,
                        color: 'rgba(65, 65, 66)',
                        marginTop: AppSizes.paddingXSml,
                        marginBottom: AppSizes.paddingMedium,
                        letterSpacing: 0.25,
                        lineHeight: 20,
                        textAlign: 'center'
                    }}>{mode.description}</Text>

                    {this.renderUserNameInput()}
                </View>


                <TouchableOpacity style={[styles.buttonSignIn, {}]}
                    onPress={mode.onClickButton}>
                    <Text style={styles.textSignIn}>{mode.buttonTitle.toUpperCase()}</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.backContaner} onPress={() => Actions.pop()}>
                    <Text style={{
                        ...AppStyles.regularText,
                        color: AppColors.naviBlue,
                        lineHeight: 16,
                        letterSpacing: 0.75
                    }}>{Localize(messages.backToSignIn).toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        </AuthenticateWrapComponent>

        );
    }
};


//Connect everything
export default ForgotPasswordScreen;


