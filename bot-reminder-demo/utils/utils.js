const Constants = require("./constants");

function get_type_date_by_time(text) {
  if (!text) return null;
  let type = Constants.DATE_TYPE.INVALID;
  let date = null;
  if (text.indexOf(".") > -1) {
    type = Constants.DATE_TYPE.MONTH;
    date = valid_month(text);
  } else if (text.indexOf(" ") > -1) {
    type = Constants.DATE_TYPE.DAY;
    date = valid_day(text);
  } else if (text.indexOf(":") > -1) {
    type = Constants.DATE_TYPE.HOUR;
    date = valid_hour(text);
  }

  return [type, date];
}

function generate_str_by_time(text) {
  let arr = get_type_date_by_time(text);
  let type = arr[0];
  let date = arr[1];
  if (type == Constants.DATE_TYPE.INVALID) return null;

  let dd = addPrefixTime(date.getDate());
  let mm = addPrefixTime(date.getMonth() + 1);
  let hh = addPrefixTime(date.getHours());
  let mi = addPrefixTime(date.getMinutes());
  let ss = addPrefixTime(date.getSeconds());

  let str = null;
  switch (type) {
    case Constants.DATE_TYPE.MONTH:
      str = dd + "." + mm + " " + hh + ":" + mi + ":" + ss;
      break;
    case Constants.DATE_TYPE.DAY:
      str = dd + " " + hh + ":" + mi + ":" + ss;
      break;
    case Constants.DATE_TYPE.HOUR:
      str = hh + ":" + mi + ":" + ss;
      break;
    default:
      break;
  }
//   console.log(`generate_str_by_time : ${str}`);
  return str;
}

function generate_cron_by_time(text) {
  let arr = get_type_date_by_time(text);
  let type = arr[0];
  let date = arr[1];

  if (type === Constants.DATE_TYPE.INVALID || date === null) return null;

  let cron = null;
  switch (type) {
    case Constants.DATE_TYPE.MONTH:
      cron = generate_date_cron(
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      );
      break;
    case Constants.DATE_TYPE.DAY:
      cron = generate_date_cron(
        null,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      );
      break;
    case Constants.DATE_TYPE.HOUR:
      cron = generate_date_cron(
        null,
        null,
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      );
      break;
    default:
      break;
  }
//   console.log(`generate_cron_by_time : ${cron}`);
  return cron;
}

function parse_date_to_str(date) {
    let dd = addPrefixTime(date.getDate());
    let mm = addPrefixTime(date.getMonth() + 1);
    // let yyyy = date.getFullYear();
    let hh = addPrefixTime(date.getHours());
    let mi = addPrefixTime(date.getMinutes());
    let ss = addPrefixTime(0);
  
    let str_month = dd + "." + mm + " " + hh + ":" + mi + ":" + ss;
    let str_day = dd + " " + hh + ":" + mi + ":" + ss;
    let str_hour = hh + ":" + mi + ":" + ss;
    return [str_month, str_day, str_hour];
  }
  

function addPrefixTime(param) {
  return param < 10 ? "0" + param : param;
}

function valid_hour(value) {
  var matches = value.match(/^(\d{1,2}):(\d{1,2})$/);
  // console.log('matches : ' + matches)
  if (matches === null) {
    return null;
  } else {
    var hour = parseInt(matches[1], 10);
    var minute = parseInt(matches[2], 10);
    var date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      hour,
      minute,
      0
    );

    // console.log('hour: ' + hour)
    // console.log('minute: ' + minute)

    if (
      date.getHours() !== hour ||
      date.getMinutes() !== minute
    ) {
      return null;
    } else {
      return date;
    }
  }
}

function valid_day(value) {
  var matches = value.match(/^(\d{1,2})\ (\d{1,2}):(\d{1,2})$/);
  // console.log('matches : ' + matches)
  if (matches === null) {
    return null;
  } else {
    var day = parseInt(matches[1], 10);
    var hour = parseInt(matches[2], 10);
    var minute = parseInt(matches[3], 10);
    var date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      day,
      hour,
      minute,
      0
    );

    // console.log('day: ' + day)
    // console.log('hour: ' + hour)
    // console.log('minute: ' + minute)

    if (
      date.getDate() !== day ||
      date.getHours() !== hour ||
      date.getMinutes() !== minute
    ) {
      return null;
    } else {
      return date;
    }
  }
}

function valid_month(value) {
  var matches = value.match(
    /^(\d{1,2})\.(\d{1,2})\ (\d{1,2}):(\d{1,2})$/
  );
  // console.log('matches : ' + matches)
  if (matches === null) {
    return null;
  } else {
    // now lets check the date sanity
    var month = parseInt(matches[2], 10) - 1; // months are 0-11
    var day = parseInt(matches[1], 10);
    var hour = parseInt(matches[3], 10);
    var minute = parseInt(matches[4], 10);
    var date = new Date(
      new Date().getFullYear(),
      month,
      day,
      hour,
      minute,
      0
    );

    // console.log('month: ' + month)
    // console.log('day: ' + day)
    // console.log('hour: ' + hour)
    // console.log('minute: ' + minute)

    if (
      date.getMonth() != month ||
      date.getDate() !== day ||
      date.getHours() !== hour ||
      date.getMinutes() !== minute
    ) {
      return null;
    } else {
      return date;
    }
  }
}

// */5 * * * * 0-6
function generate_date_cron(month, day, hour, minute, second) {
  let ret = "";
  second != null ? (ret += second) : (ret += "*");
  minute != null ? (ret += " " + minute) : (ret += " *");
  hour != null ? (ret += " " + hour) : (ret += " *");
  day != null ? (ret += " " + day) : (ret += " *");
  month != null ? (ret += " " + month) : (ret += " *");
  ret += " *";

  console.log(ret);
  return ret;
}

module.exports.generate_str_by_time = generate_str_by_time;
module.exports.generate_cron_by_time = generate_cron_by_time;
module.exports.get_type_date_by_time = get_type_date_by_time;
module.exports.parse_date_to_str = parse_date_to_str;

// var t = '9:2:11';
// console.log(generate_str_by_time(t))
// console.log(Constants.DATE_TYPE.HOUR)
