"use client";

import React, { useState } from "react";
import {
  Truck,
  Plus,
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  X,
  Search,
  Filter,
  Check,
  ExternalLink
} from "lucide-react";
import { Supplier, WasteType } from "@/types";

interface WasteTabProps {
  wasteRecords: any[];
  suppliers: Supplier[];
  wasteTypes: WasteType[];
  units: any[];
  userName: string;
  onCreateWaste: (data: any) => Promise<boolean>;
  onCreateSupplier: (data: any) => Promise<boolean>;
  onUpdateSupplierLicense: (data: any) => Promise<boolean>;
}

export function WasteTab({
  wasteRecords,
  suppliers = [],
  wasteTypes = [],
  units = [],
  userName,
  onCreateWaste,
  onCreateSupplier,
  onUpdateSupplierLicense
}: WasteTabProps) {
  const [subTab, setSubTab] = useState<"movements" | "suppliers" | "catalog">("movements");
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");

  // Modais
  const [isNewMovementModalOpen, setIsNewMovementModalOpen] = useState(false);
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);
  const [selectedSupplierForUpdate, setSelectedSupplierForUpdate] = useState<Supplier | null>(null);

  // Form Movimentação
  const [formMovement, setFormMovement] = useState({
    unit_id: units[0]?.id || "",
    waste_type_id: wasteTypes[0]?.id || "",
    waste_code: wasteTypes[0]?.code_ibama || "13 02 05*",
    description: wasteTypes[0]?.description || "Óleos lubrificantes usados",
    classification: wasteTypes[0]?.hazard_class || "Classe I Perigoso",
    quantity: "5.0",
    unit_of_measure: "toneladas",
    transporter_id: suppliers.find((s) => s.role === "TRANSPORTADOR" || s.role === "AMBOS")?.id || "",
    destination_supplier_id: suppliers.find((s) => s.role === "DESTINADOR" || s.role === "AMBOS")?.id || "",
    destination_type: "Coprocessamento",
    mtr_number: `MTR-BR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    cdf_number: "",
    cdf_issue_date: ""
  });

  // Form Fornecedor
  const [formSupplier, setFormSupplier] = useState({
    trade_name: "",
    corporate_name: "",
    national_id: "",
    role: "TRANSPORTADOR" as const,
    license_number: "",
    license_agency: "CETESB",
    license_expiration_date: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
    license_status: "VIGENTE" as const,
    is_active: true
  });

  // Form Atualizar Licença
  const [updateLicenseForm, setUpdateLicenseForm] = useState<{
    license_number: string;
    license_expiration_date: string;
    license_status: "VIGENTE" | "VENCIDA" | "EM_RENOVACAO";
  }>({
    license_number: "",
    license_expiration_date: "",
    license_status: "VIGENTE"
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Verificação em tempo real de licença vencida
  const selectedTransporter = suppliers.find((s) => s.id === formMovement.transporter_id);
  const selectedDestination = suppliers.find((s) => s.id === formMovement.destination_supplier_id);

  const isTransporterExpired =
    selectedTransporter &&
    (selectedTransporter.license_status === "VENCIDA" ||
      new Date(selectedTransporter.license_expiration_date) < new Date());

  const isDestinationExpired =
    selectedDestination &&
    (selectedDestination.license_status === "VENCIDA" ||
      new Date(selectedDestination.license_expiration_date) < new Date());

  const isHazardousClassI = formMovement.classification === "Classe I Perigoso";
  const hasLockConflict = isHazardousClassI && (isTransporterExpired || isDestinationExpired);

  // Totais
  const totalWeight = wasteRecords.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  const classICount = wasteRecords.filter((w) => w.classification === "Classe I Perigoso").length;
  const cdfDeliveredCount = wasteRecords.filter((w) => w.status === "Destinado com CDF").length;
  const activeSuppliersCount = suppliers.filter((s) => s.license_status === "VIGENTE").length;

  const filteredMovements = wasteRecords.filter((w) => {
    const matchesSearch =
      w.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.waste_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.mtr_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.transporter_name && w.transporter_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = classFilter === "ALL" || w.classification === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleSelectWasteType = (typeId: string) => {
    const selected = wasteTypes.find((wt) => wt.id === typeId);
    if (selected) {
      setFormMovement((prev) => ({
        ...prev,
        waste_type_id: selected.id,
        waste_code: selected.code_ibama,
        description: selected.description,
        classification: selected.hazard_class,
        unit_of_measure: selected.default_unit
      }));
    }
  };

  const handleSubmitMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const transporterName = selectedTransporter?.trade_name || "Transportador não informado";
    const destinationName = selectedDestination?.trade_name || "Destinador não informado";

    const payload = {
      ...formMovement,
      transporter_name: transporterName,
      destination_company: destinationName
    };

    const ok = await onCreateWaste(payload);
    if (ok) {
      setIsNewMovementModalOpen(false);
      setFormMovement({
        ...formMovement,
        mtr_number: `MTR-BR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        cdf_number: ""
      });
    }
  };

  const handleSubmitSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onCreateSupplier(formSupplier);
    if (ok) {
      setIsNewSupplierModalOpen(false);
      setFormSupplier({
        trade_name: "",
        corporate_name: "",
        national_id: "",
        role: "TRANSPORTADOR",
        license_number: "",
        license_agency: "CETESB",
        license_expiration_date: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
        license_status: "VIGENTE",
        is_active: true
      });
    }
  };

  const handleOpenUpdateLicense = (supplier: Supplier) => {
    setSelectedSupplierForUpdate(supplier);
    setUpdateLicenseForm({
      license_number: supplier.license_number,
      license_expiration_date: supplier.license_expiration_date,
      license_status: supplier.license_status
    });
  };

  const handleSubmitUpdateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierForUpdate) return;
    const ok = await onUpdateSupplierLicense({
      supplier_id: selectedSupplierForUpdate.id,
      ...updateLicenseForm
    });
    if (ok) {
      setSelectedSupplierForUpdate(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-compliance">Epic 18 • MTR & Resíduos</span>
            <span className="badge-legal">ABNT NBR 10.004</span>
          </div>
          <h2 className="text-xl font-bold text-forest mt-1">Gestão de Resíduos, MTR e Qualificação de Fornecedores</h2>
          <p className="text-xs text-muted">
            Rastreabilidade de ponta a ponta com bloqueio automatizado de MTR para fornecedores com licença vencida (Invariante 5.3).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsNewMovementModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Novo MTR de Resíduos</span>
          </button>
          <button
            onClick={() => setIsNewSupplierModalOpen(true)}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Building2 className="h-4 w-4" />
            <span>Cadastrar Fornecedor</span>
          </button>
        </div>
      </div>

      {/* Cartões de Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-environmental/30 bg-environmental/10 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">Volume Destinado</span>
            <Truck className="h-5 w-5 text-environmental" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-forest">{totalWeight.toFixed(1)}</span>
            <span className="text-xs font-semibold text-environmental">toneladas</span>
          </div>
          <p className="mt-1 text-[11px] text-muted">{wasteRecords.length} movimentações registradas</p>
        </div>

        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Resíduos Classe I</span>
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-900">{classICount}</span>
            <span className="text-xs font-semibold text-rose-700">Perigosos</span>
          </div>
          <p className="mt-1 text-[11px] text-rose-700">Controle estrito de MTR e fornecedor</p>
        </div>

        <div className="rounded-xl border border-water/30 bg-water/10 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-water">Com CDF Homologado</span>
            <CheckCircle2 className="h-5 w-5 text-water" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-forest">{cdfDeliveredCount}</span>
            <span className="text-xs font-semibold text-water">Certificados</span>
          </div>
          <p className="mt-1 text-[11px] text-muted">
            {wasteRecords.length - cdfDeliveredCount} aguardando retorno do destinador
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-forest">Fornecedores Aptos</span>
            <ShieldCheck className="h-5 w-5 text-environmental" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-forest">{activeSuppliersCount}</span>
            <span className="text-xs font-semibold text-slate-500">de {suppliers.length} cadastrados</span>
          </div>
          <p className="mt-1 text-[11px] text-muted">Licenças ambientais vigentes</p>
        </div>
      </div>

      {/* Sub-navegação interna */}
      <div className="border-b border-border">
        <div className="flex space-x-4 text-xs font-semibold">
          <button
            onClick={() => setSubTab("movements")}
            className={`pb-2.5 pt-1 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              subTab === "movements"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-muted hover:text-forest"
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Movimentações de Resíduos & MTR ({wasteRecords.length})</span>
          </button>
          <button
            onClick={() => setSubTab("suppliers")}
            className={`pb-2.5 pt-1 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              subTab === "suppliers"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-muted hover:text-forest"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Fornecedores Homologados & Trava Legal ({suppliers.length})</span>
          </button>
          <button
            onClick={() => setSubTab("catalog")}
            className={`pb-2.5 pt-1 border-b-2 cursor-pointer transition-colors flex items-center gap-1.5 ${
              subTab === "catalog"
                ? "border-forest text-forest font-bold"
                : "border-transparent text-muted hover:text-forest"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Catálogo Oficial IBAMA ({wasteTypes.length})</span>
          </button>
        </div>
      </div>

      {/* ABA 1: MOVIMENTAÇÕES DE RESÍDUOS */}
      {subTab === "movements" ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-xl border border-border">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                placeholder="Buscar por MTR, código, resíduo ou transportador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border focus:ring-1 focus:ring-forest outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-3.5 w-3.5 text-muted" />
              <span className="text-xs text-muted">Classe:</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="text-xs rounded-lg border border-border py-1.5 px-2.5 outline-none focus:ring-1 focus:ring-forest"
              >
                <option value="ALL">Todas as Classes</option>
                <option value="Classe I Perigoso">Classe I (Perigoso)</option>
                <option value="Classe IIA Não Inerte">Classe IIA (Não Inerte)</option>
                <option value="Classe IIB Inerte">Classe IIB (Inerte)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Código IBAMA & Resíduo</th>
                    <th className="px-4 py-3">Classificação de Risco</th>
                    <th className="px-4 py-3">Quantidade</th>
                    <th className="px-4 py-3">Transportador & Destinador</th>
                    <th className="px-4 py-3">MTR e CDF</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredMovements.map((w: any) => (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-medium text-forest">
                        <div className="font-mono font-bold text-primary">{w.waste_code}</div>
                        <div className="text-[11px] text-muted line-clamp-1">{w.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            w.classification === "Classe I Perigoso"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : w.classification === "Classe IIA Não Inerte"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {w.classification}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-forest">
                        {w.quantity} {w.unit_of_measure}
                      </td>
                      <td className="px-4 py-3 text-muted text-[11px]">
                        <div className="font-semibold text-slate-700">{w.transporter_name}</div>
                        <div className="text-slate-500">Destino: {w.destination_company} ({w.destination_type})</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div className="text-primary font-bold">{w.mtr_number}</div>
                        {w.cdf_number ? (
                          <div className="text-environmental font-semibold flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>CDF: {w.cdf_number}</span>
                          </div>
                        ) : (
                          <span className="text-cerrado font-medium text-[10px]">Aguardando CDF</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            w.status === "Destinado com CDF"
                              ? "bg-environmental/15 text-forest border border-environmental/30"
                              : "bg-cerrado/15 text-cerrado border border-cerrado/30"
                          }`}
                        >
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredMovements.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted">
                        Nenhuma movimentação de resíduo encontrada para os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* ABA 2: FORNECEDORES & TRAVA LEGAL */}
      {subTab === "suppliers" ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">Regra Invariante de Negócio (Seção 5.3): Trava de Licença Vencida</span>
              <p className="mt-0.5 text-amber-800">
                O sistema LIRA AI bloqueia categoricamente a emissão de MTR para resíduos de alta periculosidade (Classe I)
                caso o Transportador ou o Destinador final esteja com a licença ambiental vencida perante o órgão regulador
                (CETESB, IBAMA, FEAM, IAT, etc.).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((sup) => {
              const isExpired = sup.license_status === "VENCIDA" || new Date(sup.license_expiration_date) < new Date();
              return (
                <div
                  key={sup.id}
                  className={`rounded-xl border p-4 bg-white shadow-xs space-y-3 transition-all ${
                    isExpired ? "border-rose-300 bg-rose-50/20" : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-forest text-sm">{sup.trade_name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sup.role === "TRANSPORTADOR"
                              ? "bg-sky-100 text-sky-800"
                              : sup.role === "DESTINADOR"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {sup.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted">{sup.corporate_name} • CNPJ: {sup.national_id}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        isExpired
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-environmental/15 text-forest border border-environmental/30"
                      }`}
                    >
                      {isExpired ? (
                        <>
                          <AlertTriangle className="h-3 w-3 text-rose-600" />
                          <span>Licença Vencida</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-3 w-3 text-environmental" />
                          <span>Apto / Vigente</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2.5 text-xs space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted">Licença Ambiental:</span>
                      <span className="font-bold text-primary">{sup.license_number} ({sup.license_agency})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Data de Validade:</span>
                      <span className={`font-bold ${isExpired ? "text-rose-700" : "text-forest"}`}>
                        {sup.license_expiration_date}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-muted">
                      {isExpired ? "Bloqueado para Resíduos Classe I" : "Homologado para transporte e destinação"}
                    </span>
                    <button
                      onClick={() => handleOpenUpdateLicense(sup)}
                      className="text-xs font-semibold text-forest hover:text-environmental cursor-pointer hover:underline"
                    >
                      Atualizar Licença
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ABA 3: CATÁLOGO OFICIAL IBAMA */}
      {subTab === "catalog" ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-border shadow-xs">
            <h3 className="font-bold text-forest text-sm">Classificação Oficial de Resíduos Sólidos (IBAMA)</h3>
            <p className="text-xs text-muted mt-0.5">
              Baseada na Lista Brasileira de Resíduos Sólidos e Instrução Normativa IBAMA nº 13/2012. Os resíduos marcados
              com asterisco (*) são classificados como perigosos por definição regulatória.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white shadow-xs overflow-hidden">
            <table className="min-w-full divide-y divide-border text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Código IBAMA</th>
                  <th className="px-4 py-3">Descrição Técnica Oficial</th>
                  <th className="px-4 py-3">Classificação de Periculosidade</th>
                  <th className="px-4 py-3">Estado Físico</th>
                  <th className="px-4 py-3">Unidade Padrão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {wasteTypes.map((wt) => (
                  <tr key={wt.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-primary">{wt.code_ibama}</td>
                    <td className="px-4 py-3 text-slate-800">{wt.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          wt.hazard_class === "Classe I Perigoso"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : wt.hazard_class === "Classe IIA Não Inerte"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {wt.hazard_class}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{wt.physical_state}</td>
                    <td className="px-4 py-3 font-semibold text-muted">{wt.default_unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVA MOVIMENTAÇÃO DE RESÍDUO */}
      {isNewMovementModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-forest text-base">Nova Movimentação de Resíduo & Emissão de MTR</h3>
                <p className="text-xs text-muted">Manifesto de Transporte de Resíduos com validação de conformidade legal.</p>
              </div>
              <button
                onClick={() => setIsNewMovementModalOpen(false)}
                className="text-muted hover:text-forest cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMovement} className="mt-4 space-y-3.5 text-xs">
              {/* ALERTA DE TRAVA LEGAL EM TEMPO REAL */}
              {hasLockConflict && (
                <div className="rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">BLOQUEIO LEGAL ATIVO (Invariante 5.3)</span>
                    <p className="text-[11px] mt-0.5">
                      Não é permitido emitir MTR para resíduo <strong>Classe I Perigoso</strong> com o transportador
                      ou o destinador selecionado com <strong>Licença Ambiental Vencida</strong>.
                      Substitua o fornecedor por um parceiro com licença vigente ou regularize o cadastro antes de prosseguir.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Unidade Geradora</label>
                  <select
                    value={formMovement.unit_id}
                    onChange={(e) => setFormMovement({ ...formMovement, unit_id: e.target.value })}
                    className="w-full mt-1 border border-border rounded-lg p-2 bg-white"
                    required
                  >
                    {units.map((u: any) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.city}/{u.state})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Resíduo Padrão (Catálogo IBAMA)</label>
                  <select
                    value={formMovement.waste_type_id}
                    onChange={(e) => handleSelectWasteType(e.target.value)}
                    className="w-full mt-1 border border-border rounded-lg p-2 bg-white"
                  >
                    {wasteTypes.map((wt) => (
                      <option key={wt.id} value={wt.id}>
                        {wt.code_ibama} - {wt.description.substring(0, 35)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Código IBAMA</label>
                  <input
                    type="text"
                    required
                    value={formMovement.waste_code}
                    onChange={(e) => setFormMovement({ ...formMovement, waste_code: e.target.value })}
                    className="w-full mt-1 border border-border rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Classificação ABNT</label>
                  <select
                    value={formMovement.classification}
                    onChange={(e) => setFormMovement({ ...formMovement, classification: e.target.value as any })}
                    className="w-full mt-1 border border-border rounded-lg p-2 bg-white font-semibold"
                  >
                    <option value="Classe I Perigoso">Classe I Perigoso</option>
                    <option value="Classe IIA Não Inerte">Classe IIA Não Inerte</option>
                    <option value="Classe IIB Inerte">Classe IIB Inerte</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Quantidade</label>
                  <div className="flex gap-1.5 mt-1">
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formMovement.quantity}
                      onChange={(e) => setFormMovement({ ...formMovement, quantity: e.target.value })}
                      className="w-2/3 border border-border rounded-lg p-2 font-bold"
                    />
                    <select
                      value={formMovement.unit_of_measure}
                      onChange={(e) => setFormMovement({ ...formMovement, unit_of_measure: e.target.value as any })}
                      className="w-1/3 border border-border rounded-lg p-2 text-xs"
                    >
                      <option value="toneladas">ton</option>
                      <option value="kg">kg</option>
                      <option value="m3">m³</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Descrição Detalhada do Resíduo</label>
                <input
                  type="text"
                  required
                  value={formMovement.description}
                  onChange={(e) => setFormMovement({ ...formMovement, description: e.target.value })}
                  className="w-full mt-1 border border-border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
                <div>
                  <label className="block font-semibold text-slate-700">Transportador Homologado</label>
                  <select
                    value={formMovement.transporter_id}
                    onChange={(e) => setFormMovement({ ...formMovement, transporter_id: e.target.value })}
                    className={`w-full mt-1 border rounded-lg p-2 bg-white ${
                      isTransporterExpired ? "border-rose-400 bg-rose-50/50" : "border-border"
                    }`}
                    required
                  >
                    <option value="">Selecione o Transportador...</option>
                    {suppliers
                      .filter((s) => s.role === "TRANSPORTADOR" || s.role === "AMBOS")
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.trade_name} {s.license_status === "VENCIDA" ? "⚠️ (LICENÇA VENCIDA)" : "✓"}
                        </option>
                      ))}
                  </select>
                  {isTransporterExpired && (
                    <span className="text-[11px] text-rose-700 font-semibold block mt-1">
                      ⚠️ Licença do transportador vencida em {selectedTransporter?.license_expiration_date}!
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Destinador Final Homologado</label>
                  <select
                    value={formMovement.destination_supplier_id}
                    onChange={(e) => setFormMovement({ ...formMovement, destination_supplier_id: e.target.value })}
                    className={`w-full mt-1 border rounded-lg p-2 bg-white ${
                      isDestinationExpired ? "border-rose-400 bg-rose-50/50" : "border-border"
                    }`}
                    required
                  >
                    <option value="">Selecione o Destinador...</option>
                    {suppliers
                      .filter((s) => s.role === "DESTINADOR" || s.role === "AMBOS")
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.trade_name} {s.license_status === "VENCIDA" ? "⚠️ (LICENÇA VENCIDA)" : "✓"}
                        </option>
                      ))}
                  </select>
                  {isDestinationExpired && (
                    <span className="text-[11px] text-rose-700 font-semibold block mt-1">
                      ⚠️ Licença do destinador vencida em {selectedDestination?.license_expiration_date}!
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Tecnologia de Destinação</label>
                  <select
                    value={formMovement.destination_type}
                    onChange={(e) => setFormMovement({ ...formMovement, destination_type: e.target.value as any })}
                    className="w-full mt-1 border border-border rounded-lg p-2 bg-white"
                  >
                    <option value="Coprocessamento">Coprocessamento em Forno de Clínquer</option>
                    <option value="Incineração">Incineração Térmica Controlada</option>
                    <option value="Aterro Industrial">Aterro Industrial Classe I</option>
                    <option value="Reciclagem">Reciclagem / Re-refino</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700">Número do MTR (Manifesto)</label>
                  <input
                    type="text"
                    required
                    value={formMovement.mtr_number}
                    onChange={(e) => setFormMovement({ ...formMovement, mtr_number: e.target.value })}
                    className="w-full mt-1 border border-border rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewMovementModalOpen(false)}
                  className="btn-secondary py-1.5 px-3"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={hasLockConflict}
                  className={`btn-primary py-1.5 px-3 ${
                    hasLockConflict ? "opacity-50 cursor-not-allowed bg-slate-400" : ""
                  }`}
                >
                  {hasLockConflict ? "Emissão Bloqueada por Lei" : "Emitir MTR e Registrar Expedição"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: NOVO FORNECEDOR */}
      {isNewSupplierModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-border">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-bold text-forest text-base">Cadastrar Novo Fornecedor Ambiental</h3>
              <button
                onClick={() => setIsNewSupplierModalOpen(false)}
                className="text-muted hover:text-forest cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSupplier} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Nome Fantasia</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: TransLira Ambiental"
                  value={formSupplier.trade_name}
                  onChange={(e) => setFormSupplier({ ...formSupplier, trade_name: e.target.value })}
                  className="w-full mt-1 border border-border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Razão Social</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: TransLira Transporte e Logística Ltda"
                  value={formSupplier.corporate_name}
                  onChange={(e) => setFormSupplier({ ...formSupplier, corporate_name: e.target.value })}
                  className="w-full mt-1 border border-border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">CNPJ</label>
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0000-00"
                    value={formSupplier.national_id}
                    onChange={(e) => setFormSupplier({ ...formSupplier, national_id: e.target.value })}
                    className="w-full mt-1 border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Papel Operacional</label>
                  <select
                    value={formSupplier.role}
                    onChange={(e) => setFormSupplier({ ...formSupplier, role: e.target.value as any })}
                    className="w-full mt-1 border border-border rounded-lg p-2 bg-white"
                  >
                    <option value="TRANSPORTADOR">Transportador</option>
                    <option value="DESTINADOR">Destinador Final</option>
                    <option value="AMBOS">Transportador e Destinador</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Licença Ambiental nº</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex.: LO CETESB nº 9901"
                    value={formSupplier.license_number}
                    onChange={(e) => setFormSupplier({ ...formSupplier, license_number: e.target.value })}
                    className="w-full mt-1 border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Órgão Emissor</label>
                  <input
                    type="text"
                    required
                    value={formSupplier.license_agency}
                    onChange={(e) => setFormSupplier({ ...formSupplier, license_agency: e.target.value })}
                    className="w-full mt-1 border border-border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700">Vencimento da Licença</label>
                  <input
                    type="date"
                    required
                    value={formSupplier.license_expiration_date}
                    onChange={(e) => setFormSupplier({ ...formSupplier, license_expiration_date: e.target.value })}
                    className="w-full mt-1 border border-border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Status da Licença</label>
                  <select
                    value={formSupplier.license_status}
                    onChange={(e) => setFormSupplier({ ...formSupplier, license_status: e.target.value as any })}
                    className="w-full mt-1 border border-border rounded-lg p-2 bg-white"
                  >
                    <option value="VIGENTE">Vigente (Apto)</option>
                    <option value="VENCIDA">Vencida (Bloqueado)</option>
                    <option value="EM_RENOVACAO">Em Renovação</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSupplierModalOpen(false)}
                  className="btn-secondary py-1.5 px-3"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL: ATUALIZAR LICENÇA DO FORNECEDOR */}
      {selectedSupplierForUpdate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-border">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-forest text-base">Atualizar Licença Ambiental</h3>
                <p className="text-xs text-muted">{selectedSupplierForUpdate.trade_name}</p>
              </div>
              <button
                onClick={() => setSelectedSupplierForUpdate(null)}
                className="text-muted hover:text-forest cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpdateLicense} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Número da Licença</label>
                <input
                  type="text"
                  required
                  value={updateLicenseForm.license_number}
                  onChange={(e) => setUpdateLicenseForm({ ...updateLicenseForm, license_number: e.target.value })}
                  className="w-full mt-1 border border-border rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Nova Data de Vencimento</label>
                <input
                  type="date"
                  required
                  value={updateLicenseForm.license_expiration_date}
                  onChange={(e) =>
                    setUpdateLicenseForm({ ...updateLicenseForm, license_expiration_date: e.target.value })
                  }
                  className="w-full mt-1 border border-border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Situação</label>
                <select
                  value={updateLicenseForm.license_status}
                  onChange={(e) => setUpdateLicenseForm({ ...updateLicenseForm, license_status: e.target.value as any })}
                  className="w-full mt-1 border border-border rounded-lg p-2 bg-white"
                >
                  <option value="VIGENTE">Vigente (Apto)</option>
                  <option value="VENCIDA">Vencida (Bloqueado)</option>
                  <option value="EM_RENOVACAO">Em Renovação</option>
                </select>
              </div>

              <div className="pt-2 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSupplierForUpdate(null)}
                  className="btn-secondary py-1.5 px-3"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary py-1.5 px-3">
                  Salvar Atualização
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
