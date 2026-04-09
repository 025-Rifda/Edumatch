import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  ArrowLeft,
  GraduationCap,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

interface FormData {
  name: string;
  field: string;
  minScore: string;
  uktMin: string;
  uktMax: string;
  description: string;
}

interface FormErrors {
  name: string;
  field: string;
  minScore: string;
  uktMin: string;
  uktMax: string;
  description: string;
}

export default function AddMajorPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    field: "",
    minScore: "",
    uktMin: "",
    uktMax: "",
    description: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    field: "",
    minScore: "",
    uktMin: "",
    uktMax: "",
    description: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: "",
      field: "",
      minScore: "",
      uktMin: "",
      uktMax: "",
      description: "",
    };

    let isValid = true;

    // Validate Nama Jurusan
    if (!formData.name.trim()) {
      newErrors.name = "Nama jurusan wajib diisi";
      isValid = false;
    }

    // Validate Bidang Keilmuan
    if (!formData.field) {
      newErrors.field = "Bidang keilmuan wajib dipilih";
      isValid = false;
    }

    // Validate Nilai Minimal
    if (!formData.minScore) {
      newErrors.minScore = "Nilai minimal wajib diisi";
      isValid = false;
    } else {
      const score = parseFloat(formData.minScore);
      if (isNaN(score)) {
        newErrors.minScore = "Nilai harus berupa angka";
        isValid = false;
      } else if (score < 0 || score > 100) {
        newErrors.minScore = "Nilai harus antara 0-100";
        isValid = false;
      }
    }

    // Validate UKT Min
    if (!formData.uktMin) {
      newErrors.uktMin = "UKT minimum wajib diisi";
      isValid = false;
    } else {
      const uktMin = parseFloat(formData.uktMin);
      if (isNaN(uktMin) || uktMin < 0) {
        newErrors.uktMin = "UKT minimum harus berupa angka positif";
        isValid = false;
      }
    }

    // Validate UKT Max
    if (!formData.uktMax) {
      newErrors.uktMax = "UKT maksimum wajib diisi";
      isValid = false;
    } else {
      const uktMax = parseFloat(formData.uktMax);
      if (isNaN(uktMax) || uktMax < 0) {
        newErrors.uktMax = "UKT maksimum harus berupa angka positif";
        isValid = false;
      }
    }

    // Validate UKT min <= UKT max
    if (formData.uktMin && formData.uktMax) {
      const uktMin = parseFloat(formData.uktMin);
      const uktMax = parseFloat(formData.uktMax);
      if (!isNaN(uktMin) && !isNaN(uktMax) && uktMin > uktMax) {
        newErrors.uktMax = "UKT maksimum harus lebih besar atau sama dengan UKT minimum";
        isValid = false;
      }
    }

    // Validate Deskripsi
    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi jurusan wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Mock save to database
    console.log("Data jurusan tersimpan:", formData);

    // Show success notification
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Navigate back to admin dashboard after success
      navigate("/admin");
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      field: "",
      minScore: "",
      uktMin: "",
      uktMax: "",
      description: "",
    });
    setErrors({
      name: "",
      field: "",
      minScore: "",
      uktMin: "",
      uktMax: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0E7FF] via-[#E7F5FF] to-[#FFE7F0] relative overflow-hidden">
      {/* Floating Blobs Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#C8B6FF]/30 to-[#FFC8DD]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-[#BDE0FE]/30 to-[#A0E7E5]/30 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/60 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Berhasil!</p>
              <p className="text-sm text-gray-600">Data jurusan berhasil disimpan</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <Link to="/admin">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl rounded-2xl text-gray-700 hover:bg-white/80 transition-all border border-white/20 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Kembali</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8B6FF] to-[#FFC8DD] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Tambah Data Jurusan
              </h1>
              <p className="text-gray-600 mt-1">
                Masukkan informasi lengkap jurusan baru
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Jurusan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Jurusan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Contoh: Teknik Informatika"
                className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-[#C8B6FF]"
                }`}
              />
              {errors.name && (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* Bidang Keilmuan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bidang Keilmuan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.field}
                onChange={(e) => handleInputChange("field", e.target.value)}
                className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border focus:outline-none focus:ring-2 transition-all ${
                  errors.field
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-[#C8B6FF]"
                }`}
              >
                <option value="">Pilih Bidang Keilmuan</option>
                <option value="Saintek">Saintek</option>
                <option value="Soshum">Soshum</option>
              </select>
              {errors.field && (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.field}
                </div>
              )}
            </div>

            {/* Nilai Minimal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nilai Minimal (0-100) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.minScore}
                onChange={(e) => handleInputChange("minScore", e.target.value)}
                placeholder="Contoh: 85"
                min="0"
                max="100"
                step="0.01"
                className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border focus:outline-none focus:ring-2 transition-all ${
                  errors.minScore
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-[#C8B6FF]"
                }`}
              />
              {errors.minScore && (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.minScore}
                </div>
              )}
            </div>

            {/* Rentang UKT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UKT Minimum */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  UKT Minimum (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.uktMin}
                  onChange={(e) => handleInputChange("uktMin", e.target.value)}
                  placeholder="Contoh: 500000"
                  min="0"
                  step="100000"
                  className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border focus:outline-none focus:ring-2 transition-all ${
                    errors.uktMin
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:ring-[#C8B6FF]"
                  }`}
                />
                {errors.uktMin && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.uktMin}
                  </div>
                )}
              </div>

              {/* UKT Maximum */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  UKT Maksimum (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.uktMax}
                  onChange={(e) => handleInputChange("uktMax", e.target.value)}
                  placeholder="Contoh: 10000000"
                  min="0"
                  step="100000"
                  className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border focus:outline-none focus:ring-2 transition-all ${
                    errors.uktMax
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-200 focus:ring-[#C8B6FF]"
                  }`}
                />
                {errors.uktMax && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {errors.uktMax}
                  </div>
                )}
              </div>
            </div>

            {/* Deskripsi Jurusan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi Jurusan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Masukkan deskripsi lengkap tentang jurusan ini, prospek karir, dan informasi relevan lainnya..."
                rows={5}
                className={`w-full px-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description
                    ? "border-red-400 focus:ring-red-400"
                    : "border-gray-200 focus:ring-[#C8B6FF]"
                }`}
              />
              {errors.description && (
                <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {/* Reset Button */}
              <motion.button
                type="button"
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] text-white rounded-2xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                Simpan
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
