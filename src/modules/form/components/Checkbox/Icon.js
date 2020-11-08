import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { getColor } from './helpers';
import VectorIconComponent from './VectorIconComponent';
import AppSizes from '../../../../theme/AppSizes';

export default class Icon extends Component {
  static defaultProps = {
    size: AppSizes.paddingSml * 3,
    color: '#757575',
    allowFontScaling: true,
  };

  render() {
    const { name, style, size, color, allowFontScaling } = this.props;
    const VectorIcon = VectorIconComponent.get();

    return (
      <VectorIcon
        name={name}
        size={size}
        color={getColor(color)}
        style={style}
        allowFontScaling={allowFontScaling}
      />
    );
  }
}

Icon.PropTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  allowFontScaling: PropTypes.bool,
};
