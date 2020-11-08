/**
 * App Theme - Sizes
 */

import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { verticalScale } from 'react-native-size-matters';
import AppConfig from '../config/AppConfig';

const { width, height, } = Dimensions.get('window');

export default {
    screenHeight: DeviceInfo.isTablet() && !AppConfig.isForceLockPortrait && height > width ? width : height,
    screenWidth: DeviceInfo.isTablet() && !AppConfig.isForceLockPortrait && height > width ? height : width,

    navbarHeight: (Platform.OS === 'ios') ? verticalScale(64) : verticalScale(54),
    statusBarHeight: (Platform.OS === 'ios') ? verticalScale(16) : 0,
    tabbarHeight: verticalScale(51),

    // paddingXXXLarge: verticalScale(26),
    // paddingXXLarge: verticalScale(24),
    // paddingXLarge: verticalScale(22),
    // paddingLarge: verticalScale(20),
    // padding: verticalScale(18),
    // paddingMedium: verticalScale(16),
    // paddingXMedium: verticalScale(14),
    // paddingXXMedium: verticalScale(12),
    // paddingSml: verticalScale(10),
    // paddingXSml: verticalScale(8),
    // paddingXXSml: verticalScale(6),
    // paddingTiny: verticalScale(4),
    // paddingXTiny: verticalScale(2),
    // paddingXXTiny: verticalScale(1),
    // paddingMicro: verticalScale(0.5),


    // fontXXSmall: verticalScale(8),
    // fontXSmall: verticalScale(10),
    // fontSmall: verticalScale(12),
    // fontBase: verticalScale(14),
    // fontXXMedium: verticalScale(16),
    // fontXMedium: verticalScale(18),
    // fontMedium: verticalScale(20),
    // fontXXLarge: verticalScale(22),
    // fontXLarge: verticalScale(24),
    // fontLarge: verticalScale(26),


    // iconMapSize: verticalScale(48),

    paddingXXXLarge: 26,
    paddingXXLarge: 24,
    paddingXLarge: 22,
    paddingLarge: 20,
    padding: 18,
    paddingMedium: 16,
    paddingXMedium: 14,
    paddingXXMedium: 12,
    paddingSml: 10,
    paddingXSml: 8,
    paddingXXSml: 6,
    paddingTiny: 4,
    paddingXTiny: 2,
    paddingXXTiny: 1,
    paddingMicro: 0.5,


    fontXXSmall: 8,
    fontXSmall: 10,
    fontSmall: 12,
    fontBase: 14,
    fontXXMedium: 16,
    fontXMedium: 18,
    fontMedium: 20,
    fontXXLarge: 22,
    fontXLarge: 24,
    fontLarge: 26,


    iconMapSize: 48

}