// app/settings/layout.tsx
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StarBackground from "@/components/ui/StarBackground";
import { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StarBackground data-oid="o7db89v" />
      <div className="min-h-screen flex flex-col" data-oid="9sk662h">
        <Header data-oid="3uwt15k" />
        <main className="flex-1" data-oid="s14x0s:">
          {children}
        </main>
        <Footer data-oid="kplc_jb" />
      </div>
    </>
  );
}
