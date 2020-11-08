import React, { Component } from 'react';
import { View, ViewPropTypes, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppSizes from '../../theme/AppSizes';

export class Cell extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        borderStyle: ViewPropTypes.style
    };

    render() {
        const { data, width, height, flex, style, textStyle, borderStyle, onPress, ...props } = this.props;
        const textDom = React.isValidElement(data) ? (
            data
        ) : (
                <Text style={[textStyle, styles.text]} {...props} numberOfLines={2}>
                    {data}
                </Text>
            );
        const borderTopWidth = (borderStyle && borderStyle.borderWidth) || 1;
        const borderRightWidth = borderTopWidth;
        const borderColor = (borderStyle && borderStyle.borderColor) || '#000';

        return (
            <TouchableOpacity
                style={[
                    {
                        // borderTopWidth,
                        // borderRightWidth,
                        // borderColor
                    },
                    styles.cell,
                    width && { width },
                    height && { height },
                    flex && { flex },
                    !width && !flex && !height && !style && { flex: 1 },
                    style
                ]}

                onPress={() => onPress && onPress()}
            >
                {textDom}
            </TouchableOpacity>
        );
    }
}


const styles = StyleSheet.create({
    cell: { justifyContent: 'center', paddingHorizontal: AppSizes.paddingXSml, alignItems: 'center' },
    text: { backgroundColor: 'transparent' }
});