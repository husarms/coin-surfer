import * as Functions from "../../../surfers/shared/functions";

test("getCurrentPercentage returns percentage", () => {
    expect(Functions.getCurrentPercentage(100, 105)).toBe(-4.76);
    expect(Functions.getCurrentPercentage(900, 800)).toBe(12.5);
});
