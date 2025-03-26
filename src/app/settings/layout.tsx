// app/settings/layout.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground data-oid="o1yvov:" />
      <div className="min-h-screen flex flex-col" data-oid="yr:.u3n">
        <Header data-oid="ssn81_p" />
        <main className="flex-1" data-oid="nd1_efc">
          {children}
        </main>
        <Footer data-oid="dm..l04" />
      </div>
    </>
  );
}
