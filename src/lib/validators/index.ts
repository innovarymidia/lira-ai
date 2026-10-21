import { z } from "zod";

export const OrganizationSchema = z.object({
  legal_name: z.string().min(3, "Razão Social deve ter pelo menos 3 caracteres"),
  trade_name: z.string().min(2, "Nome Fantasia deve ter pelo menos 2 caracteres"),
  national_id: z.string().min(11, "CNPJ ou identificador inválido"),
  type: z.enum(["ENTERPRISE", "CONSULTANCY", "MANAGED_CLIENT"]),
  settings: z.object({
    four_eyes_approval: z.boolean().default(true),
    renewal_alert_days: z.number().int().min(30).max(365).default(120)
  })
});

export const LicenseSchema = z.object({
  unit_id: z.string().uuid("Unidade inválida"),
  license_type: z.enum([
    "LP",
    "LI",
    "LO",
    "LAS",
    "AAU",
    "OUTORGA",
    "DISPENSA",
    "OUTROS"
  ]),
  number: z.string().min(1, "Número da licença é obrigatório"),
  process_number: z.string().min(1, "Número do processo é obrigatório"),
  issuer_agency: z.string().min(2, "Órgão emissor é obrigatório"),
  description: z.string().optional(),
  issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de emissão inválida"),
  expiration_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de vencimento inválida")
}).refine(
  (data) => new Date(data.expiration_date) >= new Date(data.issue_date),
  {
    message: "Data de vencimento não pode ser anterior à data de emissão",
    path: ["expiration_date"]
  }
);

export const ConditionSchema = z.object({
  license_id: z.string().uuid("Licença inválida"),
  item_number: z.string().min(1, "Identificador da condicionante é obrigatório"),
  description: z.string().min(10, "Descrição detalhada é obrigatória"),
  compliance_criteria: z.string().min(5, "Critério de atendimento é obrigatório"),
  periodicity: z.enum([
    "SINGLE",
    "MONTHLY",
    "BIMONTHLY",
    "QUARTERLY",
    "SEMIANNUAL",
    "ANNUAL",
    "CONTINUOUS"
  ]),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Prazo limite inválido")
});

export const TaskSchema = z.object({
  condition_id: z.string().uuid("Condicionante inválida"),
  title: z.string().min(3, "Título da tarefa é obrigatório"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  assigned_to: z.string().uuid().optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data limite inválida")
});

export const ProtocolRecordSchema = z.object({
  protocol_number: z.string().min(2, "Número de protocolo é obrigatório"),
  protocol_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data do protocolo inválida"),
  notes: z.string().optional()
});
