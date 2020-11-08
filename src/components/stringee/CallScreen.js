import React, { Component } from 'react';
import { StatusBar, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Icon } from 'react-native-elements';
// import Pulse from "react-native-pulse";
import AppSizes from '../../theme/AppSizes';
import AppColors from '../../theme/AppColors';
import AppStyles from '../../theme/AppStyles';
import { Localize } from '../../modules/setting/languages/LanguageManager';
import Messages from '../../constant/Messages';
import { Actions } from 'react-native-router-flux';
import StringeeManager from './StringeeManager';
import AlertUtils from '../../utils/AlertUtils';
import PermissionUtils from '../../utils/PermissionUtils';

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: AppSizes.paddingMedium,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'space-around',
        height: AppSizes.screenHeight,
        width: AppSizes.screenWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: AppColors.abi_blue
    },
    button: {
        width: 50,
        height: 50,
        backgroundColor: '#69C767',
        borderRadius: 25,
        justifyContent: 'center'
    },
    callingText: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontMedium,
        color: AppColors.white,
        marginTop: AppSizes.paddingXMedium
    },
    pulseImage: {
        width: 108,
        height: 108,
        borderRadius: 58,
        position: 'absolute',
        alignSelf: 'center',
        top: 46
    },
    controlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
        alignItems: 'flex-end',
        paddingBottom: "17%",
        alignSelf: 'stretch'
    }
});

class CallScreen extends Component {

    componentDidMount() {
        this.onCheckMicroPhonePermission()

    }
    onCheckMicroPhonePermission() {
        PermissionUtils.checkMicroPhonePermission().then(res => {
            if (res !== PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
                AlertUtils.showError(Messages.notGrantedMicro)
            } else {
                this.onMakeCall()
            }
        })
    }
    onMakeCall() {
        const { mobileNumber } = this.props
        StringeeManager.makeCallAppToPhone(mobileNumber, (response) => {
            if (!response.status) {
                AlertUtils.showError(Messages.cannotMakeThisCall)
                Actions.pop()
            }
        })
    }
    onCancelCall() {
        Actions.pop();
    }

    render() {
        return (
            <View style={styles.linearGradient}>
                <View style={{ alignItems: 'center', flexBasis: "55%", justifyContent: 'flex-end' }}>
                    <View>
                        {/* <Pulse
                            style={{ justifyContent: 'center', position: 'relative', alignItems: 'center' }}
                            color='white'
                            numPulses={3}
                            diameter={200}
                            speed={20}
                            duration={2000}
                            initialDiameter={150}
                            image={{
                                source: {
                                    uri:
                                        'https://i.ytimg.com/vi/SQJrYw1QvSQ/maxresdefault.jpg',
                                },
                                style: styles.pulseImage
                            }}
                        /> */}
                    </View>

                    <Text style={styles.callingText}>{Localize(Messages.calling) + ' ...'}</Text>
                </View>
                <View style={styles.controlContainer}>
                    {/* <TouchableOpacity style={styles.button}>
                        <Icon type={"font-awesome"} name={"phone"} size={23} color={AppColors.white} />
                    </TouchableOpacity> */}
                    <TouchableOpacity style={[styles.button, { backgroundColor: AppColors.red }]}
                        onPress={() => { this.onCancelCall() }}>
                        <Icon type={"material-community"} name={"phone-hangup"} size={23} color={AppColors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default CallScreen;
