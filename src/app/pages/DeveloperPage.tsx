import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Mail,
  Github,
  Award,
  Code,
  Palette,
  Brain,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export default function DeveloperPage() {
  const navigate = useNavigate();

  const skills = [
    { name: "UI/UX Design", icon: Palette, color: "#C8B6FF" },
    { name: "Web Development", icon: Code, color: "#FFC8DD" },
    { name: "AI / Decision Support", icon: Brain, color: "#BDE0FE" },
    { name: "React & Tailwind", icon: Code, color: "#A0E7E5" },
  ];

  const contacts = [
    {
      name: "almas rifda zatadin",
      url: "https://github.com/025-Rifda",
    },
    {
      name: "dinda dwi febiani",
      url: "https://github.com/Dinda-2802",
    },
    {
      name: "elysa hayu noorhaini",
      url: "https://github.com/Elysa-21",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-[#C8B6FF]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-96 h-96 bg-[#BDE0FE]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFC8DD]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ x: -4 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-[#2B2D42]/70 hover:text-[#2B2D42] mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali ke Dashboard</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#2B2D42] mb-3">
            Tentang Pengembang
          </h1>
          <p className="text-lg text-[#2B2D42]/70">
            Orang di balik EduMatch AI
          </p>
        </motion.div>

        {/* Section 1: Profile Card */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-white/40 backdrop-blur-2xl rounded-[40px] p-10 border border-white/60 shadow-2xl mb-8"
        >
          {/* Decorative Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#C8B6FF]/10 via-transparent to-[#BDE0FE]/10 pointer-events-none" />

          {/* Floating Decorations */}
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-8 right-8 w-20 h-20 bg-[#FFC8DD]/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, 10, 0],
              rotate: [0, -5, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-8 left-8 w-24 h-24 bg-[#BDE0FE]/20 rounded-full blur-2xl"
          />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Profile Photo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="relative"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden ring-8 ring-white/50 shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1600896997793-b8ed3459a17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMGhlYWRzaG90fGVufDF8fHx8MTc3NTQ5NDc3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Verified Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-gradient-to-br from-[#C8B6FF] to-[#A0E7E5] flex items-center justify-center shadow-xl border-4 border-white"
              >
                <Award className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-[#2B2D42] mb-2">
                  Alex Kurniawan
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C8B6FF] to-[#FFC8DD] text-white rounded-full mb-4 shadow-lg">
                  <Code className="w-4 h-4" />
                  <span className="font-medium">
                    UI/UX Designer & Developer
                  </span>
                </div>
                <p className="text-[#2B2D42]/80 leading-relaxed mb-4 max-w-xl">
                  Mahasiswa yang berfokus pada pengembangan sistem cerdas untuk
                  membantu pengambilan keputusan. Passionate dalam menciptakan
                  solusi teknologi yang user-friendly dan berdampak positif
                  untuk pendidikan Indonesia.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-[#2B2D42]/70">
                  <GraduationCap className="w-5 h-5" />
                  <span>Universitas Indonesia • Informatika</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Section 2: Skills */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 border border-white/60 shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-[#2B2D42] mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#C8B6FF]" />
              Skills & Expertise
            </h3>

            <div className="space-y-3">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 bg-white/50 rounded-[20px] border border-white/60 hover:shadow-md transition-all duration-200"
                  >
                    <div
                      className="w-12 h-12 rounded-[12px] flex items-center justify-center shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${skill.color}, ${skill.color}dd)`,
                      }}
                    >
                      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <span className="font-medium text-[#2B2D42]">
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Section 3: Project Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/40 backdrop-blur-2xl rounded-[30px] p-8 border border-white/60 shadow-xl"
          >
            <h3 className="text-2xl font-semibold text-[#2B2D42] mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#FFC8DD]" />
              Project Info
            </h3>

            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-[#C8B6FF]/20 to-[#FFC8DD]/20 rounded-[20px] border border-white/60">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8B6FF] to-[#FFC8DD] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#2B2D42]">
                    Project Tugas Akhir
                  </h4>
                </div>
                <p className="text-[#2B2D42]/70 leading-relaxed text-sm">
                  Sistem Pendukung Keputusan berbasis AI untuk pemilihan jurusan
                  kuliah menggunakan Decision Tree dan Fuzzy Logic
                </p>
              </div>

              <div className="p-5 bg-white/50 rounded-[20px] border border-white/60">
                <h4 className="font-semibold text-[#2B2D42] mb-3">
                  Teknologi yang Digunakan
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React",
                    "TypeScript",
                    "Tailwind CSS",
                    "Motion",
                    "AI/ML",
                  ].map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="px-3 py-1.5 bg-gradient-to-r from-[#BDE0FE] to-[#A0E7E5] text-white text-sm rounded-full font-medium shadow-md"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 4: Contact & Social Media */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white/45 backdrop-blur-2xl rounded-[32px] p-8 border border-white/70 shadow-xl mb-8"
        >
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-semibold text-[#2B2D42]">
              Contact & Social Media
            </h3>
            <p className="mt-2 text-sm text-[#2B2D42]/60">
              Temukan profil GitHub tim pengembang EduMatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contacts.map((contact, index) => {
              return (
                <motion.a
                  key={index}
                  href={contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-[28px] border border-[#D8EAFE] bg-white/75 p-6 text-left shadow-[0_18px_50px_rgba(125,166,214,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(125,166,214,0.18)]"
                >
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-[#EAF4FF] via-[#F4F9FF] to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col items-start">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#DCEEFF] text-[#3B82F6] shadow-[0_10px_25px_rgba(96,165,250,0.20)] transition-transform duration-300 group-hover:scale-105">
                      <Github className="h-7 w-7" strokeWidth={2} />
                    </div>

                    <p className="text-lg font-bold capitalize text-[#1F2A44]">
                      {contact.name}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-sm text-[#5B6B87]">
                      <span className="truncate">{contact.url}</span>
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-[#7AA2D8]" />
                    </div>

                    <div className="mt-5 inline-flex items-center rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#4C6FA8]">
                      GitHub Profile
                    </div>
                  </div>
                </motion.a>
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
            <h3 className="text-3xl font-bold text-white mb-4">
              Tertarik Berkolaborasi?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
              Jika kamu punya ide atau ingin mendiskusikan project serupa,
              jangan ragu untuk menghubungi saya!
            </p>
            <motion.a
              href="mailto:developer@edumatch.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2B2D42] rounded-[16px] font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              Hubungi Saya
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
