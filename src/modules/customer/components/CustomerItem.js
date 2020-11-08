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
        paddingRight: AppSizes.paddingMedium,
        paddingLeft: AppSizes.paddingMedium,
        paddingTop: AppSizes.paddingTiny,

        backgroundColor: 'white'
    },
    productName: {
        fontSize: AppSizes.fontXMedium,
        color: AppColors.abi_blue,
        fontWeight: '500',
        opacity: 0.87,
    },
    productInfo: {
        justifyContent: 'space-between',
        // marginTop: 16,
        flexDirection: 'column',
        width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
        backgroundColor: 'white'
    },
    productInfoDetail: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flex: 1,
        marginTop: AppSizes.paddingXSml,
    },
    textDetail: {
        color: AppColors.spaceGrey,
        margin: 2,
        left: AppSizes.paddingXSml,
        right: AppSizes.paddingXSml,

    }

})

const CustomerItem = ({ fullName, mobileNumber, streetAddress, onPress }) => (
    <TouchableOpacity onPress={onPress && onPress} style={styles.mainContainer}>
        <View style={[styles.mainContainer, { paddingLeft: 0 }]}>
            <Text style={H1} numberOfLines={1}>{fullName}</Text>


            <View style={styles.productInfo}>
                <CustomerInfoDetail
                    iconName={'phone'}
                    type={'entypo'}
                    content={mobileNumber}
                    flex={2}
                />
                <CustomerInfoDetail
                    type={'entypo'}
                    iconName={'location-pin'}
                    content={streetAddress}
                    flex={2}

                />
            </View>




        </View>
        <Divider
            style={{ width: AppSizes.screenWidth - AppSizes.paddingMedium * 2, marginTop: AppSizes.paddingMedium }}
        />
    </TouchableOpacity>
);


const CustomerInfoDetail = ({ iconName, content, flex, type, justifyContent, margin }) => (
    <View style={[styles.productInfoDetail, { justifyContent: justifyContent, flex }]}>
        <Icon

            name={iconName}
            type={type}
            size={AppSizes.padding}
            color={AppColors.spaceGrey}
        />
        <Text

            style={[H2, styles.textDetail]}
            numberOfLines={1}>
            {content === 'null' ? "none" : content}
        </Text>
    </View>
)

export default CustomerItem;
