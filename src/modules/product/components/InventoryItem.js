import React, { Component } from 'react';
import { BackHandler, View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';

import { H1, H1M, H2 } from '../../../theme/styled';
import AppColors from '../../../theme/AppColors';
import { Icon } from 'react-native-elements'
import Divider from '../../form/components/Divider';
import AppStyles from '../../../theme/AppStyles';
import Moment from "moment/moment";
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import API from '../../../network/API';
import _ from 'lodash'
import AppSizes from '../../../theme/AppSizes';
const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'column'
    },
    productNameContain: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    productInfoDetail: {
        flexDirection: 'row',
        flex: 1
    },
    textDetail: {
        left: 4,
        right: 4
    },
    containerSpanInfo: {
        borderLeftWidth: 1,
        borderLeftColor: '#d3dfe4',
        paddingTop: 16,
        paddingBottom: 16,
        borderBottomColor: '#d3dfe4',
        borderBottomWidth: 1,
        paddingLeft: 16
    }
})
class InventoryItem extends Component {

    constructor(props) {
        super(props);
        this.inventoryItem = props.inventoryItem;
        this.state = {
            skuReference: [],
            spanable: false
        }
    }

    componentDidMount() {
        const orgId = this.props.org && this.props.org[0] ? this.props.org[0].id : undefined;

        if (this.isMultipleInven()) {
            API.inventoryReferenceApi([orgId], Moment(), this.inventoryItem.skuReference).then(res => {
                if (res && res.data && res.data) {
                    this.setState({
                        skuReference: res.data.data,
                    })
                }

            })
        }

    }
    //==================================================VIEW CONTROLL ============================================

    onClickInventory = _.throttle(() => {
        if (this.isMultipleInven()) {
            this.setState({ spanable: !this.state.spanable })
        } else {
            Actions.inventoryDetail({ inventory: this.inventoryItem });
        }
    }, 300)

    isMultipleInven() {
        return this.inventoryItem && this.inventoryItem.skuReference && this.inventoryItem.skuReference.length > 1
    }

    //==================================================VIEW RENDER ============================================

    render() {
        const quantity = this.inventoryItem.quantity
        const { sku } = this.inventoryItem
        return (
            <View style={styles.mainContainer}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => this.onClickInventory()}>
                    {this.renderInvenDetail(quantity, sku, true)}
                </TouchableOpacity>
                <View style={{ width: AppSizes.screenWidth - 32, backgroundColor: '#d3dfe4', height: 1, alignSelf: 'flex-end', marginTop: 10, }} />
                {this.state.spanable && this.renderSpanInfo()}
            </View>

        );
    }

    renderSpanInfo() {
        return <FlatList
            data={this.state.skuReference}
            renderItem={(item => this.renderSpanInfoItem(item))}
            keyExtractor={(item) => item._id}
        />
    }

    renderSpanInfoItem({ item }) {
        const quantity = item.quantity ? item.quantity : 0
        const { sku } = item
        return <TouchableOpacity onPress={() => Actions.inventoryDetail({ inventory: item })} style={styles.containerSpanInfo}>
            {this.renderInvenDetail(quantity, sku)}
        </TouchableOpacity>
    }

    renderInvenDetail(quantity, sku, showArrow) {
        return (<View>
            <View style={styles.productNameContain}>
                <Text style={H1}>{this.inventoryItem.productName}</Text>
                {this.isMultipleInven() && showArrow && <Icon
                    name={'keyboard-arrow-down'}
                    color={AppColors.spaceGrey}
                    size={AppSizes.paddingXXLarge} />}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                {this.renderInventoryInfo('view-compact', sku)}
                {this.renderInventoryInfo('insert-drive-file', quantity)}
            </View>
        </View>)
    }

    renderInventoryInfo(iconName, content) {
        return (
            <View style={[styles.productInfoDetail]}>
                <Icon
                    name={iconName}
                    size={14}
                    color={AppColors.spaceGrey}
                />
                <Text
                    style={[H2, styles.textDetail]}
                    numberOfLines={1}>
                    {content}
                </Text>
            </View>
        )
    }
}

export default connect(state => ({
    org: state.org.orgSelect,
}), {})(InventoryItem);
