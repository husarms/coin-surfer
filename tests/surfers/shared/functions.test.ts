import * as Functions from "../../../surfers/shared/functions";

test("getCurrentPercentage returns percentage", () => {
    expect(Functions.getCurrentPercentage(100, 105)).toBe(-4.76);
});
