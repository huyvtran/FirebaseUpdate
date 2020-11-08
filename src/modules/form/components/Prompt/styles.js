import { StyleSheet } from 'react-native';
import AppSizes from '../../../../theme/AppSizes';

export default StyleSheet.create({
  dialog: {
    flex: 1,
    alignItems: 'center'
  },
  dialogOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  dialogContent: {
    elevation: 5,
    marginTop: AppSizes.paddingSml * 15,
    width: AppSizes.paddingSml * 30,
    backgroundColor: 'white',
    borderRadius: AppSizes.paddingXXSml,
    borderWidth: AppSizes.paddingXXTiny,
    overflow: 'hidden'
  },
  dialogTitle: {
    borderBottomWidth: 1,
    paddingVertical: AppSizes.paddingSml,
    paddingHorizontal: AppSizes.paddingMedium
  },
  dialogTitleText: {
    fontSize: AppSizes.fontXMedium,
    fontWeight: '600'
  },
  dialogBody: {
    paddingHorizontal: AppSizes.paddingSml
  },
  dialogInput: {
    height: AppSizes.paddingSml * 5,
    fontSize: AppSizes.fontXMedium
  },
  dialogFooter: {
    borderTopWidth: AppSizes.paddingXXTiny,
    flexDirection: 'row',
  },
  dialogAction: {
    flex: 1,
    padding: AppSizes.paddingMedium
  },
  dialogActionText: {
    fontSize: AppSizes.paddingXMedium,
    textAlign: 'center',
    color: '#006dbf'
  }
});
