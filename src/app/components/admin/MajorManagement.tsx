import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Search, Edit, Trash2, X, Check, AlertCircle } from "lucide-react";
import { majorEntries } from "../../../data/majors";

interface Major {
  id: number;
  slug: string;
  name: string;
  field: string;
  minScore: number;
}

const initialMajors: Major[] = majorEntries.map((major) => ({
  id: major.id,
  slug: major.slug,
  name: major.name,
  field: major.field,
  minScore: major.minScore,
}));

export function MajorManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [majors, setMajors] = useState<Major[]>(initialMajors);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", field: "", minScore: "" });
  const [errors, setErrors] = useState({ minScore: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const filteredMajors = majors.filter((major) =>
    `${major.name} ${major.slug}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (major: Major) => {
    setEditingId(major.id);
    setEditForm({
      name: major.name,
      field: major.field,
      minScore: major.minScore.toString(),
    });
    setErrors({ minScore: "" });
  };

  const validateScore = (value: string): boolean => {
    const numValue = parseFloat(value);
    if (value === "" || Number.isNaN(numValue)) {
      setErrors({ minScore: "Nilai wajib diisi" });
      return false;
    }
    if (numValue < 0 || numValue > 100) {
      setErrors({ minScore: "Nilai harus antara 0-100" });
      return false;
    }
    setErrors({ minScore: "" });
    return true;
  };

  const handleSave = () => {
    if (!validateScore(editForm.minScore)) return;

    setMajors(
      majors.map((major) =>
        major.id === editingId
          ? {
              ...major,
              name: editForm.name,
              field: editForm.field,
              minScore: parseFloat(editForm.minScore),
            }
          : major
      )
    );
    setEditingId(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id: number) => {
    setMajors(majors.filter((major) => major.id !== id));
    setShowDeleteConfirm(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
              <p className="text-sm text-gray-600">Data berhasil diperbarui</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kelola Data Jurusan</h2>
          <p className="text-gray-600">Edit atau hapus data jurusan</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari jurusan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF] transition-all"
          />
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Nama Jurusan</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Bidang Keilmuan</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Nilai Minimum Jurusan</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredMajors.map((major, index) => (
                <motion.tr
                  key={major.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-white/30 transition-all"
                >
                  {editingId === major.id ? (
                    <>
                      <td className="py-4 px-4">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                        />
                        <p className="text-xs text-gray-400 mt-1">Slug: {major.slug}</p>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={editForm.field}
                          onChange={(e) => setEditForm({ ...editForm, field: e.target.value })}
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
                            onChange={(e) => {
                              setEditForm({ ...editForm, minScore: e.target.value });
                              validateScore(e.target.value);
                            }}
                            className={`w-full px-3 py-2 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 ${
                              errors.minScore ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-[#C8B6FF]"
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
                        <div className="flex gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleSave} className="p-2 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] text-white rounded-lg hover:shadow-lg transition-all">
                            <Check className="w-4 h-4" />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditingId(null)} className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all">
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-4 px-4 font-medium text-gray-800">
                        <div>{major.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{major.slug}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#BDE0FE]/30 to-[#A0E7E5]/30 text-gray-700">
                          {major.field}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 font-semibold">{major.minScore}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(major)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowDeleteConfirm(major.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Konfirmasi Hapus</h3>
              <p className="text-gray-600 text-center mb-6">Apakah Anda yakin ingin menghapus data jurusan ini? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteConfirm(null)} className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-all">
                  Batal
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
                  Hapus
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
