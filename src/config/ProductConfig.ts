import IconAssets from '../assets/IconAssets';
import ImageAssets from '../assets/ImageAssets';
import Languages from '../modules/setting/languages/Languages';

export default {
    PRODUCTION_MODE: true,
    PRODUCTION_ENDPOINT: 'https://vapp.abivin.com',
    // PRODUCTION_ENDPOINT: 'https://vapp.p4.abivin.vn/',
    VERSION_MODE: '-RL',
    DRAWER_BUTTON_DEFAULT: IconAssets.iconPerson,
    SPLASH_SCREEN: ImageAssets.imgLaunchScreenAbivin,
    APP_ICON:ImageAssets.imgLogoAbivin,

    APP_NAME: 'Abivin vRoute',

    LANGUAGE_DEFAULT: Languages.ENGLISH,

    isForceLockPortrait: true,
    isRunLog: true,

    androidPackageId: 'com.abivin.vappx'


}