import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import CustomerItem from "./CustomerItem"
import { Actions } from 'react-native-router-flux'
import API from '../../../network/API';
import eventTypes from '../../../store/constant/eventTypes';
import AwesomeListComponent from 'react-native-awesome-list';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import ErrorAbivinView from '../../../components/ErrorAbivinView';
import _ from 'lodash'

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.listRowRender = this.listRowRender.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.textSearch != this.props.textSearch && nextProps.keySearchParams === this.props.keySearch) {
      this.textSearch = nextProps.textSearch;
      this.customerList.refresh()
    }

    if (nextProps && nextProps.event && nextProps.event.types === eventTypes.REFRESH_CUSTOMER_LIST) {
      if (!this.props.event || this.props.event.timeUnix != nextProps.event.timeUnix) {
        this.textSearch = ''
        this.customerList.refresh()
      }
    }

    if (nextProps && nextProps.org && nextProps.org[0] && nextProps.org[0].id && nextProps.org[0].id != this.props.org[0].id) {
      this.customerList.refresh()
    }

  }

  onClickItem = _.throttle((item) => {
    Actions.contactDetail({ item })
  }, 300);

  listRowRender = ({ item }) => (
    <CustomerItem
      onPress={() => this.onClickItem(item)}
      fullName={item.fullName}
      mobileNumber={`${item.mobileNumber}`}
      streetAddress={`${item.streetAddress}`}
      nameCard={item.fullName.charAt(0)}
      displayNameCard
    />
  )
  keyExtractor = (item) => item._id

  source = (pagingData) => {
    const orgId = this.props.org && this.props.org[0] ? this.props.org[0].id : undefined;
    return API.customerList([orgId], this.textSearch, pagingData)
  }

  transformer(res) {
    return res.data.data;
  }

  render() {
    console.log("CustomerList >>",this.props.contact.data);
    return (
      <View style={{ flex: 1 }}>
        <AwesomeListComponent
          ref={ref => this.customerList = ref}
          isPaging
          source={(pagingData) => this.source(pagingData)}
          transformer={(response) => this.transformer(response)}
          renderItem={(item) => this.listRowRender(item)}
          keyExtractor={(item) => this.keyExtractor(item)}
          emptyText={Localize(messages.noResult)}
          renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.customerList.onRetry()} />}

        />
      </View >
    );
  }
}

export default connect(state => ({
  org: state.org.orgSelect,
  contact: state.contact,
  textSearch: state.contact.textSearchCustomer,
  event: state.refresh.event,
  keySearchParams: state.contact.keySearch,
  locale: state.i18n.locale


}), {})(CustomerList);
