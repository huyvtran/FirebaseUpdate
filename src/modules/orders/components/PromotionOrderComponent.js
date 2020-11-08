
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
import AppStyles from '../../../theme/AppStyles';
import AppSizes from '../../../theme/AppSizes';
import OrderInfo from '../../../constant/OrderInfo';

class PromotionOrderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productList: this.filterProductPromotionList(props.productList),
        };
    }
    componentWillReceiveProps(newsProp) {
        this.setState({ productList: this.filterProductPromotionList(newsProp.productList) })
    }
    filterProductPromotionList(productList) {
        return productList.filter(product => {
            return !!product.promotionProductInfo
        })
    }

    calculatePricePromotion(product) {
        const promotionInfo = product.promotionProductInfo;
        if (promotionInfo.salesOffType === OrderInfo.PROMOTION_TYPE.CHANGE_PRODUCT) {
            const quantityItems = product.numberOfCase * product.numberPerCase + product.numberOfItem
            const quantity = Math.floor((quantityItems * promotionInfo.presentQty) / promotionInfo.productQty)
            return '+ ' + quantity + ' ' + promotionInfo.presentId.productName
        } else {
            return StringUtils.moneyFormat(product.actualPrice - product.promotionPrice - product.discountPrice)
        }

    }

    getDiscountValueText(product) {
        const promotionInfo = product.promotionProductInfo;

        if (promotionInfo.salesOffType === OrderInfo.PROMOTION_TYPE.CHANGE_PRODUCT) {
            return Localize(messages.buy) + ' ' + promotionInfo.productQty + ' ' + Localize(messages.give) + ' ' + promotionInfo.presentQty
        }
        return '- ' + promotionInfo.salesOffValue + '%'
    }

    renderItem(item) {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.itemContentContainer}>
                        <Text style={styles.productName} numberOfLines={1}>{item.productDetail}</Text>
                        <Text style={styles.discountText} numberOfLines={1}>{this.getDiscountValueText(item)}</Text>
                    </View>
                    <View style={[styles.itemContentContainer, { marginTop: AppSizes.paddingXSml, marginBottom: AppSizes.paddingXSml }]}>
                        <Text style={styles.secondContent} numberOfLines={1}>{item.sku}</Text>
                        <Text style={styles.secondContent} numberOfLines={1}>{this.calculatePricePromotion(item)}</Text>
                    </View>
                </View>
                <Divider />
            </View>
        )
    }


    render() {
        return (<View>
            <FlatList
                data={this.state.productList}
                keyExtractor={item => item._id}
                renderItem={({ item }) => this.renderItem(item)}
            />
            <View style={{ height: 50 }} />
        </View>)
    }
}


export default PromotionOrderComponent


const styles = StyleSheet.create({
    container: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8
    },
    itemContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    productName: {
        ...AppStyles.regularText,
        color: AppColors.sectionText,
        flex: 8
    },
    secondContent: {
        ...AppStyles.regularText,
        color: AppColors.hintText
    },
    discountText: {
        ...AppStyles.regularText,
        color: AppColors.red,
        flex: 2,
        textAlign: 'right'

    }

})