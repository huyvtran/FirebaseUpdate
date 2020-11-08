import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { H1, H3 } from '../../../theme/styled';
import AppColors from '../../../theme/AppColors';
import Divider from '../../form/components/Divider';
import { Dimensions, Platform, Text, View, TouchableOpacity } from 'react-native';
import AppSizes from '../../../theme/AppSizes';
import _ from 'lodash'
import AppConfig from '../../../config/AppConfig';


const styles = {
  container: {
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: 'white'
  },
  h3Container: {
    paddingHorizontal: AppSizes.paddingMedium,
    paddingBottom: AppSizes.paddingXXMedium,
    paddingTop: AppSizes.paddingSml
  },
  h1Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: AppSizes.paddingMedium,
    alignSelf: 'stretch'
  },
  h1View: {
    paddingRight: AppSizes.paddingXXMedium,
    width: '90%'
  },
  iconContainer: {
    width: '10%'
  }
}
const RowDetail = ({ i1, i2, icon, onPress }) => (
  <View style={styles.container}>
    <View style={styles.h3Container}>
      <Text style={[H1]}>{i1}</Text>

    </View>
    <View style={styles.h1Container}>
      <View style={styles.h1View}>
        {!_.isEmpty(i2) && <Text style={[H1, { color: AppColors.spaceGrey, fontWeight: '400' }]}>{i2}</Text>}
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
        <Icon name={icon} size={AppSizes.paddingXXLarge} color={AppColors.abi_blue} />
      </TouchableOpacity>
    </View>
    <Divider style={{
      //marginHorizontal: 16,
      marginLeft: 16,
      marginBottom: 12,
      marginTop: 10,
      width: Dimensions.get('window').width - 32
    }} />
  </View>
);

export default RowDetail;
