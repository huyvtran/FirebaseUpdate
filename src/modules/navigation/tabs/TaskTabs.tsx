import React from 'react';
import { Actions, Scene, Stack } from 'react-native-router-flux';
import IconAssets from '../../../assets/IconAssets';
import TabIcon from '../../../components/TabIcon';
// Consts and Libs
// Scenes
import messages from '../../../constant/Messages';
import AppColors from '../../../theme/AppColors';
import AppStyles from '../../../theme/AppStyles';
import SubTaskList from '../../task/components/SubTaskList';
import TaskList from '../../task/components/TaskList';
import { screenNotInTab } from '../AppRoutes';




export default (
  <Stack key='taskTabs'
    tabBarLabel={messages.tabs.tasks}
    hideNavBar
    inactiveBackgroundColor={AppColors.tabbar.background.inactive}
    activeBackgroundColor={AppColors.tabbar.background.active}
    navigationBarStyle={AppStyles.navbar}
    titleStyle={AppStyles.navbarTitle}
    icon={TabIcon}
    iconActive={IconAssets.task}
    iconInactive={IconAssets.task}
    type="reset"
    tabBarOnPress={(tab) => {
      if (!tab.scene.focused && !screenNotInTab(Actions.currentScene)) {
        Actions.jump('taskTabs');
      }
    }}
  >
    <Scene key='taskList' component={TaskList} type="reset" />
    <Scene key='subTaskList' component={SubTaskList} />


  </Stack>
);