// app/agents/layout.tsx
import Footer from '@/components/ui/footer';
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function AgentsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground />
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
