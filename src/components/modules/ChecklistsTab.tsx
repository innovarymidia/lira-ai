"use client";

import { useState, useEffect } from "react";
import {
  ClipboardCheck,
  Plus,
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Camera,
  MapPin,
  Play,
  Check,
  X,
  Smartphone
} from "lucide-react";
import { Checklist, ChecklistQuestion } from "@/types";

interface ChecklistsTabProps {
  checklists: Checklist[];
  inspections: any[];
  units: any[];
  userName: string;
  onCreateChecklist: (data: any) => Promise<void>;
  onSyncInspections: (batch: any[]) => Promise<{ syncedCount: number; createdNCsCount: number }>;
}

export function ChecklistsTab({
  checklists,
  inspections,
  units,
  userName,
  onCreateChecklist,
  onSyncInspections
}: ChecklistsTabProps) {
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  // Modais e Estados
  const [isNewChecklistModalOpen, setIsNewChecklistModalOpen] = useState(false);
  const [activeInspectionSession, setActiveInspectionSession] = useState<{
    checklist: Checklist;
    unit_id: string;
    started_at: string;
    answers: Record<string, { is_conforming: boolean; value: any; notes?: string }>;
  } | null>(null);

  // Form de Novo Checklist
  const [formChecklist, setFormChecklist] = useState({
    title: "",
    category: "Operações Gerais",
    questions: [
      {
        id: `q-${Date.now()}-1`,
        checklist_id: "",
        question_order: 1,
        prompt: "",
        response_type: "BOOLEAN" as const,
        requires_photo_on_failure: true,
        criticality: "ALTA" as const
      }
    ]
  });

  // Carregar fila offline do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lira_offline_queue");
      if (saved) {
        setOfflineQueue(JSON.parse(saved));
      }
    } catch {
      // Ignorar erros de SSR ou permissões
    }
  }, []);

  const saveOfflineQueue = (queue: any[]) => {
    setOfflineQueue(queue);
    try {
      localStorage.setItem("lira_offline_queue", JSON.stringify(queue));
    } catch {
      // Fallback
    }
  };

  const handleAddQuestionToForm = () => {
    setFormChecklist({
      ...formChecklist,
      questions: [
        ...formChecklist.questions,
        {
          id: `q-${Date.now()}-${formChecklist.questions.length + 1}`,
          checklist_id: "",
          question_order: formChecklist.questions.length + 1,
          prompt: "",
          response_type: "BOOLEAN",
          requires_photo_on_failure: true,
          criticality: "ALTA"
        }
      ]
    });
  };

  const handleStartInspection = (checklist: Checklist) => {
    const defaultAnswers: Record<string, any> = {};
    checklist.questions.forEach((q) => {
      defaultAnswers[q.id] = {
        is_conforming: true,
        value: true,
        notes: ""
      };
    });

    setActiveInspectionSession({
      checklist,
      unit_id: units[0]?.id || "unit-1",
      started_at: new Date().toISOString(),
      answers: defaultAnswers
    });
  };

  const handleFinishInspection = async () => {
    if (!activeInspectionSession) return;

    const formattedAnswers = activeInspectionSession.checklist.questions.map((q) => {
      const ans = activeInspectionSession.answers[q.id] || { is_conforming: true, value: true };
      return {
        question_id: q.id,
        prompt: q.prompt,
        is_conforming: ans.is_conforming,
        value: ans.value,
        criticality: q.criticality,
        notes: ans.notes || ""
      };
    });

    const inspectionPayload = {
      client_local_id: `insp-offline-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      organization_id: "org-1",
      unit_id: activeInspectionSession.unit_id,
      checklist_id: activeInspectionSession.checklist.id,
      title: activeInspectionSession.checklist.title,
      answers: formattedAnswers,
      started_at: activeInspectionSession.started_at,
      completed_at: new Date().toISOString(),
      latitude: -22.7569,
      longitude: -47.1512
    };

    if (isSimulatingOffline) {
      // Armazenar na fila local offline
      const updatedQueue = [...offlineQueue, inspectionPayload];
      saveOfflineQueue(updatedQueue);
      alert("Dispositivo em MODO OFFLINE: Inspeção salva na fila local do dispositivo. Sincronize ao recuperar sinal!");
    } else {
      // Enviar diretamente para sincronização no servidor
      await onSyncInspections([inspectionPayload]);
    }

    setActiveInspectionSession(null);
  };

  const handleProcessSyncQueue = async () => {
    if (offlineQueue.length === 0) return;
    const res = await onSyncInspections(offlineQueue);
    saveOfflineQueue([]);
    alert(`Sincronização Concluída! ${res.syncedCount} inspeções sincronizadas e ${res.createdNCsCount} Não Conformidades geradas no Grafo.`);
  };

  return (
    <div className="space-y-6">
      {/* Header com Toggle de Simulação Offline */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-forest" />
            <span>Checklists e Inspeções de Campo Mobile-Ready</span>
          </h2>
          <p className="text-xs text-slate-500">
            Execução de auditorias operacionais com suporte nativo a funcionamento offline e fila de sincronização.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle de Simulação de Campo Sem Internet */}
          <button
            onClick={() => setIsSimulatingOffline(!isSimulatingOffline)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isSimulatingOffline
                ? "bg-amber-500 text-white shadow-md animate-pulse"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
            title="Simular perda de conexão com a internet para testar a fila de sincronização local"
          >
            {isSimulatingOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4 text-emerald-600" />}
            <span>{isSimulatingOffline ? "Modo Offline Ativo (Sem Sinal)" : "Conexão Online"}</span>
          </button>

          {offlineQueue.length > 0 && (
            <button
              onClick={handleProcessSyncQueue}
              className="btn-primary text-xs flex items-center gap-1.5 shadow-sm bg-cta hover:bg-cta/90"
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Sincronizar Fila ({offlineQueue.length})</span>
            </button>
          )}

          <button
            onClick={() => setIsNewChecklistModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Novo Checklist</span>
          </button>
        </div>
      </div>

      {/* Alerta de Fila Offline Pendente */}
      {offlineQueue.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Fila Local de Campo:</strong> Existem <strong>{offlineQueue.length}</strong> inspeções salvas no armazenamento local do dispositivo aguardando envio.
            </span>
          </div>
          <button
            onClick={handleProcessSyncQueue}
            className="px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer transition-colors"
          >
            Enviar Agora
          </button>
        </div>
      )}

      {/* Grid de Checklists Cadastrados */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-primary">Modelos de Checklists Operacionais</h3>
          <span className="text-xs text-slate-500 font-semibold">{checklists.length} modelos</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklists.map((chk) => (
            <div key={chk.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest/10 text-forest">
                    {chk.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Versão {chk.version}</span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-primary">{chk.title}</h4>
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  {chk.questions.length} itens de verificação técnica
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {chk.questions.slice(0, 3).map((q, idx) => (
                    <span
                      key={q.id}
                      className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-600"
                    >
                      {idx + 1}. {q.prompt.slice(0, 30)}...
                    </span>
                  ))}
                  {chk.questions.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] text-slate-600 font-bold">
                      +{chk.questions.length - 3} itens
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Pronto para Campo</span>
                </span>

                <button
                  onClick={() => handleStartInspection(chk)}
                  className="px-3 py-1.5 rounded-lg bg-forest hover:bg-forest/90 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Play className="h-3 w-3 fill-current" />
                  <span>Iniciar Inspeção</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico Recente de Inspeções */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-primary">Histórico de Inspeções Homologadas</h3>
          <span className="text-xs text-slate-500 font-semibold">{inspections.length} relatórios</span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <th className="py-2.5 px-3 font-semibold">Inspeção Realizada</th>
                <th className="py-2.5 px-3 font-semibold">Inspetor Responsável</th>
                <th className="py-2.5 px-3 font-semibold">Data</th>
                <th className="py-2.5 px-3 font-semibold">Score de Conformidade</th>
                <th className="py-2.5 px-3 font-semibold">Desvios</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspections.map((insp) => (
                <tr key={insp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-primary block">{insp.title}</span>
                    <span className="text-[11px] text-slate-500">{insp.observations || "Sem observações adicionais."}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">{insp.inspector_name}</td>
                  <td className="py-3 px-3 text-slate-600">{insp.inspection_date}</td>
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-forest text-xs">{insp.score_percentage}%</span>
                  </td>
                  <td className="py-3 px-3">
                    {insp.deviations_count > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        {insp.deviations_count} desvios
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        100% Conforme
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {insp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SESSÃO ATIVA DE INSPEÇÃO (SIMULADOR MOBILE DE CAMPO) */}
      {activeInspectionSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header do App Mobile */}
            <div className="p-4 bg-forest text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-digital" />
                <div>
                  <h3 className="font-bold text-sm leading-tight">{activeInspectionSession.checklist.title}</h3>
                  <p className="text-[10px] text-slate-300">
                    {isSimulatingOffline ? "Sessão Offline Local (Armazenado no Dispositivo)" : "Sessão Conectada à API"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveInspectionSession(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Corpo de Perguntas */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Inspetor em Campo:</span>
                  <p className="font-bold text-slate-800">{userName}</p>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
                  <MapPin className="h-4 w-4 text-cta" />
                  <span>Paulínia, SP (GPS Gravado)</span>
                </div>
              </div>

              {activeInspectionSession.checklist.questions.map((q, idx) => {
                const currentAnswer = activeInspectionSession.answers[q.id] || { is_conforming: true, value: true };

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      currentAnswer.is_conforming
                        ? "border-slate-200 bg-white"
                        : "border-red-300 bg-red-50/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400">ITEM {idx + 1} ({q.criticality})</span>
                        <p className="mt-0.5 text-xs font-bold text-primary">{q.prompt}</p>
                      </div>

                      {/* Botoes de Resposta Conforme / Nao Conforme */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveInspectionSession({
                              ...activeInspectionSession,
                              answers: {
                                ...activeInspectionSession.answers,
                                [q.id]: {
                                  ...currentAnswer,
                                  is_conforming: true,
                                  value: true
                                }
                              }
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                            currentAnswer.is_conforming
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Conforme</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveInspectionSession({
                              ...activeInspectionSession,
                              answers: {
                                ...activeInspectionSession.answers,
                                [q.id]: {
                                  ...currentAnswer,
                                  is_conforming: false,
                                  value: false
                                }
                              }
                            });
                          }}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                            !currentAnswer.is_conforming
                              ? "bg-red-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>Não Conforme</span>
                        </button>
                      </div>
                    </div>

                    {/* Se marcado como Não Conforme: Exige justificativa e alerta de Não Conformidade automática */}
                    {!currentAnswer.is_conforming && (
                      <div className="mt-3 pt-3 border-t border-red-200 space-y-2">
                        <div className="flex items-center gap-1.5 text-red-700 font-bold text-[11px]">
                          <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>Atenção: Este desvio gerará automaticamente uma Não Conformidade (NC) no Grafo.</span>
                        </div>

                        <input
                          type="text"
                          required
                          placeholder="Descreva o desvio observado no local..."
                          value={currentAnswer.notes || ""}
                          onChange={(e) => {
                            setActiveInspectionSession({
                              ...activeInspectionSession,
                              answers: {
                                ...activeInspectionSession.answers,
                                [q.id]: {
                                  ...currentAnswer,
                                  notes: e.target.value
                                }
                              }
                            });
                          }}
                          className="w-full border border-red-300 rounded-lg p-2 text-xs bg-white text-slate-800"
                        />

                        {q.requires_photo_on_failure && (
                          <div className="flex items-center gap-2 text-slate-600 text-[11px] font-semibold">
                            <Camera className="h-4 w-4 text-slate-400" />
                            <span>Evidência fotográfica anexada (Câmera do dispositivo)</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rodapé de Ação */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-medium">
                {activeInspectionSession.checklist.questions.length} perguntas respondidas
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveInspectionSession(null)}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleFinishInspection}
                  className="btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="h-4 w-4" />
                  <span>Finalizar Inspeção de Campo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVO CHECKLIST */}
      {isNewChecklistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-bold text-primary text-base">Criar Novo Modelo de Checklist</h3>
              <button
                onClick={() => setIsNewChecklistModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await onCreateChecklist(formChecklist);
                setIsNewChecklistModalOpen(false);
              }}
              className="mt-4 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700">Título do Checklist</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Inspeção Mensal de Caldeiras e ETE"
                  value={formChecklist.title}
                  onChange={(e) => setFormChecklist({ ...formChecklist, title: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Categoria Operacional</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Bacias de Contenção / Efluentes"
                  value={formChecklist.category}
                  onChange={(e) => setFormChecklist({ ...formChecklist, category: e.target.value })}
                  className="w-full mt-1 border rounded-lg p-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between pb-1 border-b">
                  <label className="font-semibold text-slate-700">Perguntas de Verificação</label>
                  <button
                    type="button"
                    onClick={handleAddQuestionToForm}
                    className="text-xs text-cta hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Adicionar Pergunta</span>
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {formChecklist.questions.map((q, idx) => (
                    <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[11px] text-slate-500">Pergunta {idx + 1}</span>
                        <select
                          value={q.criticality}
                          onChange={(e) => {
                            const updated = [...formChecklist.questions];
                            updated[idx].criticality = e.target.value as any;
                            setFormChecklist({ ...formChecklist, questions: updated });
                          }}
                          className="text-[10px] border rounded px-1.5 py-0.5 bg-white font-bold"
                        >
                          <option value="BAIXA">Criticidade Baixa</option>
                          <option value="MEDIA">Criticidade Média</option>
                          <option value="ALTA">Criticidade Alta</option>
                          <option value="CRITICA">Criticidade Crítica</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Texto da pergunta para o operador em campo..."
                        value={q.prompt}
                        onChange={(e) => {
                          const updated = [...formChecklist.questions];
                          updated[idx].prompt = e.target.value;
                          setFormChecklist({ ...formChecklist, questions: updated });
                        }}
                        className="w-full border rounded-lg p-2 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewChecklistModalOpen(false)}
                  className="btn-secondary py-1.5 px-3"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Salvar Checklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
