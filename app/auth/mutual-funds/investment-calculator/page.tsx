"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { mutualFundsCalculatorSchema, MutualFundsCalculatorFormType } from "@/lib/auth-form-schemas";
import { z } from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type CalculationResult = {
    futureValue: number;
    investmentType: "lumpsum" | "sip";
};

export default function MutualFundsCalculatorPage() {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const form = useForm<MutualFundsCalculatorFormType>({
        resolver: zodResolver(mutualFundsCalculatorSchema),
        defaultValues: {
            investmentType: "lumpsum",
            principalAmount: "",
            monthlySip: "",
            annualReturnRate: "",
            timePeriod: "",
        },
    });

    const investmentType = useWatch({
        control: form.control,
        name: "investmentType",
    });

    const onSubmit = (values: MutualFundsCalculatorFormType) => {
        const principal = parseFloat(values.principalAmount);
        const rate = parseFloat(values.annualReturnRate) / 100;
        const time = parseInt(values.timePeriod);

        let futureValue = 0;

        if (values.investmentType === "lumpsum") {
            futureValue = principal * Math.pow(1 + rate, time);
        } else {
            const monthlySip = parseFloat(values.monthlySip || "0");
            const monthlyRate = rate / 12;
            const months = time * 12;
            if (monthlyRate === 0) {
                futureValue = monthlySip * months;
            } else {
                futureValue = monthlySip * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
            }
        }

        setResult({
            futureValue: Math.round(futureValue * 100) / 100,
            investmentType: values.investmentType,
        });

        form.reset()
    };

    return (
        <section className="w-full  h-full   flex items-center justify-center p-4 dark:bg-neutral-950 bg-neutral-50">
            <div className="w-full max-w-2xl space-y-6">
                <Card className="w-full dark:bg-neutral-800 bg-neutral-100">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Mutual Funds Future Value Calculator
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="investmentType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Investment Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select investment type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="lumpsum">Lumpsum</SelectItem>
                                                    <SelectItem value="sip">SIP</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="principalAmount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Principal Amount (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter principal amount" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {investmentType === "sip" && (
                                    <FormField
                                        control={form.control}
                                        name="monthlySip"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Monthly SIP Amount (₹)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Enter monthly SIP amount" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                <FormField
                                    control={form.control}
                                    name="annualReturnRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expected Annual Return Rate (%)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="Enter annual return rate" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="timePeriod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time Period (Years)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter time period in years" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full">
                                    Calculate Future Value
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {result && (
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                                Calculated Future Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p className="text-lg">
                                <strong>Investment Type:</strong> {result.investmentType.toUpperCase()}
                            </p>
                            <p className="text-2xl font-bold">
                                Future Value: ₹{result.futureValue.toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </section>
    );
}
