"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function VaddiCalculator() {
	const [interestType, setInterestType] = useState("simple");
	const [rateType, setRateType] = useState("rupee");
	const [durationType, setDurationType] = useState("dates");

	return (
		<Card className="w-full max-w-2xl mx-auto text-foreground">
			<CardHeader>
				<CardTitle className="text-2xl font-normal">
					Vaddi Calculator for easy simple, compound, village and bank interest
					calculations
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="space-y-2">
					<Label>Interest Type</Label>
					<RadioGroup
						defaultValue="simple"
						onValueChange={setInterestType}
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
					<Label htmlFor="amount">Amount *</Label>
					<Input
						type="number"
						id="amount"
						placeholder="0"
						className="bg-background"
					/>
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

				<div className="space-y-2">
					<Label htmlFor="rate">Interest Rate *</Label>
					<Input type="number" id="rate" className="bg-background" />
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

				{durationType === "dates" && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="startDate">Start Date</Label>
							<Input type="date" id="startDate" className="bg-background" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="endDate">End Date</Label>
							<Input type="date" id="endDate" className="bg-background" />
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="destructive">CLEAR</Button>
				<Button>CALCULATE</Button>
			</CardFooter>
		</Card>
	);
}
