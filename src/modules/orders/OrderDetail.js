import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderDetail from '../../components/HeaderDetail';
import InputField from './components/InputFieldBlack';
import LanguageManager, { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import AppColors from '../../theme/AppColors';
import { Actions } from 'react-native-router-flux';
import OrderInfo from '../../constant/OrderInfo';
import { H1, H2, H3 } from '../../theme/styled';
import { moneyFormat } from '../../utils/moneyFormat';
import Divider from '../form/components/Divider';
import Progress from '../../components/Progress';
import API from '../../network/API';
import eventTypes from '../../store/constant/eventTypes';
import PermissionUtils from '../../utils/PermissionUtils';
import ButtonIcon from '../../components/ButtonIcon';
import OrderControl from './OrderControl';
import StringUtils from '../../utils/StringUtils';
import AppSizes from '../../theme/AppSizes';

class ProductOrderItem extends Component {

  render() {
    return (
      <View>
        <View style={{ flexDirection: 'column', justifyContent: 'space-between', top: 8 }}>
          <Text style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>{this.props.item.productDetail}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Text style={[H2, { paddingTop: 8, paddingRight: 8, paddingBottom: 8 }]}>{Localize(messages.code)}:</Text>
            <Text style={styles.titleText}>{this.props.item.sku}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 8, marginTop: 8 }}>
          <View style={styles.item}>


            <Text style={[H2]}>{Localize(messages.case)}</Text>
            <Text style={styles.titleText}>{this.props.item.numberOfCase}</Text>


          </View>
          <View style={styles.item}>


            <Text style={[H2,]}>{Localize(messages.item)}</Text>
            <Text style={styles.titleText}>{this.props.item.numberOfItem}</Text>
          </View>
          <View style={styles.item}>


            <Text style={[H2,]}>{Localize(messages.casePrice)}</Text>
            <Text style={styles.titleText}>{moneyFormat(this.props.item.casePrice)}</Text>
          </View>
          <View style={styles.item}>


            <Text style={[H2,]}>{Localize(messages.itemPrice)} </Text>
            <Text style={styles.titleText}>{moneyFormat(this.props.item.itemPrice)}</Text>
          </View>
        </View>
        <Divider />



      </View>
    );
  }
}

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    /* state order app */
    this.state = {
      orderDetail: props.order,
    };

  }
  /**
   * COMPONENT LIFE CYCLE -------------------------------------------------------------------------------------------------
   */

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_ORDER_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.getOrderDetail(nextProps.order._id)
      }
    }
  }

  getOrderDetail(orderId) {
    Progress.show(API.orderDetail, [orderId], (res) => {
      this.setState({ orderDetail: res.data.data })
    })
  }

  renderRightViewNav() {
    const { orderDetail } = this.state;

    if (PermissionUtils.isGrantUpdateOrder(this.props.orgSelectIds[0]) && orderDetail.orderStatus == OrderInfo.ORDER_STATUS_VALUE.PENDING) {
      return <ButtonIcon
        iconName={'edit'}
        iconColor={'white'}
        iconSize={22}
        onPress={() => Actions.editCreateOrder({ orderEdit: this.state.orderDetail })}
      />
    }
    return <View />
  }

  //Status
  renderOrderStatus() {

    return <Text>{Localize(OrderInfo.STATUS_LOCALIZE[this.state.orderDetail.orderStatus])}</Text>
  }
  renderPaymentStatus() {
    return <Text>{Localize(OrderInfo.STATUS_PAYMENT_LOCALIZE[this.state.orderDetail.paymentStatus])}</Text>
  }
  renderFulfiltmentStatus() {
    return <Text>{Localize(OrderInfo.FULLFILLMENT_STATUS_LOCALIZE[this.state.orderDetail.fulfillmentStatus])}</Text>
  }

  //Delivery
  renderDeliveryOrderCode() {
    return <Text>{this.state.orderDetail.orderCode}</Text>
  }
  renderDeliveryOrderDate() {
    return <Text>{(this.state.orderDetail.deliveryDate).slice(0, 10)}</Text>
  }
  renderDeliveryFrom() {
    const { orderDetail } = this.state;
    if (!orderDetail || !orderDetail.organizationId) {
      return;
    }
    return <Text>{orderDetail.organizationId.organizationName}</Text>
  }
  renderDeliveryTo() {
    const { orderDetail } = this.state;
    if (!orderDetail || !orderDetail.customerInfo) {
      return;
    }
    return <Text>{orderDetail.customerInfo.fullName}</Text>
  }

  renderDriverName() {
    const { orderDetail } = this.state;
    let driverName = ''
    if (!orderDetail || !orderDetail.vehicleInfo || !orderDetail.vehicleInfo.defaultDriverName) {
      driverName = Localize(messages.noDriver)
    } else {
      driverName = orderDetail.vehicleInfo.defaultDriverName

    }
    return <Text>{driverName}</Text>
  }

  renderInfoOrder() {
    return (<View style={styles.orderInfoContainer}>
      <Text style={[H1, { paddingBottom: AppSizes.paddingXSml, paddingLeft: AppSizes.paddingTiny }]} >{Localize(messages.status)}</Text>
      <View style={styles.body}>
        <Text style={[H2, { paddingTop: AppSizes.paddingTiny }]}>{Localize(messages.orderStatus)}</Text>
        <InputField
          renderContent={this.renderOrderStatus()} />
        <Text style={[H2, { paddingTop: AppSizes.paddingXSml }]}>{Localize(messages.fulfiltmentStatus)}</Text>
        <InputField
          renderContent={this.renderFulfiltmentStatus()} />
      </View>
    </View>)
  }

  renderDelivery() {
    return (<View style={styles.orderInfoContainer}>
      <Text style={[H1, { paddingBottom: 8, paddingLeft: 4 }]}>{Localize(messages.delivery)}</Text>
      <View style={styles.body}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: AppSizes.paddingMedium }}>
            <Text style={[H2, { paddingTop: AppSizes.paddingTiny }]}>{Localize(messages.orderCode)}</Text>
            <InputField
              renderContent={this.renderDeliveryOrderCode()} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[H2]}>{Localize(messages.orderDate)}</Text>
            <InputField
              renderContent={this.renderDeliveryOrderDate()} />
          </View>
        </View>
        <Text style={[H2, { paddingTop: 8 }]}>{Localize(messages.from)}</Text>
        <InputField
          renderContent={this.renderDeliveryFrom()} />
        <Text style={[H2, { paddingTop: 8 }]}>{Localize(messages.to)}</Text>
        <InputField
          renderContent={this.renderDeliveryTo()} />
        <Text style={[H2, { paddingTop: 8 }]}>{Localize(messages.driverName)}</Text>
        <InputField
          renderContent={this.renderDriverName()} />

      </View>
    </View>)
  }
  renderProductOrderItem = () => {
    return (
      <View style={styles.orderInfoContainer}>
        <Text style={[H1, { paddingBottom: 8, paddingLeft: 4 }]}>{Localize(messages.productList)}</Text>
        <View style={styles.body}>
          <FlatList
            data={this.state.orderDetail.skuList}
            renderItem={({ item, index }) => {
              return (
                <ProductOrderItem item={item} index={index} />
              );
            }}
            keyExtractor={(item) => item}
          />
        </View>
      </View>
    );
  }
  renderDiscount() {
    const { skuList } = this.state.orderDetail;
    const promotionAllPrice = OrderControl.getPromotionAllPrice(skuList)
    const discountAllPrice = OrderControl.getDiscountAllPrice(skuList)

    return (
      <View style={styles.orderInfoContainer}>
        <Text style={[H1, { paddingBottom: 8, paddingLeft: 4 }]}>{Localize(messages.discount)}</Text>
        <View style={styles.body}>
          <View style={styles.discount}>
            <Text style={[H2, { paddingTop: 4 }]}>{Localize(messages.discount)}</Text>
            <Text>{StringUtils.moneyFormat(discountAllPrice)}</Text>
          </View>
          <View style={styles.discount}>
            <Text style={[H2, { paddingTop: 8 }]}>{Localize(messages.promotions)}</Text>
            <Text>{StringUtils.moneyFormat(promotionAllPrice)}</Text>
          </View>

        </View>
      </View>)
  }

  renderContent() {
    if (!this.state.orderDetail) {
      return <View />
    }
    return (<View>
      {this.renderInfoOrder()}
      {this.renderDelivery()}
      {this.renderProductOrderItem()}
      {this.renderDiscount()}
    </View>)
  }


  renderFooter() {
    if (!this.state.orderDetail) {
      return <View />
    }
    return (<View style={styles.containerFooter}>
      <Text style={{ color: 'white', fontSize: 14 }}>{Localize(messages.totalPrice)}</Text>
      <Text style={{ color: 'white', fontSize: 14 }}>{moneyFormat(this.state.orderDetail.totalPrice)}</Text>
    </View>)
  }

  render() {

    return (
      <View style={{
        flex: 1,
        backgroundColor: '#FFFFFF'
      }}>
        <HeaderDetail
          title={Localize(messages.orderDetail)}
          rightView={this.renderRightViewNav()}
        />
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          overScrollMode='always'
          backgroundColor='#f4f4f4'
        >

          {this.renderContent()}
        </ScrollView>
        {this.renderFooter()}
      </View>
    );
  }
}

export default connect(
  state => ({
    orgList: state.org.orgList,
    customerList: state.contact.customerDataOrder,
    productList: state.product.data,
    customerFillOrderEdit: state.order.customerFillOrderEdit,
    orderRole: state.org.orderRole,
    event: state.refresh.event,
    orgSelectIds: state.org.orgSelectIds,

  }), {

  }
)(OrderDetail);


const styles = StyleSheet.create({
  orderInfoContainer: {
    backgroundColor: '#f4f4f4',

    padding: 8,

  },
  containerFooter: {
    padding: 16,
    backgroundColor: AppColors.abi_blue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  body: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    borderColor: AppColors.lightgray
  },
  titleText: {
    fontSize: 14,

    paddingTop: 8,
  },
  discount: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }

})


