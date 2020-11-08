import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Dimensions, Platform } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';


import AppSizes from '../../../../theme/AppSizes';
import AppColors from '../../../../theme/AppColors';
import AppStyles from '../../../../theme/AppStyles';
import { Localize } from '../../../setting/languages/LanguageManager';
import messages from '../../../../constant/Messages';
import { CardTitle, PanelStyleView } from '../../../../theme/styled';
import { Panel } from '..';
import OrderProductItem from '../OrderView/components/OrderProductItem';


const styles = {
    container: {
        width: '100%',
        paddingVertical: AppSizes.paddingXSml,
        paddingHorizontal: AppSizes.paddingXSml,
        borderBottomColor: AppColors.white,
        borderBottomWidth: AppSizes.paddingXXTiny,
        backgroundColor: '#F2F2F2'
    }
}
const ProductItemView = ({ product }) => {
    return <View style={styles.container}>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        }}>
            <Text style={{ ...AppStyles.regularText, color: '#515151' }}>{product.sku}</Text>
            <Text style={{ ...AppStyles.regularText, color: '#515151' }}>{ product.weight + " " + messages.Kg}</Text>
        </View>
        <Text style={{ ...AppStyles.regularText, color: '#515151', fontWeight: '500', marginTop: AppSizes.paddingXXSml }}>{product.productName}</Text>
        <Text style={{ ...AppStyles.regularText, color: '#515151', marginTop: AppSizes.paddingXXSml }}>{Localize(messages.amount) + ': ' + product.numberOfItem}</Text>

    </View>
}

export default ProductItemView
