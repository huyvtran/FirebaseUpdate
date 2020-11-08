import React from 'react';
import { Actions, Scene, Stack } from 'react-native-router-flux';
import IconAssets from '../../../assets/IconAssets';
import TabIcon from '../../../components/TabIcon';
// Scenes
import messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import AppStyles from '../../../theme/AppStyles';
import ProductMain from '../../product/components/ProductMain';
import { screenNotInTab } from '../AppRoutes';



export default (
  <Stack key='productTabs'
    tabBarLabel={messages.tabs.products}
    
    hideNavBar
    inactiveBackgroundColor={AppColors.tabbar.background.inactive}
    activeBackgroundColor={AppColors.tabbar.background.active}
    navigationBarStyle={AppStyles.navbar}
    titleStyle={AppStyles.navbarTitle}
    icon={TabIcon}
    iconActive={IconAssets.product}
    type="reset"
    tabBarOnPress={(tab) => {
      if (!tab.scene.focused && !screenNotInTab(Actions.currentScene)) {
        Actions.jump('productTabs');
      }
    }}
  >
    <Scene key='productMain' component={ProductMain} type="reset" />

  </Stack>
);