// Routes configuration
import { createBrowserRouter } from "react-router";
import SplashScreen from "./pages/SplashScreen";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AcademicInputPage from "./pages/AcademicInputPage";
import InterestQuizPage from "./pages/InterestQuizPage";
import BudgetInputPage from "./pages/BudgetInputPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import AboutAppPage from "./pages/AboutAppPage";
import DeveloperPage from "./pages/DeveloperPage";
import MajorDetailPage from "./pages/MajorDetailPage";
import AddMajorPage from "./pages/AddMajorPage";
import ManageMajorsPage from "./pages/ManageMajorsPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/dashboard",
    Component: UserDashboard,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin-dashboard",
    Component: AdminDashboard,
  },
  {
    path: "/analysis/step1",
    Component: AcademicInputPage,
  },
  {
    path: "/analysis/step2",
    Component: InterestQuizPage,
  },
  {
    path: "/analysis/step3",
    Component: BudgetInputPage,
  },
  {
    path: "/results",
    Component: ResultsPage,
  },
  {
    path: "/history",
    Component: HistoryPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/about",
    Component: AboutAppPage,
  },
  {
    path: "/developer",
    Component: DeveloperPage,
  },
  {
    path: "/major/:majorId",
    Component: MajorDetailPage,
  },
  {
    path: "/admin/add-major",
    Component: AddMajorPage,
  },
  {
    path: "/admin/manage-majors",
    Component: ManageMajorsPage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
