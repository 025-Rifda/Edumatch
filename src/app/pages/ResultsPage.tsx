import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle,
  DollarSign,
  BookOpen,
  Award,
  Heart,
  Download,
  RefreshCw,
  Home,
  ChevronRight,
} from "lucide-react";
import { majors } from "../../data/majors";

type SelectedMajorContext = {
  id: string;
  match: number;
};

type Recommendation = {
  id: number;
  slug?: string;
  name?: string;
  match?: number;
  percentage?: number;
  ukt: number;
  reasons?: string[];
};

type RecommendationResponse = {
  top3: Recommendation[];
  top10: Recommendation[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
const slugify = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

const persistSelectedMajorContext = (value: SelectedMajorContext) => {
  localStorage.setItem("selected_major_context", JSON.stringify(value));
};

const getMajorIcon = (name: string) => {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("informatika") || normalizedName.includes("komputer")) return "💻";
  if (normalizedName.includes("sistem informasi") || normalizedName.includes("statistika")) return "📊";
  if (normalizedName.includes("elektro")) return "⚡";
  if (normalizedName.includes("matematika")) return "🔢";
  if (normalizedName.includes("fisika")) return "🔬";
  if (normalizedName.includes("kimia")) return "🧪";
  if (normalizedName.includes("arsitektur")) return "🏛️";

  return "🎓";
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<RecommendationResponse>({
    top3: [],
    top10: [],
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      const storedUser = localStorage.getItem("user");
      const storedAcademicScores = localStorage.getItem("academic_scores");
      const storedInterestAnswers = localStorage.getItem("interest_answers");
      const storedBudget = localStorage.getItem("budget");

      if (!storedUser || !storedAcademicScores || !storedInterestAnswers || !storedBudget) {
        alert("Data analisis belum lengkap");
        navigate("/analysis/step1");
        return;
      }

      try {
        setIsLoading(true);

        const user = JSON.parse(storedUser);
        const academicScores = JSON.parse(storedAcademicScores);
        const interestAnswers = JSON.parse(storedInterestAnswers);

        const res = await fetch("http://localhost:5000/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            academic_scores: academicScores,
            interest_answers: interestAnswers,
            budget: Number(storedBudget),
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Gagal mengambil rekomendasi");
        }

        setRecommendations(result);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Gagal mengambil rekomendasi");
        navigate("/analysis/step1");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRecommendations();
  }, [navigate]);

  const topRecommendations = recommendations.top3.map((rec, index) => {
    const slug = rec.slug ?? "";
    const majorData = majors[slug];
    const match = Math.round(rec.match ?? rec.percentage ?? 0);

    return {
      slug,
      name: majorData?.name ?? rec.name ?? "Data jurusan tidak ditemukan",
      match,
      description: majorData?.description ?? "Data jurusan tidak ditemukan",
      icon: majorData?.icon ?? "??",
      color:
        majorData?.color ??
        [
          "from-[#C8B6FF] to-[#FFC8DD]",
          "from-[#A0E7E5] to-[#BDE0FE]",
          "from-[#FFAFCC] to-[#FFC8DD]",
        ][index] ??
        "from-[#C8B6FF] to-[#FFC8DD]",
      tag: match >= 85 ? "Sangat Cocok" : "Cocok",
      tagColor: match >= 85 ? "bg-green-500" : "bg-yellow-500",
      reasons: rec.reasons ?? [],
      careerProspects: majorData?.careerProspects ?? [],
      ukt: formatCurrency(rec.ukt),
    };
  });

  const allRecommendations = recommendations.top10.map((rec, index) => ({
    rank: index + 1,
    slug: rec.slug ?? "",
    name: majors[rec.slug ?? ""]?.name ?? rec.name ?? "Data jurusan tidak ditemukan",
    match: Math.round(rec.match ?? rec.percentage ?? 0),
  }));

  const topPick = topRecommendations[0];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FF]">
        <p className="text-[#2B2D42]">Memuat hasil rekomendasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/20 via-[#FFC8DD]/10 to-[#BDE0FE]/20" />

      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-[#C8B6FF]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 min-h-screen px-3 md:px-8 py-6 md:py-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42] mb-2 md:mb-3 px-4">
              Hasil Rekomendasi Jurusanmu
            </h1>
            <p className="text-[#2B2D42]/70 text-sm md:text-lg px-4">
              Berdasarkan data yang kamu berikan, berikut rekomendasi terbaik untukmu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {topRecommendations.map((rec, index) => (
              <motion.div
                key={`${rec.slug}-${index}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative cursor-pointer"
               onClick={() => {
  persistSelectedMajorContext({ id: rec.slug, match: rec.match });
  navigate(`/major/${rec.slug}`, {
    state: { match: rec.match },
  });
}}
                whileHover={{ y: -5 }}
              >
                {index === 0 && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full text-white font-semibold text-xs md:text-sm shadow-lg flex items-center gap-1.5 md:gap-2">
                      <Award className="w-3 h-3 md:w-4 md:h-4" />
                      Top Pick
                    </div>
                  </div>
                )}
                <div className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-8 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative w-28 h-28 md:w-32 md:h-32 mx-auto mb-4 md:mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        stroke={`url(#gradient-${index})`}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 52}`}
                        strokeDashoffset={`${2 * Math.PI * 52 * (1 - rec.match / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C8B6FF" />
                          <stop offset="100%" stopColor="#FFC8DD" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl md:text-4xl mb-1">{rec.icon}</span>
                      <span className="text-xl md:text-2xl font-bold text-[#2B2D42]">{rec.match}%</span>
                    </div>
                  </div>

                  <h3 className="text-base md:text-xl font-bold text-[#2B2D42] text-center mb-2 md:mb-3 px-2">
                    {rec.name}
                  </h3>

                  <p className="text-xs md:text-sm text-[#2B2D42]/70 text-center mb-4">
                    {rec.description}
                  </p>

                  <div className="flex justify-center mb-4 md:mb-6">
                    <span className={`px-3 md:px-4 py-1 md:py-1.5 ${rec.tagColor} text-white text-xs md:text-sm font-semibold rounded-full`}>
                      {rec.tag}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm text-[#2B2D42]/70 mb-3 md:mb-4 pb-3 md:pb-4 border-b border-[#2B2D42]/10">
                    <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                    <span>UKT: {rec.ukt}</span>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <p className="text-[11px] md:text-xs font-semibold text-[#2B2D42]/70 text-center mb-2">
                      Prospek Karir
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {rec.careerProspects.slice(0, 2).map((career) => (
                        <span key={career.title} className="px-2.5 py-1 bg-white/60 rounded-full text-[10px] md:text-xs text-[#2B2D42]/75">
                          {career.title}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-xs md:text-sm text-[#C8B6FF] font-medium hover:underline flex items-center justify-center gap-1">
                      Lihat Detail
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-8 border border-white/60 shadow-xl mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#A0E7E5] to-[#BDE0FE] flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h3 className="text-base md:text-2xl font-semibold text-[#2B2D42]">
                {topPick ? `Kenapa ${topPick.name} cocok untukmu?` : "Hasil rekomendasi"}
              </h3>
            </div>
            <div className="space-y-2 md:space-y-3">
              {(
                (topPick?.reasons?.length ?? 0) > 0
                  ? topPick?.reasons
                  : topPick
                    ? [topPick.description]
                    : []
              ).map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-white/50 rounded-xl md:rounded-[16px]"
                >
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs md:text-base text-[#2B2D42]/80">{reason}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 md:mt-6 p-4 md:p-5 bg-gradient-to-r from-[#C8B6FF]/10 to-[#FFC8DD]/10 rounded-xl md:rounded-[20px] border border-[#C8B6FF]/20"
            >
              <p className="text-xs md:text-base text-[#2B2D42] font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#C8B6FF] flex-shrink-0" />
                <span>
                  {topPick ? `Kamu punya potensi besar di ${topPick.name}.` : "Belum ada hasil rekomendasi untuk ditampilkan."}
                </span>
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-8 border border-white/60 shadow-xl mb-6 md:mb-8"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#FFAFCC] to-[#FFC8DD] flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h3 className="text-base md:text-2xl font-semibold text-[#2B2D42]">Top 10 Rekomendasi</h3>
              </div>
              <button onClick={() => setShowAll(!showAll)} className="text-xs md:text-sm text-[#C8B6FF] font-medium hover:underline flex items-center gap-1">
                {showAll ? "Sembunyikan" : "Lihat Semua"}
                <ChevronRight className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
              </button>
            </div>
            <div className="space-y-2 md:space-y-3">
              {allRecommendations.slice(0, showAll ? 10 : 5).map((rec, index) => (
                <motion.div
                key={rec.rank}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                  onClick={() => {
                    persistSelectedMajorContext({ id: rec.slug, match: rec.match });
                    navigate(`/major/${rec.slug}`, {
                      state: { match: rec.match },
                    });
                  }}
                  className="flex items-center justify-between p-3 md:p-4 bg-white/50 rounded-xl md:rounded-[16px] hover:bg-white/70 transition-all duration-200 group cursor-pointer gap-2"
                >
                  <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 ${
                        rec.rank <= 3
                          ? "bg-gradient-to-br from-[#C8B6FF] to-[#FFC8DD] text-white"
                          : "bg-[#2B2D42]/10 text-[#2B2D42]/70"
                      }`}
                    >
                      {rec.rank}
                    </div>
                    <span className="font-medium text-xs md:text-base text-[#2B2D42] truncate">{rec.name}</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                    <div className="hidden sm:block w-24 md:w-48 h-1.5 md:h-2 bg-[#2B2D42]/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${rec.match}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.05 }}
                      />
                    </div>
                    <span className="font-semibold text-sm md:text-base text-[#C8B6FF] min-w-[45px] md:min-w-[50px] text-right">
                      {rec.match}%
                    </span>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#2B2D42]/30 group-hover:text-[#C8B6FF] group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/dashboard")}
              className="h-11 px-5 bg-gradient-to-r from-[#C8B6FF]/90 to-[#FFC8DD]/90 rounded-[12px] text-white text-[13px] font-semibold shadow-sm hover:shadow-md hover:from-[#C8B6FF] hover:to-[#FFC8DD] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Kembali ke Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              className="h-11 px-5 bg-white/70 border border-[#A0E7E5]/40 rounded-[12px] text-[#2B2D42] text-[13px] font-semibold hover:bg-white/90 hover:border-[#A0E7E5]/60 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Simpan Hasil
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/analysis/step1")}
              className="h-11 px-5 bg-white/70 border border-[#FFAFCC]/40 rounded-[12px] text-[#2B2D42] text-[13px] font-semibold hover:bg-white/90 hover:border-[#FFAFCC]/60 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
