export const FormatDate = function (date, fmt) {
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
export const GetHoursAgoDateStr = function (date, n, format) {
    var dd = date || new Date();
    var secends = dd.getTime() - 1000 * 3600 * n;
    var current = new Date();
    current.setTime(secends);
    return format ? FormatDate(current, format) : current;
}

export const ParseDate = function (date_str) {    
    return new Date(Date.parse(date_str.replace(/-/g, "/")));
}

