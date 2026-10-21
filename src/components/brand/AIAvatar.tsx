import React from "react";
import { Symbol } from "./Symbol";

export interface AIAvatarProps {
  size?: number;
  isProcessing?: boolean;
  className?: string;
}

/**
 * Avatar Oficial da Camada de Inteligencia Artificial da Lira AI
 * Utiliza o simbolo Biosfera Conectada com anel discreto em Verde Digital (#65D6AD)
 */
export function AIAvatar({
  size = 32,
  isProcessing = false,
  className = ""
}: AIAvatarProps) {
  const symbolSize = Math.round(size * 0.75);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl bg-forest border border-digital/30 text-white shadow-xs ${className}`}
      style={{ width: size, height: size }}
      title={isProcessing ? "Lira AI processando analise..." : "Lira AI Assistente Ambiental"}
    >
      <Symbol size={symbolSize} variant="dark" />

      {/* Indicador de Processamento Tecnologico Discreto */}
      {isProcessing ? (
        <span
          className="absolute -top-1 -right-1 flex h-2.5 w-2.5"
          aria-hidden="true"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-digital opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-digital" />
        </span>
      ) : null}
    </div>
  );
}

export default AIAvatar;
