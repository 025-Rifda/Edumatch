import { motion } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const userGrowthData = [
  { month: "Jan", users: 420 },
  { month: "Feb", users: 680 },
  { month: "Mar", users: 950 },
  { month: "Apr", users: 1240 },
  { month: "Mei", users: 1680 },
  { month: "Jun", users: 2150 },
  { month: "Jul", users: 2847 },
];

export function UserGrowthChart() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-white/60 backdrop-blur-xl rounded-xl md:rounded-3xl p-3 md:p-8 shadow-xl border border-white/20"
    >
      <div className="mb-3 md:mb-6">
        <h3 className="text-base md:text-xl font-bold text-gray-800 mb-0.5 md:mb-2">
          Pertumbuhan Pengguna
        </h3>
        <p className="text-[10px] md:text-sm text-gray-600">
          Grafik pertumbuhan pengguna dalam 7 bulan terakhir
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250} className="md:h-[350px]">
        <LineChart data={userGrowthData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            stroke="#9CA3AF"
            style={{ fontSize: "10px", fontWeight: "500" }}
            className="md:text-sm"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            style={{ fontSize: "10px", fontWeight: "500" }}
            className="md:text-sm"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "8px 12px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#374151", fontWeight: "600", fontSize: "11px" }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#C8B6FF"
            strokeWidth={2}
            dot={{
              fill: "#C8B6FF",
              strokeWidth: 2,
              r: 3,
              stroke: "#fff",
            }}
            activeDot={{
              r: 5,
              fill: "#FFC8DD",
              stroke: "#fff",
              strokeWidth: 2,
            }}
            className="md:stroke-[3]"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}