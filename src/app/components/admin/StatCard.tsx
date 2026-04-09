import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
  onClick?: () => void;
  isButton?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  delay = 0,
  onClick,
  isButton = false,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between mb-1.5 md:mb-3">
        <div className="flex-1">
          <p className="text-[10px] md:text-xs text-gray-600 mb-1 font-medium">{label}</p>
          <p className="text-xl md:text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className={`w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
        >
          <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
        </motion.div>
      </div>
      {isButton && (
        <div className="mt-1.5 md:mt-3 pt-1.5 md:pt-3 border-t border-gray-200">
          <span className="text-[10px] md:text-xs text-[#C8B6FF] font-semibold flex items-center gap-1">
            Klik untuk akses
            <span className="text-xs md:text-sm">→</span>
          </span>
        </div>
      )}
    </>
  );

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`bg-white/60 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-5 shadow-xl border border-white/20 ${
        isButton ? "cursor-pointer hover:shadow-2xl hover:border-[#C8B6FF]/30" : ""
      } transition-all duration-300 min-h-[100px] md:min-h-[140px] flex flex-col justify-between`}
      onClick={onClick}
    >
      {content}
    </motion.div>
  );
}