import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Divider from '../modules/form/components/Divider';
import AppColors from '../theme/AppColors';
import { Localize } from '../modules/setting/languages/LanguageManager';
import AppSizes from '../theme/AppSizes';
import AppStyles from '../theme/AppStyles';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    titleText: {
        ...AppStyles.regularText,
        color: AppColors.abi_blue
    }
});

class InputField extends Component {
    render() {
        const { title, renderContent, noLocalize, containerStyle, isHideDivider = false } = this.props;
        return <View style={[containerStyle && containerStyle, { marginTop: AppSizes.paddingMedium }]}>
            <Text style={styles.titleText}>{noLocalize ? title : Localize(title)}</Text>
            {renderContent}
            {!isHideDivider && <Divider />}
        </View>
    }
}

export default InputField