import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'

import { Actions } from 'react-native-router-flux';

import _ from 'lodash'
import ButtonIcon from '../../components/ButtonIcon';
import messages from '../../constant/Messages';
import Divider from '../form/components/Divider';
import AppColors from '../../theme/AppColors';
import AppStyles from '../../theme/AppStyles';
import SelectItemsComponent from '../../components/selectItem/SelectItemsComponent';
import LanguageManager from '../setting/languages/LanguageManager';
import Languages from '../setting/languages/Languages';
import API from '../../network/API'

class SelectPicker extends SelectItemsComponent {


    source = () => {
        return Promise.resolve(this.props.data)
    }

    transformer(res) {
        return res;
    }

    config() {
        return {
            itemText: (item, index) => item,
            source: this.source,
            transformer: this.transformer
        }
    }
}

export default connect(state => ({ orgArr: state.user.user.organizationIds, org: state.org.orgSelect, }), {})(SelectPicker);


