import fs from "fs";
import path from "path";

export interface OrganizationRecord {
  id: string;
  legal_name: string;
  trade_name: string;
  national_id: string;
  type: "ENTERPRISE" | "CONSULTANCY" | "MANAGED_CLIENT";
  status: "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED";
  four_eyes_approval: boolean;
  renewal_alert_days: number;
  created_at: string;
}

export interface UnitRecord {
  id: string;
  organization_id: string;
  name: string;
  unit_type: "HEADQUARTERS" | "BRANCH" | "INDUSTRIAL_PLANT" | "CONSTRUCTION_SITE" | "LOGISTICS_HUB";
  national_id?: string;
  state: string;
  city: string;
  hydrographic_basin?: string;
  created_at: string;
}

export interface UserRecord {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GESTOR" | "CONSULTOR" | "ANALISTA" | "OPERACIONAL" | "AUDITOR";
  status: "ACTIVE" | "INVITED" | "DISABLED";
  created_at: string;
}

export interface LicenseRecord {
  id: string;
  organization_id: string;
  unit_id: string;
  license_type: "LP" | "LI" | "LO" | "LAS" | "AAU" | "OUTORGA" | "DISPENSA" | "OUTROS";
  number: string;
  process_number: string;
  issuer_agency: string;
  description?: string;
  issue_date: string;
  expiration_date: string;
  renewal_deadline: string;
  status: "Vigente" | "Alerta Renovação" | "Em Renovação" | "Vencida" | "Suspensa";
  protocol_number?: string;
  protocol_date?: string;
  evidence_document_id?: string;
  created_at: string;
}

export interface ConditionRecord {
  id: string;
  organization_id: string;
  license_id: string;
  item_number: string;
  description: string;
  compliance_criteria: string;
  periodicity: "SINGLE" | "MONTHLY" | "BIMONTHLY" | "QUARTERLY" | "SEMIANNUAL" | "ANNUAL" | "CONTINUOUS";
  deadline: string;
  status: "Pendente" | "Em Andamento" | "Aguardando Revisão" | "Atendida" | "Em Atraso" | "Dispensada";
  evidence_name?: string;
  evidence_url?: string;
  evidence_attached: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  created_at: string;
}

export interface TaskRecord {
  id: string;
  organization_id: string;
  condition_id?: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "A Fazer" | "Em Execução" | "Em Revisão" | "Concluída" | "Cancelada";
  assigned_to_name?: string;
  due_date: string;
  completed_at?: string;
  created_at: string;
}

export interface DocumentRecord {
  id: string;
  organization_id: string;
  file_name: string;
  document_type: string;
  subject: string;
  unit_id?: string;
  valid_until?: string;
  sha256_hash: string;
  file_size_bytes: number;
  created_by_name: string;
  created_at: string;
}

export interface WasteRecord {
  id: string;
  organization_id: string;
  unit_id: string;
  waste_code: string;
  description: string;
  classification: "Classe I Perigoso" | "Classe IIA Não Inerte" | "Classe IIB Inerte";
  quantity: number;
  unit_of_measure: "kg" | "toneladas" | "m3";
  transporter_name: string;
  destination_company: string;
  destination_type: "Reciclagem" | "Coprocessamento" | "Incineração" | "Aterro Industrial";
  mtr_number: string;
  cdf_number?: string;
  status: "Aguardando MTR" | "MTR Emitido" | "Destinado com CDF";
  created_at: string;
}

export interface InspectionRecord {
  id: string;
  organization_id: string;
  unit_id: string;
  title: string;
  inspector_name: string;
  inspection_date: string;
  score_percentage: number;
  total_items: number;
  conformities_count: number;
  deviations_count: number;
  status: "Planejada" | "Em Execução" | "Concluída" | "Homologada";
  observations?: string;
  created_at: string;
}

export interface AuditRecord {
  id: string;
  organization_id: string;
  unit_id: string;
  scope: string;
  standard: "ISO 14001" | "Conformidade Legal Geral" | "Auditoria de Fornecedores";
  lead_auditor: string;
  audit_date: string;
  findings_summary: {
    conformities: number;
    opportunities_for_improvement: number;
    minor_non_conformities: number;
    major_non_conformities: number;
  };
  status: "Agendada" | "Em Andamento" | "Relatório Emitido" | "Ações Corretivas em Aberto" | "Encerrada";
  created_at: string;
}

export interface ActionPlanRecord {
  id: string;
  organization_id: string;
  origin_type: "AUDITORIA" | "INSPECAO" | "CONDICIONANTE";
  origin_id: string;
  title: string;
  what: string; // O que
  why: string; // Por que
  where: string; // Onde
  who: string; // Quem
  when_deadline: string; // Quando
  how: string; // Como
  how_much?: string; // Quanto custa
  status: "Planejado" | "Em Implementação" | "Aguardando Validação de Eficácia" | "Concluído Eficaz";
  created_at: string;
}

export interface AuditLogRecord {
  id: string;
  organization_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  timestamp: string;
}

export interface LiraDatabaseSchema {
  organizations: OrganizationRecord[];
  units: UnitRecord[];
  users: UserRecord[];
  licenses: LicenseRecord[];
  conditions: ConditionRecord[];
  tasks: TaskRecord[];
  documents: DocumentRecord[];
  waste_records: WasteRecord[];
  inspections: InspectionRecord[];
  audits: AuditRecord[];
  action_plans: ActionPlanRecord[];
  audit_logs: AuditLogRecord[];
}

const DB_FILE_PATH = path.join(process.cwd(), "data", "lira_database.json");

function calculateRenewalDeadline(expirationDate: string): string {
  const exp = new Date(expirationDate);
  exp.setDate(exp.getDate() - 120);
  return exp.toISOString().split("T")[0];
}

function calculateLicenseStatus(expirationDate: string, renewalDeadline: string, hasProtocol: boolean): LicenseRecord["status"] {
  if (hasProtocol) return "Em Renovação";
  const now = new Date();
  const exp = new Date(expirationDate);
  const renew = new Date(renewalDeadline);

  if (now > exp) return "Vencida";
  if (now >= renew) return "Alerta Renovação";
  return "Vigente";
}

function getInitialDatabase(): LiraDatabaseSchema {
  const defaultOrgId = "org-1";
  const defaultUnitId = "unit-1";

  return {
    organizations: [
      {
        id: defaultOrgId,
        legal_name: "Química Paulista Indústria e Comércio S/A",
        trade_name: "Química Paulista S/A",
        national_id: "44.123.456/0001-89",
        type: "ENTERPRISE",
        status: "ACTIVE",
        four_eyes_approval: true,
        renewal_alert_days: 120,
        created_at: new Date().toISOString()
      },
      {
        id: "org-2",
        legal_name: "Mineração Vale Verde do Brasil Ltda",
        trade_name: "Mineração Vale Verde",
        national_id: "12.987.654/0001-32",
        type: "MANAGED_CLIENT",
        status: "ACTIVE",
        four_eyes_approval: true,
        renewal_alert_days: 120,
        created_at: new Date().toISOString()
      }
    ],
    units: [
      {
        id: defaultUnitId,
        organization_id: defaultOrgId,
        name: "Planta Industrial Paulínia",
        unit_type: "INDUSTRIAL_PLANT",
        national_id: "44.123.456/0002-60",
        state: "SP",
        city: "Paulínia",
        hydrographic_basin: "Bacia dos Rios Piracicaba, Capivari e Jundiaí (PCJ)",
        created_at: new Date().toISOString()
      },
      {
        id: "unit-2",
        organization_id: defaultOrgId,
        name: "Unidade Petroquímica Camaçari",
        unit_type: "INDUSTRIAL_PLANT",
        national_id: "44.123.456/0003-40",
        state: "BA",
        city: "Camaçari",
        hydrographic_basin: "Bacia do Rio Pojuca",
        created_at: new Date().toISOString()
      }
    ],
    users: [
      {
        id: "usr-1",
        organization_id: defaultOrgId,
        name: "João Silva",
        email: "consultor@verdeambiental.com.br",
        role: "CONSULTOR",
        status: "ACTIVE",
        created_at: new Date().toISOString()
      },
      {
        id: "usr-2",
        organization_id: defaultOrgId,
        name: "Mariana Costa",
        email: "gestor@quimicapaulista.com.br",
        role: "GESTOR",
        status: "ACTIVE",
        created_at: new Date().toISOString()
      }
    ],
    licenses: [
      {
        id: "lic-1",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        license_type: "LO",
        number: "LO nº 4509/2023",
        process_number: "Proc. CETESB 02001.0034/20",
        issuer_agency: "CETESB",
        description: "Operação de síntese e refino de compostos orgânicos e inorgânicos com sistema de tratamento de efluentes",
        issue_date: "2023-11-14",
        expiration_date: "2026-11-14",
        renewal_deadline: "2026-07-17",
        status: "Vigente",
        created_at: new Date().toISOString()
      },
      {
        id: "lic-2",
        organization_id: defaultOrgId,
        unit_id: "unit-2",
        license_type: "LI",
        number: "LI nº 8821/2024",
        process_number: "Proc. INEA 19022.0011/22",
        issuer_agency: "INEA",
        description: "Instalação da nova linha automatizada de envase e tancagem de segurança química",
        issue_date: "2024-09-03",
        expiration_date: "2026-09-03",
        renewal_deadline: "2026-05-06",
        status: "Alerta Renovação",
        created_at: new Date().toISOString()
      }
    ],
    conditions: [
      {
        id: "cond-1",
        organization_id: defaultOrgId,
        license_id: "lic-1",
        item_number: "Condicionante 2.1",
        description: "Apresentar laudos analíticos semestrais da eficiência da Estação de Tratamento de Efluentes (ETE) com amostragem dos pontos de lançamento E-01 e E-02.",
        compliance_criteria: "Laudo emitido por laboratório acreditado pelo Inmetro com parâmetros de DBO, DQO, Óleos e Graxas em conformidade com o Artigo 18 do Decreto 8.468/1976.",
        periodicity: "SEMIANNUAL",
        deadline: "2026-11-30",
        status: "Aguardando Revisão",
        evidence_name: "Laudo_Laboratorial_ETE_2026_Q3.pdf",
        evidence_attached: true,
        created_at: new Date().toISOString()
      },
      {
        id: "cond-2",
        organization_id: defaultOrgId,
        license_id: "lic-1",
        item_number: "Condicionante 2.2",
        description: "Realizar o monitoramento contínuo das emissões atmosféricas nas chaminés CH-01 e CH-02 com calibração anual dos sensores.",
        compliance_criteria: "Relatório de ensaios isocinéticos com cálculo de taxa de emissão de material particulado e SOx.",
        periodicity: "ANNUAL",
        deadline: "2026-12-15",
        status: "Em Andamento",
        evidence_attached: false,
        created_at: new Date().toISOString()
      }
    ],
    tasks: [
      {
        id: "task-1",
        organization_id: defaultOrgId,
        condition_id: "cond-1",
        title: "Contratar coleta e análise laboratorial dos efluentes industriais",
        description: "Agendar com o laboratório credenciado a coleta composta de 24 horas no ponto de descarte final.",
        priority: "HIGH",
        status: "Concluída",
        assigned_to_name: "Carlos Ferreira (Analista)",
        due_date: "2026-10-10",
        completed_at: "2026-10-08T14:30:00Z",
        created_at: new Date().toISOString()
      },
      {
        id: "task-2",
        organization_id: defaultOrgId,
        condition_id: "cond-2",
        title: "Calibração dos analisadores de gases da chaminé CH-01",
        description: "Executar calibração metrológica semestral dos sensores ópticos de opacidade.",
        priority: "MEDIUM",
        status: "A Fazer",
        assigned_to_name: "Equipe de Manutenção",
        due_date: "2026-11-20",
        created_at: new Date().toISOString()
      }
    ],
    documents: [
      {
        id: "doc-1",
        organization_id: defaultOrgId,
        file_name: "LO_CETESB_4509_2023_Oficial.pdf",
        document_type: "Licença Oficial",
        subject: "Licença de Operação Paulínia",
        unit_id: defaultUnitId,
        valid_until: "2026-11-14",
        sha256_hash: "8f4a1329cbb876ef482937ba45129ef65d8924b12c7764d89a2456e9921bcfa0",
        file_size_bytes: 4892011,
        created_by_name: "Mariana Costa",
        created_at: new Date().toISOString()
      },
      {
        id: "doc-2",
        organization_id: defaultOrgId,
        file_name: "Laudo_Laboratorial_ETE_2026_Q3.pdf",
        document_type: "Laudo Laboratorial",
        subject: "Análise de Efluentes ETE Paulínia",
        unit_id: defaultUnitId,
        valid_until: "2027-03-30",
        sha256_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        file_size_bytes: 1823904,
        created_by_name: "Carlos Ferreira",
        created_at: new Date().toISOString()
      }
    ],
    waste_records: [
      {
        id: "waste-1",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        waste_code: "D001 / Resíduo Químico Inflamável",
        description: "Borras de destilação de solventes e tintas industriais",
        classification: "Classe I Perigoso",
        quantity: 4.8,
        unit_of_measure: "toneladas",
        transporter_name: "TransLog Ambiental Express Ltda (Licença IBAMA 9912)",
        destination_company: "EcoDestruição e Coprocessamento Paulínia S/A",
        destination_type: "Coprocessamento",
        mtr_number: "MTR-SP-2026-0044192",
        cdf_number: "CDF-2026-99014",
        status: "Destinado com CDF",
        created_at: new Date().toISOString()
      },
      {
        id: "waste-2",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        waste_code: "Efluente Não Inerte Tratado",
        description: "Lodo desidratado prensado da estação físico-química da ETE",
        classification: "Classe IIA Não Inerte",
        quantity: 12.5,
        unit_of_measure: "toneladas",
        transporter_name: "Saneamento e Resíduos do Interior Ltda",
        destination_company: "Aterro Industrial Regional Centro-Oeste",
        destination_type: "Aterro Industrial",
        mtr_number: "MTR-SP-2026-0051189",
        status: "MTR Emitido",
        created_at: new Date().toISOString()
      }
    ],
    inspections: [
      {
        id: "insp-1",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        title: "Inspeção Mensal de Bacias de Contenção e Tancagem de Químicos",
        inspector_name: "Carlos Ferreira",
        inspection_date: "2026-10-14",
        score_percentage: 95,
        total_items: 20,
        conformities_count: 19,
        deviations_count: 1,
        status: "Homologada",
        observations: "Identificado pequeno gotejamento na válvula de dreno V-04 da bacia B-02. Aberto plano de ação corretiva imediato.",
        created_at: new Date().toISOString()
      }
    ],
    audits: [
      {
        id: "aud-1",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        scope: "Auditoria Interna de Conformidade Legal e Requisitos Ambientais",
        standard: "ISO 14001",
        lead_auditor: "Renata Vasconcelos (Auditora Líder)",
        audit_date: "2026-09-28",
        findings_summary: {
          conformities: 42,
          opportunities_for_improvement: 3,
          minor_non_conformities: 1,
          major_non_conformities: 0
        },
        status: "Ações Corretivas em Aberto",
        created_at: new Date().toISOString()
      }
    ],
    action_plans: [
      {
        id: "ap-1",
        organization_id: defaultOrgId,
        origin_type: "INSPECAO",
        origin_id: "insp-1",
        title: "Substituição e vedação da válvula V-04 da Bacia B-02",
        what: "Substituir junta de vedação e reapertar flange da válvula V-04",
        why: "Eliminar risco de gotejamento de efluente oleoso no solo da bacia",
        where: "Bacia de Contenção B-02 do Parque de Tancagem",
        who: "Engenharia de Manutenção Mecânica (Líder Marcos)",
        when_deadline: "2026-10-25",
        how: "Isolar a linha, purgar a tubulação e aplicar gaxeta de teflon resistente a solvente",
        how_much: "R$ 450,00",
        status: "Em Implementação",
        created_at: new Date().toISOString()
      }
    ],
    audit_logs: [
      {
        id: "log-1",
        organization_id: defaultOrgId,
        user_name: "Sistema LIRA AI",
        action: "INITIAL_SEED",
        entity_type: "DATABASE",
        entity_id: defaultOrgId,
        details: "Banco de dados inicializado com sucesso para operação.",
        timestamp: new Date().toISOString()
      }
    ]
  };
}

export function readDatabase(): LiraDatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE_PATH)) {
      const initial = getInitialDatabase();
      writeDatabase(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Erro ao ler banco de dados LIRA:", error);
    return getInitialDatabase();
  }
}

export function writeDatabase(data: LiraDatabaseSchema): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao gravar banco de dados LIRA:", error);
  }
}

export function recordAuditLog(orgId: string, userName: string, action: string, entityType: string, entityId: string, details: string): void {
  const db = readDatabase();
  const log: AuditLogRecord = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    organization_id: orgId,
    user_name: userName,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    timestamp: new Date().toISOString()
  };
  db.audit_logs.unshift(log);
  if (db.audit_logs.length > 500) {
    db.audit_logs = db.audit_logs.slice(0, 500);
  }
  writeDatabase(db);
}

// Helpers especificos de manipulacao de licencas
export function createLicense(data: Omit<LicenseRecord, "id" | "renewal_deadline" | "status" | "created_at">, userName: string): LicenseRecord {
  const db = readDatabase();
  const renewalDeadline = calculateRenewalDeadline(data.expiration_date);
  const status = calculateLicenseStatus(data.expiration_date, renewalDeadline, Boolean(data.protocol_number));

  const newLicense: LicenseRecord = {
    ...data,
    id: `lic-${Date.now()}`,
    renewal_deadline: renewalDeadline,
    status,
    created_at: new Date().toISOString()
  };

  db.licenses.unshift(newLicense);
  writeDatabase(db);

  recordAuditLog(
    data.organization_id,
    userName,
    "CREATE_LICENSE",
    "LICENSE",
    newLicense.id,
    `Licença ${newLicense.number} cadastrada para a unidade ${data.unit_id}. Prazo LC 140/2011: ${renewalDeadline}.`
  );

  return newLicense;
}

export function registerRenewalProtocol(licenseId: string, protocolNumber: string, protocolDate: string, userName: string): LicenseRecord | null {
  const db = readDatabase();
  const index = db.licenses.findIndex((l) => l.id === licenseId);
  if (index === -1) return null;

  const license = db.licenses[index];
  license.protocol_number = protocolNumber;
  license.protocol_date = protocolDate;
  license.status = "Em Renovação";

  db.licenses[index] = license;
  writeDatabase(db);

  recordAuditLog(
    license.organization_id,
    userName,
    "RECORD_PROTOCOL",
    "LICENSE",
    license.id,
    `Protocolo formal de renovação nº ${protocolNumber} registrado. Licença prorrogada legalmente nos termos da LC 140/2011.`
  );

  return license;
}

// Helpers de condicionantes
export function approveCondition(conditionId: string, userName: string, notes: string): ConditionRecord | null {
  const db = readDatabase();
  const index = db.conditions.findIndex((c) => c.id === conditionId);
  if (index === -1) return null;

  const cond = db.conditions[index];

  // RB-004: Obrigatoriedade de evidencias
  if (!cond.evidence_attached) {
    throw new Error("Não é possível homologar atendimento sem evidência comprovada anexada (RB-004).");
  }

  cond.status = "Atendida";
  cond.reviewed_by = userName;
  cond.reviewed_at = new Date().toISOString();
  cond.reviewer_notes = notes;

  db.conditions[index] = cond;
  writeDatabase(db);

  recordAuditLog(
    cond.organization_id,
    userName,
    "APPROVE_CONDITION",
    "CONDITION",
    cond.id,
    `Homologação técnica de quatro-olhos concluída para a ${cond.item_number}. Parecer: ${notes}`
  );

  return cond;
}
