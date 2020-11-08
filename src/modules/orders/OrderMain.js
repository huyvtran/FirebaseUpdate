import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, TabBar, SceneMap, TabView, PagerScroll } from 'react-native-tab-view';

import HeaderView from '../../components/HeaderView';
import OrderList from './OrderList';
import AppColors from '../../theme/AppColors';
import { searchOrder } from "./actions/creater/order";
import _ from 'lodash';
import OrderInfo from '../../constant/OrderInfo';
import messages from '../../constant/Messages';
import AppStyles from '../../theme/AppStyles';
import { Localize } from '../setting/languages/LanguageManager';
import AppSizes from '../../theme/AppSizes';
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

let saleDate = new Date();
const purchaseDate = new Date();

const initRoute = [
  { key: messages.order.sale, title: messages.order.sale, orderType: OrderInfo.TYPE.SALE },
  { key: messages.order.purchase, title: messages.order.purchase, orderType: OrderInfo.TYPE.PURCHASE },

]
class OrderMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      endDate: new Date(),
      refreshing: false,
      loading: true,
      page: 1,
      org_selected: '',
      category_selected: '',
      timeout: 0,
      text: '',
      index: 0,
      routes: initRoute,
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => {
    props.navigationState.routes = props.navigationState.routes.map((route, index) => {
      return { ...route, title: Localize(initRoute[index].title) }
    })
    return <TabBar
      {...props}
      style={{ height: AppSizes.paddingMedium * 2, backgroundColor: AppColors.abi_blue, zIndex: 0 }}

      tabStyle={AppStyles.titleTabBarContainer}
      renderLabel={(scene) => {
        return <Text style={{ ...AppStyles.titleTabBar }}>{scene.route.title.toString().toUpperCase()}</Text>
      }}
      indicatorStyle={AppStyles.indicatorTabBar}
    />
  };



  _renderScene = ({ route }) => {
    console.log("OrderMain _renderScene route>>", route);
    return <OrderList orderType={route.orderType} />;

  };


  onChangeText = _.debounce((text) => {
    this.props.searchOrder(text)
  }, 300);

  checkRoleIds = () => {
    const { roleIds, org } = this.props;
    if (!roleIds || !org) return;
    const roleIdsFilter = roleIds.filter(e => e.organizationId === org[0]);
    if (roleIdsFilter.length === 0) return true;
    if (roleIdsFilter[0].permissions[0].view.indexOf('ORDERS') === -1) return false;
    return true;
  }

  renderUnPermissionView() {
    return <View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 16, color: AppColors.hintText }}>{Localize(messages.notPermissionForThisAction)}</Text>
    </View>
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderView
          onSelect={() => this.onChangeText('')}
          onBackSearch={() => this.onChangeText('')}
          onChangeText={this.onChangeText}
          displaySearch
          displayAvatar

        />

        <TabView
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          initialLayout={initialLayout}
          renderPager={(props) => <PagerScroll {...props} />}
        />

      </View >
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    height: AppSizes.screenHeight
  },
});
export default connect(state => ({
  org: state.org.orgSelectIds,
  roleIds: state && state.user && state.user.readUser && state.user.readUser.roleIds ? state.user.readUser.roleIds : null,
  locale: state.i18n.locale

}), {
  searchOrder,
})(OrderMain);
