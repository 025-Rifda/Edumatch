import { motion } from "motion/react";
<<<<<<< Updated upstream
import { useNavigate, useLocation, useParams } from "react-router";
=======
import { useLocation, useNavigate, useParams } from "react-router";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
import { majors } from "../../data/majors";
=======

type MajorDetailNavigationState = {
  match?: number;
};

type StoredSelectedMajorContext = {
  id: string;
  match: number;
};

// Mock data untuk jurusan
const majorData: Record<string, any> = {
  "teknik-informatika": {
    name: "Teknik Informatika",
    icon: "💻",
    match: 92,
    color: "from-[#C8B6FF] to-[#FFC8DD]",
    shortDesc: "Program studi yang mempelajari teknologi komputasi, pemrograman, dan sistem informasi",
    description: "Teknik Informatika adalah program studi yang mempelajari dan menerapkan prinsip-prinsip ilmu komputer dan analisis matematis dalam perancangan, pengujian, pengembangan, dan evaluasi sistem operasi, perangkat lunak, dan kinerja komputer. Mahasiswa akan dibekali dengan pengetahuan mendalam tentang algoritma, struktur data, kecerdasan buatan, dan teknologi terkini.",
    whatYouLearn: [
      "Pemrograman Web & Mobile (HTML, CSS, JavaScript, React, Flutter)",
      "Algoritma dan Struktur Data",
      "Basis Data dan Manajemen Data",
      "Kecerdasan Buatan & Machine Learning",
      "Pengembangan Perangkat Lunak",
      "Keamanan Siber dan Jaringan Komputer",
      "Cloud Computing & DevOps",
      "UI/UX Design",
    ],
    careerProspects: [
      { title: "Software Engineer", salary: "Rp 8-25 juta/bulan" },
      { title: "Data Scientist", salary: "Rp 10-30 juta/bulan" },
      { title: "Full Stack Developer", salary: "Rp 7-20 juta/bulan" },
      { title: "AI/ML Engineer", salary: "Rp 12-35 juta/bulan" },
      { title: "DevOps Engineer", salary: "Rp 9-25 juta/bulan" },
      { title: "Cyber Security Analyst", salary: "Rp 8-22 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 3.000.000 - Rp 5.500.000",
    accreditation: "A (Unggul)",
    totalStudents: "1,250",
    whyChoose: [
      "Prospek karir sangat luas di era digital",
      "Gaji tinggi dan kompetitif",
      "Bisa bekerja remote/freelance",
      "Industri teknologi terus berkembang pesat",
      "Peluang berkarir di perusahaan global",
    ],
  },
  "sistem-informasi": {
    name: "Sistem Informasi",
    icon: "📊",
    match: 88,
    color: "from-[#A0E7E5] to-[#BDE0FE]",
    shortDesc: "Program studi yang menggabungkan teknologi informasi dengan manajemen bisnis",
    description: "Sistem Informasi adalah program studi yang memfokuskan pada perancangan dan pengelolaan sistem informasi berbasis teknologi untuk mendukung kebutuhan bisnis dan organisasi. Mahasiswa akan mempelajari bagaimana mengintegrasikan teknologi informasi dengan proses bisnis untuk menciptakan solusi yang efektif dan efisien.",
    whatYouLearn: [
      "Analisis dan Perancangan Sistem",
      "Manajemen Basis Data",
      "Business Intelligence & Analytics",
      "Enterprise Resource Planning (ERP)",
      "E-Business & E-Commerce",
      "Manajemen Proyek IT",
      "Data Mining & Big Data",
      "IT Governance & Audit",
    ],
    careerProspects: [
      { title: "Business Analyst", salary: "Rp 7-20 juta/bulan" },
      { title: "IT Consultant", salary: "Rp 8-25 juta/bulan" },
      { title: "Data Analyst", salary: "Rp 6-18 juta/bulan" },
      { title: "Product Manager", salary: "Rp 10-30 juta/bulan" },
      { title: "System Analyst", salary: "Rp 7-22 juta/bulan" },
      { title: "ERP Specialist", salary: "Rp 8-20 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 2.800.000 - Rp 5.000.000",
    accreditation: "A (Unggul)",
    totalStudents: "980",
    whyChoose: [
      "Kombinasi teknologi dan bisnis",
      "Peluang karir di berbagai industri",
      "Kemampuan memecahkan masalah bisnis dengan teknologi",
      "Gaji kompetitif dengan prospek cerah",
      "Soft skill komunikasi dan manajemen yang kuat",
    ],
  },
  "teknik-elektro": {
    name: "Teknik Elektro",
    icon: "⚡",
    match: 85,
    color: "from-[#FFAFCC] to-[#FFC8DD]",
    shortDesc: "Program studi yang mempelajari aplikasi listrik, elektronika, dan elektromagnetika",
    description: "Teknik Elektro adalah program studi yang mempelajari sifat-sifat elektron (listrik) dan aplikasinya dalam kehidupan sehari-hari. Mahasiswa akan dibekali dengan pengetahuan tentang sistem tenaga listrik, elektronika, telekomunikasi, kendali, dan komputer untuk menghasilkan inovasi teknologi.",
    whatYouLearn: [
      "Rangkaian Listrik & Elektronika",
      "Sistem Tenaga Listrik",
      "Teknik Telekomunikasi",
      "Sistem Kendali & Otomasi",
      "Mikroprosesor & Mikrokontroler",
      "Pengolahan Sinyal Digital",
      "Elektronika Daya",
      "Internet of Things (IoT)",
    ],
    careerProspects: [
      { title: "Electrical Engineer", salary: "Rp 6-18 juta/bulan" },
      { title: "Automation Engineer", salary: "Rp 7-20 juta/bulan" },
      { title: "IoT Developer", salary: "Rp 8-22 juta/bulan" },
      { title: "Power System Engineer", salary: "Rp 7-19 juta/bulan" },
      { title: "Telecommunication Engineer", salary: "Rp 6-17 juta/bulan" },
      { title: "Control System Engineer", salary: "Rp 7-20 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 3.200.000 - Rp 5.800.000",
    accreditation: "A (Unggul)",
    totalStudents: "850",
    whyChoose: [
      "Teknologi listrik terus berkembang",
      "Peluang kerja di berbagai sektor industri",
      "Gaji yang kompetitif",
      "Bisa berwirausaha di bidang teknologi",
      "Kontribusi untuk energi terbarukan",
    ],
  },
  "matematika": {
    name: "Matematika",
    icon: "🔢",
    match: 82,
    color: "from-[#C8B6FF] to-[#A0E7E5]",
    shortDesc: "Program studi yang mempelajari teori matematika dan aplikasinya",
    description: "Matematika adalah program studi yang mempelajari konsep-konsep abstrak dan logika matematis serta penerapannya dalam berbagai bidang. Mahasiswa akan mengembangkan kemampuan berpikir analitis, pemecahan masalah, dan pemodelan matematis yang dapat diterapkan di dunia nyata.",
    whatYouLearn: [
      "Kalkulus & Analisis Real",
      "Aljabar Linear & Abstrak",
      "Statistika & Probabilitas",
      "Pemodelan Matematika",
      "Metode Numerik",
      "Matematika Komputasi",
      "Riset Operasi",
      "Teori Graf & Kombinatorika",
    ],
    careerProspects: [
      { title: "Data Scientist", salary: "Rp 9-28 juta/bulan" },
      { title: "Aktuaris", salary: "Rp 10-35 juta/bulan" },
      { title: "Quantitative Analyst", salary: "Rp 12-40 juta/bulan" },
      { title: "Research Analyst", salary: "Rp 7-20 juta/bulan" },
      { title: "Statistician", salary: "Rp 6-18 juta/bulan" },
      { title: "Lecturer/Teacher", salary: "Rp 5-15 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 2.500.000 - Rp 4.500.000",
    accreditation: "A (Unggul)",
    totalStudents: "620",
    whyChoose: [
      "Dasar untuk banyak bidang ilmu",
      "Peluang karir di finance & tech",
      "Gaji tinggi untuk aktuaris & data scientist",
      "Kemampuan problem solving yang kuat",
      "Bisa melanjutkan ke berbagai jurusan S2",
    ],
  },
  "fisika": {
    name: "Fisika",
    icon: "🔬",
    match: 80,
    color: "from-[#BDE0FE] to-[#A0E7E5]",
    shortDesc: "Program studi yang mempelajari fenomena alam dan hukum-hukum dasarnya",
    description: "Fisika adalah program studi yang mempelajari sifat dan fenomena alam semesta, dari partikel terkecil hingga galaksi terbesar. Mahasiswa akan dibekali dengan pemahaman mendalam tentang hukum-hukum fisika dan kemampuan untuk menerapkannya dalam penelitian dan teknologi.",
    whatYouLearn: [
      "Mekanika Klasik & Kuantum",
      "Termodinamika & Fisika Statistik",
      "Elektromagnetika",
      "Fisika Modern & Nuklir",
      "Optik & Gelombang",
      "Fisika Komputasi",
      "Instrumentasi & Elektronika",
      "Fisika Material",
    ],
    careerProspects: [
      { title: "Research Scientist", salary: "Rp 7-22 juta/bulan" },
      { title: "Medical Physicist", salary: "Rp 8-25 juta/bulan" },
      { title: "Data Scientist", salary: "Rp 9-28 juta/bulan" },
      { title: "Quality Control Engineer", salary: "Rp 6-18 juta/bulan" },
      { title: "Instrumentation Engineer", salary: "Rp 7-20 juta/bulan" },
      { title: "Lecturer/Researcher", salary: "Rp 6-18 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 2.500.000 - Rp 4.500.000",
    accreditation: "A (Unggul)",
    totalStudents: "480",
    whyChoose: [
      "Memahami fundamental alam semesta",
      "Peluang riset yang luas",
      "Bisa bekerja di berbagai industri",
      "Kemampuan analitis yang sangat kuat",
      "Bisa transisi ke data science & tech",
    ],
  },
  "teknik-industri": {
    name: "Teknik Industri",
    icon: "⚙️",
    match: 78,
    color: "from-[#FFC8DD] to-[#FFAFCC]",
    shortDesc: "Program studi yang mengoptimalkan sistem produksi dan manajemen operasi",
    description: "Teknik Industri adalah program studi yang mempelajari perancangan, perbaikan, dan instalasi sistem terintegrasi yang melibatkan manusia, material, informasi, peralatan, dan energi. Fokus utama adalah optimasi sistem untuk meningkatkan efisiensi dan produktivitas.",
    whatYouLearn: [
      "Sistem Produksi & Manufaktur",
      "Manajemen Operasi",
      "Ergonomi & Perancangan Kerja",
      "Pengendalian Kualitas",
      "Riset Operasi & Optimasi",
      "Supply Chain Management",
      "Manajemen Proyek",
      "Sistem Informasi Industri",
    ],
    careerProspects: [
      { title: "Industrial Engineer", salary: "Rp 6-18 juta/bulan" },
      { title: "Supply Chain Manager", salary: "Rp 8-25 juta/bulan" },
      { title: "Operations Manager", salary: "Rp 9-28 juta/bulan" },
      { title: "Quality Assurance Manager", salary: "Rp 7-22 juta/bulan" },
      { title: "Project Manager", salary: "Rp 8-26 juta/bulan" },
      { title: "Management Consultant", salary: "Rp 9-30 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 3.000.000 - Rp 5.200.000",
    accreditation: "A (Unggul)",
    totalStudents: "920",
    whyChoose: [
      "Kombinasi engineering & management",
      "Peluang karir sangat luas",
      "Dibutuhkan di semua industri",
      "Gaji kompetitif dengan posisi strategis",
      "Bisa jadi entrepreneur",
    ],
  },
  "statistika": {
    name: "Statistika",
    icon: "📈",
    match: 76,
    color: "from-[#A0E7E5] to-[#C8B6FF]",
    shortDesc: "Program studi yang mempelajari pengumpulan, analisis, dan interpretasi data",
    description: "Statistika adalah program studi yang mempelajari metode ilmiah untuk mengumpulkan, mengorganisir, meringkas, menyajikan, dan menganalisis data serta menarik kesimpulan yang valid. Di era big data, statistika menjadi sangat penting untuk pengambilan keputusan berbasis data.",
    whatYouLearn: [
      "Teori Probabilitas",
      "Inferensi Statistika",
      "Analisis Regresi & Multivariat",
      "Time Series Analysis",
      "Sampling & Survey",
      "Machine Learning & Data Mining",
      "Statistical Computing (R, Python)",
      "Actuarial Science",
    ],
    careerProspects: [
      { title: "Data Analyst", salary: "Rp 7-20 juta/bulan" },
      { title: "Statistician", salary: "Rp 6-18 juta/bulan" },
      { title: "Data Scientist", salary: "Rp 9-28 juta/bulan" },
      { title: "Business Intelligence Analyst", salary: "Rp 7-22 juta/bulan" },
      { title: "Research Analyst", salary: "Rp 6-17 juta/bulan" },
      { title: "Market Research Analyst", salary: "Rp 6-16 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 2.500.000 - Rp 4.500.000",
    accreditation: "A (Unggul)",
    totalStudents: "550",
    whyChoose: [
      "Era big data membutuhkan ahli statistika",
      "Peluang karir di tech & business",
      "Gaji kompetitif sebagai data scientist",
      "Skill yang dibutuhkan berbagai industri",
      "Bisa bekerja remote",
    ],
  },
  "ilmu-komputer": {
    name: "Ilmu Komputer",
    icon: "🖥️",
    match: 75,
    color: "from-[#C8B6FF] to-[#BDE0FE]",
    shortDesc: "Program studi yang mempelajari teori komputasi dan algoritma",
    description: "Ilmu Komputer adalah program studi yang fokus pada aspek teoretis dan matematis dari komputasi. Mahasiswa akan mempelajari fundamental computing, algoritma, teori komputasi, dan pengembangan sistem komputer dari perspektif ilmiah.",
    whatYouLearn: [
      "Algoritma & Kompleksitas",
      "Teori Komputasi",
      "Struktur Data Lanjut",
      "Artificial Intelligence",
      "Computer Vision",
      "Natural Language Processing",
      "Parallel & Distributed Computing",
      "Computational Theory",
    ],
    careerProspects: [
      { title: "Software Developer", salary: "Rp 8-24 juta/bulan" },
      { title: "Research Scientist", salary: "Rp 10-30 juta/bulan" },
      { title: "AI Researcher", salary: "Rp 12-35 juta/bulan" },
      { title: "Algorithm Engineer", salary: "Rp 10-28 juta/bulan" },
      { title: "Computer Scientist", salary: "Rp 9-26 juta/bulan" },
      { title: "System Architect", salary: "Rp 11-32 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 3.000.000 - Rp 5.500.000",
    accreditation: "A (Unggul)",
    totalStudents: "780",
    whyChoose: [
      "Fokus pada riset & inovasi",
      "Peluang karir di AI & machine learning",
      "Gaji sangat kompetitif",
      "Bisa melanjutkan S2/S3 dengan mudah",
      "Dibutuhkan untuk teknologi masa depan",
    ],
  },
  "teknik-kimia": {
    name: "Teknik Kimia",
    icon: "🧪",
    match: 72,
    color: "from-[#FFAFCC] to-[#A0E7E5]",
    shortDesc: "Program studi yang mempelajari proses transformasi bahan mentah menjadi produk",
    description: "Teknik Kimia adalah program studi yang mempelajari proses perubahan fisika dan kimia untuk menghasilkan produk yang bernilai tinggi. Mahasiswa akan dibekali dengan pengetahuan tentang proses industri, desain pabrik, dan optimasi produksi.",
    whatYouLearn: [
      "Termodinamika Kimia",
      "Operasi Teknik Kimia",
      "Proses Industri Kimia",
      "Kinetika & Reaktor Kimia",
      "Pengendalian Proses",
      "Desain Pabrik Kimia",
      "Keselamatan & Kesehatan Kerja",
      "Environmental Engineering",
    ],
    careerProspects: [
      { title: "Process Engineer", salary: "Rp 7-20 juta/bulan" },
      { title: "Production Engineer", salary: "Rp 6-18 juta/bulan" },
      { title: "Quality Control Engineer", salary: "Rp 6-17 juta/bulan" },
      { title: "Plant Manager", salary: "Rp 10-28 juta/bulan" },
      { title: "R&D Engineer", salary: "Rp 7-22 juta/bulan" },
      { title: "Environmental Engineer", salary: "Rp 6-18 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 3.200.000 - Rp 5.500.000",
    accreditation: "A (Unggul)",
    totalStudents: "650",
    whyChoose: [
      "Dibutuhkan di industri manufaktur",
      "Peluang kerja di perusahaan besar",
      "Gaji kompetitif",
      "Bisa berkontribusi untuk lingkungan",
      "Prospek karir yang stabil",
    ],
  },
  "arsitektur": {
    name: "Arsitektur",
    icon: "🏛️",
    match: 70,
    color: "from-[#FFC8DD] to-[#BDE0FE]",
    shortDesc: "Program studi yang mempelajari seni dan ilmu merancang bangunan",
    description: "Arsitektur adalah program studi yang menggabungkan seni, sains, dan teknologi dalam merancang dan membangun struktur fisik. Mahasiswa akan belajar menciptakan desain yang fungsional, estetis, dan berkelanjutan untuk berbagai jenis bangunan.",
    whatYouLearn: [
      "Desain Arsitektur",
      "Sejarah & Teori Arsitektur",
      "Struktur Bangunan",
      "Teknologi Bangunan",
      "Arsitektur Hijau & Berkelanjutan",
      "Interior Design",
      "Urban Planning",
      "CAD & Modeling Software (AutoCAD, SketchUp, Revit)",
    ],
    careerProspects: [
      { title: "Architect", salary: "Rp 6-20 juta/bulan" },
      { title: "Interior Designer", salary: "Rp 5-15 juta/bulan" },
      { title: "Urban Planner", salary: "Rp 6-18 juta/bulan" },
      { title: "Project Manager", salary: "Rp 8-25 juta/bulan" },
      { title: "Design Consultant", salary: "Rp 7-22 juta/bulan" },
      { title: "3D Visualizer", salary: "Rp 5-14 juta/bulan" },
    ],
    duration: "8 Semester (4 Tahun)",
    uktRange: "Rp 3.500.000 - Rp 6.000.000",
    accreditation: "A (Unggul)",
    totalStudents: "720",
    whyChoose: [
      "Kombinasi seni dan teknologi",
      "Bisa berwirausaha sebagai arsitek",
      "Proyek yang beragam dan menarik",
      "Kontribusi untuk pembangunan berkelanjutan",
      "Kreativitas tanpa batas",
    ],
  },
};
>>>>>>> Stashed changes

export default function MajorDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { majorId } = useParams();

<<<<<<< Updated upstream
  const major = majorId ? majors[majorId] : null;
  const match = typeof location.state === "object" && location.state && "match" in location.state
    ? Number((location.state as { match?: number }).match ?? 0)
    : major?.match ?? 0;
=======
  const major = majorId ? majorData[majorId] : null;
  const navigationState = (location.state as MajorDetailNavigationState | null) ?? null;

  let storedMatch: number | undefined;

  try {
    const storedContextRaw = localStorage.getItem("selected_major_context");
    const storedContext = storedContextRaw
      ? (JSON.parse(storedContextRaw) as StoredSelectedMajorContext)
      : null;

    if (storedContext && storedContext.id === majorId && typeof storedContext.match === "number") {
      storedMatch = storedContext.match;
    }
  } catch {
    storedMatch = undefined;
  }
>>>>>>> Stashed changes

  if (!major) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Data jurusan tidak ditemukan</p>
      </div>
    );
  }

  const displayedMatch = navigationState?.match ?? storedMatch ?? major.match;
  const displayMajor = {
    ...major,
    match: displayedMatch,
  };

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
                className={`w-20 h-20 md:w-24 md:h-24 rounded-[20px] md:rounded-[24px] bg-gradient-to-br ${displayMajor.color} flex items-center justify-center text-4xl md:text-5xl shadow-2xl flex-shrink-0`}
              >
                {displayMajor.icon}
              </motion.div>

              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row items-start justify-between gap-3 md:gap-4 mb-4">
                  <div className="w-full md:flex-1">
                    <h1 className="text-2xl md:text-4xl font-bold text-[#2B2D42] mb-2">
                      {displayMajor.name}
                    </h1>
                    <p className="text-sm md:text-lg text-[#2B2D42]/70">{displayMajor.shortDesc}</p>
                  </div>
<<<<<<< Updated upstream
                  {match > 0 && (
=======
                  {displayMajor.match && (
>>>>>>> Stashed changes
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className="w-full md:w-auto text-center"
                    >
                      <div className={`px-5 md:px-6 py-2.5 md:py-3 rounded-[12px] md:rounded-[16px] bg-gradient-to-r ${displayMajor.color} text-white shadow-xl`}>
                        <p className="text-xs md:text-sm font-medium">Kesesuaian</p>
<<<<<<< Updated upstream
                        <p className="text-2xl md:text-3xl font-bold">{Math.round(match)}%</p>
=======
                        <p className="text-2xl md:text-3xl font-bold">{displayMajor.match}%</p>
>>>>>>> Stashed changes
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6">
                  <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                    <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">Durasi</p>
                    <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">{displayMajor.duration}</p>
                  </div>
                  <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                    <Award className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                    <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">Akreditasi</p>
                    <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">{displayMajor.accreditation}</p>
                  </div>
                  <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                    <Users className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                    <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">Mahasiswa</p>
                    <p className="text-xs md:text-sm font-semibold text-[#2B2D42]">{displayMajor.totalStudents}</p>
                  </div>
                  <div className="bg-white/50 rounded-[12px] md:rounded-[14px] p-2.5 md:p-3 text-center">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-[#C8B6FF]" />
                    <p className="text-[10px] md:text-xs text-[#2B2D42]/60 mb-1">UKT</p>
                    <p className="text-xs md:text-sm font-semibold text-[#2B2D42] truncate">{displayMajor.uktRange.split(" - ")[0]}</p>
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
            <p className="text-[#2B2D42]/80 leading-relaxed text-sm md:text-lg">{displayMajor.description}</p>
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
<<<<<<< Updated upstream
              {major.whatYouLearn.map((item, index) => (
=======
              {displayMajor.whatYouLearn.map((item: string, index: number) => (
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              {major.careerProspects.map((career, index) => (
=======
              {displayMajor.careerProspects.map((career: any, index: number) => (
>>>>>>> Stashed changes
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
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${displayMajor.color} flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0`}>
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
<<<<<<< Updated upstream
              {major.whyChoose.map((reason, index) => (
=======
              {displayMajor.whyChoose.map((reason: string, index: number) => (
>>>>>>> Stashed changes
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-[#C8B6FF]/10 to-[#FFC8DD]/10 rounded-[14px] md:rounded-[16px] border border-[#C8B6FF]/20"
                >
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${displayMajor.color} flex items-center justify-center flex-shrink-0`}>
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
              className={`h-11 px-6 md:px-8 bg-gradient-to-r ${displayMajor.color} rounded-[12px] md:rounded-[16px] text-white text-[13px] md:text-base font-semibold shadow-sm hover:shadow-md transition-all duration-300`}
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
