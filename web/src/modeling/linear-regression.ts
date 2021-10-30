export function getLineOfBestFit(
    values_x: number[],
    values_y: number[]
): { slope: number; lineOfBestFit: number[] } {
    var x_sum = 0;
    var y_sum = 0;
    var xy_sum = 0;
    var xx_sum = 0;
    var count = 0;

    // The above is just for quick access, makes the program faster
    var x = 0;
    var y = 0;
    var values_length = values_x.length;
    if (values_length != values_y.length) {
        throw new Error(
            "The parameters values_x and values_y need to have same size!"
        );
    }
    // Above and below cover edge cases
    if (values_length === 0) {
        //return [[], []];
        return { slope: 0, lineOfBestFit: [] };
    }
    // Calculate the sum for each of the parts necessary.
    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = values_y[i];
        x_sum += x;
        y_sum += y;
        xx_sum += x * x;
        xy_sum += x * y;
        count++;
    }
    // Calculate m and b for the line equation: m * x + b
    var m = (count * xy_sum - x_sum * y_sum) / (count * xx_sum - x_sum * x_sum);
    var b = y_sum / count - (m * x_sum) / count;
    // We then return the x and y data points according to our fit
    var result_values_x = [] as number[];
    var result_values_y = [] as number[];
    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }
    //return [result_values_x, result_values_y];
    return { slope: m, lineOfBestFit: result_values_y };
}

export function getSlope(point1: {x: number, y: number}, point2: {x: number, y: number}): number {
    return (point2.y - point1.y) / (point2.x - point1.x);
}
