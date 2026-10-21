"use client";

import { useState } from "react";
import { AlertTriangle, Plus, CheckCircle2, Clock, ShieldAlert, ArrowRight, X } from "lucide-react";
import { NonConformity } from "@/types";

interface NonConformitiesTabProps {
  nonconformities: NonConformity[];
  actionPlans: any[];
  units: any[];
  userName: string;
  onCreateNC: (data: any) => Promise<void>;
  onCreateActionPlan: (data: any) => Promise<void>;
}

export function NonConformitiesTab({
  nonconformities,
  actionPlans,
  units,
  userName,
  onCreateNC,
  onCreateActionPlan
}: NonConformitiesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNcForPlan, setSelectedNcForPlan] = useState<NonConformity | null>(null);

  const [formNC, setFormNC] = useState({
    unit_id: units[0]?.id || "",
    code: "",
    origin: "Inspeção",
    description: "",
    root_cause: "",
    criticality: "Média",
    responsible_name: userName,
    deadline: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0]
  });

  const [formPlan, setFormPlan] = useState({
    title: "",
    what: "",
    why: "",
    where: "",
    who: userName,
    when_deadline: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
    how: "",
    how_much: ""
  });

  const totalAbertas = nonconformities.filter((nc) => nc.status === "Aberta").length;
  const totalEmTratamento = nonconformities.filter((nc) => nc.status === "Em Tratamento").length;
  const totalConcluidas = nonconformities.filter((nc) => nc.status === "Concluída Eficaz").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span>Gestão de Não Conformidades (NC) & Tratamento</span>
          </h2>
          <p className="text-xs text-slate-500">
            Registro transversal de desvios (Auditorias, Inspeções de Campo, Condicionantes) com planos de ação 5W2H.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>Registrar Não Conformidade</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-red-800 uppercase tracking-wider">NCs Abertas</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-700">{totalAbertas}</span>
            <span className="text-xs text-red-600 font-semibold">Aguardando plano de ação</span>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Em Tratamento</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{totalEmTratamento}</span>
            <span className="text-xs text-amber-600 font-semibold">Com plano 5W2H em execução</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Concluídas com Eficácia</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{totalConcluidas}</span>
            <span className="text-xs text-emerald-600 font-semibold">Desvios eliminados</span>
          </div>
        </div>
      </div>

      {/* Tabela de Não Conformidades */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-primary">Quadro de Tratamento de Desvios</h3>
          <span className="text-xs text-slate-500 font-semibold">{nonconformities.length} registros</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Código / Origem</th>
                <th className="py-2.5 px-3 font-semibold">Descrição do Desvio</th>
                <th className="py-2.5 px-3 font-semibold">Análise de Causa Raiz</th>
                <th className="py-2.5 px-3 font-semibold">Responsável / Prazo</th>
                <th className="py-2.5 px-3 font-semibold">Criticidade / Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Plano de Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {nonconformities.map((nc) => {
                const linkedPlan = actionPlans.find((p) => p.id === nc.action_plan_id || p.origin_id === nc.id);

                return (
                  <tr key={nc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-primary block">{nc.code}</span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">{nc.origin}</span>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-[11px] text-slate-800 font-medium">{nc.description}</p>
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <p className="text-[11px] text-slate-500 italic">
                        {nc.root_cause || "Em investigação de causa raiz (Ishikawa / 5 Porquês)..."}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-slate-700 block">{nc.responsible_name}</span>
                      <span className="text-[10px] text-slate-400">Prazo: {nc.deadline}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            nc.criticality === "Crítica"
                              ? "bg-red-100 text-red-800"
                              : nc.criticality === "Média"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {nc.criticality}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-600">{nc.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {linkedPlan ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Plano 5W2H Ativo</span>
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedNcForPlan(nc);
                            setFormPlan({
                              title: `Tratamento Corretivo ${nc.code}`,
                              what: `Corrigir e eliminar desvio: ${nc.description}`,
                              why: `Eliminar risco de recorrência e sanar a NC originada em ${nc.origin}`,
                              where: "Planta Industrial Paulínia",
                              who: nc.responsible_name,
                              when_deadline: nc.deadline,
                              how: "Revisar procedimento, substituir peças danificadas e reavaliar eficácia",
                              how_much: "R$ 0,00"
                            });
                          }}
                          className="px-2.5 py-1 rounded-md bg-forest text-white font-semibold text-[11px] hover:bg-forest/90 cursor-pointer transition-colors"
                        >
                          Criar 5W2H
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CRIAR PLANO DE AÇÃO 5W2H PARA A NC */}
      {selectedNcForPlan ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h3 className="font-bold text-primary text-base">Criar Plano 5W2H para {selectedNcForPlan.code}</h3>
                <p className="text-xs text-slate-500">Metodologia 5W2H de Ação Corretiva</p>
              </div>
              <button onClick={() => setSelectedNcForPlan(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onCreateActionPlan({
                  origin_type: "INSPECAO",
                  origin_id: selectedNcForPlan.id,
                  ...formPlan
                });
                setSelectedNcForPlan(null);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700">Título da Ação</label>
                <input
                  type="text"
                  required
                  value={formPlan.title}
                  onChange={(e) => setFormPlan({ ...formPlan, title: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">O Que Será Feito? (What)</label>
                  <input
                    type="text"
                    required
                    value={formPlan.what}
                    onChange={(e) => setFormPlan({ ...formPlan, what: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Por Que? (Why)</label>
                  <input
                    type="text"
                    required
                    value={formPlan.why}
                    onChange={(e) => setFormPlan({ ...formPlan, why: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Onde? (Where)</label>
                  <input
                    type="text"
                    required
                    value={formPlan.where}
                    onChange={(e) => setFormPlan({ ...formPlan, where: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Quem Fará? (Who)</label>
                  <input
                    type="text"
                    required
                    value={formPlan.who}
                    onChange={(e) => setFormPlan({ ...formPlan, who: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Prazo Fatal (When)</label>
                  <input
                    type="date"
                    required
                    value={formPlan.when_deadline}
                    onChange={(e) => setFormPlan({ ...formPlan, when_deadline: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Custo Estimado (How Much)</label>
                  <input
                    type="text"
                    placeholder="Ex.: R$ 850,00"
                    value={formPlan.how_much}
                    onChange={(e) => setFormPlan({ ...formPlan, how_much: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Como Será Feito? (How)</label>
                <textarea
                  required
                  rows={2}
                  value={formPlan.how}
                  onChange={(e) => setFormPlan({ ...formPlan, how: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setSelectedNcForPlan(null)} className="btn-secondary py-1.5 px-3">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Homologar Plano 5W2H
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA NÃO CONFORMIDADE */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Registrar Nova Não Conformidade</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onCreateNC(formNC);
                setIsModalOpen(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700">Origem do Desvio</label>
                <select
                  value={formNC.origin}
                  onChange={(e) => setFormNC({ ...formNC, origin: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                >
                  <option value="Inspeção">Inspeção de Campo</option>
                  <option value="Auditoria">Auditoria Interna / ISO 14001</option>
                  <option value="Requisito Legal">Requisito Legal Descumprido</option>
                  <option value="Condicionante">Condicionante Atrasada ou Não Atendida</option>
                  <option value="Acidente">Acidente / Incidente Ambiental</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Descrição do Desvio Observado</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Relato detalhado da evidência de não conformidade..."
                  value={formNC.description}
                  onChange={(e) => setFormNC({ ...formNC, description: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Análise Inicial de Causa Raiz</label>
                <input
                  type="text"
                  placeholder="Ex.: Falha no procedimento de manutenção preventiva..."
                  value={formNC.root_cause}
                  onChange={(e) => setFormNC({ ...formNC, root_cause: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Criticidade</label>
                  <select
                    value={formNC.criticality}
                    onChange={(e) => setFormNC({ ...formNC, criticality: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Prazo de Resolução</label>
                  <input
                    type="date"
                    required
                    value={formNC.deadline}
                    onChange={(e) => setFormNC({ ...formNC, deadline: e.target.value })}
                    className="w-full mt-1 border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-1.5 px-3">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Salvar NC
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
