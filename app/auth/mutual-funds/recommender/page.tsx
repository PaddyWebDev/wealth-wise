"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import { recommendSchema } from "@/lib/auth-form-schemas";
import { z } from "zod";
import axios from "axios";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function RecommendPage() {
  const [isPending, startTransition] = React.useTransition();
  const [results, setResults] = useState([]);

  const recommendationForm = useForm<z.infer<typeof recommendSchema>>({
    resolver: zodResolver(recommendSchema),
    defaultValues: {
      min_sip: "",
      required_return: "",
      category: "",
      risk_level: "",
    },
  });

  async function onSubmit(values: z.infer<typeof recommendSchema>) {
    startTransition(async () => {
      try {
        const validatedData = recommendSchema.safeParse(values);
        if (validatedData.error || !validatedData.data) {
          toast.error("Failed to validate");
          return;
        }


        const response = await axios.post(
          `${process.env.BACKEND_URL}/recommend`,
          {
            min_sip: parseFloat(validatedData.data.min_sip),
            expected_return: parseFloat(validatedData.data.required_return),
            category: validatedData.data.category,
            risk_level: validatedData.data.risk_level,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        setResults(response.data);
        toast.success("Success");
      } catch (error: any) {
        console.log(error);
        toast.error(error?.response?.data || "Error Occurred");
      }
    });
  }

  return (
    <section className="w-full h-full flex items-center justify-center flex-col">
      <Card className="w-full max-w-2xl mx-auto bg-neutral-200/50 dark:bg-neutral-800 p-4 rounded-md shadow-xl ">
        <CardTitle className="text-3xl font-bold text-center my-3">
          Mutual Funds Recommendation System
        </CardTitle>
        <CardContent>
          <Form {...recommendationForm}>
            <form
              onSubmit={recommendationForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={recommendationForm.control}
                name="min_sip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Sip</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="required_return"
                control={recommendationForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Return</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Slider
                          className="w-10/12 ml-3"
                          value={[parseInt(field.value)]}
                          min={0}
                          disabled={isPending}
                          max={30}
                          step={1}
                          onValueChange={(val) =>
                            field.onChange(val[0].toString())
                          }
                        />
                        <Input
                          className="w-2/12"
                          disabled={isPending}
                          type="number"
                          {...field}
                          readOnly
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={recommendationForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        {...field}
                        disabled={isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Equity">Equity</SelectItem>
                          <SelectItem value="Debt">Debt</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={recommendationForm.control}
                name="risk_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Very Low Risk (1)</SelectItem>
                          <SelectItem value="2">Low Risk (2)</SelectItem>
                          <SelectItem value="3">Moderate Risk (3)</SelectItem>
                          <SelectItem value="4">High Risk (4)</SelectItem>
                          <SelectItem value="5">Very High Risk (5)</SelectItem>
                          <SelectItem value="6">Extreme Risk (6)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Choose your risk appetite from 1 (Very Low) to 6
                      (Extreme).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending}>
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="w-full mt-10 max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((fund: any, index: number) => (
          <Card
            key={index}
            className="p-4 shadow-md bg-white/60 dark:bg-neutral-900"
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {fund.title.scheme_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                <b>Category:</b> {fund.title.category}
              </p>
              <p>
                <b>Fund Manager:</b> {fund.title.fund_manager}
              </p>
              <p>
                <b>1Y Return:</b> {fund.title.returns_1yr}%
              </p>
              <p>
                <b>3Y Return:</b> {fund.title.returns_3yr}%
              </p>
              <p>
                <b>5Y Return:</b> {fund.title.returns_5yr}%
              </p>
              <p>
                <b>Risk Level:</b> {fund.title.risk_level}
              </p>
              <p>
                <b>AUM:</b> ₹{fund.title.fund_size_cr} Cr
              </p>
              <p>
                <b>Min SIP:</b> ₹{fund.title.min_sip}
              </p>
              <p>
                <b>Expense Ratio:</b> {fund.title.expense_ratio}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
