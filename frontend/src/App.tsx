import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import BetaNotification from "./pages/BetaNotification";
import AdminDashboard from "./pages/AdminDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Integrations from "./pages/Integrations";
// Archived imports - kept for future re-enablement
// import DomainTools from "./pages/DomainTools";
// import Automations from "./pages/Automations";
// import AgentBuilder from "./components/AgentBuilder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/beta-notification" element={<BetaNotification />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/integrations" element={<Integrations />} />
            {/* Archived routes - kept for future re-enablement */}
            {/* <Route path="/domains" element={<DomainTools />} /> */}
            {/* <Route path="/automations" element={<Automations />} /> */}
            {/* <Route path="/agent-builder" element={<AgentBuilder />} /> */}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
