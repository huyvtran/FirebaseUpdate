import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'

import SelectItemsComponent from '../../components/selectItem/SelectItemsComponent';
import messages from '../../constant/Messages';
import { getListLanguages } from '../setting/languages/LanguagesHelper';
import { Localize } from '../setting/languages/LanguageManager';
class SelectLanguages extends SelectItemsComponent {


    source = () => {
        const languages = getListLanguages()
        return Promise.resolve(languages)
    }

    transformer(res) {
        return res;
    }


    config() {
        return {
            itemText: (item, index) => item.language,
            source: this.source,
            transformer: this.transformer,
            title: Localize(messages.selectLanguages)
        }
    }


}


export default connect(state => ({}), {})(SelectLanguages);

