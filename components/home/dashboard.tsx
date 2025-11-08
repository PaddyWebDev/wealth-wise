"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function Dashboard() {
  const expenseData = [
    { name: "Jan", amount: 2400 },
    { name: "Feb", amount: 2210 },
    { name: "Mar", amount: 2290 },
    { name: "Apr", amount: 2000 },
    { name: "May", amount: 2181 },
    { name: "Jun", amount: 2500 },
  ]

  const investmentData = [
    { name: "SIP", value: 40, color: "#1e40af" },
    { name: "Mutual Funds", value: 30, color: "#06b6d4" },
    { name: "Emergency Fund", value: 20, color: "#10b981" },
    { name: "Others", value: 10, color: "#f59e0b" },
  ]

  const colors = ["#1e40af", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

  return (
    <section className="py-20 sm:py-32 bg-gradient-blue-white grid-pattern relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Personalized Dashboard</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {`See sample insights and visualizations of what you'll get with WealthMind`}
          </p>
          <div className="w-12 h-1 bg-gradient-blue-accent rounded-full mx-auto mt-4"></div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="scale-in bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-lg transition-shadow">
            <p className="text-sm text-blue-600 mb-2 font-semibold">Monthly Savings</p>
            <p className="text-3xl font-bold text-blue-900">₹8,450</p>
            <p className="text-xs text-green-600 mt-2">↑ 12% from last month</p>
          </div>
          <div
            className="scale-in bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-lg transition-shadow"
            style={{ animationDelay: "100ms" }}
          >
            <p className="text-sm text-green-600 mb-2 font-semibold">Investment Returns</p>
            <p className="text-3xl font-bold text-green-900">₹1.24L</p>
            <p className="text-xs text-green-600 mt-2">↑ 8.5% YTD</p>
          </div>
          <div
            className="scale-in bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-lg transition-shadow"
            style={{ animationDelay: "200ms" }}
          >
            <p className="text-sm text-purple-600 mb-2 font-semibold">Financial Score</p>
            <p className="text-3xl font-bold text-purple-900">78/100</p>
            <p className="text-xs text-yellow-600 mt-2">Good - Room to improve</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Expense Chart */}
          <div className="fade-in-up bg-neutral-50 dark:bg-neutral-950 rounded-xl shadow-sm border border-border p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-6">Spending Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                  formatter={(value) => `₹${value}`}
                />
                <Bar dataKey="amount" fill="#1e40af" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Portfolio Allocation - Enhanced with colors */}
          <div className="fade-in-up bg-neutral-50 dark:bg-neutral-950 rounded-xl shadow-sm border border-border p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-6">Portfolio Allocation</h3>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={investmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {investmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 border dark:bg-neutral-700 p-3 rounded-md">
                {investmentData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="ml-auto text-sm font-bold text-primary">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
