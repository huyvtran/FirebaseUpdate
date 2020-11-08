import React, { Component } from 'react';
import {
  NetInfo,
  Text,
  View,
} from 'react-native';

export default class NetCheck extends Component {
  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'change',
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ isConnected }); }
    );
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      this._handleConnectivityChange
    );
  }
  _handleConnectivityChange(isConnected) {
    this.setState({
      isConnected,
    });
  }
  render() {
    return (
      <View>
        <Text>{this.state.isConnected ? 'Online' : 'Offline'}</Text>
      </View>
    );
  }
}
