import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {moneyFormat} from "../../../../../utils/moneyFormat";


class Cell extends Component {
  static propTypes = {
    textStyle: Text.propTypes.style,
  }

  render() {
    const { data, width, height, flex, style, textStyle, alignItems } = this.props;
    const textDom = React.isValidElement(data) ? data : (
      <Text style={[textStyle, styles.text]}>{typeof data === 'number' ? moneyFormat(data) : data}</Text>
    );
    let borderWidth;
    let borderColor;
    if (this.props.borderStyle && this.props.borderStyle.borderWidth) {
      borderWidth = this.props.borderStyle.borderWidth;
    } else {
      borderWidth = 0;
    }
    if (this.props.borderStyle && this.props.borderStyle.borderColor) {
      borderColor = this.props.borderStyle.borderColor;
    } else {
      borderColor = '#FFFFFF';
    }
    return (
      <View style={[
        {
          borderTopWidth: borderWidth,
          borderRightWidth: borderWidth,
          borderColor,
        },
        styles.cell,
        width && { width },
        height && { height },
        flex && { flex },
        flex && { flex },
        alignItems && { alignItems },
        !width && !flex && !height && { flex: 1 },
        style,
      ]}
      >
        {textDom}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  text: {
    // backgroundColor: 'transparent',
  },
});

export default Cell;
