import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';

import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';


import { callOnce } from "../../utils/callOnce";

import AppStyles from '../../theme/AppStyles';
import messages from '../../constant/Messages';
import OrderInfo from '../../constant/OrderInfo';
import AppColors from '../../theme/AppColors';
import { Actions } from 'react-native-router-flux';
import ActionButton from 'react-native-action-button';
import OrderItem from './components/OrderItem';
import API from '../../network/API';
import AwesomeListComponent from 'react-native-awesome-list';
import { Localize } from '../setting/languages/LanguageManager';
import eventTypes from '../../store/constant/eventTypes';
import PermissionUtils from '../../utils/PermissionUtils';
import ErrorAbivinView from '../../components/ErrorAbivinView';
import AppSizes from '../../theme/AppSizes';
import _ from 'lodash'


class OrderList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      endDate: new Date(),
    };
    this.isPurchase = this.props.orderType === OrderInfo.TYPE.PURCHASE;
    this.textSearch = ''
  }
  //============================================= COMPONENT LIFE CYCLE =========================================//

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.textSearchOrder !== this.props.textSearchOrder) {
      this.textSearch = nextProps.textSearchOrder;
      this.orderList.refresh();
    }

    if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_ORDER_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.textSearch = ''
        this.orderList.refresh()
      }
    }
  }
  //============================================= LOGIC CONTROL =========================================//


  //============================================= UI CONTROL =========================================//

  source = (pagingData) => {
    const orgIds = this.props.orgSelectIds;

    let salesCode = null
    if (this.props.userInfo && this.props.userInfo.speciesProperty && this.props.userInfo.speciesProperty.salesCode) {
      salesCode = this.props.userInfo.speciesProperty.salesCode
    }
    return API.orderList(this.textSearch, this.state.endDate, this.isPurchase, pagingData, orgIds, salesCode);
  }


  transformer(res) {
    const orderList = res.data.data;

    if (orderList && orderList.length > 0 && orderList[0].deliveryDate) {
      const endDate = Moment(this.state.endDate);
      const startDate = Moment(this.state.endDate).subtract(1, 'days');
      let todayVsDue = Moment(orderList[0].deliveryDate).isBetween(startDate, endDate, "day", '[]')
      if (!todayVsDue) {
        return false
      }
    }
    return orderList;
  }

  keyExtractor = (item) => item._id

  onDateChange(date) {
    const date1 = date.split('/');
    const endDate = Moment(`${date1[2]}-${date1[1]}-${date1[0]}`);

    this.setState({
      endDate
    }, () => {
      this.onSelectDateRefreshData()
    });

  }

  onSelectDateRefreshData = _.debounce(() => {
    this.orderList.refresh()
  }, 1000)

  orderItemPress = (item) => {
    Actions.orderDetail({ order: item })
  }

  changeDate(dnumber) {
    const tDate = this.state.endDate;
    const endDate = Moment(tDate).add(dnumber, 'days');
    this.setState({
      endDate,
    }, () => this.onSelectDateRefreshData());
  }

  onClickAddOrder() {
    Actions.editCreateOrder({ date: this.state.endDate })
  }

  isShowCreateOrder() {
    return PermissionUtils.isGrantCreateOrder(this.props.orgSelectIds[0]) && !this.isPurchase;
  }

  //============================================= UI RENDER =========================================//

  renderItem = ({ item }) => (
    <OrderItem
      onPress={callOnce(() => this.orderItemPress(item), 1000)}
      order={item} />
  )

  renderDataView() {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
        <AwesomeListComponent
          ref={ref => this.orderList = ref}
          isPaging
          source={(pagingData) => this.source(pagingData)}
          transformer={(response) => this.transformer(response)}
          renderItem={(item) => this.renderItem(item)}
          keyExtractor={(item) => this.keyExtractor(item)}
          emptyText={Localize(messages.noResult)}
          renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.orderList.onRetry()} />}

        />
      </View>
    );
  }

  render() {
    const dateFormat = Moment(this.state.endDate).format('DD-MM-YYYY');
    return (
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            hitSlop={{ top: 40, left: 40, bottom: 40, right: 40 }}
            onPress={() => this.changeDate(-1)}
          >
            <Icon name='ios-arrow-back' size={26} color={'#ffffff'} />
          </TouchableOpacity>
          <DatePicker
            customStyles={styles.customStylesDatePicker}
            style={{ alignItems: 'center' }}
            date={dateFormat}
            mode="date"
            placeholder="select date"
            format="DD/MM/YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={(date) => this.onDateChange(date)}
          />
          <TouchableOpacity
            hitSlop={{ top: 40, left: 40, bottom: 40, right: 40 }}
            onPress={() => this.changeDate(+1)}
          >
            <Icon name='ios-arrow-forward' size={26} color={'#ffffff'} />
          </TouchableOpacity>
        </View>
        {
          this.renderDataView()
        }

        {this.isShowCreateOrder() && <ActionButton buttonColor={AppColors.orange}>
          <ActionButton.Item buttonColor={AppColors.orange} title={Localize(messages.newOrder)} onPress={() => this.onClickAddOrder()}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>

        </ActionButton>}
      </View >
    );
  }
}
const styles = {
  container: {
    flex: 1
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  addButton: {
    backgroundColor: AppColors.orange,
    borderColor: AppColors.lightgray,
    borderWidth: 0.5,
    height: 64,
    width: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  itemContainer: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    width: AppSizes.screenWidth,
  },
  iconOrderItem: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerContentItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 16
  },
  mainContentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  orderCodeItem: {
    color: AppColors.abi_blue
  },
  containerStatusItem: {
    padding: 4,
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    backgroundColor: AppColors.abi_blue
  },
  statusItem: {
    color: 'white',
  },
  infoItem: {
    color: AppColors.orange,
    top: 6
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1B64B0',
    paddingRight: AppSizes.paddingXXMedium,
    paddingLeft: AppSizes.paddingXXMedium,
    height: AppSizes.paddingXXMedium * 3
  },
  customStylesDatePicker: {
    dateInput: {
      borderWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: '500',
    },
  },
}
export default connect(state => ({
  order: state.order,
  org: state && state.org ? state.org.orgSelect : null,
  orgSelectIds: state && state.org ? state.org.orgSelectIds : null,
  orderRole: state && state.org ? state.org.orderRole : null,
  date: state.date,
  textSearchOrder: state && state.order ? state.order.textSearchOrder : null,
  locale: state && state.i18n ? state.i18n.locale : null,
  event: state && state.refresh ? state.refresh.event : null,
  userInfo: state && state.user ? state.user.readUser : null,
}), {
  })(OrderList);

