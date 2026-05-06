import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  ArrowLeft,
  GraduationCap,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../../lib/api";

type CareerProspectInput = {
  title: string;
  salary: string;
};

type FormData = {
  name: string;
  field: "Saintek" | "Soshum" | "";
  minScore: string;
  match: string;
  duration: string;
  accreditation: string;
  totalStudents: string;
  uktMin: string;
  uktMax: string;
  shortDesc: string;
  description: string;
  whatYouLearn: string[];
  careerProspects: CareerProspectInput[];
  whyChoose: string[];
  icon: string;
  color: string;
};

type FormErrors = {
  name: string;
  field: string;
  minScore: string;
  match: string;
  duration: string;
  accreditation: string;
  totalStudents: string;
  uktMin: string;
  uktMax: string;
  shortDesc: string;
  description: string;
  whatYouLearn: string;
  careerProspects: string;
  whyChoose: string;
  icon: string;
  color: string;
  api: string;
};

const getInitialFormData = (): FormData => ({
  name: "",
  field: "",
  minScore: "",
  match: "0",
  duration: "8 Semester (4 Tahun)",
  accreditation: "Baik",
  totalStudents: "",
  uktMin: "",
  uktMax: "",
  shortDesc: "",
  description: "",
  whatYouLearn: [""],
  careerProspects: [{ title: "", salary: "" }],
  whyChoose: [""],
  icon: "",
  color: "",
});

const getInitialErrors = (): FormErrors => ({
  name: "",
  field: "",
  minScore: "",
  match: "",
  duration: "",
  accreditation: "",
  totalStudents: "",
  uktMin: "",
  uktMax: "",
  shortDesc: "",
  description: "",
  whatYouLearn: "",
  careerProspects: "",
  whyChoose: "",
  icon: "",
  color: "",
  api: "",
});

const createEmptyCareer = (): CareerProspectInput => ({ title: "", salary: "" });

const FieldError = ({ message }: { message: string }) =>
  message ? (
    <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
      <AlertCircle className="h-4 w-4" />
      {message}
    </div>
  ) : null;

export default function AddMajorPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(getInitialFormData());
  const [errors, setErrors] = useState<FormErrors>(getInitialErrors());

  const validateForm = (): boolean => {
    const newErrors = getInitialErrors();
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Nama jurusan wajib diisi";
      isValid = false;
    }

    if (!formData.field) {
      newErrors.field = "Bidang keilmuan wajib dipilih";
      isValid = false;
    }

    const minScore = Number(formData.minScore);
    if (!formData.minScore) {
      newErrors.minScore = "Nilai minimal wajib diisi";
      isValid = false;
    } else if (Number.isNaN(minScore) || minScore < 0 || minScore > 100) {
      newErrors.minScore = "Nilai minimal harus antara 0-100";
      isValid = false;
    }

    const match = Number(formData.match);
    if (formData.match === "") {
      newErrors.match = "Persentase kesesuaian wajib diisi";
      isValid = false;
    } else if (Number.isNaN(match) || match < 0 || match > 100) {
      newErrors.match = "Persentase kesesuaian harus antara 0-100";
      isValid = false;
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Durasi wajib diisi";
      isValid = false;
    }

    if (!formData.accreditation.trim()) {
      newErrors.accreditation = "Akreditasi wajib diisi";
      isValid = false;
    }

    if (!formData.totalStudents.trim()) {
      newErrors.totalStudents = "Jumlah mahasiswa wajib diisi";
      isValid = false;
    }

    const uktMin = Number(formData.uktMin);
    const uktMax = Number(formData.uktMax);

    if (!formData.uktMin) {
      newErrors.uktMin = "UKT minimum wajib diisi";
      isValid = false;
    } else if (Number.isNaN(uktMin) || uktMin < 0) {
      newErrors.uktMin = "UKT minimum harus berupa angka positif";
      isValid = false;
    }

    if (!formData.uktMax) {
      newErrors.uktMax = "UKT maksimum wajib diisi";
      isValid = false;
    } else if (Number.isNaN(uktMax) || uktMax < 0) {
      newErrors.uktMax = "UKT maksimum harus berupa angka positif";
      isValid = false;
    } else if (!Number.isNaN(uktMin) && uktMin > uktMax) {
      newErrors.uktMax = "UKT maksimum harus lebih besar atau sama dengan UKT minimum";
      isValid = false;
    }

    if (!formData.shortDesc.trim()) {
      newErrors.shortDesc = "Ringkasan singkat jurusan wajib diisi";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi jurusan wajib diisi";
      isValid = false;
    }

    if (formData.whatYouLearn.some((item) => !item.trim())) {
      newErrors.whatYouLearn = "Semua materi yang dipelajari harus diisi";
      isValid = false;
    }

    if (formData.whyChoose.some((item) => !item.trim())) {
      newErrors.whyChoose = "Semua alasan memilih jurusan harus diisi";
      isValid = false;
    }

    if (
      formData.careerProspects.some(
        (item) => !item.title.trim() || !item.salary.trim(),
      )
    ) {
      newErrors.careerProspects = "Semua prospek karir harus memiliki nama dan gaji";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "", api: "" }));
  };

  const updateStringList = (
    field: "whatYouLearn" | "whyChoose",
    index: number,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: previous[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
    setErrors((previous) => ({ ...previous, [field]: "", api: "" }));
  };

  const addStringListItem = (field: "whatYouLearn" | "whyChoose") => {
    setFormData((previous) => ({
      ...previous,
      [field]: [...previous[field], ""],
    }));
  };

  const removeStringListItem = (
    field: "whatYouLearn" | "whyChoose",
    index: number,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]:
        previous[field].length > 1
          ? previous[field].filter((_, itemIndex) => itemIndex !== index)
          : previous[field],
    }));
  };

  const updateCareerProspect = (
    index: number,
    field: keyof CareerProspectInput,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      careerProspects: previous.careerProspects.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setErrors((previous) => ({ ...previous, careerProspects: "", api: "" }));
  };

  const addCareerProspect = () => {
    setFormData((previous) => ({
      ...previous,
      careerProspects: [...previous.careerProspects, createEmptyCareer()],
    }));
  };

  const removeCareerProspect = (index: number) => {
    setFormData((previous) => ({
      ...previous,
      careerProspects:
        previous.careerProspects.length > 1
          ? previous.careerProspects.filter((_, itemIndex) => itemIndex !== index)
          : previous.careerProspects,
    }));
  };

  const handleReset = () => {
    setFormData(getInitialFormData());
    setErrors(getInitialErrors());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors((previous) => ({ ...previous, api: "" }));

    try {
      const response = await fetch(apiUrl("/admin/major"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          field: formData.field,
          min_score: Number(formData.minScore),
          match: Number(formData.match),
          duration: formData.duration,
          accreditation: formData.accreditation,
          total_students: formData.totalStudents,
          ukt_min: Number(formData.uktMin),
          ukt_max: Number(formData.uktMax),
          short_desc: formData.shortDesc,
          description: formData.description,
          what_you_learn: formData.whatYouLearn.map((item) => item.trim()),
          career_prospects: formData.careerProspects.map((item) => ({
            title: item.title.trim(),
            salary: item.salary.trim(),
          })),
          why_choose: formData.whyChoose.map((item) => item.trim()),
          icon: formData.icon.trim(),
          color: formData.color.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan data jurusan");
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/admin-dashboard");
      }, 1500);
    } catch (error) {
      setErrors((previous) => ({
        ...previous,
        api: error instanceof Error ? error.message : "Gagal menyimpan data jurusan",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <p className="text-sm text-gray-600">Data jurusan berhasil disimpan ke database</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
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
              <span className="font-medium">Kembali</span>
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-3xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C8B6FF] to-[#FFC8DD] shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tambah Data Jurusan</h1>
              <p className="mt-1 text-gray-600">
                Satu kali input untuk rekomendasi, dashboard admin, dan halaman detail jurusan
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-white/20 bg-white/60 p-8 shadow-xl backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {errors.api && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.api}
              </div>
            )}

            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Informasi Dasar</h2>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nama Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleInputChange("name", event.target.value)}
                  placeholder="Contoh: Teknik Informatika"
                  className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                />
                <FieldError message={errors.name} />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Bidang Keilmuan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.field}
                    onChange={(event) => handleInputChange("field", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  >
                    <option value="">Pilih Bidang Keilmuan</option>
                    <option value="Saintek">Saintek</option>
                    <option value="Soshum">Soshum</option>
                  </select>
                  <FieldError message={errors.field} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Persentase Kesesuaian Default <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.match}
                    onChange={(event) => handleInputChange("match", event.target.value)}
                    placeholder="Contoh: 82"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <FieldError message={errors.match} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Nilai Minimal (0-100) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.minScore}
                    onChange={(event) => handleInputChange("minScore", event.target.value)}
                    placeholder="Contoh: 85"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <FieldError message={errors.minScore} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Durasi / Semester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(event) => handleInputChange("duration", event.target.value)}
                    placeholder="Contoh: 8 Semester (4 Tahun)"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <FieldError message={errors.duration} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Akreditasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.accreditation}
                    onChange={(event) => handleInputChange("accreditation", event.target.value)}
                    placeholder="Contoh: A"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <FieldError message={errors.accreditation} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Jumlah Mahasiswa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.totalStudents}
                    onChange={(event) => handleInputChange("totalStudents", event.target.value)}
                    placeholder="Contoh: 980"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <FieldError message={errors.totalStudents} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    UKT Minimum (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={formData.uktMin}
                    onChange={(event) => handleInputChange("uktMin", event.target.value)}
                    placeholder="Contoh: 3500000"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <FieldError message={errors.uktMin} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    UKT Maksimum (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={formData.uktMax}
                    onChange={(event) => handleInputChange("uktMax", event.target.value)}
                    placeholder="Contoh: 7800000"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <FieldError message={errors.uktMax} />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Konten Halaman Detail</h2>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Ringkasan Singkat <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.shortDesc}
                  onChange={(event) => handleInputChange("shortDesc", event.target.value)}
                  placeholder="Ringkasan singkat yang tampil di bawah nama jurusan"
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                />
                <FieldError message={errors.shortDesc} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Deskripsi Jurusan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(event) => handleInputChange("description", event.target.value)}
                  placeholder="Jelaskan gambaran umum jurusan, fokus pembelajaran, dan tujuan program studi"
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                />
                <FieldError message={errors.description} />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Ikon Jurusan
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(event) => handleInputChange("icon", event.target.value)}
                    placeholder="Opsional, contoh: 💻"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Gradient Warna
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(event) => handleInputChange("color", event.target.value)}
                    placeholder="Opsional, contoh: from-[#A0E7E5] to-[#BDE0FE]"
                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Apa yang Akan Dipelajari</h2>
                <button
                  type="button"
                  onClick={() => addStringListItem("whatYouLearn")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C8B6FF]/15 px-3 py-2 text-sm font-medium text-[#6A4FB3]"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Materi
                </button>
              </div>
              {formData.whatYouLearn.map((item, index) => (
                <div key={`learn-${index}`} className="flex gap-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(event) => updateStringList("whatYouLearn", index, event.target.value)}
                    placeholder={`Materi ${index + 1}`}
                    className="flex-1 rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <button
                    type="button"
                    onClick={() => removeStringListItem("whatYouLearn", index)}
                    disabled={formData.whatYouLearn.length === 1}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <FieldError message={errors.whatYouLearn} />
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Prospek Karir dan Gaji</h2>
                <button
                  type="button"
                  onClick={addCareerProspect}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#BDE0FE]/25 px-3 py-2 text-sm font-medium text-[#376992]"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Prospek
                </button>
              </div>
              {formData.careerProspects.map((career, index) => (
                <div
                  key={`career-${index}`}
                  className="grid grid-cols-1 gap-3 rounded-2xl border border-white/30 bg-white/35 p-4 md:grid-cols-[1fr_220px_52px]"
                >
                  <input
                    type="text"
                    value={career.title}
                    onChange={(event) => updateCareerProspect(index, "title", event.target.value)}
                    placeholder={`Prospek karir ${index + 1}`}
                    className="rounded-2xl border border-gray-200 bg-white/60 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <input
                    type="text"
                    value={career.salary}
                    onChange={(event) => updateCareerProspect(index, "salary", event.target.value)}
                    placeholder="Contoh: Rp 7-14 juta/bulan"
                    className="rounded-2xl border border-gray-200 bg-white/60 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <button
                    type="button"
                    onClick={() => removeCareerProspect(index)}
                    disabled={formData.careerProspects.length === 1}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <FieldError message={errors.careerProspects} />
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Alasan Memilih Jurusan</h2>
                <button
                  type="button"
                  onClick={() => addStringListItem("whyChoose")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#FFC8DD]/25 px-3 py-2 text-sm font-medium text-[#A24B73]"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Alasan
                </button>
              </div>
              {formData.whyChoose.map((item, index) => (
                <div key={`reason-${index}`} className="flex gap-3">
                  <input
                    type="text"
                    value={item}
                    onChange={(event) => updateStringList("whyChoose", index, event.target.value)}
                    placeholder={`Alasan ${index + 1}`}
                    className="flex-1 rounded-2xl border border-gray-200 bg-white/50 px-4 py-3 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]"
                  />
                  <button
                    type="button"
                    onClick={() => removeStringListItem("whyChoose", index)}
                    disabled={formData.whyChoose.length === 1}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <FieldError message={errors.whyChoose} />
            </section>

            <div className="flex gap-4 pt-4">
              <motion.button
                type="button"
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-200 px-6 py-4 font-semibold text-gray-700 shadow-lg transition-all hover:bg-gray-300"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </motion.button>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-5 w-5" />
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
