// app/projects/layout.tsx
import Footer from '@/components/ui/footer';
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground data-oid="k-9d9:u" />
      <div className="min-h-screen flex flex-col" data-oid="u9b.:9n">
        <main className="flex-1" data-oid="gj0-4j0">
          {children}
        </main>
        <Footer data-oid="avwfo46" />
      </div>
    </>
  );
}
