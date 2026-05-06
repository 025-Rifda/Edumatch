import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Clock, DollarSign, Users } from "lucide-react";
import { majors as majorCatalog } from "../../data/majors";
import { apiUrl } from "../../lib/api";

type MajorDetailNavigationState = {
  match?: number;
};

type RemoteMajor = {
  id: number;
  slug: string;
  name: string;
  field: "Saintek" | "Soshum";
  min_score: number;
  match: number;
  ukt: number;
  ukt_min: number;
  ukt_max: number;
  duration?: string;
  accreditation?: string;
  total_students?: string;
  short_desc?: string;
  description?: string;
  what_you_learn?: string[];
  career_prospects?: { title: string; salary: string }[];
  why_choose?: string[];
  icon?: string;
  color?: string;
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
  const navigate = useNavigate();
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
        const response = await fetch(apiUrl(`/api/majors/${majorSlug}`));
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
    const remoteMajorDetail = remoteMajor
      ? {
          name: remoteMajor.name,
          icon: remoteMajor.icon?.trim() || fallbackMajor.icon,
          match: Number(remoteMajor.match ?? 0),
          color: remoteMajor.color?.trim() || fallbackMajor.color,
          shortDesc: remoteMajor.short_desc?.trim() || fallbackMajor.shortDesc,
          description: remoteMajor.description?.trim() || fallbackMajor.description,
          whatYouLearn:
            remoteMajor.what_you_learn && remoteMajor.what_you_learn.length > 0
              ? remoteMajor.what_you_learn
              : fallbackMajor.whatYouLearn,
          careerProspects:
            remoteMajor.career_prospects && remoteMajor.career_prospects.length > 0
              ? remoteMajor.career_prospects
              : fallbackMajor.careerProspects,
          duration: remoteMajor.duration?.trim() || fallbackMajor.duration,
          uktRange: `${formatCurrency(remoteMajor.ukt_min ?? remoteMajor.ukt ?? 0)} - ${formatCurrency(remoteMajor.ukt_max ?? remoteMajor.ukt ?? 0)}`,
          accreditation: remoteMajor.accreditation?.trim() || fallbackMajor.accreditation,
          totalStudents: remoteMajor.total_students?.trim() || fallbackMajor.totalStudents,
          whyChoose:
            remoteMajor.why_choose && remoteMajor.why_choose.length > 0
              ? remoteMajor.why_choose
              : fallbackMajor.whyChoose,
          field: remoteMajor.field,
          minScore: remoteMajor.min_score,
          uktMin: remoteMajor.ukt_min,
          uktMax: remoteMajor.ukt_max,
        }
      : null;
    const displayedMatch =
      navigationState?.match ??
      storedMatch ??
      remoteMajorDetail?.match ??
      localMajor?.match ??
      0;

    return {
      ...fallbackMajor,
      ...remoteMajorDetail,
      ...localMajor,
      match: displayedMatch,
      name: remoteMajorDetail?.name ?? localMajor?.name ?? fallbackMajor.name,
      shortDesc: remoteMajorDetail?.shortDesc ?? localMajor?.shortDesc ?? fallbackMajor.shortDesc,
      description: remoteMajorDetail?.description ?? localMajor?.description ?? fallbackMajor.description,
      whatYouLearn: remoteMajorDetail?.whatYouLearn ?? localMajor?.whatYouLearn ?? fallbackMajor.whatYouLearn,
      careerProspects:
        remoteMajorDetail?.careerProspects ??
        localMajor?.careerProspects ??
        fallbackMajor.careerProspects,
      duration: remoteMajorDetail?.duration ?? localMajor?.duration ?? fallbackMajor.duration,
      uktRange: remoteMajorDetail?.uktRange ?? localMajor?.uktRange ?? fallbackMajor.uktRange,
      accreditation:
        remoteMajorDetail?.accreditation ??
        localMajor?.accreditation ??
        fallbackMajor.accreditation,
      totalStudents:
        remoteMajorDetail?.totalStudents ??
        localMajor?.totalStudents ??
        fallbackMajor.totalStudents,
      whyChoose: remoteMajorDetail?.whyChoose ?? localMajor?.whyChoose ?? fallbackMajor.whyChoose,
      color: remoteMajorDetail?.color ?? localMajor?.color ?? fallbackMajor.color,
      icon: remoteMajorDetail?.icon ?? localMajor?.icon ?? fallbackMajor.icon,
    };
  }, [majorSlug, navigationState?.match, remoteMajor]);

  if (isLoading) {
    return <div className="p-6 text-center">Memuat detail jurusan...</div>;
  }

  if (!displayMajor) {
    return <div className="p-6 text-center">Jurusan tidak ditemukan</div>;
  }

  return (
    <div className="min-h-screen bg-[#F6F1F8] px-3 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-[920px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 md:space-y-5"
        >
          <motion.button
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
                return;
              }

              navigate("/dashboard");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-medium text-[#4A435D] shadow-[0_10px_24px_rgba(120,105,160,0.12)] backdrop-blur-sm transition hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </motion.button>

          <section className="overflow-hidden rounded-[22px] border border-white/70 bg-white/90 shadow-[0_14px_40px_rgba(120,105,160,0.14)] backdrop-blur-sm md:rounded-[26px]">
            <div className="px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br ${displayMajor.color} text-3xl shadow-[0_16px_28px_rgba(200,182,255,0.28)] md:h-[72px] md:w-[72px] md:rounded-[20px] md:text-4xl`}
                >
                  {displayMajor.icon}
                </motion.div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-[#3C3550] md:text-[36px]">
                        {displayMajor.name}
                      </h1>
                      <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#7C7690] md:text-[14px] md:leading-6">
                        {displayMajor.shortDesc}
                      </p>
                    </div>

                    {displayMajor.match > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                        className="self-start"
                      >
                        <div className="rounded-[16px] bg-gradient-to-br from-[#D6B6FF] via-[#E6C2FF] to-[#FFC8DD] px-4 py-2 text-center text-white shadow-[0_16px_28px_rgba(214,182,255,0.35)] md:min-w-[94px]">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/85">
                            Kesesuaian
                          </p>
                          <p className="mt-1 text-[28px] font-extrabold leading-none md:text-[30px]">
                            {displayMajor.match}%
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-[#EEE6F4] pt-4 md:mt-6 md:grid-cols-4 md:gap-x-5 md:pt-5">
                <div className="text-center">
                  <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]">
                    <Clock className="h-3.5 w-3.5 text-[#BA9CF7]" />
                  </div>
                  <p className="text-[10px] font-medium text-[#B1A6C5] md:text-[11px]">
                    Durasi
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#403850] md:text-[12px]">
                    {displayMajor.duration}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]">
                    <Award className="h-3.5 w-3.5 text-[#BA9CF7]" />
                  </div>
                  <p className="text-[10px] font-medium text-[#B1A6C5] md:text-[11px]">
                    Akreditasi
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#403850] md:text-[12px]">
                    {displayMajor.accreditation}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]">
                    <Users className="h-3.5 w-3.5 text-[#BA9CF7]" />
                  </div>
                  <p className="text-[10px] font-medium text-[#B1A6C5] md:text-[11px]">
                    Mahasiswa
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#403850] md:text-[12px]">
                    {displayMajor.totalStudents}
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#F4ECFF]">
                    <DollarSign className="h-3.5 w-3.5 text-[#BA9CF7]" />
                  </div>
                  <p className="text-[10px] font-medium text-[#B1A6C5] md:text-[11px]">
                    UKT
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#403850] md:text-[12px]">
                    {displayMajor.uktRange?.split(" - ")?.[0] ?? displayMajor.uktRange}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-white/70 bg-white/90 px-4 py-5 shadow-[0_14px_40px_rgba(120,105,160,0.12)] md:rounded-[24px] md:px-5 md:py-6">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F7C9DE] to-[#E6CFFF] text-[13px] shadow-sm">
                <span>📖</span>
              </div>
              <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#3E3650] md:text-[24px]">
                Tentang Jurusan
              </h2>
            </div>
            <p className="text-[13px] leading-7 text-[#6F6884] md:text-[14px]">
              {displayMajor.description}
            </p>
          </section>

          <section className="rounded-[20px] border border-white/70 bg-white/90 px-4 py-5 shadow-[0_14px_40px_rgba(120,105,160,0.12)] md:rounded-[24px] md:px-5 md:py-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#BCEFFF] to-[#D9F6FF] text-[13px] shadow-sm">
                <span>🧠</span>
              </div>
              <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#3E3650] md:text-[24px]">
                Apa yang Akan Dipelajari?
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
              {displayMajor.whatYouLearn.map((item: string) => (
                <div key={item} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#ECFFF1] text-[11px] text-[#22B45A]">
                    ✓
                  </div>
                  <span className="text-[13px] leading-6 text-[#6F6884] md:text-[14px]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-white/70 bg-white/90 px-4 py-5 shadow-[0_14px_40px_rgba(120,105,160,0.12)] md:rounded-[24px] md:px-5 md:py-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFC8DD] to-[#FFDCE9] text-[13px] shadow-sm">
                <span>💼</span>
              </div>
              <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#3E3650] md:text-[24px]">
                Prospek Karir
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-6 md:gap-y-4">
              {displayMajor.careerProspects.map((career: { title: string; salary: string }, index: number) => (
                <div
                  key={career.title}
                  className="flex items-start justify-between gap-4 rounded-[18px] border border-[#F2EAF7] bg-[#FFFDFF] px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#3F3750] md:text-[14px]">
                      {career.title}
                    </p>
                    <p className="mt-1 text-[11px] text-[#7E7792] md:text-[12px]">
                      ↗ {career.salary}
                    </p>
                  </div>
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#DABEFF] to-[#F4C5DD] text-[11px] font-bold text-white">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[20px] border border-white/70 bg-white/90 px-4 py-5 shadow-[0_14px_40px_rgba(120,105,160,0.12)] md:rounded-[24px] md:px-5 md:py-6">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD26F] to-[#FFB93A] text-[13px] shadow-sm">
                <span>✨</span>
              </div>
              <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#3E3650] md:text-[24px]">
                Kenapa Pilih Jurusan Ini?
              </h2>
            </div>
            <div className="space-y-2.5">
              {displayMajor.whyChoose.map((reason: string) => (
                <div
                  key={reason}
                  className="flex items-start gap-3 rounded-[14px] border border-[#E9D9F8] bg-[#FCF8FF] px-3.5 py-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#E2C8FF] to-[#F6D2E5] text-[10px] text-white">
                    •
                  </div>
                  <p className="text-[13px] leading-6 text-[#6F6884] md:text-[14px]">
                    {reason}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
