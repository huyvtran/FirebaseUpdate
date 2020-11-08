import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import DynamicServerManager from '../../../data/DynamicServerManager';
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';


const styles = {

  input: {
    fontSize: AppSizes.fontSmall,
    fontWeight: '200',
    padding: 0,
    backgroundColor: '#80DEEA'
  },
  mainContainer: {
    flexDirection: 'row',
    paddingHorizontal: AppSizes.paddingMedium,
    paddingVertical: AppSizes.paddingXSml,
    justifyContent: 'center',
    backgroundColor: AppColors.naviBlue,
    alignItems: 'center',
    borderWidth: AppSizes.paddingXXTiny,
    borderRadius: AppSizes.paddingMedium * 2,
    borderColor: AppColors.abi_blue
  }
}

class TestSetting extends Component {


  onClickChangeServer = () => {
    Actions.changeServer({ onRefresh: () => this.forceUpdate() })
  }

  render() {
    const dynamicServer = DynamicServerManager.getDynamicServer();

    return <TouchableOpacity onPress={() => this.onClickChangeServer()} style={styles.mainContainer}>
      <Text style={[AppStyles.regularText, { color: AppColors.white }]}>{dynamicServer.server + ' : ' + dynamicServer.protocol + dynamicServer.host}</Text>
      <Icon
        name={'keyboard-arrow-right'}
        size={AppSizes.paddingXXLarge}
        color={AppColors.white}
      />
    </TouchableOpacity>

  }
}
export default TestSetting
