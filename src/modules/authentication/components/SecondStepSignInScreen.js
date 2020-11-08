import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
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
import HeaderDetail from '../../../components/HeaderDetail';
import CodeInput from 'react-native-confirmation-code-input';
import { connect } from "react-redux";
import { loadDataAfterSignIn } from "../actions/creater/auth";
import AuthenticateWrapComponent from './AuthenticateWrapComponent';
import NotificationManager from '../../notification/NotificationManager';

const CODE_LENGTH = 6;

class SecondStepSignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enableSignIn: false,
            time: 30
        };
    }

    //LOGIC CONTROL ---------------------------------------------------------------------------------

    //UI CONTROL ---------------------------------------------------------------------------------
    onFinishInputCode = (code) => {
        this.code = code;
        this.setState({ enableSignIn: true });
    };

    onClickVerifyCode = () => {
        const { bodySignin, resSignin, loadDataAfterSignIn } = this.props
        Progress.show(API.twoStepVerify, [resSignin, bodySignin, this.code],
            (res) => {
                Actions.pop()
                loadDataAfterSignIn(res, bodySignin)
            })

    }
    onClickResendCode = () => {
        const { resSignin } = this.props
        this.setState({ loadingResendCode: true, }, () => {
            API.resendTwoStepCode(resSignin).then(res => {
                NotificationManager.showSuccessMessage(Localize(messages.resendCodeSuccess))
                this.setState({ loadingResendCode: false, disableResendCode: true })

                const timeInterval = setInterval(() => {
                    if (this.state.time === 0) {
                        clearInterval(timeInterval)
                        this.setState({ disableResendCode: false, time: 30 })
                        return;
                    }
                    this.setState({ time: this.state.time - 1 })
                }, 1000);
            }).catch(error => {
                NotificationManager.showErrorMessage(error.message)
                this.setState({ loadingResendCode: false })

            })
        })


    }

    getResendText = () => {
        if (this.state.disableResendCode) {
            return Localize(messages.resend).toUpperCase() + " (" + this.state.time + "s) "
        }

        return Localize(messages.resend).toUpperCase()
    }

    //UI RENDER ----------------------------------------------------------------------------------
    renderContent() {
        const { disableResendCode } = this.state
        return <View style={styles.contentContainer}>
            <Text style={{
                ...AppStyles.regularText,
                fontSize: AppSizes.fontMedium,
                color: AppColors.textTitle,
            }}>{Localize(messages.enterCode)}</Text>
            <Text style={{
                ...AppStyles.regularText,
                color: AppColors.textTitle,
                marginTop: AppSizes.paddingMedium,
                marginBottom: AppSizes.paddingSml,
            }}>{Localize(messages.enterYourVerifyCode)}</Text>

            <CodeInput
                onCodeChange={(text) => {
                    if (this.state.enableSignIn && text.length < CODE_LENGTH) {
                        this.setState({ enableSignIn: false });
                    }
                }}
                codeLength={CODE_LENGTH}
                ref="codeInputRef2"
                secureTextEntry
                activeColor={AppColors.greenLight}
                inactiveColor={AppColors.separator}
                autoFocus={false}
                ignoreCase={true}
                inputPosition='center'
                size={(AppSizes.screenWidth - AppSizes.paddingMedium * 10) / 6}
                onFulfill={(code) => this.onFinishInputCode(code)}
                containerStyle={{
                    flex: 0,
                }}
                codeInputStyle={{
                    borderWidth: AppSizes.paddingXXTiny,
                    marginRight: AppSizes.paddingSml,
                    borderRadius: AppSizes.paddingTiny,
                }}
            />

            <TouchableOpacity disabled={disableResendCode} style={{ marginTop: AppSizes.paddingXXLarge, alignItems: 'center' }}
                onPress={() => this.onClickResendCode()}>
                {this.state.loadingResendCode ? <ActivityIndicator size={'small'} color={AppColors.abi_blue_light} /> :
                    <Text style={{
                        ...AppStyles.regularText,
                        color: disableResendCode ? AppColors.grayDisable : AppColors.naviBlue,
                        lineHeight: 16,
                        letterSpacing: 0.75,
                    }}>{this.getResendText()}</Text>}
            </TouchableOpacity>
        </View>;
    }


    renderFooter() {
        const { enableSignIn } = this.state;
        const { loadDataAfterSignIn, resSignin, bodySignin } = this.props
        return <View style={{
            flex: 2,
            width: '100%',
            alignItems: 'center'
        }}>
            <TouchableOpacity
                disabled={!enableSignIn}
                style={[styles.buttonSignIn, { backgroundColor: enableSignIn ? AppColors.abi_blue : AppColors.hintText }]}
                onPress={() => {
                    this.onClickVerifyCode()
                }}>
                <Text style={styles.textSignIn}>{Localize(messages.signIn).toUpperCase()}</Text>
            </TouchableOpacity>
        </View>;
    }

    render() {

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
                    {this.renderContent()}

                </View>



                {this.renderFooter()}

                <TouchableOpacity style={styles.backContaner} onPress={() => Actions.pop()}>
                    <Text style={{
                        ...AppStyles.regularText,
                        color: AppColors.naviBlue,
                        lineHeight: 16,
                        letterSpacing: 0.75
                    }}>{Localize(messages.backToSignIn).toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        </AuthenticateWrapComponent>);
    }
};


//Connect everything
export default connect(state => ({}), { loadDataAfterSignIn })(SecondStepSignInScreen);

const styles = {
    container: {
        width: '100%',
        backgroundColor: 'transparent',
        paddingHorizontal: AppSizes.paddingXXLarge,
        justifyContent: 'center',
        alignItems: 'flex-start',

    },

    contentContainer: {
        flex: 8,
        justifyContent: 'center',
        // alignItems: 'center',
        // padding: AppSizes.paddingMedium * 2,
        marginTop: AppSizes.paddingSml,
        width: '100%'
    },
    backContaner: {
        flexDirection: 'row',
        width: '100%',
        marginTop: AppSizes.paddingMedium * 2,
        justifyContent: 'center',
    },
    buttonSignIn: {
        backgroundColor: '#1B64B0',
        borderRadius: AppSizes.paddingTiny,
        justifyContent: 'center',
        alignItems: 'center',
        width: AppSizes.screenWidth - AppSizes.paddingXXLarge * 2,
        height: AppSizes.paddingXXLarge * 2,
        marginTop: AppSizes.paddingLarge * 2
    },
    textSignIn: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
        lineHeight: 24,
        letterSpacing: 1,
        color: 'rgba(255,255,255,0.9)'
    },

};
