const app = {
  background: 'rgba(250,250,250,1.0)',
  nav: '#344050',
  cardBackground: '#FFFFFF',
  listItemBackground: '#FFFFFF',
  imageBackground: '#d6d6d6',
  imageIconBackGround: '#A0ABBE',
  blackTrans: 'rgba(0,0,0,0.7)',
  pink: '#FF5656',
  orange: '#EE8432',
  blue: 'rgba(30, 160, 208, 1)',
  hint: '#8A8A8A',
  blueBackground: '#009CD3',
  blueFacebook: '#366AA7',
  blueTwitter: '#55ACEE',
  redGoogle: '#D12122',
  iconGray: 'rgba(180,180,180,1)',
  iconGrayTrans: 'rgba(180,180,180,0.7)',
  lineGray: 'rgba(237,237,237,1)',
  statusbar: '#2b3545',
  darkBlack: '#404040',
  grayDisable: '#d9d9d9',
  yellow: '#F4CF05',
  titleGray: '#535353',
  greenButton: '#59b300',
  blueButton: '#33adff',



  //for app hyndai 
  bg_button: "#002856",

  button_material_dark: "#ff5a595b",
  button_material_light: "#ffd6d7d7",
  cardview_dark_background: "#ff424242",
  cardview_light_background: "#ffffffff",
  cardview_shadow_end_color: "#03000000",
  cardview_shadow_start_color: "#37000000",
  colorAccent: "#0099ff",

  colorGray: "#444444",
  colorBgCopyright: "#002045",
  colorTabCenterDetail: "#001124",

  greySight: '#9E9EA1',
  white: 'rgba(255,255,255,1)',
  black: 'rgba(0,0,0,1)',
  transparent: 'rgba(0,0,0,0)',
  green: '#6ACB40',
  cerulean: '#009BD5',
  red: 'rgb(255,68,68)',
  lightgray: '#efefef',
  lightGrayTrans: 'rgba(239, 239,239, 0.2)',
  graytrans: 'rgba(239, 239,239, 0.5)',
  darkgraytrans: 'rgba(239, 239,239, 0.8)',
  gray: '#999',
  darkgray: '#333',
  purple: '#DA439F',
  divider: '#d3dfe4',
  sectionText: '#788793',
  addMoreButton: 'rgba(0, 0, 0, 0.2)',
  abi_blue: '#1B64B0',
  abi_blue_light: '#5c91e2',
  separator: '#DADADA',
  hintText: 'rgba(69,90,100,0.5)',
  textColor: '#455a64',
  spaceGrey: '#455A64',
  greenLight: '#4CAF50',
  orderBlueskin: '#2196f3',
  orderOrangerYellow: '#ff9800',
  orderGreen: '#4caf50',
  orderDark: '#455a64',
  orderRed: '#b6292b',
  orangeLight: '#EA8044',
  grayLight: '#A39D9D',
  naviBlue: '#4390E1'

};

const brand = {
  brand: {
    primary: '#131313',
    secondary: '#17233D',
  },
};

const text = {
  textNavbar: '#fff',
  textPrimary: 'rgba(33,33,33,0.87)',
  textSecondary: '#7A8493',
  textMinor: '#CCCCCC',
  textRed: '#F42F47',
  textBlue: '#00aedd',
  headingPrimary: "#1B64B0",
  headingSecondary: brand.brand.primary,
  textTitle: '#68737f',
  textContent: 'rgba(52, 64, 82, 1)',
  textSubContent: 'rgba(52, 64, 82, 0.5)',
  regular: '#344052',
  placeHolder: 'rgba(0,0,0,0.3)'
};

const borders = {
  border: '#DDE3E8',
};

const ticked = {
  ticked: '#39CE13',
};

const tabbar = {
  tabbar: {
    background: { active: '#f9f9f9', inactive: '#f9f9f9' },
  },
};

const navbar = {
  navbar: {
    background: '#002856'
  }
}

const bottomBar = {
  selectedColor: '#51A8E6',
  normalColor: '#7E8894'
}

const searchbar = {
  searchbar: {
    background: '#343f51',
    textInput: '#9FADB4',
    backgroundText: '#434F61',
  }
}

const dialog = {
  dialogBody: 'rgba(238, 241, 242, 1)',
  dialogDivider: 'rgba(205, 217, 223, 1)',
}

const marker = {
  blueMarker: '#1b64b0',
  greenMarker: '#28a745',
  ornagerMarker: '#ff9e42',
  redMarker: '#ff4444'
}



export default {
  ...bottomBar,
  ...searchbar,
  ...dialog,
  ...app,
  ...text,
  ...borders,
  ...tabbar,
  ...navbar,
  ...marker,
  ...brand,
}; 
