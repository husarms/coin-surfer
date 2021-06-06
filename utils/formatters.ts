export function roundDownToTwoDecimals(number: number) {
    return Math.floor(number * 100) / 100;
}

export function roundDownToFourDecimals(number: number) {
    return Math.floor(number * 10000) / 10000;
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString().replace(",", "");
}
