// app/agents/layout.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function AgentsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground data-oid="eldqq.l" />
      <div className="min-h-screen flex flex-col" data-oid="wy-d1t_">
        <Header data-oid="j_u_hbm" />
        <main className="flex-1" data-oid="jv1ryss">
          {children}
        </main>
        <Footer data-oid="rp-vhu." />
      </div>
    </>
  );
}
