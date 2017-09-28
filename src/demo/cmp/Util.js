export function isEmpty(str) {
    return (str == null || '' === str);
}

export function isNotEmpty(str) {
    return !isEmpty(str);
}

export function displayError(messages) {
    if (messages || messages.length < 1) {
        return;
    }

}

export function formatDate(date, format) {
    if (!format) {
        format = 'YYYY-MM-DD';
    }
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) {
            format = format.replace(/S/, milliSeconds.substring(i, i + 1));
        }
    }
    return format;
};

export function createRandomStr(len) {
    // 生成する文字列に含める文字セット
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";

    var cl = c.length;
    var r = "";
    for (var i = 0; i < len; i++) {
        r += c[Math.floor(Math.random() * cl)];
    }
    return r;
}

export function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}
