"use client"

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"

export function DashboardDemo() {
  const expenseData = [
    { month: "Jan", expense: 15000 },
    { month: "Feb", expense: 14000 },
    { month: "Mar", expense: 12500 },
    { month: "Apr", expense: 11000 },
    { month: "May", expense: 10500 },
    { month: "Jun", expense: 9500 },
  ]

  const portfolioData = [
    { name: "Stocks", value: 40, color: "#1e40af" },
    { name: "Mutual Funds", value: 35, color: "#3b82f6" },
    { name: "Bonds", value: 15, color: "#60a5fa" },
    { name: "Cash", value: 10, color: "#93c5fd" },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gray-900">Your </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Financial Dashboard
            </span>
          </h2>
          <p className="text-xl text-gray-600">See real-time insights and personalized recommendations</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Expense Trend */}
          <div className="bg-white rounded-xl border border-blue-100 p-8 hover:shadow-lg transition-shadow duration-300 scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Expense Trend</h3>
              <div className="flex items-center text-green-600 font-semibold">
                <TrendingUp size={20} className="mr-2" />
                -25%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#1e40af"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio Allocation */}
          <div
            className="bg-white rounded-xl border border-blue-100 p-8 hover:shadow-lg transition-shadow duration-300 scale-in"
            style={{ animationDelay: "100ms" }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Allocation</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {[
            { label: "Monthly Savings", value: "₹35,000", trend: "+12%" },
            { label: "Investment Return", value: "18.5%", trend: "+2.3%" },
            { label: "Net Worth", value: "₹12.5L", trend: "+8.2%" },
            { label: "Financial Score", value: "8.2/10", trend: "+0.5" },
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-gradient-blue-white rounded-lg p-6 border border-blue-100 scale-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="text-gray-600 text-sm mb-2">{metric.label}</p>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-green-600 text-sm font-semibold">{metric.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
