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

Confirmado nas planilhas reais ("ESCALADA" e "K4 MARCAS"). As duas abas têm
estrutura quase idêntica, com pequenas diferenças de origem:

| Campo | Só Escalada | Só K4 |
|---|---|---|
| Contato (feito?) | sim | |
| DDD | sim | (telefone já vem com DDD em K4) |
| Telefone | sim | sim |
| E-mail | sim | sim |
| Nome / Cliente | sim | sim |
| Mês de venda | | sim |
| Vendedor | | sim |
| Pagamento ao escritório K4 | | sim |
| Plano | | sim (campo livre, pouco preenchido) |
| Classe | sim | sim |
| Marca | sim | sim |
| Estudo de viabilidade / Astrea viabilidade | sim | sim |
| Documentação (Doc / Astrea) | sim | sim |
| Contrato assinado | sim | sim |
| Procuração assinada | sim | sim |
| Cadastro INPI | sim | |
| Logo | sim | sim |
| Data de envio da taxa | sim | |
| Pagamento da taxa | sim | sim |
| Valor do contrato | sim | |
| Número do protocolo | sim | sim |
| Data de envio do protocolo ao e-mail do cliente | sim | sim |
| Fase 1 (Exame formal) | sim | sim |
| Fase 2 (status + oposição: houve ou não) | sim | (a aba K4 não tem coluna explícita de oposição na fase 2 — tratar via aba de Oposições) |
| Fase 3 (Exame de mérito) | sim | sim |
| Fase 4 (Resultado final) | sim | sim |

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
| Falta documento (observação do que falta) |
| Observação |

*(Confirmado na aba real "PRIORITARIOS" — campos batem com o que você
descreveu, com a coluna extra "Falta doc" usada como observação de
pendência documental.)*

#### 4.3.1 Despacho INPI (RPI) — vale para toda a base, não só Prioritário

> **Atualização**: a planilha anexada nasceu para acompanhar trâmite
> prioritário, mas você confirmou que o objetivo é usar a leitura semanal
> da RPI para **todos os processos de registro de marca** (K4 e
> Escalada), não só os prioritários. Por isso este submódulo deixa de ser
> exclusivo do Exame Prioritário e passa a ser um histórico vinculado a
> qualquer Processo de Registro de Marca pelo número do processo — ver
> seção 10 para o desenho completo da automação semanal.

Estrutura real do arquivo anexado:

| Campo | Observação |
|---|---|
| Nº RPI | número da edição da Revista da Propriedade Industrial em que o despacho saiu |
| Nº do processo | chave de ligação com o Exame Prioritário (e com o Processo de Registro de Marca) |
| Despacho | tipo do despacho publicado (lista observada abaixo) |
| Texto complementar | motivo detalhado — preenchido principalmente em indeferimentos e nas justificativas de prioridade concedida |
| Nome | nome do cliente/marca |
| E-mail | e-mail do cliente |
| Cliente comunicado | "OK" quando o cliente já foi avisado do despacho |

Despachos observados até agora (cada processo pode ter mais de um
despacho na mesma edição do RPI, conforme a fase avança):

- Petição de trâmite prioritário apta (aguardando término de prazo legal)
- Petição de trâmite prioritário atendida
- Publicação de pedido de registro para oposição (exame formal concluído)
- Deferimento do pedido
- Deferimento da petição
- Indeferimento do pedido
- Concessão de registro
- Sobrestamento do exame de mérito
- Notificação de recurso

Modelagem recomendada: tratar como um **histórico** (1 processo → N
despachos ao longo do tempo), não um campo único — cada linha do RPI é um
evento novo, não uma substituição do anterior. Isso também permite usar a
mesma estrutura para alimentar o campo de Fase do Exame Prioritário e do
Processo de Registro de Marca automaticamente (ex.: "Deferimento do
pedido" → Fase 4; "Publicação para oposição" → Fase 2), e para disparar o
aviso ao cliente quando "Cliente comunicado" ainda não estiver marcado
como OK.

Essa leitura de RPI é alimentada periodicamente (a cada edição publicada
pelo INPI) — no desenho do Apps Script (seção 7), prever uma rotina de
importação desses boletins e cruzamento automático pelo número do
processo com a base consolidada.

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

*(Confirmado na aba real "NAMING" — inclui também "Mês", "Pagamento K4" e
"Formulário [preenchido]" como campos de controle interno, além dos que
você listou.)*

### 4.5 Fale Conosco

| Campo |
|---|
| Contato |
| Cliente |
| Marca |
| Login da solicitação |
| Senha da solicitação |
| Data |
| Conta | preenchido apenas quando o motivo é restituição de taxa |
| Valor | preenchido apenas quando o motivo é restituição de taxa |
| Data do retorno |
| Motivo |

*(Confirmado na aba real "FALE CONOSCO" — a ordem real das colunas tem
"Conta"/"Valor"/"Data do retorno" antes de "Motivo", e existe um campo
extra "Data do retorno" que você não tinha mencionado, útil para medir o
tempo de resposta do escritório.)*

### 4.6 Patente e Desenho Industrial — separados na v1

> **Atualização**: na planilha real hoje, Patente e Desenho Industrial
> estão misturados em uma única aba ("DESENHO IND PATENTE"). Você decidiu
> **separar os dois cadastros** na planilha consolidada, já que cada um
> passou a ter sua própria automação de leitura da RPI (Patentes via XML
> 100% automático, seção 9.4; Desenho Industrial via PDF com revisão
> humana, ainda pendente). Os campos abaixo são os mesmos da aba real —
> a separação está em ter duas abas (`PROCESSOS_PATENTE` e
> `PROCESSOS_DESENHO_INDUSTRIAL`) em vez de uma, cada uma com seu próprio
> histórico de despachos vinculado pelo número do processo.

Campos comuns às duas abas (idênticos ao padrão de "K4 MARCAS"):

| Campo |
|---|
| Mês |
| Vendedor |
| Pagamento K4 |
| Telefone |
| Cliente |
| Marca/objeto |
| Doc |
| Astrea |
| Contrato (assinado?) |
| Procuração (assinada?) |
| Logo |
| Taxa / pagamento da taxa |
| Protocolo — em Patente, número no formato `BR NN NNNN NNNNNN-D`; em Desenho Industrial, número no formato `BR 30 NNNN NNNNNN-D` |
| E-mail |
| Data do protocolo |
| Fase 1 / Fase 3 / Fase 4 (não há "Fase 2" — nem Patente nem Desenho Industrial têm fase de oposição de terceiros como Marca) |

Diferença entre as duas abas na consolidação:

- **PROCESSOS_PATENTE**: vinculada ao histórico `DESPACHOS_PATENTES`
  (seção 11.2), atualizado automaticamente toda terça a partir do XML da
  RPI, com extração dinâmica de prazo via regex no texto do despacho.
- **PROCESSOS_DESENHO_INDUSTRIAL**: vinculada ao histórico
  `DESPACHOS_DESENHO_INDUSTRIAL`, que por ora depende do PDF (pendente —
  item 15 dos próximos passos) e passa pela fila de revisão humana antes
  de gerar prazo automaticamente.

### 4.7 Monitoramento de Uso Indevido / Plano Mensal

Aba real "ACOMP MENSAL", mais simples do que os outros módulos:

| Campo |
|---|
| Início (data) |
| Plano (ex.: Anual) |
| Telefone |
| Cliente |
| Marca |
| Protocolo (vinculado ao processo de registro, se houver) |

## 5. Submódulos de fase (dentro de Registro de Marca)

Esta seção foi conferida diretamente na planilha real "Planilha de
Recursos — Oposições, Indeferimentos, Nulidades..." (abas OPOSIÇÕES,
INDEFERIMENTO, EXIGENCIAS, NULIDADE, ARQUIVADOS). Os campos reais são mais
simples do que o roteiro completo que você descreveu — abaixo, para cada
submódulo, listo (a) os campos que já existem hoje na planilha e (b) os
campos que você pediu e que **ainda não existem** na planilha atual e
precisam ser adicionados na consolidação.

### 5.1 Oposição (Fase 2) — aba real "OPOSIÇÕES"

Campos já existentes:

| Campo |
|---|
| Notificação (INPI já notificou? sim/não) |
| Empresa (origem: Escalada ou K4) |
| Responsável |
| Marca (+ classe entre parênteses) |
| Número do processo |
| Marca oponente / número do processo (em uma única coluna combinada) |
| Contato (data) |
| Prazo escritório |
| Prazo fatal INPI |
| Vai se manifestar? |
| Emissão de taxa e envio ao cliente |
| Taxa paga |
| Manifestação elaborada |
| Data do protocolo da manifestação |
| Estratégia |

Campos pedidos por você que **faltam** na planilha atual e devem ser
adicionados na consolidação:

- Data de notificação ao cliente por e-mail (separada do WhatsApp)
- Data de notificação ao cliente por WhatsApp (separada do e-mail)
- Marca oponente e número do processo do oponente em colunas separadas
  (hoje estão juntas em uma coluna de texto livre)
- Número do protocolo da manifestação (hoje só tem a data)

### 5.2 Indeferimento (Fase 4) — aba real "INDEFERIMENTO"

Campos já existentes:

| Campo |
|---|
| Origem (Escalada ou K4) |
| Cliente |
| Contato |
| Número do processo |
| Notificado por e-mail (sim/não) |
| Notificado por WhatsApp (sim/não) |
| Estratégia de solução (campo livre) |
| Despacho |
| Prazo escritório |
| Prazo INPI |
| Vai se manifestar ou novo pedido? |
| Taxa (paga?) |
| Recurso elaborado? |
| Data de protocolo do recurso |
| Resultado final |

A aba já separa notificação por e-mail e WhatsApp (diferente da aba de
Oposição). A "Estratégia de solução" hoje é texto livre — recomendo
padronizar como lista fixa, conforme você definiu:

1. Aguardando decisão do cliente
2. Não vai recorrer
3. Recurso + retirada de nicho
4. Recurso
5. Novo pedido
6. Recurso + nulidade
7. Recurso + caducidade

### 5.3 Exigência — aba real "EXIGENCIAS"

Campos já existentes:

| Campo |
|---|
| Origem (Escalada ou K4) |
| Cliente |
| Telefone |
| Número do processo |
| Tipo de exigência (campo livre) |
| Notificado por e-mail (sim/não) |
| Notificado por WhatsApp (sim/não) |
| Despacho |
| Contato (data) |
| Prazo escritório |
| Prazo INPI |
| Cliente vai cumprir a exigência? |
| Taxa (status) |
| Exigência formalizada/respondida? |
| Data do protocolo |

"Tipo de exigência" já existe como campo, mas é texto livre. Padronizar
como lista fixa:

1. Atividade
2. Nichos
3. Pagamento
4. Autorização de uso de nome civil na marca
5. Itens ilícitos
6. Outros (revisar periodicamente no INPI quais novos motivos de
   exigência podem surgir)

### 5.4 Nulidade — aba real "NULIDADE"

Campos já existentes:

| Campo |
|---|
| Responsável |
| Origem (Escalada ou K4) |
| Marca |
| Número do processo |
| Contato |
| Prazo escritório |
| Prazo INPI |
| Vai se manifestar? |
| Taxa paga? |
| Manifestação/recurso elaborado? |
| Data do protocolo do recurso |
| Estratégia adicional para o deferimento |
| Deferido (sim/não) |
| Data |

Aqui também faltam, comparado ao que você descreveu: separação de
notificação por e-mail/WhatsApp e número do protocolo (hoje só data).

### 5.5 Arquivamento — aba real "ARQUIVADOS"

Importante: **não comunicar a mudança de fase ao cliente** neste caso —
campo de controle interno apenas (assim como a planilha real já indica
explicitamente em uma observação na própria aba).

Campos já existentes:

| Campo |
|---|
| Despacho |
| Número do processo arquivado |
| Marca |
| Data do arquivamento |
| Taxa de prazo |
| Taxa de anexo |
| Taxa de recurso (art. 333) |
| Data do protocolo |
| Novo protocolo |
| 2ª fase |
| 3ª fase |
| 4ª fase |

A planilha real já tem 3 colunas de taxa diferentes (prazo, anexo, recurso
art. 333) que não estavam no seu resumo inicial — bom manter, pois cada
uma trata de uma exigência financeira distinta do processo arquivado.
Padronizar a estratégia como lista fixa:

- Solicitação de novo prazo para recolher a procuração
- Recurso

## 6. Migração das planilhas atuais

Mapeamento já validado a partir dos dois arquivos reais analisados:

**Arquivo "Acompanhamento_Registro_de_Marca"**

| Aba real | Destino no novo modelo |
|---|---|
| ESCALADA | Cliente (origem Escalada) + Processo de Registro de Marca |
| K4 MARCAS | Cliente (origem K4) + Processo de Registro de Marca |
| PRIORITARIOS | Exame Prioritário |
| NAMING | Projeto de Naming |
| FALE CONOSCO | Fale Conosco |
| DESENHO IND PATENTE | Desenho Industrial / Patente (uma única aba/módulo) |
| ACOMP MENSAL | Monitoramento de Uso Indevido (plano mensal) |
| Página24 | Aba residual/rascunho com poucos dados — avaliar se ainda é usada antes de migrar |

**Arquivo "Planilha de Recursos — Oposições, Indeferimentos, Nulidades..."**

| Aba real | Destino no novo modelo |
|---|---|
| OPOSIÇÕES | Submódulo Oposição, vinculado ao Processo de Registro de Marca pelo nº de processo |
| INDEFERIMENTO | Submódulo Indeferimento |
| EXIGENCIAS | Submódulo Exigência |
| NULIDADE | Submódulo Nulidade |
| ARQUIVADOS | Submódulo Arquivamento |
| Guia de Análises | Não é dado estruturado — é um texto-guia de critérios de análise para recurso de indeferimento; manter como documentação/checklist de apoio à equipe, não como módulo de dados |

A chave de junção entre as duas planilhas é o **número do processo** (ou
nome da marca/cliente, quando o processo não bate por divergência de
digitação). Isso confirma que hoje a equipe já mantém esses dados
separados por planilha e cruza manualmente — o sistema novo deve eliminar
essa necessidade de cruzamento manual.

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

**Decisão confirmada**: seguir pela Opção A (consolidação no Sheets/Apps
Script) na v1. A Opção B fica como evolução futura, se necessário, depois
que o modelo de campos estiver validado em uso real.

## 8. Decisões tomadas (v1)

Você confirmou que a v1 já deve incluir:

1. **Oposição e Nulidade**: separar a notificação ao cliente em duas datas
   distintas — e-mail e WhatsApp (hoje é um único campo "Contato").
2. **Oposição**: separar a coluna única "Marca oponente / Nº processo" em
   dois campos — marca oponente e número do processo do oponente.
3. **Oposição e Nulidade**: adicionar o campo "Número do protocolo da
   manifestação/recurso" (hoje só existe a data do protocolo).
4. **Indeferimento**: padronizar "Estratégia de solução" como lista fixa
   das 7 opções definidas, **com uma opção adicional "Outro" de texto
   livre** para casos que não se encaixem nas opções padrão.
5. **Exigência**: padronizar "Tipo de exigência" como lista fixa das 5
   opções definidas, **também com opção "Outro" de texto livre**.
6. **Arquitetura**: seguir pela **Opção A — consolidação no Google
   Sheets/Apps Script** (não app web dedicado, por ora).

Esses pontos atualizam os esqueletos das seções 5.1, 5.2, 5.3 e 5.4: cada
campo de "Estratégia"/"Tipo de exigência" passa a ser
`lista fixa + campo "Outro" (texto livre)`, em vez de texto livre puro ou
lista fechada sem fallback.

## 9. Automação semanal da RPI (toda terça-feira)

Você confirmou dois pontos que viabilizam automação completa, sem
intervenção manual de download:

- O INPI publica a RPI em **arquivo XML oficial**, estruturado por
  processo e código de despacho.
- O acesso é **público, sem necessidade de login**.

Isso significa que o Apps Script pode buscar e processar a RPI sozinho,
toda terça-feira, sem a equipe precisar entrar no site do INPI.

### 9.1 Fluxo proposto

1. **Gatilho semanal (time-driven trigger)**: configurado no Apps Script
   para rodar toda terça-feira, no horário em que a RPI costuma ser
   publicada (com uma margem de segurança, ex.: rodar de novo algumas
   horas depois caso o arquivo ainda não esteja disponível).
2. **Download automático**: `UrlFetchApp` busca o arquivo
   `https://revistas.inpi.gov.br/txt/RM<edição>.zip` (padrão confirmado
   por você — ex.: `RM2893.zip`). O número da edição é sequencial
   (incrementa 1 por semana), então a planilha consolidada guarda em uma
   célula de configuração qual foi a última edição processada, e o
   script tenta a próxima (`última + 1`) a cada execução. Se o download
   falhar (edição ainda não publicada), o script tenta novamente em
   execuções seguintes e avisa a equipe se passar de X tentativas.
3. **Descompactação + parsing**: `Utilities.unzip()` extrai o
   `RM<edição>.xml` de dentro do ZIP; `XmlService` (nativo do Apps Script)
   lê esse XML e extrai, por processo: número do RPI, número do processo,
   código/descrição do despacho, texto complementar.
4. **Filtro pela nossa base**: o script cruza cada número de processo do
   XML com os números de processo já cadastrados nas abas consolidadas
   (ESCALADA, K4 MARCAS, PRIORITARIOS, e também DESENHO IND PATENTE, se
   aplicável). Só os que baterem entram no histórico — o resto do XML
   (milhares de processos de terceiros) é descartado.
5. **Gravação no histórico de Despacho INPI** (seção 4.3.1): uma linha
   nova por despacho, vinculada ao processo do cliente, com data da
   leitura.
6. **Atualização automática de fase**: uma tabela de mapeamento
   "Despacho → Fase/Ação" (ver 9.2) decide se a fase do processo muda e
   se algum submódulo (Oposição, Indeferimento, Exigência, Nulidade,
   Arquivamento) deve ser aberto automaticamente com os dados básicos já
   preenchidos (cliente, marca, número do processo, data do despacho).
7. **Geração de prazo**: quando o despacho exige ação (ex.: indeferimento
   abre prazo de recurso), o script já cria a linha de prazo no submódulo
   correspondente, com a data fatal calculada a partir da data do
   despacho.
8. **Aviso interno**: e-mail (ou outro canal que vocês definirem) para a
   equipe toda terça, listando: clientes afetados, despacho recebido,
   fase nova, prazo criado e responsável (vendedor) — para que a equipe
   trate cada caso sem precisar caçar processo por processo no site do
   INPI.

### 9.2 Tabela de mapeamento "Despacho → Fase/Ação"

Para os despachos já identificados no arquivo de exemplo, proposta
inicial (a validar com você, pois a regra de prazo de cada despacho é
know-how do escritório):

| Despacho | Fase resultante | Gera prazo de ação? |
|---|---|---|
| Publicação de pedido de registro para oposição (exame formal concluído) | Fase 2 | Não diretamente — só monitorar se entra oposição de terceiro depois |
| Deferimento do pedido | Fase 4 (deferido) | Não — só comunicar cliente |
| Concessão de registro | Fase 4 (concluído) | Não — encerrar processo, comunicar cliente |
| Indeferimento do pedido | Fase 4 (indeferido) | **Sim** — abre submódulo Indeferimento com prazo de recurso |
| Sobrestamento do exame de mérito | Mantém fase atual | Não — apenas registrar, sem prazo |
| Notificação de recurso | Mantém o submódulo/fase em andamento | **Sim** — é a notificação que o INPI publica na RPI para iniciar a contagem do prazo de resposta; vale para qualquer procedimento em curso (oposição, exigência, recurso etc.), não é exclusiva de recurso. O script deve gerar/atualizar o prazo no submódulo que já estiver ativo para aquele processo; se não houver nenhum submódulo aberto ainda, criar um registro genérico de prazo para a equipe identificar a que procedimento se refere |
| Petição de trâmite prioritário apta / atendida | Mantém fase atual | Não — só informativo |

Esta tabela **não é exaustiva**: o INPI tem um catálogo mais amplo de
despachos do que os 9 observados no arquivo de exemplo (uma única edição
da RPI). Recomendo tratá-la como uma aba de configuração editável na
planilha (não fixa no código), para a equipe completar conforme novos
despachos forem aparecendo nas próximas edições, sem precisar de mim para
alterar o script toda vez.

### 9.3 Padrão de download confirmado

Você confirmou o link real de uma edição baixada
(`https://revistas.inpi.gov.br/txt/RM2893.zip`), o que fecha o desenho
técnico do download:

- **Site**: https://revistas.inpi.gov.br/rpi/ → Seção V Marcas
- **Padrão de URL do arquivo**: `https://revistas.inpi.gov.br/txt/RM<edição>.zip`
  (ex.: edição 2893 → `RM2893.zip`)
- **Conteúdo do ZIP**: um único arquivo `RM<edição>.xml`
- **Acesso**: público, sem login — confirma que `UrlFetchApp` funciona
  sem necessidade de autenticação

Não foi possível validar esse link diretamente nesta sessão porque o
ambiente em que estou rodando bloqueia o acesso à internet por uma
política de rede própria (não é um bloqueio do INPI) — a confirmação veio
do link real que você copiou do navegador. Esse padrão deve ser testado
de fato dentro do Apps Script (que roda nos servidores do Google, sem
essa restrição) antes de ir para produção.

### 9.4 Estendendo a automação para Patentes e Desenho Industrial

Você confirmou que essas duas seções da RPI também são prioridade agora.
Os formatos disponíveis são diferentes do XML de Marcas, então o nível de
automação muda para cada uma:

**Seção VI Patentes — padrão de URL confirmado — ZIP traz TXT e XML**

- **Padrão**: `https://revistas.inpi.gov.br/txt/P<edição>.zip`
  (ex.: edição 2893 → `P2893.zip`) — mesma lógica de Marcas, só troca o
  prefixo de `RM` para `P`.
- O ZIP real contém **dois arquivos**: `P<edição>.txt` (texto simples) e
  `Patente_<edição>_<data>.xml` (XML estruturado, com `<despacho>`,
  `<codigo>`, `<titulo>`, `<processo-patente><numero>` e `<comentario>`)
  — vamos usar o **XML**, é mais confiável para parsing que o TXT.
- O catálogo de despachos de Patentes é muito maior que o de Marcas: só
  na edição 2893 apareceram **86 códigos de despacho distintos** (contra
  9 de Marcas) — famílias como exigência formal (`2.x`), exigência
  técnica (`6.x`), publicação (`3.x`), deferimento/indeferimento (`9.x`),
  arquivamento (`8.x`/`11.x`), recurso (`12.x`/`100.x`/`111`-`130`),
  concessão (`16.1`), nulidade (`200`/`201`), trâmite prioritário
  (`28.x`), transferência/alteração de titularidade (`25.x`) etc.
- **Achado importante**: o INPI costuma escrever o próprio prazo dentro
  do texto do despacho (`<comentario>`), por exemplo:
  - Código `2.5` (Exigência Formal Preliminar): *"Prazo para cumprimento
    - 30 (Trinta) dias corridos contados do 1º dia útil após essa
    publicação"*
  - Código `28.21` (Exigência formal de trâmite prioritário):
    *"manifestar-se [...] no prazo de 60 dias, sob pena de inadmissão"*
  - Código `100.1` (Recurso provido): *"corre o prazo de 60 (sessenta)
    dias para o pagamento da retribuição"*
  - Código `121` (Exigência): *"Cumpra as exigências do parecer no prazo
    de 60 (sessenta) dias"*
  - Isso muda a estratégia: em vez de depender só de uma tabela fixa
    "código → prazo" (inviável de montar à mão para 86+ códigos, e o
    INPI pode criar novos), o script deve **extrair o prazo
    dinamicamente do próprio texto do despacho** via regex (padrão
    `prazo de N dias`/`prazo para cumprimento - N dias`), calculando a
    data fatal a partir da data de publicação da RPI.
  - Para despachos sem prazo explícito no texto (a maioria — ex.:
    "Concessão de Patente", "Notificação de recebimento",
    "Arquivamento"), o tratamento é apenas informativo: atualiza o
    histórico e a fase, sem gerar prazo de ação.
  - Uma tabela de configuração "código → família/ação" (editável, não
    fixa no script) continua útil para decidir **qual fase/submódulo**
    cada código deve atualizar — mas a extração do **prazo em si** não
    deve depender de mapear código por código.

**Seção III Desenho Industrial — só existe em PDF — padrão de URL confirmado**

- **Padrão**: `https://revistas.inpi.gov.br/pdf/Desenhos_Industriais<edição>.pdf`
  (ex.: edição 2893 → `Desenhos_Industriais2893.pdf`) — note que aqui o
  arquivo é o PDF direto, sem ZIP, diferente de Marcas e Patentes.
- Você decidiu pela abordagem de **automação com revisão humana**: o
  Apps Script baixa o PDF e tenta extrair o texto automaticamente (via
  conversão do PDF para Google Doc pelo Drive, que faz OCR), pré-
  preenchendo o histórico de despachos do processo — mas **toda linha
  extraída de PDF entra marcada como "a confirmar"**, e o sistema só gera
  prazo de ação automaticamente depois que alguém da equipe revisar e
  validar aquele despacho. Isso evita que um erro de leitura de PDF (ex.:
  um dígito errado no número do processo, ou um prazo mal interpretado)
  vire uma perda de prazo real sem ninguém notar.
- Esse fluxo de revisão precisa de uma aba/visão dedicada: "Despachos
  pendentes de confirmação" — lista só os despachos extraídos de PDF
  ainda não revisados, para a equipe checar rapidamente toda terça antes
  de seguir com o resto do trabalho.

Como as três seções compartilham o número de edição (a mesma terça-feira
publica `RM<n>`, `P<n>` e `Desenhos_Industriais<n>` juntos), o mesmo
gatilho semanal do Apps Script pode buscar as três de uma vez, usando o
mesmo contador de "última edição processada".

## 10. Próximos passos

1. ~~Mapear os campos reais de Desenho Industrial, Patente e Monitoramento~~
   — concluído com a análise dos dois arquivos enviados (seções 4.6, 4.7 e
   6).
2. ~~Decidir quais lacunas entram na v1~~ — concluído, ver seção 8.
3. ~~Decidir a arquitetura~~ — concluído: Opção A (Sheets/Apps Script).
4. ~~Confirmar o link/padrão de URL de download da RPI~~ — concluído,
   ver seção 9.3 (`https://revistas.inpi.gov.br/txt/RM<edição>.zip`).
5. Validar comigo a tabela de mapeamento "Despacho → Fase/Ação" da seção
   9.2 — especialmente os despachos marcados como "a confirmar".
6. Definir a chave de vinculação entre o processo de registro e seus
   submódulos de fase — recomendo usar o **número do processo** como
   identificador único, já que é o campo presente em todas as abas.
7. Desenhar a planilha consolidada (abas + colunas finais, incluindo os 6
   ajustes da seção 8, o histórico de Despacho INPI/RPI da seção 4.3.1, e
   a aba de configuração "Despacho → Fase/Ação") e o roteiro do Apps
   Script (validações, alertas de prazo, dropdown com "Outro" para
   Estratégia/Tipo de exigência, e a automação semanal da seção 9).
8. Migrar os dados reais das três planilhas analisadas (Acompanhamento,
   Recursos, RPI) para a planilha consolidada.
9. Implementar os alertas automáticos de prazo (oposição, exigência,
   indeferimento, nulidade) e o aviso de "cliente ainda não comunicado"
   a partir do histórico de Despacho INPI.
10. Testar o download via `UrlFetchApp` dentro do próprio Apps Script
    (servidor do Google, sem a restrição de rede desta sessão) para
    validar o padrão de URL na prática antes de ir para produção.
11. ~~Confirmar o link/padrão de URL de Patentes e Desenho Industrial~~ —
    concluído, ver seção 9.4 (`P<edição>.zip` e
    `Desenhos_Industriais<edição>.pdf`).
12. Desenhar a aba "Despachos pendentes de confirmação" para a revisão
    manual dos despachos extraídos de PDF (Desenho Industrial).
13. ~~Analisar o catálogo de despachos de Patentes~~ — concluído com o
    arquivo `P2893.zip` real (seção 9.4): 86 códigos distintos, com
    extração dinâmica de prazo a partir do texto do próprio despacho.
14. Construir a regex de extração de prazo a partir do `<comentario>` dos
    despachos de Patentes (padrões "prazo de N dias" / "prazo para
    cumprimento - N dias") e validar com a equipe os casos que escapam
    desse padrão.
15. **Pendente — Desenho Industrial**: você vai enviar o PDF
    (`Desenhos_Industriais2893.pdf` ou outra edição) quando conseguir,
    para eu repetir essa mesma análise. Até lá, seguimos com Marcas e
    Patentes já fechados e o módulo de Desenho Industrial entra na
    planilha consolidada como pendente de detalhamento (sem bloquear o
    resto do desenho — seção 11).

## 11. Desenho da planilha consolidada (v1)

Estrutura proposta de abas para a nova planilha única, juntando tudo que
já foi validado (Marcas e Patentes fechados; Desenho Industrial entra
como pendente, sem travar o resto).

### 11.1 Abas de cadastro/operacionais (dados que a equipe preenche)

| Aba | Conteúdo | Chave |
|---|---|---|
| CLIENTES | Cadastro central (seção 4.1) | ID do cliente |
| PROCESSOS_MARCA | Processo de Registro de Marca (seção 4.2), com coluna de origem K4/Escalada | Nº do processo |
| OPOSICOES | Submódulo Oposição (seção 5.1, já com os 3 campos novos da v1) | Nº do processo |
| INDEFERIMENTOS | Submódulo Indeferimento (seção 5.2), com dropdown de Estratégia + "Outro" | Nº do processo |
| EXIGENCIAS | Submódulo Exigência (seção 5.3), com dropdown de Tipo + "Outro" | Nº do processo |
| NULIDADES | Submódulo Nulidade (seção 5.4) | Nº do processo |
| ARQUIVADOS | Submódulo Arquivamento (seção 5.5) | Nº do processo |
| EXAME_PRIORITARIO | Exame Prioritário (seção 4.3) | Nº do processo |
| NAMING | Projeto de Naming (seção 4.4) | ID do cliente |
| FALE_CONOSCO | Fale Conosco (seção 4.5) | ID do cliente |
| PROCESSOS_PATENTE | Processos de Patente, separado de Desenho Industrial (seção 4.6) | Nº do processo (formato `BR NN NNNN NNNNNN-D`) |
| PROCESSOS_DESENHO_INDUSTRIAL | Processos de Desenho Industrial, separado de Patente (seção 4.6) — campos de despacho ainda pendentes de detalhamento (item 15) | Nº do processo (formato `BR 30 NNNN NNNNNN-D`) |
| ACOMP_MENSAL | Monitoramento de uso indevido (seção 4.7) | ID do cliente |

### 11.2 Abas alimentadas automaticamente pela leitura semanal da RPI

| Aba | Conteúdo | Alimentada por |
|---|---|---|
| DESPACHOS_MARCAS | Histórico de despachos de Marcas (seção 4.3.1) | XML `RM<edição>.xml`, 100% automático |
| DESPACHOS_PATENTES | Histórico de despachos de Patentes | XML `Patente_<edição>.xml`, 100% automático, com extração dinâmica de prazo via regex no `<comentario>` (seção 9.4) |
| DESPACHOS_DESENHO_INDUSTRIAL | Histórico de despachos de Desenho Industrial | PDF, automação com revisão humana — pendente até item 15 |
| DESPACHOS_PENDENTES_CONFIRMACAO | Fila de revisão manual: só os despachos extraídos do PDF de Desenho Industrial ainda não validados pela equipe | Gerada a partir de DESPACHOS_DESENHO_INDUSTRIAL |
| PAINEL_PRAZOS | Visão consolidada de todos os prazos em aberto (de Oposição, Indeferimento, Exigência, Nulidade e dos despachos de Marcas/Patentes que geram prazo), ordenado por data fatal | Agregação das abas acima |

### 11.3 Abas de configuração (a equipe edita sem precisar de mim)

| Aba | Conteúdo |
|---|---|
| CONFIG_RPI | Última edição da RPI processada por seção (Marcas, Patentes, Desenho Industrial) — o script lê aqui antes de buscar a próxima edição |
| CONFIG_DESPACHO_MARCA | Tabela "Despacho → Fase/Ação" de Marcas (seção 9.2), já fechada com os 9 despachos observados, editável para novos despachos |
| CONFIG_DESPACHO_PATENTE | Tabela "Código → família/ação" de Patentes (seção 9.4) — não controla prazo (que é extraído dinamicamente do texto), só decide a qual fase/submódulo o despacho se refere |
| CONFIG_ESTRATEGIA_INDEFERIMENTO | As 7 opções fixas + "Outro" (decisão da seção 8) |
| CONFIG_TIPO_EXIGENCIA | As 5 opções fixas + "Outro" (decisão da seção 8) |

**Montadas como planilha real**: as duas primeiras já existem como arquivo
`CONFIG_DESPACHOS_RPI.xlsx` (raiz do repositório), com uma aba para cada
uma, prontas para importar/colar na planilha consolidada:

- **CONFIG_DESPACHO_MARCA**: os 9 despachos da seção 9.2, com colunas
  Despacho, Fase resultante, Gera prazo de ação?, Submódulo a abrir,
  Observação.
- **CONFIG_DESPACHO_PATENTE**: os **86 códigos reais** extraídos da edição
  2893 (`Patente_2893_16062026.xml`), com colunas Código, Despacho
  (título), Família, Fase resultante, Gera prazo (extração dinâmica)?,
  Submódulo a abrir/atualizar, Observação. A coluna de prazo já vem
  marcada com "Sim (extração dinâmica)" só nos 6 códigos onde o texto do
  despacho trouxe um padrão de prazo consistente em **todas** as
  ocorrências da edição analisada (`2.5`, `28.21`, `100.1`, `121`,
  `15.22`, e parcialmente `1.5`) — os demais códigos de exigência/recurso/
  arquivamento estão marcados como "Verificar texto", para a equipe
  confirmar em mais edições antes de confiar 100% na extração automática.
  CONFIG_ESTRATEGIA_INDEFERIMENTO e CONFIG_TIPO_EXIGENCIA ainda faltam
  montar como arquivo (próxima complementação).

### 11.4 Observação sobre a chave de vinculação

O **número do processo** é a chave usada para ligar Processo de Registro
↔ submódulos de fase ↔ histórico de despachos, conforme já recomendado no
item 6 dos próximos passos. Como Marcas, Patentes e Desenho Industrial têm
faixas de numeração diferentes (Marcas: números puramente numéricos de 9
dígitos; Patentes: formato `BR NN NNNN NNNNNN-D`), não há risco de
colisão entre módulos usando essa mesma chave.

## 12. Roteiro técnico do Apps Script

### 12.1 Estrutura de arquivos/funções

```
Config.gs        — leitura/escrita das abas CONFIG_* (última edição
                    processada, tabelas de mapeamento)
RpiMarcas.gs      — download, descompactação, parsing do XML de Marcas
RpiPatentes.gs    — download, descompactação, parsing do XML de Patentes,
                    extração dinâmica de prazo via regex
RpiDesenho.gs     — download e extração via OCR do PDF de Desenho
                    Industrial (pendente até fechar item 15)
Matching.gs       — cruza número de processo do XML/PDF com a base
                    (PROCESSOS_MARCA, PROCESSOS_PATENTE,
                    PROCESSOS_DESENHO_INDUSTRIAL)
FaseEAcao.gs      — aplica as tabelas CONFIG_DESPACHO_* para atualizar
                    fase e abrir/atualizar submódulos
Prazos.gs         — calcula data fatal, grava em PAINEL_PRAZOS
Notificacoes.gs   — monta e envia o e-mail/aviso semanal para a equipe
Main.gs           — função `rotinaSemanalRPI()` chamada pelo trigger,
                    orquestra a chamada das funções acima em sequência
```

### 12.2 Pseudocódigo da rotina principal

```js
function rotinaSemanalRPI() {
  const config = Config.lerUltimasEdicoes(); // {marcas, patentes, desenho}

  processarSecao('marcas',  config.marcas + 1,  RpiMarcas.baixarEParsear);
  processarSecao('patentes', config.patentes + 1, RpiPatentes.baixarEParsear);
  processarSecao('desenho',  config.desenho + 1,  RpiDesenho.baixarEParsear);

  Notificacoes.enviarResumoSemanal();
}

function processarSecao(secao, edicao, funcaoDeParsing) {
  let despachos;
  try {
    despachos = funcaoDeParsing(edicao); // lança erro se edição ainda não publicada
  } catch (e) {
    Notificacoes.avisarFalhaDownload(secao, edicao, e);
    return; // tenta de novo na próxima execução, sem travar as outras seções
  }

  const despachosDoEscritorio = Matching.filtrarPorProcessosConhecidos(secao, despachos);
  despachosDoEscritorio.forEach(d => {
    Historico.gravar(secao, d);
    const acao = FaseEAcao.aplicar(secao, d); // atualiza fase, abre submódulo
    if (acao.geraPrazo) Prazos.criar(d, acao);
  });

  Config.atualizarUltimaEdicao(secao, edicao);
}
```

Pontos importantes desse desenho:

- **Cada seção falha de forma independente**: se a edição de Patentes
  ainda não foi publicada nesta terça, isso não impede que Marcas seja
  processado normalmente.
- **Idempotência**: gravar o histórico verificando se aquele
  despacho (processo + código + edição) já existe antes de duplicar,
  para o caso do trigger rodar mais de uma vez na mesma semana (ex.: retry
  manual).
- **Desenho Industrial entra no mesmo orquestrador** desde já (a função
  `RpiDesenho.baixarEParsear` fica como stub/pendente), para não precisar
  reestruturar o `Main.gs` quando o módulo for fechado — só implementar o
  conteúdo da função quando tivermos o PDF de exemplo.

### 12.3 Gatilho e operação

- **Trigger**: time-driven, semanal, terça-feira, horário a definir com
  margem de segurança após a publicação oficial da RPI.
- **Retry**: se uma seção falhar (edição ainda não disponível), um
  segundo trigger algumas horas depois tenta novamente; se ainda falhar,
  o aviso por e-mail sinaliza para a equipe acompanhar manualmente aquela
  seção até a próxima tentativa.
- **Limites do Apps Script**: execução tem tempo máximo de 6 minutos por
  chamada — como o volume de despachos por edição é grande (vimos 4.240
  despachos só em Patentes na edição 2893), o parsing deve filtrar pela
  nossa base o mais cedo possível (já durante a leitura do XML, não
  depois de carregar tudo em memória), para não aproximar do limite.
- **Log de execução**: cada rodada grava um resumo (edições processadas,
  despachos encontrados, falhas) em uma aba de log simples, para
  diagnóstico caso algo pare de funcionar.

### 12.4 O que falta para implementar de fato

1. Eu preciso de acesso de edição à planilha (ou você cria a estrutura de
   abas da seção 11 e me dá acesso) para escrever o código dentro do
   editor de Apps Script vinculado a ela.
2. Confirmar o horário real de publicação da RPI para calibrar o
   horário do trigger.
3. Fechar o item pendente de Desenho Industrial (PDF) antes de
   implementar `RpiDesenho.gs` por completo — o restante do sistema pode
   ir para produção sem isso, com esse módulo soltando o aviso "ainda
   manual" enquanto não for fechado.
