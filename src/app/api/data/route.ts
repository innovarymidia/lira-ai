import { NextRequest, NextResponse } from "next/server";
import {
  readDatabase,
  writeDatabase,
  recordAuditLog,
  createLicense,
  registerRenewalProtocol,
  approveCondition,
  createLegislation,
  createLegalRequirement,
  evaluateRequirement,
  createRisk,
  createNonConformity,
  createChecklist,
  syncInspectionBatch,
  createWasteRecord,
  createSupplier,
  updateSupplierLicense
} from "@/lib/db/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get("tenant_id") || "org-1";

  const db = readDatabase();

  const organization = db.organizations.find((o) => o.id === tenantId) || db.organizations[0];
  const units = db.units.filter((u) => u.organization_id === tenantId);
  const licenses = db.licenses.filter((l) => l.organization_id === tenantId);
  const conditions = db.conditions.filter((c) => c.organization_id === tenantId);
  const tasks = db.tasks.filter((t) => t.organization_id === tenantId);
  const documents = db.documents.filter((d) => d.organization_id === tenantId);
  const wasteRecords = db.waste_records.filter((w) => w.organization_id === tenantId);
  const inspections = db.inspections.filter((i) => i.organization_id === tenantId);
  const audits = db.audits.filter((a) => a.organization_id === tenantId);
  const actionPlans = db.action_plans.filter((p) => p.organization_id === tenantId);
  const legislations = db.legislations || [];
  const legalRequirements = (db.legal_requirements || []).filter((r) => r.organization_id === tenantId);
  const risks = (db.risks || []).filter((rk) => rk.organization_id === tenantId);
  const nonconformities = (db.nonconformities || []).filter((nc) => nc.organization_id === tenantId);
  const checklists = db.checklists || [];
  const auditLogs = db.audit_logs.filter((l) => l.organization_id === tenantId);

  return NextResponse.json({
    organization,
    allOrganizations: db.organizations,
    units,
    licenses,
    conditions,
    tasks,
    documents,
    wasteRecords,
    inspections,
    audits,
    actionPlans,
    legislations,
    legalRequirements,
    risks,
    nonconformities,
    checklists,
    suppliers: (db.suppliers || []).filter((s) => s.organization_id === tenantId),
    wasteTypes: db.waste_types || [],
    auditLogs
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, tenant_id, user_name, payload } = body;
    const db = readDatabase();

    const currentTenantId = tenant_id || "org-1";
    const currentUserName = user_name || "Usuário do Sistema";

    if (action === "CREATE_ORGANIZATION") {
      const newOrg = {
        id: `org-${Date.now()}`,
        legal_name: payload.legal_name,
        trade_name: payload.trade_name,
        national_id: payload.national_id,
        type: payload.type || "ENTERPRISE",
        status: "ACTIVE" as const,
        four_eyes_approval: payload.four_eyes_approval ?? true,
        renewal_alert_days: payload.renewal_alert_days || 120,
        created_at: new Date().toISOString()
      };
      db.organizations.push(newOrg);
      writeDatabase(db);
      recordAuditLog(newOrg.id, currentUserName, "CREATE_ORGANIZATION", "ORGANIZATION", newOrg.id, `Organização ${newOrg.trade_name} criada.`);
      return NextResponse.json({ success: true, organization: newOrg });
    }

    if (action === "CREATE_UNIT") {
      const newUnit = {
        id: `unit-${Date.now()}`,
        organization_id: currentTenantId,
        name: payload.name,
        unit_type: payload.unit_type || "INDUSTRIAL_PLANT",
        national_id: payload.national_id || "",
        state: payload.state || "SP",
        city: payload.city || "",
        hydrographic_basin: payload.hydrographic_basin || "",
        created_at: new Date().toISOString()
      };
      db.units.push(newUnit);
      writeDatabase(db);
      recordAuditLog(currentTenantId, currentUserName, "CREATE_UNIT", "UNIT", newUnit.id, `Unidade ${newUnit.name} criada.`);
      return NextResponse.json({ success: true, unit: newUnit });
    }

    if (action === "CREATE_LICENSE") {
      const newLic = createLicense({
        organization_id: currentTenantId,
        unit_id: payload.unit_id,
        license_type: payload.license_type,
        number: payload.number,
        process_number: payload.process_number,
        issuer_agency: payload.issuer_agency,
        description: payload.description,
        issue_date: payload.issue_date,
        expiration_date: payload.expiration_date,
        protocol_number: payload.protocol_number,
        protocol_date: payload.protocol_date
      }, currentUserName);
      return NextResponse.json({ success: true, license: newLic });
    }

    if (action === "RECORD_PROTOCOL") {
      const updated = registerRenewalProtocol(payload.license_id, payload.protocol_number, payload.protocol_date, currentUserName);
      if (!updated) {
        return NextResponse.json({ error: "Licença não encontrada." }, { status: 404 });
      }
      return NextResponse.json({ success: true, license: updated });
    }

    if (action === "CREATE_CONDITION") {
      const newCond = {
        id: `cond-${Date.now()}`,
        organization_id: currentTenantId,
        license_id: payload.license_id,
        item_number: payload.item_number,
        description: payload.description,
        compliance_criteria: payload.compliance_criteria,
        periodicity: payload.periodicity || "SINGLE",
        deadline: payload.deadline,
        status: "Pendente" as const,
        evidence_name: payload.evidence_name || "",
        evidence_attached: Boolean(payload.evidence_name),
        created_at: new Date().toISOString()
      };
      db.conditions.push(newCond);
      writeDatabase(db);
      recordAuditLog(currentTenantId, currentUserName, "CREATE_CONDITION", "CONDITION", newCond.id, `${newCond.item_number} cadastrada para a licença ${newCond.license_id}.`);
      return NextResponse.json({ success: true, condition: newCond });
    }

    if (action === "APPROVE_CONDITION") {
      const updated = approveCondition(payload.condition_id, currentUserName, payload.notes || "Homologado tecnicamente conforme evidências anexadas.");
      return NextResponse.json({ success: true, condition: updated });
    }

    if (action === "ATTACH_EVIDENCE") {
      const condIndex = db.conditions.findIndex((c) => c.id === payload.condition_id);
      if (condIndex !== -1) {
        db.conditions[condIndex].evidence_attached = true;
        db.conditions[condIndex].evidence_name = payload.evidence_name;
        db.conditions[condIndex].status = "Aguardando Revisão";
        writeDatabase(db);
        recordAuditLog(currentTenantId, currentUserName, "ATTACH_EVIDENCE", "CONDITION", payload.condition_id, `Evidência ${payload.evidence_name} anexada. Submetido para homologação quatro-olhos.`);
        return NextResponse.json({ success: true, condition: db.conditions[condIndex] });
      }
      return NextResponse.json({ error: "Condicionante não encontrada" }, { status: 404 });
    }

    if (action === "CREATE_TASK") {
      const newTask = {
        id: `task-${Date.now()}`,
        organization_id: currentTenantId,
        condition_id: payload.condition_id,
        title: payload.title,
        description: payload.description,
        priority: payload.priority || "MEDIUM",
        status: payload.status || "A Fazer",
        assigned_to_name: payload.assigned_to_name || currentUserName,
        due_date: payload.due_date,
        created_at: new Date().toISOString()
      };
      db.tasks.push(newTask);
      writeDatabase(db);
      recordAuditLog(currentTenantId, currentUserName, "CREATE_TASK", "TASK", newTask.id, `Tarefa "${newTask.title}" criada.`);
      return NextResponse.json({ success: true, task: newTask });
    }

    if (action === "UPDATE_TASK_STATUS") {
      const taskIndex = db.tasks.findIndex((t) => t.id === payload.task_id);
      if (taskIndex !== -1) {
        db.tasks[taskIndex].status = payload.status;
        if (payload.status === "Concluída") {
          db.tasks[taskIndex].completed_at = new Date().toISOString();
        }
        writeDatabase(db);
        recordAuditLog(currentTenantId, currentUserName, "UPDATE_TASK_STATUS", "TASK", payload.task_id, `Tarefa status alterado para ${payload.status}.`);
        return NextResponse.json({ success: true, task: db.tasks[taskIndex] });
      }
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }

    if (action === "CREATE_WASTE_RECORD") {
      try {
        const newWaste = createWasteRecord(
          {
            organization_id: currentTenantId,
            unit_id: payload.unit_id,
            waste_code: payload.waste_code,
            description: payload.description,
            classification: payload.classification || "Classe I Perigoso",
            quantity: Number(payload.quantity),
            unit_of_measure: payload.unit_of_measure || "toneladas",
            transporter_name: payload.transporter_name,
            transporter_id: payload.transporter_id,
            destination_company: payload.destination_company,
            destination_supplier_id: payload.destination_supplier_id,
            destination_type: payload.destination_type || "Coprocessamento",
            mtr_number: payload.mtr_number,
            cdf_number: payload.cdf_number || "",
            cdf_issue_date: payload.cdf_issue_date || ""
          },
          currentUserName
        );
        return NextResponse.json({ success: true, waste: newWaste });
      } catch (err: any) {
        return NextResponse.json({ error: err.message || "Erro ao registrar resíduo" }, { status: 422 });
      }
    }

    if (action === "CREATE_SUPPLIER") {
      const newSup = createSupplier(
        {
          organization_id: currentTenantId,
          corporate_name: payload.corporate_name,
          trade_name: payload.trade_name,
          national_id: payload.national_id,
          role: payload.role || "TRANSPORTADOR",
          license_number: payload.license_number,
          license_agency: payload.license_agency || "CETESB",
          license_expiration_date: payload.license_expiration_date,
          license_status: payload.license_status || "VIGENTE",
          is_active: payload.is_active ?? true
        },
        currentUserName
      );
      return NextResponse.json({ success: true, supplier: newSup });
    }

    if (action === "UPDATE_SUPPLIER_LICENSE") {
      const updated = updateSupplierLicense(
        payload.supplier_id,
        payload.license_number,
        payload.license_expiration_date,
        payload.license_status || "VIGENTE",
        currentUserName
      );
      if (!updated) {
        return NextResponse.json({ error: "Fornecedor não encontrado" }, { status: 404 });
      }
      return NextResponse.json({ success: true, supplier: updated });
    }

    if (action === "CREATE_INSPECTION") {
      const newInsp = {
        id: `insp-${Date.now()}`,
        organization_id: currentTenantId,
        unit_id: payload.unit_id,
        title: payload.title,
        inspector_name: currentUserName,
        inspection_date: payload.inspection_date || new Date().toISOString().split("T")[0],
        score_percentage: Number(payload.score_percentage) || 100,
        total_items: Number(payload.total_items) || 10,
        conformities_count: Number(payload.conformities_count) || 10,
        deviations_count: Number(payload.deviations_count) || 0,
        status: "Concluída" as const,
        observations: payload.observations || "",
        created_at: new Date().toISOString()
      };
      db.inspections.push(newInsp);
      writeDatabase(db);
      recordAuditLog(currentTenantId, currentUserName, "CREATE_INSPECTION", "INSPECTION", newInsp.id, `Inspeção "${newInsp.title}" concluída com nota ${newInsp.score_percentage}%.`);
      return NextResponse.json({ success: true, inspection: newInsp });
    }

    if (action === "CREATE_AUDIT") {
      const newAudit = {
        id: `aud-${Date.now()}`,
        organization_id: currentTenantId,
        unit_id: payload.unit_id,
        scope: payload.scope,
        standard: payload.standard || "ISO 14001",
        lead_auditor: payload.lead_auditor || currentUserName,
        audit_date: payload.audit_date || new Date().toISOString().split("T")[0],
        findings_summary: {
          conformities: Number(payload.conformities) || 0,
          opportunities_for_improvement: Number(payload.opportunities_for_improvement) || 0,
          minor_non_conformities: Number(payload.minor_non_conformities) || 0,
          major_non_conformities: Number(payload.major_non_conformities) || 0
        },
        status: "Relatório Emitido" as const,
        created_at: new Date().toISOString()
      };
      db.audits.push(newAudit);
      writeDatabase(db);
      recordAuditLog(currentTenantId, currentUserName, "CREATE_AUDIT", "AUDIT", newAudit.id, `Auditoria ${newAudit.standard} registrada.`);
      return NextResponse.json({ success: true, audit: newAudit });
    }

    if (action === "CREATE_ACTION_PLAN") {
      const newPlan = {
        id: `ap-${Date.now()}`,
        organization_id: currentTenantId,
        origin_type: payload.origin_type || "INSPECAO",
        origin_id: payload.origin_id || "",
        title: payload.title,
        what: payload.what,
        why: payload.why,
        where: payload.where,
        who: payload.who,
        when_deadline: payload.when_deadline,
        how: payload.how,
        how_much: payload.how_much || "",
        status: "Em Implementação" as const,
        created_at: new Date().toISOString()
      };
      db.action_plans.push(newPlan);
      writeDatabase(db);
      recordAuditLog(currentTenantId, currentUserName, "CREATE_ACTION_PLAN", "ACTION_PLAN", newPlan.id, `Plano de Ação 5W2H "${newPlan.title}" criado.`);
      return NextResponse.json({ success: true, action_plan: newPlan });
    }

    if (action === "CREATE_LEGISLATION") {
      const newLeg = createLegislation({
        legislation_type: payload.legislation_type || "RESOLUCAO",
        number: payload.number,
        year: Number(payload.year) || new Date().getFullYear(),
        issuing_body: payload.issuing_body,
        sphere: payload.sphere || "FEDERAL",
        state: payload.state,
        city: payload.city,
        publication_date: payload.publication_date || new Date().toISOString().split("T")[0],
        status: payload.status || "Vigente",
        theme: payload.theme || "Geral",
        summary: payload.summary,
        official_url: payload.official_url
      }, currentUserName);
      return NextResponse.json({ success: true, legislation: newLeg });
    }

    if (action === "CREATE_LEGAL_REQUIREMENT") {
      const newReq = createLegalRequirement({
        legislation_id: payload.legislation_id,
        organization_id: currentTenantId,
        unit_id: payload.unit_id,
        code: payload.code,
        article_reference: payload.article_reference,
        title: payload.title,
        obligation_text: payload.obligation_text,
        evidence_required_description: payload.evidence_required_description || "",
        criticality: payload.criticality || "MEDIA",
        applicability: payload.applicability || "Aplicável",
        compliance_status: payload.compliance_status || "Pendente",
        justification: payload.justification || "",
        responsible_name: payload.responsible_name || currentUserName
      }, currentUserName);
      return NextResponse.json({ success: true, requirement: newReq });
    }

    if (action === "EVALUATE_REQUIREMENT") {
      const evaluated = evaluateRequirement(
        payload.requirement_id,
        payload.applicability,
        payload.compliance_status,
        payload.justification,
        currentUserName
      );
      if (!evaluated) {
        return NextResponse.json({ error: "Requisito legal não encontrado" }, { status: 404 });
      }
      return NextResponse.json({ success: true, requirement: evaluated });
    }

    if (action === "CREATE_RISK") {
      const newRisk = createRisk({
        organization_id: currentTenantId,
        unit_id: payload.unit_id,
        category: payload.category,
        process_description: payload.process_description,
        probability: Number(payload.probability) || 1,
        impact: Number(payload.impact) || 1,
        existing_controls: payload.existing_controls || "",
        associated_requirement_id: payload.associated_requirement_id,
        status: payload.status || "Monitorado"
      }, currentUserName);
      return NextResponse.json({ success: true, risk: newRisk });
    }

    if (action === "CREATE_NONCONFORMITY") {
      const newNc = createNonConformity({
        organization_id: currentTenantId,
        unit_id: payload.unit_id,
        code: payload.code || `NC-${Date.now().toString().slice(-4)}`,
        origin: payload.origin || "Inspeção",
        origin_id: payload.origin_id,
        description: payload.description,
        root_cause: payload.root_cause || "",
        criticality: payload.criticality || "Média",
        responsible_name: payload.responsible_name || currentUserName,
        deadline: payload.deadline || new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
        status: "Aberta",
        action_plan_id: payload.action_plan_id
      }, currentUserName);
      return NextResponse.json({ success: true, nonconformity: newNc });
    }

    if (action === "CREATE_CHECKLIST") {
      const newChk = createChecklist({
        organization_id: currentTenantId,
        title: payload.title,
        category: payload.category || "Operações Gerais",
        version: 1,
        is_active: true,
        questions: payload.questions || []
      }, currentUserName);
      return NextResponse.json({ success: true, checklist: newChk });
    }

    if (action === "SYNC_INSPECTIONS") {
      const result = syncInspectionBatch(payload.batch || [], currentUserName);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Ação não reconhecida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro interno" }, { status: 500 });
  }
}
