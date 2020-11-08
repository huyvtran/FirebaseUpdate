import IconAssets from '../assets/IconAssets';
import ImageAssets from '../assets/ImageAssets';
import Languages from '../modules/setting/languages/Languages';

export default {
    PRODUCTION_MODE: true,
    isSNP: true,
    PRODUCTION_ENDPOINT: 'https://vapp.abivin.com',
    // PRODUCTION_ENDPOINT: 'https://snp1.abivin.vn',
    VERSION_MODE: '-RL',

    DRAWER_BUTTON_DEFAULT: IconAssets.iconShip,
    SPLASH_SCREEN: ImageAssets.imgLaunchScreenSnp,
    APP_ICON:ImageAssets.imgAppIconSnp,

    APP_NAME: 'Powered by Abivin',

    LANGUAGE_DEFAULT: Languages.VIETNAMESE,
    isForceLockPortrait: false,
    isRunLog: true, 
    androidPackageId: 'com.abivin.vappx.snp'

}