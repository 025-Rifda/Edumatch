import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router";

interface Major {
  id: number;
  name: string;
  field: string;
  minScore: number;
  uktMin: number;
  uktMax: number;
}

const dummyMajors: Major[] = [
  {
    id: 1,
    name: "Teknik Informatika",
    field: "Saintek",
    minScore: 85,
    uktMin: 500000,
    uktMax: 10000000,
  },
  {
    id: 2,
    name: "Kedokteran",
    field: "Saintek",
    minScore: 90,
    uktMin: 1000000,
    uktMax: 25000000,
  },
  {
    id: 3,
    name: "Manajemen",
    field: "Soshum",
    minScore: 75,
    uktMin: 500000,
    uktMax: 12000000,
  },
  {
    id: 4,
    name: "Psikologi",
    field: "Soshum",
    minScore: 78,
    uktMin: 500000,
    uktMax: 10000000,
  },
  {
    id: 5,
    name: "Teknik Elektro",
    field: "Saintek",
    minScore: 82,
    uktMin: 500000,
    uktMax: 9000000,
  },
  {
    id: 6,
    name: "Hukum",
    field: "Soshum",
    minScore: 80,
    uktMin: 500000,
    uktMax: 11000000,
  },
  {
    id: 7,
    name: "Akuntansi",
    field: "Soshum",
    minScore: 76,
    uktMin: 500000,
    uktMax: 10000000,
  },
  {
    id: 8,
    name: "Farmasi",
    field: "Saintek",
    minScore: 83,
    uktMin: 500000,
    uktMax: 15000000,
  },
];

export default function ManageMajorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [majors, setMajors] = useState<Major[]>(dummyMajors);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    field: "",
    minScore: "",
    uktMin: "",
    uktMax: "",
  });
  const [errors, setErrors] = useState({
    minScore: "",
    uktMin: "",
    uktMax: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");

  const filteredMajors = majors.filter((major) =>
    major.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (major: Major) => {
    setEditingId(major.id);
    setEditForm({
      name: major.name,
      field: major.field,
      minScore: major.minScore.toString(),
      uktMin: major.uktMin.toString(),
      uktMax: major.uktMax.toString(),
    });
    setErrors({ minScore: "", uktMin: "", uktMax: "" });
  };

  const validateForm = (): boolean => {
    const newErrors = { minScore: "", uktMin: "", uktMax: "" };
    let isValid = true;

    // Validate minScore
    const score = parseFloat(editForm.minScore);
    if (editForm.minScore === "" || isNaN(score)) {
      newErrors.minScore = "Nilai wajib diisi";
      isValid = false;
    } else if (score < 0 || score > 100) {
      newErrors.minScore = "Nilai harus antara 0-100";
      isValid = false;
    }

    // Validate UKT Min
    const uktMin = parseFloat(editForm.uktMin);
    if (editForm.uktMin === "" || isNaN(uktMin) || uktMin < 0) {
      newErrors.uktMin = "UKT min harus angka positif";
      isValid = false;
    }

    // Validate UKT Max
    const uktMax = parseFloat(editForm.uktMax);
    if (editForm.uktMax === "" || isNaN(uktMax) || uktMax < 0) {
      newErrors.uktMax = "UKT max harus angka positif";
      isValid = false;
    }

    // Validate UKT min <= UKT max
    if (!isNaN(uktMin) && !isNaN(uktMax) && uktMin > uktMax) {
      newErrors.uktMax = "UKT max harus ≥ UKT min";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setMajors(
      majors.map((major) =>
        major.id === editingId
          ? {
              ...major,
              name: editForm.name,
              field: editForm.field,
              minScore: parseFloat(editForm.minScore),
              uktMin: parseFloat(editForm.uktMin),
              uktMax: parseFloat(editForm.uktMax),
            }
          : major
      )
    );
    setEditingId(null);
    setSuccessMessage("Data jurusan berhasil diperbarui");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id: number) => {
    setMajors(majors.filter((major) => major.id !== id));
    setShowDeleteConfirm(null);
    setSuccessMessage("Data jurusan berhasil dihapus");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
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
              <p className="text-sm text-gray-600">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
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
              <span className="font-medium">Kembali ke Dashboard</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Header Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-5 md:p-8 shadow-xl border border-white/20 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-1 md:mb-2">
                Kelola Jurusan
              </h1>
              <p className="text-sm md:text-base text-gray-600">Manajemen data jurusan sistem</p>
            </div>

            {/* Add Major Button - Android Optimized */}
            <Link to="/admin/add-major" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto h-11 px-4 md:px-5 bg-gradient-to-r from-[#C8B6FF]/90 to-[#FFC8DD]/90 rounded-[12px] text-white text-[13px] font-semibold shadow-sm hover:shadow-md hover:from-[#C8B6FF] hover:to-[#FFC8DD] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Jurusan
              </motion.button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari jurusan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] transition-all"
            />
          </div>
        </motion.div>

        {/* Majors Table Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Nama Jurusan
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Bidang Keilmuan
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Nilai Minimal
                  </th>
                  <th className="text-left py-4 px-4 font-bold text-gray-800">
                    Rentang UKT
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-gray-800">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMajors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Tidak ada data jurusan ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredMajors.map((major, index) => (
                    <motion.tr
                      key={major.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-white/30 transition-all"
                    >
                      {editingId === major.id ? (
                        <>
                          {/* Edit Mode */}
                          <td className="py-4 px-4">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm({ ...editForm, name: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={editForm.field}
                              onChange={(e) =>
                                setEditForm({ ...editForm, field: e.target.value })
                              }
                              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                            >
                              <option value="Saintek">Saintek</option>
                              <option value="Soshum">Soshum</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <input
                                type="number"
                                value={editForm.minScore}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    minScore: e.target.value,
                                  })
                                }
                                className={`w-full px-3 py-2 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 ${
                                  errors.minScore
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-gray-200 focus:ring-[#C8B6FF]"
                                }`}
                              />
                              {errors.minScore && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                                  <AlertCircle className="w-3 h-3" />
                                  {errors.minScore}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-2">
                              <div>
                                <input
                                  type="number"
                                  value={editForm.uktMin}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      uktMin: e.target.value,
                                    })
                                  }
                                  placeholder="UKT Min"
                                  className={`w-full px-3 py-2 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
                                    errors.uktMin
                                      ? "border-red-400 focus:ring-red-400"
                                      : "border-gray-200 focus:ring-[#C8B6FF]"
                                  }`}
                                />
                                {errors.uktMin && (
                                  <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.uktMin}
                                  </div>
                                )}
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={editForm.uktMax}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      uktMax: e.target.value,
                                    })
                                  }
                                  placeholder="UKT Max"
                                  className={`w-full px-3 py-2 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 text-sm ${
                                    errors.uktMax
                                      ? "border-red-400 focus:ring-red-400"
                                      : "border-gray-200 focus:ring-[#C8B6FF]"
                                  }`}
                                />
                                {errors.uktMax && (
                                  <div className="flex items-center gap-1 mt-1 text-xs text-red-600">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.uktMax}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSave}
                                className="p-2 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] text-white rounded-lg hover:shadow-lg transition-all"
                              >
                                <Check className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEditingId(null)}
                                className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {/* View Mode */}
                          <td className="py-4 px-4 font-semibold text-gray-800">
                            {major.name}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                major.field === "Saintek"
                                  ? "bg-gradient-to-r from-[#BDE0FE]/30 to-[#A0E7E5]/30 text-blue-700"
                                  : "bg-gradient-to-r from-[#FFC8DD]/30 to-[#FFB4D2]/30 text-pink-700"
                              }`}
                            >
                              {major.field}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-700 font-semibold">
                            {major.minScore}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            <div className="text-sm">
                              <div className="font-medium">
                                {formatCurrency(major.uktMin)}
                              </div>
                              <div className="text-gray-500">s/d</div>
                              <div className="font-medium">
                                {formatCurrency(major.uktMax)}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(major)}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowDeleteConfirm(major.id)}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </td>
                        </>
                      )}
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 max-w-md w-full"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Apakah Anda yakin ingin menghapus data jurusan ini? Tindakan ini
                tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                >
                  Hapus
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
