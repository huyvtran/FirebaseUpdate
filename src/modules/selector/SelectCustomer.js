import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'

import SelectItemsComponent from '../../components/selectItem/SelectItemsComponent';
import API from '../../network/API';
import AppColors from '../../theme/AppColors';
import AppSizes from '../../theme/AppSizes';
import _ from 'lodash'
import Divider from '../form/components/Divider';
import AppStyles from '../../theme/AppStyles';
import CustomerItem from '../customer/components/CustomerItem';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';

class SelectCustomer extends SelectItemsComponent {


    source = () => {
        const customerList = this.props.customerList || [];
        if (this.props.species) {
            return API.supplierList(this.props.organizationId)
        }
        return API.customerList([this.props.organizationId])
    }

    transformer(res) {
        return res.data.data;
    }

    renderItem = ({ item, index }) => {
        return <CustomerItem
            onPress={() => this.onClickItem(item)}
            fullName={item.fullName}
            mobileNumber={`${item.mobileNumber}`}
            streetAddress={`${item.streetAddress}`}
        />
    }

    config() {
        return {
            itemText: (item, index) => item.fullName,
            source: this.source,
            transformer: this.transformer,
            title : Localize(messages.selectCustomer)
        }
    }


}



export default SelectCustomer;

