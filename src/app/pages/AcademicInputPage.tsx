import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calculator, Globe, Microscope, DollarSign, Users, ArrowRight, ArrowLeft } from "lucide-react";

type Jurusan = "IPA" | "IPS";

type SubjectConfig = {
  key: string;
  label: string;
  icon: typeof BookOpen;
  color: string;
};

const COMMON_SUBJECTS: SubjectConfig[] = [
  { key: "matematika", label: "Matematika", icon: Calculator, color: "from-[#C8B6FF] to-[#FFC8DD]" },
  { key: "indonesia", label: "Bahasa Indonesia", icon: BookOpen, color: "from-[#FFC8DD] to-[#FFAFCC]" },
  { key: "inggris", label: "Bahasa Inggris", icon: Globe, color: "from-[#A0E7E5] to-[#BDE0FE]" },
];

const MAJOR_SUBJECTS: Record<Jurusan, SubjectConfig[]> = {
  IPA: [
    { key: "fisika", label: "Fisika", icon: Microscope, color: "from-[#BDE0FE] to-[#C8B6FF]" },
    { key: "kimia", label: "Kimia", icon: DollarSign, color: "from-[#FFAFCC] to-[#FFC8DD]" },
    { key: "biologi", label: "Biologi", icon: Users, color: "from-[#A0E7E5] to-[#C8B6FF]" },
  ],
  IPS: [
    { key: "geografi", label: "Geografi", icon: Globe, color: "from-[#BDE0FE] to-[#C8B6FF]" },
    { key: "sosiologi", label: "Sosiologi", icon: Users, color: "from-[#FFAFCC] to-[#FFC8DD]" },
    { key: "ekonomi", label: "Ekonomi", icon: DollarSign, color: "from-[#A0E7E5] to-[#C8B6FF]" },
  ],
};

const normalizeJurusan = (value: unknown): Jurusan | null => {
  const normalizedValue = String(value ?? "").trim().toUpperCase();
  if (normalizedValue === "IPA" || normalizedValue === "IPS") {
    return normalizedValue;
  }

  return null;
};

const getStoredUserJurusan = (): Jurusan | null => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      return null;
    }

    const parsedUser = JSON.parse(rawUser);
    return normalizeJurusan(parsedUser?.jurusan);
  } catch {
    return null;
  }
};

const buildInitialScores = (jurusan: Jurusan | null) => {
  const validJurusan = jurusan ?? "IPA";
  const activeSubjects = [...COMMON_SUBJECTS, ...MAJOR_SUBJECTS[validJurusan]];

  let storedScores: Record<string, unknown> = {};
  try {
    storedScores = JSON.parse(localStorage.getItem("academic_scores") || "{}");
  } catch {
    storedScores = {};
  }

  return activeSubjects.reduce<Record<string, string>>((accumulator, subject) => {
    const rawValue = storedScores[subject.key];
    accumulator[subject.key] = typeof rawValue === "number" || typeof rawValue === "string"
      ? String(rawValue)
      : "";
    return accumulator;
  }, {});
};

export default function AcademicInputPage() {
  const navigate = useNavigate();
  const [userJurusan] = useState<Jurusan | null>(() => getStoredUserJurusan());
  const [scores, setScores] = useState<Record<string, string>>(() => buildInitialScores(getStoredUserJurusan()));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!userJurusan) {
      navigate("/login");
    }
  }, [navigate, userJurusan]);

  const selectedJurusan = userJurusan ?? "IPA";
  const subjectGroups = [
    {
      title: "Mata Pelajaran Umum",
      subjects: COMMON_SUBJECTS,
    },
    {
      title: `Mata Pelajaran Jurusan ${selectedJurusan}`,
      subjects: MAJOR_SUBJECTS[selectedJurusan],
    },
  ];

  const handleChange = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (value === "" || (numValue >= 0 && numValue <= 100)) {
      console.log("[AcademicInputPage] score changed", {
        field,
        value,
      });
      setScores((previousScores) => ({ ...previousScores, [field]: value }));
      setErrors((previousErrors) => ({ ...previousErrors, [field]: false }));
    }
  };

  const handleNext = () => {
    console.log("[AcademicInputPage] handleNext triggered", {
      userJurusan,
      scores,
    });

    const newErrors: Record<string, boolean> = {};
    Object.keys(scores).forEach((key) => {
      if (scores[key as keyof typeof scores] === "") {
        newErrors[key] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      console.warn("[AcademicInputPage] validation failed", newErrors);
      setErrors(newErrors);
    } else {
      const normalizedScores = Object.entries(scores).reduce<Record<string, number>>(
        (accumulator, [key, value]) => {
          accumulator[key] = Number(value);
          return accumulator;
        },
        {},
      );

      console.log("[AcademicInputPage] storing academic_scores", normalizedScores);
      localStorage.setItem("academic_scores", JSON.stringify(normalizedScores));
      navigate("/analysis/step2");
    }
  };

  if (!userJurusan) {
    return null;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/20 via-[#FFC8DD]/10 to-[#BDE0FE]/20" />

      {/* Floating Blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-[#C8B6FF]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border-b border-white/60 px-8 py-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#2B2D42]">Langkah 1 dari 3</span>
              <span className="text-sm text-[#2B2D42]/60">33% selesai</span>
            </div>
            <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "33.33%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 px-8 py-12 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-[#2B2D42] mb-3">
                Masukkan Nilai Akademikmu
              </h1>
              <p className="text-[#2B2D42]/70 text-lg">
                Isi nilai sesuai kemampuanmu dengan jujur
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#A0E7E5]/20 rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#A0E7E5]" />
                <p className="text-sm text-[#2B2D42]/70">
                  Jurusan terdeteksi: {selectedJurusan}. Nilai ini akan mempengaruhi hasil rekomendasi.
                </p>
              </div>
            </motion.div>

            {/* Subject Groups */}
            <div className="space-y-8">
              {subjectGroups.map((group, groupIndex) => (
                <motion.div
                  key={group.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + groupIndex * 0.1 }}
                  className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 border border-white/60 shadow-xl"
                >
                  <h3 className="text-xl font-semibold text-[#2B2D42] mb-6">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {group.subjects.map((subject, index) => {
                      const Icon = subject.icon;
                      return (
                        <motion.div
                          key={subject.key}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.4 + groupIndex * 0.1 + index * 0.05 }}
                          className="space-y-3"
                        >
                          <label className="block text-sm font-medium text-[#2B2D42] flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-[10px] bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md`}>
                              <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                            </div>
                            {subject.label}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={scores[subject.key as keyof typeof scores]}
                              onChange={(e) => handleChange(subject.key, e.target.value)}
                              placeholder="0 - 100"
                              className={`w-full px-4 py-3.5 bg-white/50 border rounded-[14px] text-[#2B2D42] placeholder:text-[#2B2D42]/40 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                errors[subject.key]
                                  ? "border-red-400 focus:ring-red-400/50"
                                  : "border-white/60 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF]"
                              }`}
                            />
                            {errors[subject.key] && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-6 left-0 text-xs text-red-500"
                              >
                                Nilai wajib diisi
                              </motion.p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-0 bg-white/40 backdrop-blur-2xl border-t border-white/60 px-8 py-6"
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3.5 bg-white/70 border border-white/80 rounded-[14px] text-[#2B2D42] font-medium hover:bg-white/90 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="px-8 py-3.5 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-[14px] text-white font-semibold shadow-lg shadow-[#C8B6FF]/30 hover:shadow-xl hover:shadow-[#C8B6FF]/40 transition-all duration-300 flex items-center gap-2 group"
            >
              Lanjut ke Tes Minat
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
