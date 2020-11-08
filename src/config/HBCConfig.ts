import DevConfig from './DevConfig'
import Languages from '../modules/setting/languages/Languages';
import IconAssets from '../assets/IconAssets';
import ImageAssets from '../assets/ImageAssets';

export default {
    PRODUCTION_MODE: true,

    USER_TEST: '',
    PASS_TEST: '',

    DRAWER_BUTTON_DEFAULT: IconAssets.iconPerson,
    SPLASH_SCREEN: ImageAssets.imgLaunchScreenAbivin,
    APP_ICON:ImageAssets.imgLogoAbivin,

    APP_NAME: 'Abivin vRoute',

    IMEI_NUMBER: '',
    isForceLockPortrait: false,
    isRunLog: false,
    androidPackageId: 'com.abivin.vappx',
    showTimeResponse: true,



    PRODUCTION_ENDPOINT: 'https://hbc.abivin.vn',
    VERSION_MODE: '-RL',
    LANGUAGE_DEFAULT: Languages.VIETNAMESE,


} 