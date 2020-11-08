import _ from 'lodash';
import React, { Component } from 'react';
import { ScrollView, TextInput, View } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import HeaderDetail from '../../../components/HeaderDetail';
import InputField from '../../../components/InputField';
import AppConfig from '../../../config/AppConfig';
import DynamicServerManager, { SERVER_DATA } from '../../../data/DynamicServerManager';
import API from '../../../network/API';
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
import Picker from './Picker';


const styles = {
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    labelText: {
        fontSize: AppSizes.fontSmall,
        fontWeight: '200',
        color: '#e53935'
    },
    input: {
        ...AppStyles.regularText,
        padding: 0,
        marginTop: AppSizes.paddingXSml,
        marginBottom: AppSizes.paddingXSml
    },
    containerCheckbox: {
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'white',
        marginLeft: 0,
        marginTop: AppSizes.paddingMedium,
        marginBottom: 0,
        borderRadius: 0,
        padding: 0
    },

}

const dataServer = [
    AppConfig.DEV_SERVER,
    AppConfig.TEST_SERVER,
    AppConfig.PRO_SERVER,
    AppConfig.CUSTOMIZE_SERVER,
];

const dataProtocol = [
    AppConfig.PROTOCOL_UNSECURITY,
    AppConfig.PROTOCOL,
];

class ConfigChangeServerScreen extends Component {

    onChangeServer(server) {

        const serverSelected = _.filter(SERVER_DATA, (serverData) => {
            return serverData.server === server;
        })
        const dynamicServerOld = DynamicServerManager.getDynamicServer();
        const dynamicServer = {
            ...dynamicServerOld,
            ...serverSelected[0]
        }
        this.onDoneServerConfig(dynamicServer);
        this.refs.server.closeAddModal();

    }


    onChangeProtocol(protocol) {
        const dynamicServer = {
            ...DynamicServerManager.getDynamicServer(),
            protocol
        }
        this.onDoneServerConfig(dynamicServer)
        this.refs.protocol.closeAddModal();
    }

    onChangeHost = _.debounce((host) => {
        const dynamicServer = {
            ...DynamicServerManager.getDynamicServer(),
            host
        }
        this.onDoneServerConfig(dynamicServer)
    }, 500);

    onChangeIMEI = _.debounce((imeiNumber) => {
        const dynamicServer = {
            ...DynamicServerManager.getDynamicServer(),
            imeiNumber
        }
        this.onDoneServerConfig(dynamicServer)
    }, 500);

    onChangeShowTime = () => {
        const dynamicServer = {
            ...DynamicServerManager.getDynamicServer(),
            showTimeResponse: !DynamicServerManager.getDynamicServer().showTimeResponse
        }
        this.onDoneServerConfig(dynamicServer)
    }

    onDoneServerConfig(dynamicServer) {
        DynamicServerManager.saveDynamicServer(dynamicServer).then(res => {
            API.switchServer();
            this.setState({ ...this.state });
        })
    }


    render() {
        const dynamicServer = DynamicServerManager.getDynamicServer();

        return (
            <View>
                <HeaderDetail
                    leftButtonAction={() => { Actions.pop(), this.props.onRefresh() }}
                    title='Config server'
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{
                        paddingHorizontal: AppSizes.paddingMedium,
                        paddingVertical: AppSizes.paddingXSml,
                        width: AppSizes.screenWidth,
                        backgroundColor: 'white'
                    }}>
                        <InputField
                            noLocalize
                            title={'Server'}
                            renderContent={<View style={{ marginTop: AppSizes.paddingXSml, marginBottom: AppSizes.paddingXSml, flexDirection: 'row', justifyContent: 'space-between' }}>

                                <Picker
                                    ref={'server'}
                                    onPress={(item) => this.onChangeServer(item)}
                                    data={dataServer}
                                    itemSelected={dynamicServer.server}
                                />
                                <Icon
                                    name={'keyboard-arrow-down'}
                                    size={AppSizes.paddingXXLarge}
                                    color={AppColors.abi_blue}
                                />
                            </View>} />
                        <InputField
                            noLocalize
                            title={'Server Hostname'}
                            renderContent={<TextInput
                                style={styles.input}
                                defaultValue={dynamicServer.host}
                                onChangeText={(text) => this.onChangeHost(text)}
                            />} />
                        <InputField
                            noLocalize
                            title={'Protocol'}
                            renderContent={<View style={{ marginTop: AppSizes.paddingXSml, marginBottom: AppSizes.paddingXSml, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Picker
                                    ref={'protocol'}
                                    onPress={(item) => this.onChangeProtocol(item)}
                                    data={dataProtocol}
                                    itemSelected={dynamicServer.protocol}
                                />
                                <Icon
                                    name={'keyboard-arrow-down'}
                                    size={AppSizes.paddingXXLarge}
                                    color={AppColors.abi_blue}
                                />
                            </View>} />
                        <InputField
                            noLocalize
                            title={'Imei Number'}
                            renderContent={<TextInput
                                style={styles.input}
                                defaultValue={dynamicServer.imeiNumber}
                                onChangeText={(text) => this.onChangeIMEI(text)}
                            />} />
                        <CheckBox
                            left
                            title={"Show response time"}
                            checked={dynamicServer.showTimeResponse}
                            onPress={() => this.onChangeShowTime()}
                            textStyle={[{ ...AppStyles.regularText, color: dynamicServer.showTimeResponse ? AppColors.spaceGrey : AppColors.hintText }]}
                            containerStyle={styles.containerCheckbox}
                            checkedIcon='check-circle'
                            uncheckedIcon='circle-o'
                        />
                        <View style={{ height: 200 }} />

                    </View >
                </ScrollView>
            </View>
        );
    }
}
export default ConfigChangeServerScreen
