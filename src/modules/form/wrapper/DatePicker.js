import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import _ from 'lodash';

import { connect } from 'react-redux';

import { Label } from '../../../theme/styled';
import { checkToDayOrNot } from "../../task/helper/FunctionHelper";
import { addForm } from "../actions/creater/form";
import { Text, View } from 'react-native'
import AppSizes from '../../../theme/AppSizes';



const styles = {
  datepickerContainer: {
    borderBottomWidth: AppSizes.paddingXXTiny,
    borderBottomColor: '#5c91e2',
    marginTop: 0,
    paddingTop: 0,
  },
  container: {
    paddingHorizontal: AppSizes.paddingMedium,
    marginBottom: AppSizes.paddingXXSml,
    marginTop: AppSizes.paddingSml
  }
}

class DatePickerWraper extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      date: this.props.defaultValues ? (this.props.defaultValues.length > 0 && this.props.defaultValues[0].value) :
        Moment(today).format('DD/MM/YYYY'),
    };
    const { ...item } = this.props;
    this.item = item;
  }

  componentWillReceiveProps(props) {
    if (!_.isEqual(this.props.defaultValues, props.defaultValues)) {
      this.setState({
        date: props.defaultValues ? (props.defaultValues.length > 0 && props.defaultValues[0].value) :
          Moment(new Date()).format('DD/MM/YYYY')
      });
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.date !== nextState.date ||
      !_.isEqual(this.props.defaultValues, nextProps.defaultValues)
    );
  }
  onDateChange(date) {
    const dateFomat = new Date(parseInt(date.substring(6, 10), 10), parseInt(date.substring(3, 5) - 1, 10), parseInt(date.substring(0, 2), 10));
    // console.log("DATE PICK Field", "dateFomat", dateFomat);
    const data = [
      {
        value: dateFomat,
        label: this.props.label,
      },
    ];
    this.props.addForm(this.props, data);
    this.setState({ date });
  }
  render() {
    // console.log("DATE PICK Field", "this.props.defaultValues", this.props.defaultValues);
    // console.log("DATE PICK Field", "DATE PICK Field state date", this.state.date);

    return (
      <View style={styles.container}>
        <Text style={[Label, { paddingBottom: 0, marginBottom: 5 }]}>{this.props.label}</Text>
        <View style={styles.datepickerContainer}>
          <DatePicker
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="DD/MM/YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={date => this.onDateChange(date)}
            disabled={!checkToDayOrNot(this.props.currentDate)}
            maxDate={this.props.label.includes('Thực tế (ngày lên hàng)') ? Moment(this.props.currentDate).format('DD/MM/YYYY') : {}}
          />
        </View>
      </View>
    );
  }
}

export default connect(state => ({
  form: state.form,
  currentDate: state.task.currentDate
}), { addForm })(DatePickerWraper);
