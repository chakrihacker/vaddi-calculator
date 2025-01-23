"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function VaddiCalculator() {
	const [interestType, setInterestType] = useState<"simple" | "compound">(
		"simple",
	);

	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();

	const [compoundFrequency, setCompoundFrequency] = useState<
		"annually" | "semiannually" | "custom"
	>("annually");
	const [compoundFrequencyMonths, setCompoundFrequencyMonths] =
		useState<string>("");

	const [rateType, setRateType] = useState<"rupee" | "percent">("rupee");
	const [durationType, setDurationType] = useState("dates");

	const [years, setYears] = useState(0);
	const [months, setMonths] = useState(0);
	const [days, setDays] = useState(0);

	const onInterestTypeChange = (value: "simple" | "compound") => {
		setInterestType(value);
		if (value === "simple") {
			setCompoundFrequency("annually");
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto text-foreground">
			<CardHeader>
				<CardTitle className="text-2xl font-normal">
					Vaddi Calculator for easy simple, compound, village and bank interest
					calculations
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Interest Type</Label>
						<RadioGroup
							defaultValue="simple"
							onValueChange={onInterestTypeChange}
							className="flex gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="simple" id="simple" />
								<Label htmlFor="simple">Simple Interest</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="compound" id="compound" />
								<Label htmlFor="compound">Compound Interest</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="space-y-2">
						<Label>Interest Rate is in</Label>
						<RadioGroup
							defaultValue="rupee"
							onValueChange={setRateType}
							className="flex gap-2"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="rupee" id="rupee" />
								<Label htmlFor="rupee">Rupee per month</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="percent" id="percent" />
								<Label htmlFor="percent">Percent per annum</Label>
							</div>
						</RadioGroup>
					</div>
				</div>

				{/* Amount and Interest Rate Row */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="amount">Amount *</Label>
						<Input
							type="number"
							id="amount"
							placeholder="0"
							className="bg-background"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="rate">Interest Rate *</Label>
						<Input type="number" id="rate" className="bg-background" />
					</div>
				</div>

				<div className="space-y-2">
					<Label>Loan Duration Type</Label>
					<RadioGroup
						defaultValue="dates"
						onValueChange={setDurationType}
						className="flex gap-4"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="dates" id="dates" />
							<Label htmlFor="dates">Start and End date</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="period" id="period" />
							<Label htmlFor="period">Time period</Label>
						</div>
					</RadioGroup>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{durationType === "dates" ? (
						<>
							<div className="space-y-2">
								<Label className="flex" htmlFor="startDate">
									Start Date
								</Label>
								<Popover>
									<PopoverTrigger className="w-full">
										<Button
											variant={"outline"}
											className={cn(
												"w-full pl-3 text-left font-normal",
												!startDate && "text-muted-foreground",
											)}
										>
											{startDate ? (
												startDate.toLocaleDateString("en-IN", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<Calendar
											mode="single"
											selected={startDate}
											onSelect={setStartDate}
											disabled={(date) =>
												date > new Date() || date < new Date("1900-01-01")
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="space-y-2">
								<Label className="flex" htmlFor="endDate">
									End Date
								</Label>
								<Popover>
									<PopoverTrigger className="w-full">
										<Button
											variant={"outline"}
											className={cn(
												"w-full pl-3 text-left font-normal",
												!endDate && "text-muted-foreground",
											)}
										>
											{endDate ? (
												endDate?.toLocaleDateString("en-IN", {
													year: "numeric",
													month: "short",
													day: "numeric",
												})
											) : (
												<span>Pick a date</span>
											)}
											<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<Calendar
											mode="single"
											selected={endDate}
											onSelect={setEndDate}
											disabled={(date) =>
												date > new Date() || date < new Date("1900-01-01")
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>
						</>
					) : (
						<div className="grid grid-cols-3 gap-4 col-span-2">
							<div className="space-y-2">
								<Label htmlFor="years">Years</Label>
								<Input
									type="number"
									id="years"
									min="0"
									placeholder="Years"
									className="w-full"
									value={years}
									onChange={(e) => setYears(Number(e.target.value))}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="months">Months</Label>
								<Input
									type="number"
									id="months"
									min="0"
									max="11"
									placeholder="Months"
									className="w-full"
									value={months}
									onChange={(e) => setMonths(Number(e.target.value))}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="days">Days</Label>
								<Input
									type="number"
									id="days"
									min="0"
									max="30"
									placeholder="Days"
									className="w-full"
									value={days}
									onChange={(e) => setDays(Number(e.target.value))}
								/>
							</div>
						</div>
					)}
				</div>

				<div className="min-h-[80px] transition-all duration-200">
					{interestType === "compound" && (
						<div className="space-y-2">
							<Label>Compound Frequency</Label>
							<RadioGroup
								defaultValue="annually"
								value={compoundFrequency}
								onValueChange={setCompoundFrequency}
								className="flex gap-2"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="annually" id="annually" />
									<Label htmlFor="annually">Annually</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="semiannually" id="semiannually" />
									<Label htmlFor="semiannually">Semi Annually</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="custom" id="custom" />
									<Label htmlFor="custom">Custom</Label>
								</div>
							</RadioGroup>
						</div>
					)}
				</div>

				<div className="min-h-[80px] transition-all duration-200">
					{compoundFrequency === "custom" && (
						<div className="space-y-2">
							<Label htmlFor="customMonths">Compound every (months)</Label>
							<Input
								type="number"
								id="customMonths"
								value={compoundFrequencyMonths}
								onChange={(e) => setCompoundFrequencyMonths(e.target.value)}
								min="1"
								className="bg-background"
								placeholder="Enter number of months"
							/>
						</div>
					)}
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="destructive">CLEAR</Button>
				<Button>CALCULATE</Button>
			</CardFooter>
		</Card>
	);
}
