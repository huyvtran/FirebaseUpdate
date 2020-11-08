import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { PRIMARY, COLOR, PRIMARY_COLORS, THEME_NAME } from './config';
import Icon from './Icon';
import IconToggle from './IconToggle';
import AppSizes from '../../../../theme/AppSizes';

export default class Checkbox extends PureComponent {
  static PropTypes = {
    label: PropTypes.string,
    theme: PropTypes.oneOf(THEME_NAME),
    primary: PropTypes.oneOf(PRIMARY_COLORS),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onCheck: PropTypes.func,
  };
  static defaultProps = {
    theme: 'light',
    primary: PRIMARY,
    disabled: false,
  };
  render() {
    const { item, theme, primary, checked, disabled, value, label, onCheck } = this.props;

    const status = (() => {
      if (disabled) {
        return 'disabled';
      } else if (checked) {
        return 'checked';
      }
      return 'default';
    })();

    const colorMap = {
      light: {
        disabled: '#000000',
        checked: COLOR[`${primary}500`].color,
        default: '#000000',
      },
      dark: {
        disabled: '#ffffff',
        checked: COLOR[`${primary}500`].color,
        default: '#ffffff',
      },
    };

    const opacityMap = {
      light: {
        checked: 1,
        default: 0.54,
        disabled: 0.26,
      },
      dark: {
        checked: 1,
        default: 0.7,
        disabled: 0.3,
      },
    };

    const underlayMap = {
      light: 'rgba(0,0,0,.12)',
      dark: 'rgba(255,255,255,.12)',
    };

    const CURR_COLOR = colorMap[theme][status];
    const OPACITY = opacityMap[theme][status];
    const UNDERLAY_COLOR = underlayMap[theme];

    return (
      <TouchableHighlight
        style={{ paddingBottom: AppSizes.paddingXSml }}
        onPress={() => { disabled ? null : onCheck(!checked, item, label); }}
        underlayColor={disabled ? 'rgba(0,0,0,0)' : UNDERLAY_COLOR}
        activeOpacity={1}
      >
        <View style={styles.container}>

          <Icon
            name={checked ? 'check-box' : 'check-box-outline-blank'}
            onPress={() => { disabled ? null : onCheck(!checked, item, label); }}
            size={AppSizes.paddingXXLarge}
            color={CURR_COLOR}
            key={value}
            style={{
              opacity: OPACITY,
              marginRight: AppSizes.paddingMedium,
            }}
          />
          <Text
            style={styles.label}
          >
            {this.props.label}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',

  },
  label: {
    margin: 0,
    padding: 0,
    flex: 1,
    fontSize: AppSizes.fontXXMedium,
    opacity: 0.87,
  },
});
