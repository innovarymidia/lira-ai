"use client";

import { useState, useEffect } from "react";
import { Search, FileCheck2, ShieldCheck, BookOpen, FileText, ListTodo, Truck, X, ArrowRight } from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemData: any;
  onNavigateTab: (tab: any) => void;
}

export function GlobalSearchModal({ isOpen, onClose, systemData, onNavigateTab }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !systemData) return null;

  const {
    licenses = [],
    conditions = [],
    legislations = [],
    legalRequirements = [],
    tasks = [],
    documents = [],
    wasteRecords = []
  } = systemData;

  const q = query.trim().toLowerCase();

  const matchingLicenses = q
    ? licenses.filter((l: any) => l.number.toLowerCase().includes(q) || l.process_number.toLowerCase().includes(q) || l.issuer_agency.toLowerCase().includes(q))
    : [];

  const matchingConditions = q
    ? conditions.filter((c: any) => c.item_number.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    : [];

  const matchingLegislations = q
    ? legislations.filter((leg: any) => leg.number.toLowerCase().includes(q) || leg.theme.toLowerCase().includes(q) || leg.summary.toLowerCase().includes(q))
    : [];

  const matchingRequirements = q
    ? legalRequirements.filter((r: any) => r.code.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.obligation_text.toLowerCase().includes(q))
    : [];

  const matchingTasks = q
    ? tasks.filter((t: any) => t.title.toLowerCase().includes(q))
    : [];

  const matchingDocs = q
    ? documents.filter((d: any) => d.file_name.toLowerCase().includes(q) || d.subject.toLowerCase().includes(q))
    : [];

  const totalResults =
    matchingLicenses.length +
    matchingConditions.length +
    matchingLegislations.length +
    matchingRequirements.length +
    matchingTasks.length +
    matchingDocs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs pt-20 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Barra de Pesquisa */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Pesquisar qualquer coisa no LIRA AI (licenças, leis, requisitos, resíduos, tarefas)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-primary outline-none placeholder:text-slate-400"
          />
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Resultados */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {q === "" ? (
            <div className="py-8 text-center text-slate-400">
              Digite uma palavra-chave para buscar no Grafo de Conformidade do tenant ativo.
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-slate-500 font-medium">
              Nenhum registro encontrado para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <>
              {/* Licenças */}
              {matchingLicenses.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Licenças Ambientais</span>
                  <div className="mt-1.5 space-y-1.5">
                    {matchingLicenses.map((lic: any) => (
                      <button
                        key={lic.id}
                        onClick={() => {
                          onNavigateTab("licenses");
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="h-4 w-4 text-emerald-600" />
                          <div>
                            <span className="font-bold text-primary">{lic.license_type}: {lic.number}</span>
                            <span className="text-slate-500 text-[11px] block">{lic.issuer_agency} | Vencimento: {lic.expiration_date}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Condicionantes */}
              {matchingConditions.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condicionantes</span>
                  <div className="mt-1.5 space-y-1.5">
                    {matchingConditions.map((cond: any) => (
                      <button
                        key={cond.id}
                        onClick={() => {
                          onNavigateTab("conditions");
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                          <div>
                            <span className="font-bold text-primary">{cond.item_number}</span>
                            <span className="text-slate-500 text-[11px] block">{cond.description.slice(0, 80)}...</span>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Requisitos Legais */}
              {matchingRequirements.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Requisitos Legais</span>
                  <div className="mt-1.5 space-y-1.5">
                    {matchingRequirements.map((req: any) => (
                      <button
                        key={req.id}
                        onClick={() => {
                          onNavigateTab("legislation");
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-cta" />
                          <div>
                            <span className="font-bold text-primary">{req.code} - {req.title}</span>
                            <span className="text-slate-500 text-[11px] block">{req.obligation_text.slice(0, 80)}...</span>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentos */}
              {matchingDocs.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documentos e Laudos</span>
                  <div className="mt-1.5 space-y-1.5">
                    {matchingDocs.map((doc: any) => (
                      <button
                        key={doc.id}
                        onClick={() => {
                          onNavigateTab("documents");
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-600" />
                          <div>
                            <span className="font-bold text-primary">{doc.file_name}</span>
                            <span className="text-slate-500 text-[11px] block">{doc.subject}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Rodapé com atalho */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Pressione <strong>ESC</strong> para fechar</span>
          <span>Dica: Use <strong>Cmd+K</strong> ou <strong>Ctrl+K</strong> em qualquer lugar</span>
        </div>
      </div>
    </div>
  );
}
