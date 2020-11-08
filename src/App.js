import _ from 'lodash';
import React, { Component } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { Actions, Router } from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen';
import { connect, Provider } from 'react-redux';
import { StatusBarView } from './components';
import OfflineBar from './components/connectionstatusbar';
import DropDownAlert from './components/DropDownAlert';
import MessageBar from './components/MessageBar';
import AppRoutes from './modules/navigation/AppRoutes';
import NavigationHelper from './modules/navigation/helpers/NavigationHelper';
import store from "./store/store";
import AppColors from './theme/AppColors';



const RouterWithRedux = connect()(Router);
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

class App extends Component {

  componentDidMount = () => {
    SplashScreen.hide();
    MessageBarManager.registerMessageBar(this.refs.alert);
  };

  componentWillUnmount = () => {
    if (Platform.OS === 'android' && store.getState() && store.getState().user) {
      const userInfo = store.getState().user;
      if (!userInfo || !userInfo.pushInfo || _.isEmpty(userInfo.pushInfo.deviceToken)) {
        Actions.reset('login')
      } else if (userInfo.readUser) {
        const userConfig = store.getState().user.readUser;
        NavigationHelper.navigateRoleMainScene(userConfig)
      } else {
        Actions.reset('main')
      }
    }

    MessageBarManager.unregisterMessageBar();
  };

  render() {
    return (<View style={{ width: '100%', height: '100%' }}>
      <StatusBar
        backgroundColor={AppColors.abi_blue}
        barStyle="light-content"
      />
      <StatusBarView />
      <Provider store={store}>

        <RouterWithRedux scenes={AppRoutes} />
      </Provider>
      <MessageBar ref="alert" />
      <OfflineBar />
      <DropDownAlert />
    </View>)
  }
}

export default App;
