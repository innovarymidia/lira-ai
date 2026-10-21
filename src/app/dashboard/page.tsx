"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Clock,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Plus,
  FileText,
  Calendar,
  X,
  Send,
  Eye,
  Check
} from "lucide-react";

interface LicenseItem {
  id: string;
  type: string;
  number: string;
  processNumber: string;
  agency: string;
  unit: string;
  expirationDate: string;
  renewalDeadline: string;
  status: "Vigente" | "Alerta Renovação" | "Em Renovação" | "Vencida";
  protocolNumber?: string;
  protocolDate?: string;
}

interface ConditionItem {
  id: string;
  itemNumber: string;
  licenseNumber: string;
  description: string;
  periodicity: string;
  deadline: string;
  status: "Aguardando Revisão" | "Pendente" | "Atendida" | "Em Atraso";
  evidenceAttached: boolean;
  evidenceName: string;
}

export default function DashboardPage() {
  // Estado de Tenant Switcher (Modelo Hibrido Aprovado em D-02)
  const [activeTenant, setActiveTenant] = useState("org-1");
  const [activeTab, setActiveTab] = useState<"licenses" | "conditions" | "tasks" | "extract">("licenses");
  const [agencyFilter, setAgencyFilter] = useState("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal de Registro de Protocolo (LC 140/2011)
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [selectedLicenseForProtocol, setSelectedLicenseForProtocol] = useState<LicenseItem | null>(null);
  const [protocolNumberInput, setProtocolNumberInput] = useState("");
  const [protocolDateInput, setProtocolDateInput] = useState("");
  const [protocolNotes, setProtocolNotes] = useState("");
  const [protocolSuccessMessage, setProtocolSuccessMessage] = useState("");

  // Estado de Condicionantes para Homologacao Quatro-Olhos
  const [homologatedSuccess, setHomologatedSuccess] = useState<string | null>(null);

  const tenantOptions = [
    { id: "org-1", name: "Química Paulista S/A", units: "Unidade Paulínia e Camaçari" },
    { id: "org-2", name: "Mineração Vale Verde", units: "Mina Serra Azul" },
    { id: "org-3", name: "BioEnergia Brasil", units: "Usina Rio Claro" }
  ];

  const [licenses, setLicenses] = useState<LicenseItem[]>([
    {
      id: "lic-1",
      type: "Licença de Operação (LO)",
      number: "LO nº 4509/2023",
      processNumber: "Proc. 02001.0034/20",
      agency: "CETESB",
      unit: "Planta Paulínia",
      expirationDate: "2026-11-14",
      renewalDeadline: "2026-07-17",
      status: "Vigente"
    },
    {
      id: "lic-2",
      type: "Licença de Instalação (LI)",
      number: "LI nº 8821/2024",
      processNumber: "Proc. 19022.0011/22",
      agency: "INEA",
      unit: "Unidade Camaçari",
      expirationDate: "2026-09-03",
      renewalDeadline: "2026-05-06",
      status: "Alerta Renovação"
    },
    {
      id: "lic-3",
      type: "Outorga de Captação Subterrânea",
      number: "Portaria DAEE nº 1102/2022",
      processNumber: "Proc. 0441/22",
      agency: "DAEE",
      unit: "Planta Paulínia",
      expirationDate: "2027-03-22",
      renewalDeadline: "2026-11-22",
      status: "Vigente"
    },
    {
      id: "lic-4",
      type: "Autorização Ambiental Unificada (AAU)",
      number: "AAU nº 309/2024",
      processNumber: "Proc. IBAMA 02001.998/23",
      agency: "IBAMA",
      unit: "Unidade Camaçari",
      expirationDate: "2026-08-15",
      renewalDeadline: "2026-04-16",
      status: "Alerta Renovação"
    }
  ]);

  const [conditions, setConditions] = useState<ConditionItem[]>([
    {
      id: "cond-1",
      itemNumber: "Condicionante 2.1",
      licenseNumber: "LO nº 4509/2023",
      description: "Apresentar laudos analíticos semestrais da eficiência da Estação de Tratamento de Efluentes (ETE).",
      periodicity: "Semestral",
      deadline: "2026-11-30",
      status: "Aguardando Revisão",
      evidenceAttached: true,
      evidenceName: "Laudo_Laboratorial_ETE_2026_Q3.pdf (Hash SHA-256 verificado)"
    },
    {
      id: "cond-2",
      itemNumber: "Condicionante 3.4",
      licenseNumber: "LI nº 8821/2024",
      description: "Executar o Plano de Controle Ambiental de Ruídos e Emissões Atmosféricas durante a fase de obras.",
      periodicity: "Trimestral",
      deadline: "2026-10-15",
      status: "Aguardando Revisão",
      evidenceAttached: true,
      evidenceName: "Relatorio_Monitoramento_Ruido_Acustica.pdf"
    },
    {
      id: "cond-3",
      itemNumber: "Condicionante 4.2",
      licenseNumber: "Portaria DAEE nº 1102/2022",
      description: "Instalar e calibrar hidrômetro com envio mensal de leituras volumétricas de vazão outorgada.",
      periodicity: "Mensal",
      deadline: "2026-10-31",
      status: "Pendente",
      evidenceAttached: false,
      evidenceName: "Nenhuma evidência anexada"
    }
  ]);

  const currentTenantObj = tenantOptions.find((t) => t.id === activeTenant) || tenantOptions[0];

  // Abertura do Modal de Protocolo
  const handleOpenProtocolModal = (lic: LicenseItem) => {
    setSelectedLicenseForProtocol(lic);
    setProtocolNumberInput("");
    setProtocolDateInput(new Date().toISOString().split("T")[0]);
    setProtocolNotes("");
    setIsProtocolModalOpen(true);
  };

  // Submissao do Protocolo de Renovacao Tempestiva (LC 140/2011)
  const handleSaveProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicenseForProtocol) return;

    setLicenses((prev) =>
      prev.map((l) =>
        l.id === selectedLicenseForProtocol.id
          ? {
              ...l,
              status: "Em Renovação",
              protocolNumber: protocolNumberInput,
              protocolDate: protocolDateInput
            }
          : l
      )
    );

    setIsProtocolModalOpen(false);
    setProtocolSuccessMessage(
      `Protocolo nº ${protocolNumberInput} registrado com sucesso para a ${selectedLicenseForProtocol.number}. Validade prorrogada legalmente nos termos da LC 140/2011.`
    );

    setTimeout(() => {
      setProtocolSuccessMessage("");
    }, 6000);
  };

  // Homologacao Quatro-Olhos de Condicionante (RB-006)
  const handleApproveCondition = (condId: string, itemNum: string) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === condId ? { ...c, status: "Atendida" } : c))
    );
    setHomologatedSuccess(`Aprovação técnica concluída para a ${itemNum}. Registro auditado com sucesso.`);
    setTimeout(() => setHomologatedSuccess(null), 5000);
  };

  // Filtragem de Licencas
  const filteredLicenses = licenses.filter((l) => {
    const matchesAgency = agencyFilter === "TODOS" || l.agency === agencyFilter;
    const matchesSearch =
      l.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.unit.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAgency ? matchesSearch : false;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Barra Superior com Tenant Switcher Dinamico */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-primary">LIRA AI</span>
            </Link>

            {/* Tenant Switcher (Modelo Hibrido Aprovado em D-02) */}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente Ativo:</span>
              <div className="relative">
                <select
                  value={activeTenant}
                  onChange={(e) => setActiveTenant(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-8 text-xs font-bold text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  {tenantOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="font-semibold text-slate-700">João Silva</span>
              <span className="rounded bg-sky-100 px-1.5 py-0.5 font-bold text-sky-800 text-[10px]">
                Consultor Líder
              </span>
            </div>

            <Link
              href="/login"
              title="Sair"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Conteudo Principal do Dashboard */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 w-full">
        {/* Banner de Boas-vindas e Contexto */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
              Painel de Gestão e Conformidade Ambiental
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Operando sob o escopo de: <strong className="text-primary">{currentTenantObj.name}</strong> ({currentTenantObj.units})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("extract")}
              className="btn-primary text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Importar com LIRA Extract (IA)</span>
            </button>
          </div>
        </div>

        {/* Mensagens de Sucesso em Destaque */}
        {protocolSuccessMessage ? (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span>{protocolSuccessMessage}</span>
            </div>
            <button
              onClick={() => setProtocolSuccessMessage("")}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          ) : null}

        {homologatedSuccess ? (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span>{homologatedSuccess}</span>
            </div>
            <button
              onClick={() => setHomologatedSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          ) : null}

        {/* Cartoes de Metricas de Conformidade com Semantica Visual WCAG AAA */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Licenças Vigentes</span>
              <FileCheck2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {licenses.filter((l) => l.status === "Vigente").length}
              </span>
              <span className="text-xs font-semibold text-emerald-700">Operação Regular</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Alerta 120 Dias (LC 140)</span>
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {licenses.filter((l) => l.status === "Alerta Renovação").length}
              </span>
              <span className="text-xs font-semibold text-amber-700">Ação Tempestiva Exigida</span>
            </div>
          </div>

          <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-900">Em Renovação</span>
              <FileText className="h-5 w-5 text-sky-700" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {licenses.filter((l) => l.status === "Em Renovação").length}
              </span>
              <span className="text-xs font-semibold text-sky-700">Protocolo Ativo</span>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Fila Quatro-Olhos</span>
              <ShieldCheck className="h-5 w-5 text-blue-700" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {conditions.filter((c) => c.status === "Aguardando Revisão").length}
              </span>
              <span className="text-xs font-semibold text-blue-700">Homologação Técnica</span>
            </div>
          </div>
        </div>

        {/* Navegacao de Abas do Core Compliance */}
        <div className="mb-6 border-b border-slate-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("licenses")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
                activeTab === "licenses"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Licenças Ambientais ({licenses.length})
            </button>
            <button
              onClick={() => setActiveTab("conditions")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 ${
                activeTab === "conditions"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Condicionantes e Homologação ({conditions.length})
            </button>
            <button
              onClick={() => setActiveTab("extract")}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === "extract"
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="h-4 w-4 text-cta" />
              <span>LIRA Extract (Assistente IA)</span>
            </button>
          </nav>
        </div>

        {/* Aba 1: Licencas Ambientais */}
        {activeTab === "licenses" ? (
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
            {/* Barra de Filtros e Busca */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, processo ou unidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-600">Órgão:</span>
                  <select
                    value={agencyFilter}
                    onChange={(e) => setAgencyFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 py-1.5 pl-2.5 pr-7 text-xs font-medium text-slate-700 focus:border-primary focus:outline-none"
                  >
                    <option value="TODOS">Todos os Órgãos</option>
                    <option value="CETESB">CETESB</option>
                    <option value="INEA">INEA</option>
                    <option value="IBAMA">IBAMA</option>
                    <option value="DAEE">DAEE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tabela de Licencas */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Instrumento</th>
                    <th className="px-4 py-3">Número e Processo</th>
                    <th className="px-4 py-3">Órgão</th>
                    <th className="px-4 py-3">Unidade</th>
                    <th className="px-4 py-3">Vencimento</th>
                    <th className="px-4 py-3">Prazo 120 Dias (LC 140)</th>
                    <th className="px-4 py-3">Situação</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredLicenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-primary">{lic.type}</td>
                      <td className="px-4 py-3.5 text-slate-600">
                        <div>{lic.number}</div>
                        <div className="text-[11px] text-slate-400">{lic.processNumber}</div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-700">{lic.agency}</td>
                      <td className="px-4 py-3.5 text-slate-600">{lic.unit}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {new Date(lic.expirationDate).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-amber-700">
                        {new Date(lic.renewalDeadline).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-4 py-3.5">
                        {lic.status === "Vigente" ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                            Vigente
                          </span>
                        ) : null}
                        {lic.status === "Alerta Renovação" ? (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                            Alerta 120 Dias
                          </span>
                        ) : null}
                        {lic.status === "Em Renovação" ? (
                          <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-800 border border-sky-200">
                            Em Renovação (Prot. {lic.protocolNumber})
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {lic.status === "Alerta Renovação" ? (
                          <button
                            onClick={() => handleOpenProtocolModal(lic)}
                            className="btn-primary py-1 px-2.5 text-xs font-semibold"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span>Registrar Protocolo</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Licença: ${lic.number}\nÓrgão: ${lic.agency}\nUnidade: ${lic.unit}\nStatus: ${lic.status}`)}
                            className="rounded border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            Ver Detalhes
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* Aba 2: Condicionantes e Homologacao Quatro-Olhos (RB-006) */}
        {activeTab === "conditions" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4 text-xs text-sky-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-cta flex-shrink-0" />
                <span>
                  <strong>Regra de Quatro-Olhos Ativa:</strong> Nenhuma condicionante pode transitar para "Atendida" sem evidência comprovada e homologação técnica independente.
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <h2 className="text-base font-bold text-primary mb-4">Condicionantes em Fila de Homologação</h2>
              <div className="space-y-4">
                {conditions.map((cond) => (
                  <div
                    key={cond.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-primary">{cond.itemNumber}</span>
                        <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {cond.licenseNumber}
                        </span>
                        <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                          {cond.periodicity}
                        </span>
                        {cond.status === "Aguardando Revisão" ? (
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-200">
                            Aguardando Revisão
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            Atendida
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{cond.description}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Prazo Fatal: {new Date(cond.deadline).toLocaleDateString("pt-BR")}</span>
                        <span className="mx-1">•</span>
                        <span className="font-semibold text-slate-700">Evidência: {cond.evidenceName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 md:pt-0">
                      {cond.status === "Aguardando Revisão" ? (
                        <>
                          <button
                            onClick={() => handleApproveCondition(cond.id, cond.itemNumber)}
                            className="btn-primary py-1.5 px-3 text-xs font-semibold"
                          >
                            <Check className="h-4 w-4" />
                            <span>Homologar Atendimento</span>
                          </button>
                          <button
                            onClick={() => alert(`Devolvendo ${cond.itemNumber} para ajuste com justificativa técnica registrada no log de auditoria.`)}
                            className="btn-secondary py-1.5 px-3 text-xs font-semibold"
                          >
                            <span>Devolver para Ajuste</span>
                          </button>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Homologada com Parecer Técnico</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Aba 3: LIRA Extract (Assistente IA em Split-Screen) */}
        {activeTab === "extract" ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Modo Split-Screen de Grounding</span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-primary">
                  Conferência Assistida por IA: Licença de Operação CETESB nº 4509/2023
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Documento Oficial Carregado (4 páginas analisadas)
              </span>
            </div>

            {/* Grid Split-Screen */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Painel Esquerdo: Visualizador de PDF com Realce */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <span className="text-xs font-bold text-slate-700 uppercase">Documento Original (Página 3 de 4)</span>
                  <span className="text-xs text-slate-500">Hash SHA-256 Validado</span>
                </div>
                <div className="space-y-4 font-mono text-xs leading-relaxed text-slate-700 bg-white p-4 rounded-lg border border-slate-200 h-96 overflow-y-auto">
                  <p className="text-slate-400">...</p>
                  <p className="text-slate-500">
                    Artigo 4º: O empreendedor fica autorizado a operar a unidade industrial nos estritos termos do processo administrativo nº 02001.0034/20.
                  </p>
                  <div className="rounded border border-amber-300 bg-amber-50 p-2.5 text-slate-900 font-semibold shadow-xs">
                    <span className="text-[10px] font-bold uppercase text-amber-800 block mb-1">
                      [Trecho Identificado pela IA]:
                    </span>
                    "Item 2.1: Deverão ser apresentados semestralmente à Diretoria Regional da CETESB os laudos de análise química dos efluentes industriais tratados lançados na bacia receptora..."
                  </div>
                  <p className="text-slate-500">
                    Artigo 5º: A inobservância de qualquer das disposições desta licença sujeitará o infrator às sanções e penalidades cabíveis previstas na Lei nº 9.605/1998...
                  </p>
                </div>
              </div>

              {/* Painel Direito: Sugestoes Estruturadas para Homologacao */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-blue-200 pb-2 mb-3">
                    <span className="text-xs font-bold text-blue-900 uppercase">Condicionante Extraída pela IA</span>
                    <span className="rounded bg-sky-200 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                      Confiança: 98%
                    </span>
                  </div>

                  <div className="rounded-lg border border-white bg-white p-4 shadow-xs space-y-3">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase">Identificador:</span>
                      <p className="text-sm font-extrabold text-primary">Condicionante 2.1</p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase">Texto Estruturado:</span>
                      <p className="text-xs text-slate-700 mt-0.5">
                        Apresentar laudos analíticos semestrais da eficiência da Estação de Tratamento de Efluentes (ETE) com amostragem dos pontos de lançamento.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Periodicidade:</span>
                        <p className="text-xs font-semibold text-primary">Semestral</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase">Primeiro Prazo:</span>
                        <p className="text-xs font-semibold text-primary">30/11/2026</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Ação requerida: Homologar para persistir no banco oficial.
                  </span>
                  <button
                    onClick={() => {
                      alert("Condicionante 2.1 homologada e registrada com sucesso no banco de dados.");
                    }}
                    className="btn-primary text-xs font-semibold"
                  >
                    <Check className="h-4 w-4" />
                    <span>Confirmar e Salvar no Sistema</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Modal Interativo: Registro de Protocolo de Renovacao Tempestiva (LC 140/2011) */}
      {selectedLicenseForProtocol ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-primary">Registrar Protocolo de Renovação</h3>
                <p className="text-xs text-slate-500">
                  {selectedLicenseForProtocol.type}: {selectedLicenseForProtocol.number}
                </p>
              </div>
              <button
                onClick={() => setSelectedLicenseForProtocol(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProtocol} className="mt-4 space-y-4">
              <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                <strong>Base Legal:</strong> O protocolo tempestivo protocolado com antecedência mínima de 120 dias do vencimento prorroga automaticamente a vigência até manifestação do órgão ambiental (LC 140/2011, art. 14, § 4º).
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Número Oficial do Protocolo do Órgão Ambiental
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: PROTOCOLO-CETESB-2026-99014"
                  value={protocolNumberInput}
                  onChange={(e) => setProtocolNumberInput(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Data Efetiva de Protocolo
                </label>
                <input
                  type="date"
                  required
                  value={protocolDateInput}
                  onChange={(e) => setProtocolDateInput(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Comprovante Digital (PDF do Recibo do Órgão)
                </label>
                <div className="mt-1 flex justify-center rounded-lg border border-dashed border-slate-300 px-4 py-4 text-center hover:bg-slate-50 cursor-pointer">
                  <div className="text-xs text-slate-600">
                    <FileText className="mx-auto h-6 w-6 text-slate-400 mb-1" />
                    <span>Clique para anexar o recibo oficial de protocolo</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLicenseForProtocol(null)}
                  className="btn-secondary py-2 px-4 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Registrar e Prorrogar Licença</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
