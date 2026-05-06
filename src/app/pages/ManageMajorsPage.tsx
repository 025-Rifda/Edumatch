import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
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
import { Link } from "react-router-dom";
import { apiUrl } from "../../lib/api";

type CareerProspect = {
  title: string;
  salary: string;
};

type Major = {
  id: number;
  slug: string;
  name: string;
  field: "Saintek" | "Soshum";
  min_score: number;
  ukt_min: number;
  ukt_max: number;
  ukt: number;
  match: number;
  duration: string;
  accreditation: string;
  total_students: string;
  short_desc: string;
  description: string;
  what_you_learn: string[];
  career_prospects: CareerProspect[];
  why_choose: string[];
  icon: string;
  color: string;
};

type EditForm = {
  name: string;
  field: "Saintek" | "Soshum";
  minScore: string;
  uktMin: string;
  uktMax: string;
};

const initialEditForm: EditForm = {
  name: "",
  field: "Saintek",
  minScore: "",
  uktMin: "",
  uktMax: "",
};

export default function ManageMajorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [majors, setMajors] = useState<Major[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(initialEditForm);
  const [errors, setErrors] = useState({
    name: "",
    minScore: "",
    uktMin: "",
    uktMax: "",
    api: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchMajors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl("/admin/majors"));
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal mengambil data jurusan");
      }

      setMajors(data.majors ?? []);
    } catch (error) {
      setErrors((previous) => ({
        ...previous,
        api: error instanceof Error ? error.message : "Gagal mengambil data jurusan",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchMajors();
  }, []);

  const filteredMajors = useMemo(
    () =>
      majors.filter((major) =>
        `${major.name} ${major.slug}`.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [majors, searchQuery],
  );

  const handleEdit = (major: Major) => {
    setEditingId(major.id);
    setEditForm({
      name: major.name,
      field: major.field,
      minScore: String(major.min_score),
      uktMin: String(major.ukt_min),
      uktMax: String(major.ukt_max),
    });
    setErrors({ name: "", minScore: "", uktMin: "", uktMax: "", api: "" });
  };

  const validateForm = (): boolean => {
    const newErrors = { name: "", minScore: "", uktMin: "", uktMax: "", api: "" };
    let isValid = true;

    if (!editForm.name.trim()) {
      newErrors.name = "Nama jurusan wajib diisi";
      isValid = false;
    }

    const score = Number(editForm.minScore);
    if (editForm.minScore === "" || Number.isNaN(score)) {
      newErrors.minScore = "Nilai wajib diisi";
      isValid = false;
    } else if (score < 0 || score > 100) {
      newErrors.minScore = "Nilai harus antara 0-100";
      isValid = false;
    }

    const uktMin = Number(editForm.uktMin);
    if (editForm.uktMin === "" || Number.isNaN(uktMin) || uktMin < 0) {
      newErrors.uktMin = "UKT min harus angka positif";
      isValid = false;
    }

    const uktMax = Number(editForm.uktMax);
    if (editForm.uktMax === "" || Number.isNaN(uktMax) || uktMax < 0) {
      newErrors.uktMax = "UKT max harus angka positif";
      isValid = false;
    }

    if (!Number.isNaN(uktMin) && !Number.isNaN(uktMax) && uktMin > uktMax) {
      newErrors.uktMax = "UKT max harus >= UKT min";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm() || editingId === null) {
      return;
    }

    const currentMajor = majors.find((major) => major.id === editingId);
    if (!currentMajor) {
      return;
    }

    try {
      const response = await fetch(apiUrl("/admin/major"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentMajor.id,
          slug: currentMajor.slug,
          name: editForm.name,
          field: editForm.field,
          min_score: Number(editForm.minScore),
          match: currentMajor.match,
          duration: currentMajor.duration,
          accreditation: currentMajor.accreditation,
          total_students: currentMajor.total_students,
          ukt_min: Number(editForm.uktMin),
          ukt_max: Number(editForm.uktMax),
          short_desc: currentMajor.short_desc,
          description: currentMajor.description,
          what_you_learn: currentMajor.what_you_learn,
          career_prospects: currentMajor.career_prospects,
          why_choose: currentMajor.why_choose,
          icon: currentMajor.icon,
          color: currentMajor.color,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal memperbarui data jurusan");
      }

      setMajors((previous) =>
        previous.map((major) =>
          major.id === editingId ? (result.major as Major) : major,
        ),
      );
      setEditingId(null);
      setSuccessMessage("Data jurusan berhasil diperbarui");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors((previous) => ({
        ...previous,
        api: error instanceof Error ? error.message : "Gagal memperbarui data jurusan",
      }));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(apiUrl("/admin/major"), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus data jurusan");
      }

      setMajors((previous) => previous.filter((major) => major.id !== id));
      setShowDeleteConfirm(null);
      setSuccessMessage("Data jurusan berhasil dihapus");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors((previous) => ({
        ...previous,
        api: error instanceof Error ? error.message : "Gagal menghapus data jurusan",
      }));
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#F0E7FF] via-[#E7F5FF] to-[#FFE7F0]">
      <div className="absolute left-0 top-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-[#C8B6FF]/30 to-[#FFC8DD]/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-[#BDE0FE]/30 to-[#A0E7E5]/30 blur-3xl delay-1000" />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed right-8 top-8 z-50 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Berhasil!</p>
              <p className="text-sm text-gray-600">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6"
        >
          <Link to="/admin-dashboard">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/60 px-4 py-2 text-gray-700 shadow-lg transition-all hover:bg-white/80"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Kembali ke Dashboard</span>
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-3xl border border-white/20 bg-white/60 p-5 shadow-xl backdrop-blur-xl md:p-8"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-1 text-xl font-bold text-gray-800 md:text-3xl">
                Kelola Jurusan
              </h1>
              <p className="text-sm text-gray-600 md:text-base">
                Data jurusan langsung terhubung dengan database
              </p>
            </div>

            <Link to="/admin/add-major" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#C8B6FF]/90 to-[#FFC8DD]/90 px-4 text-[13px] font-semibold text-white shadow-sm transition-all duration-200 hover:from-[#C8B6FF] hover:to-[#FFC8DD] hover:shadow-md sm:w-auto md:px-5"
              >
                <Plus className="h-4 w-4" />
                Tambah Jurusan
              </motion.button>
            </Link>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari jurusan..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white/50 py-3 pl-12 pr-4 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
            />
          </div>

          {errors.api && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.api}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-3xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-4 text-left font-bold text-gray-800">Nama Jurusan</th>
                  <th className="px-4 py-4 text-left font-bold text-gray-800">Bidang Keilmuan</th>
                  <th className="px-4 py-4 text-left font-bold text-gray-800">Nilai Minimal</th>
                  <th className="px-4 py-4 text-left font-bold text-gray-800">Rentang UKT</th>
                  <th className="px-4 py-4 text-center font-bold text-gray-800">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Memuat data jurusan...
                    </td>
                  </tr>
                ) : filteredMajors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
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
                      className="border-b border-gray-100 transition-all hover:bg-white/30"
                    >
                      {editingId === major.id ? (
                        <>
                          <td className="px-4 py-4">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(event) =>
                                setEditForm((previous) => ({
                                  ...previous,
                                  name: event.target.value,
                                }))
                              }
                              className="w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                            />
                            {errors.name && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name}
                              </div>
                            )}
                            <p className="mt-1 text-xs text-gray-400">Slug: {major.slug}</p>
                          </td>
                          <td className="px-4 py-4">
                            <select
                              value={editForm.field}
                              onChange={(event) =>
                                setEditForm((previous) => ({
                                  ...previous,
                                  field: event.target.value as "Saintek" | "Soshum",
                                }))
                              }
                              className="w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                            >
                              <option value="Saintek">Saintek</option>
                              <option value="Soshum">Soshum</option>
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              value={editForm.minScore}
                              onChange={(event) =>
                                setEditForm((previous) => ({
                                  ...previous,
                                  minScore: event.target.value,
                                }))
                              }
                              className="w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                            />
                            {errors.minScore && (
                              <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                {errors.minScore}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <div>
                                <input
                                  type="number"
                                  value={editForm.uktMin}
                                  onChange={(event) =>
                                    setEditForm((previous) => ({
                                      ...previous,
                                      uktMin: event.target.value,
                                    }))
                                  }
                                  placeholder="UKT Min"
                                  className="w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                                />
                                {errors.uktMin && (
                                  <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.uktMin}
                                  </div>
                                )}
                              </div>
                              <div>
                                <input
                                  type="number"
                                  value={editForm.uktMax}
                                  onChange={(event) =>
                                    setEditForm((previous) => ({
                                      ...previous,
                                      uktMax: event.target.value,
                                    }))
                                  }
                                  placeholder="UKT Max"
                                  className="w-full rounded-xl border border-gray-200 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                                />
                                {errors.uktMax && (
                                  <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.uktMax}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSave}
                                className="rounded-lg bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] p-2 text-white transition-all hover:shadow-lg"
                              >
                                <Check className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setEditingId(null)}
                                className="rounded-lg bg-gray-200 p-2 text-gray-700 transition-all hover:bg-gray-300"
                              >
                                <X className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-4 font-semibold text-gray-800">
                            <div>{major.name}</div>
                            <div className="mt-1 text-xs text-gray-400">{major.slug}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-sm font-medium ${
                                major.field === "Saintek"
                                  ? "bg-gradient-to-r from-[#BDE0FE]/30 to-[#A0E7E5]/30 text-blue-700"
                                  : "bg-gradient-to-r from-[#FFC8DD]/30 to-[#FFB4D2]/30 text-pink-700"
                              }`}
                            >
                              {major.field}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-semibold text-gray-700">
                            {major.min_score}
                          </td>
                          <td className="px-4 py-4 text-gray-700">
                            <div className="text-sm">
                              <div className="font-medium">{formatCurrency(major.ukt_min)}</div>
                              <div className="text-gray-500">s/d</div>
                              <div className="font-medium">{formatCurrency(major.ukt_max)}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(major)}
                                className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-all hover:bg-blue-100"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowDeleteConfirm(major.id)}
                                className="rounded-lg bg-red-50 p-2 text-red-600 transition-all hover:bg-red-100"
                                title="Hapus"
                              >
                                <Trash2 className="h-4 w-4" />
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

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
                Konfirmasi Hapus
              </h3>
              <p className="mb-6 text-center text-gray-600">
                Apakah Anda yakin ingin menghapus data jurusan ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 rounded-2xl bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-300"
                >
                  Batal
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
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
