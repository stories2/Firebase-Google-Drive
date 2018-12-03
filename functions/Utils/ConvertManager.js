exports.date2FormattedDateTimeStr = function (date, format) {
    var dateFormat = require('dateFormat')

    return dateFormat(date, format)
}