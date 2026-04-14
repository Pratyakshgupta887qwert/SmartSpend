import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const FALLBACK_DATA = [
  { day: "Jan", expense: 0, income: 0 },
  { day: "Feb", expense: 0, income: 0 },
  { day: "Mar", expense: 0, income: 0 },
  { day: "Apr", expense: 0, income: 0 },
  { day: "May", expense: 0, income: 0 },
  { day: "Jun", expense: 0, income: 0 },
  { day: "Jul", expense: 0, income: 0 },
];

function ExpenseChart({ data }) {
  const chartData = data && data.length > 0 ? data : FALLBACK_DATA;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 16, left: -18, bottom: 0 }}
      >
        <defs>
          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d84843" stopOpacity={0.28} />
            <stop offset="55%" stopColor="#e7beb9" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1f9d59" stopOpacity={0.28} />
            <stop offset="55%" stopColor="#8fdfb4" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#efe6e2" vertical={false} strokeDasharray="4 4" />

        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#9c9190", fontSize: 11 }}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#c1b6b1", fontSize: 10 }}
          width={34}
        />

        <Tooltip
          cursor={{ stroke: "#d84843", strokeWidth: 1, strokeDasharray: "3 3" }}
          formatter={(value, name) => [
            `Rs ${value}`,
            name === "income" ? "Income" : "Expense",
          ]}
          contentStyle={{
            backgroundColor: "#231c1f",
            border: "none",
            borderRadius: "16px",
            color: "#fff",
            boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
          }}
          labelStyle={{ color: "#f4e9e6", fontWeight: 600 }}
          itemStyle={{ color: "#ff8d88" }}
        />

        <Area
          type="monotone"
          dataKey="expense"
          stroke="#d84843"
          fill="url(#expenseFill)"
          strokeWidth={3}
          dot={{ r: 0 }}
          activeDot={{
            r: 4,
            fill: "#d84843",
            stroke: "#fff7f5",
            strokeWidth: 2,
          }}
        />

        <Area
          type="monotone"
          dataKey="income"
          stroke="#1f9d59"
          fill="url(#incomeFill)"
          strokeWidth={3}
          dot={{ r: 0 }}
          activeDot={{
            r: 4,
            fill: "#1f9d59",
            stroke: "#f3fff8",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default ExpenseChart;
