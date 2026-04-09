import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Search, Edit, X, Check, AlertCircle } from "lucide-react";

interface UKTData {
  id: number;
  majorName: string;
  minUKT: number;
  maxUKT: number;
}

const dummyUKTData: UKTData[] = [
  { id: 1, majorName: "Teknik Informatika", minUKT: 500000, maxUKT: 8000000 },
  { id: 2, majorName: "Kedokteran", minUKT: 1000000, maxUKT: 15000000 },
  { id: 3, majorName: "Manajemen", minUKT: 500000, maxUKT: 6000000 },
  { id: 4, majorName: "Psikologi", minUKT: 500000, maxUKT: 7000000 },
  { id: 5, majorName: "Teknik Elektro", minUKT: 500000, maxUKT: 7500000 },
  { id: 6, majorName: "Hukum", minUKT: 500000, maxUKT: 6500000 },
  { id: 7, majorName: "Akuntansi", minUKT: 500000, maxUKT: 6000000 },
  { id: 8, majorName: "Farmasi", minUKT: 750000, maxUKT: 9000000 },
];

export function UKTManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [uktData, setUktData] = useState<UKTData[]>(dummyUKTData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ minUKT: "", maxUKT: "" });
  const [errors, setErrors] = useState({ minUKT: "", maxUKT: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredData = uktData.filter((item) =>
    item.majorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleEdit = (item: UKTData) => {
    setEditingId(item.id);
    setEditForm({
      minUKT: item.minUKT.toString(),
      maxUKT: item.maxUKT.toString(),
    });
    setErrors({ minUKT: "", maxUKT: "" });
  };

  const validateForm = (): boolean => {
    const newErrors = { minUKT: "", maxUKT: "" };
    const minValue = parseFloat(editForm.minUKT);
    const maxValue = parseFloat(editForm.maxUKT);

    if (editForm.minUKT === "" || isNaN(minValue)) {
      newErrors.minUKT = "UKT minimal wajib diisi";
    } else if (minValue < 500000) {
      newErrors.minUKT = "UKT minimal harus >= Rp 500.000";
    }

    if (editForm.maxUKT === "" || isNaN(maxValue)) {
      newErrors.maxUKT = "UKT maksimal wajib diisi";
    } else if (maxValue <= minValue) {
      newErrors.maxUKT = "UKT maksimal harus > UKT minimal";
    }

    setErrors(newErrors);
    return !newErrors.minUKT && !newErrors.maxUKT;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setUktData(
      uktData.map((item) =>
        item.id === editingId
          ? {
              ...item,
              minUKT: parseFloat(editForm.minUKT),
              maxUKT: parseFloat(editForm.maxUKT),
            }
          : item
      )
    );
    setEditingId(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 md:space-y-6"
    >
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 md:top-8 md:right-8 z-50 bg-white/90 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-4 shadow-2xl border border-white/60 flex items-center gap-2 md:gap-3 max-w-[calc(100vw-2rem)]"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm md:text-base">Berhasil!</p>
              <p className="text-xs md:text-sm text-gray-600">Data UKT berhasil diperbarui</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white/60 backdrop-blur-xl rounded-xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-1">
            Kelola Data UKT
          </h2>
          <p className="text-xs md:text-base text-gray-600">
            Edit rentang biaya kuliah untuk setiap jurusan
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari jurusan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base bg-white/50 backdrop-blur-sm rounded-xl md:rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] transition-all"
          />
        </div>
      </div>

      {/* UKT Table */}
      <div className="bg-white/60 backdrop-blur-xl rounded-xl md:rounded-3xl p-3 md:p-8 shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 md:py-4 px-2 md:px-4 font-semibold text-gray-700 text-xs md:text-base">
                  Nama Jurusan
                </th>
                <th className="text-left py-3 md:py-4 px-2 md:px-4 font-semibold text-gray-700 text-xs md:text-base">
                  Rentang UKT
                </th>
                <th className="text-left py-3 md:py-4 px-2 md:px-4 font-semibold text-gray-700 text-xs md:text-base">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-white/30 transition-all"
                >
                  {editingId === item.id ? (
                    <>
                      <td className="py-3 md:py-4 px-2 md:px-4 font-medium text-gray-800 text-xs md:text-base">
                        {item.majorName}
                      </td>
                      <td className="py-3 md:py-4 px-2 md:px-4">
                        <div className="space-y-2 md:space-y-3">
                          <div>
                            <label className="block text-[10px] md:text-xs font-medium text-gray-600 mb-1">
                              UKT Minimal (Rp)
                            </label>
                            <input
                              type="number"
                              value={editForm.minUKT}
                              onChange={(e) => {
                                setEditForm({ ...editForm, minUKT: e.target.value });
                                setErrors({ ...errors, minUKT: "" });
                              }}
                              className={`w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-white/50 border rounded-lg md:rounded-xl focus:outline-none focus:ring-2 ${
                                errors.minUKT
                                  ? "border-red-400 focus:ring-red-400"
                                  : "border-gray-200 focus:ring-[#C8B6FF]"
                              }`}
                            />
                            {errors.minUKT && (
                              <div className="flex items-center gap-1 mt-1 text-[10px] md:text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                {errors.minUKT}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-[10px] md:text-xs font-medium text-gray-600 mb-1">
                              UKT Maksimal (Rp)
                            </label>
                            <input
                              type="number"
                              value={editForm.maxUKT}
                              onChange={(e) => {
                                setEditForm({ ...editForm, maxUKT: e.target.value });
                                setErrors({ ...errors, maxUKT: "" });
                              }}
                              className={`w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-white/50 border rounded-lg md:rounded-xl focus:outline-none focus:ring-2 ${
                                errors.maxUKT
                                  ? "border-red-400 focus:ring-red-400"
                                  : "border-gray-200 focus:ring-[#C8B6FF]"
                              }`}
                            />
                            {errors.maxUKT && (
                              <div className="flex items-center gap-1 mt-1 text-[10px] md:text-xs text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                {errors.maxUKT}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2 md:px-4">
                        <div className="flex gap-1.5 md:gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSave}
                            className="p-1.5 md:p-2 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] text-white rounded-lg hover:shadow-lg transition-all"
                          >
                            <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingId(null);
                              setErrors({ minUKT: "", maxUKT: "" });
                            }}
                            className="p-1.5 md:p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                          >
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 md:py-4 px-2 md:px-4 font-medium text-gray-800 text-xs md:text-base">
                        {item.majorName}
                      </td>
                      <td className="py-3 md:py-4 px-2 md:px-4">
                        <div className="space-y-0.5 md:space-y-1">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <span className="text-[10px] md:text-sm text-gray-600">Min:</span>
                            <span className="font-semibold text-gray-800 text-xs md:text-base">
                              {formatCurrency(item.minUKT)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <span className="text-[10px] md:text-sm text-gray-600">Max:</span>
                            <span className="font-semibold text-gray-800 text-xs md:text-base">
                              {formatCurrency(item.maxUKT)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 md:py-4 px-2 md:px-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(item)}
                          className="p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                        >
                          <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </motion.button>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-[#BDE0FE]/20 to-[#C8B6FF]/20 backdrop-blur-sm border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6"
      >
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm md:text-base">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-[#C8B6FF]" />
          Ketentuan Validasi
        </h3>
        <ul className="text-[11px] md:text-sm text-gray-600 space-y-1 md:space-y-2">
          <li>• UKT minimal harus lebih besar atau sama dengan Rp 500.000</li>
          <li>• UKT maksimal harus lebih besar dari UKT minimal</li>
          <li>• Klik ikon edit untuk mengubah rentang UKT jurusan</li>
          <li>• Pastikan data yang dimasukkan akurat dan sesuai kebijakan</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}