import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const FALLBACK_DATA = [
  { name: "Food", value: 0.0001 },
  { name: "Travel", value: 0.0001 },
  { name: "Meds", value: 0.0001 },
  { name: "School", value: 0.0001 },
];

const COLORS = ["#d84843", "#2a2628", "#ddd4d1", "#f1b9b6"];

function SpendingPieChart({ data }) {
  const chartData = data && data.length > 0 ? data : FALLBACK_DATA;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={82}
          paddingAngle={3}
          stroke="none"
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`Rs ${value}`, "Amount"]}
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
      </PieChart>
    </ResponsiveContainer>
  );
}

export default SpendingPieChart;
