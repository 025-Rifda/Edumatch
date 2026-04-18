import { motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, GraduationCap, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email wajib diisi");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Format email tidak valid");
      return;
    }

    // Simulate sending reset email
    setIsSubmitted(true);
  };

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

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top Illustration */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="w-20 h-20 rounded-[25px] bg-gradient-to-br from-[#A0E7E5] to-[#C8B6FF] flex items-center justify-center shadow-xl mb-4">
            <GraduationCap className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-semibold text-[#2B2D42] text-center mb-2">
            Lupa Password?
          </h2>
          <p className="text-[#2B2D42]/70 text-center">
            Tidak masalah, kami akan mengirimkan link reset
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 shadow-2xl border border-white/60"
        >
          {!isSubmitted ? (
            <>
              <p className="text-[#2B2D42]/80 mb-6 text-center">
                Masukkan email yang terdaftar dan kami akan mengirimkan instruksi untuk reset password
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div>
                  <label className="block text-sm text-[#2B2D42] mb-2 font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                      error 
                        ? "text-red-500" 
                        : "text-[#2B2D42]/50 group-focus-within:text-[#C8B6FF]"
                    }`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="nama@email.com"
                      className={`w-full pl-12 pr-4 py-3.5 bg-white/50 border rounded-[14px] text-[#2B2D42] placeholder:text-[#2B2D42]/40 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        error
                          ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                          : "border-white/60 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF]"
                      }`}
                    />
                  </div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 mt-2 text-red-500 text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-[#FFC8DD] to-[#C8B6FF] rounded-[14px] text-white font-semibold shadow-lg shadow-[#C8B6FF]/30 hover:shadow-xl hover:shadow-[#C8B6FF]/40 transition-all duration-300"
                >
                  Kirim Link Reset
                </motion.button>

                {/* Back to Login */}
                <Link to="/login">
                  <motion.button
                    type="button"
                    whileHover={{ x: -4 }}
                    className="w-full flex items-center justify-center gap-2 text-[#C8B6FF] font-medium hover:text-[#A89FDB] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Login
                  </motion.button>
                </Link>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
              </div>

              {/* Success Message */}
              <div>
                <h3 className="text-2xl font-semibold text-[#2B2D42] mb-3">
                  Email Terkirim!
                </h3>
                <p className="text-[#2B2D42]/70 leading-relaxed">
                  Kami telah mengirimkan link reset password ke <strong className="text-[#2B2D42]">{email}</strong>
                </p>
                <p className="text-[#2B2D42]/70 mt-3 text-sm">
                  Silakan cek inbox atau folder spam email kamu
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Link to="/login" className="block">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#FFC8DD] to-[#C8B6FF] rounded-[14px] text-white font-semibold shadow-lg shadow-[#C8B6FF]/30"
                  >
                    Kembali ke Login
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSubmitted(false)}
                  className="w-full py-3.5 bg-white/70 border border-white/80 rounded-[14px] text-[#2B2D42] font-medium hover:bg-white/90 transition-all"
                >
                  Kirim Ulang Email
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
