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
