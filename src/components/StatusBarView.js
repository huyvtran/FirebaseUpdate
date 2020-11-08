import React from 'react';
import { View, Platform } from 'react-native';
import AppColors from '../theme/AppColors';
import AppSizes from '../theme/AppSizes';

const height = Platform.OS === 'ios' ? AppSizes.paddingLarge : 0;

const StatusBarView = () => <View style={{ backgroundColor: AppColors.abi_blue, height }} />;

export { StatusBarView };
