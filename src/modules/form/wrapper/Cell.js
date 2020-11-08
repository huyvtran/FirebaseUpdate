import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppSizes from '../../../theme/AppSizes';

class Cell extends Component {
  static propTypes = {
    textStyle: Text.propTypes.style,
  }

  render() {
    return (
      <View style={{ width: AppSizes.paddingSml * 8, height: AppSizes.paddingXXLarge * 2 }}>
        {this.props.children}
      </View>
    );
  }
}

export default Cell;
