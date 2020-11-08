

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import DeviceUtil from "../utils/DeviceUtil";
import NotificationManager from "../modules/notification/NotificationManager";
import notiIcon from '../assets/icon/iconAbivinBlue.png';
import warningIcon from '../assets/icon/notification/iconWarningTask.png';
import infoIcon from '../assets/icon/notification/iconInfoTask.png';
import HTMLView from 'react-native-htmlview';
import AppStyles from '../theme/AppStyles';
import AppColors from '../theme/AppColors';
import AppSizes from '../theme/AppSizes';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HEIGHT_CONTENT = AppSizes.paddingSml * 5;
const PADDING_MESSAGE = AppSizes.paddingXSml;
const MESSAGE_BAR_TOP_INSET = DeviceUtil.isIPhoneX() ? AppSizes.paddingSml * 3 : AppSizes.paddingMedium;
const styleHtml = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
});
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingBottom: PADDING_MESSAGE,
    paddingTop: PADDING_MESSAGE,
    paddingLeft: PADDING_MESSAGE,
    paddingRight: PADDING_MESSAGE,
    minHeight: AppSizes.paddingSml * 5,
    backgroundColor: 'white',
  },
  containerView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    backgroundColor: 'transparent',
    // borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  containerDelete: {
    height: '100%',
    padding: AppSizes.paddingSml,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    backgroundColor: 'white',
    height: '100%',
    width: HEIGHT_CONTENT,
    justifyContent: 'center',
    alignItems: 'center'
  },

  statusViewContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(3,154,227, 0.2)',
    top: AppSizes.paddingMedium * 2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: AppSizes.paddingXSml,
    paddingHorizontal: AppSizes.paddingMedium,
    borderRadius: AppSizes.paddingMedium

  },
  statusBarText: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontSmall,
    color: AppColors.abi_blue
  }
});
class MessageBar extends Component {
  constructor(props) {
    super(props);

    this.animatedValue = new Animated.Value(0);
    this.notifyAlertHiddenCallback = null;
    this.alertShown = false;
    this.timeoutHide = null;

    this.state = this.getStateByProps(props);
    this.defaultState = this.getStateByProps(props);
  }

  componentDidMount() {
    // Configure the offsets prior to recieving updated props or recieving the first alert
    // This ensures the offsets are set properly at the outset based on the initial position.
    // This prevents the bar from appearing  and covering half of the screen when the
    // device is started in landscape and then rotated to portrait.
    // This does not happen after the first alert appears, as setNewState() is called on each
    // alert and calls _changeOffsetByPosition()
    this._changeOffsetByPosition(this.state.position);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && Object.keys(nextProps).length > 0) {
      this.setNewState(nextProps);
    }
  }

  setNewState(state) {
    // Set the new state, this is triggered when the props of this MessageBar changed
    this.setState(this.getStateByProps(state));

    // Apply the colors of the alert depending on its alertType
    this._applyAlertStylesheet(state.alertType);

    // Override the opposition style position regarding the state position in order to have the alert sticks that position
    this._changeOffsetByPosition(state.position);
  }

  getStateByProps(props) {
    const def = this.defaultState || {};
    return {
      // Default values, will be overridden
      backgroundColor: '#007bff', // default value : blue
      strokeColor: '#006acd', // default value : blue
      titleColor: '#ffffff', // default value : white
      messageColor: '#ffffff', // default value : white
      animationTypeTransform: 'SlideFromTop', // default value

      /* Cusomisation of the alert: Title, Message, Icon URL, Alert alertType (error, success, warning, info), Duration for Alert keep shown */
      title: props.title,
      message: props.message,
      avatar: props.avatar,
      alertType: props.alertType || 'info',
      duration: props.duration || def.duration || 3000,

      /* Hide setters */
      get shouldHideAfterDelay() {
        if (props.shouldHideAfterDelay != undefined) { return props.shouldHideAfterDelay; }
        if (def.shouldHideAfterDelay != undefined) { return def.shouldHideAfterDelay; }
        return true;
      },
      shouldHideOnTap: props.shouldHideOnTap == undefined &&
        def.shouldHideOnTap == undefined
        ? true
        : props.shouldHideOnTap || def.shouldHideOnTap,

      /* Callbacks method on Alert Tapped, on Alert Show, on Alert Hide */
      onTapped: props.onTapped || def.onTapped,
      onShow: props.onShow || def.onShow,
      onHide: props.onHide || def.onHide,

      /* Stylesheets */
      stylesheetInfo: props.stylesheetInfo ||
        def.stylesheetInfo || {
        backgroundColor: 'white',
        strokeColor: 'rgba(44,168,255, 0.8)',
        titleColor: '#ffffff',
        messageColor: '#ffffff'
      }, // Default are blue colors
      stylesheetSuccess: props.stylesheetSuccess ||
        def.stylesheetSuccess || {
        backgroundColor: 'white',
        strokeColor: 'green',
        titleColor: '#ffffff',
        messageColor: '#ffffff'
      }, // Default are Green colors
      stylesheetWarning: props.stylesheetWarning ||
        def.stylesheetWarning || {
        backgroundColor: 'white',
        strokeColor: '#F2405D',
        titleColor: '#ffffff',
        messageColor: '#ffffff'
      }, // Default are orange colors
      stylesheetError: props.stylesheetError ||
        def.stylesheetError || {
        backgroundColor: 'white',
        strokeColor: '#D12122',
        titleColor: '#ffffff',
        messageColor: '#ffffff'
      }, // Default are red colors
      stylesheetExtra: props.stylesheetExtra ||
        def.stylesheetExtra || {
        backgroundColor: 'white',
        strokeColor: '#006acd',
        titleColor: '#ffffff',
        messageColor: '#ffffff',
      }, // Default are blue colors, same as info

      /* Duration of the animation */
      durationToShow: props.durationToShow || def.durationToShow || 350,
      durationToHide: props.durationToHide || def.durationToHide || 350,

      /* Offset of the View, useful if you have a navigation bar or if you want the alert be shown below another component instead of the top of the screen */
      viewTopOffset: props.viewTopOffset || def.viewTopOffset || 0,
      viewBottomOffset: props.viewBottomOffset || def.viewBottomOffset || 0,
      viewLeftOffset: props.viewLeftOffset || def.viewLeftOffset || 0,
      viewRightOffset: props.viewRightOffset || def.viewRightOffset || 0,

      /* Inset of the view, useful if you want to apply a padding at your alert content */
      viewTopInset: props.viewTopInset || def.viewTopInset || MESSAGE_BAR_TOP_INSET,
      viewBottomInset: props.viewBottomInset || def.viewBottomInset || 0,
      viewLeftInset: props.viewLeftInset || def.viewLeftInset || 0,
      viewRightInset: props.viewRightInset || def.viewRightInset || 0,

      /* Padding around the content, useful if you want a tiny message bar */
      messageBarPadding: props.messageBarPadding || def.messageBarPadding || 8,

      /* Number of Lines for Title and Message */
      titleNumberOfLines:
        props.titleNumberOfLines == undefined &&
          def.titleNumberOfLines == undefined
          ? 1
          : props.titleNumberOfLines || def.titleNumberOfLines,
      messageNumberOfLines:
        props.messageNumberOfLines == undefined &&
          def.messageNumberOfLines == undefined
          ? 2
          : props.messageNumberOfLines || def.messageNumberOfLines,

      /* Style for the text elements and the avatar */
      titleStyle: props.titleStyle || def.titleStyle || {
        fontSize: 18,
        fontWeight: 'bold'
      },
      messageStyle: props.messageStyle || def.messageStyle || {
        fontSize: 16
      },
      avatarStyle: props.avatarStyle || def.avatarStyle || {
        height: 40,
        width: 40,
        borderRadius: 20
      },

      /* Position of the alert and Animation Type the alert is shown */
      position: props.position || def.position || 'top',
      animationType: props.animationType || def.animationType
    };
  }
  /*
  * Show the alert
  */
  showMessageBarAlert() {
    // If an alert is already shonw or doesn't have a title or a message, do nothing
    if (
      this.alertShown ||
      (this.state.title == null && this.state.message == null)
    ) {
      return;
    }

    // Set the data of the alert in the state
    this.alertShown = true;

    // Display the alert by animating it from the top of the screen
    // Auto-Hide it after a delay set in the state
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: this.state.durationToShow
    }).start(this._showMessageBarAlertComplete());
  }

  /*
  * Hide the alert after a delay, typically used for auto-hidding
  */
  _showMessageBarAlertComplete() {
    // Execute onShow callback if any
    this._onShow();

    // If the duration is null, do not hide the
    if (this.state.shouldHideAfterDelay) {
      this.timeoutHide = setTimeout(() => {
        this.hideMessageBarAlert();
      }, this.state.duration);
    }
  }

  /*
  * Return true if the MessageBar is currently displayed, otherwise false
  */
  isMessageBarShown() {
    return this.alertShown;
  }

  /*
  * Hide the alert, typically used when user tap the alert
  */
  hideMessageBarAlert() {
    // Hide the alert after a delay set in the state only if the alert is still visible
    if (!this.alertShown) {
      return;
    }

    clearTimeout(this.timeoutHide);

    // Animate the alert to hide it to the top of the screen
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: this.state.durationToHide
    }).start(this._hideMessageBarAlertComplete());
  }

  _hideMessageBarAlertComplete() {
    // The alert is not shown anymore
    this.alertShown = false;

    this._notifyAlertHidden();

    // Execute onHide callback if any
    this._onHide();
  }

  /*
  * Callback executed to tell the observer the alert is hidden
  */
  _notifyAlertHidden() {
    if (this.notifyAlertHiddenCallback) {
      this.notifyAlertHiddenCallback();
    }
  }

  /*
  * Callback executed when the user tap the alert
  */
  _alertTapped() {
    // Hide the alert
    if (this.state.shouldHideOnTap) {
      this.hideMessageBarAlert();
    }

    // Execute the callback passed in parameter
    if (this.state.onTapped) {
      this.state.onTapped();
    }
  }

  /*
  * Callback executed when alert is shown
  */
  _onShow() {
    if (this.state.onShow) {
      this.state.onShow();
    }
  }

  /*
  * Callback executed when alert is hidden
  */
  _onHide() {
    if (this.state.onHide) {
      this.state.onHide();
    }
  }

  /*
  * Change the background color and the line stroke color depending on the alertType
  * If the alertType is not recognized, the 'info' one (blue colors) is selected for you
  */
  _applyAlertStylesheet(alertType) {
    // Set the Background color and the line stroke color of the alert depending on its alertType
    // Set to blue-info if no alertType or if the alertType is not recognized

    let backgroundColor;
    let strokeColor;
    let titleColor;
    let messageColor;

    switch (alertType) {
      case NotificationManager.messageType.SUCCESS:
        backgroundColor = this.state.stylesheetSuccess.backgroundColor;
        strokeColor = this.state.stylesheetSuccess.strokeColor;
        titleColor = this.state.stylesheetSuccess.titleColor;
        messageColor = this.state.stylesheetSuccess.messageColor;
        break;
      case NotificationManager.messageType.ERROR:
        backgroundColor = this.state.stylesheetError.backgroundColor;
        strokeColor = this.state.stylesheetError.strokeColor;
        titleColor = this.state.stylesheetError.titleColor;
        messageColor = this.state.stylesheetError.messageColor;
        break;
      case NotificationManager.messageType.WARNING:
        backgroundColor = this.state.stylesheetWarning.backgroundColor;
        strokeColor = this.state.stylesheetWarning.strokeColor;
        titleColor = this.state.stylesheetWarning.titleColor;
        messageColor = this.state.stylesheetWarning.messageColor;
        break;
      case NotificationManager.messageType.INFO:
        backgroundColor = this.state.stylesheetInfo.backgroundColor;
        strokeColor = this.state.stylesheetInfo.strokeColor;
        titleColor = this.state.stylesheetInfo.titleColor;
        messageColor = this.state.stylesheetInfo.messageColor;
        break;
      default:
        backgroundColor = 'white';
        strokeColor = this.state.stylesheetExtra.strokeColor;
        titleColor = this.state.stylesheetExtra.titleColor;
        messageColor = this.state.stylesheetExtra.messageColor;
        break;
    }

    this.setState({
      backgroundColor,
      strokeColor,
      titleColor,
      messageColor
    });
  }

  /*
  * Change view<Position>Offset property depending on the state position
  */
  _changeOffsetByPosition(position) {
    switch (position) {
      case 'top':
        this.setState({
          viewBottomOffset: null
        });
        break;
      case 'bottom':
        this.setState({
          viewTopOffset: null
        });
        break;
      default:
        this.setState({
          viewBottomOffset: null
        });
        break;
    }
  }

  /*
  * Set the animation transformation depending on the chosen animationType, or depending on the state's position if animationType is not overridden
  */
  _applyAnimationTypeTransformation() {
    const position = this.state.position;
    let animationType = this.state.animationType;

    if (animationType === undefined) {
      if (position === 'bottom') {
        animationType = 'SlideFromBottom';
      } else {
        // Top by default
        animationType = 'SlideFromTop';
      }
    }

    switch (animationType) {
      case 'SlideFromTop':
        var animationY = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-windowHeight, 0]
        });
        this.animationTypeTransform = [{ translateY: animationY }];
        break;
      case 'SlideFromBottom':
        var animationY = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [windowHeight, 0]
        });
        this.animationTypeTransform = [{ translateY: animationY }];
        break;
      case 'SlideFromLeft':
        var animationX = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-windowWidth, 0]
        });
        this.animationTypeTransform = [{ translateX: animationX }];
        break;
      case 'SlideFromRight':
        var animationX = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [windowWidth, 0]
        });
        this.animationTypeTransform = [{ translateX: animationX }];
        break;
      default:
        var animationY = this.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-windowHeight, 0]
        });
        this.animationTypeTransform = [{ translateY: animationY }];
        break;
    }
  }

  renderMessageBar = () => {
    return <TouchableOpacity
      onPress={() => {
        this._alertTapped();
      }}
      style={{ flex: 1, padding: this.state.messageBarPadding, }}
    >
      <View
        style={[styles.containerView, { borderColor: this.state.strokeColor, }]}
      >
        {this.renderImage()}
        <View
          style={[styles.contentContainer]}
        >
          {/* {this.renderTitle()} */}
          {this.renderMessage()}
          {this.renderDeleteButton()}
        </View>
      </View>
    </TouchableOpacity>
  }

  renderStatusView = () => {
    return <View style={styles.statusViewContainer}>
      <Text style={styles.statusBarText}>{this.state.message}</Text>
    </View>
  }

  /*
  * Alert Rendering Methods
  */

  render() {
    // Set the animation transformation depending on the chosen animationType, or depending on the state's position if animationType is not overridden
    this._applyAnimationTypeTransformation();

    return (
      <Animated.View
        style={{
          transform: this.animationTypeTransform,
          backgroundColor: 'transparent',
          position: 'absolute',
          top: this.state.viewTopOffset,
          bottom: this.state.viewBottomOffset,
          left: this.state.viewLeftOffset,
          right: this.state.viewRightOffset,
          paddingTop: this.state.viewTopInset,
          paddingBottom: this.state.viewBottomInset,
          paddingLeft: this.state.viewLeftInset,
          paddingRight: this.state.viewRightInset
        }}
      >
        {this.renderMessageBar()}

      </Animated.View>
    );
  }

  renderImage() {
    const { alertType, strokeColor } = this.state;
    let imageSource;
    switch (alertType) {
      case NotificationManager.messageType.ERROR:
        imageSource = warningIcon;
        break;
      case NotificationManager.messageType.SUCCESS:
        imageSource = notiIcon;
        break;
      case NotificationManager.messageType.WARNING:
        imageSource = warningIcon;
        break;
      case NotificationManager.messageType.INFO:
        imageSource = infoIcon;
        break;
      case NotificationManager.messageType.EXTRA:
        imageSource = notiIcon;
        break;
    }
    return (<View style={[styles.imageContainer, {
      backgroundColor: strokeColor
    }]}>
      <Image source={imageSource} style={{ width: HEIGHT_CONTENT / 2, height: HEIGHT_CONTENT / 2, }} />
    </View>);
  }
  renderTitle() {
    if (this.state.title != null) {
      return (
        <Text
          numberOfLines={this.state.titleNumberOfLines}
          style={[this.state.titleStyle, { color: this.state.titleColor }]}
        >
          {this.state.title}
        </Text>
      );
    }
  }

  renderMessage() {
    if (this.state.message != null) {
      return (
        <View style={{
          flex: 5, height: '100%', justifyContent: 'center', alignItems: 'center'
        }}
        >

          <HTMLView
            style={[{
              ...AppStyles.regularText,
              fontSize: 13,
              backgroundColor: 'white',
              width: '100%',
              textAlign: 'center'
            }]}
            value={this.state.message}
            stylesheet={styleHtml}
          />
        </View>

      );
    }
  }

  renderDeleteButton() {
    return (
      <TouchableOpacity onPress={() => this.hideMessageBarAlert()} style={styles.containerDelete}>
        <Icon
          name="clear"
          color="#9FADB4"
          size={18}
        />
      </TouchableOpacity>
    );
  }
}

export default MessageBar;
