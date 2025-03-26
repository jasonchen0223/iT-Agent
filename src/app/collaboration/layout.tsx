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
      <StarBackground data-oid="llffbop" />
      <div className="min-h-screen flex flex-col" data-oid="4yxf0y0">
        <Header data-oid="dcu-94c" />
        <main className="flex-1" data-oid="vddl99n">
          {children}
        </main>
        <Footer data-oid="33f0620" />
      </div>
    </>
  );
}
