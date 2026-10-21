"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Edit3,
  X
} from "lucide-react";
import { Legislation, LegalRequirement } from "@/types";

interface LegislationTabProps {
  legislations: Legislation[];
  requirements: LegalRequirement[];
  units: any[];
  userName: string;
  onEvaluateRequirement: (reqId: string, applicability: any, status: any, justification: string) => Promise<void>;
  onCreateLegislation: (data: any) => Promise<void>;
  onCreateRequirement: (data: any) => Promise<void>;
}

export function LegislationTab({
  legislations,
  requirements,
  units,
  userName,
  onEvaluateRequirement,
  onCreateLegislation,
  onCreateRequirement
}: LegislationTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sphereFilter, setSphereFilter] = useState("TODAS");
  const [themeFilter, setThemeFilter] = useState("TODOS");
  const [statusFilter, setStatusFilter] = useState("TODOS");

  // Modais
  const [isNewLegModalOpen, setIsNewLegModalOpen] = useState(false);
  const [isNewReqModalOpen, setIsNewReqModalOpen] = useState(false);
  const [selectedReqForEval, setSelectedReqForEval] = useState<LegalRequirement | null>(null);

  // Forms
  const [formLeg, setFormLeg] = useState({
    legislation_type: "RESOLUCAO",
    number: "",
    year: new Date().getFullYear(),
    issuing_body: "",
    sphere: "FEDERAL",
    theme: "Efluentes e Recursos Hídricos",
    summary: "",
    official_url: ""
  });

  const [formReq, setFormReq] = useState({
    legislation_id: legislations[0]?.id || "",
    unit_id: units[0]?.id || "",
    code: "",
    article_reference: "",
    title: "",
    obligation_text: "",
    evidence_required_description: "",
    criticality: "ALTA",
    applicability: "Aplicável",
    compliance_status: "Pendente",
    justification: "",
    responsible_name: userName
  });

  const [evalForm, setEvalForm] = useState({
    applicability: "Aplicável",
    compliance_status: "Conforme",
    justification: ""
  });

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.obligation_text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "TODOS" ? true : req.compliance_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLegislations = legislations.filter((leg) => {
    const matchesSphere = sphereFilter === "TODAS" ? true : leg.sphere === sphereFilter;
    const matchesTheme = themeFilter === "TODOS" ? true : leg.theme.includes(themeFilter);
    return matchesSphere && matchesTheme;
  });

  const totalConformes = requirements.filter((r) => r.compliance_status === "Conforme").length;
  const totalPendentes = requirements.filter((r) => r.compliance_status === "Pendente").length;
  const totalNaoConformes = requirements.filter((r) => r.compliance_status === "Não Conforme").length;
  const complianceRate = requirements.length > 0 ? Math.round((totalConformes / requirements.length) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header com KPIs do Grafo de Conformidade Legal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cta" />
            <span>Legislação & Matriz de Requisitos Legais</span>
          </h2>
          <p className="text-xs text-slate-500">
            Conexão direta entre normas ambientais, aplicabilidade por unidade e comprovação de compliance.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsNewLegModalOpen(true)}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Cadastrar Norma</span>
          </button>
          <button
            onClick={() => setIsNewReqModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Novo Requisito</span>
          </button>
        </div>
      </div>

      {/* KPI Cards de Compliance Legal */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Normas no Acervo</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">{legislations.length}</span>
            <span className="text-xs text-slate-400">Federais / Estaduais</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Taxa de Conformidade</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{complianceRate}%</span>
            <span className="text-xs font-bold text-emerald-600">{totalConformes} de {requirements.length} conformes</span>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Requisitos Pendentes</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{totalPendentes}</span>
            <span className="text-xs font-bold text-amber-600">Aguardando laudo/ação</span>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Não Conformes</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-700">{totalNaoConformes}</span>
            <span className="text-xs font-bold text-red-600">Risco crítico de multa</span>
          </div>
        </div>
      </div>

      {/* Acervo de Legislação Oficial */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-forest" />
            <h3 className="text-sm font-bold text-primary">Biblioteca de Normas Aplicáveis</h3>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={sphereFilter}
              onChange={(e) => setSphereFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
            >
              <option value="TODAS">Todas as Esferas</option>
              <option value="FEDERAL">Federal</option>
              <option value="ESTADUAL">Estadual</option>
              <option value="MUNICIPAL">Municipal</option>
            </select>
            <select
              value={themeFilter}
              onChange={(e) => setThemeFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
            >
              <option value="TODOS">Todos os Temas</option>
              <option value="Efluentes">Efluentes e Água</option>
              <option value="Resíduos">Resíduos Sólidos</option>
              <option value="Poluição">Controle de Poluição</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredLegislations.map((leg) => (
            <div key={leg.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest/10 text-forest">
                    {leg.sphere} {leg.state ? `(${leg.state})` : ""}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Ano: {leg.year}</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-primary">{leg.number}</h4>
                <p className="mt-1 text-[11px] text-slate-600 line-clamp-3">{leg.summary}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">{leg.issuing_body}</span>
                {leg.official_url ? (
                  <a
                    href={leg.official_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cta hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Fonte Oficial</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matriz de Requisitos Legais */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h3 className="text-sm font-bold text-primary">Matriz de Requisitos Legais da Unidade</h3>
            <p className="text-[11px] text-slate-500">Validação técnica e justificativa formal para auditoria</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar requisitos por código ou texto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-cta"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="Conforme">Conforme</option>
              <option value="Pendente">Pendente</option>
              <option value="Não Conforme">Não Conforme</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Código / Artigo</th>
                <th className="py-2.5 px-3 font-semibold">Obrigação Legal</th>
                <th className="py-2.5 px-3 font-semibold">Evidência Exigida</th>
                <th className="py-2.5 px-3 font-semibold">Aplicabilidade</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequirements.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-primary block">{req.code}</span>
                    <span className="text-[11px] text-slate-500">{req.article_reference}</span>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <p className="font-semibold text-slate-800 text-[11px]">{req.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{req.obligation_text}</p>
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-600 max-w-xs">
                    {req.evidence_required_description || "Apresentação de relatório e laudo técnico."}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {req.applicability}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.compliance_status === "Conforme"
                          ? "bg-emerald-100 text-emerald-800"
                          : req.compliance_status === "Pendente"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {req.compliance_status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedReqForEval(req);
                        setEvalForm({
                          applicability: req.applicability,
                          compliance_status: req.compliance_status,
                          justification: req.justification || ""
                        });
                      }}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer transition-colors"
                    >
                      Avaliar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: AVALIAR REQUISITO LEGAL (JUSTIFICATIVA FORMAL PARA AUDITORIA) */}
      {selectedReqForEval ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h3 className="font-bold text-primary text-base">Avaliação de Aplicabilidade & Conformidade</h3>
                <p className="text-xs text-slate-500">{selectedReqForEval.code} - {selectedReqForEval.article_reference}</p>
              </div>
              <button onClick={() => setSelectedReqForEval(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onEvaluateRequirement(
                  selectedReqForEval.id,
                  evalForm.applicability,
                  evalForm.compliance_status,
                  evalForm.justification
                );
                setSelectedReqForEval(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700">Enquadramento de Aplicabilidade</label>
                <select
                  value={evalForm.applicability}
                  onChange={(e) => setEvalForm({ ...evalForm, applicability: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                >
                  <option value="Aplicável">Aplicável à Operação da Unidade</option>
                  <option value="Não Aplicável">Não Aplicável (Processo Inexistente)</option>
                  <option value="Em Análise">Em Análise Técnica</option>
                  <option value="Parcialmente Aplicável">Parcialmente Aplicável</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Status de Atendimento (Compliance)</label>
                <select
                  value={evalForm.compliance_status}
                  onChange={(e) => setEvalForm({ ...evalForm, compliance_status: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                >
                  <option value="Conforme">Conforme (Atendido com Laudo/Evidência Válida)</option>
                  <option value="Pendente">Pendente (Em fase de monitoramento ou coleta)</option>
                  <option value="Não Conforme">Não Conforme (Parâmetro violado ou prazo esgotado)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">
                  Justificativa Técnica da Avaliação (Obrigatório para Auditoria)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Descreva detalhadamente o enquadramento no processo fabril, menção a laudos ou motivo de não aplicabilidade..."
                  value={evalForm.justification}
                  onChange={(e) => setEvalForm({ ...evalForm, justification: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedReqForEval(null)}
                  className="btn-secondary py-1.5 px-3"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA NORMA */}
      {isNewLegModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Cadastrar Norma Ambiental</h3>
              <button onClick={() => setIsNewLegModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onCreateLegislation(formLeg);
                setIsNewLegModalOpen(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700">Tipo de Norma</label>
                <select
                  value={formLeg.legislation_type}
                  onChange={(e) => setFormLeg({ ...formLeg, legislation_type: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                >
                  <option value="RESOLUCAO">Resolução</option>
                  <option value="LEI">Lei Ordinária / Complementar</option>
                  <option value="DECRETO">Decreto</option>
                  <option value="PORTARIA">Portaria</option>
                  <option value="INSTRUCAO_NORMATIVA">Instrução Normativa</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Número da Norma</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Resolução CONAMA nº 430/2011"
                  value={formLeg.number}
                  onChange={(e) => setFormLeg({ ...formLeg, number: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Esfera</label>
                  <select
                    value={formLeg.sphere}
                    onChange={(e) => setFormLeg({ ...formLeg, sphere: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  >
                    <option value="FEDERAL">Federal</option>
                    <option value="ESTADUAL">Estadual</option>
                    <option value="MUNICIPAL">Municipal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Órgão Emissor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: CONAMA / MMA"
                    value={formLeg.issuing_body}
                    onChange={(e) => setFormLeg({ ...formLeg, issuing_body: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Tema Ambiental</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Efluentes e Recursos Hídricos"
                  value={formLeg.theme}
                  onChange={(e) => setFormLeg({ ...formLeg, theme: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Ementa / Resumo</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Síntese da norma e suas diretrizes principais..."
                  value={formLeg.summary}
                  onChange={(e) => setFormLeg({ ...formLeg, summary: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewLegModalOpen(false)} className="btn-secondary py-1.5 px-3">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Salvar Norma
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVO REQUISITO LEGAL */}
      {isNewReqModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Desdobrar Requisito Legal</h3>
              <button onClick={() => setIsNewReqModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onCreateRequirement(formReq);
                setIsNewReqModalOpen(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700">Norma Relacionada</label>
                <select
                  value={formReq.legislation_id}
                  onChange={(e) => setFormReq({ ...formReq, legislation_id: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                >
                  {legislations.map((leg) => (
                    <option key={leg.id} value={leg.id}>
                      {leg.number} - {leg.issuing_body}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Código</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: REQ-CONAMA-430-01"
                    value={formReq.code}
                    onChange={(e) => setFormReq({ ...formReq, code: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Artigo / Parágrafo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: Art. 16, Item B"
                    value={formReq.article_reference}
                    onChange={(e) => setFormReq({ ...formReq, article_reference: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Título do Requisito</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Padrão de Lançamento de Efluentes"
                  value={formReq.title}
                  onChange={(e) => setFormReq({ ...formReq, title: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Texto da Obrigação</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Descreva o que a empresa deve cumprir..."
                  value={formReq.obligation_text}
                  onChange={(e) => setFormReq({ ...formReq, obligation_text: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700">Evidência Exigida</label>
                <input
                  type="text"
                  placeholder="Ex.: Laudo analítico semestral do efluente"
                  value={formReq.evidence_required_description}
                  onChange={(e) => setFormReq({ ...formReq, evidence_required_description: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsNewReqModalOpen(false)} className="btn-secondary py-1.5 px-3">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Salvar Requisito
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
