// components/LayoutWrapper.tsx
"use client";
import { usePathname } from "next/navigation";
import NavBar from "./navbar";
import TittleHeader from "./tittle-header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderNav = pathname === "/login"; // coloque aqui outras rotas que não devem mostrar

  return (
    <>
      {!hideHeaderNav && <TittleHeader />}
      {children}
      {!hideHeaderNav && <NavBar />}
    </>
  );
}
