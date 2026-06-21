# Plano — Sistema de Acompanhamento de Clientes (K4 Marcas)

## 1. Objetivo

Construir um sistema único que acompanhe o cliente desde o fechamento do
contrato (via K4 ou via parceiro Escalada) até a finalização do processo,
substituindo o controle atual feito em 3 planilhas separadas e desconectadas
(`Recursos`, `Acompanhamento K4`, `Acompanhamento Escalada`).

Hoje a informação está fragmentada e duplicada entre planilhas. O sistema
deve:

- Unificar as duas origens de cliente (K4 e Escalada) em um único cadastro,
  mantendo os campos específicos de cada origem.
- Modelar cada tipo de serviço (registro de marca, exame prioritário,
  naming, fale conosco, desenho industrial, patente, monitoramento de uso
  indevido) como um módulo próprio, ligado ao mesmo cliente.
- Modelar os eventos que podem ocorrer **dentro** do processo de registro de
  marca (oposição, indeferimento, exigência, nulidade, arquivamento) como
  submódulos do processo, todos seguindo o mesmo padrão de campos.
- Gerar alertas de prazo (prazo do cliente e prazo fatal do INPI) e permitir
  filtrar/relatar por fase, vendedor, origem e status de pagamento.

## 2. Origens do cliente

Todo cliente entra no sistema por uma de duas origens, registrada no
cadastro do cliente:

- **K4** (fechado direto no escritório)
- **Escalada** (fechado pelo escritório parceiro)

Essa origem determina quais campos de contrato/pagamento se aplicam (ver
seção 4.1), mas a partir da entrada o restante do fluxo (fases do processo,
oposição, exigência etc.) é o mesmo para os dois.

## 3. Modelo de dados (entidades)

```
Cliente
 ├── Processo de Registro de Marca (1:N)
 │     ├── Oposição (0:1, se houver)
 │     ├── Indeferimento (0:1, se houver)
 │     ├── Exigência (0:N, pode haver mais de uma)
 │     ├── Nulidade (0:1, se houver)
 │     └── Arquivamento (0:1, se houver)
 ├── Exame Prioritário (0:N)
 ├── Projeto de Naming (0:N)
 ├── Fale Conosco (0:N)
 ├── Desenho Industrial (0:N)
 ├── Patente (0:N)
 └── Monitoramento de Uso Indevido / Plano Mensal (0:1, ativo ou não)
```

Cada cliente tem um cadastro único (nome, telefone, e-mail, vendedor,
origem). Os módulos abaixo pendem desse cadastro central — assim a mesma
pessoa pode ter, por exemplo, um registro de marca normal e também um
processo de exame prioritário, sem duplicar nome/telefone/e-mail.

## 4. Campos por módulo

### 4.1 Cliente (cadastro central)

| Campo | Observação |
|---|---|
| Nome | |
| DDD | |
| Telefone | |
| E-mail | |
| Vendedor | Escalada, Karina, Aline, Alexia, Nathalia |
| Origem | K4 ou Escalada |
| Pagamento ao escritório K4 | aplicável quando origem = K4 |
| Contato feito com o cliente (sim/não) | aplicável quando origem = Escalada |

### 4.2 Processo de Registro de Marca

| Campo | Observação |
|---|---|
| Marca | |
| Classe contratada | |
| Número do processo/protocolo | |
| Data de envio da taxa para a Escalada | só Escalada |
| Status do pagamento da taxa | |
| Valor do contrato | |
| Data de envio do protocolo no e-mail do cliente | |
| Fase atual | 1 - Exame formal / 2 - Oposição / 3 - Exame de mérito / 4 - Resultado final / 5 - Arquivado |

A fase do processo é o campo-chave que dispara (ou não) os submódulos de
oposição, exigência, indeferimento, nulidade ou arquivamento abaixo.

### 4.3 Exame Prioritário

| Campo |
|---|
| Vendedor |
| Pagamento K4 |
| Cliente |
| Marca |
| Classes |
| Processo |
| Documentos de prioridade |
| Contrato |
| Procuração |
| Declaração de atividade |
| Taxa |
| Protocolo da petição |
| E-mail encaminhado ao cliente |
| Observação |

### 4.4 Projeto de Naming

Inclui todos os campos básicos do cliente/processo, mais:

| Campo |
|---|
| Projeto finalizado (sim/não) |
| Data de entrega do projeto |
| Nome da marca escolhida |
| Observação |
| Desenvolvimento de logo (sim/não) |
| Parceiro que fez a logo | VEN ou Might |

### 4.5 Fale Conosco

| Campo |
|---|
| Cliente |
| Marca |
| Login da solicitação |
| Senha da solicitação |
| Data |
| Motivo |
| Conta para restituição | só se motivo = restituição de taxa |
| Valor | só se motivo = restituição de taxa |

### 4.6 Desenho Industrial / Patente / Monitoramento de Uso Indevido

São abas/módulos próprios — a definir em detalhe com você campo a campo
(ainda não foram especificados, exceto que existem). Proposta inicial: usar
a mesma estrutura de Processo de Registro de Marca (cliente, número de
processo, fase, datas, observação) como ponto de partida e ajustar depois
da revisão com você.

## 5. Submódulos de fase (dentro de Registro de Marca)

Todos seguem o mesmo "esqueleto" de rastreio + um bloco de campos
específicos.

**Esqueleto comum** (repetido em Oposição, Indeferimento, Exigência,
Nulidade):

- Origem do cliente (Escalada ou K4)
- Responsável
- Marca
- Classe
- Número do processo
- Datas de notificação ao cliente (e-mail e WhatsApp)
- Prazos (prazo do cliente para se manifestar / prazo fatal do INPI)
- Status da taxa (emitida/enviada/paga)
- Status da manifestação (elaborada, data e número do protocolo)
- Estratégia adotada

### 5.1 Oposição (Fase 2)

Campos específicos, além do esqueleto comum:

- INPI já notificou a oposição no processo? (sim/não)
- Marca oponente
- Número do processo do oponente
- Cliente vai se manifestar ou não

### 5.2 Indeferimento (Fase 4)

Tudo do esqueleto de oposição **mais**:

- Despacho do INPI
- Estratégia adotada, dentre:
  1. Aguardando decisão do cliente
  2. Não vai recorrer
  3. Recurso + retirada de nicho
  4. Recurso
  5. Novo pedido
  6. Recurso + nulidade
  7. Recurso + caducidade

### 5.3 Exigência

Tudo do esqueleto comum **mais**:

- Tipo de exigência:
  1. Atividade
  2. Nichos
  3. Pagamento
  4. Autorização de uso de nome civil na marca
  5. Itens ilícitos
  6. Outros (campo livre — lista deve ser revisada periodicamente
     consultando o INPI para novos motivos de exigência)

### 5.4 Nulidade

Segue o mesmo padrão do esqueleto comum (sem campos adicionais informados
até o momento).

### 5.5 Arquivamento

Importante: **não comunicar a mudança de fase ao cliente** neste caso —
campo de controle interno apenas.

Campos:

- Despacho
- Número do processo
- Marca
- Data do arquivamento
- Estratégia:
  - Solicitação de novo prazo para recolher a procuração
  - Recurso
- Data do protocolo
- Novo protocolo de registro
- Fase (1 a 5)

## 6. Migração das planilhas atuais

| Planilha atual | Destino no novo modelo |
|---|---|
| Recursos | Referência/apoio — avaliar quais dados ainda são usados e migrar campo a campo |
| Acompanhamento (K4) | Cliente + Processo de Registro de Marca (origem K4) + Exame Prioritário + Naming + Fale Conosco + outras abas (Desenho Industrial, Patente, Monitoramento) |
| Acompanhamento Escalada | Cliente + Processo de Registro de Marca (origem Escalada) |

Como as três planilhas ainda têm campos que não me foram detalhados
(Desenho Industrial, Patente, Monitoramento), o primeiro passo prático é eu
acessar os links e mapear coluna a coluna antes de definir o schema final
desses três módulos.

## 7. Arquitetura proposta

Duas opções, dependendo do quanto você quer sair do Google Sheets:

**Opção A — Evoluir dentro do Google Sheets/Apps Script**
- Consolidar as 3 planilhas em uma única base com abas por módulo,
  ligadas por um ID de cliente.
- Usar Google Apps Script para: gerar alertas de prazo (e-mail/WhatsApp),
  validar campos obrigatórios por fase, e dashboard de status.
- Vantagem: menor custo, equipe já usa Sheets, implementação rápida.
- Desvantagem: limitado para múltiplos usuários simultâneos, controle de
  acesso simples, sem app mobile.

**Opção B — Aplicação web dedicada**
- Banco de dados relacional (ex.: Postgres) com o modelo da seção 3.
- Aplicação web com login separado para equipe K4 e para a Escalada (a
  Escalada só vê/edita os campos do seu fluxo).
- Dashboard de fases, alertas automáticos de prazo, filtros por vendedor.
- Vantagem: escala, permissões reais, auditoria, automações mais robustas.
- Desvantagem: custo e tempo de desenvolvimento maiores.

**Recomendação**: começar pela Opção A (consolidação no Sheets) para
unificar os dados já existentes sem fricção, e migrar para a Opção B depois
que o modelo de campos estiver validado em uso real.

## 8. Próximos passos

1. Eu acessar as 3 planilhas para mapear os campos que ainda faltam
   (Desenho Industrial, Patente, Monitoramento de Uso Indevido) e confirmar
   nomes de colunas existentes.
2. Validar com você o modelo de dados das seções 3–5.
3. Definir a opção de arquitetura (A ou B).
4. Implementar a consolidação/migração dos dados.
5. Implementar alertas de prazo (oposição, exigência, indeferimento).
