"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStudy } from "@/lib/store/study-context";

export function Navbar() {
  const pathname = usePathname();
  const { profile, notaEstimadaEnem } = useStudy();

  const navItems = [
    { href: "/", label: "início" },
    { href: "/trilha/matematica", label: "matemática" },
    { href: "/revisao", label: "revisão" },
    { href: "/redacao", label: "redação" },
    { href: "/foco", label: "modo fortaleza" },
  ];

  return (
    <header className="w-full bg-[#FFFFFF] dark:bg-[#242220] border-b border-[#E5E1D8] dark:border-[#38352F] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Marca & Logo em Fraunces */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-baseline gap-1.5 group">
            <span className="font-serif text-xl tracking-tight text-[#232019] dark:text-[#F1EEE7] font-semibold">
              Trilha 1000
            </span>
          </Link>

          {/* Links de Navegação em Sentence Case */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors text-xs font-medium ${
                    isActive
                      ? "text-[#3D6FB4] font-semibold"
                      : "text-[#6B665C] dark:text-[#B5B0A4] hover:text-[#232019] dark:hover:text-[#F1EEE7]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Indicadores Discretos à Direita */}
        <div className="flex items-center gap-5 text-xs text-[#6B665C] dark:text-[#B5B0A4]">
          <div className="flex items-baseline gap-1">
            <span>nota estimada:</span>
            <span className="font-serif text-sm font-semibold text-[#232019] dark:text-[#F1EEE7]">
              {notaEstimadaEnem.toFixed(1).replace(".", ",")}
            </span>
          </div>

          <span className="hidden sm:inline text-[#E5E1D8] dark:text-[#38352F]">·</span>

          <span className="hidden sm:inline">
            {profile.streakDias} dias seguidos
          </span>
        </div>
      </div>
    </header>
  );
}
