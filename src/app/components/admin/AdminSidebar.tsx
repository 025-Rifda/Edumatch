import { motion, AnimatePresence } from "motion/react";
import { LayoutDashboard, BookOpen, DollarSign, LogOut, Menu, ChevronLeft } from "lucide-react";
import { Link } from "react-router";

interface AdminSidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({ activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ukt", label: "Kelola UKT", icon: DollarSign },
  ];

  return (
    <>
      {/* Overlay Backdrop for Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
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
        className="fixed left-0 top-0 h-full w-64 md:w-72 bg-white/40 backdrop-blur-xl border-r border-white/20 p-4 md:p-8 flex flex-col z-50 overflow-y-auto"
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-6 md:mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] bg-clip-text text-transparent">
              EduMatch AI
            </h1>
            <p className="text-[10px] md:text-sm text-gray-500 mt-0.5">Admin Panel</p>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(false)}
            className="w-7 h-7 md:w-8 md:h-8 rounded-lg hover:bg-white/50 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </motion.button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-1.5 md:space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <motion.button
                key={item.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveMenu(item.id);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-2.5 md:gap-4 px-3 md:px-6 py-2.5 md:py-4 rounded-lg md:rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] text-white shadow-lg shadow-purple-200"
                    : "bg-white/30 backdrop-blur-sm text-gray-700 hover:bg-white/50"
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-xs md:text-base">{item.label}</span>
              </motion.button>
            );
          })}

          {/* Kelola Jurusan Button */}
          <Link to="/admin/manage-majors">
            <motion.button
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ x: 5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
              className="w-full flex items-center gap-2.5 md:gap-4 px-3 md:px-6 py-2.5 md:py-4 rounded-lg md:rounded-2xl bg-white/30 backdrop-blur-sm text-gray-700 hover:bg-white/50 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
              <span className="font-medium text-xs md:text-base">Kelola Jurusan</span>
            </motion.button>
          </Link>
        </nav>

        {/* Logout Button */}
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2.5 md:py-4 rounded-lg md:rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-xs md:text-base">Keluar</span>
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
            className="fixed left-3 top-3 md:left-4 md:top-4 z-50 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-2xl bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl flex items-center justify-center hover:bg-white/60 transition-colors"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}