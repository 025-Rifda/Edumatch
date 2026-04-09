import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Edit,
  DollarSign,
} from "lucide-react";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { StatCard } from "../components/admin/StatCard";
import { UserGrowthChart } from "../components/admin/UserGrowthChart";
import { FloatingBlobs } from "../components/admin/FloatingBlobs";
import { UKTManagement } from "../components/admin/UKTManagement";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stats = [
    {
      label: "Total Pengguna",
      value: "2,847",
      icon: Users,
      gradient: "from-[#C8B6FF] to-[#FFC8DD]",
      delay: 0.1,
    },
    {
      label: "Total Jurusan",
      value: "156",
      icon: GraduationCap,
      gradient: "from-[#BDE0FE] to-[#A0E7E5]",
      delay: 0.2,
    },
    {
      label: "Kelola Jurusan",
      value: "Kelola",
      icon: Edit,
      gradient: "from-[#FFC8DD] to-[#FFB4D2]",
      delay: 0.3,
      isButton: true,
      onClick: () =>
        (window.location.href = "/admin/manage-majors"),
    },
    {
      label: "Kelola UKT",
      value: "Edit",
      icon: DollarSign,
      gradient: "from-[#A0E7E5] to-[#BDE0FE]",
      delay: 0.4,
      isButton: true,
      onClick: () => setActiveMenu("ukt"),
    },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#F0E7FF] via-[#E7F5FF] to-[#FFE7F0] relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <FloatingBlobs />

      {/* Sidebar */}
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <motion.main
        className="flex-1 p-3 md:p-6 mx-auto relative z-10 transition-all duration-300 w-full"
        animate={{
          marginLeft: isMobile ? 0 : (sidebarOpen ? 288 : 0),
        }}
        style={{
          maxWidth: isMobile ? '100vw' : (sidebarOpen ? 'calc(100vw - 288px)' : '100vw'),
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-8"
          >
            <h1 className="text-lg md:text-2xl font-semibold text-gray-800 mb-0.5">
              Dashboard Admin
            </h1>
            <p className="text-[11px] md:text-sm text-gray-600">
              Kelola sistem EduMatch AI dengan mudah
            </p>
          </motion.div>

          {activeMenu === "dashboard" && (
            <>
              {/* Stats Grid - 1 column on mobile, 2 columns on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-4 mb-4 md:mb-6 max-w-4xl mx-auto">
                {stats.map((stat) => (
                  <StatCard
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    gradient={stat.gradient}
                    delay={stat.delay}
                    isButton={stat.isButton}
                    onClick={stat.onClick}
                  />
                ))}
              </div>

              {/* Chart */}
              <UserGrowthChart />
            </>
          )}
          {activeMenu === "ukt" && <UKTManagement />}
        </div>
      </motion.main>
    </div>
  );
}