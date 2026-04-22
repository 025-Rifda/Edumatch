import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const questions = [
  "Saya tertarik mempelajari teknologi seperti komputer, aplikasi, atau coding.",
  "Saya senang memecahkan masalah logika atau matematika.",
  "Saya tertarik dengan dunia bisnis, manajemen, atau kewirausahaan.",
  "Saya suka berinteraksi dan bekerja dengan banyak orang.",
  "Saya tertarik pada dunia kesehatan seperti dokter atau perawat.",
  "Saya senang mempelajari alam, lingkungan, atau biologi.",
  "Saya tertarik pada desain, seni, atau kreativitas visual.",
  "Saya suka membaca dan memahami teori atau konsep baru.",
  "Saya tertarik pada dunia pendidikan dan mengajar orang lain.",
  "Saya ingin bekerja di bidang yang berhubungan dengan komunikasi (public speaking, media, dll).",

  "Saya mampu memahami pelajaran matematika dengan mudah.",
  "Saya mampu menggunakan komputer atau teknologi dengan baik.",
  "Saya memiliki kemampuan komunikasi yang baik di depan orang lain.",
  "Saya mampu bekerja sama dalam tim dengan baik.",
  "Saya memiliki kemampuan analisis yang kuat dalam menyelesaikan masalah.",
  "Saya mampu mengingat dan memahami materi pelajaran dengan cepat.",
  "Saya memiliki kreativitas dalam membuat ide atau karya baru.",
  "Saya teliti dan detail dalam mengerjakan sesuatu.",
  "Saya mampu mengambil keputusan dengan cepat dan tepat.",
  "Saya mampu belajar hal baru dengan cepat tanpa banyak bantuan.",
];

export default function InterestQuizPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(questions.length).fill(0),
  );
  const [direction, setDirection] = useState(0);

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (score: number) => {
    console.log("[InterestQuizPage] answer selected", {
      currentQuestion,
      score,
    });
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 100);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
      }, 100);
    } else {
      navigate("/analysis/step1");
    }
  };

  const handleNext = () => {
    if (answers[currentQuestion] === 0) {
      console.warn("[InterestQuizPage] handleNext blocked because current answer is empty", {
        currentQuestion,
      });
      return;
    }

    if (currentQuestion === questions.length - 1) {
      console.log("[InterestQuizPage] storing interest_answers", answers);
      localStorage.setItem("interest_answers", JSON.stringify(answers));
      navigate("/analysis/step3");
    } else {
      console.log("[InterestQuizPage] moving to next question", {
        currentQuestion,
        nextQuestion: currentQuestion + 1,
      });
      setDirection(1);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 100);
    }
  };

  const scaleLabels = [
    { value: 1, label: "Sangat Tidak Setuju" },
    { value: 2, label: "Tidak Setuju" },
    { value: 3, label: "Netral" },
    { value: 4, label: "Setuju" },
    { value: 5, label: "Sangat Setuju" },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#F8F9FF]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/20 via-[#FFC8DD]/10 to-[#BDE0FE]/20" />

      {/* Floating Blobs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-[#FFC8DD]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Progress Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/40 backdrop-blur-2xl border-b border-white/60 px-8 py-6"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[#2B2D42]">
                Pertanyaan {currentQuestion + 1} dari{" "}
                {questions.length}
              </span>
              <span className="text-sm text-[#2B2D42]/60">
                {Math.round(progress)}% selesai
              </span>
            </div>
            <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Quiz Content */}
        <div className="flex-1 px-8 py-12 flex items-center justify-center overflow-hidden">
          <div className="max-w-3xl w-full">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQuestion}
                custom={direction}
                initial={{
                  x: direction > 0 ? 100 : -100,
                  opacity: 0,
                }}
                animate={{ x: 0, opacity: 1 }}
                exit={{
                  x: direction > 0 ? -100 : 100,
                  opacity: 0,
                }}
                transition={{ duration: 0.3 }}
                className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-10 border border-white/60 shadow-2xl"
              >
                {/* Question Number Badge */}
                <div className="flex items-center justify-center mb-8">
                  <div className="px-5 py-2 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] rounded-full text-white font-semibold text-sm shadow-lg">
                    Pertanyaan {currentQuestion + 1}
                  </div>
                </div>

                {/* Question */}
                <h2 className="text-3xl font-semibold text-[#2B2D42] text-center mb-12 leading-relaxed">
                  {questions[currentQuestion]}
                </h2>

                {/* Answer Options */}
                <div className="space-y-4">
                  {scaleLabels.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full px-6 py-5 rounded-[20px] border-2 transition-all duration-200 flex items-center justify-between group ${
                        answers[currentQuestion] ===
                        option.value
                          ? "bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] border-transparent text-white shadow-lg shadow-[#C8B6FF]/30"
                          : "bg-white/50 border-white/60 text-[#2B2D42] hover:border-[#C8B6FF]/50 hover:bg-white/70"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                            answers[currentQuestion] ===
                            option.value
                              ? "bg-white/30 text-white"
                              : "bg-gradient-to-br from-[#C8B6FF]/20 to-[#FFC8DD]/20 text-[#2B2D42]/70"
                          }`}
                        >
                          {option.value}
                        </div>
                        <span className="font-medium">
                          {option.label}
                        </span>
                      </div>
                      {answers[currentQuestion] ===
                        option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          <CheckCircle className="w-6 h-6" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-1.5 mt-8">
                  {questions
                    .slice(0, Math.min(10, questions.length))
                    .map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i <= currentQuestion &&
                          currentQuestion < 10
                            ? "w-8 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD]"
                            : i === currentQuestion &&
                                currentQuestion >= 10
                              ? "w-8 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD]"
                              : "w-1.5 bg-[#2B2D42]/20"
                        }`}
                      />
                    ))}
                  {questions.length > 10 && (
                    <span className="text-xs text-[#2B2D42]/60 ml-2">
                      +{questions.length - 10}
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky bottom-0 bg-white/40 backdrop-blur-2xl border-t border-white/60 px-8 py-6"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              className="px-6 py-3.5 bg-white/70 border border-white/80 rounded-[14px] text-[#2B2D42] font-medium hover:bg-white/90 transition-all duration-200 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </motion.button>
            <motion.button
              whileHover={{
                scale:
                  answers[currentQuestion] === 0 ? 1 : 1.02,
              }}
              whileTap={{
                scale:
                  answers[currentQuestion] === 0 ? 1 : 0.98,
              }}
              onClick={handleNext}
              disabled={answers[currentQuestion] === 0}
              className={`px-8 py-3.5 rounded-[14px] font-semibold transition-all duration-300 flex items-center gap-2 group ${
                answers[currentQuestion] === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] text-white shadow-lg shadow-[#C8B6FF]/30 hover:shadow-xl hover:shadow-[#C8B6FF]/40"
              }`}
            >
              {currentQuestion === questions.length - 1
                ? "Selesai"
                : "Lanjut"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
