# LIRA AI: Plataforma SaaS de Gestão e Conformidade Ambiental

> **Status do Projeto:** Fase 1: Especificação Funcional (Pré-codificação)  
> **Filosofia:** Lazy Senior Dev (Ponytail Mindset): Menor quantidade de código, YAGNI absoluto, segurança inegociável e prontidão para CodeRabbit.

---

## 📌 Documentação do Projeto

Toda a fundamentação técnica e regras de negócio estão estruturadas e documentadas antes do início da programação:

1. **[Especificação Funcional Baseline v0.1](file:///c:/Users/04680566108/Documents/lira-ai/docs/especificacao-funcional-v0.1.md)**:
   - Definição dos 8 perfis funcionais.
   - Catalogação dos 14 módulos (140 requisitos com identificadores únicos rastreáveis: ORG, LEG, LIC, CON, TAR, DOC, RES, INS, AUD, ACA, IND, IAI, SaaS, AUT).
   - Regras transversais de negócio (RB-001 a RB-010) e requisitos não funcionais (RNF-001 a RNF-012).
   - Relação inicial de decisões pendentes de negócio.

2. **[Especificação Funcional Detalhada v0.2](file:///c:/Users/04680566108/Documents/lira-ai/docs/especificacao-funcional-detalhada-v0.2.md)**:
   - **Escopo da 1ª Entrega Comercial (Release 1.0: Core Compliance)** aprovado.
   - **Matriz de Autorização e Papéis (RBAC Granular)** e delimitação das Trust Boundaries.
   - **Máquinas de Estados Finitas (FSM)** completas para Licenças, Condicionantes, Tarefas e Documentos com invariantes de negócio.
   - **Fluxos Operacionais Passo a Passo**: detalhamento com pré-condições, atores, gatilhos, passos principais, exceções e pós-condições (Cenários 01 a 07 e Cenário 12 de IA).
   - **Critérios de Aceitação Verificáveis (BDD / Gherkin)** para testes automatizados.
   - **Decisões D-02 (Modelo Híbrido) e D-03 (Core Compliance) Aprovadas**.

3. **[Arquitetura Técnica e Modelo de Dados (Fase 2)](file:///c:/Users/04680566108/Documents/lira-ai/docs/fase-2-arquitetura-tecnica-e-dados.md)**:
   - **Estratégia Multi-Tenant**: Shared Database com Row-Level Security (RLS) no PostgreSQL.
   - **DER Lógico e Schemas SQL**: Tabelas `organizations`, `organization_clients`, `units`, `licenses`, `conditions`, `tasks`, `documents`, `document_attachments` e `audit_logs`.
   - **Contratos de API RESTful**: Padrão de respostas de erro RFC 7807 e upload direto via S3/R2 presigned URLs.
   - **Stack Tecnológica Recomendada**: Next.js + Node/Fastify + PostgreSQL RLS + Gemini 1.5 Pro via Vertex AI.

4. **[Plano de Implementação e Especificação de Telas (Fase 3)](file:///c:/Users/04680566108/Documents/lira-ai/docs/fase-3-plano-implementacao-e-telas.md)**:
   - **Estrutura do Repositório**: Organização de diretórios e Clean Architecture.
   - **Especificação das Telas do Core Compliance**: Login e Tenant Switcher, Dashboard Central, Gestão de Licenças, Visualizador Split-Screen de IA (LIRA Extract), Fila de Homologação (Quatro-Olhos) e Central de Tarefas.
   - **Roteiro Passo a Passo**: Sequência ordenada de implementação da camada de dados até a interface.

5. **[Design System Master (UI/UX Pro Max)](file:///c:/Users/04680566108/Documents/lira-ai/design-system/lira-ai/MASTER.md)**:
   - Padrão: **Enterprise Gateway** | Estilo: **Trust and Authority**.
   - Tipografia oficial: `Plus Jakarta Sans`.
   - Paleta corporativa: Navy `#0F172A`, Slate `#334155`, CTA Blue `#0369A1`, Fundo `#F8FAFC`.
   - Semântica de status de conformidade ambiental (Verde, Âmbar, Vermelho, Azul IA).
   - Regras anti-pattern e acessibilidade WCAG AAA.

---

## 🗺️ Mapa de Entregas (Roadmap por Ondas)

| Release | Foco | Módulos Contemplados |
| :--- | :--- | :--- |
| **Release 1.0** | **Core Compliance** *(MVP Comercial)* | Módulo A (ORG), Módulo C (LIC), Módulo D (CON), Módulo E (TAR), Módulo F (DOC), Módulo L (IAI Piloto), Módulo M (SaaS Básico), Módulo N (AUT Prazos) |
| **Release 2.0** | **Operação de Campo e Logística** | Módulo G (RES: MTR/CDF), Módulo H (INS: Checklists Mobile), Módulo B (LEG: Requisitos Legais) |
| **Release 3.0** | **Governança, ESG e Auditorias** | Módulo I (AUD: Auditorias/NC), Módulo J (ACA: 5W2H/Riscos), Módulo K (IND: BI/Exportações), Módulo M (Cobrança Automática) |

---

## 🔒 Diretrizes de Engenharia e Boas Práticas
- **Zero improviso de regras**: Nenhum fluxo ou validação é criado sem respaldo na especificação funcional.
- **Rastreabilidade**: Requisitos identificados para vinculação direta com testes de unidade e integração.
- **Segurança multitenant**: Isolamento estrito por `organization_id` em toda e qualquer camada de dados.
