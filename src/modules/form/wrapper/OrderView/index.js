import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import Order from './components/Order';

import { addForm } from "../../actions/creater/form";
import OrgHelper from '../../../../utils/OrgUtils';
import OrderInfo from '../../../../constant/OrderInfo';
import { moneyFormat } from '../../../../utils/moneyFormat';

class OrdersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: null,
      text: this.props.defaultValues && this.props.defaultValues.lenth > 0 && this.props.defaultValues[0].amountCollected,
      value: null,
      reason: null,
      reasonDescription: this.props.defaultValues && this.props.defaultValues.lenth > 0 && this.props.defaultValues[0].reasonDescription,
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount = () => {
    this.constructOrder()
  }

  constructOrder() {
    if (this.props.defaultValues) {
      const orderSource = this.props.defaultValues;
      const orderList = orderSource.map(order => {
        let orderResult = { ...order }
        if (order.status === null || order.status === undefined) {
          this.isSetDefault = true;
          orderResult = { ...order, status: OrderInfo.ORDER_STATUS.COMPLETED, amountCollected: this.getCollectedDefault(order) }
        }
        if (this.isSecondWay(order)) {
          if (order.statusSecondWay === null || order.statusSecondWay === undefined) {
            this.isSetDefault = true;

            return { ...orderResult, statusSecondWay: OrderInfo.ORDER_STATUS.COMPLETED, amountCollectedSecondWay: this.getCollectedDefault(order, true) }
          }
        }
        return orderResult
      })
      this.setState({ orderList });
      if (this.isSetDefault) {
        this.props.addForm(this.props, orderList);

      }
    }

  }
  getCollectedDefault(order, isSecondWay) {
    if (OrgHelper.isOutsourcingOrg())
      return 0;
    if (isSecondWay) {
      return order.amountCollectedSecondWay ? order.amountCollectedSecondWay : moneyFormat(order.totalPriceSecondWay);
    }
    return order.amountCollected ? order.amountCollected : moneyFormat(order.totalPrice);
  }


  onChange(option, orderListId, SKU_ID) {
    const orderList = this.state.orderList.map(order => {
      if (order._id === orderListId) {
        this.SumSKUPrice = 0;
        const skuList = order.skuList.map(sku => {
          if (sku.sku + sku.lotNumber === SKU_ID) {
            const casePrice = option[0] * sku.casePrice;
            const itemPrice = option[1] * sku.itemPrice;
            const SKUPrice = casePrice + itemPrice;
            this.SumSKUPrice += SKUPrice;
            return {
              ...sku,
              numberOfCaseDelivered: option[0],
              numberOfItemDelivered: option[1],
              SKUPrice,
            };
          }
          this.SumSKUPrice += sku.SKUPrice;
          return sku;
        });
        return { ...order, skuList, totalPrice2: this.SumSKUPrice };
      }
      return order;
    });
    this.props.addForm(this.props, orderList);
    this.setState({ orderList });
  }

  changeTotalPrice = (text, indexSource) => {

    const orderList = this.state.orderList.map((order, index) => {
      if (indexSource === index) {
        /**
         * with orgs that hase transport's type is oursourcing, passNumberCollected, 
         * in that case, this is habeco and keep in kospa 
         */
        if (OrgHelper.isOutsourcingOrg())
          return { ...order, numberCollected: text }
        else {
          return { ...order, amountCollected: text };
        }
      }
      return order;
    });
    this.props.addForm(this.props, orderList);
    this.setState({ orderList });
  }

  changeReason = (value, orderIndex) => {
    const orderList = this.state.orderList.map((order, index) => {
      if (orderIndex === index) {
        return { ...order, reason: value };
      }
      return order;
    });
    this.props.addForm(this.props, orderList);
    this.setState({ orderList });
  }
  changeReasonOther = (reasonDescription, indexSource) => {

    const orderList = this.state.orderList.map((order, index) => {
      if (indexSource === index) {
        /**
         * with orgs that hase transport's type is oursourcing, passNumberCollected, 
         * in that case, this is habeco and keep in kospa 
         */
        if (OrgHelper.isOutsourcingOrg())
          return { ...order, reasonDescription: reasonDescription }
        else {
          return { ...order, reasonDescription: reasonDescription };
        }
      }
      return order;
    });
    this.props.addForm(this.props, orderList);
    this.setState({ orderList });
  }

  changeStatus = (status, orderIndex) => {
    const orderList = this.state.orderList.map((order, index) => {
      if (orderIndex === index) {
        const numberCollectedOrder = this.calculateNumberCollectedOrder(order, status)
        return { ...numberCollectedOrder, status };
      }
      return order;
    });
    this.setState({ orderList });
    this.props.addForm(this.props, orderList);
  }

  calculateNumberCollectedOrder(orderSource, statusOrder) {
    if (statusOrder === OrderInfo.ORDER_STATUS.COMPLETED) {
      orderSource.numberCollected = 0;
      orderSource.amountCollected = moneyFormat(orderSource.totalPrice);
    } else {
      orderSource.numberCollected = 0;
      orderSource.amountCollected = 0;
    }
    return orderSource;

  }

  /**
   * ****************************************************SECOND WAY ****************************************************
   */

  isSecondWay(order) {
    return order && order.assignedTransporter && order.assignedTransporter.info && order.assignedTransporter.info.type === OrderInfo.TYPE_TRANSPORTER.TWO_WAYS
  }

  getOrderSecondWay(order) {
    return {
      ...order,
      skuList: order.skuListSecondWay,
      totalPrice: order.totalPriceSecondWay,
      status: order.statusSecondWay,
      reason: order.reasonSecondWay,
      amountCollected: order.amountCollectedSecondWay,
      numberCollected: order.numberCollectedSecondWay,
    }
  }

  onChangeSecondWay(option, orderListId, SKU_ID) {
    const orderList = this.state.orderList.map(order => {
      if (order._id === orderListId) {
        this.SumSKUPrice = 0;
        const skuList = order.skuListSecondWay.map(sku => {
          if (sku.sku + sku.lotNumber === SKU_ID) {
            const casePrice = option[0] * sku.casePrice;
            const itemPrice = option[1] * sku.itemPrice;
            const SKUPrice = casePrice + itemPrice;
            this.SumSKUPrice += SKUPrice;
            return {
              ...sku,
              numberOfCaseDelivered: option[0],
              numberOfItemDelivered: option[1],
              SKUPrice,
            };
          }
          this.SumSKUPrice += sku.SKUPrice;
          return sku;
        });
        return { ...order, skuListSecondWay: skuList, totalPriceSecondWay: this.SumSKUPrice };
      }
      return order;
    });
    this.props.addForm(this.props, orderList);
    this.setState({ orderList });
  }

  changeTotalPriceSecondWay = (text, indexSource) => {

    const orderList = this.state.orderList.map((order, index) => {
      if (indexSource === index) {
        /**
         * with orgs that hase transport's type is oursourcing, passNumberCollected, 
         * in that case, this is habeco and keep in kospa 
         */
        if (OrgHelper.isOutsourcingOrg())
          return { ...order, numberCollectedSecondWay: text }
        else {
          return { ...order, amountCollectedSecondWay: text };
        }
      }
      return order;
    });
    this.props.addForm(this.props, orderList);
    this.setState({ orderList });
  }

  changeReasonSecondWay = (value, orderIndex) => {
    const orderList = this.state.orderList.map((order, index) => {
      if (orderIndex === index) {
        return { ...order, reasonSecondWay: value };
      }
      return order;
    });
    this.props.addForm(this.props, orderList);
    this.setState({ orderList });
  }

  changeStatusSecondWay = (statusSecondWay, orderIndex) => {
    const orderList = this.state.orderList.map((order, index) => {
      if (orderIndex === index) {
        const numberCollectedOrder = this.calculateNumberCollectedSecondWay(order, statusSecondWay)
        return { ...numberCollectedOrder, statusSecondWay };
      }
      return order;
    });
    this.setState({ orderList });
    this.props.addForm(this.props, orderList);
  }

  calculateNumberCollectedSecondWay(orderSource, statusOrder) {
    if (statusOrder === OrderInfo.ORDER_STATUS.COMPLETED) {
      orderSource.numberCollectedSecondWay = 0;
      orderSource.amountCollectedSecondWay = moneyFormat(orderSource.totalPriceSecondWay);
    } else {
      orderSource.numberCollectedSecondWay = 0;
      orderSource.amountCollectedSecondWay = 0;
    }
    return orderSource;

  }
  render() {
    return (
      <View style={{ backgroundColor: 'white' }} >
        {
          this.state.orderList && this.state.orderList.map((order, orderIndex) => {

            return <View >
              <Order
                {...this.props}
                key={orderIndex}
                index={orderIndex}
                item={order}
                onChange={(option, orderListId, SKU_ID) => this.onChange(option, orderListId, SKU_ID)}
                changeStatus={(status, index) => this.changeStatus(status, index)}
                changeTotalPrice={(text, index) => this.changeTotalPrice(text, index)}
                changeReason={(value, index) => this.changeReason(value, index)}
                changeReasonOther={(reasonDescription, index) => this.changeReasonOther(reasonDescription, index)}
                isOpenPanel={this.state.orderList && this.state.orderList.length === 1}
              />

              {order && this.isSecondWay(order) && <Order
                {...this.props}
                key={orderIndex}
                index={orderIndex}
                item={this.getOrderSecondWay(order)}
                onChange={(option, orderListId, SKU_ID) => this.onChangeSecondWay(option, orderListId, SKU_ID)}
                changeStatus={(status, index) => this.changeStatusSecondWay(status, index)}
                changeTotalPrice={(text, index) => this.changeTotalPriceSecondWay(text, index)}
                changeReason={(value, index) => this.changeReasonSecondWay(value, index)}
                isOpenPanel={this.state.orderList && this.state.orderList.length === 1}
              />}
            </View>
          }
          )
        }


      </View >
    );
  }
}

export default connect(state => ({}), { addForm })(OrdersView);
