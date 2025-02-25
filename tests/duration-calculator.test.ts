import { describe, expect, it } from "vitest";
import { durationBetweenDates } from "../src/containers/utils";

describe("durationBetweenDates", () => {
	it("should return correct duration for same start and end date", () => {
		const startDate = new Date(2023, 0, 1);
		const endDate = new Date(2023, 0, 1);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 0, days: 0 });
	});

	it("should return correct duration for start date before end date", () => {
		const startDate = new Date(2023, 0, 1);
		const endDate = new Date(2024, 0, 1);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 1, months: 0, days: 0 });
	});

	it("should return correct duration for start date after end date", () => {
		const startDate = new Date(2024, 0, 1);
		const endDate = new Date(2023, 0, 1);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 0, days: 0 });
	});

	it("should return correct duration for different months", () => {
		const startDate = new Date(2023, 0, 1);
		const endDate = new Date(2023, 6, 1);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 6, days: 0 });
	});

	it("should return correct duration for different days", () => {
		const startDate = new Date(2023, 0, 1);
		const endDate = new Date(2023, 0, 15);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 0, days: 14 });
	});

	it("should return correct duration for leap year", () => {
		const startDate = new Date(2020, 1, 28);
		const endDate = new Date(2020, 2, 1);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 0, days: 2 });
	});

	it("should return number of days, if start and end date are in same month", () => {
		const startDate = new Date(2023, 0, 1);
		const endDate = new Date(2023, 0, 31);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 0, days: 30 });
	});

	it("should return correct duration for start date at end of month", () => {
		const startDate = new Date(2023, 0, 31);
		const endDate = new Date(2023, 1, 1);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 0, days: 1 });
	});

	it("should return correct duration for start date at the beginning of a month", () => {
		const startDate = new Date(2023, 0, 1);
		const endDate = new Date(2023, 0, 31);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 0, days: 30 });
	});

	it("should return correct duration for end date at end of month", () => {
		const startDate = new Date(2023, 0, 31);
		const endDate = new Date(2023, 1, 28);
		const duration = durationBetweenDates(startDate, endDate);
		expect(duration).toEqual({ years: 0, months: 0, days: 28 });
	});
});
