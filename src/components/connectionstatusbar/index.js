import React, { Component } from 'react';
import { View, StatusBar, Animated, Easing, AppState } from 'react-native';
import styles from './index.styles';
import FirebaseDatabaseManager from '../../firebase/FirebaseDatabaseManager';
import UserActions from '../../firebase/UserActions';
import GPSState from 'react-native-gps-state'
import { Localize } from '../../modules/setting/languages/LanguageManager';
import messages from '../../constant/Messages';
import NetInfo from "@react-native-community/netinfo";
import FirebaseAnalyticsManager from '../../firebase/FirebaseAnalyticsManager';

export default class OfflineBar extends Component {
  animationConstants = {
    DURATION: 800,
    TO_VALUE: 4,
    INPUT_RANGE: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
    OUTPUT_RANGE: [0, -15, 0, 15, 0, -15, 0, 15, 0],
  }

  setNetworkStatus = (status) => {

    if (status) {
      this.setState({ isNetworkConnected: true })
      this.triggerAnimation();
    } else {
      FirebaseAnalyticsManager.logEvent(UserActions.APP_OFFLINE)
      this.setState({ isNetworkConnected: false, messagesContent: Localize(messages.youAreOffLine) });
    }

  }

  state = {
    isNetworkConnected: true,
    isGPSEnable: true,
    messagesContent: ''
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      NetInfo.isConnected.fetch().then(this.setNetworkStatus);
    }
  }

  addEventListenerGPS = () => {
    GPSState.addListener((status) => {
      console.log("addEventListenerGPS status>>", status)

      switch (status) {
        case GPSState.NOT_DETERMINED:

        case GPSState.RESTRICTED:

        case GPSState.DENIED:

          this.setState({ isGPSEnable: false, messagesContent: Localize(messages.GPSDisable) }, () => FirebaseAnalyticsManager.logEvent(UserActions.GPS_OFF))

          break;

        case GPSState.AUTHORIZED_ALWAYS:
        //TODO do something amazing with you app


        case GPSState.AUTHORIZED_WHENINUSE:
          this.setState({ isGPSEnable: true })

          //TODO do something amazing with you app
          break;
      }
    })
    GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE)
  }
  componentWillMount() {
    this.addEventListenerGPS()

    NetInfo.isConnected.addEventListener('connectionChange', this.setNetworkStatus);
    AppState.addEventListener('change', this._handleAppStateChange);
    this.animation = new Animated.Value(0);
  }
  componentWillUnMount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.setNetworkStatus);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  // Took Reference from https://egghead.io/lessons/react-create-a-button-shake-animation-in-react-native#/tab-code
  triggerAnimation = () => {
    if (!this.animation) {
      return
    }
    this.animation.setValue(0);
    Animated.timing(this.animation, {
      duration: this.animationConstants.DURATION,
      toValue: this.animationConstants.TO_VALUE,
      useNativeDriver: true,
      ease: Easing.bounce,
    }).start();
  }

  render() {
    const interpolated = this.animation.interpolate({
      inputRange: this.animationConstants.INPUT_RANGE,
      outputRange: this.animationConstants.OUTPUT_RANGE,
    });
    const animationStyle = {
      transform: [{ translateX: interpolated }],
    };
    // const { offlineText = 'You are not connected to Internet' } = this.props;
    return (!this.state.isNetworkConnected || !this.state.isGPSEnable) ?
      <View style={[styles.container]}>
        <StatusBar backgroundColor='#424242' />
        <Animated.Text style={[styles.offlineText, animationStyle]}>{this.state.messagesContent}</Animated.Text>
      </View> : null;
  }
}
