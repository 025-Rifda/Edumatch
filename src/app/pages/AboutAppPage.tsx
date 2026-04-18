import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  BarChart3,
  Brain,
  Filter,
  CheckCircle,
  ChevronRight,
  FileText,
  Target,
  DollarSign,
  TrendingUp,
  Zap,
  Shield,
} from "lucide-react";

export default function AboutAppPage() {
  const navigate = useNavigate();

  const howItWorksSteps = [
    {
      icon: FileText,
      title: "Input Nilai Akademik",
      description:
        "Masukkan data nilai rapor dan prestasi akademikmu",
      color: "#C8B6FF",
    },
    {
      icon: Target,
      title: "Tes Minat & Bakat",
      description:
        "Jawab pertanyaan untuk mengetahui minat dan kepribadianmu",
      color: "#FFC8DD",
    },
    {
      icon: Brain,
      title: "Analisis AI",
      description:
        "Sistem menganalisis data dengan algoritma cerdas",
      color: "#BDE0FE",
    },
    {
      icon: TrendingUp,
      title: "Hasil Rekomendasi",
      description:
        "Dapatkan rekomendasi jurusan terbaik untukmu",
      color: "#A0E7E5",
    },
  ];

  const methods = [
    {
      icon: BarChart3,
      title: "Decision Tree",
      description:
        "Klasifikasi berbasis pohon keputusan untuk analisis yang akurat",
      gradient: "from-[#C8B6FF] to-[#9D8FE1]",
    },
    {
      icon: Brain,
      title: "Fuzzy Logic",
      description:
        "Penyesuaian nilai dengan logika kabur untuk hasil lebih natural",
      gradient: "from-[#FFC8DD] to-[#FFB3CC]",
    },
    {
      icon: Filter,
      title: "Filtering UKT",
      description:
        "Menyesuaikan rekomendasi dengan kemampuan finansialmu",
      gradient: "from-[#BDE0FE] to-[#A0D2F1]",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      text: "Rekomendasi berbasis data akademik dan minat personal",
    },
    {
      icon: TrendingUp,
      text: "Analisis cepat dan akurat dengan teknologi AI terkini",
    },
    {
      icon: DollarSign,
      text: "Menyesuaikan kemampuan finansial dan budget kuliah",
    },
    {
      icon: Shield,
      text: "Data aman dan privasi terjaga dengan enkripsi",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#C8B6FF]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-[#BDE0FE]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#FFC8DD]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ x: -4 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-[#2B2D42]/70 hover:text-[#2B2D42] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">
            Kembali ke Dashboard
          </span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#C8B6FF] to-[#FFC8DD] flex items-center justify-center shadow-xl">
              <GraduationCap
                className="w-8 h-8 text-white"
                strokeWidth={2}
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#2B2D42] mb-3">
            Tentang Aplikasi
          </h1>
          <p className="text-lg text-[#2B2D42]/70 max-w-2xl mx-auto">
            Membantu kamu menentukan jurusan terbaik secara
            cerdas
          </p>
        </motion.div>

        {/* Section 1: Deskripsi */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 border border-white/60 shadow-xl mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#C8B6FF] to-[#BDE0FE] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#2B2D42] mb-3">
                Deskripsi
              </h2>
              <p className="text-[#2B2D42]/80 leading-relaxed text-lg">
                <strong className="text-[#C8B6FF]">
                  EduMatch AI
                </strong>{" "}
                adalah sistem pendukung keputusan yang membantu
                siswa memilih jurusan kuliah berdasarkan data
                akademik, minat, dan kemampuan finansial. Dengan
                teknologi AI dan algoritma cerdas, kami
                memberikan rekomendasi yang personal dan akurat
                untuk masa depan pendidikanmu.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Cara Kerja - Step by Step Flow */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-[#2B2D42] mb-6 text-center">
            Cara Kerja Sistem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[calc(100%+0.5rem)] w-6 h-0.5 bg-gradient-to-r from-current to-transparent opacity-30" />
                  )}

                  <div className="bg-white/40 backdrop-blur-2xl rounded-[24px] p-6 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                    <div className="flex flex-col items-center text-center">
                      {/* Step Number */}
                      <div
                        className="w-16 h-16 rounded-[16px] flex items-center justify-center mb-4 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
                        }}
                      >
                        <Icon
                          className="w-8 h-8 text-white"
                          strokeWidth={2}
                        />
                      </div>

                      {/* Step Number Badge */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8B6FF] to-[#FFC8DD] flex items-center justify-center text-white font-bold text-sm mb-3">
                        {index + 1}
                      </div>

                      <h3 className="text-lg font-semibold text-[#2B2D42] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#2B2D42]/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Visual Flow Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex items-center justify-center gap-2"
          >
            {howItWorksSteps.map((_, index) => (
              <div key={index} className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className="w-3 h-3 rounded-full bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD]"
                />
                {index < howItWorksSteps.length - 1 && (
                  <div className="w-8 h-0.5 bg-[#2B2D42]/20" />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Section 3: Metode yang Digunakan */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-[#2B2D42] mb-6 text-center">
            Metode yang Digunakan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white/40 backdrop-blur-2xl rounded-[24px] p-6 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 rounded-[16px] bg-gradient-to-br ${method.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon
                      className="w-7 h-7 text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2B2D42] mb-2">
                    {method.title}
                  </h3>
                  <p className="text-[#2B2D42]/70 leading-relaxed">
                    {method.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Section 4: Keunggulan */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 border border-white/60 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-semibold text-[#2B2D42] mb-6 text-center">
            Keunggulan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white/50 rounded-[20px] border border-white/60 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-[12px] bg-gradient-to-br from-[#A0E7E5] to-[#BDE0FE] flex items-center justify-center flex-shrink-0">
                    <Icon
                      className="w-6 h-6 text-white"
                      strokeWidth={2}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[#2B2D42]/80 leading-relaxed">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Section 5: CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#C8B6FF] via-[#FFC8DD] to-[#BDE0FE] rounded-[30px] p-10 shadow-2xl text-center"
        >
          {/* Decorative Blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Siap Menemukan Jurusan Impianmu?
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
              Mulai analisis sekarang dan temukan jurusan yang
              paling sesuai dengan minat, bakat, dan kemampuan
              finansialmu.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/analysis/step1")}
              className="px-8 py-4 bg-white text-[#2B2D42] rounded-[16px] font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
            >
              Mulai Analisis Sekarang
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
