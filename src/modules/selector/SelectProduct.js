import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'

import SelectItemsComponent from '../../components/selectItem/SelectItemsComponent';
import API from '../../network/API';
import ProductHelper from '../product/components/ProductHelper';
import ProductItem from '../product/components/ProductItem';
import { Localize } from '../setting/languages/LanguageManager';
import messages from '../../constant/Messages';
class SelectProduct extends SelectItemsComponent {

    source = () => {
        return API.inventoryAllList(this.props.organizationId, this.props.date)
    }

    transformer(res) {
        const productList = res.data.data;
        if (!this.props.selected || this.props.selected.length === 0) {
            return productList
        }
        const skuListIds = this.props.selected.map(e => e.sku);
        const dataFilter = productList.filter(product => skuListIds.indexOf(product.sku) === -1);
        return dataFilter;
    }

    renderItem = ({ item, index }) => {
        return <ProductItem
            productName={item.productName}
            skuCode={item.sku}
            categoryname={item.categoryIds && item.categoryIds.length > 0 && item.categoryIds[0] ? item.categoryIds[0].categoryName : ''}
            onPress={() => this.onClickItem(item)}
            temperature={ProductHelper.temperature[item.temperature]}
        />
    }

    config() {
        return {
            itemText: (item, index) => item.productName,
            source: this.source.bind(this),
            transformer: this.transformer.bind(this),
            title: Localize(messages.selectProduct)
        }
    }


}



export default SelectProduct;

