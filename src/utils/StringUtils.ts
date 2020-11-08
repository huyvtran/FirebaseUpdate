import _ from 'lodash'
import TaskHelper from '../modules/task/helper/TaskHelper';
import { Localize } from '../modules/setting/languages/LanguageManager';
import messages from '../constant/Messages';

const isFloatNumberFormat = (text) => {
    return text.match(/^-?\d*(\.\d+)?$/);
}

const isIntergerNumberFormat = (text) => {
    return text.match(/^[0-9]+$/);
}

const isSerialFormat = (text) => {
    return !text.includes('.') && !text.includes(',')
}

const splitCamelCaseToTitleCase = (camelCase) => {

    if (_.isEmpty(camelCase)) {
        return '';
    }
    return camelCase.replace(/([a-z](?=[A-Z]))/g, '$1 ');
}

const moneyFormat = n => `${n ? Number(n).toFixed(0).replace(/./g, (c, i, a) => (i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? `.${c}` : c)) : '0'}`;

const moneyFormatCurrency = n => {
    return moneyFormat(n) + ' ' + Localize(messages.currencyLocal)
}
const calculateFormularString = (fn) => {
    return new Function('return ' + fn)();
}

const reverse = (s) => {
    return s.split("").reverse().join("");
}


const isValidateContainerNumber = (con) => {
    if (_.isEmpty(con)) return false

    // const containerNumber = containerNumberParam.toUpperCase()
    if (!con || con == "" || con.length != 11) { return false; }
    con = con.toUpperCase();
    var re = /^[A-Z]{4}\d{7}/;
    if (re.test(con)) {
        var sum = 0;
        for (let i = 0; i < 10; i++) {
            var n = con.substr(i, 1);
            if (i < 4) {
                n = "0123456789A?BCDEFGHIJK?LMNOPQRSTU?VWXYZ".indexOf(con.substr(i, 1));
            }
            n *= Math.pow(2, i); //2的i次方
            sum += n;
        }
        if (con.substr(0, 4) == "HLCU") {
            sum -= 2;
        }
        sum %= 11;
        sum %= 10;
        return sum == con.substr(10);
    } else {
        return false;
    }

}

const isContainUpperCaseLetter = (string) => {
    return string.match(/.*[A-Z].*/)
}

const isContainLowerCaseLetter = (string) => {
    return string.match(/.*[a-z].*/)
}

const isContainDigit = (string) => {
    return string.match(/.*\d.*/)
}
const isContainNonWord = (string) => {
    return string.match(/.*\W.*/)
}

const isMoreThan8Char = (string) => {
    return !_.isEmpty(string) && string.length >= 8
}

const isAllDigit = (string) => {
    return /^\d+$/.test(string)
}

const isAllCharacter = (string) => {
    return /^[a-zA-Z]+$/.test(string)
}

export default {
    isFloatNumberFormat,
    isIntergerNumberFormat,
    isSerialFormat,
    splitCamelCaseToTitleCase,
    moneyFormat,
    calculateFormularString,
    reverse,
    isValidateContainerNumber,
    isContainUpperCaseLetter,
    isContainLowerCaseLetter,
    isContainDigit,
    isContainNonWord,
    isMoreThan8Char,
    isAllDigit,
    isAllCharacter,
    moneyFormatCurrency
}
