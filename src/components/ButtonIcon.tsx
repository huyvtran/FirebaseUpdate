import _ from 'lodash';
import React from 'react';
import { Component } from 'react';
import {
  ImageBackground, StyleSheet,
  TouchableOpacity, View,
  ViewStyle
} from 'react-native';
// import ViewPropTypes from '@component/config/ViewPropTypes';
import { Icon } from 'react-native-elements';
import AppSizes from '../theme/AppSizes';

interface Props{
  containerStyle?: ViewStyle,
  style?: ViewStyle,
  isIcon?: boolean,
  source?: number,
  type?: string,
  iconName: string,
  iconColor: string,
  iconSize: number,
  onPress: () =>void,
  haveAlpha?:boolean,
  disablethrottle?:boolean,
  testID?:any
}


class ButtonIcon extends Component<Props, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // static propTypes = {
  //   containerStyle: ViewPropTypes.style,
  //   style: ViewPropTypes.style,
  //   isIcon: ViewPropTypes.bool,
  //   source: ViewPropTypes.number,
  //   type: ViewPropTypes.string,
  //   iconName: ViewPropTypes.string,
  //   iconColor: ViewPropTypes.string,
  //   iconSize: ViewPropTypes.number,
  //   onPress: ViewPropTypes.func,
  // };

  static defaultProps = {
    type: 'material',
    iconSize: AppSizes.paddingLarge
  };

  render() {
    const {
      containerStyle,
      style,
      isIcon,
      source,
      type,
      iconName,
      iconColor,
      iconSize,
      onPress,
      haveAlpha,
      disablethrottle,
      testID
    } = this.props;

    return (
      <TouchableOpacity
        testID={testID}
        disabled={isIcon}
        onPress={onPress ? (disablethrottle ? onPress : _.throttle(onPress, 200, {'trailing': false})) : null}>
        <View style={[styles.container, containerStyle && containerStyle]}>
          {
            source
              ?
              <ImageBackground
                style={[styles.icon, style && style]}
                source={source}
                resizeMode='contain'>
                {haveAlpha && <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    flex: 1
                  }}/>}
              </ImageBackground>
              :
              <Icon
                style={style && style}
                type={type}
                name={iconName}
                color={iconColor}
                size={iconSize}/>
          }
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: AppSizes.paddingLarge * 2,
    height: AppSizes.paddingLarge * 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: '60%',
    height: '60%'
  },
});

export default ButtonIcon;