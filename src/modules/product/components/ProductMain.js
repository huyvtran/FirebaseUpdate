import React, { Component } from 'react';
import { Dimensions, Text, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { TabViewAnimated, TabBar, SceneMap, TabView, PagerScroll } from 'react-native-tab-view';

import HeaderView from '../../../components/HeaderView';
import ProductList from './ProductList';
import InventoryList from './InventoryList';
import { searchProduct } from "../actions/creater/product";
import AppColors from '../../../theme/AppColors';
import messages from '../../../constant/Messages';
import _ from 'lodash'
import { refresh } from '../../../store/actions/refresh'
import eventTypes from '../../../store/constant/eventTypes';
import LanguageManager, { Localize } from '../../setting/languages/LanguageManager';
import AppStyles from '../../../theme/AppStyles';
import AppSizes from '../../../theme/AppSizes';
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};
let that = null;



const initRoute = [
  { key: messages.product, title: messages.product, component: <ProductList keySearch={'productSearch'} />, keySearch: 'productSearch', eventType: eventTypes.REFRESH_PRODUCT_LIST },
  { key: messages.inventory, title: messages.inventory, component: <InventoryList keySearch={'inventorySearch'} />, keySearch: 'inventorySearch', eventType: eventTypes.REFRESH_INVENTORY_LIST },

]

class ProductMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      page: 1,
      org_selected: '',
      category_selected: '',
      timeout: 0,
      text: '',
      index: 0,
      routes: initRoute,
    };
    that = this;
  }

  _handleIndexChange = (index) => {
    this.setState({ index })
  };

  _renderHeader = props => {
    props.navigationState.routes = props.navigationState.routes.map((route, index) => {
      return { ...route, title: Localize(initRoute[index].title) }
    })


    return <TabBar
      {...props}
      style={{
        height: AppSizes.paddingMedium * 2, backgroundColor: AppColors.abi_blue, zIndex: 1,
      }}
      tabStyle={AppStyles.titleTabBarContainer}
      renderLabel={(scene) => {
        return <Text style={{ ...AppStyles.titleTabBar }}>{scene.route.title.toString().toUpperCase()}</Text>
      }}
      indicatorStyle={AppStyles.indicatorTabBar}
    />
  }
    ;
  _onBackSearch = () => {
    this.props.refresh(initRoute[this.state.index].eventType, _.now());
  }

  _onChangeText = _.debounce((text) => {
    const { index } = this.state;
    this.props.searchProduct(text, initRoute[index].keySearch)
  }, 400);

  _renderScene = ({ route }) => {
    return route.component;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderView
          onBackSearch={this._onBackSearch}
          onChangeText={this._onChangeText}
          displaySearch
          displayAvatar

        />
        <TabView
          ref={ref => { this.tabView = ref }}
          style={styles.container}
          navigationState={this.state}
          renderScene={this._renderScene}
          renderTabBar={this._renderHeader}
          onIndexChange={(index) => this._handleIndexChange(index)}
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
  searchProduct, refresh
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductMain);
