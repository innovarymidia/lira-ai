"use client";

import { useState } from "react";
import { AlertOctagon, Plus, ShieldCheck, Filter, AlertTriangle, X } from "lucide-react";
import { Risk } from "@/types";

interface RiskMatrixTabProps {
  risks: Risk[];
  units: any[];
  userName: string;
  onCreateRisk: (data: any) => Promise<void>;
}

export function RiskMatrixTab({ risks, units, userName, onCreateRisk }: RiskMatrixTabProps) {
  const [selectedCell, setSelectedCell] = useState<{ p: number; i: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    unit_id: units[0]?.id || "",
    category: "",
    process_description: "",
    probability: 2,
    impact: 3,
    existing_controls: "",
    status: "Monitorado"
  });

  const getCellScore = (p: number, i: number) => p * i;
  const getCellColor = (score: number) => {
    if (score >= 15) return "bg-red-500/90 text-white border-red-600 hover:bg-red-600";
    if (score >= 8) return "bg-amber-500/90 text-white border-amber-600 hover:bg-amber-600";
    return "bg-emerald-500/90 text-white border-emerald-600 hover:bg-emerald-600";
  };

  const getRisksInCell = (p: number, i: number) => {
    return risks.filter((r) => r.probability === p && r.impact === i);
  };

  const filteredRisks = selectedCell
    ? risks.filter((r) => r.probability === selectedCell.p && r.impact === selectedCell.i)
    : risks;

  const totalCriticos = risks.filter((r) => r.criticality === "Crítico").length;
  const totalMedios = risks.filter((r) => r.criticality === "Médio").length;
  const totalBaixos = risks.filter((r) => r.criticality === "Baixo").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-600" />
            <span>Matriz de Riscos Ambientais (5 x 5)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cálculo de Criticidade = Probabilidade × Impacto. Clique nas células para inspecionar desvios.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-primary text-xs flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          <span>Novo Risco Operacional</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Riscos Críticos (Score ≥ 15)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-700">{totalCriticos}</span>
            <span className="text-xs text-red-600 font-semibold">Exige Plano de Mitigação</span>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Riscos Moderados (8 a 14)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-700">{totalMedios}</span>
            <span className="text-xs text-amber-600 font-semibold">Monitoramento Periódico</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Riscos Baixos (1 a 7)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{totalBaixos}</span>
            <span className="text-xs text-emerald-600 font-semibold">Controles Rotineiros</span>
          </div>
        </div>
      </div>

      {/* Grid Interativo 5x5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-primary">Heatmap de Probabilidade versus Impacto</h3>
            {selectedCell ? (
              <button
                onClick={() => setSelectedCell(null)}
                className="text-xs text-cta hover:underline font-semibold"
              >
                Limpar Filtro ({selectedCell.p}x{selectedCell.i})
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex">
            {/* Eixo Vertical (Probabilidade) */}
            <div className="flex flex-col justify-between pr-2 text-right text-[11px] font-bold text-slate-500 w-24">
              <span>5 (Muito Alta)</span>
              <span>4 (Alta)</span>
              <span>3 (Média)</span>
              <span>2 (Baixa)</span>
              <span>1 (Rara)</span>
            </div>

            {/* Grid 5x5 */}
            <div className="flex-1 grid grid-cols-5 gap-1.5">
              {[5, 4, 3, 2, 1].map((p) =>
                [1, 2, 3, 4, 5].map((i) => {
                  const score = getCellScore(p, i);
                  const inCell = getRisksInCell(p, i);
                  const isSelected = selectedCell?.p === p && selectedCell?.i === i;

                  return (
                    <button
                      key={`${p}-${i}`}
                      onClick={() => setSelectedCell({ p, i })}
                      className={`h-14 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all ${getCellColor(
                        score
                      )} ${isSelected ? "ring-4 ring-slate-900/40 scale-105 z-10" : "shadow-xs"}`}
                    >
                      <span className="text-xs font-black">{score}</span>
                      {inCell.length > 0 ? (
                        <span className="mt-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-black/30">
                          {inCell.length} {inCell.length === 1 ? "risco" : "riscos"}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Eixo Horizontal (Impacto) */}
          <div className="mt-2 flex">
            <div className="w-24"></div>
            <div className="flex-1 grid grid-cols-5 text-center text-[10px] font-bold text-slate-500">
              <span>1 Insignificante</span>
              <span>2 Menor</span>
              <span>3 Moderado</span>
              <span>4 Maior</span>
              <span>5 Catastrófico</span>
            </div>
          </div>
        </div>

        {/* Lista Filtrada de Riscos */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-primary">
                {selectedCell
                  ? `Riscos no Score ${selectedCell.p * selectedCell.i} (${selectedCell.p}x${selectedCell.i})`
                  : "Todos os Riscos Cadastrados"}
              </h3>
              <span className="text-xs text-slate-500 font-semibold">{filteredRisks.length} itens</span>
            </div>

            <div className="mt-3 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredRisks.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Nenhum risco registrado com esses parâmetros.
                </div>
              ) : (
                filteredRisks.map((risk) => (
                  <div key={risk.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{risk.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          risk.criticality === "Crítico"
                            ? "bg-red-100 text-red-800"
                            : risk.criticality === "Médio"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        Score {risk.risk_score} - {risk.criticality}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">{risk.process_description}</p>
                    {risk.existing_controls ? (
                      <p className="mt-2 text-[10px] text-slate-500 font-medium">
                        <strong className="text-slate-700">Controles:</strong> {risk.existing_controls}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: NOVO RISCO */}
      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Novo Risco Ambiental</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onCreateRisk(form);
                setIsModalOpen(false);
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700">Categoria do Risco</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Contaminação de Solo por Efluente"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Descrição do Processo / Cenário Acidental</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detalhamento do evento de risco..."
                  value={form.process_description}
                  onChange={(e) => setForm({ ...form, process_description: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Probabilidade (1 a 5)</label>
                  <select
                    value={form.probability}
                    onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })}
                    className="w-full mt-1 border rounded-lg p-2"
                  >
                    <option value={1}>1 - Rara</option>
                    <option value={2}>2 - Baixa</option>
                    <option value={3}>3 - Média</option>
                    <option value={4}>4 - Alta</option>
                    <option value={5}>5 - Muito Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Impacto (1 a 5)</label>
                  <select
                    value={form.impact}
                    onChange={(e) => setForm({ ...form, impact: Number(e.target.value) })}
                    className="w-full mt-1 border rounded-lg p-2"
                  >
                    <option value={1}>1 - Insignificante</option>
                    <option value={2}>2 - Menor</option>
                    <option value={3}>3 - Moderado</option>
                    <option value={4}>4 - Maior</option>
                    <option value={5}>5 - Catastrófico</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center font-bold">
                <span>Score Calculado:</span>
                <span className="text-forest text-sm">
                  {form.probability * form.impact} -{" "}
                  {form.probability * form.impact >= 15 ? "CRÍTICO" : form.probability * form.impact >= 8 ? "MÉDIO" : "BAIXO"}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Controles Existentes / Barreira Preventiva</label>
                <input
                  type="text"
                  placeholder="Ex.: Bacias de contenção cega e sensor de nível"
                  value={form.existing_controls}
                  onChange={(e) => setForm({ ...form, existing_controls: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-1.5 px-3">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Salvar Risco
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
