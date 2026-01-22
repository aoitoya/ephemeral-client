import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthModal } from "../components/auth/AuthModal";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { CTASection } from "../components/landing/CTASection";
// import { Footer } from "../components/landing/Footer";

export const Route = createFileRoute("/_index")({
  component: HomePage,
});

function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="ephemeral-landing">
      <HeroSection onGetStarted={() => openAuthModal("signup")} />
      <FeaturesSection />
      <HowItWorks />
      <CTASection onGetStarted={() => openAuthModal("signup")} />
      {/* <Footer /> */}

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
