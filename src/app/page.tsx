import Link from "next/link";
import {
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  Clock,
  Sparkles,
  Building2,
  CheckCircle2,
  ArrowRight,
  Lock,
  Layers,
  ChevronRight
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Barra de Navegacao Flutuante Oficial Lira AI */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Logo size="md" showSubtitle subtitleText="Gestão Ambiental Inteligente" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#core-compliance" className="text-sm font-semibold text-secondary hover:text-environmental transition-colors">
              Core Compliance
            </a>
            <a href="#ia-extract" className="text-sm font-semibold text-secondary hover:text-environmental transition-colors">
              LIRA Extract
            </a>
            <a href="#perfis" className="text-sm font-semibold text-secondary hover:text-environmental transition-colors">
              Soluções
            </a>
            <a href="#seguranca" className="text-sm font-semibold text-secondary hover:text-environmental transition-colors">
              Segurança e RLS
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-forest hover:bg-forest/5 transition-colors cursor-pointer"
            >
              Acessar Conta
            </Link>
            <Link
              href="/login"
              className="btn-primary text-sm shadow-sm"
            >
              Falar com Especialista
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>


      <main className="flex-1">
        {/* Hero Section: Enterprise Gateway */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-white to-background py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-environmental/20 bg-environmental/10 px-4 py-1.5 text-xs font-semibold text-forest">
                <Sparkles className="h-3.5 w-3.5 text-environmental" />
                <span>Release 1.0: Gestão Inteligente de Licenças e Condicionantes</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-forest sm:text-5xl lg:text-6xl">
                Conformidade ambiental com rigor legal e suporte de IA
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
                Elimine o risco de multas e interdições operacionais. Monitore prazos de renovação da Lei Complementar 140/2011, delegue tarefas com evidências e extraia condicionantes de licenças com revisão humana assistida.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="btn-primary w-full text-base sm:w-auto"
                >
                  Conhecer o Core Compliance
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <a
                  href="#demo"
                  className="btn-secondary w-full text-base sm:w-auto"
                >
                  Ver Demonstração de Telas
                </a>
              </div>


              {/* Selos de Confianca */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-compliance-success" />
                  <span>Isolamento Multi-Tenant com PostgreSQL RLS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-compliance-success" />
                  <span>Regra Automática de 120 Dias da LC 140/2011</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-compliance-success" />
                  <span>Auditoria Imutável e Integridade SHA-256</span>
                </div>
              </div>
            </div>

            {/* Preview do Painel de Conformidade */}
            <div id="demo" className="mt-16 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6 lg:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary">Painel Central de Conformidade</h2>
                  <p className="text-sm text-slate-500">Visão consolidada da Planta Fabril Paulínia e Unidade Camaçari</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <Building2 className="h-3.5 w-3.5 text-slate-500" />
                    Organização: Química Paulista S/A
                  </span>
                </div>
              </div>

              {/* Cartoes de Metricas com Semantica Visual */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Licenças Vigentes</span>
                    <FileCheck2 className="h-5 w-5 text-compliance-success" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-extrabold text-slate-900">18</span>
                    <span className="ml-2 text-xs font-medium text-emerald-700">100% regulares</span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Alerta de Renovação</span>
                    <Clock className="h-5 w-5 text-compliance-warning" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-extrabold text-slate-900">3</span>
                    <span className="ml-2 text-xs font-medium text-amber-700">Dentro dos 120 dias</span>
                  </div>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">Licenças Vencidas</span>
                    <AlertTriangle className="h-5 w-5 text-compliance-danger" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-extrabold text-slate-900">0</span>
                    <span className="ml-2 text-xs font-medium text-slate-500">Nenhuma irregular</span>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">Fila Quatro-Olhos</span>
                    <ShieldCheck className="h-5 w-5 text-compliance-ai" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-extrabold text-slate-900">5</span>
                    <span className="ml-2 text-xs font-medium text-blue-700">Aguardando homologação</span>
                  </div>
                </div>
              </div>

              {/* Tabela de Licencas Recentes */}
              <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Instrumento</th>
                      <th className="px-4 py-3">Número e Processo</th>
                      <th className="px-4 py-3">Órgão Emissor</th>
                      <th className="px-4 py-3">Vencimento</th>
                      <th className="px-4 py-3">Prazo LC 140/2011</th>
                      <th className="px-4 py-3">Situação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-primary">Licença de Operação (LO)</td>
                      <td className="px-4 py-3 text-slate-600">LO nº 4509/2023 (Proc. 02001.0034/20)</td>
                      <td className="px-4 py-3 text-slate-700">CETESB</td>
                      <td className="px-4 py-3 text-slate-700">14/11/2026</td>
                      <td className="px-4 py-3 font-medium text-amber-700">17/07/2026</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          Vigente
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-primary">Licença de Instalação (LI)</td>
                      <td className="px-4 py-3 text-slate-600">LI nº 8821/2024 (Proc. 19022.0011/22)</td>
                      <td className="px-4 py-3 text-slate-700">INEA</td>
                      <td className="px-4 py-3 text-slate-700">03/09/2026</td>
                      <td className="px-4 py-3 font-medium text-amber-700">06/05/2026</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                          Alerta Renovação
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-primary">Outorga de Captação Subterrânea</td>
                      <td className="px-4 py-3 text-slate-600">Portaria nº 1102/2022</td>
                      <td className="px-4 py-3 text-slate-700">DAEE</td>
                      <td className="px-4 py-3 text-slate-700">22/03/2027</td>
                      <td className="px-4 py-3 font-medium text-slate-600">22/11/2026</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          Vigente
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Secao de Recursos Nucleares */}
        <section id="core-compliance" className="border-t border-slate-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cta">Pilares do Core Compliance</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Projetado para auditabilidade rigorosa e segurança operacional
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="card-compliance">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-primary">
                  <Clock className="h-6 w-6 text-cta" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-primary">Controle Automático de 120 Dias</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Cálculo em nível de banco de dados do prazo fatal da Lei Complementar 140/2011. Alertas escalonados para responsáveis e diretores antes da perda da tempestividade.
                </p>
              </div>

              <div className="card-compliance">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-primary">
                  <ShieldCheck className="h-6 w-6 text-compliance-success" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-primary">Fluxo de Quatro-Olhos Obrigatório</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Nenhuma condicionante é concluída sem laudos comprobatórios e revisão técnica independente por auditor ou gestor qualificado, garantindo blindagem regulatória.
                </p>
              </div>

              <div className="card-compliance">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-primary">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-primary">Isolamento Multi-Tenant com RLS</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Proteção física e lógica de dados com PostgreSQL Row-Level Security. Garantia de que cada cliente e consultoria visualiza exclusivamente seus próprios registros.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Secao LIRA Extract com Split-Screen */}
        <section id="ia-extract" className="border-t border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Assistente LIRA Extract</span>
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  Extração assistida por IA com supervisão humana em tela dividida
                </h2>
                <p className="mt-4 text-base text-slate-600 leading-relaxed">
                  Faça o upload do arquivo PDF da licença emitida pelo órgão ambiental. O modelo de inteligência artificial identifica os artigos, número de protocolo, validades e decompõe cada exigência técnica em condicionantes acionáveis.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-compliance-success flex-shrink-0" />
                    <span>Conferência lado a lado com realce visual do parágrafo no documento original.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-compliance-success flex-shrink-0" />
                    <span>Nenhum registro é ativado sem homologação e validação explícita do analista.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-compliance-success flex-shrink-0" />
                    <span>Zero retenção de dados confidenciais para treinamento de modelos públicos.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Modo Split-Screen de Validação</span>
                  <span className="rounded bg-sky-100 px-2 py-0.5 text-xs font-medium text-cta">Grounding Ativo</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 text-xs">
                    <span className="font-semibold text-primary">Trecho detectado no PDF da Licença (Pág. 4):</span>
                    <p className="mt-1 font-mono text-slate-600 italic">
                      "O empreendedor deverá apresentar semestralmente à agência ambiental relatório com os laudos de amostragem dos efluentes tratados..."
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900">Condicionante Proposta pela IA:</span>
                      <span className="rounded bg-blue-200/80 px-1.5 py-0.5 font-semibold text-blue-800">Semestral</span>
                    </div>
                    <p className="mt-1 text-slate-700">
                      Monitoramento de Efluentes: Enviar laudos analíticos semestrais dos pontos de lançamento E-01 e E-02.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button className="rounded bg-cta px-2.5 py-1 text-xs font-semibold text-white shadow-xs hover:bg-cta-hover transition-colors">
                        Homologar Item
                      </button>
                      <button className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                        Ajustar Prazo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodape Corporativo Oficial Lira AI */}
      <footer className="border-t border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <Link href="/" className="flex items-center">
              <Logo size="sm" showSubtitle subtitleText="Gestão e Conformidade Ambiental" />
            </Link>
            <p className="text-xs text-muted">
              © 2026 Lira AI. Todos os direitos reservados. Conformidade ambiental inteligente com rigor legal.
            </p>
            <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
              <a href="#" className="hover:text-forest transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-forest transition-colors">Privacidade e LGPD</a>
              <a href="#" className="hover:text-forest transition-colors">Suporte Técnico</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

