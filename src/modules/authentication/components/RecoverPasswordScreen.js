import React, { Component, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import { Localize } from '../../setting/languages/LanguageManager';
import Messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import InputField from '../../../components/InputField';
import { Icon } from 'react-native-elements';
import AppFonts from '../../../theme/AppFonts';
import { Actions } from 'react-native-router-flux';
import Divider from '../../form/components/Divider';
import Progress from '../../../components/Progress';
import API from '../../../network/API';
import _ from 'lodash';
import AuthenticateWrapComponent from "./AuthenticateWrapComponent";
import { useKeyBoardStatus } from '../../../components/customhook/KeyboardDevice';
import AuthenConstant from '../../../constant/AuthenConstant';
import NotificationManager from '../../notification/NotificationManager';

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
    },
    alertInfoContainer: {
        backgroundColor: 'rgb(94, 99, 102)',
        width: AppSizes.screenWidth,
        flexDirection: 'row',
        paddingHorizontal: AppSizes.padding,
        paddingVertical: AppSizes.paddingSml
    }
};
const PasswordInputField = ({ placeHolder = "", onChangeText, refInput, isVisibleWeak = false, value = "", autoFocus = false }) => {
    const [hidePassText, setHidePassText] = useState(true);

    return <View style={{
        width: AppSizes.screenWidth - AppSizes.paddingXXLarge * 4,
        paddingVertical: AppSizes.paddingXSml
    }}>

        <View style={{
            width: '100%',
            marginVertical: AppSizes.paddingXSml,
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <TextInput
                ref={refInput}
                autoFocus={autoFocus}
                onChangeText={(text) => onChangeText && onChangeText(text)}
                autoCorrect={false}
                blurOnSubmit
                secureTextEntry={hidePassText}
                autoCapitalize="none"
                placeholderTextColor={AppColors.hintText}
                placeholder={placeHolder}
                style={{
                    paddingTop: AppSizes.paddingXSml,
                    paddingBottom: AppSizes.paddingXSml,
                    color: AppColors.textColor,
                    flex: 1
                }}
                underlineColorAndroid='rgba(0,0,0,0)'
                value={value}
            />
            <TouchableOpacity onPress={() => setHidePassText(!hidePassText)}>
                <Icon
                    name={hidePassText ? 'ios-eye-off' : 'ios-eye'}
                    size={AppSizes.paddingLarge}
                    type='ionicon'
                    color={'rgb(119,119,119)'}
                />
            </TouchableOpacity>

        </View>
        <Divider color={isVisibleWeak ? AppColors.red : null} />
        {isVisibleWeak && <View style={{ flexDirection: 'row', marginTop: AppSizes.paddingSml }}>
            <Text style={{ ...AppStyles.subText, color: AppColors.black }}>{"Password Strength: "}</Text>
            <Text style={{ ...AppStyles.subText, color: AppColors.red, marginLeft: AppSizes.paddingSml }}>{"Weak!"}</Text>
        </View>}
    </View>;
};

const StrengthPasswordInfoItem = ({ strengthItem, itemHeight, isPassed = false }) => {
    return <View style={{ flexDirection: 'row', paddingHorizontal: AppSizes.padding, alignItems: 'center', height: itemHeight }}>
        <Icon
            name={'check-circle'}
            size={AppSizes.paddingXXLarge}
            color={isPassed ? AppColors.greenLight : 'rgb(198,202,204)'}
        />
        <Text style={{ ...AppStyles.regularText, color: AppColors.black, marginLeft: AppSizes.paddingSml, lineHeight: 20 }}>{Localize(strengthItem.content)}</Text>
    </View>
}

const RequireInformationComponent = ({ visible = false, onClickDesTitle, passwordText = "", verifyPasswordText = "", allPassCallback, allRequireFieldPassCallBack }) => {

    const { isKeyboardShow, heightKeyboard } = useKeyBoardStatus(true);
    const [heightKeyboardSolid, setHeightKeyboardSolid] = useState(heightKeyboard)
    let isAllPassed = true
    const isVerifyPassword = !_.isEmpty(passwordText) && !_.isEmpty(verifyPasswordText) && passwordText === verifyPasswordText
    useEffect(() => {
        if (isKeyboardShow) {
            setHeightKeyboardSolid(heightKeyboard)
        }
    }, [heightKeyboard])

    if (!visible) {
        return <View />
    }

    const LEVEL_PASS_VIEW = AuthenConstant.LEVEL_PASSWORD_STRENGTH.map(strengthItem => {
        const isPassed = strengthItem.checkPass(passwordText)
        if (!isPassed) {
            isAllPassed = false
        }
        return <StrengthPasswordInfoItem
            isPassed={isPassed}
            strengthItem={strengthItem}
            itemHeight={(heightKeyboardSolid - AppSizes.paddingSml * 2) / AuthenConstant.LEVEL_PASSWORD_STRENGTH.length} />
    })

    if (isAllPassed) {
        allPassCallback && allPassCallback(true)
        if (isVerifyPassword) {
            allRequireFieldPassCallBack && allRequireFieldPassCallBack(true)
            return <View />
        }
    } else {
        allPassCallback && allPassCallback(false)
    }

    allRequireFieldPassCallBack && allRequireFieldPassCallBack(false)
    return <View style={{ width: '100%', position: 'absolute', bottom: 0 }}>
        <TouchableOpacity
            disabled={isAllPassed}
            onPress={() => onClickDesTitle && onClickDesTitle()}
            style={styles.alertInfoContainer} >
            <Icon
                name={"info"}
                size={AppSizes.paddingLarge}
                color={AppColors.white}
            />
            <Text style={{ ...AppStyles.regularText, color: 'white', marginLeft: AppSizes.paddingLarge, flex: 1 }}>{!isAllPassed ? "New Password must be contains:" : "Must be the same new password"}</Text>
            {!isAllPassed && <Icon
                name={isKeyboardShow ? "keyboard-arrow-down" : "keyboard-arrow-up"}
                size={AppSizes.paddingLarge}
                color={AppColors.white}
            />}
        </TouchableOpacity>
        <View style={{ height: heightKeyboardSolid, backgroundColor: 'white' }}>
            {!isAllPassed && LEVEL_PASS_VIEW}
        </View>
    </View>
}

const RecoverPasswordScreen = (props) => {
    const { isKeyboardShow, heightKeyboard } = useKeyBoardStatus(true);
    const [newPassword, setNewPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [isAllStrengthPassed, setAllStrengthPassed] = useState(true);
    const [isEnableChangePass, setEnableChangePass] = useState(false);
    let keyboardInputRef = null
    //LOGIC CONTROL ---------------------------------------------------------------------------------
    const onChangePassSuccess = () => {
        NotificationManager.showMessageBar(Localize(Messages.changePassSuccess), undefined, undefined)
        Actions.reset('login');
    }

    //UI CONTROL ---------------------------------------------------------------------------------

    const onClickNotStrongDescription = () => {
        if (isKeyboardShow) {
            Keyboard.dismiss()
        } else {
            if (keyboardInputRef.isFocused()) {
                keyboardInputRef.blur();

                setTimeout(() => {
                    keyboardInputRef.focus();
                }, 100);
            } else {
                keyboardInputRef.focus()
            }
        }
    }

    const onChangeNewPassword = (text) => {
        setNewPassword(text)
    }

    const onChangeVerifyWord = (text) => {
        setVerifyPassword(text)
    }

    const onChangePass = () => {
        const { username, verifyCode } = props
        Progress.show(API.changePass, ["", newPassword, verifyPassword, true, username, verifyCode], res => {
            if (res && res.data) {
                onChangePassSuccess()
            }
        })
    }

    //UI RENDER ----------------------------------------------------------------------------------

    return (<View style={{ height: AppSizes.screenHeight, width: AppSizes.screenWidth, }}>
        <AuthenticateWrapComponent hideVersion>
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
                    }}>{Localize(Messages.recoverPass)}</Text>

                    <PasswordInputField
                        refInput={(ref) => keyboardInputRef = ref}
                        placeHolder={Localize(Messages.newPass)}
                        onChangeText={(text) => onChangeNewPassword(text)}
                        isVisibleWeak={!isAllStrengthPassed}
                        value={newPassword}
                        autoFocus={true}
                    />
                    <PasswordInputField
                        placeHolder={Localize(Messages.verifyPassword)}
                        onChangeText={(text) => onChangeVerifyWord(text)}
                        value={verifyPassword}

                    />
                </View>


                <TouchableOpacity disabled={!isEnableChangePass} style={[styles.buttonSignIn, { backgroundColor: isEnableChangePass ? '#1B64B0' : 'rgb(198,202,204)', }]}
                    onPress={() => {
                        onChangePass()
                    }}>
                    <Text style={styles.textSignIn}>{Localize(Messages.changePass)
                        .toUpperCase()}</Text>
                </TouchableOpacity>



                <TouchableOpacity style={styles.backContaner} onPress={() => Actions.reset('login')}>
                    <Text style={{
                        ...AppStyles.regularText,
                        color: AppColors.naviBlue,
                        lineHeight: 16,
                        letterSpacing: 0.75
                    }}>{Localize(Messages.backToSignIn).toUpperCase()}</Text>
                </TouchableOpacity>
                {!isEnableChangePass && <View style={{ height: AppSizes.screenHeight / 3 }} />}

            </View>

        </AuthenticateWrapComponent>
        <RequireInformationComponent
            visible={!_.isEmpty(newPassword)}
            passwordText={newPassword}
            verifyPasswordText={verifyPassword}
            allPassCallback={(isAllPass) => setAllStrengthPassed(isAllPass)}
            allRequireFieldPassCallBack={(isAllPass) => setEnableChangePass(isAllPass)}
            onClickDesTitle={() => onClickNotStrongDescription()} />
    </View >

    );

};


//Connect everything
export default RecoverPasswordScreen;


