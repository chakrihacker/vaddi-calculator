"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const VaddiCalculatorSchema = z.object({
	interestType: z.enum(["simple", "compound"]),
	interestRateType: z.enum(["rupee", "percent"]),
	amount: z.coerce.number(),
	interestRate: z.coerce.number(),
	loanDurationType: z.enum(["dates", "period"]), // Dates (Start and End Date) or Period (Years, Months, Days)
	years: z.coerce.number().optional(),
	months: z.coerce.number().optional(),
	days: z.coerce.number().optional(),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	compoundFrequencyMonths: z.coerce.number().optional(),
	compoundFrequency: z.enum(["annually", "semiannually", "custom"]),
});

const timeFromYear = (date: Date, baseYear: number) => {
	const year = date.getFullYear();
	const month = date.getMonth();
	let day = date.getDate();
	if (day === 31) {
		day = 30;
	}
	return (year - baseYear) * 360 + month * 30 + day;
};

const durationBetweenDates = (startDate: Date, endDate: Date) => {
	if (startDate > endDate) {
		return {
			years: 0,
			months: 0,
			days: 0,
		};
	}
	const baseYear = startDate.getFullYear() - 2;
	const start = timeFromYear(startDate, baseYear);
	const end = timeFromYear(endDate, baseYear);
	const totalDays = end - start;

	const years = Math.floor(totalDays / 360);
	const months = Math.floor((totalDays % 360) / 30);
	const days = (totalDays % 360) % 30;

	return { years, months, days };
};

const calculateDuration = ({
	loanDurationType,
	years,
	months,
	days,
	startDate,
	endDate,
}: {
	loanDurationType: string;
	years?: number;
	months?: number;
	days?: number;
	startDate?: Date;
	endDate?: Date;
}) => {
	if (loanDurationType === "period") {
		return { years, months, days };
	}
	if (loanDurationType === "dates" && startDate && endDate) {
		return durationBetweenDates(startDate, endDate);
	}
	return {
		years: 0,
		months: 0,
		days: 0,
	};
};

export default function VaddiCalculator() {
	const vaddiForm = useForm<z.infer<typeof VaddiCalculatorSchema>>({
		resolver: zodResolver(VaddiCalculatorSchema),
		defaultValues: {
			interestType: "simple",
			interestRateType: "rupee",
			amount: undefined,
			interestRate: undefined,
			loanDurationType: "dates",
			years: undefined,
			months: undefined,
			days: undefined,
			startDate: undefined,
			endDate: undefined,
			compoundFrequencyMonths: undefined,
			compoundFrequency: "annually",
		},
	});

	const isInterestTypeCompound = vaddiForm.watch("interestType") === "compound";
	const durationType = vaddiForm.watch("loanDurationType");
	const compoundFrequency = vaddiForm.watch("compoundFrequency");

	const simpleInterest = () => {};

	const compoundInterest = () => {};

	const onSubmit = (data: z.infer<typeof VaddiCalculatorSchema>) => {
		console.log(data);
		const percentage =
			(data.interestRate * (data.interestRateType === "percent" ? 1 : 12)) /
			100;
		const duration = calculateDuration(data);
		console.log(percentage, duration);
	};

	return (
		<Form {...vaddiForm}>
			<form onSubmit={vaddiForm.handleSubmit(onSubmit)}>
				<Card className="w-full max-w-2xl mx-auto text-foreground">
					<CardHeader>
						<CardTitle className="text-2xl font-normal">
							Vaddi Calculator for easy simple, compound, village and bank
							interest calculations
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{/* Interest Type and Interest Rate Selection */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={vaddiForm.control}
								name="interestType"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Interest Type</FormLabel>
										<FormControl>
											<RadioGroup
												defaultValue={field.value}
												onValueChange={field.onChange}
												className="flex gap-4"
											>
												<FormItem className="flex items-center space-x-2 space-y-0">
													<FormControl>
														<RadioGroupItem value="simple" id="simple" />
													</FormControl>
													<FormLabel>Simple Interest</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-2 space-y-0">
													<FormControl>
														<RadioGroupItem value="compound" id="compound" />
													</FormControl>
													<FormLabel>Compound Interest</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={vaddiForm.control}
								name="interestRateType"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel>Interest Rate is in</FormLabel>
										<FormControl>
											<RadioGroup
												defaultValue={field.value}
												onValueChange={field.onChange}
												className="flex gap-4"
											>
												<FormItem className="flex items-center space-x-2 space-y-0">
													<FormControl>
														<RadioGroupItem value="rupee" id="rupee" />
													</FormControl>
													<FormLabel>Rupee per month</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-2 space-y-0">
													<FormControl>
														<RadioGroupItem value="percent" id="percent" />
													</FormControl>
													<FormLabel>Percent per annum</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						{/* Amount and Interest Rate Row */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={vaddiForm.control}
								name="amount"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel htmlFor="amount">Amount *</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												id="amount"
												placeholder="0"
												className="bg-background"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={vaddiForm.control}
								name="interestRate"
								render={({ field }) => (
									<FormItem className="space-y-2">
										<FormLabel htmlFor="rate">Interest Rate *</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												id="rate"
												className="bg-background"
												placeholder="0"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Loan Duration Type Row */}
						<FormField
							control={vaddiForm.control}
							name="loanDurationType"
							render={({ field }) => (
								<FormItem className="space-y-2">
									<FormLabel>Loan Duration Type</FormLabel>
									<RadioGroup
										defaultValue={field.value}
										onValueChange={field.onChange}
										className="flex gap-4"
									>
										<FormItem className="flex items-center space-x-2 space-y-0">
											<FormControl>
												<RadioGroupItem value="dates" id="dates" />
											</FormControl>
											<FormLabel htmlFor="dates">Start and End date</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-2 space-y-0">
											<FormControl>
												<RadioGroupItem value="period" id="period" />
											</FormControl>
											<FormLabel htmlFor="period">Time period</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{durationType === "dates" ? (
								<>
									<FormField
										control={vaddiForm.control}
										name="startDate"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel className="flex" htmlFor="startDate">
													Start Date
												</FormLabel>
												<FormControl>
													<DateTimePicker
														granularity="day"
														displayFormat={{ hour24: "dd-LLL-yyyy" }}
														value={field.value}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={vaddiForm.control}
										name="endDate"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel className="flex" htmlFor="endDate">
													End Date
												</FormLabel>
												<FormControl>
													<DateTimePicker
														granularity="day"
														displayFormat={{ hour24: "dd-LLL-yyyy" }}
														value={field.value}
														onChange={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							) : (
								<div className="grid grid-cols-3 gap-4 col-span-2">
									<FormField
										control={vaddiForm.control}
										name="years"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel htmlFor="years">Years</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="number"
														id="years"
														min="0"
														placeholder="Years"
														className="w-full"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={vaddiForm.control}
										name="months"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel htmlFor="months">Months</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="number"
														id="months"
														min="0"
														placeholder="Months"
														className="w-full"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={vaddiForm.control}
										name="days"
										render={({ field }) => (
											<FormItem className="space-y-2">
												<FormLabel htmlFor="days">Days</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="number"
														id="days"
														min="0"
														placeholder="Days"
														className="w-full"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}
						</div>

						<div className="min-h-[80px] transition-all duration-200">
							{isInterestTypeCompound && (
								<FormField
									control={vaddiForm.control}
									name={"compoundFrequency"}
									render={({ field }) => (
										<FormItem className="space-y-2">
											<FormLabel>Compound Frequency</FormLabel>
											<RadioGroup
												defaultValue="annually"
												value={field.value}
												onValueChange={field.onChange}
												className="flex gap-2"
											>
												<FormItem className="flex items-center space-x-2 space-y-0">
													<FormControl>
														<RadioGroupItem value="annually" id="annually" />
													</FormControl>
													<FormLabel htmlFor="annually">Annually</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-2 space-y-0">
													<FormControl>
														<RadioGroupItem
															value="semiannually"
															id="semiannually"
														/>
													</FormControl>
													<FormLabel htmlFor="semiannually">
														Semi Annually
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-2 space-y-0">
													<FormControl>
														<RadioGroupItem value="custom" id="custom" />
													</FormControl>
													<FormLabel htmlFor="custom">Custom</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormItem>
									)}
								/>
							)}
						</div>

						<div className="min-h-[80px] transition-all duration-200">
							{compoundFrequency === "custom" && (
								<FormField
									control={vaddiForm.control}
									name="compoundFrequencyMonths"
									render={({ field }) => (
										<FormItem className="space-y-2">
											<Label htmlFor="customMonths">
												Compound every (months)
											</Label>
											<Input
												{...field}
												type="number"
												id="customMonths"
												min="1"
												className="bg-background"
												placeholder="Enter number of months"
											/>
										</FormItem>
									)}
								/>
							)}
						</div>
					</CardContent>
					<CardFooter className="flex justify-between">
						<Button variant="destructive">CLEAR</Button>
						<Button type="submit">CALCULATE</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
