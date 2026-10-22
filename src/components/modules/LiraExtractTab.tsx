"use client";

import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Check,
  Edit2,
  Trash2,
  UploadCloud,
  FileCheck2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock
} from "lucide-react";
import { AIAvatar } from "@/components/brand/AIAvatar";

interface ExtractedConditionItem {
  id: string;
  clause_ref: string;
  item_number: string;
  description: string;
  compliance_criteria: string;
  periodicity: "SINGLE" | "MONTHLY" | "BIMONTHLY" | "QUARTERLY" | "SEMIANNUAL" | "ANNUAL" | "CONTINUOUS";
  deadline: string;
  legal_basis: string;
  confidence: number;
  status: "PENDING_REVIEW" | "HOMOLOGATED" | "REJECTED";
}

interface LiraExtractTabProps {
  licenses: any[];
  userName: string;
  onCreateCondition: (conditionData: any) => Promise<boolean>;
  onBatchCreateConditions?: (conditions: any[]) => Promise<boolean>;
}

export function LiraExtractTab({
  licenses = [],
  userName,
  onCreateCondition,
  onBatchCreateConditions
}: LiraExtractTabProps) {
  const [selectedLicenseId, setSelectedLicenseId] = useState<string>(licenses[0]?.id || "");
  const [activeClauseHighlight, setActiveClauseHighlight] = useState<string | null>("clause-1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const activeLicense = licenses.find((l) => l.id === selectedLicenseId) || licenses[0];

  const [extractedItems, setExtractedItems] = useState<ExtractedConditionItem[]>([
    {
      id: "ext-1",
      clause_ref: "clause-1",
      item_number: "Condicionante 2.1",
      description:
        "Realizar monitoramento analítico semestral do efluente tratado no ponto de descarte E-01 (Rio Mogi Guaçu), avaliando DBO, DQO, Óleos e Graxas, Metais Pesados e Toxicidade.",
      compliance_criteria:
        "Laudo analítico emitido por laboratório acreditado pela Cgcre/INMETRO (ABNT NBR ISO/IEC 17025) acompanhado de Anotação de Responsabilidade Técnica (ART).",
      periodicity: "SEMIANNUAL",
      deadline: "2027-04-30",
      legal_basis: "Art. 16 da Resolução CONAMA 430/2011 e Art. 18 do Decreto Estadual 8.468/1976",
      confidence: 98,
      status: "PENDING_REVIEW"
    },
    {
      id: "ext-2",
      clause_ref: "clause-2",
      item_number: "Condicionante 2.2",
      description:
        "Comprovar a destinação ambientalmente adequada de 100% dos resíduos industriais perigosos (Classe I) gerados na planta mediante manifesto eletrônico MTR e Certificado de Destinação Final (CDF).",
      compliance_criteria:
        "Relatório semestral de movimentação de resíduos acompanhado de CDFs emitidos via sistema SIGOR/SINIR por destinador com licença ambiental válida.",
      periodicity: "SEMIANNUAL",
      deadline: "2026-12-31",
      legal_basis: "Lei Federal 12.305/2010 (PNRS) e Resolução SMA 38/2017",
      confidence: 96,
      status: "PENDING_REVIEW"
    },
    {
      id: "ext-3",
      clause_ref: "clause-3",
      item_number: "Condicionante 2.3",
      description:
        "Proceder à calibração metrológica anual e teste de emissão nos analisadores contínuos de opacidade e material particulado da chaminé CH-01 do gerador de vapor.",
      compliance_criteria:
        "Certificado de calibração metrológica emitido por entidade RBC e relatório de ensaio isocinético de chaminé.",
      periodicity: "ANNUAL",
      deadline: "2027-10-15",
      legal_basis: "Resolução CONAMA 382/2006 e Padrões de Emissão CETESB",
      confidence: 94,
      status: "PENDING_REVIEW"
    },
    {
      id: "ext-4",
      clause_ref: "clause-4",
      item_number: "Condicionante 2.4",
      description:
        "Manter atualizado anualmente o Plano de Gerenciamento de Resíduos Sólidos (PGRS) com inventário físico de estoque e plano de contenção para emergências com produtos perigosos.",
      compliance_criteria:
        "Exemplar do PGRS 2026 assinado pelo responsável técnico e protocolado junto à agência ambiental CETESB.",
      periodicity: "ANNUAL",
      deadline: "2026-11-30",
      legal_basis: "Art. 20 da Lei Federal 12.305/2010",
      confidence: 95,
      status: "PENDING_REVIEW"
    }
  ]);

  const handleHomologateSingle = async (item: ExtractedConditionItem) => {
    const ok = await onCreateCondition({
      license_id: activeLicense?.id || "lic-1",
      item_number: item.item_number,
      description: item.description,
      compliance_criteria: item.compliance_criteria,
      periodicity: item.periodicity,
      deadline: item.deadline,
      evidence_name: `Laudo Comprobatório (${item.item_number})`
    });

    if (ok) {
      setExtractedItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "HOMOLOGATED" } : i))
      );
    }
  };

  const handleHomologateBatch = async () => {
    setIsProcessing(true);
    const pendingItems = extractedItems.filter((i) => i.status === "PENDING_REVIEW");

    for (const item of pendingItems) {
      await onCreateCondition({
        license_id: activeLicense?.id || "lic-1",
        item_number: item.item_number,
        description: item.description,
        compliance_criteria: item.compliance_criteria,
        periodicity: item.periodicity,
        deadline: item.deadline,
        evidence_name: `Laudo Comprobatório (${item.item_number})`
      });
    }

    setExtractedItems((prev) => prev.map((i) => ({ ...i, status: "HOMOLOGATED" })));
    setIsProcessing(false);
  };

  const handleRejectItem = (itemId: string) => {
    setExtractedItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: "REJECTED" } : i))
    );
  };

  const homologatedCount = extractedItems.filter((i) => i.status === "HOMOLOGATED").length;
  const pendingCount = extractedItems.filter((i) => i.status === "PENDING_REVIEW").length;

  return (
    <div className="space-y-6">
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-ai flex items-center gap-1.5 font-bold">
              <AIAvatar size={14} isProcessing={isProcessing} />
              <span>Epic 23 • LIRA Extract</span>
            </span>
            <span className="badge-compliance">Human-in-the-Loop</span>
          </div>
          <h2 className="text-xl font-bold text-forest mt-1.5">
            Extração Inteligente de Condicionantes em Tela Dividida (Split-Screen)
          </h2>
          <p className="text-xs text-muted">
            O motor de IA analisa o documento oficial da licença ambiental, desmembra as exigências regulatórias e submete à homologação do gestor.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-700">Licença Alvo:</span>
            <select
              value={selectedLicenseId}
              onChange={(e) => setSelectedLicenseId(e.target.value)}
              className="ml-2 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold text-forest outline-none"
            >
              {licenses.map((l: any) => (
                <option key={l.id} value={l.id}>
                  {l.number} ({l.issuer_agency})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleHomologateBatch}
            disabled={pendingCount === 0 || isProcessing}
            className={`btn-primary text-xs flex items-center gap-1.5 ${
              pendingCount === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>Homologar Lote Completo ({pendingCount})</span>
          </button>
        </div>
      </div>

      {/* Grid Split-Screen 50% / 50% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PAINEL ESQUERDO (5 colunas no desktop): VISUALIZADOR DE DOCUMENTO OFICIAL */}
        <div className="lg:col-span-6 rounded-2xl border border-border bg-white shadow-xs overflow-hidden flex flex-col h-[750px]">
          {/* Header do Visualizador */}
          <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-environmental" />
              <span>Visualizador de Licença: {activeLicense?.number || "LO nº 4509/2023"}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
              <span className="bg-slate-700 px-2 py-0.5 rounded">Pág. 3 de 8</span>
              <span>100% Zoom</span>
            </div>
          </div>

          {/* Área do Documento Simulado com tipografia autêntica de licença ambiental */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-50 font-serif text-[12px] leading-relaxed text-slate-800 space-y-4">
            {/* Timbre e Preâmbulo */}
            <div className="text-center border-b border-slate-300 pb-4 space-y-1 font-sans">
              <p className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Governo do Estado de São Paulo — Secretaria de Meio Ambiente
              </p>
              <p className="font-extrabold text-sm text-forest uppercase">
                CETESB — Companhia Ambiental do Estado de São Paulo
              </p>
              <p className="text-[11px] text-muted font-mono">
                LICENÇA DE OPERAÇÃO Nº {activeLicense?.number || "4509/2023"} • PROCESSO CETESB nº 0102/2024
              </p>
            </div>

            <div className="font-sans text-[11px] bg-slate-100 p-2.5 rounded border border-slate-200">
              <strong>Titular:</strong> AgroIndustrial Paulínia S.A. | <strong>Atividade:</strong> Fabricação de Defensivos e Fertilizantes (CNAE 20.12-1) | <strong>Validade:</strong> {activeLicense?.expiration_date || "14/11/2026"}
            </div>

            <p className="text-justify indent-4">
              A Companhia Ambiental do Estado de São Paulo - CETESB, no uso das atribuições que lhe conferem a Lei Estadual nº 997/76 e o Decreto nº 8.468/76, expede a presente Licença de Operação, sob as seguintes condições restritivas de validade:
            </p>

            {/* Cláusula 1 */}
            <div
              onClick={() => setActiveClauseHighlight("clause-1")}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeClauseHighlight === "clause-1"
                  ? "bg-amber-100/70 border-amber-400 ring-2 ring-amber-300 font-medium"
                  : "bg-white border-slate-200 hover:bg-slate-100/60"
              }`}
            >
              <div className="flex items-center justify-between font-sans text-[10px] font-bold text-amber-900 mb-1">
                <span>CLÁUSULA 2.1 — CONTROLE DE EFLUENTES LÍQUIDOS</span>
                <span className="bg-amber-200 px-1.5 py-0.5 rounded">Identificada pela IA (98%)</span>
              </div>
              <p className="text-justify indent-2">
                "Artigo 8º, Item 2.1: O empreendimento fica expressamente obrigado a realizar monitoramento analítico semestral do efluente final tratado descartado na bacia do Rio Mogi Guaçu (Ponto E-01), obedecendo aos padrões da Resolução CONAMA 430/2011 e apresentando relatório comprobatório com ART até o dia 30 de abril e 31 de outubro de cada ano civil."
              </p>
            </div>

            {/* Cláusula 2 */}
            <div
              onClick={() => setActiveClauseHighlight("clause-2")}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeClauseHighlight === "clause-2"
                  ? "bg-amber-100/70 border-amber-400 ring-2 ring-amber-300 font-medium"
                  : "bg-white border-slate-200 hover:bg-slate-100/60"
              }`}
            >
              <div className="flex items-center justify-between font-sans text-[10px] font-bold text-amber-900 mb-1">
                <span>CLÁUSULA 2.2 — GESTÃO E DESTINAÇÃO DE RESÍDUOS CLASSE I</span>
                <span className="bg-amber-200 px-1.5 py-0.5 rounded">Identificada pela IA (96%)</span>
              </div>
              <p className="text-justify indent-2">
                "Artigo 9º, Item 2.2: Fica o titular obrigado a comprovar semestralmente a destinação de 100% dos resíduos perigosos (Classe I) gerados na unidade fabril através do sistema oficial SIGOR, mediante emissão de MTRs eletrônicos e certificados de destinação final (CDF) por empresas devidamente licenciadas."
              </p>
            </div>

            {/* Cláusula 3 */}
            <div
              onClick={() => setActiveClauseHighlight("clause-3")}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeClauseHighlight === "clause-3"
                  ? "bg-amber-100/70 border-amber-400 ring-2 ring-amber-300 font-medium"
                  : "bg-white border-slate-200 hover:bg-slate-100/60"
              }`}
            >
              <div className="flex items-center justify-between font-sans text-[10px] font-bold text-amber-900 mb-1">
                <span>CLÁUSULA 2.3 — MONITORAMENTO DE EMISSÕES ATMOSFÉRICAS</span>
                <span className="bg-amber-200 px-1.5 py-0.5 rounded">Identificada pela IA (94%)</span>
              </div>
              <p className="text-justify indent-2">
                "Artigo 12º, Item 2.3: Proceder à calibração metrológica anual dos analisadores de opacidade instalados na chaminé CH-01 e efetuar laudo de amostragem em duto de material particulado com periodicidade máxima de 12 meses, conforme os padrões da Resolução CONAMA 382/2006."
              </p>
            </div>

            {/* Cláusula 4 */}
            <div
              onClick={() => setActiveClauseHighlight("clause-4")}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                activeClauseHighlight === "clause-4"
                  ? "bg-amber-100/70 border-amber-400 ring-2 ring-amber-300 font-medium"
                  : "bg-white border-slate-200 hover:bg-slate-100/60"
              }`}
            >
              <div className="flex items-center justify-between font-sans text-[10px] font-bold text-amber-900 mb-1">
                <span>CLÁUSULA 2.4 — ATUALIZAÇÃO DO PGRS</span>
                <span className="bg-amber-200 px-1.5 py-0.5 rounded">Identificada pela IA (95%)</span>
              </div>
              <p className="text-justify indent-2">
                "Artigo 14º, Item 2.4: O Plano de Gerenciamento de Resíduos Sólidos (PGRS) deverá ser protocolado e atualizado anualmente perante a Agência Ambiental de Paulínia com recolhimento de Anotação de Responsabilidade Técnica (ART)."
              </p>
            </div>

            <p className="text-slate-500 text-[11px] italic pt-2">
              [Documento assinado digitalmente pelo Diretor de Controle Ambiental - CETESB em 14/11/2023 sob o protocolo ICP-Brasil #44092-2023-LO]
            </p>
          </div>
        </div>

        {/* PAINEL DIREITO (6 colunas no desktop): WORKSPACE DE HOMOLOGAÇÃO IA */}
        <div className="lg:col-span-6 rounded-2xl border border-border bg-white shadow-xs overflow-hidden flex flex-col h-[750px]">
          {/* Header do Workspace IA */}
          <div className="bg-forest text-white px-4 py-3 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <AIAvatar size={16} isProcessing={isProcessing} />
              <span>LIRA Extract • Condicionantes Estruturadas ({extractedItems.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-environmental/20 text-environmental text-[11px] px-2 py-0.5 rounded font-bold">
                {homologatedCount} Homologadas
              </span>
              <span className="bg-cerrado/20 text-cerrado text-[11px] px-2 py-0.5 rounded font-bold">
                {pendingCount} Pendentes
              </span>
            </div>
          </div>

          {/* Lista de Condicionantes para Homologação */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {extractedItems.map((item) => {
              const isHighlighted = activeClauseHighlight === item.clause_ref;
              const isHomologated = item.status === "HOMOLOGATED";
              const isRejected = item.status === "REJECTED";

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveClauseHighlight(item.clause_ref)}
                  className={`rounded-xl border p-4 bg-white transition-all space-y-3 cursor-pointer ${
                    isHomologated
                      ? "border-emerald-300 bg-emerald-50/30"
                      : isRejected
                      ? "border-slate-200 opacity-50 bg-slate-100"
                      : isHighlighted
                      ? "border-digital/60 ring-2 ring-digital/20 shadow-sm"
                      : "border-border hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-forest text-sm">{item.item_number}</span>
                        <span className="badge-legal text-[10px]">{item.legal_basis}</span>
                      </div>
                      <span className="text-[11px] text-muted">
                        Vinculada à {item.clause_ref.replace("-", " ")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="badge-ai text-[10px]">
                        <Sparkles className="h-3 w-3" />
                        <span>{item.confidence}% Match</span>
                      </span>

                      {isHomologated && (
                        <span className="flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Homologada</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 leading-normal">{item.description}</p>

                  <div className="rounded-lg bg-slate-50 p-2.5 text-[11px] space-y-1 text-slate-600 border border-slate-100">
                    <div>
                      <strong className="text-forest">Critério Objetivo de Atendimento:</strong>
                      <p className="text-muted mt-0.5">{item.compliance_criteria}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                      <span>Periodicidade: <strong>{item.periodicity}</strong></span>
                      <span>Prazo Inicial: <strong>{item.deadline}</strong></span>
                    </div>
                  </div>

                  {/* Botões de Ação Item a Item */}
                  {!isHomologated && !isRejected && (
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectItem(item.id);
                        }}
                        className="btn-secondary py-1 px-2.5 text-xs text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        <span>Descartar</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHomologateSingle(item);
                        }}
                        className="btn-primary py-1 px-3 text-xs flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Homologar e Injetar no Grafo</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
