import React, { Component } from 'react';
import { Dimensions, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, TabBar, SceneMap, TabView, PagerScroll } from 'react-native-tab-view';

import HeaderView from '../../components/HeaderView';
import ContactList from './components/CustomerList';
import CompanyList from './components/Supplier';
import LanguageManager, { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import AppColors from '../../theme/AppColors';
import CustomerList from './components/CustomerList';
import eventTypes from '../../store/constant/eventTypes';
import { refresh } from '../../store/actions/refresh'
import { searchCustomer } from './actions/creater/customer'
import _ from 'lodash'
import AppSizes from '../../theme/AppSizes';
import AppStyles from '../../theme/AppStyles';
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};
let that = null
const initRoute = [
  { key: messages.customer, title: messages.customer, component: <CustomerList keySearch={'customerSearch'} />, keySearch: 'customerSearch', eventType: eventTypes.REFRESH_CUSTOMER_LIST },
  { key: messages.supplier, title: messages.supplier, component: <CompanyList keySearch={'companySearch'} />, keySearch: 'companySearch', eventType: eventTypes.REFRESH_COMPANY_LIST },

]

class CustomerMain extends Component {

  constructor(props) {
    super(props);
    that = this
    this.state = {
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

  onChangeText = (text) => {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
  }
  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => {
    props.navigationState.routes = props.navigationState.routes.map((route, index) => {
      return { ...route, title: Localize(initRoute[index].title).toString().toUpperCase() }
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
  }

  _onBackSearch = () => {
    this.props.refresh(initRoute[this.state.index].eventType, _.now());
  }

  _onChangeText = _.debounce((text) => {
    const { index } = this.state;
    this.props.searchCustomer(text, initRoute[index].keySearch)
  }, 400);

  _renderScene = ({ route }) => {
    return route.component;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderView
          // onSelect={() => this.props.loadContact('')}
          onBackSearch={this._onBackSearch}
          onChangeText={(text) => this._onChangeText(text)}
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

const styles = {
  container: {
    flex: 1,
  },
};

// Redux
const mapStateToProps = state => ({
  org: state.org.key,
  locale: state.i18n.locale

})

// Any actions to map to the component?
const mapDispatchToProps = {
  refresh, searchCustomer,

}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerMain);

