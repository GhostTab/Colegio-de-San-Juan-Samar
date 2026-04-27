import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import AppBreadcrumbs from "@/components/AppBreadcrumbs";
import AIAssistant from "@/components/AIAssistant";
import Landing from "@/pages/Landing";
import GradeSelection from "@/pages/GradeSelection";
import SubjectSelection from "@/pages/SubjectSelection";
import Dashboard from "@/pages/Dashboard";
import LessonViewer from "@/pages/LessonViewer";
import Quiz from "@/pages/Quiz";
import TeacherPanel from "@/pages/TeacherPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <AppBreadcrumbs />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/grades" element={<GradeSelection />} />
          <Route path="/subjects" element={<SubjectSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lessons" element={<LessonViewer />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/teacher" element={<TeacherPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
