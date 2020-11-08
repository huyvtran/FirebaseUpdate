import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'

import SelectItemsComponent from '../../components/selectItem/SelectItemsComponent';
import messages from '../../constant/Messages';
import { Localize } from '../setting/languages/LanguageManager';
class SelectOrg extends SelectItemsComponent {


    source = () => {
        const orgList = this.props.org.orgList || [];
        return Promise.resolve(orgList)
    }

    transformer(res) {
        return res;
    }


    config() {
        return {
            itemText: (item, index) => item.organizationName,
            source: this.source,
            transformer: this.transformer,
            title : Localize(messages.selectOrg)
        }
    }


}


export default connect(state => ({ org: state.org }), {})(SelectOrg);

