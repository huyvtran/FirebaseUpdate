import Languages from "../modules/setting/languages/Languages";
import IconAssets from "../assets/IconAssets";
import ImageAssets from "../assets/ImageAssets";

export default {
  DEV_MODE: true,

  USER_TEST: "lk0618d001",
  PASS_TEST: "Manh@12345678",

  //gộm tríp data ngày 01/10/2020
  // USER_TEST: "lk0219d006",
  // PASS_TEST: "Trong@12345678",

  // USER_TEST: "lk0618d005",
  // PASS_TEST: "V$2dCxu4",

  //tài khoản thuộc nhóm không có quyền move order/stop
  // USER_TEST: "hc0518d001",
  // PASS_TEST: "uwZf@2X3",

  //tk thuộc mô hình PDP, WMS (tk của aosmith, PGV)
  // USER_TEST: "2965",
  // PASS_TEST: "12345678",

  // USER_TEST: 'mdriver025',
  // PASS_TEST: 'Mdriver025$',
  // USER_TEST: 'taixe_1.3',
  // PASS_TEST: 'Dong@1234',

  VERSION_MODE: "-DEV",

  PROTOCOL: "https://",
  PROTOCOL_UNSECURITY: "http://",

  DEV_ENDPOINT: "vapp.codev.abivin.vn",
  TEST_ENDPOINT: "vapp.cotest.abivin.vn",
  PRODUCTION_ENDPOINT: "vapp.abivin.com",
  CUSTOMIZE_ENDPOINT: "vapp.d4.abivin.vn",

  TEST_SERVER: "Test",
  DEV_SERVER: "Development",
  CUSTOMIZE_SERVER: "Customization",
  PRO_SERVER: "Product",

  DRAWER_BUTTON_DEFAULT: IconAssets.iconPerson,
  SPLASH_SCREEN: ImageAssets.imgLaunchScreenAbivin,
  APP_ICON: ImageAssets.imgLogoAbivin,
  APP_NAME: "Abivin vRoute",


  LANGUAGE_DEFAULT: Languages.ENGLISH,

  IMEI_NUMBER: "085743686566",
  isForceLockPortrait: true,

  isRunLog: false,

  androidPackageId: "com.abivin.vappx",

  showTimeResponse: true,

  PRODUCTION_MODE: false,

}; 