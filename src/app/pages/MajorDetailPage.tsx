import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Award, Users, DollarSign } from "lucide-react";

type MajorDetailNavigationState = {
  match?: number;
};

export default function MajorDetailPage() {
  const { majorId } = useParams();
  const location = useLocation();

  // Ambil state dari navigation
  const navigationState =
    (location.state as MajorDetailNavigationState | null) ?? null;

  // Dummy data (pakai ini dulu)
  const majors: Record<string, any> = {
    informatika: {
      name: "Informatika",
      shortDesc: "Belajar tentang teknologi, coding, dan software.",
      duration: "4 Tahun",
      accreditation: "A",
      totalStudents: "1.200",
      uktRange: "Rp 5.000.000 - Rp 10.000.000",
      color: "from-purple-500 to-indigo-500",
      icon: "💻",
      match: 85,
    },
  };

  const major = majorId ? majors[majorId] : null;

  if (!major) {
    return <div className="p-6 text-center">Jurusan tidak ditemukan</div>;
  }

  // Ambil match final
  const storedMatch = 0; // kalau nanti mau ambil dari localStorage
  const displayedMatch =
    navigationState?.match ?? storedMatch ?? major.match;

  const displayMajor = {
    ...major,
    match: displayedMatch,
  };

  return (
    <div className="p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          
          {/* ICON */}
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
              
              {/* TITLE */}
              <div className="w-full md:flex-1">
                <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42] mb-2">
                  {displayMajor.name}
                </h1>
                <p className="text-sm md:text-lg text-[#2B2D42]/70">
                  {displayMajor.shortDesc}
                </p>
              </div>

              {/* MATCH */}
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

            {/* INFO GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
              
              {/* DURASI */}
              <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                <Clock className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">
                  Durasi
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">
                  {displayMajor.duration}
                </p>
              </div>

              {/* AKREDITASI */}
              <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">
                  Akreditasi
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">
                  {displayMajor.accreditation}
                </p>
              </div>

              {/* MAHASISWA */}
              <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                <Users className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">
                  Mahasiswa
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">
                  {displayMajor.totalStudents}
                </p>
              </div>

              {/* UKT */}
              <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">
                  UKT
                </p>
                <p className="text-xs md:text-sm font-semibold text-[#2B2D42] truncate">
                  {displayMajor.uktRange?.split(" - ")?.[0] ??
                    displayMajor.uktRange}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
