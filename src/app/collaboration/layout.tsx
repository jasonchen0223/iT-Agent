// app/collaboration/layout.tsx
import Footer from '@/components/ui/footer';
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function CollaborationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <StarBackground data-oid="8:ext8s" />
      <div className="min-h-screen flex flex-col" data-oid="332.q2i">
        <main className="flex-1" data-oid="z1fjx33">
          {children}
        </main>
        <Footer data-oid="rjlcedx" />
      </div>
    </>
  );
}
