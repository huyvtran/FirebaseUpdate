import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AppColors from '../theme/AppColors';
import AppStyles from '../theme/AppStyles';
import AppSizes from '../theme/AppSizes';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    titleText: {
        fontSize: AppSizes.fontBase,
        color: AppColors.abi_blue
    },
    containerSeal: {
        ...AppStyles.regularText,
        marginVertical: AppSizes.paddingTiny,

    },
});

class TextInfoInLine extends Component {
    render() {
        const { title, content, style } = this.props;
        return <View style={[{ flexDirection: 'row', marginTop: AppSizes.paddingXSml }, style && style,]}>
            <Text style={[styles.containerSeal, { color: AppColors.hintText }]}>{title}</Text>
            <Text style={styles.containerSeal}>{content}</Text>
        </View>
    }
}

export default TextInfoInLine