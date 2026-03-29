import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const chartData = [
  { day: "Mon", expense: 2000 },
  { day: "Tue", expense: 3000 },
  { day: "Wed", expense: 2500 },
  { day: "Thu", expense: 4200 },
  { day: "Fri", expense: 3800 },
  { day: "Sat", expense: 5000 },
  { day: "Sun", expense: 4600 },
];

function ExpenseChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <XAxis dataKey="day" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#22c55e"
          fill="#22c55e"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default ExpenseChart;