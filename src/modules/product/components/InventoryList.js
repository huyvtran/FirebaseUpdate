import React, { PureComponent, Component } from 'react';
import { FlatList, ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';

import InventoryItem from './InventoryItem';
import Moment from "moment/moment";
import messages from '../../../constant/Messages';
import eventTypes from '../../../store/constant/eventTypes';
import API from '../../../network/API';
import AwesomeListComponent from 'react-native-awesome-list';
import { Localize } from '../../setting/languages/LanguageManager';
import ErrorAbivinView from '../../../components/ErrorAbivinView';


class InventoryList extends Component {
  constructor(props) {
    super(props);

    this.listRowRender = this.listRowRender.bind(this);
    this.textSearch = ''
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.textSearch != this.props.textSearch && nextProps.keySearchParams === this.props.keySearch) {
      this.textSearch = nextProps.textSearch;
      this.inventoryList.refresh()
    }

    if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_INVENTORY_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.textSearch = ''
        this.inventoryList.refresh();
      }
    }

    if (nextProps && nextProps.org && nextProps.org[0] && nextProps.org[0].id && nextProps.org[0].id != this.props.org[0].id) {
      this.inventoryList.refresh()
    }
  }


  source = (pagingData) => {
    const orgId = this.props.org && this.props.org[0] ? this.props.org[0].id : undefined;
    return API.inventoryList(orgId, this.textSearch, Moment(), pagingData)
  }

  transformer(res) {
    return res.data.data;
  }

  listRowRender = ({ item }) => (
    <InventoryItem
      inventoryItem={item}
    />
  )
  keyExtractor = (item) => item._id

  render() {
    return (
      <View style={{ flex: 1 }} >
        <AwesomeListComponent
          ref={ref => this.inventoryList = ref}
          isPaging
          source={(pagingData) => this.source(pagingData)}
          transformer={(response) => this.transformer(response)}
          renderItem={(item) => this.listRowRender(item)}
          keyExtractor={(item) => this.keyExtractor(item)}
          emptyText={Localize(messages.noResult)}
          renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.inventoryList.onRetry()} />}

        />

      </View >
    );
  }
}


export default connect(state => ({
  org: state.org.orgSelect,
  textSearch: state.product.textSearchProduct,
  keySearchParams: state.product.keySearch,
  event: state.refresh.event,
  locale: state.i18n.locale

}), {})(InventoryList);
