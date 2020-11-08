import React from 'react';

import AppColors from '../../../theme/AppColors';
import Divider from '../../form/components/Divider';
import { Dimensions, Platform, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'
import AppStyles from '../../../theme/AppStyles';
import { H1, H1M, H2 } from '../../../theme/styled';
import AppSizes from '../../../theme/AppSizes';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingRight: 16,
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: 'white'
    },
    productName: {
        fontSize: 18,
        color: AppColors.abi_blue,
        fontWeight: '500',
        opacity: 0.87,
    },
    productInfo: {
        justifyContent: 'space-between',
        // marginTop: 16,
        flexDirection: 'column',
        width: AppSizes.screenWidth - 32,
        backgroundColor: 'white'
    },
    productInfoDetail: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flex: 1,
        marginTop: 8,

    },
    textDetail: {
        color: AppColors.spaceGrey,
        marginLeft: 2,
        left: 8,
        right: 8,

    }

})

const ProductItem = ({ productName, skuCode, categoryname, temperature, onPress }) => (
    <TouchableOpacity onPress={onPress && onPress} style={styles.mainContainer}>
        <Text style={H1} numberOfLines={1}>{productName}</Text>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>

            <View style={styles.productInfo}>
                <ProductInfoDetail
                    iconName={'qrcode'}
                    type={'font-awesome'}
                    content={skuCode}
                    flex={2}
                />
                <ProductInfoDetail
                    type={'font-awesome'}
                    iconName={'file-text'}
                    content={categoryname}
                    flex={2}
                />
            </View>
            <ProductInfoDetail
                justifyContent={'flex-end'}

                iconName={'thermometer-half'}
                type={'font-awesome'}
                content={temperature}
                flex={2}

            />
        </View>
        <Divider
            style={{ width: AppSizes.screenWidth - 32, marginTop: 16 }}
        />
    </TouchableOpacity>
);


const ProductInfoDetail = ({ iconName, content, flex, type, justifyContent, margin }) => (
    <View style={[styles.productInfoDetail, { justifyContent: justifyContent, flex }]}>
        <Icon

            name={iconName}
            type={type}
            size={14}
            color={AppColors.spaceGrey}
        />
        <Text

            style={[H2, styles.textDetail]}
            numberOfLines={1}>
            {content}
        </Text>
    </View>
)

export default ProductItem;
