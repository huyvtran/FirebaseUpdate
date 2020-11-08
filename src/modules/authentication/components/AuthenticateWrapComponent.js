import React, { Component, useState, useEffect, memo, useMemo, useCallback } from 'react';

import { Image, ScrollView, StatusBar, Text, View, Keyboard, LayoutAnimation, SafeAreaView } from 'react-native';
import AppSizes from "../../../theme/AppSizes";
import AppConfig from "../../../config/AppConfig";
import DeviceInfo from "react-native-device-info";
import AppColors from "../../../theme/AppColors";
import TestID from "../../../../test/constant/TestID";
import { useKeyBoardStatus } from '../../../components/customhook/KeyboardDevice';

const VersionCodeView = memo(() => {
    return (<View style={styles.containerVersion}>
        <Text
            style={styles.textVersion}>{AppConfig.APP_NAME + ` ${DeviceInfo.getVersion()} - ${DeviceInfo.getBuildNumber()}${AppConfig.VERSION_MODE}`}</Text>
    </View>);
});
const AuthenticateWrapComponent = (props) => {
    const { isKeyboardShow, heightKeyboard } = useKeyBoardStatus(true);
    console.log("ABIVIN Hook track " + "render authentication wrap")

    return <View style={styles.container}>
        <StatusBar hidden={true} />
        <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
            <View testID={TestID.signInScreen} style={styles.contentContainer}>

                <View style={styles.headerBackgroundAuthenticate} />

                <View style={styles.logoContainer}>
                    <Image
                        resizeMode={'contain'}
                        source={AppConfig.APP_ICON}
                        style={{ width: '80%', height: AppSizes.screenHeight * 0.15 }}
                    />
                </View>
                <View style={styles.mainContentContainer}>
                    {props.children}
                </View>
                {isKeyboardShow && <View style={{
                    height: heightKeyboard,
                    backgroundColor: 'white'
                }} />}
            </View>
        </ScrollView>
        {!props.hideVersion && <VersionCodeView />}
    </View>;
};

const styles = {
    container: {
        height: AppSizes.screenHeight,
        width: AppSizes.screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    containerVersion: {
        position: 'absolute',
        bottom: AppSizes.paddingLarge + AppSizes.paddingXSml
    },
    textVersion: {
        fontSize: AppSizes.fontSmall,
        backgroundColor: 'transparent',
        color: AppColors.abi_blue
    },
    contentContainer: {
        height: '100%',
        width: AppSizes.screenWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },

    headerBackgroundAuthenticate: {
        height: AppSizes.screenHeight / 3,
        backgroundColor: AppColors.abi_blue,
        width: AppSizes.screenWidth,
        position: 'absolute',
        zIndex: -1,
        top: 0
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        paddingVertical: AppSizes.screenHeight * 0.01
    },
    mainContentContainer: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
        marginTop: AppSizes.paddingMedium
    }
};
export default AuthenticateWrapComponent;