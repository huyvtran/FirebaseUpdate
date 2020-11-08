import { StyleSheet } from "react-native";

import DeviceInfo from 'react-native-device-info';
import AppColors from "../../../theme/AppColors";
import AppStyles from "../../../theme/AppStyles";
import AppSizes from "../../../theme/AppSizes";

const isTablet = DeviceInfo.isTablet();

export const pickerStyles = StyleSheet.flatten({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    marginVertical: AppSizes.paddingXXSml,
    borderBottomWidth: AppSizes.paddingXXTiny,
    borderColor: '#d6d7da',

  },

  triggerStyles: {
    triggerText: {
      ...AppStyles.regularText,
      color: 'white',
      fontSize: AppSizes.fontSmall,
      paddingLeft: AppSizes.paddingSml,
      marginVertical: AppSizes.paddingTiny,
    },

    triggerWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,

      backgroundColor: '#5c91e2',
    },

    triggerTouchable: {
      style: {
        flex: 1,
      },
    },
  },
  triggerStylesText: {
    ...AppStyles.regularText,
    color: 'white',
    fontSize: AppSizes.fontSmall,
    paddingLeft: AppSizes.paddingSml,
    marginVertical: AppSizes.paddingTiny,
    backgroundColor: '#5c91e2',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: AppSizes.paddingTiny,
    flex: 1,
  },
  triggerWrapperYellow: {
    triggerText: {
      ...AppStyles.regularText,
      color: 'black',
      fontSize: AppSizes.fontSmall,
      paddingLeft: AppSizes.paddingSml,
      marginVertical: AppSizes.paddingTiny,
      textAlign: 'left'
    },

    triggerWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: '#CDDC39',
    },

    triggerTouchable: {
      style: {
        flex: 1,
      },
    },
  },
  triggerWrapperYellowText: {
    ...AppStyles.regularText,
    color: 'black',
    fontSize: AppSizes.fontSmall,
    paddingLeft: AppSizes.paddingSml,
    marginVertical: AppSizes.paddingTiny,
    textAlign: 'left',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: AppColors.greenLight,
    paddingVertical: AppSizes.paddingXXSml,
  },

  optionsStyles: {
    optionsContainer: {
      height: '40%',
      flex: 1,
      borderWidth: AppSizes.paddingXXTiny,
      // width: 100,
      borderColor: '#d6d7da',
      marginTop: AppSizes.paddingXMedium * 2,
      // marginRight: 20,
      padding: AppSizes.paddingXXSml,
    },
  },

  optionStyles: {
    optionText: {
      ...AppStyles.regularText,
      color: 'black',
      borderBottomWidth: AppSizes.paddingXXTiny,
      marginBottom: AppSizes.paddingXTiny,
      paddingBottom: AppSizes.paddingTiny,
      borderColor: '#d6d7da',
    },
  }
});

export const panelStyles = StyleSheet.flatten({
  container: {
    marginHorizontal: AppSizes.paddingXTiny,
    marginVertical: AppSizes.paddingXXTiny,
    borderRadius: AppSizes.paddingXTiny
  },

  panelExpanded: {
    backgroundColor: '#1B64B0',
    borderRadius: AppSizes.paddingXTiny
  },
  panel: {
    backgroundColor: '#5c91e2',
    borderRadius: AppSizes.paddingXTiny
  },

  panelDisable: {
    backgroundColor: AppColors.greySight,
    borderRadius: AppSizes.paddingXTiny
  },
  iconView: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
    // marginRight: 16
  },
  icon: {
    marginRight: AppSizes.paddingMedium,
  },

  childContainer: {
    paddingHorizontal: AppSizes.paddingXXSml
  },
  point: {
    width: AppSizes.paddingLarge,
    marginRight: AppSizes.paddingMedium,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center'
  }

});
