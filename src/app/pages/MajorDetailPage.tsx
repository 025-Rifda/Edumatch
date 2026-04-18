import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Clock, DollarSign, Users } from "lucide-react";
import { majors as majorCatalog } from "../../data/majors";

type MajorDetailNavigationState = {
  match?: number;
};

type RemoteMajor = {
  id: number;
  slug: string;
  name: string;
  field: "Saintek" | "Soshum";
  min_score: number;
  ukt: number;
  ukt_min: number;
  ukt_max: number;
};

const FIELD_THEME = {
  Saintek: {
    color: "from-[#A0E7E5] to-[#BDE0FE]",
    icon: "🧪",
  },
  Soshum: {
    color: "from-[#FFD6A5] to-[#FFC8DD]",
    icon: "📚",
  },
} as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

const humanizeSlug = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const getStoredMatch = (majorSlug: string) => {
  try {
    const storedContext = JSON.parse(localStorage.getItem("selected_major_context") || "null");
    if (storedContext?.id === majorSlug) {
      return Number(storedContext.match) || 0;
    }
  } catch {
    return 0;
  }

  return 0;
};

const buildFallbackMajorDetail = (majorSlug: string, remoteMajor: RemoteMajor | null) => {
  const field = remoteMajor?.field ?? "Soshum";
  const theme = FIELD_THEME[field] ?? FIELD_THEME.Soshum;
  const majorName = remoteMajor?.name ?? humanizeSlug(majorSlug);
  const uktMin = remoteMajor?.ukt_min ?? remoteMajor?.ukt ?? 0;
  const uktMax = remoteMajor?.ukt_max ?? remoteMajor?.ukt ?? 0;

  return {
    name: majorName,
    icon: theme.icon,
    match: 0,
    color: theme.color,
    shortDesc: `${majorName} adalah program studi ${field === "Saintek" ? "berbasis sains dan teknologi" : "berbasis sosial dan humaniora"} yang dapat kamu eksplorasi lebih lanjut sesuai hasil rekomendasimu.`,
    description: `${majorName} membekali mahasiswa dengan kompetensi inti yang relevan dengan bidang ${field === "Saintek" ? "sains, teknologi, dan pemecahan masalah terapan" : "sosial, komunikasi, dan analisis kebijakan/manusia"}. Perkuliahan biasanya memadukan teori dasar, praktik, proyek, dan penguatan keterampilan profesional agar lulusannya siap masuk dunia kerja maupun studi lanjut.`,
    whatYouLearn:
      field === "Saintek"
        ? ["Konsep Dasar Bidang", "Praktikum dan Analisis", "Pemecahan Masalah", "Metode Riset", "Aplikasi Teknologi", "Etika Profesi"]
        : ["Konsep Dasar Bidang", "Analisis Sosial", "Komunikasi Profesional", "Metode Riset", "Studi Kasus", "Etika Profesi"],
    careerProspects:
      field === "Saintek"
        ? [
            { title: "Analis Junior", salary: "Rp 5-9 juta/bulan" },
            { title: "Staf Operasional", salary: "Rp 5-8 juta/bulan" },
            { title: "Asisten Riset", salary: "Rp 5-9 juta/bulan" },
            { title: "Project Officer", salary: "Rp 5-10 juta/bulan" },
          ]
        : [
            { title: "Analis Junior", salary: "Rp 5-8 juta/bulan" },
            { title: "Staf Program", salary: "Rp 5-8 juta/bulan" },
            { title: "Asisten Peneliti", salary: "Rp 5-9 juta/bulan" },
            { title: "Project Officer", salary: "Rp 5-10 juta/bulan" },
          ],
    duration: "8 Semester (4 Tahun)",
    uktRange: `${formatCurrency(uktMin)} - ${formatCurrency(uktMax)}`,
    accreditation: "Baik",
    totalStudents: "Data belum tersedia",
    whyChoose: [
      `Cocok untuk siswa yang tertarik mendalami ${majorName}.`,
      "Memberikan bekal teori dan praktik yang seimbang.",
      "Peluang karir dapat berkembang lintas industri.",
      "Masih bisa dieksplorasi lebih lanjut lewat kurikulum kampus tujuan.",
    ],
  };
};

export default function MajorDetailPage() {
  const { majorId } = useParams();
  const location = useLocation();
  const [remoteMajor, setRemoteMajor] = useState<RemoteMajor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigationState =
    (location.state as MajorDetailNavigationState | null) ?? null;
  const majorSlug = String(majorId ?? "").trim().toLowerCase();

  useEffect(() => {
    const fetchMajorDetail = async () => {
      if (!majorSlug) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/majors/${majorSlug}`);
        const result = await response.json();

        if (!response.ok) {
          setRemoteMajor(null);
          return;
        }

        setRemoteMajor(result.major ?? null);
      } catch {
        setRemoteMajor(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMajorDetail();
  }, [majorSlug]);

  const displayMajor = useMemo(() => {
    if (!majorSlug) {
      return null;
    }

    const localMajor = majorCatalog[majorSlug];
    const fallbackMajor = buildFallbackMajorDetail(majorSlug, remoteMajor);
    const storedMatch = getStoredMatch(majorSlug);
    const displayedMatch = navigationState?.match ?? storedMatch ?? localMajor?.match ?? 0;

    return {
      ...fallbackMajor,
      ...localMajor,
      match: displayedMatch,
      name: localMajor?.name ?? fallbackMajor.name,
      shortDesc: localMajor?.shortDesc ?? fallbackMajor.shortDesc,
      description: localMajor?.description ?? fallbackMajor.description,
      whatYouLearn: localMajor?.whatYouLearn ?? fallbackMajor.whatYouLearn,
      careerProspects: localMajor?.careerProspects ?? fallbackMajor.careerProspects,
      duration: localMajor?.duration ?? fallbackMajor.duration,
      uktRange: localMajor?.uktRange ?? fallbackMajor.uktRange,
      accreditation: localMajor?.accreditation ?? fallbackMajor.accreditation,
      totalStudents: localMajor?.totalStudents ?? fallbackMajor.totalStudents,
      whyChoose: localMajor?.whyChoose ?? fallbackMajor.whyChoose,
      color: localMajor?.color ?? fallbackMajor.color,
      icon: localMajor?.icon ?? fallbackMajor.icon,
    };
  }, [majorSlug, navigationState?.match, remoteMajor]);

  if (isLoading) {
    return <div className="p-6 text-center">Memuat detail jurusan...</div>;
  }

  if (!displayMajor) {
    return <div className="p-6 text-center">Jurusan tidak ditemukan</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-[20px] md:rounded-[24px] bg-gradient-to-br ${displayMajor.color} flex items-center justify-center text-4xl md:text-5xl shadow-2xl flex-shrink-0`}
          >
            {displayMajor.icon}
          </motion.div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row items-start justify-between gap-3 md:gap-4 mb-4">
              <div className="w-full md:flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42] mb-2">
                  {displayMajor.name}
                </h1>
                <p className="text-sm md:text-lg text-[#2B2D42]/70">
                  {displayMajor.shortDesc}
                </p>
              </div>

              {displayMajor.match > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.3 }}
                  className="w-full md:w-auto text-center"
                >
                  <div
                    className={`px-5 md:px-6 py-2.5 md:py-3 rounded-[12px] md:rounded-[16px] bg-gradient-to-r ${displayMajor.color} text-white shadow-xl`}
                  >
                    <p className="text-xs md:text-sm font-medium">
                      Kesesuaian
                    </p>
                    <p className="text-2xl md:text-3xl font-bold">
                      {displayMajor.match}%
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
              <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">
                  Durasi
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">
                  {displayMajor.duration}
                </p>
              </div>

              <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">
                  Akreditasi
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">
                  {displayMajor.accreditation}
                </p>
              </div>

              <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                <Users className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">
                  Mahasiswa
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">
                  {displayMajor.totalStudents}
                </p>
              </div>

              <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">
                  UKT
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#2B2D42] truncate">
                  {displayMajor.uktRange?.split(" - ")?.[0] ?? displayMajor.uktRange}
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 md:gap-6">
              <div className="bg-white/50 rounded-[18px] md:rounded-[22px] p-4 md:p-6">
                <h2 className="text-lg md:text-2xl font-semibold text-[#2B2D42] mb-3">
                  Tentang Jurusan
                </h2>
                <p className="text-sm md:text-base text-[#2B2D42]/75 leading-7">
                  {displayMajor.description}
                </p>
              </div>

              <div className="bg-white/50 rounded-[18px] md:rounded-[22px] p-4 md:p-6">
                <h2 className="text-lg md:text-2xl font-semibold text-[#2B2D42] mb-3">
                  Kenapa Dipilih
                </h2>
                <div className="space-y-2">
                  {displayMajor.whyChoose.map((reason: string) => (
                    <div
                      key={reason}
                      className="rounded-[14px] bg-white/70 px-3 py-2 text-sm md:text-base text-[#2B2D42]/80"
                    >
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white/50 rounded-[18px] md:rounded-[22px] p-4 md:p-6">
                <h2 className="text-lg md:text-2xl font-semibold text-[#2B2D42] mb-3">
                  Yang Akan Dipelajari
                </h2>
                <div className="flex flex-wrap gap-2">
                  {displayMajor.whatYouLearn.map((item: string) => (
                    <span
                      key={item}
                      className="px-3 py-2 rounded-full bg-white/70 text-sm md:text-base text-[#2B2D42]/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/50 rounded-[18px] md:rounded-[22px] p-4 md:p-6">
                <h2 className="text-lg md:text-2xl font-semibold text-[#2B2D42] mb-3">
                  Prospek Karir
                </h2>
                <div className="space-y-2">
                  {displayMajor.careerProspects.map((career: { title: string; salary: string }) => (
                    <div
                      key={career.title}
                      className="flex items-center justify-between gap-3 rounded-[14px] bg-white/70 px-3 py-2"
                    >
                      <span className="text-sm md:text-base font-medium text-[#2B2D42]">
                        {career.title}
                      </span>
                      <span className="text-xs md:text-sm text-[#2B2D42]/65 text-right">
                        {career.salary}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
