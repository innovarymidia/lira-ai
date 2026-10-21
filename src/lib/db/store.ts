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

export interface LegislationRecord {
  id: string;
  legislation_type: "LEI" | "DECRETO" | "RESOLUCAO" | "PORTARIA" | "INSTRUCAO_NORMATIVA" | "OUTROS";
  number: string;
  year: number;
  issuing_body: string;
  sphere: "FEDERAL" | "ESTADUAL" | "MUNICIPAL";
  state?: string;
  city?: string;
  publication_date: string;
  status: "Vigente" | "Revogada" | "Alterada";
  theme: string;
  summary: string;
  official_url?: string;
  created_at: string;
}

export interface LegalRequirementRecord {
  id: string;
  legislation_id: string;
  organization_id: string;
  unit_id: string;
  code: string;
  article_reference: string;
  title: string;
  obligation_text: string;
  evidence_required_description: string;
  criticality: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  applicability: "Aplicável" | "Não Aplicável" | "Em Análise" | "Parcialmente Aplicável";
  compliance_status: "Conforme" | "Pendente" | "Não Conforme";
  justification: string;
  responsible_name: string;
  created_at: string;
}

export interface RiskRecord {
  id: string;
  organization_id: string;
  unit_id: string;
  category: string;
  process_description: string;
  probability: number;
  impact: number;
  risk_score: number;
  criticality: "Baixo" | "Médio" | "Crítico";
  existing_controls: string;
  associated_requirement_id?: string;
  status: "Monitorado" | "Em Mitigação" | "Crítico";
  created_at: string;
}

export interface NonConformityRecord {
  id: string;
  organization_id: string;
  unit_id: string;
  code: string;
  origin: "Auditoria" | "Inspeção" | "Requisito Legal" | "Condicionante" | "Acidente" | "Análise Interna";
  origin_id?: string;
  description: string;
  root_cause: string;
  criticality: "Baixa" | "Média" | "Alta" | "Crítica";
  responsible_name: string;
  deadline: string;
  status: "Aberta" | "Em Tratamento" | "Aguardando Eficácia" | "Concluída Eficaz" | "Cancelada";
  action_plan_id?: string;
  created_at: string;
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
  legislations: LegislationRecord[];
  legal_requirements: LegalRequirementRecord[];
  risks: RiskRecord[];
  nonconformities: NonConformityRecord[];
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
    legislations: [
      {
        id: "leg-1",
        legislation_type: "RESOLUCAO",
        number: "Resolução CONAMA nº 430/2011",
        year: 2011,
        issuing_body: "CONAMA / MMA",
        sphere: "FEDERAL",
        publication_date: "2011-05-16",
        status: "Vigente",
        theme: "Efluentes e Recursos Hídricos",
        summary: "Dispõe sobre as condições e padrões de lançamento de efluentes, complementa e altera a Resolução nº 357/2005.",
        official_url: "https://conama.mma.gov.br",
        created_at: new Date().toISOString()
      },
      {
        id: "leg-2",
        legislation_type: "LEI",
        number: "Lei Federal nº 12.305/2010 (PNRS)",
        year: 2010,
        issuing_body: "Congresso Nacional",
        sphere: "FEDERAL",
        publication_date: "2010-08-02",
        status: "Vigente",
        theme: "Resíduos Sólidos",
        summary: "Institui a Política Nacional de Resíduos Sólidos (PNRS) e estabelece diretrizes relativas à gestão integrada e gerenciamento de resíduos.",
        official_url: "https://www.planalto.gov.br",
        created_at: new Date().toISOString()
      },
      {
        id: "leg-3",
        legislation_type: "DECRETO",
        number: "Decreto Estadual SP nº 8.468/1976",
        year: 1976,
        issuing_body: "Governo do Estado de São Paulo / CETESB",
        sphere: "ESTADUAL",
        state: "SP",
        publication_date: "1976-09-08",
        status: "Vigente",
        theme: "Controle da Poluição Ambiental",
        summary: "Aprova o Regulamento da Lei nº 997, de 31 de maio de 1976, sobre a Prevenção e o Controle da Poluição do Meio Ambiente em SP.",
        official_url: "https://cetesb.sp.gov.br",
        created_at: new Date().toISOString()
      }
    ],
    legal_requirements: [
      {
        id: "req-1",
        legislation_id: "leg-1",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        code: "REQ-CONAMA-430-ART-16",
        article_reference: "Art. 16, Tabela I",
        title: "Padrões de Lançamento de Efluentes Industriais Líquidos",
        obligation_text: "Os efluentes de qualquer fonte poluidora somente poderão ser lançados após tratamento, não podendo exceder pH 5 a 9, temperatura inferior a 40ºC e DBO5 máxima de 120 mg/L.",
        evidence_required_description: "Laudo analítico semestral de laboratório acreditado pelo Inmetro com cadeia de custódia.",
        criticality: "CRITICA",
        applicability: "Aplicável",
        compliance_status: "Conforme",
        justification: "A Planta Paulínia possui lançamento de efluente tratado na bacia PCJ após tratamento biológico na ETE interna.",
        responsible_name: "Carlos Ferreira (Analista)",
        created_at: new Date().toISOString()
      },
      {
        id: "req-2",
        legislation_id: "leg-2",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        code: "REQ-PNRS-12305-ART-20",
        article_reference: "Art. 20, Inciso I",
        title: "Elaboração e Atualização Anual do Plano de Gerenciamento de Resíduos Sólidos (PGRS)",
        obligation_text: "Geradores de resíduos industriais perigosos devem elaborar e manter atualizado anualmente o PGRS com ART de responsável técnico habilitado.",
        evidence_required_description: "Documento PGRS 2026 assinado com Anotação de Responsabilidade Técnica (ART) do CRQ/CREA.",
        criticality: "ALTA",
        applicability: "Aplicável",
        compliance_status: "Conforme",
        justification: "Enquadramento como grande gerador de resíduos perigosos da classe química.",
        responsible_name: "Mariana Costa (Gestora)",
        created_at: new Date().toISOString()
      },
      {
        id: "req-3",
        legislation_id: "leg-3",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        code: "REQ-DEC-8468-ART-18",
        article_reference: "Art. 18, Item B",
        title: "Comprovação de Operação Contínua da Estação de Tratamento de Efluentes",
        obligation_text: "Manter registros diários de vazão e operação dos sistemas de controle ambiental disponíveis para fiscalização imediata da CETESB.",
        evidence_required_description: "Planilhas de controle operacional e laudos trimestrais de eficiência da ETE.",
        criticality: "MEDIA",
        applicability: "Aplicável",
        compliance_status: "Pendente",
        justification: "Operação industrial sujeita à fiscalização periódica da agência ambiental CETESB Paulínia.",
        responsible_name: "Equipe de Operações ETE",
        created_at: new Date().toISOString()
      }
    ],
    risks: [
      {
        id: "risk-1",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        category: "Contaminação de Recursos Hídricos",
        process_description: "Vazamento acidental de solventes na tubulação subterrânea de transferência para a ETE",
        probability: 2,
        impact: 4,
        risk_score: 8,
        criticality: "Médio",
        existing_controls: "Válvulas de alívio automatizadas, canaletas cegas de contenção e teste hidrostático anual.",
        associated_requirement_id: "req-1",
        status: "Monitorado",
        created_at: new Date().toISOString()
      },
      {
        id: "risk-2",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        category: "Emissão Atmosférica Fugitiva",
        process_description: "Falha no sistema de lavagem de gases da chaminé CH-01 durante pico térmico",
        probability: 3,
        impact: 4,
        risk_score: 12,
        criticality: "Médio",
        existing_controls: "Analisadores contínuos de opacidade e sistema redundante de sopradores.",
        status: "Em Mitigação",
        created_at: new Date().toISOString()
      },
      {
        id: "risk-3",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        category: "Multa e Interdição Legal",
        process_description: "Atraso no protocolo de renovação tempestiva da Licença de Operação (120 dias LC 140/2011)",
        probability: 1,
        impact: 5,
        risk_score: 5,
        criticality: "Baixo",
        existing_controls: "Alerta automático do LIRA AI aos 120 dias e governança preventiva integrada.",
        status: "Monitorado",
        created_at: new Date().toISOString()
      }
    ],
    nonconformities: [
      {
        id: "nc-1",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        code: "NC-2026-001",
        origin: "Inspeção",
        origin_id: "insp-1",
        description: "Identificado gotejamento na válvula de dreno V-04 da bacia de contenção B-02 com acúmulo de líquido oleoso.",
        root_cause: "Desgaste da junta de vedação devido à fadiga térmica e vibração da bomba P-02.",
        criticality: "Média",
        responsible_name: "Carlos Ferreira",
        deadline: "2026-10-25",
        status: "Em Tratamento",
        action_plan_id: "ap-1",
        created_at: new Date().toISOString()
      },
      {
        id: "nc-2",
        organization_id: defaultOrgId,
        unit_id: defaultUnitId,
        code: "NC-2026-002",
        origin: "Auditoria",
        origin_id: "aud-1",
        description: "Falta de comprovação de calibração metrológica do manômetro M-12 do lavador de gases.",
        root_cause: "Manômetro substituído em parada emergencial sem envio imediato para calibração com padrão RBC.",
        criticality: "Baixa",
        responsible_name: "Equipe de Manutenção",
        deadline: "2026-11-15",
        status: "Aberta",
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
    const parsed = JSON.parse(raw);
    const initial = getInitialDatabase();

    // Auto-migracao e enriquecimento de colecoes
    if (!parsed.legislations || parsed.legislations.length === 0) {
      parsed.legislations = initial.legislations;
    }
    if (!parsed.legal_requirements || parsed.legal_requirements.length === 0) {
      parsed.legal_requirements = initial.legal_requirements;
    }
    if (!parsed.risks || parsed.risks.length === 0) {
      parsed.risks = initial.risks;
    }
    if (!parsed.nonconformities || parsed.nonconformities.length === 0) {
      parsed.nonconformities = initial.nonconformities;
    }

    return parsed;
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

// Helpers para Legislação e Grafo de Conformidade
export function createLegislation(data: Omit<LegislationRecord, "id" | "created_at">, userName: string): LegislationRecord {
  const db = readDatabase();
  const newLeg: LegislationRecord = {
    ...data,
    id: `leg-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  db.legislations.unshift(newLeg);
  writeDatabase(db);
  recordAuditLog("org-1", userName, "CREATE_LEGISLATION", "LEGISLATION", newLeg.id, `Norma ${newLeg.number} cadastrada no acervo.`);
  return newLeg;
}

export function createLegalRequirement(data: Omit<LegalRequirementRecord, "id" | "created_at">, userName: string): LegalRequirementRecord {
  const db = readDatabase();
  const newReq: LegalRequirementRecord = {
    ...data,
    id: `req-${Date.now()}`,
    created_at: new Date().toISOString()
  };
  db.legal_requirements.unshift(newReq);
  writeDatabase(db);
  recordAuditLog(data.organization_id, userName, "CREATE_LEGAL_REQUIREMENT", "LEGAL_REQUIREMENT", newReq.id, `Requisito ${newReq.code} vinculado à unidade.`);
  return newReq;
}

export function evaluateRequirement(
  requirementId: string,
  applicability: LegalRequirementRecord["applicability"],
  complianceStatus: LegalRequirementRecord["compliance_status"],
  justification: string,
  userName: string
): LegalRequirementRecord | null {
  const db = readDatabase();
  const index = db.legal_requirements.findIndex((r) => r.id === requirementId);
  if (index === -1) return null;

  const req = db.legal_requirements[index];
  req.applicability = applicability;
  req.compliance_status = complianceStatus;
  req.justification = justification;
  req.responsible_name = userName;

  db.legal_requirements[index] = req;
  writeDatabase(db);

  recordAuditLog(
    req.organization_id,
    userName,
    "EVALUATE_REQUIREMENT",
    "LEGAL_REQUIREMENT",
    req.id,
    `Avaliação de conformidade do requisito ${req.code}: ${applicability} / ${complianceStatus}. Justificativa: ${justification}`
  );

  return req;
}

export function createRisk(data: Omit<RiskRecord, "id" | "risk_score" | "criticality" | "created_at">, userName: string): RiskRecord {
  const db = readDatabase();
  const score = data.probability * data.impact;
  const criticality: RiskRecord["criticality"] = score >= 15 ? "Crítico" : score >= 8 ? "Médio" : "Baixo";

  const newRisk: RiskRecord = {
    ...data,
    id: `risk-${Date.now()}`,
    risk_score: score,
    criticality,
    created_at: new Date().toISOString()
  };

  db.risks.unshift(newRisk);
  writeDatabase(db);

  recordAuditLog(
    data.organization_id,
    userName,
    "CREATE_RISK",
    "RISK",
    newRisk.id,
    `Risco "${newRisk.category}" cadastrado com score ${score} (${criticality}).`
  );

  return newRisk;
}

export function createNonConformity(data: Omit<NonConformityRecord, "id" | "created_at">, userName: string): NonConformityRecord {
  const db = readDatabase();
  const newNc: NonConformityRecord = {
    ...data,
    id: `nc-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  db.nonconformities.unshift(newNc);
  writeDatabase(db);

  recordAuditLog(
    data.organization_id,
    userName,
    "CREATE_NONCONFORMITY",
    "NONCONFORMITY",
    newNc.id,
    `Não Conformidade ${newNc.code} registrada (Origem: ${newNc.origin}, Criticidade: ${newNc.criticality}).`
  );

  return newNc;
}
