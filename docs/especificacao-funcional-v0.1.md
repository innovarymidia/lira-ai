# LIRA AI: Plataforma de Gestão Ambiental SaaS
## Fase 1: Especificação Funcional (Documento v0.1: Pré-codificação)
**Status:** Em elaboração / Baseline inicial aprovada para refinamento  
**Classificação:** Confidencial / Produto Comercial Multiempresa e Multicliente  
**Data:** 2026-10-21  

---

## 1. Objetivo e Limites da Fase

Esta fase produz a especificação funcional detalhada para que a arquitetura técnica, o modelo de dados e a experiência do usuário (UI/UX) possam ser definidos sem depender de suposições ou improvisos durante a programação.

### Incluído nesta fase:
- Definição dos perfis de usuário e suas necessidades de negócio.
- Organização dos módulos e requisitos funcionais catalogados com IDs rastreáveis.
- Mapeamento dos processos e fluxos operacionais de negócio.
- Regras de negócio transversais e relacionamentos entre módulos.
- Requisitos funcionais e critérios de aceitação verificáveis.
- Requisitos não funcionais que afetam a arquitetura e comportamento do sistema.
- Identificação de dependências, riscos e decisões pendentes.

### Fora do escopo imediato (Anti-escopo):
- Implementação de código-fonte de backend ou frontend.
- Escolha definitiva da stack de banco de dados e hospedagem em nuvem.
- Construção de schemas físicos de banco de dados.
- Configuração de infraestrutura (IaC, Docker, pipelines CI/CD).
- Elaboração de prompts finais de desenvolvimento de IA.

---

## 2. Perfis de Usuário (Personas Operacionais)

O sistema considera, inicialmente, oito perfis funcionais de negócio. Eles representam papéis e matrizes de permissão dinâmicas, e não usuários estáticos:

| Perfil | Necessidade Principal |
| :--- | :--- |
| **Administrador da Plataforma** | Gerenciar o SaaS, planos, contas contratantes, suporte técnico N3 e configurações globais autorizadas. |
| **Administrador da Organização** | Configurar a própria organização (tenant), usuários internos, unidades/estabelecimentos e políticas de acesso. |
| **Gestor Ambiental** | Acompanhar licenças ambientais, matriz de obrigações, riscos, indicadores e nível global de conformidade. |
| **Consultor Ambiental** | Gerenciar atividades, condicionantes e obrigações técnicas dos clientes aos quais recebeu acesso autorizado. |
| **Analista Ambiental** | Executar tarefas do dia a dia, registrar informações de campo, acompanhar prazos e anexar evidências comprobatórias. |
| **Responsável Operacional** | Executar inspeções de rotina, preencher checklists em campo e apontar desvios operacionais. |
| **Auditor ou Revisor** | Avaliar conformidade técnica de evidências, revisar atendimento de condicionantes e registrar constatações/não conformidades. |
| **Visualizador / Cliente Convidado** | Consultar relatórios gerenciais, dashboards e status de licenças conforme permissão estrita de leitura concedida. |

---

## 3. Especificação dos Módulos Funcionais

### Módulo A: Organizações, Clientes e Unidades (ORG)
- **ORG-001**: Permitir cadastrar e editar organizações com seus dados cadastrais (CNPJ/CPF, Razão Social, CNAE principal, endereço).
- **ORG-002**: Permitir cadastrar unidades, estabelecimentos, empreendimentos e locais operacionais vinculados a uma organização.
- **ORG-003**: Permitir organizar unidades hierarquicamente quando aplicável (Matriz, Filial, Canteiro, Frente de Obra).
- **ORG-004**: Permitir que consultorias mantenham uma carteira de clientes com controle estrito de vigência de contrato de prestação de serviço.
- **ORG-005**: Permitir vincular usuários a organizações, clientes e unidades conforme permissões específicas e papéis definidos.
- **ORG-006**: Permitir convidar usuários por e-mail com tokens seguros temporários e administrar o ciclo de vida de seus acessos.
- **ORG-007**: Manter histórico auditável de todas as alterações relevantes nos cadastros cadastrais e societários.
- **ORG-008**: Impedir categoricamente que usuários acessem dados de organizações ou clientes sem autorização explícita e vigente (isolamento multitenant).

### Módulo B: Legislação e Requisitos Legais (LEG)
- **LEG-001**: Permitir cadastrar normas, atos legais, resoluções (CONAMA, estaduais, municipais) e referências regulatórias ambientais.
- **LEG-002**: Registrar identificador oficial, órgão emissor, jurisdição, datas de publicação/vigência, situação (em vigor, revogada) e link/fonte de consulta.
- **LEG-003**: Permitir relacionar normas a temas ambientais (recursos hídricos, resíduos, efluentes, emissões atmosféricas, fauna, flora), atividades e setores econômicos.
- **LEG-004**: Permitir registrar artigos e requisitos legais específicos extraídos de normas regulatórias.
- **LEG-005**: Permitir avaliar e registrar a aplicabilidade de requisitos legais por organização, unidade operacional ou tipologia de atividade.
- **LEG-006**: Registrar justificativa técnica, responsável qualificado, data e evidências da avaliação de aplicabilidade.
- **LEG-007**: Permitir relacionar requisitos legais a tarefas de rotina, licenças ambientais, condicionantes, documentos de controle e procedimentos operacionais.
- **LEG-008**: Registrar mudanças e revogações nas normas, preservando o histórico integral das avaliações anteriores de conformidade.
- **LEG-009**: Permitir registrar revisões e validações humanas obrigatórias de análises regulatórias assistidas por IA.
- **LEG-010**: Permitir consultar obrigações legais aplicáveis, pendentes, atendidas e em revisão por meio de filtros consolidados.

### Módulo C: Licenciamento Ambiental (LIC)
- **LIC-001**: Permitir cadastrar licenças (LP, LI, LO, LAS, AAU), autorizações e outros instrumentos ambientais pertinentes.
- **LIC-002**: Vincular cada instrumento à organização, cliente, unidade ou empreendimento correspondente.
- **LIC-003**: Registrar órgão emissor ambiental, número do processo administrativo, número do documento, tipologia, datas de emissão e validade, situação e responsável interno.
- **LIC-004**: Anexar arquivos digitais (PDF oficial da licença) e evidências comprobatórias ao cadastro.
- **LIC-005**: Registrar condicionantes ambientais vinculadas a cada licença ou instrumento emitido.
- **LIC-006**: Acompanhar prazos legais de renovação (ex.: 120 dias antes do vencimento conforme LC 140/2011), entregas e pendências técnicas.
- **LIC-007**: Permitir registrar protocolos formais de órgãos ambientais, comprovantes de envio e comprovantes de recebimento.
- **LIC-008**: Manter histórico imutável de alterações, aditivos, pedidos de renovação e documentos associados.
- **LIC-009**: Exibir visualmente licenças vencidas (vermelho), próximas do vencimento (amarelo), vigentes (verde) e com cadastro incompleto (cinza).
- **LIC-010**: Permitir gerar relatórios consolidados por organização, unidade, órgão ambiental, tipologia de licença e situação.

### Módulo D: Condicionantes e Obrigações (CON)
- **CON-001**: Cadastrar condicionantes com descrição textual íntegra, número/item, origem, responsável técnico e critérios objetivos de atendimento.
- **CON-002**: Definir prazo único, recorrência periódica (mensal, trimestral, semestral, anual) ou calendário específico de entregas.
- **CON-003**: Vincular a condicionante à licença correspondente, unidade operacional e requisitos legais associados.
- **CON-004**: Criar tarefas de execução operacional associadas às obrigações, manualmente ou por automação configurada.
- **CON-005**: Registrar evidências do atendimento (laudos laboratoriais, manifestos, relatórios técnicos, ARTs, fotos georreferenciadas).
- **CON-006**: Permitir fluxo formal de revisão e homologação por usuário auditor ou gestor autorizado antes do fechamento.
- **CON-007**: Controlar ciclo de vida por estados: Pendente, Em Andamento, Aguardando Revisão, Atendida, Em Atraso e Dispensada.
- **CON-008**: Exigir justificativa técnica formal para quaisquer prorrogações de prazo ou alterações de situação.
- **CON-009**: Alertar automaticamente responsáveis técnicos e gestores sobre vencimentos iminentes e pendências críticas.
- **CON-010**: Disponibilizar histórico auditável completo de atendimento por condicionante, ciclo e período avaliado.

### Módulo E: Gestão de Tarefas e Prazos (TAR)
- **TAR-001**: Permitir criar tarefas operacionais avulsas ou vinculadas a condicionantes, licenças, inspeções, auditorias ou planos de ação.
- **TAR-002**: Definir responsável técnico, prazo fatal de conclusão, prioridade (Baixa, Média, Alta, Crítica), descrição clara e critérios de conclusão.
- **TAR-003**: Permitir atribuir tarefas a usuários individuais autorizados ou equipes operacionais específicas.
- **TAR-004**: Permitir registrar comentários técnicos, anexos de comprovação e evidências documentais.
- **TAR-005**: Controlar estados formais: A Fazer, Em Execução, Em Revisão, Concluída, Cancelada e Em Atraso.
- **TAR-006**: Configurar alertas escalonados de vencimento e alertas de atraso para o responsável e sua liderança.
- **TAR-007**: Suportar tarefas recorrentes configuráveis com proteção contra geração duplicada em um mesmo ciclo.
- **TAR-008**: Exibir visualização em lista filtrável, quadro Kanban e visão de calendário por responsável, unidade, prazo e prioridade.
- **TAR-009**: Registrar histórico completo de movimentações de status, prorrogações de prazo e encerramento.
- **TAR-010**: Permitir identificar tarefas atrasadas e sinalizar automaticamente o risco de impacto na conformidade da obrigação mãe.

### Módulo F: Gestão Documental (DOC)
- **DOC-001**: Permitir anexar e cadastrar documentos ambientais técnicos e legais (PDF, relatórios, laudos, plantas, ARTs).
- **DOC-002**: Classificar documentos por tipo, organização, cliente, unidade, assunto regulatório e fonte emissora.
- **DOC-003**: Vincular documentos diretamente a licenças, condicionantes, requisitos legais, inspeções e auditorias.
- **DOC-004**: Registrar controle de validade documental, responsável técnico, número de registro, data de emissão e metadados estruturados.
- **DOC-005**: Preservar versionamento automático e histórico de versões anteriores conforme política de retenção.
- **DOC-006**: Permitir pesquisar e filtrar documentos por texto, metadados, unidades, validades e status.
- **DOC-007**: Controlar permissões granulares de visualização, download, edição e exclusão de documentos.
- **DOC-008**: Registrar trilha de auditoria completa de upload, visualização, download, alteração e exclusão lógica.
- **DOC-009**: Suportar fluxos de aprovação de documentos técnicos antes de se tornarem vigentes.
- **DOC-010**: Identificar automaticamente documentos vencidos, a vencer nos próximos 30/60/90 dias ou com pendência de validação.

### Módulo G: Resíduos e Destinação (RES)
- **RES-001**: Cadastrar tipos de resíduos gerados segundo a ABNT NBR 10.004 (Classe I Perigosos, Classe IIA Não Inertes, Classe IIB Inertes) e códigos IBAMA.
- **RES-002**: Registrar pontos de geração na unidade, quantidade, unidade de medida (kg, t, m³) e período de acondicionamento.
- **RES-003**: Cadastrar empresas transportadoras e destinadoras finais com validação de suas respectivas licenças ambientais e autorizações.
- **RES-004**: Registrar movimentações, expedições e destinações finais de resíduos (reciclagem, coprocessamento, incineração, aterro).
- **RES-005**: Associar documentos comprobatórios obrigatórios: Manifestos de Transporte de Resíduos (MTR) e Certificados de Destinação Final (CDF).
- **RES-006**: Acompanhar a situação documental de cada expedição (Aguardando MTR, MTR Emitido, Aguardando CDF, CDF Homologado).
- **RES-007**: Registrar evidências fotográficas e tickets de balança da pesagem.
- **RES-008**: Consultar e filtrar movimentações por unidade, período, código do resíduo, transportador e destinador.
- **RES-009**: Consolidar inventários anuais de resíduos e gerar dados compatíveis com o Relatório de Atividades Potencialmente Poluidoras (RAPP/IBAMA).
- **RES-010**: Identificar movimentações com inconsistências cadastrais ou falta de CDF dentro do prazo regulamentar.

### Módulo H: Inspeções e Atividades de Campo (INS)
- **INS-001**: Criar modelos dinâmicos de checklist ambiental com seções, perguntas de múltipla escolha, texto e notas numéricas.
- **INS-002**: Agendar inspeções periódicas por unidade, setor operacional, responsável e data planejada.
- **INS-003**: Registrar respostas de campo, observações contextuais e evidências fotográficas com marcação de data/hora.
- **INS-004**: Detectar desvios e não conformidades durante a inspeção e permitir abertura imediata de pendência ou plano de ação.
- **INS-005**: Registrar data real de execução, responsável executor, geolocalização e status da inspeção.
- **INS-006**: Submeter inspeção concluída para revisão e homologação do gestor ambiental responsável.
- **INS-007**: Consultar histórico evolutivo de inspeções para acompanhamento de tendências de conformidade por unidade.
- **INS-008**: Disponibilizar interface responsiva otimizada para uso em tablets e smartphones em ambiente de campo.
- **INS-009**: *(Em avaliação)* Avaliar suporte à execução offline no navegador/app móvel com sincronização posterior de fotos e respostas.
- **INS-010**: Garantir imutabilidade e rastreabilidade total das respostas após a homologação final do relatório de inspeção.

### Módulo I: Auditorias e Não Conformidades (AUD)
- **AUD-001**: Cadastrar programas e planos de auditoria ambiental (interna, externa ou de certificação ISO 14001) com escopo e cronograma.
- **AUD-002**: Vincular critérios de auditoria a normas regulamentadoras, licenças, condicionantes e procedimentos internos.
- **AUD-003**: Registrar constatações do auditor, classificadas em: Conformidade, Oportunidade de Melhoria (OM), Não Conformidade Menor (NC-) e Maior (NC+).
- **AUD-004**: Registrar análise de causa raiz de não conformidades (ex.: 5 Porquês, Ishikawa/Espinha de Peixe).
- **AUD-005**: Gerar planos de ação corretiva diretamente vinculados às constatações registradas.
- **AUD-006**: Acompanhar prazos, responsáveis pela implementação, envio de evidências e encerramento das ações.
- **AUD-007**: Permitir reavaliação formal de eficácia pelo auditor após implementação das ações corretivas.
- **AUD-008**: Manter histórico auditável completo de revisões do relatório de auditoria e status de constatações.
- **AUD-009**: Gerar relatórios executivos de auditoria com estatísticas de constatações e parecer de conformidade.
- **AUD-010**: Controlar sigilo e acesso aos relatórios de auditoria conforme autorização específica da alta direção.

### Módulo J: Planos de Ação e Gestão de Riscos (ACA)
- **ACA-001**: Cadastrar riscos ambientais (ex.: vazamento de efluente, emissão fugitiva, autuação por órgão ambiental) e oportunidades de sustentabilidade.
- **ACA-002**: Mapear causas potenciais, impactos e consequências associadas, controles operacionais existentes e responsáveis.
- **ACA-003**: Configurar matriz de risco bidimensional personalizável (Probabilidade x Severidade = Nível de Risco Residual).
- **ACA-004**: Criar ações preventivas, mitigatórias, corretivas e de contingência no formato 5W2H.
- **ACA-005**: Vincular planos de ação a riscos, não conformidades de auditorias, desvios de inspeção e condicionantes críticas.
- **ACA-006**: Monitorar status de implementação, percentual de avanço, prazos contratuais e responsáveis designados.
- **ACA-007**: Registrar comprovação documental das ações concluídas e avaliação posterior de eficácia prática.
- **ACA-008**: Painel de alertas visuais para ações com prazos expirados ou riscos em faixa crítica desprovidos de planos de mitigação ativos.
- **ACA-009**: Preservar série histórica da evolução do apetite e dos níveis de risco por unidade ao longo dos ciclos.
- **ACA-010**: Consolidar indicadores de risco residual e taxa de eficácia dos planos de ação concluídos.

### Módulo K: Indicadores e Relatórios (IND)
- **IND-001**: Disponibilizar dashboard executivo com índice consolidado de conformidade ambiental, matriz de calor de prazos e pendências críticas.
- **IND-002**: Oferecer filtros combinados em tempo real por organização, carteira de clientes, unidade, tema ambiental e período temporal.
- **IND-003**: Exibir contadores em destaque de licenças e documentos vencidos, a vencer em 30/60/90 dias e regulares.
- **IND-004**: Apresentar volume de tarefas pendentes, atrasadas e condicionantes em risco iminente de autuação.
- **IND-005**: Consolidar estatísticas operacionais de inspeções (índice de conformidade), auditorias e volumes de resíduos destinados.
- **IND-006**: Permitir geração de relatórios operacionais e gerenciais em PDF e planilhas eletrônicas (CSV/Excel).
- **IND-007**: Suportar modelos de relatório padronizados para prestação de contas à diretoria e atendimento a órgãos fiscalizadores.
- **IND-008**: Exibir carimbo explícito de data, hora, usuário emissor e filtros aplicados no cabeçalho/rodapé de qualquer relatório.
- **IND-009**: Restringir exibição e consolidação de dados rigorosamente ao perímetro de unidades e clientes autorizados ao usuário logado.
- **IND-010**: Registrar log auditável de geração e exportação de relatórios gerenciais para fins de segurança da informação.

### Módulo L: Inteligência Artificial (IAI)
- **IAI-001**: Extrair automaticamente texto e campos estruturados de PDFs de licenças e pareceres técnicos de órgãos ambientais.
- **IAI-002**: Sugerir automaticamente metadados cadastrais do documento (órgão emissor, número, datas de emissão/validade, tipologia).
- **IAI-003**: Detectar e isolar cláusulas de condicionantes e obrigações a partir do texto integral da licença digitalizada.
- **IAI-004**: Gerar resumos técnicos executivos destacando proibições, prazos críticos e exigências de apresentação de laudos periódicos.
- **IAI-005**: Sugerir minutas de relatórios periódicos de atendimento com base nos dados e evidências já anexados no sistema.
- **IAI-006**: Propor tarefas operacionais recomendadas para atendimento de condicionantes identificadas.
- **IAI-007**: Apresentar trecho exato do documento original (citação literal e página) que serviu de evidência para a sugestão da IA (rastreabilidade/grounding).
- **IAI-008**: Exigir validação humana explícita (Human-in-the-Loop) antes de transformar qualquer sugestão de IA em registro definitivo no sistema.
- **IAI-009**: Manter log imutável de todas as inferências: modelo utilizado, prompt/contexto anonimizado, sugestão retornada e ação tomada pelo usuário (aceite, edição ou rejeição).
- **IAI-010**: Garantir isolamento rigoroso de contexto de dados entre organizações (zero cross-tenant data leakage e nenhuma retenção de dados do cliente para treinamento de modelos públicos).

### Módulo M: Administração do SaaS e Assinaturas (SaaS)
- **SaaS-001**: Permitir criar, suspender, reativar e administrar organizações contratantes (tenants) no painel do administrador da plataforma.
- **SaaS-002**: Cadastrar planos comerciais (ex.: Starter, Professional, Enterprise), precificação, periodicidade de cobrança e limites de recursos.
- **SaaS-003**: Associar assinaturas vigentes às organizações contratantes e gerenciar ciclo de faturamento.
- **SaaS-004**: Consultar faturas, status de pagamento e histórico de cobrança via integração autorizada com gateway de pagamentos.
- **SaaS-005**: Aplicar travas e limites automáticos de uso contratados (máximo de unidades, número de usuários, gigabytes de armazenamento de documentos).
- **SaaS-006**: Controlar períodos de teste (Trial), períodos de tolerância (Grace Period), bloqueio por inadimplência e encerramento de conta.
- **SaaS-007**: Disponibilizar dashboard de telemetria de consumo de recursos por organização (armazenamento, tokens de IA consumidos, chamadas de API).
- **SaaS-008**: Disponibilizar painel de suporte administrativo seguro com registro obrigatório de justificativa para acesso de suporte (impersonation auditado).
- **SaaS-009**: Preservar dados e histórico em conformidade com contratos, prazos legais de prescrição ambiental e política de retenção.
- **SaaS-010**: Permitir upgrade ou downgrade de planos comerciais garantindo integridade dos dados previamente cadastrados.

### Módulo N: Notificações e Automações (AUT)
- **AUT-001**: Disparar notificações automáticas para alertas de prazos, licenças a vencer, condicionantes pendentes e tarefas atrasadas.
- **AUT-002**: Roteador inteligente de destinatários baseado na matriz de responsabilidade (RACI) e permissões de cada registro.
- **AUT-003**: Configurar réguas de antecedência temporal customizáveis (ex.: 120, 90, 60, 30, 15, 7 e 0 dias do vencimento).
- **AUT-004**: Registrar histórico completo de disparos de notificação, status de entrega, erros e confirmações de leitura.
- **AUT-005**: Permitir configurar automações para geração periódica de tarefas e ciclos de obrigações recorrentes.
- **AUT-006**: Garantir idempotência operacional (bloquear rigorosamente criação duplicada de tarefas para o mesmo ciclo/competência).
- **AUT-007**: Permitir pausar, editar, reativar e auditar regras de automação configuradas na organização.
- **AUT-008**: Monitorar filas de processamento de tarefas em background com política de retentativa exponencial e registro de dead-letter jobs.
- **AUT-009**: Suportar canais de comunicação aprovados: notificação no aplicativo (in-app notification) e e-mail corporativo.
- **AUT-010**: Respeitar central de preferências de comunicação e horários de silenciamento configurados pelos usuários.

---

## 4. Regras Transversais de Negócio (RB)

- **RB-001 (Isolamento Multitenant)**: Toda consulta, escrita ou exclusão deve ter filtro mandatório por `organization_id`. Usuários só operam em registros vinculados explicitamente ao seu escopo.
- **RB-002 (Vínculo Consultoria-Cliente)**: Uma organização do tipo Consultoria só pode visualizar ou operar dados de uma organização Cliente se houver vínculo contratual formal, ativo e vigente cadastrado no sistema.
- **RB-003 (Rastreabilidade e Auditoria)**: Qualquer inclusão, alteração ou exclusão lógica de registros ambientais deve gravar automaticamente: `user_id`, timestamp UTC, IP/User-Agent, valores anteriores e novos valores.
- **RB-004 (Obrigatoriedade de Evidências)**: A conclusão de condicionantes, inspeções e ações corretivas não pode ocorrer sem a anexação de ao menos uma evidência comprobatória válida (documento, foto ou laudo).
- **RB-005 (Prazos e Regras de Negócio de Renovação)**: O cálculo de prazo de renovação tempestiva de licença deve aplicar a regra padrão da Lei Complementar nº 140/2011 (protocolo com antecedência mínima de 120 dias do vencimento), prorrogando a validade até manifestação final do órgão emissor.
- **RB-006 (Segregação de Funções e Aprovação)**: O usuário executor que preenche o atendimento de uma condicionante ou tarefa técnica não pode ser o único aprovador final desse mesmo registro (quatro-olhos/dupla checagem quando configurada).
- **RB-007 (Imutabilidade de Histórico)**: Nenhuma alteração cadastral ou renovação de licença pode sobrescrever silenciosamente o número, validade ou dados da licença ou condicionante do ciclo anterior. O ciclo anterior é arquivado como registro histórico permanente.
- **RB-008 (Exclusão Lógica e Retenção)**: Registros regulatórios e documentais nunca sofrem exclusão física (`DELETE`) no banco de dados operacional. Devem receber soft delete (`deleted_at`, `deleted_by`) e respeitar o prazo de retenção legal ambiental (mínimo de 5 a 20 anos a depender da tipologia).
- **RB-009 (IA como Assistente Consultivo)**: Toda e qualquer inferência gerada por modelos de IA (extração de condicionantes, sugestão de prazos, resumos) deve ser exibida com indicador visual de "Sugestão da IA" e status "Aguardando Revisão Humana". Nenhuma licença ou condicionante é aprovada diretamente por IA.
- **RB-010 (Governança de Assinatura e Planos)**: A redução de plano (downgrade) ou inadimplência não causa perda nem exclusão de dados históricos cadastrados, limitando-se a bloquear novas inserções e downloads ou congelar acessos operacionais excedentes aos limites da nova faixa.

---

## 5. Requisitos Não Funcionais (RNF)

- **RNF-001 (Controle de Acesso Baseado em Papéis - RBAC)**: Autenticação segura, suporte a MFA para gestores e controle granular de permissões por organização, unidade e funcionalidade.
- **RNF-002 (Privacidade e LGPD)**: Anonimização de dados pessoais sensíveis em logs de auditoria, termos de consentimento e atendimento aos direitos do titular (Art. 18 da LGPD).
- **RNF-003 (Integridade e Não Repúdio)**: Hash criptográfico (ex.: SHA-256) em arquivos anexados e evidências documentais para comprovação de integridade perante auditorias.
- **RNF-004 (Design Responsivo e UI Moderna)**: Interface web responsiva otimizada para Desktop (1440px/1024px), Tablet (768px) e Mobile (375px), sem quebras de layout ou perda de usabilidade.
- **RNF-005 (Desempenho e Latência)**: Tempo de resposta para carregamento de painéis e consultas filtradas inferior a 1,5 segundo no percentil 95 (P95).
- **RNF-006 (Escalabilidade)**: Arquitetura sem estado (stateless) capaz de suportar escalonamento horizontal de tenants sem degradação operacional.
- **RNF-007 (Resiliência e Backup)**: Política de backup automatizado diário com retenção geográfica distribuída e recovery point objective (RPO) inferior a 1 hora.
- **RNF-008 (Acessibilidade)**: Conformidade com padrões WCAG 2.1 nível AA/AAA (contraste mínimo de 4.5:1 para textos, suporte a leitores de tela e navegação por teclado).
- **RNF-009 (Qualidade e Testes Automatizados)**: Cobertura mínima de testes unitários e de integração de 80% sobre as regras de negócio críticas (prazos, permissões multitenant e isolamento de dados).
- **RNF-010 (Observabilidade e Segurança em Logs)**: Logs estruturados com trace IDs correlacionados, sem exposição de credenciais, senhas, tokens ou dados pessoais sensíveis.
- **RNF-011 (Resiliência de Integrações)**: Circuit breaker, retentativas exponenciais com jitter e idempotência no recebimento de webhooks de pagamento ou órgãos públicos.
- **RNF-012 (Políticas de Retenção e Portabilidade)**: Exportação integral de dados do cliente em formatos abertos (JSON estruturado e arquivos originais compactados em ZIP) em caso de encerramento contratual.

---

## 6. Fluxos Funcionais Mapeados para Detalhamento

1. Cadastro de uma empresa contratante e de suas unidades operacionais.
2. Cadastro de uma consultoria ambiental e vinculação formal de um cliente.
3. Convite de um novo usuário técnico e concessão de permissões de acesso.
4. Cadastro de uma licença ambiental e vinculação de suas condicionantes.
5. Criação de uma tarefa operacional a partir de uma obrigação/condicionante.
6. Execução de uma tarefa em campo com anexação de evidências comprobatórias.
7. Revisão e homologação técnica do atendimento de uma condicionante ambiental.
8. Identificação de não conformidade ou desvio durante inspeção de rotina.
9. Abertura, delegação e acompanhamento de plano de ação corretiva.
10. Cadastro e acompanhamento de movimentação de resíduos industriais com MTR/CDF.
11. Geração e exportação de relatório gerencial de conformidade ambiental.
12. Extração inteligente de dados de licença via IA com revisão e homologação humana.
13. Alteração de plano comercial, aplicação de limites e bloqueios por cancelamento.
14. Revogação de acesso de consultoria aos dados de uma empresa cliente.
15. Tratamento de falha em fila de notificação/automação e reprocessamento com recuperação controlada.

---

## 7. Decisões Pendentes de Validação

| Decisão | Impacto no Sistema | Status |
| :--- | :--- | :--- |
| **D-01: Segmentos e Estados Prioritários** | Determina a profundidade das regras de órgãos estaduais (ex.: CETESB/SP, INEA/RJ, IAT/PR) e escopo de campos no MVP. | Aberto |
| **D-02: Modelo de Propriedade dos Dados Consultoria x Cliente** | Define se o cliente é o proprietário supremo que concede acesso à consultoria ou se a consultoria pode cadastrar clientes como pastas internas privadas. | Aberto |
| **D-03: Escopo do Primeiro Lançamento (Release 1.0)** | Define quais dos 14 módulos entram no primeiro lançamento comercial viável e quais ficam para fases posteriores. | Aberto |
| **D-04: Cobertura e Atualização de Normas Legais** | Define se a base de legislação será alimentada manualmente pelos clientes ou se haverá curadoria centralizada da LIRA AI / scraping oficial. | Aberto |
| **D-05: Fluxo de Quatro-Olhos Obrigatório** | Define se toda condicionante atendida exige aprovação formal de um segundo usuário ou se isso será configurável por organização/licença. | Aberto |
| **D-06: Suporte Offline para Inspeções** | Define se a primeira versão suportará Service Workers e IndexedDB para inspeções sem conectividade ou se exigirá conexão online inicial. | Aberto |
| **D-07: Modelo Comercial de Precificação e Limites** | Define métricas de cobrança (por usuário, por unidade operacional, por volume de licenças ou por consumo de IA). | Aberto |
| **D-08: Política de Retenção de Documentos Pós-Cancelamento** | Define tempo de guarda de documentos após rescisão de contrato (ex.: 30 dias para download antes do expurgo definitivo). | Aberto |
| **D-09: Arquitetura e Provedor dos Modelos de IA** | Define fornecedor de LLM/OCR (ex.: Gemini 1.5 Pro via Google Cloud Vertex AI com residência de dados no Brasil). | Aberto |
| **D-10: Integrações Governamentais Automáticas** | Define se a plataforma fará integração com sistemas como SINIR, SIGOR ou Diários Oficiais na primeira versão. | Aberto |

---

## 8. Critérios de Conclusão da Fase 1

- [x] Todos os 14 módulos previstos têm escopo e finalidade documentados.
- [x] Todos os requisitos possuem identificadores únicos catalogados (140 requisitos funcionais).
- [ ] Os principais processos possuem fluxos detalhados passo a passo (Fase 1 - v0.2).
- [x] As regras transversais de negócio (RB-001 a RB-010) estão registradas formalmente.
- [ ] A matriz de permissões e perfis está fechada funcionalmente.
- [ ] Os requisitos do primeiro lançamento possuem critérios de aceitação verificáveis (Gherkin/BDD).
- [ ] As dependências entre módulos estão diagramadas e mapeadas.
- [ ] As 10 decisões pendentes possuem propostas e recomendações técnicas claras.
- [ ] O escopo do primeiro lançamento comercial (Release 1.0) está delimitado e aprovado.
- [ ] Não existem contradições conhecidas entre requisitos críticos.
