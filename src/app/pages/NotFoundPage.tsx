import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/30 via-[#FFC8DD]/20 to-[#BDE0FE]/30" />

      {/* Floating Blobs */}
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
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 shadow-2xl border border-white/60 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C8B6FF] to-[#FFC8DD] flex items-center justify-center"
          >
            <AlertCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-6xl font-bold text-[#2B2D42] mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-[#2B2D42] mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-[#2B2D42]/70 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>

          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 bg-gradient-to-r from-[#C8B6FF]/90 to-[#FFC8DD]/90 rounded-[12px] text-white text-[13px] font-semibold shadow-sm hover:shadow-md hover:from-[#C8B6FF] hover:to-[#FFC8DD] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
