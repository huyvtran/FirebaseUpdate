import _ from "lodash";
import { Actions } from "react-native-router-flux";
import Toast from "../components/Toast";
import AppConfig from "../config/AppConfig";
import Messages from "../constant/Messages";
import { logout } from "../modules/authentication/actions/creater/auth";
import { Localize } from "../modules/setting/languages/LanguageManager";
import Languages from "../modules/setting/languages/Languages";
import store from "../store/store";
import AlertUtils from "../utils/AlertUtils";
const UNAUTHORIZE = 401;
const FORCE_UPDATE_APP = 423;
const SERVER_ERROR = 502;
const CodeTimeout = "ECONNABORTED";
const MessageTimeout = "timeout of 120000ms exceeded";
const networkError = "Network Error";
const FORCE_LOGIN = 307;
const INVALID_TOKEN = 440;

const DEBUG = __DEV__;

let timeStart = 0;
export const OneDeviceConfigInterceptor = {
  oneDeviceConfig: asyncconfig => {
    const storeApp = store.getState();
    const oneDeviceSignInActivated = storeApp?.user?.orgConfig?.configurations ?? false;
    config.data.oneDeviceSignInActivated = oneDeviceSignInActivated;
    return config;
  },

  onRejected: error => {
    return Promise.reject(error);
  },
};

export const AccessTokenInterceptor = {
  addAccessToken: config => {
    const accessToken = store.getState().user.token;

    if (accessToken) {
      const headers = { ...config.headers, "x-access-token": accessToken, "Content-Type": "application/json" };
      config.headers = headers;
    }

    return config;
  },

  onRejected: error => {
    return Promise.reject(error);
  },
};

export const AppVersionInterceptor = {
  appVersion: async config => {
    const version = AppConfig.appVersion;
    if (version) {
      const data = { ...config.data, version };
      config.data = data;
    }

    return config;
  },

  onRejected: error => {
    return Promise.reject(error);
  },
};

export const DevConfigInterceptor = {
  devConfig: async config => {
    if (AppConfig.DEV_MODE) {
      config.headers.isDev = true;
    }
    return config;
  },
  onRejected: error => {
    return Promise.reject(error);
  },
};

export const LanguageInterceptor = {
  addLanguage: config => {
    const storeApp = store.getState();
    let locale = storeApp.i18n.locale;
    if (_.isEmpty(locale)) {
      locale = Languages.ENGLISH;
    }
    const headerLang = { ...config.headers, "Content-Language": locale };
    const newData = { ...config.data, lang: locale, isMobile: true };

    config.headers = headerLang;
    config.data = newData;

    return config;
  },

  onRejected: error => {
    return Promise.reject(error);
  },
};


export const LogInterceptor = {

  requestLog: config => {
    if (DEBUG) {
      console.log(`>>> ${config.method}: ${config.url}`);
      console.log(">>> config.data: ", config.data);
      console.log("requestLog config.headers>>", config.headers);
    }
    timeStart = new Date();
    return config;
  },

  requestError: error => {
    if (DEBUG) {
      console.log("requestError error>>", error);
    }
    return Promise.reject(error);
  },

  responseLog: response => {
    if (DEBUG) {
      if (!response) {
        return;
      }
      const config = response.config;
      if (!config) {
        return;
      }
      console.log(`<<< ${response} ${config.method}: ${config.url}`);
      console.log("responseLog: ", response);
    }
    Toast.show(`${response.config.url} + ${new Date() - timeStart} ms`);
    return response;
  },

  responseError: error => {
    if (DEBUG && error) {
      const config = error.config;
      const response = error.response;
      if (response) {
        console.log(`<<< ${response.status} ${config.method}: ${config.url}`);
        console.log("responseError: ", response);
      } else {
        console.log(`<<< ${config.method}: ${config.url}`);
        console.log("network log error", error);
      }
    }
    return Promise.reject(error);
  },

};

export const UnauthorizeInterceptor = {
  onFullfilled: response => {
    return Promise.resolve(response);
  },

  onRejected: error => {
    if (error) {
      if (error && error.response && error.response.status === UNAUTHORIZE) {
        const message = error?.response?.data?.message;
        const messageAlert = _.isEmpty(message) ? Messages.somethingWentWrong : Messages.incorrectUserOrPass;
        AlertUtils.showError(messageAlert);
        return Promise.reject(error);
      } else if (error && error.response && error.response.status === FORCE_UPDATE_APP) {
        Actions.reset("forceUpdate");
        return Promise.reject(error);
      } else if ((error.code === CodeTimeout && error.message === MessageTimeout)) {
        const errorMobile = {
          ...error,
          message: Localize(Messages.notResponseServer),
        };
        return Promise.reject(errorMobile);
      } else if (error && error.response && error.response.status === SERVER_ERROR) {
        const errorMobile = {
          ...error,
          message: Localize(Messages.serverError),
        };
        return Promise.reject(errorMobile);
      } else if (error && error.message === networkError) {
        const errorMobile = {
          ...error,
          message: Localize(Messages.networkFail),
        };
        return Promise.reject(errorMobile);
      } else if (error && error.response && (error.response.status === FORCE_LOGIN || error.response.status === INVALID_TOKEN)) {
        AlertUtils.showError(Messages.invalidToken);
        store.dispatch(logout());
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  },
};