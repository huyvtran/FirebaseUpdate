import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addForm } from "../actions/creater/form";
import { CheckboxGroup } from '../components/Checkbox/';
import LabelForm from '../components/LabelForm';
import { View } from 'react-native'
import AppSizes from '../../../theme/AppSizes';


const styles = {
  container: {
    paddingBottom: AppSizes.paddingMedium,
    paddingHorizontal: AppSizes.paddingMedium
  }
}

class CheckBoxWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      data_selected: [],
    };
    this.dataSelected = [];

    const { ...item } = this.props;
    this.item = item;
  }

  componentWillMount() {
    this.dataSelected = this.props.values.filter(e => e.selected === true);
  }
  onSelect(value) {
    this.props.addForm(this.item, value);
  }

  render() {
    return (
      <View style={styles.container}>
        <LabelForm
          label={this.item.label}
          required={this.item.validate.required}
        />
        <CheckboxGroup
          onSelect={(value) => this.onSelect(value)}
          checked={this.dataSelected}
          items={this.props.values}
        />
      </View>
    );
  }
}

export default connect(state => ({ form: state.form }), { addForm })(CheckBoxWrapper);
