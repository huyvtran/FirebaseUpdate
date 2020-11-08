import React, { Component } from 'react';
import { connect } from 'react-redux';
import LabelForm from '../components/LabelForm';
import RadioForm from '../components/Radio';
import { addForm } from "../actions/creater/form";
import { View } from 'react-native'
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';
const array = require('lodash/array');


const styles = {
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: AppSizes.paddingMedium,
    alignItems: 'flex-start',
    marginBottom: AppSizes.paddingMedium
  }
}

class RadioWraper extends Component {
  constructor(props) {
    super(props);
    const { ...item } = this.props;
    this.item = item;
    this.validate;
    this.initialValue;
  }

  componentWillMount() {
    if (this.props.defaultValues && this.props.defaultValues.length > 0) {
      this.initialValue = array.findIndex(this.props.values, ['value', this.props.defaultValues[0].value]);

    } else {
      this.initialValue = -1
    }
    if (this.initialValue > -1) {
      this.validate = true;
    } else {
      this.validate = !this.props.validate.required;
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.label !== nextProps.label;
  }
  render() {
    const { ...item } = this.props;
    return (
      <View style = {styles.container}>
        <LabelForm
          label={item.label}
          required={item.validate.required}
        />
        <RadioForm
          style={{ alignItems: 'flex-start', marginTop: AppSizes.paddingSml }}
          labelStyle={{...AppStyles.regularText, fontSize: AppSizes.fontXXMedium, opacity: 0.87, marginLeft: AppSizes.paddingXSml }}
          radio_props={item.values}
          initial={this.initialValue}
          buttonColor={'#2196f3'}
          buttonSize={AppSizes.paddingXSml}
          buttonOuterSize={AppSizes.paddingLarge}
          onPress={(value, label) => {
            const data = [{ value, label }];
            this.props.addForm(this.item, data);
          }}
        />
      </View>
    );
  }
}

export default connect(state => ({ form: state.form }), { addForm })(RadioWraper);
