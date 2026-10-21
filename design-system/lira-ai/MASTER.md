# Design System Master File: Lira AI

> **LOGIC:** Regras globais de identidade visual e design system para a plataforma Lira AI.
> Siga rigorosamente os tokens semanticos e as diretrizes do conceito Biosfera Conectada.

---

**Projeto:** Lira AI
**Conceito da Marca:** Biosfera Conectada (Natureza, Tecnologia, IA, Sustentabilidade e Gestao)
**Categoria:** B2B SaaS de Gestao Ambiental Inteligente

---

## 1. Cores Oficiais e Tokens Semanticos

### Cores Principais

| Papel | Nome | Hex | Variavel CSS | Aplicacao |
|-------|------|-----|--------------|-----------|
| Primaria Institucional | Verde-floresta | `#123F35` | `--color-brand-primary` | Navegacao, menus, cabecalhos, autoridade |
| Primaria Interacao | Verde ambiental | `#21845B` | `--color-brand-secondary` | Botoes principais, links de acao, selecoes |
| Tecnologia e IA | Verde digital | `#65D6AD` | `--color-brand-accent` | Destaques de IA, marcadores, processamento |
| Apoio e Graficos | Verde broto | `#B8E0A5` | `--color-brand-sprout` | Fundos suaves, ilustracoes, metricas |

### Cores Complementares

| Papel | Nome | Hex | Variavel CSS | Aplicacao |
|-------|------|-----|--------------|-----------|
| Informativo / Hidrico | Azul-agua | `#176B82` | `--color-water` | Graficos de recursos hidricos, informacoes |
| Atencao / Alerta | Dourado Cerrado | `#D9A441` | `--color-cerrado` | Avisos moderados, prazos intermediarios |
| Solo / Territorio | Terra | `#A65B3F` | `--color-earth` | Indicadores de solo, georreferenciamento |

### Cores Neutras e Superficies

| Papel | Hex | Variavel CSS | Aplicacao |
|-------|-----|--------------|-----------|
| Fundo Geral | `#F5F7F5` | `--color-background` | Fundo claro padrao da aplicacao |
| Superficie / Cartoes | `#FFFFFF` | `--color-surface` | Paineis, modais, cards de dados |
| Bordas Discretas | `#E3E9E4` | `--color-border` | Divisores, molduras de campos |
| Texto Principal | `#26352F` | `--color-text-primary` | Titulos, cabecalhos, dados |
| Texto Secundario | `#66736B` | `--color-text-secondary` | Rotulos, legendas, apoios |

---

## 2. Tipografia

- **Familia Primaria:** Inter (Google Fonts)
- **Familia Secundaria:** Plus Jakarta Sans
- **Legibilidade:** Prioridade para alta densidade de dados, tabelas e indicadores corporativos.
- **Hierarquia:**
  - H1: 2rem / 32px a 2.5rem / 40px, bold (700)
  - H2: 1.5rem / 24px a 1.875rem / 30px, semibold (600)
  - H3: 1.25rem / 20px, semibold (600)
  - Corpo: 0.875rem / 14px a 1rem / 16px, regular (400)
  - Rotulos e Tabelas: 0.75rem / 12px a 0.875rem / 14px, medium (500) e semibold (600)

---

## 3. Conceito da Marca: Biosfera Conectada

- **Folha Conectada:** Simboliza a natureza, preservacao e sustentabilidade, unida a linhas e nos discretos de telemetria, dados e rastreabilidade digital.
- **Orbita Circular:** Simboliza o planeta, os ecossistemas interconectados e a visao sistemica da gestao ambiental corporativa.
- **Composicao Tipografica:** "Lira" com destaque institucional e "AI" com tratamento tecnologico discreto e elegante.

---

## 4. Componentes Padronizados

### Botoes

```css
/* Botao Principal: Verde Ambiental */
.btn-primary {
  background-color: #21845B;
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-primary:hover {
  background-color: #1A6B4A;
  transform: translateY(-1px);
}

/* Botao Institucional: Verde Floresta */
.btn-forest {
  background-color: #123F35;
  color: #FFFFFF;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
.btn-forest:hover {
  background-color: #0E322A;
}

/* Botao Secundario / Outline */
.btn-secondary {
  background-color: transparent;
  color: #123F35;
  border: 1px solid #E3E9E4;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
.btn-secondary:hover {
  background-color: #EBF6F1;
  border-color: #21845B;
  color: #21845B;
}
```

### Cartoes e Modais

```css
.card-compliance {
  background-color: #FFFFFF;
  border: 1px solid #E3E9E4;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(18, 63, 53, 0.04);
  transition: all 200ms ease;
}

.card-compliance:hover {
  box-shadow: 0 4px 12px rgba(18, 63, 53, 0.08);
}
```

---

## 5. Diretrizes para Recursos de IA

- O selo ou badge de IA usa Verde digital (`#65D6AD`) com fundo `#EDFAF5` e texto `#123F35`.
- Distincao clara entre sugestoes de IA e dados confirmados por revisao humana (conceito quatro-olhos).
- Sem efeitos neon ou estetica de ficcao cientifica exagerada.

---

## 6. Checklist de Acessibilidade (WCAG 2.2 AA)

- [x] Contraste minimo de 4.5:1 para texto normal e 3:1 para texto grande.
- [x] Foco visivel em navegacao por teclado.
- [x] Cores semanticas associadas a icones ou textos explicativos.
- [x] Zero emojis como icones permanentes: uso exclusivo de SVG.
- [x] Responsividade fluida para mobile, tablet e desktop.
