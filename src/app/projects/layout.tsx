// app/projects/layout.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground data-oid="n47wn.a" />
      <div className="min-h-screen flex flex-col" data-oid="1.acg71">
        <Header data-oid="vw80hp7" />
        <main className="flex-1" data-oid=":ur4csb">
          {children}
        </main>
        <Footer data-oid="hj2e5k." />
      </div>
    </>
  );
}
