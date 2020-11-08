import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ModalPicker from '../../../../../components/modalnumberpicker';

import { TableContent, H2 } from '../../../../../theme/styled';

import { moneyFormat } from "../../../../../utils/moneyFormat";
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import AppColors from '../../../../../theme/AppColors';
import AppStyles from '../../../../../theme/AppStyles';
import messages from '../../../../../constant/Messages';
import { Localize } from '../../../../../modules/setting/languages/LanguageManager';
import Divider from '../../../components/Divider';
import AppSizes from '../../../../../theme/AppSizes';
import OrderInfo from '../../../../../constant/OrderInfo';


const styles = StyleSheet.create({
  container: {
    paddingLeft: AppSizes.paddingMedium,
    paddingRight: AppSizes.paddingMedium,
    backgroundColor: 'white',
    marginTop: AppSizes.paddingXSml, marginBottom: AppSizes.paddingXSml
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    height: AppSizes.paddingMedium,
    width: AppSizes.paddingMedium
  }
})
class OrderProductItem extends Component {
  constructor(props) {
    super();

    this.state = {
      selectedValue: null,
      isModalVisible: true,
      option: [props.numberOfCaseDelivered, props.numberOfItemDelivered],
    };
  }

  async onChange(option, orderListId, SKU_ID) {
    await this.setState({
      option,
    });
    await this.props.onChange(option, orderListId, SKU_ID);
  }


  getActualQuantity() {
    const { statusSelected, numberOfCaseActual, numberOfItemActual, numberOfCaseDelivered, numberOfItemDelivered, numberOfCase, numberOfItem } = this.props
    let numberOfCaseDisplay = 0
    let numberOfItemDisplay = 0
    switch (statusSelected) {
      case OrderInfo.ORDER_STATUS.PARTLY_DELIVERY:
        numberOfCaseDisplay = numberOfCaseDelivered
        numberOfItemDisplay = numberOfItemDelivered
        break;
      case OrderInfo.ORDER_STATUS.COMPLETED:
        numberOfCaseDisplay = (numberOfCaseActual !== undefined && numberOfCaseActual !== null) ? numberOfCaseActual : numberOfCase
        numberOfItemDisplay = numberOfItemActual !== undefined && numberOfItemActual !== null ? numberOfItemActual : numberOfItem
        break;
      case OrderInfo.ORDER_STATUS.NOT_COMPLETE:
        numberOfCaseDisplay = 0
        numberOfItemDisplay = 0
        break;
    }

    return Localize(messages.actual) + ': ' + numberOfCaseDisplay + ' | ' + numberOfItemDisplay
  }

  getSkuPrice(orderItem) {
    const planPrice = (orderItem.numberOfCase * orderItem.casePrice + orderItem.numberOfItem * orderItem.itemPrice)
    return this.props.statusSelected === OrderInfo.ORDER_STATUS.PARTLY_DELIVERY ? moneyFormat(orderItem.SKUPrice) : moneyFormat(planPrice)
  }

  render() {
    const { ...orderItem } = this.props;

    const { numberOfCaseActual, numberOfItemActual, numberOfCase, numberOfItem, numberOfCaseDelivered, numberOfItemDelivered } = this.props
    const data = (numberOfCaseActual !== undefined && numberOfItemActual !== undefined && numberOfCaseActual !== null && numberOfItemActual !== null) ? [numberOfCaseActual, numberOfItemActual] : [numberOfCase, numberOfItem];

    const label = [Localize(messages.numberOfCase), Localize(messages.numberOfItems)];
    return (
      <View style={styles.container}>
        <View style={[styles.containerHeader, { width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7 }]}>
          <Text
            numberOfLines={3}
            ellipsizeMode='tail'
            style={[H2, { width: '60%' }]}
          >
            {orderItem.productDetail}
          </Text>
          <Text style={[H2,]}>{this.getSkuPrice(orderItem)}</Text>

        </View>

        <View style={[styles.containerHeader, { marginTop: AppSizes.paddingXMedium, width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7, }]}>
          <Text style={[TableContent, { flex: 1, width: '100%', justifyContent: 'flex-start', marginLeft: 0 }]} >{Localize(messages.plan) + ': ' + orderItem.numberOfCase + ' | ' + orderItem.numberOfItem}</Text>

          <ModalPicker
            style={[{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', width: '100%' }, this.props.statusSelected === 1 && { backgroundColor: '#FFF9C4' }]}
            disabled={this.props.statusSelected !== 1}
            data={data}
            onChange={(option) => this.onChange(option, orderItem.orderListId, orderItem.sku + orderItem.lotNumber)}
            numberPerCase={orderItem.numberPerCase}
            label={label}
            initValue={[numberOfCaseDelivered, numberOfItemDelivered]}
          >
            <Text style={[{
              width: '100%',
              justifyContent: 'flex-end',
              textAlign: 'right',
              marginRight: 0,
              fontSize: AppSizes.fontSmall,
              color: AppColors.spaceGrey,
              fontWeight: '400',
              opacity: 0.87,
            }]} >{this.getActualQuantity(orderItem)}</Text>

          </ModalPicker>
        </View>

        <Divider style={{ width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7, marginTop: AppSizes.paddingXXSml }} />

      </View>
    )
  }

}

export default OrderProductItem;
