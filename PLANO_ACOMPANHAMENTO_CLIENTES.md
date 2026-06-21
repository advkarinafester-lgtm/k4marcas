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

### 4.6 Desenho Industrial / Patente

Confirmado nas planilhas reais: é **uma única aba** ("DESENHO IND
PATENTE"), não duas separadas. Segue o mesmo padrão de "K4 MARCAS":

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
| Protocolo (ex.: número BR no formato do INPI para desenho industrial) |
| E-mail |
| Data do protocolo |
| Fase 1 / Fase 3 / Fase 4 (não há "Fase 2" nesta aba — desenho industrial não tem fase de oposição) |

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
2. **Download automático**: `UrlFetchApp` busca o XML da edição da
   semana diretamente no site do INPI.
3. **Parsing**: `XmlService` (nativo do Apps Script) lê o XML e extrai,
   por processo: número do RPI, número do processo, código/descrição do
   despacho, texto complementar.
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
| Notificação de recurso | Depende do contexto (recurso de terceiro?) | **A confirmar com você** — pode abrir prazo de contrarrazões |
| Petição de trâmite prioritário apta / atendida | Mantém fase atual | Não — só informativo |

Esta tabela **não é exaustiva**: o INPI tem um catálogo mais amplo de
despachos do que os 9 observados no arquivo de exemplo (uma única edição
da RPI). Recomendo tratá-la como uma aba de configuração editável na
planilha (não fixa no código), para a equipe completar conforme novos
despachos forem aparecendo nas próximas edições, sem precisar de mim para
alterar o script toda vez.

### 9.3 Ponto em aberto antes de implementar

Preciso que você (ou alguém da equipe) me confirme o **link/padrão de URL**
de onde a RPI em XML é baixada hoje no site do INPI — não vou adivinhar
essa URL, ela deve vir de uma página real que vocês acessam ou de um link
que vocês me enviem, pois a estrutura de publicação pode variar e eu não
tenho como validar isso sem ver o site ao vivo. Com esse link de exemplo,
eu confirmo o padrão (se o número da edição entra na URL, se há
zero-padding, etc.) e já desenho o trecho de `UrlFetchApp` certo.

## 10. Próximos passos

1. ~~Mapear os campos reais de Desenho Industrial, Patente e Monitoramento~~
   — concluído com a análise dos dois arquivos enviados (seções 4.6, 4.7 e
   6).
2. ~~Decidir quais lacunas entram na v1~~ — concluído, ver seção 8.
3. ~~Decidir a arquitetura~~ — concluído: Opção A (Sheets/Apps Script).
4. Você me enviar um link de exemplo de download da RPI em XML, para eu
   confirmar o padrão de URL usado pelo script de importação (seção 9.3).
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
