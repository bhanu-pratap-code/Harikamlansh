import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react"; // Added useEffect
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "./pages/NotFound";
import StudyMaterialSection from "./components/StudyMaterialSection";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Payment from "./pages/Payment";
import StudentList from "./pages/studentlist";

const queryClient = new QueryClient();

// 🔥 Scroll Logic: Ye function hash (#) dekh kar sahi jagah scroll karega
function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname]);

  return null;
}

function LayoutContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToHash /> {/* 🔥 Ise yahan add kiya */}
      {!isAdminPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/study-material" element={<StudyMaterialSection />} />
        <Route path="/about" element={<About />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/studentlist" element={<StudentList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LayoutContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;