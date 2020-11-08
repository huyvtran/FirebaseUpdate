import Languages from "./Languages";
import LanguagesStorage from './index'
import _ from 'lodash'
export function getListLanguages() {
    const languages = Languages;
    const listLanguages = _.map(languages, lang => {
        
        return {
            key: lang,
            language: LanguagesStorage[lang].language
        };
    })

    return listLanguages;
}