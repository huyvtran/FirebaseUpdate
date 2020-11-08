import LanguagesStorage from './index'
import I18n from 'react-native-i18n';
import Languages from './Languages';
import store from '../../../store/store';
import _ from 'lodash'
import AppConfig from '../../../config/AppConfig';

export const Localize = (text:string):string => {
    I18n.fallbacks = true;
    I18n.translations = LanguagesStorage;

    const storeApp = store.getState();
    const locale = storeApp.i18n.locale

    if (_.isEmpty(locale) || (!locale.includes(Languages.ENGLISH) && !locale.includes(Languages.VIETNAMESE) && !locale.includes(Languages.MYANMAR) && !locale.includes(Languages.INDONESIA))) {
        I18n.locale = AppConfig.LANGUAGE_DEFAULT;
    } else {
        I18n.locale = locale;
    }
    return I18n.t(text, {});
};

export const LocalizeReplace = (text:string, replaceText:any):string => {
    return Localize(text).replace("#", replaceText);
}
