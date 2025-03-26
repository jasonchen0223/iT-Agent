// app/projects/layout.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground data-oid=".xrqf9d" />
      <div className="min-h-screen flex flex-col" data-oid="6_-cad.">
        <Header data-oid="qdq6b_-" />
        <main className="flex-1" data-oid="ytqx70f">
          {children}
        </main>
        <Footer data-oid=":std1e." />
      </div>
    </>
  );
}
