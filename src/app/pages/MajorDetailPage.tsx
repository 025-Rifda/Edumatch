import { motion } from "motion/react";
import { useNavigate, useLocation, useParams } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  DollarSign,
  TrendingUp,
  GraduationCap,
  Users,
  Clock,
  Award,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { majors } from "../../data/majors";

export default function MajorDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { majorId } = useParams();

  const major = majorId ? majors[majorId] : null;
  const match = typeof location.state === "object" && location.state && "match" in location.state
    ? Number((location.state as { match?: number }).match ?? 0)
    : major?.match ?? 0;

  if (!major) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Data jurusan tidak ditemukan</p>
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
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FFC8DD]/20 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 5 }}
      />

      <div className="relative z-10 min-h-screen px-4 md:px-8 py-6 md:py-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="mb-6 md:mb-8 px-4 md:px-6 py-2.5 md:py-3 bg-white/70 backdrop-blur-sm rounded-[12px] md:rounded-[16px] border border-white/60 text-[#2B2D42] text-sm md:text-base font-medium hover:bg-white/90 transition-all duration-300 flex items-center gap-2 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            Kembali
          </motion.button>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-10 border border-white/60 shadow-xl mb-6 md:mb-8"
          >
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-[20px] md:rounded-[24px] bg-gradient-to-br ${major.color} flex items-center justify-center text-4xl md:text-5xl shadow-2xl flex-shrink-0`}
              >
                {major.icon}
              </motion.div>

              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row items-start justify-between gap-3 md:gap-4 mb-4">
                  <div className="w-full md:flex-1">
                    <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42] mb-2">
                      {major.name}
                    </h1>
                    <p className="text-sm md:text-lg text-[#2B2D42]/70">{major.shortDesc}</p>
                  </div>
                  {match > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className="w-full md:w-auto text-center"
                    >
                      <div className={`px-5 md:px-6 py-2.5 md:py-3 rounded-[12px] md:rounded-[16px] bg-gradient-to-r ${major.color} text-white shadow-xl`}>
                        <p className="text-xs md:text-sm font-medium">Kesesuaian</p>
                        <p className="text-2xl md:text-3xl font-bold">{Math.round(match)}%</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
                  <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                    <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">Durasi</p>
                    <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">{major.duration}</p>
                  </div>
                  <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                    <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                    <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">Akreditasi</p>
                    <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">{major.accreditation}</p>
                  </div>
                  <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                    <Users className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                    <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">Mahasiswa</p>
                    <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">{major.totalStudents}</p>
                  </div>
                  <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                    <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">UKT</p>
                    <p className="text-xs md:text-sm font-semibold text-[#2B2D42] truncate">{major.uktRange.split(" - ")[0]}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-8 border border-white/60 shadow-xl mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#C8B6FF] to-[#FFC8DD] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-[#2B2D42]">Tentang Jurusan</h2>
            </div>
            <p className="text-[#2B2D42]/80 leading-relaxed text-sm md:text-lg">{major.description}</p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-8 border border-white/60 shadow-xl mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#A0E7E5] to-[#BDE0FE] flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-[#2B2D42]">Apa yang Akan Dipelajari?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {major.whatYouLearn.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-white/50 rounded-[14px] md:rounded-[16px]"
                >
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[#2B2D42]/80 text-sm md:text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-8 border border-white/60 shadow-xl mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#FFAFCC] to-[#FFC8DD] flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-[#2B2D42]">Prospek Karir</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {major.careerProspects.map((career, index) => (
                <motion.div
                  key={career.title}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="p-4 md:p-5 bg-white/50 rounded-[14px] md:rounded-[16px] border border-white/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2B2D42] mb-1 text-sm md:text-base">{career.title}</h3>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-[#2B2D42]/70">
                        <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                        <span className="truncate">{career.salary}</span>
                      </div>
                    </div>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${major.color} flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0`}>
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-8 border border-white/60 shadow-xl mb-6 md:mb-8"
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-bold text-[#2B2D42]">Kenapa Pilih Jurusan Ini?</h2>
            </div>
            <div className="space-y-2 md:space-y-3">
              {major.whyChoose.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-[#C8B6FF]/10 to-[#FFC8DD]/10 rounded-[14px] md:rounded-[16px] border border-[#C8B6FF]/20"
                >
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${major.color} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="text-[#2B2D42]/80 mt-0.5 md:mt-1 text-sm md:text-base">{reason}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/dashboard")}
              className={`h-11 px-6 md:px-8 bg-gradient-to-r ${major.color} rounded-[12px] md:rounded-[16px] text-white text-[13px] md:text-base font-semibold shadow-sm hover:shadow-md transition-all duration-300`}
            >
              Kembali ke Dashboard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/analysis/step1")}
              className="h-11 px-6 md:px-8 bg-white/70 border-2 border-[#C8B6FF] rounded-[12px] md:rounded-[16px] text-[#2B2D42] text-[13px] md:text-base font-semibold hover:bg-white/90 transition-all duration-300"
            >
              Coba Analisis Lagi
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
