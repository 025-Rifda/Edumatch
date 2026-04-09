import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Wallet, Info } from "lucide-react";

export default function BudgetInputPage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(3000000);
  const minBudget = 500000;
  const maxBudget = 10000000;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const presets = [
    { label: "< 1 Juta", value: 750000 },
    { label: "1-3 Juta", value: 2000000 },
    { label: "3-5 Juta", value: 4000000 },
    { label: "> 5 Juta", value: 7000000 },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/20 via-[#FFC8DD]/10 to-[#BDE0FE]/20" />

      {/* Floating Blobs */}
      <motion.div
        className="absolute bottom-20 left-20 w-96 h-96 bg-[#A0E7E5]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border-b border-white/60 px-3 md:px-8 py-3 md:py-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <span className="text-xs md:text-sm font-medium text-[#2B2D42]">Langkah 3 dari 3</span>
              <span className="text-xs md:text-sm text-[#2B2D42]/60">100% selesai</span>
            </div>
            <div className="w-full h-1.5 md:h-2 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-full"
                initial={{ width: "66.66%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 px-3 md:px-8 py-6 md:py-12 flex items-center justify-center overflow-y-auto">
          <div className="max-w-3xl w-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/40 backdrop-blur-2xl rounded-2xl md:rounded-[30px] p-5 md:p-10 border border-white/60 shadow-2xl"
            >
              {/* Header */}
              <div className="text-center mb-6 md:mb-10">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#A0E7E5] to-[#BDE0FE] mb-4 md:mb-6 shadow-lg">
                  <Wallet className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={2} />
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42] mb-2 md:mb-3">
                  Tentukan Budget Kuliahmu
                </h1>
                <p className="text-[#2B2D42]/70 text-sm md:text-lg px-2">
                  Kami akan menyesuaikan jurusan dengan kemampuan finansialmu
                </p>
              </div>

              {/* Budget Display */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6 md:mb-10"
              >
                <div className="inline-block px-5 md:px-8 py-4 md:py-6 bg-gradient-to-br from-[#C8B6FF]/20 to-[#FFC8DD]/20 rounded-xl md:rounded-[24px] border-2 border-white/60 shadow-lg">
                  <p className="text-[10px] md:text-sm text-[#2B2D42]/60 mb-1 md:mb-2 font-medium">Budget per Semester</p>
                  <motion.p
                    key={budget}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] bg-clip-text text-transparent"
                  >
                    {formatCurrency(budget)}
                  </motion.p>
                </div>
              </motion.div>

              {/* Slider */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6 md:mb-8"
              >
                <div className="relative">
                  <input
                    type="range"
                    min={minBudget}
                    max={maxBudget}
                    step={100000}
                    value={budget}
                    onChange={(e) => setBudget(parseInt(e.target.value))}
                    className="w-full h-2 md:h-3 bg-white/50 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #C8B6FF ${((budget - minBudget) / (maxBudget - minBudget)) * 100}%, rgba(255,255,255,0.5) ${((budget - minBudget) / (maxBudget - minBudget)) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between mt-2 md:mt-3 text-[10px] md:text-sm text-[#2B2D42]/60">
                    <span>{formatCurrency(minBudget)}</span>
                    <span>{formatCurrency(maxBudget)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Preset Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs md:text-sm text-[#2B2D42]/70 mb-3 md:mb-4 text-center font-medium">
                  Atau pilih preset budget:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {presets.map((preset, index) => (
                    <motion.button
                      key={preset.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setBudget(preset.value)}
                      className={`h-11 rounded-[11px] text-[13px] font-medium transition-all duration-200 ${
                        budget === preset.value
                          ? "bg-gradient-to-r from-[#C8B6FF]/90 to-[#FFC8DD]/90 text-white shadow-sm"
                          : "bg-white/60 border border-[#2B2D42]/10 text-[#2B2D42] hover:bg-white/80 hover:border-[#C8B6FF]/30"
                      }`}
                    >
                      {preset.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Info Box */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-5 md:mt-8 p-4 md:p-5 bg-[#A0E7E5]/10 rounded-xl md:rounded-[20px] border border-[#A0E7E5]/30"
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <Info className="w-4 h-4 md:w-5 md:h-5 text-[#A0E7E5] flex-shrink-0 mt-0.5" />
                  <div className="text-xs md:text-sm text-[#2B2D42]/70 leading-relaxed">
                    <p className="font-medium text-[#2B2D42] mb-1">Informasi Budget</p>
                    <p>
                      Budget yang kamu pilih akan membantu kami merekomendasikan jurusan dengan kisaran UKT yang sesuai.
                      Ini termasuk biaya kuliah per semester, tidak termasuk biaya hidup.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-0 bg-white/40 backdrop-blur-2xl border-t border-white/60 px-3 md:px-8 py-4 md:py-6"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 md:gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/analysis/step2")}
              className="px-4 md:px-6 py-2.5 md:py-3.5 text-sm md:text-base bg-white/70 border border-white/80 rounded-xl md:rounded-[14px] text-[#2B2D42] font-medium hover:bg-white/90 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              Kembali
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/results")}
              className="flex-1 md:flex-none px-4 md:px-8 py-2.5 md:py-3.5 text-sm md:text-base bg-gradient-to-r from-[#A0E7E5] to-[#C8B6FF] rounded-xl md:rounded-[14px] text-white font-semibold shadow-lg shadow-[#C8B6FF]/30 hover:shadow-xl hover:shadow-[#C8B6FF]/40 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span className="hidden md:inline">Lihat Hasil Rekomendasi</span>
              <span className="md:hidden">Lihat Hasil</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Custom Slider Styles */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C8B6FF, #FFC8DD);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(200, 182, 255, 0.4);
          transition: transform 0.2s;
        }
        @media (min-width: 768px) {
          .slider::-webkit-slider-thumb {
            width: 24px;
            height: 24px;
          }
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #C8B6FF, #FFC8DD);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(200, 182, 255, 0.4);
        }
        @media (min-width: 768px) {
          .slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </div>
  );
}