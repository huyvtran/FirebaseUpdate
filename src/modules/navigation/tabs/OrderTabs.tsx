import React from 'react';
import { Scene, Tabs, Stack, ActionConst, Text, Actions } from 'react-native-router-flux';

// Scenes
import messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import AppStyles from '../../../theme/AppStyles';
import TabIcon from '../../../components/TabIcon';

import OrderMain from '../../orders/OrderMain';
import { screenNotInTab } from '../AppRoutes';
import IconAssets from '../../../assets/IconAssets';


export default (
  <Stack key='orderTabs'
    tabBarLabel={messages.tabs.orders}
    hideNavBar
    inactiveBackgroundColor={AppColors.tabbar.background.inactive}
    activeBackgroundColor={AppColors.tabbar.background.active}
    navigationBarStyle={AppStyles.navbar}
    titleStyle={AppStyles.navbarTitle}
    icon={TabIcon}
    iconActive={IconAssets.order}
    tabBarOnPress={(tab) => {
      if (!tab.scene.focused && !screenNotInTab(Actions.currentScene)) {
        Actions.jump('orderTabs');
      }
    }}
  >
    <Scene key='orderMain' component={OrderMain} type="reset" />

  </Stack>
);