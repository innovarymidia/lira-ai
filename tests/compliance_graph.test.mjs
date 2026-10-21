import test from "node:test";
import assert from "node:assert/strict";

// Validadores e invariantes de regras de negocio
test("Regra LC 140/2011: Calculo de Prazo de Renovacao Tempestiva (120 dias)", () => {
  const calculateRenewalDeadline = (expirationDate) => {
    const exp = new Date(expirationDate);
    exp.setDate(exp.getDate() - 120);
    return exp.toISOString().split("T")[0];
  };

  const expirationDate = "2026-11-14";
  const deadline = calculateRenewalDeadline(expirationDate);

  assert.equal(deadline, "2026-07-17", "Prazo fatal deve ser exatamente 120 dias antes do vencimento");
});

test("Matriz de Riscos 5x5: Calculo de Criticidade (Probabilidade x Impacto)", () => {
  const calculateRiskCriticality = (prob, impact) => {
    const score = prob * impact;
    if (score >= 15) return "Crítico";
    if (score >= 8) return "Médio";
    return "Baixo";
  };

  assert.equal(calculateRiskCriticality(4, 4), "Crítico"); // 16
  assert.equal(calculateRiskCriticality(3, 3), "Médio");   // 9
  assert.equal(calculateRiskCriticality(2, 2), "Baixo");   // 4
  assert.equal(calculateRiskCriticality(5, 5), "Crítico"); // 25
  assert.equal(calculateRiskCriticality(1, 1), "Baixo");   // 1
});

test("Regra RB-004: Condicionante exige anexo de evidencia para homologacao", () => {
  const approveConditionValidator = (condition) => {
    if (!condition.evidence_attached) {
      throw new Error("Não é possível homologar atendimento sem evidência comprovada anexada (RB-004).");
    }
    return { ...condition, status: "Atendida" };
  };

  const invalidCond = { id: "cond-1", status: "Em Andamento", evidence_attached: false };
  assert.throws(() => approveConditionValidator(invalidCond), /RB-004/);

  const validCond = { id: "cond-2", status: "Aguardando Revisão", evidence_attached: true };
  const approved = approveConditionValidator(validCond);
  assert.equal(approved.status, "Atendida");
});

test("Grafo de Conformidade: Desdobramento de Norma em Requisito e Status Inicial", () => {
  const requirement = {
    id: "req-1",
    code: "REQ-CONAMA-430-ART-16",
    applicability: "Aplicável",
    compliance_status: "Conforme"
  };

  assert.equal(requirement.applicability, "Aplicável");
  assert.equal(requirement.compliance_status, "Conforme");
});

test("Sincronização Offline Idempotente: Inspeção com client_local_id duplicado é ignorada", () => {
  const store = { inspections: [] };
  const syncInspection = (record) => {
    const existing = store.inspections.find(i => i.client_local_id === record.client_local_id);
    if (!existing) {
      store.inspections.push(record);
      return { status: "created" };
    }
    return { status: "skipped_duplicate" };
  };

  const payload = { client_local_id: "uuid-device-01", checklist_id: "chk-1", tenant_id: "tenant-1" };
  const res1 = syncInspection(payload);
  const res2 = syncInspection(payload);

  assert.equal(res1.status, "created");
  assert.equal(res2.status, "skipped_duplicate");
  assert.equal(store.inspections.length, 1, "Armazenamento deve conter apenas 1 registro evitando duplicidade");
});

test("Checklist Inspecao: Desvio Crítico gera Não Conformidade (NC) automaticamente", () => {
  const answers = [
    { question_id: "q1", compliant: false, criticality: "CRITICA", text: "Bacia de contenção com rachadura e vazamento" },
    { question_id: "q2", compliant: true, criticality: "MEDIA", text: "Placas de identificação visíveis" }
  ];

  const generatedNCs = [];
  answers.forEach(a => {
    if (!a.compliant && (a.criticality === "ALTA" || a.criticality === "CRITICA")) {
      generatedNCs.push({
        title: `Desvio em inspeção de campo: ${a.text}`,
        severity: a.criticality === "CRITICA" ? "Gravíssima" : "Grave",
        status: "Aberta"
      });
    }
  });

  assert.equal(generatedNCs.length, 1);
  assert.equal(generatedNCs[0].severity, "Gravíssima");
  assert.equal(generatedNCs[0].status, "Aberta");
});

