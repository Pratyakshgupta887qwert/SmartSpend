import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const pieData = [
  { name: "Food", value: 200 },
  { name: "Travel", value: 680 },
  { name: "Meds", value: 1680 },
  { name: "School", value: 680 },
];

const COLORS = ["#d84843", "#2a2628", "#ddd4d1", "#f1b9b6"];

function SpendingPieChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={82}
          paddingAngle={3}
          stroke="none"
        >
          {pieData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip
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
