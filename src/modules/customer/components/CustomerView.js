import React, { Component } from 'react';
import { Linking, NativeModules, Platform, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { translateText } from '../../setting/languages/components/translate';
import RowDetail from '../../product/components/RowDetail';
import { H1, PanelStyle, colors } from '../../../theme/styled';
import TranslateText from '../../setting/languages/components/TranslateText';
import messages from '../../../constant/Messages';
import LanguageManager, { Localize } from '../../setting/languages/LanguageManager';
import _ from 'lodash';
import { isDeliveryTask } from '../../task/helper/FunctionHelper';
import AppConfig from '../../../config/AppConfig';
import TaskCode from '../../../constant/TaskCode';
import { Actions } from 'react-native-router-flux';
// import ActionSheet from 'react-native-actionsheet'
import StringeeManager from '../../../components/stringee/StringeeManager';
const { RNFloatWidget } = NativeModules;


const styles = {
    container: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: 'white'
    }
};

class CustomerView extends Component {
    startNavigation(url) {
        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log(`Don't know how to open URI: ${url}`);
                }
            });
    }

    _onPressButton(address) {
        this.startNavigation(`google.navigation:q=${address}&mode=` + 'd');
    }

    _onPressIos(address) {
        this.startNavigation(`https://www.google.com/maps/dir/?api=1&origin=&destination=${address}&travelmode=driving`);
        Platform.OS === 'android' && AppConfig.isEnableFloatWidget && RNFloatWidget.start();
    }

    getProductName() {
        const { products } = this.props;
        if (!products || products.length == 0) {
            return null;
        }
        let productName = '';
        _.forEach(products, product => {
            if (!_.isEmpty(product.productName)) {
                productName += product.productName + ' ';
            }

            if (!_.isEmpty(product.ShipmentUnitId)) {
                productName += product.ContainerNumber + ' ';
            }
        });

        return productName;
    }

    getPanelTitle = (customer, taskActionCode) => {
        let title = Localize(messages.customerName);
        if (taskActionCode === TaskCode.SOAN_HANG || taskActionCode === TaskCode.HET_NGAY) {
            title = Localize(messages.wareHouse);
        }
        return title + `: ${customer.fullName}`;
    };

    onClickChatIcon = () => {
        const { orderList } = this.props;
        const order = orderList?.[0] ?? null;
        Actions.customerChat({ order });
    };

    onCallCustomer = (customer) => {
        Linking.openURL(`tel:${customer.mobileNumber}`)
        // this.ActionSheet.show()
    }

    onActionsCallToCustomer = (index, customer) => {
        switch (index) {
            case 0:
                Linking.openURL(`tel:${customer.mobileNumber}`)
                return;
            case 1:
                Actions.makeCall({ mobileNumber: customer.mobileNumber })


        }
    }
    render() {
        let { customer } = this.props;

        const taskActionCode = this.props.taskActionCode;

        let productTitle = messages.products;
        if (customer.SourceId || customer.DestinationId) {
            customer = (customer.SourceId && customer.SourceId.LocationName) ? customer.SourceId : customer.DestinationId;
            productTitle = messages.container;
        }
        if (!customer) return <View />;

        const customerLatlng = customer.coordinate ? (customer.coordinate.latitude + ', ' + customer.coordinate.longitude) : customer.streetAddress;

        return (
            <View style={styles.container}>
                <View style={{
                    ...PanelStyle,
                    backgroundColor: '#5c91e2'
                }}>
                    <Text
                        style={[H1, { color: 'white' }]}>{this.getPanelTitle(customer, taskActionCode)}</Text>
                </View>
                <RowDetail
                    i1={<TranslateText value={messages.address} />}
                    i2={customer.streetAddress || customer.LocationName}
                    icon='directions'
                    onPress={() => this._onPressIos(customerLatlng)}
                />
                {!_.isEmpty(customer.mobileNumber) && <RowDetail
                    i1={<TranslateText value={messages.phoneNumber} />}
                    i2={customer.mobileNumber}
                    icon='call'
                    onPress={() => this.onCallCustomer(customer)}
                />}

                {AppConfig.DEV_MODE && <RowDetail
                    i1={<TranslateText value={messages.chat} />}
                    i2={"Chat with customer"}
                    icon='chat'
                    onPress={() => this.onClickChatIcon()}
                />}

                {!isDeliveryTask(taskActionCode) && <RowDetail
                    i1={<TranslateText value={productTitle} />}
                    i2={this.getProductName()}
                />}
                {!_.isEmpty(this.props.description) && !isDeliveryTask(taskActionCode) && <RowDetail
                    i1={<TranslateText value={messages.description} />}
                    i2={this.props.description}
                />}

                {/* <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={Localize(messages.wouldYouLikeToChooseCall)}
                    options={[Localize(messages.default), Localize(messages.stringeeApp), Localize(messages.cancel)]}
                    cancelButtonIndex={2}
                    destructiveButtonIndex={2}
                    onPress={(index) => this.onActionsCallToCustomer(index, customer)}
                /> */}
            </View>
        );
    }
}


export default connect(state => ({ taskActionCode: state.task.taskDetail.task.taskAction.taskActionCode, }), null)(CustomerView);
