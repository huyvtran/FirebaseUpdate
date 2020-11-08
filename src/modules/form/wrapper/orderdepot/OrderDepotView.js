import React, { Component, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';


import { addForm } from "../../actions/creater/form";
import OrderDepotItemView from './OrderDepotItemView';
const OrderDepotView = (props) => {
    const [orderList, setOrderList] = useState(props.defaultValues)

    useEffect(() => {
        props.addForm(props, orderList)
    }, [orderList])

    const onChangeOrder = (orderOld, orderChanged) => {
        const orderResult = orderList.map(order => {
            if (order._id === orderOld._id) {
                return orderChanged
            }
            return order
        })
        setOrderList(orderResult)
    }
    return (
        <View style={{ backgroundColor: 'white' }} >
            {
                orderList && orderList.map((order, orderIndex) => {

                    return <OrderDepotItemView
                        order={order}
                        onChangeOrder={(orderChanged) => onChangeOrder(order, orderChanged)}
                    />
                }
                )
            }
        </View >
    );
}
export default connect(state => ({}), { addForm })(OrderDepotView);
