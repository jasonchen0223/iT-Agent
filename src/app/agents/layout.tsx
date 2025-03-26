// app/agents/layout.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function AgentsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground data-oid="8-smlyd" />
      <div className="min-h-screen flex flex-col" data-oid="yr3og4:">
        <Header data-oid="d:8k7-9" />
        <main className="flex-1" data-oid="1lmpc7v">
          {children}
        </main>
        <Footer data-oid="ycsdsf-" />
      </div>
    </>
  );
}
