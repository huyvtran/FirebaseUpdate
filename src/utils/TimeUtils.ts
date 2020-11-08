// show time ago
import Moment from 'moment';
import _ from 'lodash';

const MIN_IN_MILIS = 60 * 1000;
const HOUR_IN_MILIS = 60 * MIN_IN_MILIS;
const DAY_IN_MILIS = 24 * HOUR_IN_MILIS;
const MONTH_IN_MILIS = 30 * DAY_IN_MILIS;
const YEAR_IN_MILIS = 365 * DAY_IN_MILIS;

const SIMPLE_DATE_FORMAT = 'DD/MM/YYYY';
const SIMPLE_TIME_24_FORMAT = 'H:mm';
const STOP_TIME_FORMAT = 'mM:ss:SS';
const DOB_FORMAT = 'DD MMM YY';
const SIMPLE_DATE_TIME_FORMAT = 'H:mm DD MMM YY';
const SIMPLE_DATE_TIME_FULL_FORMAT = 'HH:mm DD MMM YYYY';
const DATE_TIME_FORMAT = 'DD MMM YY HH:mm';
const DATE_TIME_ISO_FORMAT = 'DD-MM-YYYY HH:mm';
const HALF_OF_DAY = 12 * 60 * 60 * 1000;
//29 May 16
function simpleDateFormat(timeInMillis) {
    let date = new Date(timeInMillis);
    return date ? Moment(date).format(SIMPLE_DATE_FORMAT) : '';
}

function timeAgo(timeInMilis) {
    const date = new Date();
    const diff = date.getTime() - timeInMilis;

    if (diff >= YEAR_IN_MILIS) {
        const noOfYear = Math.round(diff / YEAR_IN_MILIS);
        return noOfYear > 1 ? `${noOfYear} years ago` : `${noOfYear} year ago`;
    }
    if (diff >= MONTH_IN_MILIS) {
        const noOfMonth = Math.round(diff / MONTH_IN_MILIS);
        return noOfMonth > 1 ? `${noOfMonth} months ago` : `${noOfMonth} month ago`;
    }
    if (diff >= DAY_IN_MILIS) {
        const noOfDay = Math.round(diff / DAY_IN_MILIS);
        return noOfDay > 1 ? `${noOfDay} days ago` : `${noOfDay} day ago`;
    }
    if (diff >= HOUR_IN_MILIS) {
        const noOfHour = Math.round(diff / HOUR_IN_MILIS);
        return noOfHour > 1 ? `${noOfHour} hours ago` : `${noOfHour} hour ago`;
    }
    if (diff >= MIN_IN_MILIS) {
        const noOfMin = Math.round(diff / MIN_IN_MILIS);
        return noOfMin > 1 ? `${noOfMin} minutes ago` : `${noOfMin} minute ago`;
    }
    return 'just now';
}

function timeToHHMMSS(timeMilis) {
    let hours = Math.floor(timeMilis / 3600);
    let minutes = Math.floor((timeMilis - (hours * 3600)) / 60);
    let seconds = Math.floor(timeMilis - (hours * 3600) - (minutes * 60));

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    // return hours + ':' + minutes + ':' + seconds;
    if (hours > 0) {
        return `${hours}:${minutes}:${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

function timeToHHMM(timeMilis) {
    let date = new Date(timeMilis);
    return Moment(date).format(SIMPLE_TIME_24_FORMAT);
}

function dateToHHMM(date) {
    return Moment(date).format(SIMPLE_TIME_24_FORMAT);
}

function dateToDDMM(date) {
    return Moment(date).format('DD/MM');
}

function timeToDDDMMMYY(timeMilis) {
    let date = new Date(timeMilis);
    let a = Moment();
    let b = Moment(timeMilis);
    let diff = a.diff(b, 'days');
    if (diff === 0) {
        return Moment(date).format('hh:mm');
    }
    if (diff === 1) {
        return 'yesterday';
    }
    return Moment(date).format('ddd DD MMM YY');
}

function timeTodddDDMMMYY(timeMilis) {
    let date = new Date(timeMilis);
    return Moment(date).format('ddd DD MMM YY');
}

function timeTodddDDMMM(timeMilis) {
    let date = new Date(timeMilis);
    return Moment(date).format('ddd DD MMM');
}

function timeDob(timeMilis) {
    if (timeMilis == null) {
        return Moment(0).format('DD MMM YY');
    }
    if (timeMilis < 0) {
        return Moment(0).add(100, 'year').add(timeMilis, 'ms').format('DD MMM YY');
    }
    return Moment(timeMilis).format('DD MMM YY');
}


function dateWithFormat(date, format) {
    return Moment(date).format(format);
}

function getDiffYears(firstDay, lastDay) {
    let a = Moment(firstDay);
    let b = Moment(lastDay);
    return a.diff(b, 'years');
}

function getDiffDays(firstDay, lastDay) {
    let a = Moment(firstDay).startOf('day');;
    let b = Moment(lastDay).startOf('day');;
    return a.diff(b, 'days');
}

function getStartOfDay(timeMilis) {
    var start = new Date(timeMilis);
    start.setHours(0, 0, 0, 0);
    return start.getTime();
}

function getEndOfDay(timeMilis) {
    var end = new Date(timeMilis);
    end.setHours(23, 59, 59, 999);
    return end.getTime();
}

function simpleDateTimeFormat(timeInMillis) {
    let date = new Date(timeInMillis);
    return date ? Moment(date).format(SIMPLE_DATE_TIME_FORMAT) : '';
}

function toTimeFromMinute(minutes) {
    const formattedHours = ('0' + Math.floor(minutes / 60)).slice(-2);
    const formattedMinutes = ('0' + Math.floor(minutes % 60)).slice(-2);
    return formattedHours + ':' + formattedMinutes;
}

function getTotalMinuteFromStartOfDay(timeInMillis) {
    const date = new Date(timeInMillis);
    return getMinutesFromStartOfDay(date.getHours(), date.getMinutes());
}

function getMinutesFromStartOfDay(hourOfDay, minute) {
    return hourOfDay * 60 + minute;
}
function roundMiliToMinute(milisecconds) {
    return 60000 * Math.round(milisecconds / 60000)
}

function mediaTimeTitle() {
    return Moment().format('DD MMM YY');
}

function getMiliSecondInDay() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();
    var mi = now.getMilliseconds();
    return h * HOUR_IN_MILIS + m * MIN_IN_MILIS + s * 1000 + mi
}

export {
    simpleDateTimeFormat, simpleDateFormat, timeAgo, timeToHHMMSS, timeToDDDMMMYY,
    timeDob, getDiffYears, dateWithFormat, getStartOfDay, getEndOfDay, timeToHHMM, timeTodddDDMMMYY, HALF_OF_DAY, SIMPLE_DATE_FORMAT,
    toTimeFromMinute, getDiffDays, getTotalMinuteFromStartOfDay,
    DATE_TIME_FORMAT, DOB_FORMAT, timeTodddDDMMM, roundMiliToMinute, mediaTimeTitle,
    getMiliSecondInDay,
    dateToHHMM, dateToDDMM,
    SIMPLE_DATE_TIME_FORMAT,
    SIMPLE_DATE_TIME_FULL_FORMAT,
    DATE_TIME_ISO_FORMAT
};
