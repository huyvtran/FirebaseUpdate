import React, { Component, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';


import AppSizes from '../../../../theme/AppSizes';
import AppColors from '../../../../theme/AppColors';
import AppStyles from '../../../../theme/AppStyles';
import { Localize } from '../../../setting/languages/LanguageManager';
import messages from '../../../../constant/Messages';
import { CardTitle, PanelStyleView } from '../../../../theme/styled';
import { Panel } from '..';
import OrderProductItem from '../OrderView/components/OrderProductItem';
import ProductItemView from './ProductItemView';
import { CheckBox } from 'react-native-elements'
import Divider from '../../components/Divider';
import OrderInfo from '../../../../constant/OrderInfo';
import { Actions } from 'react-native-router-flux';

const styles = {
    deliveryContainer: {
        paddingVertical: AppSizes.paddingMedium,
        backgroundColor: 'white'
    },
    containerCheckbox: {
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'white',
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 0
    },
    titleCheckbox: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
        color: '#212121'
    },
    reasonContainer: {
        paddingHorizontal: AppSizes.paddingSml,
        paddingBottom: AppSizes.paddingSml
    }
}

const DELIVERY_LIST = [
    {
        key: messages.completed,
        content: messages.completed,
        value: OrderInfo.ORDER_STATUS.COMPLETED

    },
    {
        key: messages.partlyDeliver,
        content: messages.partlyDeliver,
        value: OrderInfo.ORDER_STATUS.PARTLY_DELIVERY


    },
    {
        key: messages.redundant,
        content: messages.redundant,
        value: OrderInfo.ORDER_STATUS.REDUDANT
    },
    {
        key: messages.notCompleted,
        content: messages.notCompleted,
        value: OrderInfo.ORDER_STATUS.NOT_COMPLETE
    }
]


const OrderDepotItemView = (props) => {
    const { order } = props

    const callBackSelectReason = (itemSelected) => {
        const orderResult = {
            ...order,
            reason: itemSelected
        }
        props.onChangeOrder(orderResult)
    }

    const calculateWeightOfAllPros = (productList) => {
        let totalWeight = 0

        if (!productList || productList.length === 0) {
            return totalWeight;
        }

        productList.forEach(product => {
            totalWeight += parseFloat(product.weight)
        });

        return totalWeight
    }
    const onSelectDeliveryResult = (deliveryStatus) => {
        const orderResult = {
            ...order,
            status: deliveryStatus
        }
        props.onChangeOrder(orderResult)
    }

    const onSelectOverLoad = () => {
        const orderResult = {
            ...order,
            overLoad: !order.overLoad
        }
        props.onChangeOrder(orderResult)
    }

    const onClickSelectReason = () => {
        Actions.selectReason({ callback: callBackSelectReason, selected: order.reason })
    }

    const renderDeliveryStatus = () => {
        return <View style={styles.deliveryContainer}>
            {DELIVERY_LIST.map(deliveryStatus => {
                return (<CheckBox
                    left
                    title={Localize(deliveryStatus.content)}
                    checked={deliveryStatus.value === order.status}
                    onPress={() => { onSelectDeliveryResult(deliveryStatus.value) }}
                    textStyle={styles.titleCheckbox}
                    containerStyle={styles.containerCheckbox}
                    checkedIcon='check-circle'
                    uncheckedIcon='circle-o'
                />)
            })}
            {order.status === OrderInfo.ORDER_STATUS.NOT_COMPLETE && <TouchableOpacity style={styles.reasonContainer} onPress={() => onClickSelectReason()} >
                <Text style={styles.titleCheckbox}>{order && order.reason ? order.reason.message : Localize(messages.selectReason)}</Text>
            </TouchableOpacity>}
        </View>
    }
    if (!order) {
        return <View />
    }
    return (<Panel title={Localize(messages.orderCode) + `:  ${order.orderCode}`} >
        <View style={{ backgroundColor: '#EAEBEB', width: '100%', paddingHorizontal: AppSizes.paddingXSml, paddingVertical: AppSizes.paddingSml, marginTop: AppSizes.paddingXXSml }}>
            <Text style={{ ...AppStyles.regularText, fontSize: 16, color: '#646464', fontWeight: '500' }}>{Localize(messages.productList)}</Text>
        </View>
        <View style={styles.orderInfo}>

            {order.skuList && order.skuList.map((product, index) => (
                <ProductItemView
                    product={product}
                />
            ))}
        </View>

        <View style={{ backgroundColor: '#EAEBEB', width: '100%', paddingBottom: AppSizes.paddingXSml, paddingHorizontal: AppSizes.paddingXSml, paddingVertical: AppSizes.paddingSml, justifyContent: 'space-between', flexDirection: 'row' }}>
            <Text style={{ ...AppStyles.regularText, fontSize: 16, color: '#646464', fontWeight: '500' }}>{Localize(messages.totalWeight)}</Text>
            <Text style={{ ...AppStyles.regularText, fontSize: 16, color: '#646464', fontWeight: '500' }}>{calculateWeightOfAllPros(order.skuList) + ' ' + messages.Kg}</Text>
        </View>



        <View style={{ backgroundColor: '#EAEBEB', width: '100%', paddingHorizontal: AppSizes.paddingXSml, paddingVertical: AppSizes.paddingSml, marginTop: AppSizes.paddingXXSml }}>
            <Text style={{ ...AppStyles.regularText, fontSize: 16, color: '#646464', fontWeight: '500' }}>{Localize(messages.deliveryResult)}</Text>
        </View>
        {renderDeliveryStatus()}
        <Divider />
        <CheckBox
            left
            title={Localize(messages.overLoad)}
            checked={order.overLoad}
            onPress={() => { onSelectOverLoad() }}
            textStyle={styles.titleCheckbox}
            containerStyle={styles.containerCheckbox}
            checkedIcon='check-circle'
            uncheckedIcon='circle-o'
        />
    </Panel>
    );
}

export default OrderDepotItemView
