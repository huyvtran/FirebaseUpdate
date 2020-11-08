import React, { Component } from 'react'
import { View } from 'react-native'
import DropdownAlertM from 'react-native-dropdownalert';
export default class DropDownAlert extends Component {
  componentDidMount = () => {
    // this.onError()
  }

  onError = () => {
      this.dropdown.alertWithType('error', 'Error', 'kkdkdkdk');
  };
  // ...
  onClose(data) {
    // data = {type, title, message, actions}
    // actions means how the alert was closed.
    // returns: automatic, programmatic, tap, pan or cancel
  }
  render() {
    return (
      <View>
        <DropdownAlertM ref={ref => this.dropdown = ref} onClose={data => this.onClose(data)} />
      </View>
    );
  }
}
