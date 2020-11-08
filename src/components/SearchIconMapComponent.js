import React, { Component } from 'react';
import {
    View, Text,
    TouchableOpacity,
    TextInput
} from 'react-native';
import AppStyles from '../theme/AppStyles';
import AppColors from '../theme/AppColors';
import { Icon } from 'react-native-elements';
import AppSizes from '../theme/AppSizes';
import Divider from '../modules/form/components/Divider';
import { Localize } from '../modules/setting/languages/LanguageManager';
import messages from '../constant/Messages';
import ButtonIcon from './ButtonIcon';

const styles = {
    containerSearch: {
        paddingHorizontal: AppSizes.paddingMedium,
        width: AppSizes.screenWidth,
        flexDirection: 'row',
        borderBottomWidth: AppSizes.paddingTiny,
        borderBottomColor: AppColors.lightgray,
        backgroundColor: AppColors.white
    },
    containerSearchInput: {
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.white

    },
    textInput: {
        flex: 12,
        fontSize: AppSizes.fontBase,
        marginLeft: AppSizes.paddingXSml,
        backgroundColor: AppColors.white

    },
}


const SearchIconMapComponent = ({ onChangeTextSearch, onPressMap }) => {

    return <View style={styles.containerSearch}>
        <View style={styles.containerSearchInput}>
            <Icon
                style={{ flex: 1 }}
                size={AppSizes.paddingXLarge}
                name={'search'}
                color={AppColors.textSubContent}
            />
            <TextInput
                keyboardShouldPersistTaps='always'
                style={styles.textInput}
                onChangeText={onChangeTextSearch && onChangeTextSearch}
                placeholder={Localize(messages.search)}
                autoCorrect={false}
                autoCapitalize='none'
                underlineColorAndroid='rgba(0,0,0,0)'
            />
        </View>
        <Divider
            vertical
        />
        <ButtonIcon
            iconName={'map'}
            iconSize={AppSizes.paddingXLarge}
            iconColor={AppColors.abi_blue}
            onPress={onPressMap && onPressMap}
        />
    </View>

}
export default SearchIconMapComponent