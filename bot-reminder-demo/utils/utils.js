const Constants = require('./constants')

function parse_date_cron(text) {
    if (!text) return null
    let type = Constants.DATE_TYPE.INVALID
    let date = null;
    if (text.indexOf('.') > -1) {
        type = Constants.DATE_TYPE.MONTH
        date = valid_month(text)
    } else if (text.indexOf(' ') > -1) {
        type = Constants.DATE_TYPE.DAY
        date = valid_day(text)
    } else if (text.indexOf(':') > -1) {
        type = Constants.DATE_TYPE.HOUR
        date = valid_hour(text)
    }

    return generate_cron_by_type(date, type)
}

function generate_cron_by_type(date, type) {
    // console.log(`date: ${date}, type : ${type}`)
    if (date == null) return null;
    let cron = null;
    switch(type) {
        case Constants.DATE_TYPE.MONTH:
            cron = generate_date_cron(date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            break;
        case Constants.DATE_TYPE.DAY:
            cron = generate_date_cron(null, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
            break;
        case Constants.DATE_TYPE.HOUR:
            cron = generate_date_cron(null, null, date.getHours(), date.getMinutes(), date.getSeconds());
            break;
        default:
            break;
    }
    return cron;
}

function valid_hour(value) {
    var matches = value.match(/^(\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    // console.log('matches : ' + matches)
    if (matches === null) {
        return null;
    } else {
        var hour = parseInt(matches[1], 10);
        var minute = parseInt(matches[2], 10);
        var second = parseInt(matches[3], 10);
        var date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), hour, minute, second);

        // console.log('hour: ' + hour)
        // console.log('minute: ' + minute)
        // console.log('second: ' + second)

        if (date.getHours() !== hour
          || date.getMinutes() !== minute
          || date.getSeconds() !== second
        ) {
           return null;
        } else {
           return date;
        }
    }
}

function valid_day(value) {
    var matches = value.match(/^(\d{1,2})\ (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    // console.log('matches : ' + matches)
    if (matches === null) {
        return null;
    } else {
        var day = parseInt(matches[1], 10);
        var hour = parseInt(matches[2], 10);
        var minute = parseInt(matches[3], 10);
        var second = parseInt(matches[4], 10);
        var date = new Date(new Date().getFullYear(), new Date().getMonth(), day, hour, minute, second);

        // console.log('day: ' + day)
        // console.log('hour: ' + hour)
        // console.log('minute: ' + minute)
        // console.log('second: ' + second)

        if (date.getDate() !== day
          || date.getHours() !== hour
          || date.getMinutes() !== minute
          || date.getSeconds() !== second
        ) {
           return null;
        } else {
           return date;
        }
    }
}

function valid_month(value) {
    var matches = value.match(/^(\d{1,2})\.(\d{1,2})\ (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
    // console.log('matches : ' + matches)
    if (matches === null) {
        return null;
    } else {
        // now lets check the date sanity
        var month = parseInt(matches[2], 10) - 1; // months are 0-11
        var day = parseInt(matches[1], 10);
        var hour = parseInt(matches[3], 10);
        var minute = parseInt(matches[4], 10);
        var second = parseInt(matches[5], 10);
        var date = new Date(new Date().getFullYear(), month, day, hour, minute, second);

        // console.log('month: ' + month)
        // console.log('day: ' + day)
        // console.log('hour: ' + hour)
        // console.log('minute: ' + minute)
        // console.log('second: ' + second)

        if (date.getMonth() != month
          || date.getDate() !== day
          || date.getHours() !== hour
          || date.getMinutes() !== minute
          || date.getSeconds() !== second
        ) {
           return null;
        } else {
           return date;
        }
    }
}

// */5 * * * * 0-6
function generate_date_cron(month, day, hour, minute, second) {
    let ret = '';
    second != null ? ret += second : ret += '*';
    minute != null ? ret += ' ' + minute : ret += ' *';
    hour != null ? ret += ' ' + hour : ret += ' *';
    day != null ? ret += ' ' + day : ret += ' *';
    month != null ? ret += ' ' + month : ret += ' *';
    ret += ' *';
    console.log(ret);
    return ret;
}

module.exports.parse_date_cron = parse_date_cron;

// var t = '12 9:2:11';
// console.log(parse_date_cron(t))
// console.log(Constants.DATE_TYPE.HOUR)
