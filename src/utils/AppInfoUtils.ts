import { Platform } from 'react-native';
import AppConfig from '../config/AppConfig';

const storeSpecificId = Platform.OS === 'ios'
    ? '1314836746'
    : AppConfig.androidPackageId


const getUrlStore = () => {
    const urlAppStore = `itms://itunes.apple.com/us/app/apple-store/id${storeSpecificId}?mt=8`
    const urlPlayStore = `market://details?id=${storeSpecificId}`

    return Platform.OS == 'ios' ? urlAppStore : urlPlayStore;
}

export default { storeSpecificId, getUrlStore }