"use client";

import { useState, useEffect } from "react";
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
  LogOut,
  Plus,
  FileText,
  Calendar,
  X,
  Send,
  Check,
  Truck,
  ClipboardCheck,
  Award,
  ListTodo,
  Layers,
  History,
  FolderOpen,
  BookOpen,
  AlertOctagon,
  Calendar as CalendarIcon
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Symbol } from "@/components/brand/Symbol";
import { AIAvatar } from "@/components/brand/AIAvatar";
import { LegislationTab } from "@/components/modules/LegislationTab";
import { RiskMatrixTab } from "@/components/modules/RiskMatrixTab";
import { NonConformitiesTab } from "@/components/modules/NonConformitiesTab";
import { CalendarTab } from "@/components/modules/CalendarTab";
import { GlobalSearchModal } from "@/components/modules/GlobalSearchModal";

export default function DashboardPage() {

  const [activeTenant, setActiveTenant] = useState("org-1");
  const [userName, setUserName] = useState("João Silva (Consultor Líder)");
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "licenses"
    | "conditions"
    | "tasks"
    | "documents"
    | "waste"
    | "inspections"
    | "audits"
    | "legislation"
    | "risks"
    | "nonconformities"
    | "calendar"
    | "extract"
    | "org"
    | "logs"
  >("overview");

  const [isLoading, setIsLoading] = useState(true);
  const [systemData, setSystemData] = useState<any>(null);
  const [agencyFilter, setAgencyFilter] = useState("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Modais de Criação
  const [isNewLicenseModalOpen, setIsNewLicenseModalOpen] = useState(false);
  const [isNewConditionModalOpen, setIsNewConditionModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewWasteModalOpen, setIsNewWasteModalOpen] = useState(false);
  const [isNewInspectionModalOpen, setIsNewInspectionModalOpen] = useState(false);
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const [isNewOrgModalOpen, setIsNewOrgModalOpen] = useState(false);
  const [isNewUnitModalOpen, setIsNewUnitModalOpen] = useState(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [selectedLicenseForProtocol, setSelectedLicenseForProtocol] = useState<any>(null);

  // Formularios de entrada
  const [formLicense, setFormLicense] = useState({
    unit_id: "",
    license_type: "LO",
    number: "",
    process_number: "",
    issuer_agency: "CETESB",
    description: "",
    issue_date: new Date().toISOString().split("T")[0],
    expiration_date: "2027-12-31"
  });

  const [formCondition, setFormCondition] = useState({
    license_id: "",
    item_number: "",
    description: "",
    compliance_criteria: "",
    periodicity: "SEMIANNUAL",
    deadline: "2026-12-31",
    evidence_name: ""
  });

  const [formTask, setFormTask] = useState({
    condition_id: "",
    title: "",
    description: "",
    priority: "MEDIUM",
    assigned_to_name: "Equipe de Operações",
    due_date: "2026-11-30"
  });

  const [formWaste, setFormWaste] = useState({
    unit_id: "",
    waste_code: "",
    description: "",
    classification: "Classe I Perigoso",
    quantity: "1.0",
    unit_of_measure: "toneladas",
    transporter_name: "",
    destination_company: "",
    destination_type: "Coprocessamento",
    mtr_number: "",
    cdf_number: ""
  });

  const [formInspection, setFormInspection] = useState({
    unit_id: "",
    title: "",
    score_percentage: "90",
    total_items: "10",
    conformities_count: "9",
    deviations_count: "1",
    observations: ""
  });

  const [formAudit, setFormAudit] = useState({
    unit_id: "",
    scope: "",
    standard: "ISO 14001",
    lead_auditor: "Auditor Líder Qualificado",
    conformities: "20",
    opportunities_for_improvement: "2",
    minor_non_conformities: "1",
    major_non_conformities: "0"
  });

  const [formOrg, setFormOrg] = useState({
    legal_name: "",
    trade_name: "",
    national_id: "",
    type: "ENTERPRISE"
  });

  const [formUnit, setFormUnit] = useState({
    name: "",
    unit_type: "INDUSTRIAL_PLANT",
    national_id: "",
    state: "SP",
    city: "",
    hydrographic_basin: ""
  });

  const [protocolForm, setProtocolForm] = useState({
    protocol_number: "",
    protocol_date: new Date().toISOString().split("T")[0]
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Carrega dados da API persistente
  const loadData = async (tenantId = activeTenant) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/data?tenant_id=${tenantId}`);
      const data = await res.json();
      setSystemData(data);
      if ((data.units?.length ?? 0) > 0) {
        setFormLicense((prev) => ({ ...prev, unit_id: data.units[0].id }));
        setFormWaste((prev) => ({ ...prev, unit_id: data.units[0].id }));
        setFormInspection((prev) => ({ ...prev, unit_id: data.units[0].id }));
        setFormAudit((prev) => ({ ...prev, unit_id: data.units[0].id }));
      }
      if ((data.licenses?.length ?? 0) > 0) {
        setFormCondition((prev) => ({ ...prev, license_id: data.licenses[0].id }));
      }
    } catch (e) {
      console.error(e);
      showToast("Erro ao carregar dados do banco.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeTenant);
  }, [activeTenant]);

  // Acoes genericas de envio para API
  const sendAction = async (action: string, payload: any) => {
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          tenant_id: activeTenant,
          user_name: userName,
          payload
        })
      });
      const result = await res.json();
      if (result.error) {
        showToast(result.error);
        return false;
      }
      await loadData(activeTenant);
      return true;
    } catch (e: any) {
      showToast(e.message || "Erro ao processar ação.");
      return false;
    }
  };

  // Submissoes individuais
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendAction("CREATE_ORGANIZATION", formOrg);
    if (ok) {
      setIsNewOrgModalOpen(false);
      showToast(`Organização ${formOrg.trade_name} criada e persistida com sucesso.`);
      setFormOrg({ legal_name: "", trade_name: "", national_id: "", type: "ENTERPRISE" });
    }
  };

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendAction("CREATE_UNIT", formUnit);
    if (ok) {
      setIsNewUnitModalOpen(false);
      showToast(`Unidade ${formUnit.name} adicionada à organização ativa.`);
      setFormUnit({ name: "", unit_type: "INDUSTRIAL_PLANT", national_id: "", state: "SP", city: "", hydrographic_basin: "" });
    }
  };

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendAction("CREATE_LICENSE", formLicense);
    if (ok) {
      setIsNewLicenseModalOpen(false);
      showToast(`Licença ${formLicense.number} cadastrada. Prazo de 120 dias da LC 140/2011 calculado automaticamente.`);
    }
  };

  const handleSaveProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLicenseForProtocol) return;
    const ok = await sendAction("RECORD_PROTOCOL", {
      license_id: selectedLicenseForProtocol.id,
      protocol_number: protocolForm.protocol_number,
      protocol_date: protocolForm.protocol_date
    });
    if (ok) {
      setSelectedLicenseForProtocol(null);
      showToast(`Protocolo formal nº ${protocolForm.protocol_number} registrado. Vigência prorrogada por lei.`);
    }
  };

  const handleCreateCondition = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendAction("CREATE_CONDITION", formCondition);
    if (ok) {
      setIsNewConditionModalOpen(false);
      showToast(`Condicionante ${formCondition.item_number} registrada no sistema.`);
    }
  };

  const handleApproveCondition = async (condId: string, itemNumber: string) => {
    const ok = await sendAction("APPROVE_CONDITION", {
      condition_id: condId,
      notes: "Homologado formalmente com laudo e evidência comprobatória verificada perante os padrões da agência ambiental."
    });
    if (ok) {
      showToast(`Homologação quatro-olhos concluída com parecer técnico para a ${itemNumber}.`);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendAction("CREATE_TASK", formTask);
    if (ok) {
      setIsNewTaskModalOpen(false);
      showToast(`Tarefa operacional "${formTask.title}" criada.`);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    const ok = await sendAction("UPDATE_TASK_STATUS", { task_id: taskId, status });
    if (ok) {
      showToast(`Status da tarefa alterado para ${status}.`);
    }
  };

  const handleCreateWaste = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendAction("CREATE_WASTE_RECORD", formWaste);
    if (ok) {
      setIsNewWasteModalOpen(false);
      showToast(`Expedição de resíduo MTR ${formWaste.mtr_number} registrada.`);
    }
  };

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendAction("CREATE_INSPECTION", formInspection);
    if (ok) {
      setIsNewInspectionModalOpen(false);
      showToast(`Inspeção de campo "${formInspection.title}" registrada.`);
    }
  };

  const handleCreateAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await sendAction("CREATE_AUDIT", formAudit);
    if (ok) {
      setIsNewAuditModalOpen(false);
      showToast(`Auditoria ${formAudit.standard} registrada com relatório.`);
    }
  };

  const handleEvaluateRequirement = async (
    reqId: string,
    applicability: any,
    complianceStatus: any,
    justification: string
  ) => {
    const ok = await sendAction("EVALUATE_REQUIREMENT", {
      requirement_id: reqId,
      applicability,
      compliance_status: complianceStatus,
      justification
    });
    if (ok) {
      showToast("Avaliação de conformidade salva com justificativa para auditoria.");
    }
  };

  const handleCreateLegislation = async (data: any) => {
    const ok = await sendAction("CREATE_LEGISLATION", data);
    if (ok) {
      showToast(`Norma ${data.number} cadastrada no acervo.`);
    }
  };

  const handleCreateRequirement = async (data: any) => {
    const ok = await sendAction("CREATE_LEGAL_REQUIREMENT", data);
    if (ok) {
      showToast(`Requisito legal ${data.code} vinculado com sucesso.`);
    }
  };

  const handleCreateRisk = async (data: any) => {
    const ok = await sendAction("CREATE_RISK", data);
    if (ok) {
      showToast(`Risco "${data.category}" registrado na matriz 5x5.`);
    }
  };

  const handleCreateNC = async (data: any) => {
    const ok = await sendAction("CREATE_NONCONFORMITY", data);
    if (ok) {
      showToast(`Não Conformidade ${data.code || "registrada"} salva com sucesso.`);
    }
  };

  const handleCreateActionPlanDirect = async (data: any) => {
    const ok = await sendAction("CREATE_ACTION_PLAN", data);
    if (ok) {
      showToast(`Plano de Ação 5W2H "${data.title}" homologado.`);
    }
  };

  // Se os dados estao carregando
  if (isLoading || !systemData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-primary">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cta border-r-transparent"></div>
          <p className="mt-3 text-sm font-semibold text-slate-600">Carregando dados da plataforma LIRA AI...</p>
        </div>
      </div>
    );
  }

  const {
    organization,
    allOrganizations = [],
    units = [],
    licenses = [],
    conditions = [],
    tasks = [],
    documents = [],
    wasteRecords = [],
    inspections = [],
    audits = [],
    actionPlans = [],
    legislations = [],
    legalRequirements = [],
    risks = [],
    nonconformities = [],
    auditLogs = []
  } = systemData;

  // Filtragem de Licencas
  const filteredLicenses = licenses.filter((l: any) => {
    const matchesAgency = agencyFilter === "TODOS" ? true : l.issuer_agency === agencyFilter;
    const matchesSearch =
      l.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.process_number.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesAgency ? matchesSearch : false;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top Header Institucional Lira AI */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Logo size="sm" showSubtitle subtitleText="Gestão Ambiental Inteligente" />
            </Link>

            {/* Tenant Switcher Interativo com Dados Reais */}
            <div className="hidden sm:flex items-center gap-2 border-l border-border pl-6">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Organização:</span>
              <select
                value={activeTenant}
                onChange={(e) => setActiveTenant(e.target.value)}
                className="rounded-lg border border-border bg-background py-1.5 pl-3 pr-8 text-xs font-bold text-forest focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 cursor-pointer"
              >
                {allOrganizations.map((o: any) => (
                  <option key={o.id} value={o.id}>
                    {o.trade_name} ({o.type})
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsNewOrgModalOpen(true)}
                title="Cadastrar Nova Empresa ou Cliente"
                className="rounded-md border border-border bg-white p-1.5 text-muted hover:text-environmental hover:border-environmental cursor-pointer transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Botao de Busca Global (Cmd+K) */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-border bg-slate-50/80 px-3 py-1.5 text-xs text-muted hover:border-cta hover:text-primary transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden md:inline font-medium">Buscar no LIRA AI...</span>
              <kbd className="hidden md:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">
                ⌘K
              </kbd>
            </button>

            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs">
              <div className="h-2 w-2 rounded-full bg-environmental"></div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                title="Clique para alterar o nome do operador de teste"
                className="bg-transparent font-semibold text-forest border-none outline-none focus:ring-1 focus:ring-forest text-xs w-48"
              />
            </div>

            <Link
              href="/login"
              title="Trocar de Conta"
              className="rounded-lg p-2 text-muted hover:bg-forest/5 hover:text-forest transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Navegacao de Modulos Completa Lira AI */}
      <div className="bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "overview" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Visão Geral</span>
            </button>
            <button
              onClick={() => setActiveTab("org")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "org" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Organizações e Unidades ({units.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("licenses")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "licenses" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              <span>Licenças ({licenses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("conditions")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "conditions" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Condicionantes ({conditions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "tasks" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <ListTodo className="h-3.5 w-3.5" />
              <span>Tarefas ({tasks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("waste")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "waste" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Resíduos e MTR ({wasteRecords.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("inspections")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "inspections" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <ClipboardCheck className="h-3.5 w-3.5" />
              <span>Inspeções ({inspections.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("audits")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "audits" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>Auditorias e 5W2H ({audits.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("legislation")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "legislation" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Legislação & Requisitos ({legalRequirements.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("risks")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "risks" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <AlertOctagon className="h-3.5 w-3.5" />
              <span>Matriz 5x5 ({risks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("nonconformities")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "nonconformities" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Não Conformidades ({nonconformities.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "calendar" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Calendário</span>
            </button>
            <button
              onClick={() => setActiveTab("extract")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "extract"
                  ? "bg-forest text-digital font-bold shadow-xs border border-digital/40"
                  : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <AIAvatar size={16} isProcessing={activeTab === "extract"} />
              <span>LIRA Extract (IA)</span>
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`rounded-lg px-3 py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "logs" ? "bg-forest text-white shadow-xs" : "text-muted hover:bg-forest/5 hover:text-forest"
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Trilha de Auditoria</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Mensagens de Notificacao Toast */}
      {toastMessage ? (
        <div className="fixed bottom-4 right-4 z-50 flex items-center justify-between rounded-xl bg-forest text-white px-4 py-3 shadow-xl text-xs border border-environmental/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-digital" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-4 text-slate-300 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}


      <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 w-full">
        {/* ABA OVERVIEW: Painel de Indicadores Gerais */}
        {activeTab === "overview" ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-primary">{organization?.trade_name}</h1>
                <p className="text-xs text-slate-500">
                  CNPJ: {organization?.national_id} | Tipo: {organization?.type} | Status: {organization?.status}
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setIsNewLicenseModalOpen(true)} className="btn-primary text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nova Licença</span>
                </button>
                <button onClick={() => setIsNewWasteModalOpen(true)} className="btn-secondary text-xs">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Registrar Resíduo</span>
                </button>
              </div>
            </div>

            {/* Cartoes Metricos com dados reais do banco */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-environmental/30 bg-environmental/10 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Licenças Vigentes</span>
                  <FileCheck2 className="h-5 w-5 text-environmental" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-forest">
                    {licenses.filter((l: any) => l.status === "Vigente").length}
                  </span>
                  <span className="text-xs font-bold text-environmental">Conformes</span>
                </div>
              </div>

              <div className="rounded-xl border border-cerrado/30 bg-cerrado/10 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cerrado">Alerta 120 Dias (LC 140)</span>
                  <Clock className="h-5 w-5 text-cerrado" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-forest">
                    {licenses.filter((l: any) => l.status === "Alerta Renovação").length}
                  </span>
                  <span className="text-xs font-bold text-cerrado">Ação Tempestiva</span>
                </div>
              </div>

              <div className="rounded-xl border border-water/30 bg-water/10 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-water">Em Renovação</span>
                  <FileText className="h-5 w-5 text-water" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-forest">
                    {licenses.filter((l: any) => l.status === "Em Renovação").length}
                  </span>
                  <span className="text-xs font-bold text-water">Prorrogadas por Lei</span>
                </div>
              </div>

              <div className="rounded-xl border border-forest/20 bg-forest/5 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">Fila Quatro-Olhos</span>
                  <ShieldCheck className="h-5 w-5 text-forest" />
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-forest">
                    {conditions.filter((c: any) => c.status === "Aguardando Revisão").length}
                  </span>
                  <span className="text-xs font-bold text-forest">Aguardando Avaliação</span>
                </div>
              </div>
            </div>


            {/* Painel de Acoes Recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-primary">Licenças desta Organização</h3>
                  <button onClick={() => setActiveTab("licenses")} className="text-xs text-cta hover:underline">Ver todas</button>
                </div>
                <div className="space-y-3">
                  {licenses.map((lic: any) => (
                    <div key={lic.id} className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs">
                      <div>
                        <span className="font-bold text-primary">{lic.type}: {lic.number}</span>
                        <p className="text-slate-500 text-[11px]">{lic.issuer_agency} | Vence em: {lic.expiration_date}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        lic.status === "Vigente" ? "bg-emerald-100 text-emerald-800" :
                        lic.status === "Alerta Renovação" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                      }`}>
                        {lic.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-primary">Resumo Operacional de Campo</h3>
                  <span className="text-xs text-slate-500">{inspections.length} inspeções realizadas</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-700">Total de Resíduos Movimentados:</span>
                    <span className="font-extrabold text-primary">{wasteRecords.reduce((acc: number, w: any) => acc + w.quantity, 0)} t</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-700">Tarefas em Aberto:</span>
                    <span className="font-extrabold text-amber-700">{tasks.filter((t: any) => t.status !== "Concluída").length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-slate-700">Auditorias em Aberto:</span>
                    <span className="font-extrabold text-blue-700">{audits.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ABA ORGANIZACOES E UNIDADES (ORG) */}
        {activeTab === "org" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary">Organizações, Clientes e Unidades</h2>
                <p className="text-xs text-slate-500">Gerenciamento multi-tenant da carteira de empresas e estabelecimentos operacionais.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsNewOrgModalOpen(true)} className="btn-primary text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Cadastrar Empresa/Cliente</span>
                </button>
                <button onClick={() => setIsNewUnitModalOpen(true)} className="btn-secondary text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Nova Unidade</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-sm font-bold text-primary mb-3">Empresas e Clientes na Base</h3>
                <div className="space-y-3">
                  {allOrganizations.map((o: any) => (
                    <div key={o.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-primary">{o.trade_name}</span>
                        <p className="text-[11px] text-slate-500">{o.legal_name} | CNPJ: {o.national_id}</p>
                      </div>
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {o.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-sm font-bold text-primary mb-3">Unidades Operacionais Desta Empresa</h3>
                <div className="space-y-3">
                  {units.map((u: any) => (
                    <div key={u.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-primary">{u.name}</span>
                        <span className="rounded bg-sky-100 text-sky-800 px-2 py-0.5 text-[10px] font-semibold">{u.unit_type}</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1">{u.city}/{u.state} | {u.hydrographic_basin}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ABA LICENCAS (LIC) */}
        {activeTab === "licenses" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary">Licenças e Instrumentos Ambientais</h2>
                <p className="text-xs text-slate-500">Monitoramento tempestivo com aplicação do cálculo de 120 dias da Lei Complementar 140/2011.</p>
              </div>
              <button onClick={() => setIsNewLicenseModalOpen(true)} className="btn-primary text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Nova Licença</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-slate-200 gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por número ou processo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600">Filtrar Órgão:</span>
                  <select
                    value={agencyFilter}
                    onChange={(e) => setAgencyFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 py-1 px-2 text-xs"
                  >
                    <option value="TODOS">Todos os Órgãos</option>
                    <option value="CETESB">CETESB</option>
                    <option value="INEA">INEA</option>
                    <option value="IBAMA">IBAMA</option>
                    <option value="DAEE">DAEE</option>
                  </select>
                </div>
              </div>

              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Instrumento</th>
                    <th className="px-4 py-3">Número e Processo</th>
                    <th className="px-4 py-3">Órgão</th>
                    <th className="px-4 py-3">Vencimento</th>
                    <th className="px-4 py-3">Prazo 120 Dias (LC 140)</th>
                    <th className="px-4 py-3">Situação</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredLicenses.map((lic: any) => (
                    <tr key={lic.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-bold text-primary">{lic.license_type}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">{lic.number}</span>
                        <p className="text-[11px] text-slate-400">{lic.process_number}</p>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{lic.issuer_agency}</td>
                      <td className="px-4 py-3">{lic.expiration_date}</td>
                      <td className="px-4 py-3 font-bold text-amber-700">{lic.renewal_deadline}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          lic.status === "Vigente" ? "bg-emerald-100 text-emerald-800" :
                          lic.status === "Alerta Renovação" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800"
                        }`}>
                          {lic.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {lic.status === "Alerta Renovação" ? (
                          <button
                            onClick={() => {
                              setSelectedLicenseForProtocol(lic);
                              setProtocolForm({ protocol_number: "", protocol_date: new Date().toISOString().split("T")[0] });
                            }}
                            className="btn-primary py-1 px-2.5 text-xs font-semibold"
                          >
                            <span>Protocolar Renovação</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">{lic.protocol_number ? `Prot: ${lic.protocol_number}` : "Regular"}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* ABA CONDICIONANTES E HOMOLOGACAO (CON) */}
        {activeTab === "conditions" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary">Condicionantes e Homologação Técnica</h2>
                <p className="text-xs text-slate-500">Fluxo obrigatório de quatro-olhos e verificação de evidências comprovadas.</p>
              </div>
              <button onClick={() => setIsNewConditionModalOpen(true)} className="btn-primary text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Nova Condicionante</span>
              </button>
            </div>

            <div className="space-y-3">
              {conditions.map((cond: any) => (
                <div key={cond.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-primary">{cond.item_number}</span>
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">{cond.periodicity}</span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        cond.status === "Atendida" ? "bg-emerald-100 text-emerald-800" :
                        cond.status === "Aguardando Revisão" ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-700"
                      }`}>
                        {cond.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{cond.description}</p>
                    <p className="text-[11px] text-slate-500">
                      <strong>Critério:</strong> {cond.compliance_criteria} | <strong>Prazo:</strong> {cond.deadline} | <strong>Evidência:</strong> {cond.evidence_name || "Nenhuma anexada"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {cond.status === "Aguardando Revisão" ? (
                      <button
                        onClick={() => handleApproveCondition(cond.id, cond.item_number)}
                        className="btn-primary py-1.5 px-3 text-xs font-semibold"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Homologar (Quatro-Olhos)</span>
                      </button>
                    ) : cond.status === "Pendente" || cond.status === "Em Andamento" ? (
                      <button
                        onClick={async () => {
                          const evName = prompt("Informe o nome do arquivo de laudo ou comprovante anexado:", "Laudo_Analitico_2026.pdf");
                          if (evName) {
                            await sendAction("ATTACH_EVIDENCE", { condition_id: cond.id, evidence_name: evName });
                            showToast("Evidência anexada. Condicionante submetida para homologação quatro-olhos.");
                          }
                        }}
                        className="btn-secondary py-1 px-2.5 text-xs"
                      >
                        <span>Anexar Evidência</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        Atendida e Homologada
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ABA TAREFAS (TAR) */}
        {activeTab === "tasks" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary">Tarefas Operacionais</h2>
                <p className="text-xs text-slate-500">Atividades técnicas desdobradas para analistas e equipes de campo.</p>
              </div>
              <button onClick={() => setIsNewTaskModalOpen(true)} className="btn-primary text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Nova Tarefa</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-4">
                <h3 className="font-bold text-xs uppercase text-slate-600 mb-3">A Fazer ({tasks.filter((t: any) => t.status === "A Fazer").length})</h3>
                <div className="space-y-2.5">
                  {tasks.filter((t: any) => t.status === "A Fazer").map((t: any) => (
                    <div key={t.id} className="p-3 bg-white rounded-lg shadow-xs border border-slate-200 text-xs space-y-2">
                      <span className="font-bold text-primary block">{t.title}</span>
                      <p className="text-slate-500 text-[11px]">{t.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Resp: {t.assigned_to_name}</span>
                        <span>Prazo: {t.due_date}</span>
                      </div>
                      <button
                        onClick={() => handleUpdateTaskStatus(t.id, "Em Execução")}
                        className="w-full text-center py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold cursor-pointer"
                      >
                        Iniciar Execução
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <h3 className="font-bold text-xs uppercase text-blue-900 mb-3">Em Execução ({tasks.filter((t: any) => t.status === "Em Execução").length})</h3>
                <div className="space-y-2.5">
                  {tasks.filter((t: any) => t.status === "Em Execução").map((t: any) => (
                    <div key={t.id} className="p-3 bg-white rounded-lg shadow-xs border border-blue-200 text-xs space-y-2">
                      <span className="font-bold text-primary block">{t.title}</span>
                      <p className="text-slate-500 text-[11px]">{t.description}</p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span>Resp: {t.assigned_to_name}</span>
                        <span>Prazo: {t.due_date}</span>
                      </div>
                      <button
                        onClick={() => handleUpdateTaskStatus(t.id, "Concluída")}
                        className="w-full text-center py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold cursor-pointer"
                      >
                        Concluir e Anexar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <h3 className="font-bold text-xs uppercase text-emerald-900 mb-3">Concluídas ({tasks.filter((t: any) => t.status === "Concluída").length})</h3>
                <div className="space-y-2.5">
                  {tasks.filter((t: any) => t.status === "Concluída").map((t: any) => (
                    <div key={t.id} className="p-3 bg-white rounded-lg shadow-xs border border-emerald-200 text-xs space-y-1 opacity-90">
                      <span className="font-bold text-slate-800 line-through block">{t.title}</span>
                      <p className="text-[10px] text-emerald-700">Concluída em: {new Date(t.completed_at || t.created_at).toLocaleDateString("pt-BR")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ABA RESIDUOS E MTR (RES) */}
        {activeTab === "waste" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary">Gestão de Resíduos e Destinação (MTR/CDF)</h2>
                <p className="text-xs text-slate-500">Conformidade com a ABNT NBR 10.004, Manifesto de Transporte e Certificado de Destinação Final.</p>
              </div>
              <button onClick={() => setIsNewWasteModalOpen(true)} className="btn-primary text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Nova Movimentação de Resíduo</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Código e Descrição</th>
                    <th className="px-4 py-3">Classificação</th>
                    <th className="px-4 py-3">Quantidade</th>
                    <th className="px-4 py-3">Transportador e Destino</th>
                    <th className="px-4 py-3">MTR e CDF</th>
                    <th className="px-4 py-3">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {wasteRecords.map((w: any) => (
                    <tr key={w.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-primary">
                        <div>{w.waste_code}</div>
                        <span className="text-[11px] font-normal text-slate-600">{w.description}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          w.classification === "Classe I Perigoso" ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-800"
                        }`}>
                          {w.classification}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{w.quantity} {w.unit_of_measure}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <div>{w.transporter_name}</div>
                        <div className="text-[11px] text-slate-400">Destino: {w.destination_company} ({w.destination_type})</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div>MTR: {w.mtr_number}</div>
                        <div className="text-emerald-700">{w.cdf_number ? `CDF: ${w.cdf_number}` : "Aguardando CDF"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === "Destinado com CDF" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* ABA INSPECOES (INS) */}
        {activeTab === "inspections" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary">Inspeções de Campo e Checklists Ambientais</h2>
                <p className="text-xs text-slate-500">Execução de auditorias de rotina, verificação de desvios e evidências fotográficas.</p>
              </div>
              <button onClick={() => setIsNewInspectionModalOpen(true)} className="btn-primary text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Registrar Inspeção de Campo</span>
              </button>
            </div>

            <div className="space-y-3">
              {inspections.map((insp: any) => (
                <div key={insp.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary text-sm">{insp.title}</span>
                      <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">Nota: {insp.score_percentage}%</span>
                      <span className="rounded bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold">{insp.status}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Inspetor: {insp.inspector_name} | Data: {insp.inspection_date} | {insp.conformities_count} conformes e {insp.deviations_count} desvios.
                    </p>
                    {insp.observations ? (
                      <p className="text-[11px] text-slate-500 italic mt-1">Obs: {insp.observations}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ABA AUDITORIAS E PLANOS DE ACAO (AUD e ACA) */}
        {activeTab === "audits" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary">Auditorias e Planos de Ação 5W2H</h2>
                <p className="text-xs text-slate-500">Tratamento de constatações da ISO 14001 com metodologia 5W2H.</p>
              </div>
              <button onClick={() => setIsNewAuditModalOpen(true)} className="btn-primary text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Registrar Auditoria</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audits.map((aud: any) => (
                <div key={aud.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-bold text-primary text-sm">{aud.standard}</span>
                    <span className="rounded bg-sky-100 text-sky-800 px-2 py-0.5 text-[10px] font-bold">{aud.status}</span>
                  </div>
                  <p className="text-xs text-slate-700">{aud.scope}</p>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] bg-slate-50 p-2 rounded-lg">
                    <div>
                      <span className="block font-bold text-emerald-700 text-xs">{aud.findings_summary?.conformities || 0}</span>
                      <span className="text-slate-500">Conformes</span>
                    </div>
                    <div>
                      <span className="block font-bold text-blue-700 text-xs">{aud.findings_summary?.opportunities_for_improvement || 0}</span>
                      <span className="text-slate-500">Melhorias</span>
                    </div>
                    <div>
                      <span className="block font-bold text-amber-700 text-xs">{aud.findings_summary?.minor_non_conformities || 0}</span>
                      <span className="text-slate-500">NC Menor</span>
                    </div>
                    <div>
                      <span className="block font-bold text-rose-700 text-xs">{aud.findings_summary?.major_non_conformities || 0}</span>
                      <span className="text-slate-500">NC Maior</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ABA LIRA EXTRACT (IA) */}
        {activeTab === "extract" ? (
          <div className="rounded-2xl border border-border bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="badge-ai">
                  <AIAvatar size={16} isProcessing={true} />
                  <span>Extração Assistida por IA com Grounding Textual</span>
                </div>
                <h3 className="text-lg font-bold text-forest mt-1.5">Conferência em Tela Dividida (Split-Screen)</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border bg-background p-4 space-y-3 font-mono text-xs">
                <span className="font-bold text-forest block border-b border-border pb-1 font-sans">Documento PDF da Licença CETESB nº 4509/2023 (Pág. 3)</span>
                <p className="text-muted">
                  Artigo 8º: O empreendimento deverá implantar sistema de recirculação de águas pluviais...
                </p>
                <div className="bg-cerrado/10 border border-cerrado/40 p-2.5 rounded text-forest font-semibold">
                  [Cláusula Identificada pela IA]: "Artigo 9º: Fica o titular obrigado a comprovar semestralmente a destinação de 100% dos resíduos perigosos através do sistema SIGOR com anexação de CDFs."
                </div>
              </div>

              <div className="rounded-xl border border-digital/40 bg-digital/5 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-digital/30 pb-1">
                  <span className="font-bold text-forest text-xs">Condicionante Estruturada pela IA</span>
                  <span className="text-[10px] uppercase font-bold text-environmental bg-environmental/15 px-2 py-0.5 rounded">Sugestão Preliminar</span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-border space-y-2 text-xs">
                  <span className="font-bold text-forest">Condicionante 9.1: Destinação de Resíduos Perigosos</span>
                  <p className="text-muted">Comprovar semestralmente a destinação correta via SIGOR com anexação de CDFs.</p>
                  <p className="text-[11px] text-muted">Periodicidade: Semestral | Prazo Sugerido: 30/11/2026</p>
                </div>
                <button
                  onClick={async () => {
                    const ok = await sendAction("CREATE_CONDITION", {
                      license_id: licenses[0]?.id || "lic-1",
                      item_number: "Condicionante 9.1 (Via IA)",
                      description: "Comprovar semestralmente a destinação correta de resíduos perigosos via SIGOR com anexação de CDFs.",
                      compliance_criteria: "Apresentação de CDF emitido pelo destinador com código MTR validado.",
                      periodicity: "SEMIANNUAL",
                      deadline: "2026-11-30"
                    });
                    if (ok) {
                      showToast("Condicionante extraída por IA validada e gravada com sucesso no banco de dados.");
                      setActiveTab("conditions");
                    }
                  }}
                  className="btn-primary w-full py-2 text-xs font-semibold"
                >
                  <Check className="h-4 w-4" />
                  <span>Validar e Gravar no Banco de Dados da Empresa</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}


        {/* ABA TRILHA DE AUDITORIA (LOGS) */}
        {activeTab === "logs" ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-primary">Trilha Imutável de Auditoria (RB-003)</h2>
              <p className="text-xs text-slate-500">Registro histórico completo e inalterável de todas as transações, aprovações e cadastros realizados.</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Horário (UTC)</th>
                    <th className="px-4 py-3">Operador</th>
                    <th className="px-4 py-3">Ação</th>
                    <th className="px-4 py-3">Entidade</th>
                    <th className="px-4 py-3">Detalhes da Transação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-mono text-[11px]">
                  {auditLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-500">{new Date(log.timestamp).toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-2.5 font-bold font-sans text-primary">{log.user_name}</td>
                      <td className="px-4 py-2.5 text-cta font-bold">{log.action}</td>
                      <td className="px-4 py-2.5 text-slate-600">{log.entity_type}</td>
                      <td className="px-4 py-2.5 font-sans text-slate-700">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {activeTab === "legislation" ? (
          <LegislationTab
            legislations={legislations}
            requirements={legalRequirements}
            units={units}
            userName={userName}
            onEvaluateRequirement={handleEvaluateRequirement}
            onCreateLegislation={handleCreateLegislation}
            onCreateRequirement={handleCreateRequirement}
          />
        ) : null}

        {activeTab === "risks" ? (
          <RiskMatrixTab
            risks={risks}
            units={units}
            userName={userName}
            onCreateRisk={handleCreateRisk}
          />
        ) : null}

        {activeTab === "nonconformities" ? (
          <NonConformitiesTab
            nonconformities={nonconformities}
            actionPlans={actionPlans}
            units={units}
            userName={userName}
            onCreateNC={handleCreateNC}
            onCreateActionPlan={handleCreateActionPlanDirect}
          />
        ) : null}

        {activeTab === "calendar" ? (
          <CalendarTab
            licenses={licenses}
            conditions={conditions}
            tasks={tasks}
            audits={audits}
          />
        ) : null}
      </main>

      {/* MODAL: NOVA LICENCA */}
      {isNewLicenseModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-primary text-base">Cadastrar Nova Licença Ambiental</h3>
              <button onClick={() => setIsNewLicenseModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLicense} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Unidade Operacional</label>
                <select
                  value={formLicense.unit_id}
                  onChange={(e) => setFormLicense({ ...formLicense, unit_id: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                  required
                >
                  {units.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.city}/{u.state})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Tipo de Instrumento</label>
                  <select
                    value={formLicense.license_type}
                    onChange={(e) => setFormLicense({ ...formLicense, license_type: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  >
                    <option value="LP">Licença Prévia (LP)</option>
                    <option value="LI">Licença de Instalação (LI)</option>
                    <option value="LO">Licença de Operação (LO)</option>
                    <option value="LAS">Licença Simplificada (LAS)</option>
                    <option value="AAU">Autorização Ambiental (AAU)</option>
                    <option value="OUTORGA">Outorga de Água</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Órgão Emissor</label>
                  <input
                    type="text"
                    required
                    value={formLicense.issuer_agency}
                    onChange={(e) => setFormLicense({ ...formLicense, issuer_agency: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Número da Licença</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: LO nº 992/2026"
                    value={formLicense.number}
                    onChange={(e) => setFormLicense({ ...formLicense, number: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Processo Administrativo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Proc. 0102/2024"
                    value={formLicense.process_number}
                    onChange={(e) => setFormLicense({ ...formLicense, process_number: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Data de Emissão</label>
                  <input
                    type="date"
                    required
                    value={formLicense.issue_date}
                    onChange={(e) => setFormLicense({ ...formLicense, issue_date: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={formLicense.expiration_date}
                    onChange={(e) => setFormLicense({ ...formLicense, expiration_date: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Descrição do Objeto Licenciado</label>
                <textarea
                  rows={2}
                  value={formLicense.description}
                  onChange={(e) => setFormLicense({ ...formLicense, description: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewLicenseModalOpen(false)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Salvar e Calcular Prazo LC 140</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: PROTOCOLO TEMPESTIVO (LC 140/2011) */}
      {selectedLicenseForProtocol ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-primary">Registrar Protocolo de Renovação</h3>
                <p className="text-xs text-slate-500">{selectedLicenseForProtocol.number}</p>
              </div>
              <button onClick={() => setSelectedLicenseForProtocol(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProtocol} className="mt-4 space-y-4 text-xs">
              <div className="rounded-lg bg-amber-50 p-3 text-amber-800 border border-amber-200">
                O protocolo registrado prorroga a vigência automaticamente conforme o artigo 14 da LC 140/2011.
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Número do Protocolo Oficial</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: PROTOCOLO-2026-9901"
                  value={protocolForm.protocol_number}
                  onChange={(e) => setProtocolForm({ ...protocolForm, protocol_number: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Data Efetiva de Protocolo</label>
                <input
                  type="date"
                  required
                  value={protocolForm.protocol_date}
                  onChange={(e) => setProtocolForm({ ...protocolForm, protocol_date: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setSelectedLicenseForProtocol(null)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Prorrogar Vigência Legal</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA ORGANIZACAO / CLIENTE */}
      {isNewOrgModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Cadastrar Nova Empresa / Cliente</h3>
              <button onClick={() => setIsNewOrgModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateOrg} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Nome Fantasia</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Cerâmica União"
                  value={formOrg.trade_name}
                  onChange={(e) => setFormOrg({ ...formOrg, trade_name: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Razão Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Cerâmica União Indústria Ltda"
                  value={formOrg.legal_name}
                  onChange={(e) => setFormOrg({ ...formOrg, legal_name: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">CNPJ</label>
                <input
                  type="text"
                  required
                  placeholder="00.000.000/0001-00"
                  value={formOrg.national_id}
                  onChange={(e) => setFormOrg({ ...formOrg, national_id: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Tipo de Empresa</label>
                <select
                  value={formOrg.type}
                  onChange={(e) => setFormOrg({ ...formOrg, type: e.target.value as any })}
                  className="w-full mt-1 border rounded-lg p-2"
                >
                  <option value="ENTERPRISE">Indústria / Empresa Própria</option>
                  <option value="MANAGED_CLIENT">Cliente Gerenciado por Consultoria</option>
                  <option value="CONSULTANCY">Consultoria Ambiental</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewOrgModalOpen(false)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Criar Empresa</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA UNIDADE */}
      {isNewUnitModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Nova Unidade Operacional</h3>
              <button onClick={() => setIsNewUnitModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUnit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Nome da Unidade / Planta</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Planta Fabril Ribeirão Preto"
                  value={formUnit.name}
                  onChange={(e) => setFormUnit({ ...formUnit, name: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Cidade</label>
                  <input
                    type="text"
                    required
                    value={formUnit.city}
                    onChange={(e) => setFormUnit({ ...formUnit, city: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Estado (UF)</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={formUnit.state}
                    onChange={(e) => setFormUnit({ ...formUnit, state: e.target.value.toUpperCase() })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Bacia Hidrográfica</label>
                <input
                  type="text"
                  placeholder="Ex.: Bacia do Rio Mogi Guaçu"
                  value={formUnit.hydrographic_basin}
                  onChange={(e) => setFormUnit({ ...formUnit, hydrographic_basin: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewUnitModalOpen(false)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Salvar Unidade</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA CONDICIONANTE */}
      {isNewConditionModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Nova Condicionante Ambiental</h3>
              <button onClick={() => setIsNewConditionModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCondition} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Vincular à Licença</label>
                <select
                  value={formCondition.license_id}
                  onChange={(e) => setFormCondition({ ...formCondition, license_id: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                  required
                >
                  {licenses.map((l: any) => (
                    <option key={l.id} value={l.id}>{l.number} ({l.issuer_agency})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Item / Número</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Condicionante 2.4"
                    value={formCondition.item_number}
                    onChange={(e) => setFormCondition({ ...formCondition, item_number: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Periodicidade</label>
                  <select
                    value={formCondition.periodicity}
                    onChange={(e) => setFormCondition({ ...formCondition, periodicity: e.target.value as any })}
                    className="w-full mt-1 border rounded-lg p-2"
                  >
                    <option value="SINGLE">Única / Pontual</option>
                    <option value="MONTHLY">Mensal</option>
                    <option value="QUARTERLY">Trimestral</option>
                    <option value="SEMIANNUAL">Semestral</option>
                    <option value="ANNUAL">Anual</option>
                    <option value="CONTINUOUS">Contínua</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Descrição da Exigência</label>
                <textarea
                  rows={2}
                  required
                  value={formCondition.description}
                  onChange={(e) => setFormCondition({ ...formCondition, description: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Critério Objetivo de Atendimento</label>
                <input
                  type="text"
                  required
                  placeholder="O que constitui evidência válida (ex.: laudo, foto, ART)"
                  value={formCondition.compliance_criteria}
                  onChange={(e) => setFormCondition({ ...formCondition, compliance_criteria: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Prazo Limite</label>
                <input
                  type="date"
                  required
                  value={formCondition.deadline}
                  onChange={(e) => setFormCondition({ ...formCondition, deadline: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewConditionModalOpen(false)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Cadastrar Condicionante</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA TAREFA */}
      {isNewTaskModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Nova Tarefa Operacional</h3>
              <button onClick={() => setIsNewTaskModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Título da Tarefa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Realizar coleta de efluente no ponto E-01"
                  value={formTask.title}
                  onChange={(e) => setFormTask({ ...formTask, title: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Prioridade</label>
                  <select
                    value={formTask.priority}
                    onChange={(e) => setFormTask({ ...formTask, priority: e.target.value as any })}
                    className="w-full mt-1 border rounded-lg p-2"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Data Limite</label>
                  <input
                    type="date"
                    required
                    value={formTask.due_date}
                    onChange={(e) => setFormTask({ ...formTask, due_date: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Responsável Designado</label>
                <input
                  type="text"
                  required
                  value={formTask.assigned_to_name}
                  onChange={(e) => setFormTask({ ...formTask, assigned_to_name: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewTaskModalOpen(false)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Criar Tarefa</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVO RESIDUO / MTR */}
      {isNewWasteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Registrar Movimentação de Resíduo (MTR)</h3>
              <button onClick={() => setIsNewWasteModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateWaste} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Unidade Geradora</label>
                <select
                  value={formWaste.unit_id}
                  onChange={(e) => setFormWaste({ ...formWaste, unit_id: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                  required
                >
                  {units.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Código / Descrição</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: D001 / Borra de Tinta"
                    value={formWaste.waste_code}
                    onChange={(e) => setFormWaste({ ...formWaste, waste_code: e.target.value, description: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Classificação ABNT</label>
                  <select
                    value={formWaste.classification}
                    onChange={(e) => setFormWaste({ ...formWaste, classification: e.target.value as any })}
                    className="w-full mt-1 border rounded-lg p-2"
                  >
                    <option value="Classe I Perigoso">Classe I Perigoso</option>
                    <option value="Classe IIA Não Inerte">Classe IIA Não Inerte</option>
                    <option value="Classe IIB Inerte">Classe IIB Inerte</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Quantidade</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formWaste.quantity}
                    onChange={(e) => setFormWaste({ ...formWaste, quantity: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Número do MTR</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: MTR-SP-2026-991"
                    value={formWaste.mtr_number}
                    onChange={(e) => setFormWaste({ ...formWaste, mtr_number: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Transportador Credenciado</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: EcoTransp Ltda"
                    value={formWaste.transporter_name}
                    onChange={(e) => setFormWaste({ ...formWaste, transporter_name: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Destinador Final</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Coprocessamento Brasil S/A"
                    value={formWaste.destination_company}
                    onChange={(e) => setFormWaste({ ...formWaste, destination_company: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewWasteModalOpen(false)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Registrar Expedição MTR</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA INSPECAO */}
      {isNewInspectionModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Registrar Inspeção de Campo</h3>
              <button onClick={() => setIsNewInspectionModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateInspection} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Título da Inspeção</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Inspeção de Bacias e Diques"
                  value={formInspection.title}
                  onChange={(e) => setFormInspection({ ...formInspection, title: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Itens Conformes</label>
                  <input
                    type="number"
                    required
                    value={formInspection.conformities_count}
                    onChange={(e) => setFormInspection({ ...formInspection, conformities_count: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Desvios Identificados</label>
                  <input
                    type="number"
                    required
                    value={formInspection.deviations_count}
                    onChange={(e) => setFormInspection({ ...formInspection, deviations_count: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Observações de Campo</label>
                <textarea
                  rows={2}
                  value={formInspection.observations}
                  onChange={(e) => setFormInspection({ ...formInspection, observations: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewInspectionModalOpen(false)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Salvar Inspeção</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA AUDITORIA */}
      {isNewAuditModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Registrar Relatório de Auditoria</h3>
              <button onClick={() => setIsNewAuditModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAudit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Norma Regulamentadora</label>
                <select
                  value={formAudit.standard}
                  onChange={(e) => setFormAudit({ ...formAudit, standard: e.target.value as any })}
                  className="w-full mt-1 border rounded-lg p-2"
                >
                  <option value="ISO 14001">ISO 14001: Sistema de Gestão Ambiental</option>
                  <option value="Conformidade Legal Geral">Conformidade Legal Geral e Licenciamento</option>
                  <option value="Auditoria de Fornecedores">Auditoria de Fornecedores e Destinadores</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Escopo Auditado</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Parque fabril, ETE e caldeiras"
                  value={formAudit.scope}
                  onChange={(e) => setFormAudit({ ...formAudit, scope: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Não Conformidades</label>
                  <input
                    type="number"
                    value={formAudit.minor_non_conformities}
                    onChange={(e) => setFormAudit({ ...formAudit, minor_non_conformities: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Oportunidades de Melhoria</label>
                  <input
                    type="number"
                    value={formAudit.opportunities_for_improvement}
                    onChange={(e) => setFormAudit({ ...formAudit, opportunities_for_improvement: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewAuditModalOpen(false)} className="btn-secondary py-1.5 px-3">Cancelar</button>
                <button type="submit" className="btn-primary py-1.5 px-3">Salvar Auditoria</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      {/* MODAL DE BUSCA GLOBAL (CMD+K / COMMAND PALETTE) */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        systemData={systemData}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </div>
  );
}
