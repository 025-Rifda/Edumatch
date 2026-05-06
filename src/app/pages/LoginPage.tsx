import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap, ArrowRight, AlertCircle } from "lucide-react";
import { apiUrl } from "../../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!password.trim()) {
      newErrors.password = "Password wajib diisi";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch(apiUrl("/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Login gagal");
      }

      localStorage.setItem("user", JSON.stringify(result.user));
      navigate(result.user.is_admin ? "/admin-dashboard" : "/dashboard");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login gagal");
    } finally {
      setIsLoading(false);
    }
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
            Mulai perjalananmu
          </h2>
          <p className="text-[#2B2D42]/70 text-center">
            menemukan jurusan impian
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 shadow-2xl border border-white/60"
        >
          <h3 className="text-2xl font-semibold text-[#2B2D42] mb-6">
            Masuk ke Akunmu
          </h3>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label className="block text-sm text-[#2B2D42] mb-2 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  errors.email 
                    ? "text-red-500" 
                    : "text-[#2B2D42]/50 group-focus-within:text-[#C8B6FF]"
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="nama@email.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/50 border rounded-[14px] text-[#2B2D42] placeholder:text-[#2B2D42]/40 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                      : "border-white/60 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF]"
                  }`}
                />
              </div>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </motion.div>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-[#2B2D42] font-medium">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#C8B6FF] font-medium hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  errors.password 
                    ? "text-red-500" 
                    : "text-[#2B2D42]/50 group-focus-within:text-[#C8B6FF]"
                }`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/50 border rounded-[14px] text-[#2B2D42] placeholder:text-[#2B2D42]/40 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                      : "border-white/60 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2B2D42]/50 hover:text-[#C8B6FF] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </motion.div>
              )}
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-[#C8B6FF]/90 to-[#FFC8DD]/90 rounded-[12px] text-white text-[13px] font-semibold shadow-sm hover:shadow-md hover:from-[#C8B6FF] hover:to-[#FFC8DD] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? "Memproses..." : "Masuk"}
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            {/* Register Link */}
            <p className="text-center text-sm text-[#2B2D42]/70">
              Belum punya akun?{" "}
              <Link
                to="/register"
                className="text-[#C8B6FF] font-semibold hover:underline"
              >
                Daftar
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
