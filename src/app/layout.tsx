import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIRA AI: Gestão e Conformidade Ambiental",
  description: "Plataforma SaaS para governança ambiental, licenciamento, condicionantes e conformidade legal.",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-cta selection:text-white">
        {children}
      </body>
    </html>
  );
}
