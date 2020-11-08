import AppColors from './AppColors';
import AppFonts from './AppFonts';
import AppSizes from './AppSizes';

// Font style

const PanelStyle = {
  flexDirection: 'row',
  height: AppSizes.paddingMedium * 3,
  paddingLeft: AppSizes.paddingMedium,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#F2F2F3'
}

const PanelStyleView = {
  flexDirection: 'row',
  height: AppSizes.paddingMedium * 3,
  paddingLeft: AppSizes.paddingMedium,
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#5c91e2'
}

const Label = {
  fontSize: AppSizes.fontSmall,
  opacity: 0.87
}
const Required = {
  fontSize: AppSizes.fontSmall,
  color: 'red',
  opacity: 0.87,
  fontFamily: AppFonts.base.family,

}


const CardTitle = {
  fontSize: AppSizes.fontXXMedium,
  color: '#ffffff',
  fontWeight: '400' as 'bold',
  opacity: 0.87
}


const TableContent = {
  fontSize: AppSizes.fontSmall,
  color: AppColors.spaceGrey,
  fontWeight: '400' as 'bold',
  opacity: 0.87,
  marginLeft: 8
}
const ColumnHeader = {
  fontSize: AppSizes.fontSmall,
  color: '#000000',
  fontWeight: '400' as 'bold',
  opacity: 0.54,

}

const H0 = {
  fontSize: AppSizes.fontXMedium,
  color: '#FFFFFF',
  fontWeight: '400' as 'bold',
  fontFamily: AppFonts.base.family,

}
const H1M = {
  fontSize: AppSizes.fontXMedium,
  color: AppColors.spaceGrey,
  fontWeight: '400' as 'bold',
  fontFamily: AppFonts.base.family,
  // opacity: 0.87,
}

const H1 = {
  fontSize: AppSizes.fontXXMedium,
  color: AppColors.abi_blue,
  // fontWeight: '500',
  fontFamily: AppFonts.base.family,

  // opacity: 0.87,
}
const H2 = {
  fontSize: AppSizes.fontBase,
  color: AppColors.spaceGrey,
  fontWeight: '400' as 'bold',
  fontFamily: AppFonts.base.family,

  // opacity: 0.87
}
const H3 = {
  fontSize: AppSizes.fontSmall,
  color: AppColors.abi_blue,
  fontWeight: '400' as 'bold',
  opacity: 0.38,
  fontFamily: AppFonts.base.family,

}
const H4 = {
  fontSize: AppSizes.fontMedium,
  // color: AppColors.order_dark,
  paddingBottom: 16,
  fontFamily: AppFonts.base.family,
}

export {
  PanelStyle,
  PanelStyleView,
  Label,
  CardTitle, ColumnHeader, TableContent,
  H0, H1, H1M, H2, H3, H4,
  Required,
};

