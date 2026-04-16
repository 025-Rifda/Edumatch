import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { History, Calendar, TrendingUp, ChevronRight, ArrowLeft, Filter, Search } from "lucide-react";
import { majors } from "../../data/majors";

type SelectedMajorContext = {
  id: string;
  match: number;
};

type HistoryMajor = {
  id: number;
  slug?: string;
  name: string;
  match?: number;
  percentage?: number;
};

type HistoryResponseItem = {
  id: number;
  created_at: string;
  top_major: HistoryMajor | null;
  top10: HistoryMajor[];
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));

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

  return "🎓";
};

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState<HistoryResponseItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("Silakan login terlebih dahulu");
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);

        const user = JSON.parse(storedUser);
        const res = await fetch(`http://localhost:5000/history?user_id=${user.id}`);
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Gagal mengambil riwayat");
        }

        setHistoryData(result.history ?? []);
      } catch (error) {
        alert(error instanceof Error ? error.message : "Gagal mengambil riwayat");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchHistory();
  }, [navigate]);

  const filteredHistory = useMemo(() => {
    const mappedHistory = historyData.map((item) => ({
      id: item.id,
      date: formatDate(item.created_at),
      rawDate: item.created_at,
      topMajor: item.top_major?.name ?? "-",
      match: Math.round(item.top_major?.match ?? item.top_major?.percentage ?? 0),
      majors: (item.top10 ?? []).slice(0, 5).map((major) => {
        const slug = major.slug ?? slugify(major.name);
        const majorData = majors[slug];

        return {
          id: slug,
          name: majorData?.name ?? major.name,
          match: Math.round(major.match ?? major.percentage ?? 0),
          icon: majorData?.icon ?? "??",
        };
      }),
    }));

    const searchedHistory = mappedHistory.filter((item) =>
      item.topMajor.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return searchedHistory.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime();
      }

      if (sortBy === "highest") {
        return b.match - a.match;
      }

      return new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime();
    });
  }, [historyData, searchQuery, sortBy]);

  const emptyState = !isLoading && filteredHistory.length === 0;

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/20 via-[#FFC8DD]/10 to-[#BDE0FE]/20" />

      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-[#C8B6FF]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/40 backdrop-blur-2xl border-b border-white/60 px-3 md:px-8 py-3 md:py-6"
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/dashboard")}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/70 border border-white/80 flex items-center justify-center hover:bg-white transition-all flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-[#2B2D42]" />
                </motion.button>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-[#2B2D42] flex items-center gap-2 md:gap-3">
                    <History className="w-6 h-6 md:w-8 md:h-8 text-[#C8B6FF]" />
                    Riwayat Analisis
                  </h1>
                  <p className="text-[10px] md:text-sm text-[#2B2D42]/60 mt-0.5">
                    Lihat semua analisis yang pernah kamu lakukan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="flex-1 px-3 md:px-8 py-4 md:py-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {!isLoading && !emptyState && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0 mb-4 md:mb-6"
              >
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[#2B2D42]/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari jurusan..."
                    className="pl-9 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-xs md:text-base bg-white/50 border border-white/60 rounded-xl md:rounded-[14px] text-[#2B2D42] placeholder:text-[#2B2D42]/40 focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF] transition-all w-full md:w-80"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 md:w-5 md:h-5 text-[#2B2D42]/50" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 md:flex-none px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-base bg-white/50 border border-white/60 rounded-xl md:rounded-[14px] text-[#2B2D42] focus:outline-none focus:ring-2 focus:ring-[#C8B6FF]/50 focus:border-[#C8B6FF] transition-all cursor-pointer"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="oldest">Terlama</option>
                    <option value="highest">Match Tertinggi</option>
                  </select>
                </div>
              </motion.div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-[#2B2D42]">Memuat riwayat...</p>
              </div>
            ) : emptyState ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center justify-center py-12 md:py-20 px-4"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#C8B6FF]/20 to-[#FFC8DD]/20 flex items-center justify-center mb-4 md:mb-6">
                  <History className="w-12 h-12 md:w-16 md:h-16 text-[#C8B6FF]/50" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-2xl font-semibold text-[#2B2D42] mb-2 md:mb-3">Belum ada riwayat analisis</h3>
                <p className="text-xs md:text-base text-[#2B2D42]/60 mb-6 md:mb-8 text-center max-w-md">
                  Mulai analisis pertamamu untuk menemukan jurusan yang tepat
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/analysis/step1")}
                  className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-xl md:rounded-[16px] text-white font-semibold shadow-lg shadow-[#C8B6FF]/30 hover:shadow-xl hover:shadow-[#C8B6FF]/40 transition-all duration-300"
                >
                  Mulai Analisis Sekarang
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white/40 backdrop-blur-2xl rounded-xl md:rounded-[24px] border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-3 md:p-6 cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                      <div className="flex items-center justify-between gap-2 md:gap-0">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6 flex-1 min-w-0">
                          <div className="flex items-center gap-2 md:gap-3 w-full md:min-w-[180px]">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-[14px] bg-gradient-to-br from-[#C8B6FF]/20 to-[#FFC8DD]/20 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#C8B6FF]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] md:text-sm text-[#2B2D42]/60">Tanggal</p>
                              <p className="font-medium text-xs md:text-base text-[#2B2D42] truncate">{item.date}</p>
                            </div>
                          </div>

                          <div className="flex-1 w-full md:w-auto min-w-0">
                            <p className="text-[10px] md:text-sm text-[#2B2D42]/60 mb-0.5 md:mb-1">Rekomendasi Teratas</p>
                            <p className="text-sm md:text-lg font-semibold text-[#2B2D42] truncate">{item.topMajor}</p>
                          </div>

                          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
                            <div className="flex-1 md:text-right">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 md:w-20 h-1.5 md:h-2 bg-[#2B2D42]/10 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.match}%` }}
                                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                                  />
                                </div>
                                <span className="text-xl md:text-2xl font-bold text-[#C8B6FF] min-w-[50px] md:min-w-[60px]">
                                  {item.match}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <motion.div animate={{ rotate: expandedId === item.id ? 90 : 0 }} transition={{ duration: 0.3 }} className="ml-2 md:ml-4 flex-shrink-0">
                          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#C8B6FF]" />
                        </motion.div>
                      </div>
                    </div>

                    {expandedId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-3 md:px-6 pb-3 md:pb-6 border-t border-white/40 pt-3 md:pt-4"
                      >
                        <h4 className="text-sm md:text-lg font-semibold text-[#2B2D42] mb-3 md:mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-[#C8B6FF]" />
                          Top 5 Rekomendasi Jurusan
                        </h4>
                        <div className="space-y-2">
                          {item.majors.map((major, majorIndex) => (
                            <motion.div
                              key={major.id}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: majorIndex * 0.05 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                persistSelectedMajorContext({ id: major.id, match: major.match });
                                navigate(`/major/${major.id}`, {
                                  state: { match: major.match },
                                });
                              }}
                              className="flex items-center justify-between p-2.5 md:p-3 bg-white/50 rounded-xl md:rounded-[14px] hover:bg-white/70 transition-all cursor-pointer group"
                            >
                              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#C8B6FF]/20 to-[#FFC8DD]/20 flex items-center justify-center text-base md:text-xl flex-shrink-0">
                                  {major.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-xs md:text-base text-[#2B2D42] truncate">{major.name}</p>
                                  <p className="text-[10px] md:text-sm text-[#2B2D42]/60">Klik untuk lihat detail</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                                <div className="text-right">
                                  <p className="text-base md:text-lg font-bold text-[#C8B6FF]">{major.match}%</p>
                                </div>
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#2B2D42]/30 group-hover:text-[#C8B6FF] group-hover:translate-x-1 transition-all" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
