import { motion } from "motion/react";
import { TrendingUp, Activity, UserPlus } from "lucide-react";

export function QuickStats() {
  const stats = [
    {
      label: "Pengguna Aktif Hari Ini",
      value: "342",
      change: "+12%",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Pengguna Baru Minggu Ini",
      value: "127",
      change: "+23%",
      icon: UserPlus,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Analisis Diselesaikan",
      value: "1,234",
      change: "+8%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-sm font-semibold ${stat.color}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
