import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Checkbox from './Checkbox';
import { THEME_NAME, PRIMARY, PRIMARY_COLORS } from './config';

export default class CheckboxGroup extends PureComponent {
  static PropTypes = {
    theme: PropTypes.oneOf(THEME_NAME),
    primary: PropTypes.oneOf(PRIMARY_COLORS),
    onSelect: PropTypes.func,
    checked: PropTypes.array,
    items: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string,
      disabled: PropTypes.bool,
    })),
  };
  static defaultProps = {
    theme: 'light',
    primary: PRIMARY,
  };
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
  }

  componentWillMount = () => {
    const { checked } = this.props;

    if (checked && checked.length) {
      this.value = checked;
    }
  };

  get value() {
    return this.state.selected;
  }
  set value(value) {
    this.setState({
      selected: value,
    });

    const { onSelect } = this.props;
    onSelect && onSelect(value);
  }
  _onChange = (checked, item) => {
    const { selected } = this.state;

    let newSelected;
    if (checked) {
      newSelected = [...selected, item];
    } else {
      const index = selected.indexOf(item);
      newSelected = [
        ...selected.slice(0, index),
        ...selected.slice(index + 1),
      ];
    }

    this.setState({
      selected: newSelected,
    });

    const { onSelect } = this.props;
    onSelect && onSelect(newSelected);
  };

  render() {
    const { items, theme, primary } = this.props;
    return (
      <View>
        {
          items && items.length && items.map((item) => {
            const { value } = item;
            return (
              <Checkbox
                ref={value}
                key={`Checkbox${value}`}
                value={value}
                item={item}
                theme={theme}
                primary={primary}
                onCheck={this._onChange}
                checked={this.state.selected && this.state.selected.indexOf(item) !== -1}
                {...item}
              />
            );
          })
        }
      </View>
    );
  }

  /**
   * Get the value of checked Checkbox in CheckboxGroup. Often use in form.
   * @returns {Array}
   */

  /**
   * Make CheckboxGroup set some Checkbox checked
   * @param {string[]} value - An array of values of some Checkbox in　CheckboxGroup
   */
}
