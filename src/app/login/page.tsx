"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Users,
  Briefcase
} from "lucide-react";

import { Logo } from "@/components/brand/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"enterprise" | "consultancy">("consultancy");
  const [email, setEmail] = useState("consultor@verdeambiental.com.br");
  const [password, setPassword] = useState("••••••••••••");
  const [selectedClient, setSelectedClient] = useState("org-1");
  const [isLoading, setIsLoading] = useState(false);

  const clients = [
    {
      id: "org-1",
      name: "Química Paulista S/A",
      units: "Unidade Paulínia e Camaçari",
      licensesCount: 18,
      status: "Contrato Ativo"
    },
    {
      id: "org-2",
      name: "Mineração Vale Verde",
      units: "Mina Serra Azul",
      licensesCount: 9,
      status: "Contrato Ativo"
    },
    {
      id: "org-3",
      name: "BioEnergia Brasil",
      units: "Usina Rio Claro",
      licensesCount: 12,
      status: "Contrato Ativo"
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Salva contexto da sessao simulada
      if (typeof window !== "undefined") {
        localStorage.setItem("lira_active_role", role);
        localStorage.setItem("lira_active_tenant", selectedClient);
      }
      router.push(`/dashboard?tenant=${selectedClient}`);
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link href="/">
            <Logo size="lg" showSubtitle subtitleText="Acesso Seguro Multi-Tenant" />
          </Link>
        </div>

        <h2 className="mt-6 text-center text-2xl font-extrabold tracking-tight text-forest">
          Acesse sua conta corporativa
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Gestão ambiental inteligente com isolamento de dados e conformidade legal
        </p>
      </div>


      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          {/* Alternancia de Perfil (Modelo Hibrido Aprovado em D-02) */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Tipo de Acesso
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1.5">
              <button
                type="button"
                onClick={() => {
                  setRole("consultancy");
                  setEmail("consultor@verdeambiental.com.br");
                }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                  role === "consultancy"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Consultoria</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("enterprise");
                  setEmail("gestor@quimicapaulista.com.br");
                }}
                className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all cursor-pointer ${
                  role === "enterprise"
                    ? "bg-white text-primary shadow-xs"
                    : "text-slate-600 hover:text-primary"
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Indústria Direta</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                E-mail Profissional
              </label>
              <div className="mt-1.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Senha
                </label>
                <a href="#" className="text-xs font-medium text-environmental hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <div className="mt-1.5">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                />
              </div>
            </div>

            {/* Seletor de Cliente Inicial para Consultorias (Tenant Switcher) */}
            {role === "consultancy" ? (
              <div className="rounded-xl border border-sprout/50 bg-sprout-light/60 p-3.5">
                <label className="block text-xs font-bold text-forest">
                  Selecione o Cliente Inicial (Carteira Ativa)
                </label>
                <div className="mt-2 space-y-2">
                  {clients.map((c) => (
                    <label
                      key={c.id}
                      className={`flex items-center justify-between rounded-lg border p-2.5 text-xs transition-colors cursor-pointer ${
                        selectedClient === c.id
                          ? "border-environmental bg-white text-forest shadow-xs ring-1 ring-environmental/30"
                          : "border-border bg-white/80 text-slate-600 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="client_selection"
                          checked={selectedClient === c.id}
                          onChange={() => setSelectedClient(c.id)}
                          className="h-3.5 w-3.5 text-environmental focus:ring-environmental"
                        />
                        <div>
                          <span className="font-semibold block">{c.name}</span>
                          <span className="text-muted text-[11px]">{c.units}</span>
                        </div>
                      </div>
                      <span className="rounded bg-sprout/20 px-2 py-0.5 text-[10px] font-semibold text-forest">
                        {c.licensesCount} licenças
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 text-sm font-semibold shadow-sm"
              >
                {isLoading ? (
                  <span>Autenticando no Tenant...</span>
                ) : (
                  <>
                    <span>Entrar na Plataforma</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <span className="text-xs text-slate-500">
              Conexão protegida por criptografia de ponta a ponta e PostgreSQL RLS.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
