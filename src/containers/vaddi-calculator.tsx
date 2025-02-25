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
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { calculateTotalYears, durationBetweenDates } from "./utils";

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
			amount: "" as unknown as number,
			interestRate: "" as unknown as number,
			loanDurationType: "dates",
			years: "" as unknown as number,
			months: "" as unknown as number,
			days: "" as unknown as number,
			startDate: undefined,
			endDate: undefined,
			compoundFrequencyMonths: "" as unknown as number,
			compoundFrequency: "annually",
		},
	});

	const [interest, setInterest] = useState(0);
	const [duration, setDuration] = useState({ years: 0, months: 0, days: 0 });

	const resultRef = useRef<HTMLDivElement>(null);

	const isInterestTypeCompound = vaddiForm.watch("interestType") === "compound";
	const durationType = vaddiForm.watch("loanDurationType");
	const compoundFrequency = vaddiForm.watch("compoundFrequency");

	const simpleInterest = ({
		amount,
		time,
		rateOfInterest,
	}: { amount: number; time: number; rateOfInterest: number }) => {
		return amount * rateOfInterest * time;
	};

	const compoundInterest = ({
		amount,
		time,
		rateOfInterest,
		frequency,
	}: {
		amount: number;
		time: number;
		rateOfInterest: number;
		frequency: number;
	}) => {
		// Calculate total months and days
		const totalMonths = Math.floor(12 * Math.floor(time) + (time % 1) * 12); // Total months
		const totalDays = Math.floor(360 * Math.floor(time) + (time % 1) * 360); // Total days in 360-day year

		// Calculate number of complete compound periods
		const completePeriods = Math.floor(totalMonths / frequency);

		let currentAmount = amount;
		let interestEarned = 0;

		// Calculate interest for complete periods
		for (let i = 0; i < completePeriods; i++) {
			interestEarned = simpleInterest({
				amount: currentAmount,
				time: frequency / 12,
				rateOfInterest: rateOfInterest,
			});
			currentAmount += interestEarned;
		}

		// Calculate interest for remaining days
		const remainingDays = totalDays - completePeriods * frequency * 30;
		if (remainingDays > 0) {
			interestEarned = simpleInterest({
				amount: currentAmount,
				rateOfInterest,
				time: remainingDays / 360,
			});
			currentAmount += interestEarned;
		}

		// Return only the interest amount
		return currentAmount - amount;
	};

	const onSubmit = (data: z.infer<typeof VaddiCalculatorSchema>) => {
		const percentage =
			(data.interestRate * (data.interestRateType === "percent" ? 1 : 12)) /
			100;
		const duration = calculateDuration(data);
		setDuration(duration);
		const finalDuration = calculateTotalYears(duration);

		if (data.interestType === "simple") {
			const interest = simpleInterest({
				amount: data.amount,
				time: finalDuration,
				rateOfInterest: percentage,
			});
			setInterest(interest);
			setTimeout(() => {
				resultRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 1000);
			return interest;
		}

		// Calculate Compound Interest
		const interest = compoundInterest({
			amount: data.amount,
			rateOfInterest: percentage,
			time: finalDuration,
			frequency:
				data.compoundFrequency === "custom"
					? data.compoundFrequencyMonths
					: data.compoundFrequency === "annually"
						? 12
						: 6,
		});
		setInterest(interest);
		setTimeout(() => {
			resultRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
		}, 1000);
		return interest;
	};

	return (
		<>
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
												<FormLabel htmlFor="dates">
													Start and End date
												</FormLabel>
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
							<Button variant="destructive" onClick={() => vaddiForm.reset()}>
								CLEAR
							</Button>
							<Button type="submit">CALCULATE</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
			{/* Result */}
			<div ref={resultRef} className="w-full max-w-2xl mx-auto text-foreground">
				{vaddiForm.formState.isSubmitSuccessful && (
					<Card className="w-full max-w-2xl mx-auto text-foreground">
						<CardHeader>
							<CardTitle className="text-2xl font-normal">
								{isInterestTypeCompound
									? "Compound Interest Calculation"
									: "Simple Interest Calculation"}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p>Principal Amount: {vaddiForm.getValues("amount")}</p>
							<p>
								Loan Duration: {duration.years ? `${duration.years} Years` : ""}{" "}
								{duration.months ? `${duration.months} Months` : ""}{" "}
								{duration.days ? `${duration.days} Days` : ""}
							</p>
							<p>
								Interest Rate: {vaddiForm.getValues("interestRate")}{" "}
								{vaddiForm.getValues("interestRateType") === "rupee"
									? "Rupees per 100 per month"
									: "percent per annum"}
							</p>
							<p>Interest: {interest}</p>
							<p>
								Total Amount: {Number(vaddiForm.getValues("amount")) + interest}
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</>
	);
}
