// app/collaboration/layout.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function CollaborationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <StarBackground data-oid=".uxse8w" />
      <div className="min-h-screen flex flex-col" data-oid="i0yekoo">
        <Header data-oid="lijhm.7" />
        <main className="flex-1" data-oid="nzxvarg">
          {children}
        </main>
        <Footer data-oid="7zv5_g0" />
      </div>
    </>
  );
}
