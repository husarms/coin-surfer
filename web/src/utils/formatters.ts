export const formatNumber = (number: number): string => {
    return (Math.round(number * 100) / 100).toFixed(2);
};

export const formatRoughNumber = (number: number): string => {
    if(number >= 100) {
        return number.toFixed(0);
    }
    return number.toFixed(2);
};
