
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VerifyPage from "./pages/VerifyPage";
import CertificatesPage from "./pages/CertificatesPage";
import IssuePage from "./pages/IssuePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CertificateDetail from "./components/CertificateDetail";
import { Web3Provider } from "./contexts/Web3Context";
import { IPFSProvider } from "./contexts/IPFSContext";
import { CertificateProvider } from "./contexts/CertificateContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <IPFSProvider>
        <CertificateProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/verify" element={<VerifyPage />} />
                    <Route path="/certificates" element={<CertificatesPage />} />
                    <Route path="/issue" element={<IssuePage />} />
                    <Route path="/certificate/:id" element={<CertificateDetail />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </CertificateProvider>
      </IPFSProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
