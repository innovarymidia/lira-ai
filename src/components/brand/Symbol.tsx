import React from "react";

export interface SymbolProps {
  size?: number | string;
  variant?: "light" | "dark" | "mono";
  className?: string;
  title?: string;
}

/**
 * Simbolo Oficial da Lira AI: Biosfera Conectada
 * Folha conectada com nos de dados + orbita circular sistemica
 */
export function Symbol({
  size = 32,
  variant = "light",
  className = "",
  title = "Simbolo Biosfera Conectada Lira AI"
}: SymbolProps) {
  // Cores por variante
  const isDark = variant === "dark";
  const isMono = variant === "mono";

  const orbitColor = isMono
    ? "currentColor"
    : isDark
    ? "#65D6AD"
    : "#123F35";

  const leafFill = isMono
    ? "currentColor"
    : isDark
    ? "#21845B"
    : "#21845B";

  const leafVein = isMono
    ? "currentColor"
    : isDark
    ? "#B8E0A5"
    : "#123F35";

  const nodeColorPrimary = isMono
    ? "currentColor"
    : isDark
    ? "#FFFFFF"
    : "#123F35";

  const nodeColorAi = isMono
    ? "currentColor"
    : isDark
    ? "#65D6AD"
    : "#65D6AD";

  const satelliteColor = isMono
    ? "currentColor"
    : isDark
    ? "#65D6AD"
    : "#21845B";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block flex-shrink-0 ${className}`}
      aria-label={title}
      role="img"
    >
      <title>{title}</title>

      {/* Orbita Planetaria / Sistemica (Biosfera Conectada) */}
      <ellipse
        cx="22"
        cy="22"
        rx="18.5"
        ry="8.5"
        transform="rotate(-28 22 22)"
        stroke={orbitColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="42 6 22 6"
        opacity={isMono ? 0.9 : 0.85}
      />

      {/* No de Satelite / Telemetria Planetaria na Orbita */}
      <circle
        cx="37.5"
        cy="13.5"
        r="1.8"
        fill={satelliteColor}
      />

      {/* Silhueta da Folha Conectada */}
      <path
        d="M 14 30 C 14 20, 22 11, 30 10 C 30 20, 24 30, 14 30 Z"
        fill={leafFill}
        fillOpacity={isMono ? 0.25 : 0.16}
        stroke={leafFill}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Nervura de Dados e Conexao Digital */}
      <path
        d="M 16 28 L 22.5 21.5 L 29 11.5"
        stroke={leafVein}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Ramificacao Secundaria de Rastreabilidade */}
      <path
        d="M 22.5 21.5 L 26 23"
        stroke={leafVein}
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Nos de Dados (IoT e Conformidade) */}
      <circle
        cx="16"
        cy="28"
        r="1.5"
        fill={nodeColorPrimary}
      />
      <circle
        cx="22.5"
        cy="21.5"
        r="1.7"
        fill={nodeColorPrimary}
      />
      <circle
        cx="26"
        cy="23"
        r="1.4"
        fill={nodeColorPrimary}
      />

      {/* No Principal de Inteligencia Artificial (Verde Digital) */}
      <circle
        cx="29"
        cy="11.5"
        r="2.2"
        fill={nodeColorAi}
      />
      <circle
        cx="29"
        cy="11.5"
        r="3.4"
        stroke={nodeColorAi}
        strokeWidth="0.8"
        strokeOpacity={0.6}
      />
    </svg>
  );
}

export default Symbol;
