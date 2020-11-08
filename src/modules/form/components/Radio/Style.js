import AppSizes from '../../../../theme/AppSizes';
const React = require('react');
const ReactNative = require('react-native');

const {
  StyleSheet,
} = ReactNative;

const Style = StyleSheet.create({
  radioForm: {
  },

  radioWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: AppSizes.paddingXXSml,
  },
  radio: {
    justifyContent: 'center',
    alignItems: 'center',

    width: AppSizes.paddingSml * 3,
    height: AppSizes.paddingSml * 3,

    alignSelf: 'center',

    borderColor: '#2196f3',
    borderRadius: AppSizes.paddingSml * 3,
  },

  radioLabel: {
    paddingLeft: AppSizes.paddingSml,
    lineHeight: AppSizes.paddingSml * 2,
  },

  radioNormal: {
    borderRadius: AppSizes.paddingSml,
  },

  radioActive: {
    width: AppSizes.paddingSml * 2,
    height: AppSizes.paddingSml * 2,
    backgroundColor: '#2196f3',
  },

  labelWrapStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },

  labelVerticalWrap: {
    flexDirection: 'column',
    paddingLeft: AppSizes.paddingSml,
  },

  labelVertical: {
    paddingLeft: 0,
  },

  formHorizontal: {
    flexDirection: 'row',
  },
});

module.exports = Style;
