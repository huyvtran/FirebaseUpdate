import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import OrderInfoItem from './OrderInfoItem';
import Panel from '../../Panel';
import OrderProductItem from './OrderProductItem';
import { PanelStyleView, CardTitle } from '../../../../../theme/styled';

import { moneyFormat, moneyFormat2 } from "../../../../../utils/moneyFormat";
import { addForm } from "../../../actions/creater/form";
import { Localize } from '../../../../setting/languages/LanguageManager';
import messages from '../../../../../constant/Messages';
import { CheckBox } from 'react-native-elements';
import AppStyles from '../../../../../theme/AppStyles';
import AppColors from '../../../../../theme/AppColors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';
import OrgConfig from '../../../../../constant/OrgConfig';
import OrgHelper from '../../../../../utils/OrgUtils';
import OrderInfo from '../../../../../constant/OrderInfo';
import AppSizes from '../../../../../theme/AppSizes';
import _ from 'lodash';
import OrderProductLotNumberItem from './OrderProductLotNumberItem';
import TestID from "../../../../../../test/constant/TestID";
import InputField from "../../../../../components/InputField";

const REASON_OTHER_EN = 'Other Reason';
const REASON_OTHER_VN = 'Lý do khác';


const styles = StyleSheet.create({
  sectionText: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontBase,
    fontWeight: 'normal',
    color: 'grey'
  },
  containerCheckbox: {
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'white',
    marginLeft: 0,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 0
  },
  fullfilmentContainer: {
    width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7,
    padding: AppSizes.paddingTiny,
    backgroundColor: 'white',
    borderColor: AppColors.hintText,
    borderWidth: 1,
    borderRadius: AppSizes.paddingXSml,
    shadowColor: AppColors.hintText,
    shadowOffset: {
      width: AppSizes.paddingSml,
      height: AppSizes.paddingSml,
    },
  },
  additionalCheckBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: AppSizes.paddingXLarge * 2,
    paddingRight: AppSizes.paddingLarge,
    alignItems: 'center',
  },
  orderInfo: {
    paddingTop: AppSizes.paddingXSml,
    paddingBottom: AppSizes.paddingXSml
  },
  reasonOther: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingLeft: AppSizes.paddingXLarge * 2,

    paddingTop: AppSizes.paddingXSml,
    paddingBottom: AppSizes.paddingXSml,
    alignItems: 'center',
  },
  remarkContentContainer: {
    paddingLeft: AppSizes.paddingMedium,
    backgroundColor: 'white',
    paddingVertical: AppSizes.paddingMedium,
    width: AppSizes.screenWidth - AppSizes.paddingXXSml * 7,
    padding: AppSizes.paddingTiny,
    borderColor: AppColors.hintText,
    borderWidth: 1,
    borderRadius: AppSizes.paddingXSml,
    shadowColor: AppColors.hintText,
    shadowOffset: {
      width: AppSizes.paddingSml,
      height: AppSizes.paddingSml,
    },
    margin: AppSizes.paddingMedium
  }
});

class Order extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.statusOrder = OrgHelper.hidePartlyDelivery() ? OrderInfo.STATUS_ORDER_UN_PARTLY : OrderInfo.ORDER_STATUS_LOCALE;
  }

  state = {
    orderList: this.props.item,
    text: this.getCollectedDefault(this.props.item),
    textTotal: this.getCollectedDefaultPartlyDelivery(this.props.item),
    value: null,
    statusSelected: this.props.item.status,
    reason: this.props.item.reason,
    reasonDescription: this.getReasonDescription(this.props.item),
  };

  componentWillReceiveProps(newProps) {
    if (newProps.item.status !== this.props.item.status) {
      this.setState({
        orderList: newProps.item,
        text: this.getCollectedDefault(newProps.item),
        textTotal: this.getCollectedDefaultPartlyDelivery(newProps.item),
        statusSelected: newProps.item.status,
        reason: newProps.item.reason,
        reasonDescription: this.props.reasonDescription,
      });
    }
  }


  getCollectedDefault(order) {
    if (OrgHelper.isOutsourcingOrg()) {
      return order.numberCollected ? order.numberCollected : '0';
    }

    return order.amountCollected ? order.amountCollected : '0';
  }

  getCollectedDefaultPartlyDelivery(order) {
    if (OrgHelper.isOutsourcingOrg()) {
      return order.numberCollected ? order.numberCollected : '0';
    }

    return order.amountCollected && order.status === OrderInfo.ORDER_STATUS.PARTLY_DELIVERY ? order.amountCollected : '0';
  }

  getReasonDescription(order) {


    return order.reasonDescription ? order.reasonDescription : '';
  }

  onChange(option, orderListId, SKU_ID) {
    this.props.onChange(option, orderListId, SKU_ID);
  }

  changeTotalPrice = (text, i2) => {
    const textResult = text.replace(/\D/g, '');
    const _text = moneyFormat2(textResult);
    this.props.changeTotalPrice(_text, i2);
    this.setState({ text: _text });
  };
  changeTotalPricePartlyDelivery = (textTotal, i2) => {
    const textResult = textTotal.replace(/\D/g, '');
    const _text = moneyFormat2(textResult);
    this.props.changeTotalPrice(_text, i2);
    this.setState({ textTotal: _text });
  };
  changeReasonOther = (reasonDescription, i2) => {
    const _text = (reasonDescription);
    this.props.changeReasonOther(_text, i2);
    this.setState({ reasonDescription: _text });
  };

  changeStatus = (i1, i) => {
    this.props.changeStatus(i1, i);
    // this.setState({ statusSelected: i1,  });
  };

  getActualPriceSku = (sku) => {
    if (!sku) {
      return 0;
    }
    const { numberOfCaseActual, casePrice, numberOfItemActual, itemPrice } = sku;
    return numberOfCaseActual * casePrice + numberOfItemActual * itemPrice;
  };

  getDeliveredPriceSku = (sku) => {
    if (!sku) {
      return 0;
    }
    const { numberOfCaseDelivered, casePrice, numberOfItemDelivered, itemPrice } = sku;
    return numberOfCaseDelivered * casePrice + numberOfItemDelivered * itemPrice;
  };

  initTotalPrice() {
    let sum = 0;
    const order = this.props.item;

    this.props.item.skuList.forEach(sku => {
      switch (order.status) {
        case OrderInfo.ORDER_STATUS.COMPLETED:
          sum += this.getActualPriceSku(sku);
          break;
        case OrderInfo.ORDER_STATUS.PARTLY_DELIVERY:
          sum += this.getDeliveredPriceSku(sku);
          break;

        case OrderInfo.ORDER_STATUS.NOT_COMPLETE:
          sum = 0;
          break;
      }
    });
    const receivedTotalPrice = this.receivedTotalPrice(sum);
    return {
      sum,
      receivedTotalPrice
    };
  }

  _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

  _renderButton = (text, i1, onPress) => (
    <TouchableOpacity
      style={{
        // backgroundColor: 'red',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#ddd',
      }}
      key={i1}
      onPress={onPress}
    >
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: AppSizes.paddingMedium,
        marginBottom: AppSizes.paddingMedium,
        width: '100%',
      }}
      >
        <Text style={{
          fontSize: AppSizes.fontXMedium,
          fontWeight: '400'
        }}>{text}</Text>
      </View>
    </TouchableOpacity>
  );

  receivedTotalPrice(totalPrice) {
    const { promotionDiscount, customerDiscount, IMVDPromotion, saleDiscount } = this.props.item;
    return totalPrice - promotionDiscount - customerDiscount - IMVDPromotion - saleDiscount;
  }

  callBackSelectReason(item) {
    this.props.changeReason(item, this.props.index);
    this.setState({ reason: item });
  }

  onClickItemStatus(statusSelected, index) {

    this.props.changeStatus(statusSelected, index);
    this.setState({ statusSelected });
  }

  onClickSelectReason(item) {
    Actions.selectReason({
      callback: this.callBackSelectReason.bind(this),
      selected: this.state.reason
    }, item);
  }

  isShowAdditionalCheckbox(key) {
    return !OrgHelper.hideNumberCollected() || key === OrderInfo.ORDER_STATUS.NOT_COMPLETE;
  }

  isLotnumberDisplay = () => {
    const lotNumberDisplay = this?.props?.properties?.lotNumberDisplay ?? null;
    return lotNumberDisplay === "true";
  };

  isCancelOrder = (order) => {
    return !order || order.orderStatus == OrderInfo.ORDER_STATUS_VALUE.CANCELED
  }

  renderCheckboxStatus(title, key, onPress) {
    const isChecked = this.state.statusSelected === key;
    return (
      <View>
        <CheckBox
          left
          title={title}
          checked={isChecked}
          onPress={onPress && onPress}
          textStyle={[styles.sectionText, { color: isChecked ? AppColors.spaceGrey : AppColors.hintText }]}
          containerStyle={styles.containerCheckbox}
          checkedIcon='check-circle'
          uncheckedIcon='circle-o'
        />
        {this.isShowAdditionalCheckbox(key) && this.renderAdditionalCheckbox(isChecked, key)}
      </View>
    );

  }

  renderReason() {
    return (
      <TouchableOpacity style={styles.additionalCheckBox}
        onPress={() => this.onClickSelectReason()}>

        <TextInput
          pointerEvents="none"
          editable={false}
          style={{
            ...AppStyles.regularText,
            flex: 1,
            color: AppColors.spaceGrey,
          }}
          autoCapitalize='none'
          autoCorrect={false}
          underlineColorAndroid='transparent'
          placeholder={Localize(messages.selectReason)}
          placeholderTextColor={AppColors.textSecondary}
          value={this.state.reason ? this.state.reason.message : ''}
        />


        <FontAwesome
          name={'caret-down'}
          size={AppSizes.paddingMedium}
          color={AppColors.spaceGrey}
          style={{ left: AppSizes.paddingTiny }}
        />
      </TouchableOpacity>

    );
  }

  renderReasonOther() {
    return (
      <View>

        <TouchableOpacity style={styles.additionalCheckBox}
          onPress={() => this.onClickSelectReason()}>

          <TextInput
            pointerEvents="none"
            editable={false}
            style={{
              ...AppStyles.regularText,
              flex: 1,
              color: AppColors.spaceGrey,
            }}
            autoCapitalize='none'
            autoCorrect={false}
            underlineColorAndroid='transparent'
            placeholder={Localize(messages.selectReason)}
            placeholderTextColor={AppColors.textSecondary}
            value={this.state.reason ? this.state.reason.message : ''}
          />
          <FontAwesome
            name={'caret-down'}
            size={AppSizes.paddingMedium}
            color={AppColors.spaceGrey}
            style={{ left: AppSizes.paddingTiny }}
          />


        </TouchableOpacity>


        <View style={styles.reasonOther}>
          <TextInput
            onChangeText={(reasonDescription) => this.changeReasonOther(reasonDescription, this.props.index)}
            value={this.state.reasonDescription}
            placeholder={Localize(messages.reasonDescription)}
            keyboardType='default'
            style={{
              ...AppStyles.regularText,
              fontWeight: '500',
              color: AppColors.spaceGrey,
              width: AppSizes.screenWidth - 15 * AppSizes.paddingSml
            }}
            maxLength={100}
            multiline={true}

          />
        </View>

      </View>


    );


  }


  renderAdditionalCheckbox(isChecked, key) {
    const { orgConfig } = this.props;
    if (isChecked) {

      if (key === OrderInfo.ORDER_STATUS.COMPLETED) {
        /**
         * with orgs have transport's type that is oursourcing, hide price text field,
         * in that case, this is habeco and keep in kospa
         */
        if (orgConfig.configurations.typeTransportation === OrgConfig.TYPE_TRANSPORT.OUTSOURCING && key == OrderInfo.ORDER_STATUS.COMPLETED) {
          return null;
        }

        return (<View style={styles.additionalCheckBox}>
          <Text style={{
            ...AppStyles.regularText,
            fontWeight: '400',
            color: AppColors.spaceGrey,
          }}
          >{Localize(messages.collected)}</Text>
          <TextInput
            onChangeText={(text) => this.changeTotalPrice(text, this.props.index)}
            value={this.state.text}
            placeholder={Localize(messages.enterAmount)}
            keyboardType={Platform.OS === 'ios' ? 'numeric' : 'phone-pad'}

            style={{
              ...AppStyles.regularText,
              fontWeight: '500',
              color: AppColors.spaceGrey,
              textAlign: 'right'
            }}
          />
        </View>);
      } else if (key === OrderInfo.ORDER_STATUS.PARTLY_DELIVERY) {
        if (orgConfig.configurations.typeTransportation === OrgConfig.TYPE_TRANSPORT.OUTSOURCING && key == OrderInfo.ORDER_STATUS.COMPLETED) {
          return null;
        }

        return (<View style={styles.additionalCheckBox}>
          <Text style={{
            ...AppStyles.regularText,
            fontWeight: '400',
            color: AppColors.spaceGrey,
          }}
          >{Localize(messages.collected)}</Text>
          <TextInput
            onChangeText={(textTotal) => this.changeTotalPricePartlyDelivery(textTotal, this.props.index)}
            value={this.state.textTotal}
            placeholder={Localize(messages.enterAmount)}
            keyboardType='numeric'
            style={{
              ...AppStyles.regularText,
              fontWeight: '500',
              color: AppColors.spaceGrey,
              textAlign: 'right'
            }}
          />

        </View>);

      } else {
        return (<TouchableOpacity onPress={() => this.onClickSelectReason()}>


          {this.state.reason !== undefined && (this.state.reason.message === REASON_OTHER_EN || this.state.reason.message === REASON_OTHER_VN) ?
            this.renderReasonOther() : this.renderReason()}


        </TouchableOpacity>);
      }

    } else {
      return <View />;
    }

  }

  renderFullfilmentStatus() {
    const item = this.props.item;
    return (
      <View testID={TestID.orderStatusView} style={{
        width: AppSizes.screenWidth - AppSizes.paddingSml,
        padding: AppSizes.paddingMedium,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignContent: 'center'
      }}>
        <View style={styles.fullfilmentContainer}>
          {

            (Object.keys(this.statusOrder)
              .reverse()).map((key) =>
                this.renderCheckboxStatus(Localize(this.statusOrder[key]),
                  parseInt(key),
                  () => this.onClickItemStatus(parseInt(key), this.props.index)))
          }
        </View>
      </View>
    );
  }

  renderProductLotItem(orderInfo) {
    const { skuList } = orderInfo;

    let lotSkuView = [];

    const groupLotSku = _.groupBy(skuList, sku => sku._id);
    for (let key in groupLotSku) {
      const skuList = groupLotSku[key];
      const skuParam = groupLotSku[key][0];
      let numberOfCaseActual = 0;
      let numberOfItemActual = 0;
      let numberOfCaseDelivered = 0;
      let numberOfItemDelivered = 0;
      let numberOfCase = 0;
      let numberOfItem = 0;
      skuList.forEach(sku => {
        numberOfCaseActual += sku.numberOfCaseActual;
        numberOfItemActual += sku.numberOfItemActual;
        numberOfCaseDelivered += sku.numberOfCaseDelivered;
        numberOfItemDelivered += sku.numberOfItemDelivered;
        numberOfCase = sku.numberOfCase;
        numberOfItem = sku.numberOfItem;
      });
      const lotSku = {
        skuList,
        numberOfCaseActual,
        numberOfItemActual,
        numberOfCaseDelivered,
        numberOfItemDelivered,
        productDetail: skuParam.productDetail,
        numberOfCase,
        numberOfItem,
        casePrice: skuParam.casePrice,
        itemPrice: skuParam.itemPrice
      };
      lotSkuView.push(lotSku);
    }

    return lotSkuView.map(lotSku => <OrderProductLotNumberItem
      orderListId={orderInfo._id}
      statusSelected={this.state.statusSelected}
      onChange={(option, orderListId, skuId) => {
        this.onChange(option, orderListId, skuId);
      }}
      lotSku={lotSku}
    />);
  }

  renderProductList(orderInfo) {
    if (!orderInfo || !orderInfo.skuList || orderInfo.skuList.length === 0) {
      return <View />;
    }
    const { skuList } = orderInfo;

    if (this.isLotnumberDisplay()) {
      return this.renderProductLotItem(orderInfo);
    }

    return skuList.map((sku, index) => {
      if (!sku || !sku._id) {
        return <View />;
      }
      return <OrderProductItem
        key={index}
        {...sku}
        orderListId={orderInfo._id}
        statusSelected={this.state.statusSelected}
        onChange={(option, orderListId, skuId) => {
          this.onChange(option, orderListId, skuId);
        }}
      />;
    });
  }

  renderOrderNote = (orderNote) => {
    return <View>
      <View style={PanelStyleView}>
        <Text style={CardTitle}>{Localize(messages.note)}</Text>
      </View>
      <View style={styles.remarkContentContainer}>
        <Text style={AppStyles.h5}>{orderNote}</Text>
      </View>
    </View>;

  };

  render() {
    const item = this.props.item;

    return (
      item ?
        <Panel
          title={Localize(messages.orderCode) + `:  ${item.orderCode}`}
          isDisable={this.isCancelOrder(item)}
          properties={{ isOpenPanel: this.props.isOpenPanel, }}>
          <View style={PanelStyleView}>
            <Text style={CardTitle}>{Localize(messages.salesman)}</Text>
          </View>
          <View style={styles.orderInfo}>
            {this.renderProductList(item)}

          </View>

          <View style={PanelStyleView}>
            <Text style={CardTitle}>{Localize(messages.promotions)}</Text>
          </View>
          <OrderInfoItem
            i1={Localize(messages.content)}
            i2={Localize(messages.promotionsContent)}
          />
          <OrderInfoItem
            i1={Localize(messages.totalAmount)}
            i2={moneyFormat(this.initTotalPrice().sum)}
          />
          <OrderInfoItem
            i1={Localize(messages.promotionIMVD)}
            i2={moneyFormat(item.IMVDPromotion)}
          />
          {item.promotionDiscount != 0 && item.promotionDiscount != null ?
            <OrderInfoItem
              i1={Localize(messages.promotionDiscount)}
              i2={moneyFormat(item.promotionDiscount)}
            />
            :
            null
          }

          {item.saleDiscount != 0 && item.saleDiscount != null ?
            <OrderInfoItem
              i1={Localize(messages.orderDiscount)}
              i2={moneyFormat(item.saleDiscount)}
            />
            :
            null
          }

          {item.customerDiscount != 0 && item.customerDiscount != null ?
            <OrderInfoItem
              custom
              i1={Localize(messages.customerDiscount)}
              i2={moneyFormat(item.customerDiscount)}
            />
            :
            null
          }
          <OrderInfoItem
            i1={Localize(messages.toCollect)}
            i2={moneyFormat(item.totalPrice)}
            header
          />


          <View style={PanelStyleView}>
            <Text style={CardTitle}>{Localize(messages.deliveryResult)}</Text>
          </View>
          {this.renderFullfilmentStatus()}
          {item && !_.isEmpty(item.note) && this.renderOrderNote(item.note)}
        </Panel> :
        null
    );
  }
}

export default connect(state => ({ orgConfig: state.user.orgConfig }), { addForm })(Order);
