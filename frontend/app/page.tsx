import { HeroSection } from "@/components/hero-section";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
