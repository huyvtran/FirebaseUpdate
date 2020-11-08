import React from 'react';
import { Actions, Scene, Stack } from 'react-native-router-flux';
import IconAssets from '../../../assets/IconAssets';
import TabIcon from '../../../components/TabIcon';
// Scenes
import messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import AppStyles from '../../../theme/AppStyles';
import CustomerMain from '../../customer/CustomerMain';
import { screenNotInTab } from '../AppRoutes';



export default (
  <Stack key='customerTabs'
    tabBarLabel={messages.tabs.partners}
    hideNavBar
    inactiveBackgroundColor={AppColors.tabbar.background.inactive}
    activeBackgroundColor={AppColors.tabbar.background.active}
    navigationBarStyle={AppStyles.navbar}
    titleStyle={AppStyles.navbarTitle}
    icon={TabIcon}
    iconActive={IconAssets.customer}
    type="reset"
    tabBarOnPress={(tab) => {
      if (!tab.scene.focused && !screenNotInTab(Actions.currentScene)) {
        Actions.jump('customerTabs');
      }
    }}
  >

    <Scene key='customerMain' component={CustomerMain} type="reset" />

  </Stack>
);