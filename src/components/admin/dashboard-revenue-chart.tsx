"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type RevenueTrendPoint = {
  label: string;
  revenue: number;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RevenueTrendChart({ points }: { points: RevenueTrendPoint[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="#E8D8CC" strokeDasharray="3 3" />
          <XAxis dataKey="label" stroke="#8B776A" tickLine={false} axisLine={false} />
          <YAxis
            width={64}
            stroke="#8B776A"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `₹${Math.round(value / 1000)}k`}
          />
          <Tooltip
            cursor={{ stroke: "#D94F2B", strokeWidth: 1, strokeDasharray: "4 4" }}
            contentStyle={{
              borderColor: "#E8D8CC",
              borderRadius: "0.75rem",
              backgroundColor: "#fff",
            }}
            formatter={(value: number) => [formatCurrency(value), "Revenue"]}
            labelFormatter={(label: string) => `Day ${label}`}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#D94F2B"
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
