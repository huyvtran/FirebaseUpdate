import _ from 'lodash';
import React from 'react';
import { Component } from 'react';
import {
    ActivityIndicator, Image,
    KeyboardAvoidingView, Linking,
    Modal, ScrollView, Switch, Text,
    TextInput,
    TouchableHighlight, TouchableOpacity, View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { AbstractProps, AbstractStates } from '../../base/AbstractProperty';
import ButtonText from '../../components/ButtonText';
import HeaderDetail from '../../components/HeaderDetail';
import messages from '../../constant/Messages';
import API from '../../network/API';
import { addUserMetaData, changeFingerPrintSetup } from '../../store/actions/metadata';
import AppColors from '../../theme/AppColors';
import AppSizes from '../../theme/AppSizes';
import AppStyles from '../../theme/AppStyles';
import { H1, H3 } from '../../theme/styled';
import Divider from '../form/components/Divider';
import NotificationManager from '../notification/NotificationManager';
import { setLocale } from "./languages/actions/creater/i18";
import { translateText } from './languages/components/translate';
import { Localize } from './languages/LanguageManager';
interface Props extends AbstractProps {
    user: any,
    i18n: any,
    isEnableFingerPrint: any,
    setLocale: (key:string) => void,
    changeFingerPrintSetup: (state: boolean) => void,
    addUserMetaData: (body:object) => void
}

interface States extends AbstractStates {
    visibleModalFingerSprint: boolean,
    confirmPassLoading: boolean
}

class UserSettingScreen extends Component<Props, States> {
    passwordVerify: string;
    constructor(props) {
        super(props);
        this.state = {
            visibleModalFingerSprint: false,
            confirmPassLoading: false
        };
    }

    onClickChangeLocale = _.throttle(() => {
        const params = {
            callback: this.onCallBackChangeLocale.bind(this),
        };
        Actions.selectLanguages(params);
    }, 300, { 'trailing': false });

    onCallBackChangeLocale(language) {
        this.props.setLocale(language.key);
    }

    onClickTutorial() {
        Linking.openURL('https://www.youtube.com/channel/UCThr-SfR4VcS7P6KMcGUdHQ');
    }

    onClickChangePass = () => {
        Actions.changePassword();
    };

    onChangeFingerPrint = (value) => {
        this.setState({ visibleModalFingerSprint: true });
    };

    onClickConfirmPass = () => {
        const { passwordVerify } = this;
        if (_.isEmpty(passwordVerify)) {
            return
        }
        this.setState({ confirmPassLoading: true }, () => {
            this.onVerifyPassword();
        });
    };

    onVerifyPassword = () => {
        const { user } = this.props;
        const { passwordVerify } = this;
        const bodySignin = {
            username: user.username,
            password: passwordVerify
        };
        API.signIn(bodySignin)
            .then(res => {
                if (res && res.data) {
                    this.props.changeFingerPrintSetup(!this.props.isEnableFingerPrint);
                    this.props.addUserMetaData(bodySignin);
                    this.setState({
                        confirmPassLoading: false,
                        visibleModalFingerSprint: false
                    });
                }
            })
            .catch(error => {
                this.setState({
                    confirmPassLoading: false,
                    visibleModalFingerSprint: false
                });
                NotificationManager.showErrorMessage(Localize(messages.failAuthen));
            });
    };

    renderSection(title, contentView) {
        return <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitleText}>{title.toString()
                .toUpperCase()}</Text>
            {contentView}
        </View>;
    }

    renderSetting() {
        return <View style={styles.contentSection}>
            {this.renderInfoItem(Localize('lang_setting'), translateText('language'), () => this.onClickChangeLocale())}
            {this.renderFingerPrint()}
            <Divider style={{ marginTop: AppSizes.padding }} />

        </View>;
    }

    renderSupport() {
        return <View style={styles.contentSection}>
            {this.renderInfoItem(Localize(messages.tutorial), '', () => this.onClickTutorial())}
            <Divider style={{ marginTop: AppSizes.padding }} />

        </View>;
    }

    renderFingerPrint = () => {
        return <View style={{ marginTop: AppSizes.paddingXXMedium }}>
            <Text style={{
                ...AppStyles.regularText,
                color: AppColors.textPrimary
            }}>{Localize(messages.fingerPrint)}</Text>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={{
                    ...AppStyles.regularText,
                    color: AppColors.sectionText,
                    marginTop: AppSizes.paddingXSml,
                    marginRight: AppSizes.paddingXSml,
                    flex: 1
                }} numberOfLines={2}>{Localize(messages.fingerPrintDes)}</Text>
                <Switch value={this.props.isEnableFingerPrint}
                    style={{ marginLeft: AppSizes.paddingMedium }} onValueChange={(value) => {
                        this.onChangeFingerPrint(value);
                    }} />
            </View>

        </View>;
    };


    renderUserInfo() {
        const { user } = this.props;
        if (!user) {
            return <View />;
        }
        return <View style={styles.contentSection}>
            {this.renderInfoItem(Localize(messages.userName), user.displayName)}
            {this.renderInfoItem(Localize(messages.phoneNumber), '+84 ')}
            {this.renderInfoItem(Localize(messages.email), user.email)}
            <Divider style={{ marginTop: AppSizes.padding }} />

        </View>;
    }

    renderInfoItem(title, content, action?) {
        return <TouchableOpacity style={{ marginTop: AppSizes.paddingXXMedium }}
            onPress={action && action}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View>
                    <Text style={{
                        ...AppStyles.regularText,
                        color: AppColors.textPrimary
                    }}>
                        {title}
                    </Text>
                    {!_.isEmpty(content) && <Text style={{
                        ...AppStyles.regularText,
                        color: AppColors.sectionText,
                        marginTop: AppSizes.paddingXSml
                    }}>
                        {content}
                    </Text>}
                </View>
                {action && <Icon
                    name={'keyboard-arrow-right'}
                    size={AppSizes.paddingXXLarge}
                    color={AppColors.sectionText}
                />}
            </View>

        </TouchableOpacity>;
    }

    renderChangePassWord = () => {
        return <View style={styles.changePassContainer}>
            <ButtonText
                containerStyle={styles.changePassButtonContainer}
                content={Localize(messages.changePass)
                    .toUpperCase()}
                onClick={() => this.onClickChangePass()}
            />
        </View>;
    };

    renderContentFingerSprintModal() {
        return <TouchableHighlight style={[styles.fingerSprintModal, { zIndex: -1 }]} onPress={() => this.setState({ visibleModalFingerSprint: false })} >
            <KeyboardAvoidingView style={styles.fingerSprintModal} behavior="padding" enabled>
                <TouchableOpacity style={styles.fingerSprintModalContainer} >
                    <Text style={[AppStyles.h3, {
                        marginTop: AppSizes.paddingLarge,
                        color: AppColors.textTitle
                    }]}>{Localize(messages.enterYourCurrentPass)}</Text>
                    <Text style={[AppStyles.h5, {
                        color: AppColors.textSubContent,
                        marginTop: AppSizes.paddingSml,
                    }]}>{Localize(messages.pleaseEnterPassToverify)}</Text>
                    <TextInput
                        style={styles.textInput}
                        keyboardShouldPersistTaps='always'
                        underlineColorAndroid="transparent"
                        numberOfLines={1}
                        onChangeText={(text) => this.passwordVerify = text}
                        placeholder={Localize(messages.enterYourCurrentPass)}
                        autoCorrect={false}
                        autoCapitalize='none'
                        secureTextEntry={true}
                        autoFocus
                    />
                    <TouchableOpacity style={styles.doneButton}
                        onPress={() => this.onClickConfirmPass()}>
                        {this.state.confirmPassLoading ? <ActivityIndicator /> : <Text style={{
                            ...AppStyles.h5,
                            color: 'white'
                        }}>{Localize(messages.done)}</Text>}
                    </TouchableOpacity>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </TouchableHighlight>;
    }

    render() {
        return (
            <View style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'white'
            }}>
                <HeaderDetail
                    title={Localize(messages.tabs.settings)}
                />
                <ScrollView>
                    <View style={styles.containerInfo}>
                        <Image style={{
                            marginTop: AppSizes.paddingXSml,
                            height: AppSizes.paddingSml * 6,
                            width: AppSizes.paddingSml * 6
                        }} source={require('../../assets/icon/iconPerson.png')} />
                        <Text style={[H1, {
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            marginTop: AppSizes.paddingXSml
                        }]}
                            numberOfLines={1}>{this.props.user && this.props.user.displayName}</Text>
                        <Text style={[H3, {
                            opacity: 0.6,
                            marginTop: AppSizes.paddingXSml
                        }]}>{this.props.user && this.props.user.email}</Text>
                    </View>
                    {this.renderSection(Localize(messages.userInfo), this.renderUserInfo())}
                    {this.renderSection(Localize(messages.tabs.settings), this.renderSetting())}
                    {this.renderSection(Localize(messages.support), this.renderSupport())}

                    {this.renderChangePassWord()}
                    <View style={{ height: AppSizes.paddingSml * 5 }} />
                </ScrollView>
                <Modal
                    transparent ref="modal"
                    visible={this.state.visibleModalFingerSprint}
                    animationType={'fade'}
                >
                    {this.renderContentFingerSprintModal()}
                </Modal>
            </View>
        );
    }
}

const styles = {
    containerInfo: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: AppSizes.paddingMedium
    },
    titleCheckbox: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
        color: '#212121'
    },
    settingRow: {
        flexDirection: 'row',
        height: AppSizes.paddingSml * 5,
        justifyContent: 'space-between',
        padding: AppSizes.paddingSml,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fdfdfd',
        alignItems: 'center'
    },

    sectionContainer: {
        width: '100%',
        paddingHorizontal: AppSizes.paddingMedium,
        paddingTop: AppSizes.paddingMedium,
        backgroundColor: 'white'

    },
    sectionTitleText: {
        ...AppStyles.regularText,
        color: AppColors.sectionText
    },
    contentSection: {
        marginTop: AppSizes.padding
    },
    changePassContainer: {
        marginTop: AppSizes.padding,
        paddingHorizontal: AppSizes.paddingMedium,
    },
    changePassButtonContainer: {
        width: '100%',
        backgroundColor: AppColors.abi_blue,
        borderWidth: AppSizes.paddingXXTiny,
        borderColor: AppColors.greySight,
        borderRadius: AppSizes.paddingXTiny,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: AppSizes.paddingXSml

    },
    textInput: {
        ...AppStyles.regularText,
        fontWeight: '400',
        opacity: 0.87,
        borderBottomWidth: AppSizes.paddingXXTiny,
        borderBottomColor: '#5c91e2',
        borderRadius: AppSizes.paddingXTiny,
        padding: AppSizes.paddingTiny,
        color: AppColors.textColor,
        fontSize: AppSizes.fontBase,
        height: AppSizes.paddingLarge * 2,
        width: 200,
        marginTop: AppSizes.paddingMedium
    },

    fingerSprintModal: {
        backgroundColor: AppColors.graytrans,
        height: AppSizes.screenHeight,
        width: AppSizes.screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: AppSizes.paddingXXXLarge * 1.5,

    },
    fingerSprintModalContainer: {
        backgroundColor: 'white',
        padding: AppSizes.paddingMedium,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: AppSizes.paddingSml,
        borderColor: AppColors.lightGrayTrans,
        borderWidth: AppSizes.paddingMicro,
    },
    doneButton: {
        marginTop: AppSizes.paddingXXXLarge,
        backgroundColor: AppColors.abi_blue,
        borderRadius: AppSizes.paddingTiny,
        width: AppSizes.paddingXXXLarge * 4,
        height: AppSizes.paddingLarge * 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default connect(state => ({
    user: state.user.user,
    i18n: state.i18n,
    isEnableFingerPrint: state.metadata.isEnableFingerPrint
}), {
    setLocale,
    changeFingerPrintSetup,
    addUserMetaData
})(UserSettingScreen);
