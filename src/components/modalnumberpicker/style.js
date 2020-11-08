'use strict';

import { StyleSheet, Dimensions } from 'react-native';
import AppSizes from '../../theme/AppSizes';


export default StyleSheet.create({
  cancelStyle: {
    borderRadius: AppSizes.paddingMedium,
    width: AppSizes.screenWidth * 0.1,
    height: AppSizes.screenWidth * 0.1,
    elevation: AppSizes.paddingSml,
    backgroundColor: '#ff3e0abb',
    alignItems: 'center',
    alignContent: 'center',
    margin: AppSizes.paddingSml,
  },
  acceptStyle: {
    borderRadius: AppSizes.paddingMedium,
    width: AppSizes.screenWidth * 0.1,
    height: AppSizes.screenWidth * 0.1,
    elevation: AppSizes.paddingSml,
    backgroundColor: '#81e200aa',
    alignItems: 'center',
    alignContent: 'center',
    margin: AppSizes.paddingSml,
  },
});
