import React, { Component } from 'react';

import {
    View, StyleSheet, Text, Image, TouchableOpacity, Dimensions
} from 'react-native';
import AppColors from '../../../../theme/AppColors';
import { Icon } from 'react-native-elements';
import messages from '../../../../constant/Messages';
import LanguageManager, { Localize } from '../../../setting/languages/LanguageManager';
import AppSizes from '../../../../theme/AppSizes';
import AppStyles from '../../../../theme/AppStyles';
// import { RNCamera } from 'react-native-camera';
import { Actions } from 'react-native-router-flux';
import _ from "lodash"

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },

});

class QRScanScreen extends Component {

    constructor(props) {
        super(props);


    }

    onBarCodeRead = (scanResult) => {
        const { onQRCodeRead } = this.props
        if (scanResult && !_.isEmpty(scanResult.data)) {
            onQRCodeRead && onQRCodeRead(scanResult.data)
            Actions.pop()
        }

    }

    render() {
        return (
            <View style={styles.container}>
                {/* <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}

                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    onBarCodeRead={this.onBarCodeRead.bind(this)}
                >
                    {({ camera, status, recordAudioPermissionStatus }) => {
                        if (status !== 'READY') return <View />;
                        return (
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity style={styles.capture}>
                                    <Icon name='center-focus-strong' color='#5c91e2' />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                </RNCamera> */}
            </View>
        );
    }


}

// export default SignatureView;
export default QRScanScreen