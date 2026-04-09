import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  User,
  Mail,
  GraduationCap,
  ArrowLeft,
  BarChart3,
  Award,
} from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const profile = {
    name: "Rizenka",
    email: "Rin.airin@email.com",
    major: "IPA",
  };

  const stats = [
    { label: "Jumlah Analisis", value: "4", icon: BarChart3, color: "from-[#C8B6FF] to-[#FFC8DD]" },
    { label: "Jurusan Favorit", value: "Informatika", icon: Award, color: "from-[#A0E7E5] to-[#BDE0FE]" },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/20 via-[#FFC8DD]/10 to-[#BDE0FE]/20" />

      {/* Floating Blobs */}
      <motion.div
        className="absolute top-20 -right-40 w-96 h-96 bg-[#FFC8DD]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/40 backdrop-blur-2xl border-b border-white/60 px-3 md:px-8 py-3 md:py-6"
        >
          <div className="max-w-4xl mx-auto">
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
                <h1 className="text-xl md:text-3xl font-bold text-[#2B2D42]">Profil Saya</h1>
                <p className="text-[10px] md:text-sm text-[#2B2D42]/60 mt-0.5">
                  Informasi profil dan statistik analisis
                </p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 px-3 md:px-8 py-4 md:py-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-3 md:space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-4 md:p-8 border border-white/60 shadow-xl"
            >
              {/* Avatar Section */}
              <div className="flex items-start gap-3 md:gap-6 pb-4 md:pb-6 border-b border-white/60">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#C8B6FF] to-[#A0E7E5] flex items-center justify-center text-white text-xl md:text-3xl font-semibold shadow-lg">
                    {profile.name.split(" ").map(n => n[0]).join("")}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg md:text-2xl font-bold text-[#2B2D42] mb-1 md:mb-2 truncate">{profile.name}</h2>
                  <p className="text-xs md:text-base text-[#2B2D42]/60 flex items-center gap-1.5 md:gap-2 truncate">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </p>
                  <div className="mt-2 md:mt-3 inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#A0E7E5]/20 rounded-full">
                    <GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-[#A0E7E5] flex-shrink-0" />
                    <span className="text-[10px] md:text-sm font-medium text-[#2B2D42]">Siswa {profile.major}</span>
                  </div>
                </div>
              </div>

              {/* Information Display */}
              <div className="mt-4 md:mt-6 space-y-3 md:space-y-5">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#2B2D42] mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-[#C8B6FF]" />
                    Nama Lengkap
                  </label>
                  <div className="w-full px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl md:rounded-[14px] text-xs md:text-base text-[#2B2D42] bg-white/30 border border-transparent">
                    {profile.name}
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#2B2D42] mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-[#C8B6FF]" />
                    Email
                  </label>
                  <div className="w-full px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl md:rounded-[14px] text-xs md:text-base text-[#2B2D42] bg-white/30 border border-transparent break-all">
                    {profile.email}
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-[#2B2D42] mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2">
                    <GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-[#C8B6FF]" />
                    Jurusan SMA
                  </label>
                  <div className="w-full px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl md:rounded-[14px] text-xs md:text-base text-[#2B2D42] bg-white/30 border border-transparent">
                    {profile.major}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white/40 backdrop-blur-2xl rounded-xl md:rounded-[24px] p-4 md:p-6 border border-white/60 shadow-lg"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[16px] bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] md:text-sm text-[#2B2D42]/60 mb-0.5 md:mb-1">{stat.label}</p>
                        <p className="text-lg md:text-2xl font-bold text-[#2B2D42] truncate">{stat.value}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}