import React, { Component } from 'react';

import { View, TextInput } from 'react-native'
import messages from '../constant/Messages';
import { Localize } from '../modules/setting/languages/LanguageManager';
import AppColors from '../theme/AppColors';
import ButtonIcon from './ButtonIcon';
import AppSizes from '../theme/AppSizes';
const styles = {
    container: {
        flexDirection: 'row',
        backgroundColor: AppColors.abi_blue,
        justifyContent: 'space-between',
        paddingHorizontal: AppSizes.paddingMedium,
        alignItems: 'center',
        height: AppSizes.paddingXMedium * 4,
        padding: AppSizes.paddingXSml,
        zIndex: 1
    },
    containerSearch: {
        backgroundColor: 'white',
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: AppSizes.paddingTiny,
        justifyContent: "center",
        alignItems: 'center',

        borderRadius: AppSizes.paddingTiny,
        borderWidth: AppSizes.paddingMicro,
        borderColor: AppColors.lightgray
    },
    textInput: {
        fontSize: AppSizes.fontBase,
        flex: 8,
        backgroundColor: 'transparent',
        padding: 0,
        height: AppSizes.paddingMedium * 2,

    },
}
class HeaderSearchComponent extends Component {

    render() {
        const { onChangeText, onPressCloseSearch } = this.props
        return <View style={[styles.container]}>
            <View style={styles.containerSearch}>
                <ButtonIcon
                    containerStyle={{ flex: 1 }}
                    onPress={() => {
                        this.props.onPressCloseSearch()
                    }}
                    iconName={'clear'}
                    iconSize={AppSizes.paddingXLarge}
                    iconColor={AppColors.gray}
                />
                <TextInput
                    keyboardShouldPersistTaps='always'
                    style={styles.textInput}
                    onChangeText={onChangeText}
                    placeholder={Localize(messages.search)}
                    autoFocus
                    autoCorrect={false}
                    autoCapitalize='none'
                    underlineColorAndroid='rgba(0,0,0,0)'
                />
                <ButtonIcon
                    containerStyle={{ flex: 1 }}
                    iconName={'search'}
                    iconSize={AppSizes.paddingXLarge}
                    iconColor={AppColors.gray}
                />
            </View>
        </View>
    }
};

export { HeaderSearchComponent };
