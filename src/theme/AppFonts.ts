/**
 * App Theme - Fonts
 */
import { Platform } from 'react-native';

function lineHeight(fontSize) {
  const multiplier = (fontSize > 20) ? 0.1 : 0.33;
  return parseInt(fontSize + (fontSize * multiplier), 10);
}

const base = {
  size: 14,
  lineHeight: lineHeight(14),
  ...Platform.select({
    ios: {
      family: 'ProximaNova-Regular',
    },
    android: {
      family: 'ProximaNova-Reg',
    },
  }),
};

const semibold = {
  size: 14,
  lineHeight: lineHeight(14),
  ...Platform.select({
    ios: {
      family: 'ProximaNova-SemiBold',
    },
    android: {
      family: 'ProximaNova-Sbold',
    },
  }),
};

const boldItalic = {
  size: 14,
  lineHeight: lineHeight(14),
  ...Platform.select({
    ios: {
      family: 'ProximaNova-Bold',
    },
    android: {
      family: 'ProximaNova-Bold',
    },
  }),
}

const bold = {
  size: 14,
  lineHeight: lineHeight(14),
  ...Platform.select({
    ios: {
      family: 'ProximaNova-Bold',
    },
    android: {
      family: 'ProximaNova-Bold',
    },
  }),
};

const black = {
  size: 14,
  lineHeight: lineHeight(14),
  ...Platform.select({
    ios: {
      family: 'ProximaNova-Bold',
    },
    android: {
      family: 'ProximaNova-Bold',
    },
  }),
};

const light = {
  size: 14,
  lineHeight: lineHeight(14),
  ...Platform.select({
    ios: {
      family: 'ProximaNova-Light',
    },
    android: {
      family: 'ProximaNova-Light',
    },
  }),
};

export default {
  base: { ...base },
  bold: { ...bold },
  semibold: { ...semibold },
  boldItalic: { ...boldItalic },
  black: { ...black },
  light: { ...light },
  h1: { ...bold, size: base.size * 1.75, lineHeight: lineHeight(base.size * 2) },
  h2: { ...bold, size: base.size * 1.5, lineHeight: lineHeight(base.size * 1.75) },
  h3: { ...semibold, size: base.size * 1.25, lineHeight: lineHeight(base.size * 1.5) },
  h4: { ...base, size: base.size * 1.1, lineHeight: lineHeight(base.size * 1.25) },
  h5: { ...base },
  lineHeight: (fontSize) => lineHeight(fontSize),
}