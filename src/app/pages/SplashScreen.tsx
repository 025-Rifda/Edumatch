import { motion } from "motion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
      {/* Gradient Background - Same as Login */}
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/30 via-[#FFC8DD]/20 to-[#BDE0FE]/30" />

      {/* Floating Blobs - Same as Login */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 bg-[#C8B6FF]/30 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#BDE0FE]/30 rounded-full blur-3xl"
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo with Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
          className="relative"
        >
          <div className="w-32 h-32 rounded-[25px] bg-gradient-to-br from-[#A0E7E5] to-[#C8B6FF] flex items-center justify-center shadow-2xl">
            <GraduationCap className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-[25px] bg-white/20 blur-2xl animate-pulse" />
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-[#2B2D42] mb-2">
            EduMatch AI
          </h1>
          <p className="text-xl text-[#2B2D42]/70 font-light">
            Temukan Jurusan Terbaikmu
          </p>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4 mt-8"
        >
          {/* Animated Dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-full shadow-lg"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-48 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-full shadow-lg"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>

          <motion.p
            className="text-[#2B2D42]/70 text-sm mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Menganalisis masa depanmu...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
