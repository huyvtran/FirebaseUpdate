import React, { Component } from 'react';
import { Switch, View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { addForm } from "../actions/creater/form";

import { H1 } from '../../../theme/styled';
import { checkBaseAction, checkToDayOrNot, checkToDayInOut } from "../../task/helper/FunctionHelper";
import AppSizes from '../../../theme/AppSizes';


class Toggle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValues && this.props.defaultValues[0] ? this.props.defaultValues[0].value === 'Yes' ? true : false : false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.value !== nextState.value;
  }

  _onValueChange = () => {
    const { value } = this.state;
    this.setState({ value: !value });

    const data = [
      {
        value: !value ? 'Yes' : 'No',
        label: this.props.label,
      },
    ];
    this.props.addForm(this.props, data);
  };

  getDisableStatus = () => {
    const { configurations } = this.props.orgConfig;
    const allowSubmitOverTime = configurations.allowSubmitOverTime;
    /**
     * if task is check in or check out task => do not allow submit when date is not today
     */
    if (!checkToDayInOut(this.props.currentDate) && !allowSubmitOverTime) {
      return;
    }
  };

  render() {

    return (
      <TouchableOpacity
        disabled={this.getDisableStatus()}
        style={styles.container}
        onPress={() => this._onValueChange()}>
        {!checkBaseAction(this.props.taskActionCode) && <View style={{ flex: 8 }}>
          <Text style={H1} ellipsizeMode='tail'>
            {this.props.label}
          </Text>
        </View>}
        <Switch
          value={this.state.value}
          disabled={this.getDisableStatus()}
          onValueChange={() => this._onValueChange()}
        />
      </TouchableOpacity>
    );
  }
}

export default connect(state => ({
  currentDate: state.task.currentDate,
  taskActionCode: state.task.taskDetail.task.taskAction.taskActionCode,
  orgConfig: state.user.orgConfig

}), { addForm })(Toggle);

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: AppSizes.paddingXXTiny,
    marginHorizontal: 0,
    marginVertical: AppSizes.paddingXXSml,
    borderColor: '#d6d7da',
    flexDirection: 'row',
    padding: AppSizes.paddingMedium
  }
};