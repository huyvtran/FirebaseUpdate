import React, { PureComponent, Component } from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
import { connect } from 'react-redux';
import SupplierItem from "./SupplierItem";
import { Actions } from 'react-native-router-flux'
import API from '../../../network/API';
import eventTypes from '../../../store/constant/eventTypes';
import AwesomeListComponent from 'react-native-awesome-list';

import _ from 'lodash'
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import ErrorAbivinView from '../../../components/ErrorAbivinView';

class CompanytList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.listRowRender = this.listRowRender.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.textSearch != this.props.textSearch && nextProps.keySearchParams === this.props.keySearch) {
      this.textSearch = nextProps.textSearch;
      this.supplierList.refresh()
    }

    if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_CUSTOMER_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.textSearch = ''
        this.supplierList.refresh()
      }
    }

    if (nextProps && nextProps.org && nextProps.org[0] && nextProps.org[0].id && nextProps.org[0].id != this.props.org[0].id) {
      this.supplierList.refresh()
    }

  }

  source(pagingData) {
    const orgId = this.props.org[0]._id;
    return API.supplierList(orgId, this.textSearch, pagingData);
  }

  onClickItem = _.throttle((item) => {
    Actions.contactDetail({ item })
  }, 300);

  listRowRender = ({ item }) => {
    return (
      <SupplierItem
        onPress={() => this.onClickItem(item)}
        fullName={item.fullName}
        mobileNumber={item.mobileNumber}
        streetAddress={item.streetAddress}
      />
    );
  }

  transformer(res) {
    return res.data.data
  }

  keyExtractor = (item) => item._id

  render() {
    return (
      <AwesomeListComponent
        ref={ref => this.supplierList = ref}
        isPaging
        source={(pagingData) => this.source(pagingData)}
        transformer={(response) => this.transformer(response)}
        renderItem={(item) => this.listRowRender(item)}
        keyExtractor={(item) => this.keyExtractor(item)}
        emptyText= {Localize(messages.noResult)}
        renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.supplierList.onRetry()} />}
        
      />
    );
  }
}

export default connect(state => ({
  org: state.org.orgSelect,
  textSearch: state.contact.textSearchCustomer,
  event: state.refresh.event,
  keySearchParams: state.contact.keySearch,
  locale : state.i18n.locale
}), {})(CompanytList);
