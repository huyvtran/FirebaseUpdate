import React, { Component } from 'react';
import { View } from 'react-native';

class Table extends Component {
  _renderChildren(props) {
    return React.Children.map(props.children, child => {
      if (props.borderStyle && child.type.displayName !== 'ScrollView') {
        return React.cloneElement(child, {
          borderStyle: props.borderStyle,
        });
      }
      return React.cloneElement(child);
    });
  }

  render() {
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
        this.props.style,
        {
          borderLeftWidth: borderWidth,
          borderBottomWidth: borderWidth,
          borderColor,
        },
      ]}
      >
        {this._renderChildren(this.props)}
      </View>
    );
  }
}

class TableWrapper extends Component {
  _renderChildren(props) {
    return React.Children.map(props.children, child => {
      if (props.borderStyle) {
        return React.cloneElement(child, {
          borderStyle: props.borderStyle,
        });
      }
      return React.cloneElement(child);
    });
  }

  render() {
    const { style } = this.props;
    return (
      <View style={style}>
        {this._renderChildren(this.props)}
      </View>
    );
  }
}

export { Table, TableWrapper };
