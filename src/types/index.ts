export type OrganizationType = "ENTERPRISE" | "CONSULTANCY" | "MANAGED_CLIENT";
export type OrganizationStatus = "TRIAL" | "ACTIVE" | "SUSPENDED" | "CANCELLED";

export interface Organization {
  id: string;
  legal_name: string;
  trade_name: string;
  national_id: string;
  type: OrganizationType;
  status: OrganizationStatus;
  settings: {
    four_eyes_approval: boolean;
    renewal_alert_days: number;
  };
  created_at: string;
  updated_at: string;
}

export type UnitType =
  | "HEADQUARTERS"
  | "BRANCH"
  | "INDUSTRIAL_PLANT"
  | "CONSTRUCTION_SITE"
  | "LOGISTICS_HUB";

export interface Unit {
  id: string;
  organization_id: string;
  name: string;
  unit_type: UnitType;
  national_id?: string;
  state: string;
  city: string;
  hydrographic_basin?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export type LicenseType =
  | "LP"
  | "LI"
  | "LO"
  | "LAS"
  | "AAU"
  | "OUTORGA"
  | "DISPENSA"
  | "OUTROS";

export type LicenseStatus =
  | "DRAFT"
  | "ACTIVE"
  | "RENEWAL_ALERT"
  | "IN_RENEWAL"
  | "EXPIRED"
  | "SUSPENDED"
  | "CANCELLED"
  | "ARCHIVED";

export interface License {
  id: string;
  organization_id: string;
  unit_id: string;
  license_type: LicenseType;
  number: string;
  process_number: string;
  issuer_agency: string;
  description?: string;
  issue_date: string;
  expiration_date: string;
  renewal_deadline: string;
  status: LicenseStatus;
  protocol_number?: string;
  protocol_date?: string;
  created_at: string;
  updated_at: string;
}

export type ConditionPeriodicity =
  | "SINGLE"
  | "MONTHLY"
  | "BIMONTHLY"
  | "QUARTERLY"
  | "SEMIANNUAL"
  | "ANNUAL"
  | "CONTINUOUS";

export type ConditionStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "AWAITING_REVIEW"
  | "COMPLIED"
  | "OVERDUE"
  | "WAIVED";

export interface Condition {
  id: string;
  organization_id: string;
  license_id: string;
  item_number: string;
  description: string;
  compliance_criteria: string;
  periodicity: ConditionPeriodicity;
  deadline: string;
  status: ConditionStatus;
  recurrence_parent_id?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  created_at: string;
  updated_at: string;
}

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TaskStatus =
  | "TODO"
  | "DOING"
  | "REVIEW"
  | "DONE"
  | "OVERDUE"
  | "CANCELLED";

export interface Task {
  id: string;
  organization_id: string;
  condition_id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigned_to?: string;
  due_date: string;
  completed_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  organization_id: string;
  file_name: string;
  storage_key: string;
  content_type: string;
  file_size_bytes: number;
  sha256_hash: string;
  document_type: string;
  valid_until?: string;
  created_by: string;
  created_at: string;
}

export type LegislationSphere = "FEDERAL" | "ESTADUAL" | "MUNICIPAL";
export type LegislationType = "LEI" | "DECRETO" | "RESOLUCAO" | "PORTARIA" | "INSTRUCAO_NORMATIVA" | "OUTROS";
export type LegislationStatus = "Vigente" | "Revogada" | "Alterada";

export interface Legislation {
  id: string;
  legislation_type: LegislationType;
  number: string;
  year: number;
  issuing_body: string;
  sphere: LegislationSphere;
  state?: string;
  city?: string;
  publication_date: string;
  status: LegislationStatus;
  theme: string;
  summary: string;
  official_url?: string;
  created_at: string;
}

export type RequirementApplicability = "Aplicável" | "Não Aplicável" | "Em Análise" | "Parcialmente Aplicável";
export type RequirementComplianceStatus = "Conforme" | "Pendente" | "Não Conforme";
export type RequirementCriticality = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export interface LegalRequirement {
  id: string;
  legislation_id: string;
  organization_id: string;
  unit_id: string;
  code: string;
  article_reference: string;
  title: string;
  obligation_text: string;
  evidence_required_description: string;
  criticality: RequirementCriticality;
  applicability: RequirementApplicability;
  compliance_status: RequirementComplianceStatus;
  justification: string;
  responsible_name: string;
  created_at: string;
}

export interface Risk {
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

export type NonConformityOrigin = "Auditoria" | "Inspeção" | "Requisito Legal" | "Condicionante" | "Acidente" | "Análise Interna";
export type NonConformityStatus = "Aberta" | "Em Tratamento" | "Aguardando Eficácia" | "Concluída Eficaz" | "Cancelada";

export interface NonConformity {
  id: string;
  organization_id: string;
  unit_id: string;
  code: string;
  origin: NonConformityOrigin;
  origin_id?: string;
  description: string;
  root_cause: string;
  criticality: "Baixa" | "Média" | "Alta" | "Crítica";
  responsible_name: string;
  deadline: string;
  status: NonConformityStatus;
  action_plan_id?: string;
  created_at: string;
}

export type ChecklistQuestionType = "BOOLEAN" | "TEXT" | "NUMBER" | "SELECT" | "PHOTO" | "GPS";
export type ChecklistCriticality = "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";

export interface ChecklistQuestion {
  id: string;
  checklist_id: string;
  question_order: number;
  prompt: string;
  response_type: ChecklistQuestionType;
  options?: string[];
  requires_photo_on_failure: boolean;
  criticality: ChecklistCriticality;
}

export interface Checklist {
  id: string;
  organization_id: string;
  title: string;
  category: string;
  version: number;
  is_active: boolean;
  questions: ChecklistQuestion[];
  created_at: string;
}
