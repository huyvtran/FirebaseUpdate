import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Divider from '../../form/components/Divider';
import AppColors from '../../../theme/AppColors';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    titleText: {
        fontSize: 16,
        color: AppColors.orderDark,
        
    },
    line:{
        paddingBottom:8
    }
});

class InputField extends Component {
    render() {
        const { title, renderContent } = this.props;
        return <View >
            <View style={styles.line}>
            <Text style={styles.titleText}>{title}</Text>
            {renderContent}
            </View>
            <Divider />
        </View>
    }
}

export default InputField