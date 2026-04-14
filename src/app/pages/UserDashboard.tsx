import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import {
  LayoutDashboard,
  History,
  User,
  LogOut,
  GraduationCap,
  TrendingUp,
  Clock,
  ChevronRight,
  Lightbulb,
  Info,
  UserCircle,
  ChevronLeft,
} from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const displayName = user?.name || "User";
  const displayEmail = user?.email || "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((name: string) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "history",
      label: "Riwayat",
      icon: History,
      path: "/history",
    },
    {
      id: "profile",
      label: "Profil",
      icon: User,
      path: "/profile",
    },
    {
      id: "about",
      label: "Tentang Aplikasi",
      icon: Info,
      path: "/about",
    },
    {
      id: "developer",
      label: "Pengembang",
      icon: UserCircle,
      path: "/developer",
    },
  ];

  const tips = [
    "Kenali minat dan bakatmu dengan baik",
    "Riset peluang karir untuk setiap jurusan",
    "Pertimbangkan passion dan prospek masa depan",
    "Konsultasikan dengan mentor atau guru",
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
      </div>

      <div className="flex min-h-screen relative z-10">
        {/* Overlay Backdrop for Mobile */}
        <AnimatePresence>
          {sidebarOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: 0 }}
          animate={{
            x: sidebarOpen ? 0 : -288,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-0 top-0 h-full w-72 bg-white/40 backdrop-blur-2xl border-r border-white/60 p-6 flex flex-col z-50 overflow-y-auto"
        >
          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#A0E7E5] to-[#C8B6FF] flex items-center justify-center shadow-lg">
                <GraduationCap
                  className="w-6 h-6 text-white"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <h1 className="font-bold text-[#2B2D42] text-lg">
                  EduMatch AI
                </h1>
                <p className="text-xs text-[#2B2D42]/60">
                  Smart Major Finder
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#2B2D42]/70" />
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.path !== "#") navigate(item.path);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] text-white shadow-lg shadow-[#C8B6FF]/30"
                      : "text-[#2B2D42]/70 hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </nav>

          {/* Logout */}
          <Link to="/login">
            <motion.button
              whileHover={{ x: 4 }}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[16px] text-[#d4183d] hover:bg-red-50/50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" strokeWidth={2} />
              <span className="font-medium">Keluar</span>
            </motion.button>
          </Link>
        </motion.aside>

        {/* Sidebar Toggle Button (when closed) */}
        <AnimatePresence>
          {!sidebarOpen && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="fixed left-4 top-4 z-50 w-12 h-12 rounded-[16px] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl flex items-center justify-center hover:bg-white/60 transition-colors"
            >
              <Menu className="w-6 h-6 text-[#2B2D42]" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          className="flex-1 overflow-auto transition-all duration-300 w-full"
          animate={{
            marginLeft: isMobile ? 0 : (sidebarOpen ? 288 : 0),
          }}
          style={{
            maxWidth: isMobile ? '100vw' : (sidebarOpen ? 'calc(100vw - 288px)' : '100vw'),
          }}
        >
          {/* Top Navbar */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/40 backdrop-blur-2xl border-b border-white/60 px-8 py-5"
          >
            <div className="flex items-center justify-between w-full">
              {/* Left Section - Title */}
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#2B2D42]">
                    Dashboard
                  </h2>
                  <p className="text-sm text-[#2B2D42]/60 mt-0.5">
                    Langkah Awal Menuju Masa Depan Impian!
                  </p>
                </div>
              </div>

              {/* Right Section - User Info */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-[#2B2D42]">
                    {displayName}
                  </p>
                  <p className="text-xs text-[#2B2D42]/60 mt-0.5">
                    {displayEmail}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C8B6FF] to-[#A0E7E5] flex items-center justify-center text-white font-semibold shadow-lg">
                  {initials}
                </div>
              </div>
            </div>
          </motion.header>

          {/* Dashboard Content */}
          <div className="p-8 space-y-6">
            {/* Hero Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#C8B6FF] via-[#FFC8DD] to-[#BDE0FE] rounded-[30px] p-8 shadow-2xl"
            >
              {/* Decorative Blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-3">
                      Mulai Analisis Jurusanmu
                    </h3>
                    <p className="text-white/90 max-w-lg leading-relaxed">
                      Temukan jurusan yang paling sesuai dengan
                      minat, bakat, dan kepribadianmu melalui
                      analisis AI yang canggih dan personal.
                    </p>
                  </div>
                  <GraduationCap
                    className="w-16 h-16 text-white/30"
                    strokeWidth={1.5}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/analysis/step1")}
                  className="h-11 px-5 bg-white/90 rounded-[12px] text-[#2B2D42] text-[13px] font-semibold shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                >
                  Mulai Analisis
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Riwayat Terakhir */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-6 border border-white/60 shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-semibold text-[#2B2D42] flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#C8B6FF]" />
                    Riwayat Terakhir
                  </h4>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/50 rounded-[20px] p-5 border border-white/60">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-[#2B2D42]/60 mb-1">
                          Rekomendasi Jurusan
                        </p>
                        <h5 className="text-xl font-semibold text-[#2B2D42]">
                          Teknik Informatika
                        </h5>
                      </div>
                      {/* Circular Progress */}
                      <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                            fill="none"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="url(#gradient)"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.89)}`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient
                              id="gradient"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="#C8B6FF"
                              />
                              <stop
                                offset="100%"
                                stopColor="#A0E7E5"
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-[#2B2D42]">
                            89%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#2B2D42]/60">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>Kesesuaian sangat tinggi</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => navigate("/history")}
                    className="w-full py-3 text-[#C8B6FF] font-medium hover:bg-white/50 rounded-[16px] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Lihat Semua Riwayat
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Tips Memilih Jurusan */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-6 border border-white/60 shadow-xl"
              >
                <h4 className="text-xl font-semibold text-[#2B2D42] mb-6 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#FFAFCC]" />
                  Tips Memilih Jurusan
                </h4>

                <div className="space-y-3">
                  {tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-white/50 rounded-[16px] border border-white/60 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFAFCC] to-[#FFC8DD] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-[#2B2D42]/80 leading-relaxed">
                        {tip}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
