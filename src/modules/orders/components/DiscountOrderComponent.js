
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

class DiscountOrderComponent extends Component {
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
            return !!product.discountProductInfo
        })
    }

    calculatePriceDiscount(product) {
        const discountInfo = product.discountProductInfo;
        if (discountInfo.isExchangeProduct) {
            return '+ ' + Math.round((product.actualPrice * discountInfo.discountValue) / (product.itemPrice * 100)) + ' ' + product.unit
        } else {
            return StringUtils.moneyFormat(product.actualPrice - product.discountPrice)
        }

    }

    getDiscountValueText(product) {
        const discountInfo = product.discountProductInfo;
        return '- ' + discountInfo.discountValue + '%'
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
                        <Text style={styles.secondContent} numberOfLines={1}>{this.calculatePriceDiscount(item)}</Text>
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
                extraData={this.state}
            />
            {(!this.state.productList || this.state.productList.length === 0) && <View style={{ height: 20 }} />}
        </View>)
    }
}


export default DiscountOrderComponent


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