exports.roundDownToTwoDecimals = function(number) {
    return Math.floor(number * 100) / 100;
};

exports.roundDownToFourDecimals = function(number) {
    return Math.floor(number * 10000) / 10000;
};

exports.formatDate = function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
};
