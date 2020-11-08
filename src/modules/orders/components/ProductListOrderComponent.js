
import React, {
    Component,
} from 'react';
import {
    View,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet, Text
} from 'react-native';
import messages from '../../../constant/Messages';
import ButtonIcon from '../../../components/ButtonIcon';
import { Icon } from 'react-native-elements'
import ProductHelper from '../../product/components/ProductHelper'
import Divider from '../../form/components/Divider';
import { connect } from 'react-redux';
import AppColors from '../../../theme/AppColors';
import StringUtils from '../../../utils/StringUtils';
import { Localize } from '../../setting/languages/LanguageManager';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash'

class ProductListOrderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderData: props.orderDataDetail,
        };
    }
    componentWillReceiveProps(newsProp) {
        this.setState({ orderData: newsProp.orderDataDetail })
    }

    onRemoveProduct(product) {
        this.props.onRemoveProduct && this.props.onRemoveProduct(product);
    }

    renderItem(item) {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.productName}>{item.sku}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.productName}>{StringUtils.moneyFormat(item.casePrice) + messages.vnd}</Text>
                        <ButtonIcon
                            iconName={'delete'}
                            iconColor={AppColors.hintText}
                            containerStyle={{ width: 20, height: 20, marginLeft: 4 }}
                            iconSize={20}
                            style={'outline'}
                            onPress={() => { this.onRemoveProduct(item) }} />
                    </View>
                </View>
                <View style={styles.containerBody}>
                    {this.renderItemBody('dashboard', item.volume)}
                    {this.renderItemBody('event-note', item.sku)}
                    {this.renderItemBody('list', ProductHelper.temperature[item.temperature])}

                </View>
                <View style={styles.containerBody}>
                    <View style={styles.containerFooterItem}>
                        <Text style={styles.productName}>{Localize(messages.case)}</Text>
                        <QuantityView
                            quantity={item.numberOfCase}
                            onChangeQuantity={(quantity) => this.onChangeCasesQuantity(quantity, item)} />
                    </View>
                    <View style={styles.containerFooterItem}>
                        <Text style={styles.productName}>{Localize(messages.item)}</Text>
                        <QuantityView
                            quantity={item.numberOfItem}

                            onChangeQuantity={(quantity) => this.onChangeItemsQuantity(quantity, item)} />
                    </View>
                </View>
                <Divider />
            </View>
        )
    }
    onChangeCasesQuantity(quantity, item) {
        const { skuList } = this.state.orderData;
        const index = _.findIndex(skuList, sku => {
            return sku._id === item._id;
        })
        // skuList[index].numberOfCase = quantity;
        const sku = skuList[index];
        const actualPrice = quantity * sku.casePrice + sku.itemPrice * sku.numberOfItem;

        const discountPrice = this.calculateDiscountValue(actualPrice, sku.discountProductInfo);
        const promotionPrice = this.calculatePromotionValue(actualPrice - discountPrice, sku.promotionProductInfo);
        const totalPrice = actualPrice - discountPrice - promotionPrice;
        skuList[index] = {
            ...skuList[index],
            numberOfCase: quantity,
            actualPrice,
            discountPrice,
            promotionPrice,
            totalPrice
        }
        this.props.onAddQuantityProduct(skuList);
    }

    onChangeItemsQuantity(quantity, item) {
        const { skuList } = this.state.orderData;
        const index = _.findIndex(skuList, sku => {
            return sku._id === item._id;
        })

        const sku = skuList[index];
        const actualPrice = sku.numberOfCase * sku.casePrice + sku.itemPrice * quantity;
        const discountPrice = this.calculateDiscountValue(actualPrice, sku.discountProductInfo);
        const promotionPrice = this.calculatePromotionValue(actualPrice - discountPrice, sku.promotionProductInfo);

        const totalPrice = actualPrice - discountPrice - promotionPrice;

        skuList[index] = {
            ...skuList[index],
            numberOfItem: quantity,
            actualPrice,
            discountPrice,
            promotionPrice,
            totalPrice
        }
        this.props.onAddQuantityProduct(skuList);
    }

    calculateDiscountValue(actualPrice, discountInfo) {
        if (discountInfo && !discountInfo.isExchangeProduct && discountInfo.discountValue) {
            return (actualPrice * discountInfo.discountValue) / 100
        }
        return 0
    }

    calculatePromotionValue(afterDiscountPrice, promotionInfo) {
        if (promotionInfo && promotionInfo.salesOffValue) {
            return (promotionInfo.salesOffValue * afterDiscountPrice) / 100
        }
        return 0
    }

    renderItemBody(iconName, value) {
        return <View style={styles.itemBody}>
            <Icon name={iconName} color={AppColors.abi_blue} size={16} />
            <Text style={{ fontSize: 12, color: AppColors.abi_blue, left: 6 }}>{value}</Text>
        </View>
    }

    getTotalAmount() {
        let totalAmount = 0;
        const { orderData } = this.state;
        if (!orderData || !orderData.skuList || orderData.skuList.length == 0)
            return totalAmount;

        orderData.skuList.forEach(sku => {
            totalAmount += sku.casePrice * sku.numberOfCase + sku.itemPrice * sku.numberOfItem;
        })
        return totalAmount;
    }

    render() {
        const { skuList } = this.state.orderData
        return (<View>
            {skuList && skuList.length > 0 && <FlatList
                data={skuList}
                keyExtractor={item => item._id}
                renderItem={({ item }) => this.renderItem(item)}
            />}
            <Divider />
            <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <Text style={{ fontSize: 14, color: AppColors.abi_blue }}>{Localize(messages.totalPrice)}</Text>
                <Text style={{ fontSize: 14, color: AppColors.abi_blue }}>{StringUtils.moneyFormat(this.getTotalAmount())}</Text>
            </View>
        </View>)
    }
}


export default ProductListOrderComponent


class QuantityView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: props.quantity ? props.quantity : 0,
        };
    }

    onClickMinus() {
        if (this.state.quantity == 0)
            return;
        this.setState({
            quantity: this.state.quantity - 1
        }, () => {
            this.props.onChangeQuantity(this.state.quantity)
        })

    }

    onClickAdd() {
        this.setState({
            quantity: this.state.quantity + 1
        }, () => {
            this.props.onChangeQuantity(this.state.quantity)
        })
    }

    onCallbackQuantity = (text) => {
        this.setState({
            quantity: parseInt(text)
        }, () => {
            this.props.onChangeQuantity(this.state.quantity)
        })
    }

    onClickInputQuantity() {
        Actions.inputData({ keyboardType: 'numeric', hintText: Localize(messages.enter), onCallBackValue: (text) => this.onCallbackQuantity(text) })
    }
    render() {
        const { product } = this.props;
        return (<View style={styles.containerQuantity}>

            <ButtonIcon
                containerStyle={{ flex: 1, height: '100%', backgroundColor: AppColors.separator }}
                iconName={'remove'}
                iconColor={AppColors.abi_blue}
                onPress={() => { this.onClickMinus() }}
            />
            <TouchableOpacity onPress={() => { this.onClickInputQuantity() }}>
                <Text style={styles.quantityInput}>{this.state.quantity}</Text>
            </TouchableOpacity>
            <ButtonIcon
                containerStyle={{ flex: 1, height: '100%', backgroundColor: AppColors.separator }}
                iconName={'add'}
                iconColor={AppColors.abi_blue}
                onPress={() => { this.onClickAdd() }}
            />
        </View>)
    }
}
const styles = StyleSheet.create({
    container: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    productName: {
        fontSize: 14,
        color: AppColors.textColor
    },
    containerBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 8
    },
    itemBody: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerFooterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    containerQuantity: {
        flexDirection: 'row',
        borderColor: AppColors.separator,
        borderWidth: 0.5,
        margin: 8,
        backgroundColor: 'white'
    },
    quantityInput: {
        fontSize: 14,
        color: AppColors.textColor,
        padding: 8,
        backgroundColor: 'white',
    }
})