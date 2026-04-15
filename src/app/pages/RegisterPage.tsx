import { motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, User, GraduationCap, ArrowRight, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    major: "IPA",
    agreed: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    major: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      major: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Nama lengkap wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    if (!formData.major) {
      newErrors.major = "Jurusan SMA wajib dipilih";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword && !newErrors.major;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          jurusan: formData.major,
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Registrasi gagal");
      }

      alert(result.message || "Registrasi berhasil");
      navigate("/login");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Registrasi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 py-12">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/30 via-[#FFC8DD]/20 to-[#BDE0FE]/30" />

      {/* Floating Blobs */}
      <motion.div
        className="absolute top-10 left-10 w-80 h-80 bg-[#C8B6FF]/30 rounded-full blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-80 h-80 bg-[#A0E7E5]/30 rounded-full blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
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
          <h2 className="text-3xl font-semibold text-[#2B2D42] text-center">
            Bergabung Bersama Kami
          </h2>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 shadow-2xl border border-white/60"
        >
          <h3 className="text-2xl font-semibold text-[#2B2D42] mb-6">
            Buat Akun Baru
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm text-[#2B2D42] mb-2 font-medium">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  errors.name 
                    ? "text-red-500" 
                    : "text-[#2B2D42]/50 group-focus-within:text-[#C8B6FF]"
                }`} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nama lengkap kamu"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/50 border rounded-[14px] text-[#2B2D42] placeholder:text-[#2B2D42]/40 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                      : "border-white/60 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF]"
                  }`}
                />
              </div>
              {errors.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </motion.div>
              )}
            </div>

            {/* Email */}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* Password */}
            <div>
              <label className="block text-sm text-[#2B2D42] mb-2 font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  errors.password 
                    ? "text-red-500" 
                    : "text-[#2B2D42]/50 group-focus-within:text-[#C8B6FF]"
                }`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-[#2B2D42] mb-2 font-medium">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  errors.confirmPassword 
                    ? "text-red-500" 
                    : "text-[#2B2D42]/50 group-focus-within:text-[#C8B6FF]"
                }`} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/50 border rounded-[14px] text-[#2B2D42] placeholder:text-[#2B2D42]/40 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                      : "border-white/60 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2B2D42]/50 hover:text-[#C8B6FF] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </motion.div>
              )}
            </div>

            {/* Major Selection */}
            <div>
              <label className="block text-sm text-[#2B2D42] mb-2 font-medium">
                Jurusan SMA <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <GraduationCap className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                  errors.major 
                    ? "text-red-500" 
                    : "text-[#2B2D42]/50 group-focus-within:text-[#C8B6FF]"
                }`} />
                <select
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/50 border rounded-[14px] text-[#2B2D42] focus:outline-none focus:ring-2 transition-all duration-200 appearance-none cursor-pointer ${
                    errors.major
                      ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
                      : "border-white/60 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF]"
                  }`}
                >
                  <option value="IPA">IPA</option>
                  <option value="IPS">IPS</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-[#2B2D42]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.major && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1 mt-2 text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.major}</span>
                </motion.div>
              )}
            </div>

            {/* Register Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-[#A0E7E5] to-[#C8B6FF] rounded-[14px] text-white font-semibold shadow-lg shadow-[#C8B6FF]/30 hover:shadow-xl hover:shadow-[#C8B6FF]/40 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Login Link */}
            <p className="text-center text-sm text-[#2B2D42]/70 pt-2">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-[#C8B6FF] font-semibold hover:underline">
                Masuk
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
