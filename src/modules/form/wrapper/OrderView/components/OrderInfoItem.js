
import React from 'react';
import PropTypes from 'prop-types';
import { TableContent, ColumnHeader } from '../../../../../theme/styled';
import { H1M, H1 } from '../../../../../theme/styled';
import { Text } from 'react-native'
import AppColors from '../../../../../theme/AppColors';
import { View } from 'react-native'
import AppSizes from '../../../../../theme/AppSizes';

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: AppSizes.paddingXXLarge,
    borderColor: '#DADADA',
    borderBottomWidth: 1,
    width: '100%',
    // height: ${props => (props.header ? 56 : 48)}

  },
  c1Container: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  c2Container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
}
const OrderInfoItem = ({ i1, i2, header }) => (
  header ?
    <View style={[styles.container, { height: header ? AppSizes.paddingXSml * 7 : AppSizes.paddingXXLarge * 2, }]}>
      <View style={styles.c1Container}>
        <Text style={[H1, { color: AppColors.spaceGrey, }]}>{i1}</Text>
      </View>
      <View style={styles.c2Container}>
        <Text style={[H1, { color: AppColors.spaceGrey }]} numberOfLines={1} >{i2}</Text>
      </View>
    </View> :
    <View style={[styles.container, { height: header ? AppSizes.paddingXSml * 7 : AppSizes.paddingXXLarge * 2, }]}>
      <View style={styles.c1Container}>
        <Text style={TableContent} numberOfLines={1}>{i1}</Text>
      </View>
      <View style={styles.c2Container}>
        <Text style={TableContent} numberOfLines={1}>{i2}</Text>

      </View>
    </View>
);

export default OrderInfoItem;
