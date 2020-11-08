import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import AppSizes from '../../../theme/AppSizes';


class Divider extends Component {
    render() {
        if (this.props.vertical) {
            return <View style={{ width: this.props.width || AppSizes.paddingXXTiny, height: '100%', backgroundColor: this.props.color || 'rgba(0,0,0,0.15)', marginLeft: this.props.marginLeft || 0, ...this.props.style }}></View>

        }
        return (
            <View style={{ width: '100%', height: this.props.height || AppSizes.paddingXXTiny, backgroundColor: this.props.color || 'rgba(0,0,0,0.15)', marginLeft: this.props.marginLeft || 0, ...this.props.style }}></View>
        );
    }
}
export default Divider