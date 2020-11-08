import React, { Component } from 'react';

import AppColors from '../../../theme/AppColors';
import Divider from '../../form/components/Divider';
import { Dimensions, Platform, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import AppStyles from '../../../theme/AppStyles';
import LanguageManager, { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import OrderInfo from '../../../constant/OrderInfo';
import { connect } from 'react-redux';
import Moment from 'moment';
import { H1M, H1 } from '../../../theme/styled';
import AppSizes from '../../../theme/AppSizes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingRight: 16,
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: 'white'
    },

    productInfo: {
        justifyContent: 'space-between',
        marginTop: 16,
        flexDirection: 'row',
        width: AppSizes.screenWidth - 32,
        backgroundColor: 'white'
    },
    productInfoDetail: {
        flexDirection: 'row',
        flex: 1
    },
    textDetail: {
        color: AppColors.spaceGrey, 
        fontWeight: '400',
        left: 4,
        right: 4
    }

})

class InventoryOrderItem extends Component {
    renderOrderInfoDetail(iconName, content) {
        return <View style={{ flexDirection: 'row', flex: 1 }}>
            <Icon
                name={iconName}
                size={14}
                color={AppColors.spaceGrey}
            />
            <Text
                style={[H1, styles.textDetail]}
                numberOfLines={1}>
                {content}
            </Text>
        </View>
    }


    render() {
        const { order, onPress } = this.props;
        const orderType = order.purchase ? Localize(messages.sale_orders) : Localize(messages.sale_orders)
        return (<TouchableOpacity onPress={onPress && onPress} style={styles.mainContainer}>
            <Text style={H1} numberOfLines={1}>{orderType}</Text>
            <View style={styles.productInfo}>
                {this.renderOrderInfoDetail('view-compact', order.taxCode)}
                {this.renderOrderInfoDetail('flag', OrderInfo.STATUS[order.orderStatus])}
            </View>
            <View style={styles.productInfo}>
                {this.renderOrderInfoDetail('date-range', Moment(order.createdAt).format('DD/MM/YYYY'))}
                {this.renderOrderInfoDetail('insert-drive-file', OrderInfo.STATUS[order.orderStatus])}
            </View>
            <Divider
                style={{ width: AppSizes.screenWidth - 32, marginTop: 16 }}
            />
        </TouchableOpacity>)
    }
}

export default connect(state => ({
}), {})(InventoryOrderItem);
