import * as LocalStorage from './LocalStorage'
import AppConfig from '../config/AppConfig';
import _ from 'lodash'

export const SERVER_DATA = [
  {
    server: AppConfig.TEST_SERVER,
    host: AppConfig.TEST_ENDPOINT,
  },
  {
    server: AppConfig.DEV_SERVER,
    host: AppConfig.DEV_ENDPOINT,
  },
  {
    server: AppConfig.PRO_SERVER,
    host: AppConfig.PRODUCTION_ENDPOINT,
  },
  {
    server: AppConfig.CUSTOMIZE_SERVER,
    host: AppConfig.CUSTOMIZE_ENDPOINT,
  }
]
const INIT_DATA = {
  server: AppConfig.TEST_SERVER,
  host: AppConfig.TEST_ENDPOINT,
  protocol: AppConfig.PROTOCOL,
  imeiNumber: AppConfig.IMEI_NUMBER,
  showTimeResponse: AppConfig.showTimeResponse
}

const DynamicServerStore = {
  dynamicServer: INIT_DATA
};

const DYNAMIC_SERVER = 'dynamicServer';

class DynamicServerManager{

  public static initialize = () => {
    return LocalStorage.get(DYNAMIC_SERVER, (error, result) => {
      DynamicServerStore.dynamicServer = _.isEmpty(result) ? INIT_DATA : JSON.parse(result);
    });
  };
  
  public static saveDynamicServer = (dynamicServer) => {
    DynamicServerStore.dynamicServer = dynamicServer;
    return LocalStorage.set(DYNAMIC_SERVER, dynamicServer);
  };
  
  public static clear = () => {
    DynamicServerStore.dynamicServer = null;
    LocalStorage.remove(DYNAMIC_SERVER);
  };
  
  public static getDynamicServer = () => {
    return DynamicServerStore.dynamicServer;
  };
}
export default DynamicServerManager;