"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useSessionContext } from "@/context/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";



interface CreditRiskResponse {
  riskLevel: "Low" | "Medium" | "High";
  score: string;
  details: {
    incomeStability: string;
    spendingVolatility: string;
    averageSavingsRate: string;
    personalityType: string;
    riskTolerance: number;
  };
}

export default function CreditRiskPage() {
  const { session } = useSessionContext();
  const [assessment, setAssessment] = useState<CreditRiskResponse | null>(null);



  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/credit-risk", {
        userId: session?.user?.id
      });

      return response.data as Promise<CreditRiskResponse>;
    },
    onSuccess: (data) => {
      setAssessment(data);
      toast.success("Credit risk assessment completed!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to assess credit risk");
    },
  });

  const onSubmit = () => {
    if (!session?.user?.id) {
      toast.error("User not authenticated");
      return;
    }
    mutation.mutate();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Credit Risk Assessment
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze your financial behavior to estimate your credit risk level
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Start Assessment</CardTitle>
          <CardDescription>
            Click below to analyze your transaction history, income stability, and spending patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => onSubmit()}
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Assessing..." : "Assess Credit Risk"}
          </Button>
        </CardContent>
      </Card>

      {assessment && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Assessment Results
              <Badge className={getRiskColor(assessment.riskLevel)}>
                {assessment.riskLevel} Risk
              </Badge>
            </CardTitle>
            <CardDescription>
              Risk Score: {assessment.score} (0-1 scale, higher = higher risk)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Financial Metrics</h4>
                <ul className="space-y-1 text-sm">
                  <li>Income Stability: {assessment.details.incomeStability}</li>
                  <li>Spending Volatility: {assessment.details.spendingVolatility}</li>
                  <li>Average Savings Rate: {assessment.details.averageSavingsRate}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Profile Factors</h4>
                <ul className="space-y-1 text-sm">
                  <li>Personality Type: {assessment.details.personalityType}</li>
                  <li>Risk Tolerance: {assessment.details.riskTolerance}</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {assessment.riskLevel === "Low" && "Great job! Your financial habits indicate low credit risk. Continue maintaining stable income and savings."}
                {assessment.riskLevel === "Medium" && "Your risk level is moderate. Consider improving savings habits and reducing spending volatility."}
                {assessment.riskLevel === "High" && "Your financial patterns suggest higher credit risk. Focus on building savings, stabilizing income, and reducing impulsive spending."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
