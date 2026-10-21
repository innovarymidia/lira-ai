import React from "react";
import { Symbol } from "./Symbol";

export interface LogoProps {
  variant?: "light" | "dark" | "mono";
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
}

/**
 * Logo Oficial Horizontal da Lira AI
 * Composicao com o simbolo da Biosfera Conectada a esquerda e tipografia Lira AI a direita.
 */
export function Logo({
  variant = "light",
  size = "md",
  showSubtitle = false,
  subtitleText = "Gestão Ambiental Inteligente",
  className = ""
}: LogoProps) {
  const isDark = variant === "dark";
  const isMono = variant === "mono";

  // Mapeamento de dimensoes
  const symbolSizes = {
    sm: 26,
    md: 34,
    lg: 44
  };

  const liraTextSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };

  const aiTextSizes = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-0.5"
  };

  const textColorLira = isMono
    ? "text-current"
    : isDark
    ? "text-white"
    : "text-forest";

  const aiBadgeClasses = isMono
    ? "border border-current text-current font-bold"
    : isDark
    ? "bg-digital/20 text-digital border border-digital/40 font-bold"
    : "bg-environmental/10 text-environmental border border-environmental/20 font-bold";

  const subtitleColor = isMono
    ? "text-current opacity-80"
    : isDark
    ? "text-slate-300"
    : "text-slate-500";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <Symbol
        size={symbolSizes[size]}
        variant={variant}
        title="Biosfera Conectada Lira AI"
      />

      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight ${liraTextSizes[size]} ${textColorLira}`}
            style={{ letterSpacing: "-0.03em" }}
          >
            Lira
          </span>
          <span
            className={`rounded tracking-wider uppercase font-semibold ${aiTextSizes[size]} ${aiBadgeClasses}`}
          >
            AI
          </span>
        </div>

        {showSubtitle ? (
          <span
            className={`mt-1 text-[10px] uppercase font-semibold tracking-wider ${subtitleColor}`}
          >
            {subtitleText}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default Logo;
