import React from 'react';
import { View, Text } from 'react-native'
import Divider from '../modules/form/components/Divider';
import AppColors from '../theme/AppColors';
import AppSizes from '../theme/AppSizes';
const styles = {
    headerSectionsContainer: {
        paddingHorizontal: AppSizes.paddingMedium,
        paddingVertical: AppSizes.paddingXSml,
        backgroundColor: AppColors.lightgray,
    },
    sectionTitleText: {
        fontSize: AppSizes.fontXXMedium,
        color: AppColors.abi_blue,
        fontWeight: '500'
    }
}
const SectionsHeaderText = ({ title }) => {
    return <View>
        <Divider />
        <View style={styles.headerSectionsContainer}>
            <Text style={styles.sectionTitleText}>{title}</Text>
        </View>
        <Divider />

    </View>
}

export default SectionsHeaderText