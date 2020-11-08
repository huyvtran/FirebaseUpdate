import React, { PureComponent, Component } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import messages from '../../../constant/Messages';
import ProductItem from './ProductItem';
import ProductHelper from './ProductHelper';
import eventTypes from '../../../store/constant/eventTypes';
import API from '../../../network/API';
import _ from 'lodash'
import AwesomeListComponent from 'react-native-awesome-list';
import { Localize } from '../../setting/languages/LanguageManager';
import ErrorAbivinView from '../../../components/ErrorAbivinView';


class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
    };
    this.listRowRender = this.listRowRender.bind(this);
    this.textSearch = ''
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.textSearch != this.props.textSearch && nextProps.keySearchParams === this.props.keySearch) {
      this.textSearch = nextProps.textSearch;
      this.productList.refresh()
    }

    if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_PRODUCT_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.textSearch = ''
        this.productList.refresh()
      }
    }

    if (nextProps && nextProps.org && nextProps.org[0] && nextProps.org[0].id && nextProps.org[0].id != this.props.org[0].id) {
      this.productList.refresh()
    }

  }

  source = (pagingData) => {
    const orgId = this.props.org && this.props.org[0] ? this.props.org[0].id : undefined;
    return API.productList([orgId], this.textSearch, pagingData)
  }

  onClickItem = _.throttle((item) => {
    Actions.productDetail({ item })
  }, 300)

  listRowRender = ({ item }) => (
    <ProductItem
      productName={item.productName}
      skuCode={item.sku}
      categoryname={item.categoryIds && item.categoryIds.length > 0 && item.categoryIds[0] ? item.categoryIds[0].categoryName : ''}
      onPress={() => this.onClickItem(item)}
      temperature={ProductHelper.temperature[item.temperature]}
    />
  )

  transformer(res) {
    return res.data.data;
  }

  keyExtractor = (item) => item._id

  render() {
    return (
      <AwesomeListComponent
        ref={ref => this.productList = ref}
        isPaging
        source={(pagingData) => this.source(pagingData)}
        transformer={(response) => this.transformer(response)}
        renderItem={(item) => this.listRowRender(item)}
        keyExtractor={(item) => this.keyExtractor(item)}
        emptyText={Localize(messages.noResult)}
        renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.productList.onRetry()} />}
      />

    );
  }
}

export default connect(state => ({
  org: state.org.orgSelect,
  textSearch: state.product.textSearchProduct,
  keySearchParams: state.product.keySearch,
  event: state.refresh.event,
  locale: state.i18n.locale

}), {})(ProductList);
