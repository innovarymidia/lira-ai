"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, AlertTriangle, FileCheck2, ShieldCheck, ListTodo, Award } from "lucide-react";

interface CalendarTabProps {
  licenses: any[];
  conditions: any[];
  tasks: any[];
  audits: any[];
}

export function CalendarTab({ licenses, conditions, tasks, audits }: CalendarTabProps) {
  const [filterType, setFilterType] = useState("TODOS");

  // Consolidar todos os eventos cronológicos
  const events: Array<{
    id: string;
    date: string;
    title: string;
    subtitle: string;
    type: "LICENSE" | "CONDITION" | "TASK" | "AUDIT";
    statusBadge: string;
    isUrgent: boolean;
  }> = [];

  // 1. Licencas (vencimento e prazo de 120 dias)
  licenses.forEach((lic) => {
    events.push({
      id: `lic-${lic.id}`,
      date: lic.expiration_date,
      title: `Vencimento da ${lic.license_type}: ${lic.number}`,
      subtitle: `${lic.issuer_agency} | Prazo Limite Renovação: ${lic.renewal_deadline}`,
      type: "LICENSE",
      statusBadge: lic.status,
      isUrgent: lic.status === "Alerta Renovação" || lic.status === "Vencida"
    });
  });

  // 2. Condicionantes
  conditions.forEach((cond) => {
    events.push({
      id: `cond-${cond.id}`,
      date: cond.deadline,
      title: `Prazo de Cumprimento: ${cond.item_number}`,
      subtitle: cond.description.slice(0, 100) + "...",
      type: "CONDITION",
      statusBadge: cond.status,
      isUrgent: cond.status === "Em Atraso" || cond.status === "Pendente"
    });
  });

  // 3. Tarefas
  tasks.forEach((task) => {
    events.push({
      id: `task-${task.id}`,
      date: task.due_date,
      title: `Execução de Tarefa: ${task.title}`,
      subtitle: `Responsável: ${task.assigned_to_name || "Equipe"}`,
      type: "TASK",
      statusBadge: task.status,
      isUrgent: task.priority === "CRITICAL" || task.priority === "HIGH"
    });
  });

  // 4. Auditorias
  audits.forEach((aud) => {
    events.push({
      id: `aud-${aud.id}`,
      date: aud.audit_date,
      title: `Auditoria Programada: ${aud.standard}`,
      subtitle: `Auditor Líder: ${aud.lead_auditor} | Escopo: ${aud.scope}`,
      type: "AUDIT",
      statusBadge: aud.status,
      isUrgent: false
    });
  });

  // Ordenar por data mais próxima
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredEvents = events.filter((ev) => {
    if (filterType === "TODOS") return true;
    return ev.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-primary flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-water" />
            <span>Calendário Ambiental Unificado</span>
          </h2>
          <p className="text-xs text-slate-500">
            Linha do tempo consolidada de vencimentos de licenças, prazos de condicionantes, tarefas e auditorias.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 bg-white"
          >
            <option value="TODOS">Todos os Eventos ({events.length})</option>
            <option value="LICENSE">Apenas Licenças</option>
            <option value="CONDITION">Apenas Condicionantes</option>
            <option value="TASK">Apenas Tarefas</option>
            <option value="AUDIT">Apenas Auditorias</option>
          </select>
        </div>
      </div>

      {/* Timeline de Eventos */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="space-y-4">
          {filteredEvents.map((ev, idx) => {
            const daysDiff = Math.round(
              (new Date(ev.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={ev.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  ev.isUrgent
                    ? "border-amber-300 bg-amber-50/50"
                    : "border-slate-100 bg-slate-50/60 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 ${
                      ev.type === "LICENSE"
                        ? "bg-emerald-100 text-emerald-800"
                        : ev.type === "CONDITION"
                        ? "bg-blue-100 text-blue-800"
                        : ev.type === "TASK"
                        ? "bg-slate-200 text-slate-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {ev.type === "LICENSE" ? (
                      <FileCheck2 className="h-5 w-5" />
                    ) : ev.type === "CONDITION" ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : ev.type === "TASK" ? (
                      <ListTodo className="h-5 w-5" />
                    ) : (
                      <Award className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{ev.title}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-700">
                        {ev.statusBadge}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">{ev.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800 block">
                      {new Date(ev.date + "T12:00:00").toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        daysDiff < 0
                          ? "text-red-600"
                          : daysDiff <= 30
                          ? "text-amber-600"
                          : "text-slate-400"
                      }`}
                    >
                      {daysDiff < 0
                        ? `Vencido há ${Math.abs(daysDiff)} dias`
                        : daysDiff === 0
                        ? "Vence hoje"
                        : `Em ${daysDiff} dias`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
