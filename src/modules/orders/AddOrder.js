import React, { Component } from 'react';
import { BackHandler, ScrollView, View, TextInput, findNodeHandle, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Text, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';

import HeaderDetail from '../../components/HeaderDetail';


import { callOnce } from "../../utils/callOnce";
import InputField from '../../components/InputField';
import messages from '../../constant/Messages';
import ButtonIcon from '../../components/ButtonIcon';
import ProductListOrderComponent from './components/ProductListOrderComponent'
import LanguageManager, { Localize } from '../setting/languages/LanguageManager';
import AppColors from '../../theme/AppColors';
import { Actions } from 'react-native-router-flux';
import API from '../../network/API';
import Progress from '../../components/Progress';
import { refresh } from '../../store/actions/refresh'
import eventTypes from '../../store/constant/eventTypes';
import StringUtils from '../../utils/StringUtils';
import PromisesCall from '../../components/PromisesCall';
import moment from 'moment';
import DiscountOrderComponent from './components/DiscountOrderComponent';
import PromotionOrderComponent from './components/PromotionOrderComponent';
import AppSizes from '../../theme/AppSizes';
import AppStyles from '../../theme/AppStyles';
import Divider from '../form/components/Divider';
import OrderInfo from '../../constant/OrderInfo';
import OrderControl from './OrderControl';
import _ from 'lodash'
import AlertUtils from '../../utils/AlertUtils';


class AddOrder extends Component {

  constructor(props) {
    super(props);
    this.isOrderEdit = !!props.orderEdit

    this.endDate = props.date;

    /* state order app */
    this.state = {
      orderDataDetail: {
        skuList: this.isOrderEdit ? props.orderEdit.skuList : [],
        totalPrice: this.isOrderEdit ? props.orderEdit.totalPrice : 0,
      },
      orderCodeValue: this.isOrderEdit ? props.orderEdit.orderCode : null,
      organizationSelected: this.initOrgSelect(),
      customerSelected: this.isOrderEdit ? props.orderEdit.customerInfo : null,
      pickupOrder: 0,
      saleOrderStatus: 1,
      fulfillmentStatus: 1,
      endDate: this.isOrderEdit ? new Date(props.orderEdit.deliveryDate) : new Date(),

      discountCustomerList: [],
      promotionCustomerList: [],

      isExpandedFooter: false,
      // startTime: this.isOrderEdit ? new Date(props.orderEdit.startTime) : new Date(),
      // endTime: this.isOrderEdit ? new Date(props.orderEdit.endTime) : this.initualizeEndTime(),
      startTime: this.isOrderEdit ? new Date(props.orderEdit.startTime) : null,
      endTime: this.isOrderEdit ? new Date(props.orderEdit.endTime) : null,

    };
  }

  initOrgSelect() {
    const { orgList } = this.props;
    if (this.isOrderEdit) {
      return this.props.orderEdit.organizationId
    } else if (orgList && orgList.length >= 1) {
      return orgList[0]
    }
    return null
  }

  initualizeCreateEditOrder() {
    const { organizationSelected } = this.state
    if (!organizationSelected || !organizationSelected.parentId || !organizationSelected.parentId._id) {
      return;
    }
    const initualizeTask = [
      { method: API.discountList, params: [organizationSelected.parentId._id, this.state.endDate] },
      { method: API.promotionList, params: [organizationSelected.parentId._id, this.state.endDate] },
    ]
    if (!this.isOrderEdit) {
      initualizeTask.push({ method: API.createOrderCode, params: {} })
    }
    PromisesCall.show(initualizeTask, ([discountListRes, promotionListRes, orderCodeRes]) => {
      if (orderCodeRes && orderCodeRes.data && orderCodeRes.data.data) {
        this.setState({ orderCodeValue: orderCodeRes.data.data, discountList: discountListRes.data.data, promotionList: promotionListRes.data.data })
      } else {
        this.setState({ discountList: discountListRes.data.data, promotionList: promotionListRes.data.data })
      }
    })
  }

  initualizeEndTime() {
    let endTimeParams = new Date();
    endTimeParams.setHours(endTimeParams.getHours() + 4);
    return endTimeParams
  }
  /**
   * COMPONENT LIFE CYCLE -------------------------------------------------------------------------------------------------
   */
  componentDidMount() {
    this.initualizeCreateEditOrder()
  }



  /****************************************** CALL BACK FROM SELECTION ***************************************************** */

  callBackSelectOrg = (orgSelected) => {
    if (!orgSelected || !orgSelected.parentId || !orgSelected.parentId._id) {
      this.setState({
        organizationSelected: orgSelected,
      })
      return;
    }
    const promotionDiscountTask = [
      { method: API.discountList, params: [orgSelected.parentId._id, this.state.endDate] },
      { method: API.promotionList, params: [orgSelected.parentId._id, this.state.endDate] },
    ]
    PromisesCall.show(promotionDiscountTask, ([discountListRes, promotionListRes]) => {
      this.setState({
        discountList: discountListRes.data.data,
        promotionList: promotionListRes.data.data,
        organizationSelected: orgSelected,
        customerSelected: null,
        orderDataDetail: {
          skuList: [],
          totalPrice: 0,
        }
      })
    })

  }

  callBackSelectCustomer = (customer) => {
    this.setState({
      customerSelected: customer,
    }, () => this.calculateDiscountPromotionCustomer(customer));
  }

  callBackSelectSku(sku) {
    this.onAddProduct(sku)
  }
  /****************************************** CONTROL VIEW ***************************************************** */

  onClickSelectOrg() {
    const orgSelected = this.state.organizationSelected ? this.state.organizationSelected.organizationName : '';
    const params = {
      callback: this.callBackSelectOrg.bind(this),
      selected: orgSelected,
    }
    Actions.selectOrg(params)
  }

  onClickSelectCustomer() {
    if (!this.state.organizationSelected || !this.state.organizationSelected._id) {
      AlertUtils.showWarning(messages.youNeedFillOrgFirst)

      return;
    }
    const customerSelected = this.state.customerSelected ? this.state.customerSelected.customerCode : '';
    const params = {
      callback: this.callBackSelectCustomer.bind(this),
      selected: customerSelected,
      species: undefined,
      organizationId: this.state.organizationSelected._id
    }
    Actions.selectCustomer(params)
  }

  onChangeOrderCode = (text) => {
    this.setState({ orderCodeValue: text });
  }

  onDateChange = (date) => {
    const endDateMoment = moment(date, 'DD-MM-YYYY')
    this.setState({
      endDate: endDateMoment,
    });
  }

  onTimeFrameStartChange = (time) => {
    const startTimeMoment = moment(time, 'HH:mm')

    const endTimeMoment = moment(this.state.endTime)
    if (startTimeMoment.isBefore(endTimeMoment) || !this.state.endTime) {
      this.setState({
        startTime: startTimeMoment.toDate(),
      });
    } else {

      Platform.OS === 'android' && AlertUtils.showError(messages.startMustBeforeEnd)

    }

  }

  onTimeFrameEndChange = (time) => {
    const startTimeMoment = moment(this.state.startTime)
    const endTimeMoment = moment(time, 'HH:mm')
    if (startTimeMoment.isBefore(endTimeMoment) || !this.state.startTime) {
      this.isNotValidTimeFrame = false

      this.setState({
        endTime: endTimeMoment.toDate(),
      });
    } else {
      Platform.OS === 'android' && AlertUtils.showError(messages.startMustBeforeEnd)
    }

  }

  onClickAddProduct() {
    if (!this.state.organizationSelected || !this.state.organizationSelected._id) {
      AlertUtils.showWarning(messages.youNeedFillOrgFirst)

      return;
    }
    const skuSelected = this.state.orderDataDetail.skuList;
    const params = {
      callback: this.callBackSelectSku.bind(this),
      selected: skuSelected,
      organizationId: this.state.organizationSelected._id,
      date: this.state.endDate
    }
    Actions.selectProduct(params)
  }

  getTitleNavbar() {
    if (this.isOrderEdit) {
      return Localize(messages.editOrder)
    }
    return Localize(messages.addOrder)
  }

  getRightNavTitle() {
    if (this.isOrderEdit) {
      return Localize(messages.save)
    }
    return Localize(messages.create)
  }

  onChangeDiscount = _.debounce((text, type) => {
    let { orderDataDetail } = this.state;
    orderDataDetail[type] = parseInt(text);
    this.setState({ orderDataDetail });
  }, 300);

  /****************************************** CONTROL LOGIC***************************************************** */

  /**
     * in case create order 
     * must call api to get order's code => fill to order's code field 
     */

  getPromotionInfo() {
    const orgId = this.state.organizationSelected
    Progress.show(API.discountList, [orgId._id], (promotionListRes) => {
      this.setState({ discountList: promotionListRes.data.data, })
    })
  }

  onCreateOrder = () => {
    const { orderCodeValue, organizationSelected, customerSelected } = this.state;
    const { orgConfig } = this.props
    let allowApproveOrder = orgConfig && orgConfig.configurations && orgConfig.configurations.allowApproveOrder
    if (
      orderCodeValue === null ||
      organizationSelected === null ||
      customerSelected === null ||
      this.state.orderDataDetail.skuList === null ||
      this.state.orderDataDetail.skuList.length === 0
    ) return AlertUtils.showError(messages.needToFill)


    const skuList = this.state.orderDataDetail.skuList.map(sku => {
      sku.productCode = sku.sku;
      return sku;
    });

    const isValidQualitySku = _.every(skuList, sku => {
      return sku.numberOfCase !== 0 || sku.numberOfItem !== 0
    })
    if (!isValidQualitySku) {
      AlertUtils.showError(messages.mustSelectQuanlitySku)
      return
    }

    const endDate = Moment(this.state.endDate).format('YYYY-MM-DD');
    const startDate = Moment(this.state.endDate).subtract(1, 'days').format('YYYY-MM-DD');
    let dataOrder = {

    }
    if (this.isOrderEdit) {
      dataOrder = {
        ...this.props.orderEdit,

      }
    }

    dataOrder = {
      ...dataOrder,
      pickupOrder: this.state.pickupOrder,
      oderCode: [this.state.orderCodeValue],
      data: skuList,
      orgId: this.state.organizationSelected && this.state.organizationSelected._id,
      deliveryDate: `${startDate}T17:00:00.000Z`,
      startDate: `${startDate}T17:00:00.000Z`,
      endDate: `${endDate}T16:59:00.000Z`,
      purchase: 'FALSE',
      salesCode: this.state.customerSelected && this.state.customerSelected.salesCode,
      totalPrice: OrderControl.getTotalPrice(skuList),
      VATPrice: OrderControl.getVatPrice(OrderControl.getTotalPriceBeforeVat(skuList)),
      customerCode: this.state.customerSelected && this.state.customerSelected.customerCode,

      organizationName: this.state.organizationSelected.organizationName,

      customerId: this.state.customerSelected && this.state.customerSelected._id,
      customerDiscountSecondWay: 0,
      dataSecondWay: [],
      manualTotalPrice: false,
      totalServicePriceSecondWay: 0,
      totalPriceSecondWay: 0,
      orderStatus: allowApproveOrder ? OrderInfo.ORDER_STATUS_VALUE.PENDING : OrderInfo.ORDER_STATUS_VALUE.OPEN,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      isMobile: true,
    };


    Progress.show(API.createOrder, [dataOrder], (res) => {
      if (res && res.data && res.data.data) {
        AlertUtils.showConfirm(this.isOrderEdit ? messages.editOrderSuccess : messages.createOrderSuccess, () => {
          this.props.refresh(eventTypes.REFRESH_ORDER_LIST, _.now());
          Actions.pop()
        })
      }
    }, error => {
      console.log("onCreateOrder err>>", error)
    })
  }

  onRemoveProduct(productRemove) {
    const { skuList } = this.state.orderDataDetail;
    if (productRemove._id && skuList) {
      const indexRemove = _.findIndex(skuList, (pro) => {
        return pro._id === productRemove._id;
      });

      skuList.splice(indexRemove, 1)
    }
    this.setState({
      orderDataDetail: {
        ...this.state.orderDataDetail,
        skuList
      },
    })
  }

  onChangeQuanlityProduct(skuList) {
    this.setState({
      orderDataDetail: {
        ...this.state.orderDataDetail,
        skuList
      },
    })
  }

  onAddProduct(product) {
    const discountProductInfo = this.calculateDiscountProduct(product)
    const promotionProductInfo = this.calculatePromotionProduct(product)
    const productParams = {
      ...product,
      numberOfCase: 0,
      numberOfItem: 0,
      numberOfItemDelivered: 0,
      numberOfCaseDelivered: 0,
      IMVDPromotion: 0,
      productCode: product.sku,
      productDetail: product.productName,
      serviceTime: 6,
      linePrice: 0,
      discountProductInfo,
      promotionProductInfo,
      totalPrice: 0,
      actualPrice: 0,
      discountPrice: 0,
      promotionPrice: 0
    };
    this.setState({
      orderDataDetail: {
        ...this.state.orderDataDetail,
        skuList: [...this.state.orderDataDetail.skuList, productParams]
      },
    })

  }


  /**
   * calculate discount infomation base on 
   * * * customer => get customer group and compare it to customer groupId in discount list 
   * * * product => get productId and compare it to product in discount list => display them to screen
   */
  calculateDiscountPromotionCustomer(customerSelected) {
    if (!customerSelected || (!customerSelected.groupIds && !customerSelected.customerId)) {
      this.setState({
        discountCustomerList: [],
        promotionCustomerList: []
      })
      return;
    }


    let discountCustomerList = this.state.discountList.filter(discount => {
      if (discount.customerGroupId && !discount.customerId) {
        return customerSelected.groupIds.filter(groupId => {
          return groupId._id === discount.customerGroupId._id
        }).length > 0
      }

      if (!discount.customerGroupId && discount.customerId) {
        return customerSelected._id === discount.customerId._id
      }
      return false
    })
    if (OrderControl.isHasBothCustomerGroupOrPersonal(discountCustomerList, customerSelected)) {
      discountCustomerList = discountCustomerList.filter(discount => {
        return discount.customerId && discount.customerId._id
      })
    }

    let promotionCustomerList = this.state.promotionList.filter(promotion => {
      if (promotion.customerGroupId && !promotion.customerId) {
        return customerSelected.groupIds.filter(groupId => {
          return groupId._id === promotion.customerGroupId._id
        }).length > 0
      }

      if (!promotion.customerGroupId && promotion.customerId) {
        return customerSelected._id === promotion.customerId._id
      }
      return false
    })

    this.setState({
      discountCustomerList,
      promotionCustomerList
    }, () => {
      const { skuList } = this.state.orderDataDetail;
      if (skuList && skuList.length > 0) {
        const skuListParams = skuList.map(product => {
          return {
            ...product,
            discountProductInfo: this.calculateDiscountProduct(product),
            promotionProductInfo: this.calculatePromotionProduct(product)
          }
        })
        this.setState({
          orderDataDetail: {
            ...this.state.orderDataDetail,
            skuList: skuListParams
          }
        })
      }
    })
  }

  calculateDiscountProduct(product) {
    const { discountCustomerList } = this.state
    if (!discountCustomerList || !discountCustomerList.length || discountCustomerList.length === 0) {
      return null
    }
    const discount = discountCustomerList.find(discountInfo => {
      return discountInfo.productId._id === product._id
    })
    return discount
  }

  calculatePromotionProduct(product) {
    const { promotionCustomerList } = this.state
    if (!promotionCustomerList || !promotionCustomerList.length || promotionCustomerList.length === 0) {
      return null
    }
    const promotion = promotionCustomerList.find(promotionInfo => {
      return promotionInfo.productId._id === product._id
    })
    return promotion
  }


  /**
   * RENDER------------------------------------------------------------------------------------------------------------
   */

  renderAddOrderCode() {
    return <TextInput
      onChangeText={(text) => this.onChangeOrderCode(text)}
      autoCorrect={false}
      blurOnSubmit
      autoCapitalize="none"
      placeholderTextColor={AppColors.hintText}
      placeholder={messages.order.addText}
      style={{ paddingTop: 8, paddingBottom: 8, color: AppColors.textColor }}
      value={this.state.orderCodeValue}
      underlineColorAndroid='rgba(0,0,0,0)'
      editable={false}
    />
  }

  renderSelectOrg() {
    return <TouchableOpacity style={styles.selectOrgContainer} onPress={() => { this.onClickSelectOrg() }}>

      <TextInput
        style={{ color: AppColors.textColor, fontSize: 14, height: 40, width: '80%' }}
        pointerEvents="none"
        editable={false}
        autoCapitalize='none'
        autoCorrect={false}
        underlineColorAndroid='transparent'
        placeholder={messages.select}
        placeholderTextColor={AppColors.textSecondary}
        value={this.state.organizationSelected && this.state.organizationSelected.organizationName}
      />
      <Icon name='md-arrow-dropdown' size={16} />
    </TouchableOpacity>
  }

  renderSelectCustomer() {
    return <TouchableOpacity style={styles.selectOrgContainer} onPress={() => { this.onClickSelectCustomer() }}>
      <TextInput
        style={{ color: AppColors.textColor, fontSize: 14, height: 40, width: '80%' }}
        pointerEvents="none"
        editable={false}
        autoCapitalize='none'
        autoCorrect={false}
        underlineColorAndroid='transparent'
        placeholder={Localize(messages.select)}
        placeholderTextColor={AppColors.textSecondary}
        value={this.state.customerSelected && this.state.customerSelected.fullName}
      />
      <Icon name='md-arrow-dropdown' size={16} />
    </TouchableOpacity>
  }

  renderSelectSaleDate() {
    return <View style={styles.selectOrgContainer}>
      <View style={{ flexDirection: 'row' }}>
        <Icon name='ios-calendar' size={16} />
        <DatePicker
          date={this.state.endDate}
          mode="date"
          placeholder="select date"
          format="DD-MM-YYYY"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => this.onDateChange(date)}
          customStyles={styles.customStylesDatePicker}
        />
      </View>

      <Icon name='md-arrow-dropdown' size={16} />
    </View>
  }

  renderTimeFrame() {
    return <View style={styles.selectOrgContainer}>
      <View style={{ flexDirection: 'row' }}>
        <Icon name='ios-calendar' size={16} />
        <DatePicker
          date={this.state.startTime}
          mode="time"
          placeholder={Localize(messages.startTimeFrame)}
          format="HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => this.onTimeFrameStartChange(date)}
          is24Hour
          customStyles={styles.customStylesTimerPicker}
        />
        <Icon name='md-arrow-dropright' size={16} />

        <DatePicker
          date={this.state.endTime}
          mode="time"
          placeholder={Localize(messages.endTimeFrame)}

          format="HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => this.onTimeFrameEndChange(date)}
          is24Hour
          customStyles={styles.customStylesTimerPicker}

        />

      </View>

    </View>
  }

  renderInfoOrder() {
    return (<View style={styles.orderInfoContainer}>
      <InputField
        title={messages.orderCode}
        renderContent={this.renderAddOrderCode()} />

      <InputField
        title={messages.organization}
        renderContent={this.renderSelectOrg()} />

      <InputField
        title={messages.customer}
        renderContent={this.renderSelectCustomer()} />

      <InputField
        title={messages.salseOrderDate}
        renderContent={this.renderSelectSaleDate()} />

      <InputField
        title={messages.timeFrame}
        renderContent={this.renderTimeFrame()} />

    </View>)
  }

  renderProductsInfo() {
    return (<View>
      <View style={styles.sectionContainer}>
        <Text style={{ color: 'white', fontSize: 16 }}>{Localize(messages.product)}</Text>
        <ButtonIcon
          containerStyle={{ width: 24, height: 24 }}
          iconName='add' iconSize={24}
          iconColor={'white'}
          onPress={() => this.onClickAddProduct()} />
      </View>


      <ProductListOrderComponent
        ref={"productListOrder"}
        orderDataDetail={this.state.orderDataDetail}
        onRemoveProduct={(product) => this.onRemoveProduct(product)}
        onAddQuantityProduct={(skuList) => this.onChangeQuanlityProduct(skuList)}
      />


    </View>)
  }

  renderContent() {

    return (<View>
      {this.renderInfoOrder()}
      {this.renderProductsInfo()}
      {this.renderDiscountInfo()}
      {this.renderPromotion()}
    </View>)
  }

  renderDiscountInfo() {
    return (<View>
      <View style={[styles.sectionContainer,]}>
        <Text style={{ color: 'white', fontSize: 16 }}>{Localize(messages.discount)}</Text>
      </View>
      <DiscountOrderComponent
        productList={this.state.orderDataDetail.skuList}
      />

    </View>
    )
  }

  renderPromotion() {
    return <View>
      <View style={[styles.sectionContainer,]}>
        <Text style={{ color: 'white', fontSize: 16 }}>{Localize(messages.promotions)}</Text>
      </View>
      <PromotionOrderComponent
        productList={this.state.orderDataDetail.skuList}
      />
    </View>
  }

  renderPriceOrderInfo(skuList) {
    const promotionAllPrice = OrderControl.getPromotionAllPrice(skuList)
    const discountAllPrice = OrderControl.getDiscountAllPrice(skuList)
    const totalPriceBeforeVat = OrderControl.getTotalPriceBeforeVat(skuList)
    const vatPrice = OrderControl.getVatPrice(totalPriceBeforeVat)
    return <View style={[styles.containerInfoPrice, { height: this.state.isExpandedFooter ? 100 : 0 }]}>
      <View style={styles.infoPromotionPrice}>
        <Text style={styles.textTitle}>{Localize(messages.discount)}</Text>
        <Text style={styles.textContent}>{StringUtils.moneyFormat(discountAllPrice)}</Text>
      </View>
      <View style={styles.infoPromotionPrice}>
        <Text style={styles.textTitle} >{Localize(messages.promotions)}</Text>
        <Text style={styles.textContent}>{StringUtils.moneyFormat(promotionAllPrice)}</Text>
      </View>

      <Divider />
      <View style={[styles.infoPromotionPrice, { marginTop: AppSizes.paddingSml }]}>
        <Text style={styles.textTitle} >{Localize(messages.vat)}</Text>
        <Text style={styles.textContent}>{StringUtils.moneyFormat(vatPrice)}</Text>
      </View>
    </View>
  }
  renderFooter() {
    const { skuList } = this.state.orderDataDetail
    return (<View style={[styles.containerFooter, { height: !this.state.isExpandedFooter ? AppSizes.paddingLarge * 2 : AppSizes.screenHeight }]}>
      {this.state.isExpandedFooter && this.renderPriceOrderInfo(skuList)}
      <TouchableOpacity
        onPress={() => this.setState({ isExpandedFooter: !this.state.isExpandedFooter })}
        style={[styles.controlFooter,]}>
        <Text style={{ color: 'white', fontSize: 14, }}>{Localize(messages.totalPrice)}</Text>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{ color: 'white', fontSize: 14 }}>{StringUtils.moneyFormat(OrderControl.getTotalPrice(skuList))}</Text>
          <Icon
            name={this.state.isExpandedFooter ? 'md-arrow-dropdown' : 'md-arrow-dropup'}
            color={'white'}
            size={24}
            style={{ marginLeft: AppSizes.paddingXSml }}
          />
        </View>
      </TouchableOpacity>
    </View >)
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <HeaderDetail
          title={this.getTitleNavbar()}
          rightButtonAction={callOnce(() => this.onCreateOrder())}
          rightButtonTitle={this.getRightNavTitle()}
        />

        <ScrollView
          keyboardShouldPersistTaps={'always'}
          overScrollMode='always'
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
    orgConfig: state.user.orgConfig,
  }), {
  refresh
}
)(AddOrder);


const styles = {
  orderInfoContainer: {
    backgroundColor: 'white',
    paddingRight: AppSizes.paddingMedium,
    paddingLeft: AppSizes.paddingMedium
  },
  selectOrgContainer: {
    paddingTop: AppSizes.paddingXSml,
    paddingBottom: AppSizes.paddingXSml,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: AppSizes.paddingLarge * 2
  },
  hintText: {
    color: AppColors.hintText,
    fontSize: AppSizes.fontBase
  },
  sectionContainer: {
    padding: AppSizes.paddingMedium,
    backgroundColor: AppColors.abi_blue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  containerFooter: {
    backgroundColor: AppColors.graytrans,
    width: '100%',
    justifyContent: 'flex-end',
    borderTopWidth: AppSizes.paddingMicro,
    borderColor: AppColors.lightgray,
    position: 'absolute',
    bottom: 0,
  },
  containerDescription: {
    height: AppSizes.paddingLarge * 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  controlFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: AppSizes.paddingMedium,
    paddingVertical: AppSizes.paddingXSml,
    backgroundColor: AppColors.orange,

  },
  containerInfoPrice: {
    width: '100%',
    backgroundColor: AppColors.white,
    marginBottom: AppSizes.paddingXXLarge * 2,
    paddingHorizontal: AppSizes.paddingMedium,
    paddingVertical: AppSizes.paddingXSml,
  },
  infoPromotionPrice: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppSizes.paddingSml
  },
  textTitle: {
    ...AppStyles.regularText,
    color: AppColors.abi_blue,
  },
  textContent: {
    ...AppStyles.regularText,
    color: AppColors.sectionText
  },
  customStylesTimerPicker: {
    dateInput: {
      borderWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: AppSizes.paddingXSml,
      height: AppSizes.paddingXMedium,
      padding: 0,
      margin: 0
    },
    dateText: {
      fontSize: AppSizes.fontBase,
      color: AppColors.textColor,
    },
    dateTouchBody: {
      height: AppSizes.paddingXMedium
    }
  },
  customStylesDatePicker: {
    dateInput: {
      borderWidth: 0,
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginLeft: AppSizes.paddingXSml,
      height: AppSizes.paddingXMedium,
      padding: 0,
      margin: 0
    },
    dateText: {
      fontSize: AppSizes.fontBase,
      color: AppColors.textColor,
    },
    dateTouchBody: {
      height: AppSizes.paddingXMedium
    }
  },


}


