import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lira AI: Gestão Ambiental Inteligente e Conformidade Legal",
  description: "Plataforma SaaS corporativa para governança ambiental, licenciamento, condicionantes e conformidade com inteligência artificial.",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-environmental selection:text-white">
        {children}
      </body>
    </html>
  );
}

