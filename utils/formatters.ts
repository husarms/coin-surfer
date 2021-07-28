export function roundDownToOneDecimal(number: number) {
    return Math.floor(number * 10) / 10;
}

export function roundDownToTwoDecimals(number: number) {
    return Math.floor(number * 100) / 100;
}

export function roundDownToFourDecimals(number: number) {
    return Math.floor(number * 10000) / 10000;
}

export function getDateMMddyyyyHHmmss() {
    const now = new Date();
    return now.toLocaleString().replace(",", "");
}

export function formatDateMMddyyyyHHmmss(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString().replace(",", "");
}

export function getDateyyyyMMddHHmmss() {
    const now = new Date();
    let d = new Date(now),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();
    let hour = "" + d.getHours();
    let min = "" + d.getMinutes();
    let sec = "" + d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hour.length < 2) hour = "0" + hour;
    if (min.length < 2) min = "0" + min;
    if (sec.length < 2) sec = "0" + sec;

    var result = [year, month, day].join("");

    return result + "-" + hour + min + sec;
}
