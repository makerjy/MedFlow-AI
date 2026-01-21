import { HeroSection } from "@/app/components/hero-section";
import { ClinicalScenarios } from "@/app/components/clinical-scenarios";
import { DemoWorkspace } from "@/app/components/demo-workspace";
import { MobileAppSection } from "@/app/components/mobile-app-section";
import { ArchitectureSection } from "@/app/components/architecture-section";
import { ExpansionSection } from "@/app/components/expansion-section";
import { Footer } from "@/app/components/footer";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <HeroSection />
      <ClinicalScenarios />
      <DemoWorkspace />
      <MobileAppSection />
      <ArchitectureSection />
      <ExpansionSection />
      <Footer />
    </div>
  );
}
