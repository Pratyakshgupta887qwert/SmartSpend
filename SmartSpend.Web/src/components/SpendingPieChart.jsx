import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const pieData = [
  { name: "Food", value: 12000 },
  { name: "Shopping", value: 8000 },
  { name: "Travel", value: 6000 },
];

const COLORS = ["#22c55e", "#86efac", "#4ade80"];

function SpendingPieChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80}>
          {pieData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default SpendingPieChart;