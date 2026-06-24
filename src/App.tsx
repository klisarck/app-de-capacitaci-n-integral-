import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/contexts/I18nContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonView from "./pages/LessonView";
import QuizView from "./pages/QuizView";
import Profile from "./pages/Profile";
import Simulations from "./pages/Simulations";
import SimulationView from "./pages/SimulationView";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourseEditor from "./pages/AdminCourseEditor";
import AdminSimulationEditor from "./pages/AdminSimulationEditor";
import AdminVerifications from "./pages/AdminVerifications";
import AdminStudentProgress from "./pages/AdminStudentProgress";
import Regulations from "./pages/Regulations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/courses/:courseId/:moduleId/:lessonId" element={<LessonView />} />
            <Route path="/courses/:courseId/:moduleId/:lessonId/quiz" element={<QuizView />} />
            <Route path="/simulations" element={<Simulations />} />
            <Route path="/simulations/:scenarioId" element={<SimulationView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses/new" element={<AdminCourseEditor />} />
            <Route path="/admin/courses/:courseId/edit" element={<AdminCourseEditor />} />
            <Route path="/admin/simulations/new" element={<AdminSimulationEditor />} />
            <Route path="/admin/verifications" element={<AdminVerifications />} />
            <Route path="/admin/students" element={<AdminStudentProgress />} />
            <Route path="/regulations" element={<Regulations />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
