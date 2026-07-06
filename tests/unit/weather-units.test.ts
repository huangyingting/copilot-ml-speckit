import { describe, expect, it } from "vitest";
import { convertTemperature, convertWindSpeed, formatTemperature, formatWindSpeed } from "@/lib/weather/units";

describe("weather unit helpers", () => {
  it("converts Celsius to Fahrenheit for imperial display", () => {
    expect(convertTemperature(0, "metric", "imperial")).toBe(32);
  });

  it("converts kilometers per hour to miles per hour", () => {
    expect(convertWindSpeed(10, "metric", "imperial")).toBeCloseTo(6.2, 1);
  });

  it("formats temperatures and wind speeds with the active unit", () => {
    expect(formatTemperature(21.4, "metric")).toBe("21°C");
    expect(formatWindSpeed(6.2, "imperial")).toBe("6 mph");
  });
});