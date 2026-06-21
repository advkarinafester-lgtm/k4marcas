# Apps Script — automação semanal da RPI (K4 Marcas)

Implementação real dos arquivos descritos na seção 12 do
`PLANO_ACOMPANHAMENTO_CLIENTES.md`. Cobre as seções **Marcas** e
**Patentes** da RPI por completo; **Desenho Industrial** entra como stub
controlado (ver `RpiDesenho.gs`).

## Como implantar

1. Abra a planilha `PLANILHA_CONSOLIDADA_K4.xlsx` já importada no Google
   Sheets (Extensões → Apps Script).
2. Crie um arquivo `.gs` para cada arquivo desta pasta (mesmo nome) e
   cole o conteúdo. Ordem não importa — Apps Script resolve tudo no
   mesmo escopo global.
3. Configure o e-mail de aviso da equipe: menu **Project Settings → Script
   Properties**, adicione a propriedade `EMAIL_EQUIPE` com o e-mail (ou
   lista de e-mails separados por vírgula) que deve receber os avisos.
4. Recarregue a planilha — vai aparecer o menu **RPI K4** no topo.
5. Use **RPI K4 → Rodar rotina semanal agora** para testar manualmente
   antes de confiar no gatilho automático.
6. Use **RPI K4 → Criar/reinstalar gatilho semanal** para agendar a
   execução automática toda terça-feira.

## O que falta confirmar antes de produção

1. **Schema real do XML de Marcas** (`RpiMarcas.gs`): os nomes de tag
   foram inferidos por analogia ao XML de Patentes (que foi validado com
   um arquivo real). Rode manualmente uma vez e confira no log se os
   campos `processo`/`despacho`/`textoComplementar` saem preenchidos; se
   não, ajuste as constantes `RM_TAG` no topo do arquivo.
2. **Horário de publicação da RPI**: o gatilho está provisoriamente em
   14h de terça-feira (`Menu.gs`); ajustar `atHour(...)` quando o horário
   real for confirmado.
3. **CONFIG_DESPACHO_PATENTE**: a coluna "Gera prazo" tem vários códigos
   marcados como "Verificar texto" — a extração dinâmica de prazo
   (`PRAZO_REGEX` em `RpiPatentes.gs`) só dispara quando o regex encontra
   o padrão no texto do despacho; os demais códigos atualizam fase mas
   não geram prazo automaticamente até essa validação.
4. **Desenho Industrial**: `RpiDesenho.gs` lança erro propositalmente —
   isso é tratado como "edição não disponível" pelo orquestrador, então
   não bloqueia Marcas/Patentes. Implementar de fato quando tivermos um
   PDF de exemplo (item 15 do plano).

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `Constants.gs` | Nomes de abas e mapas seção→aba/label |
| `SheetDb.gs` | Leitura/escrita genérica de linhas por nome de aba |
| `XmlUtils.gs` | Helpers de busca recursiva em XML (`XmlService`) |
| `Config.gs` | Leitura/escrita de `CONFIG_RPI` e das tabelas `CONFIG_DESPACHO_*` |
| `RpiMarcas.gs` | Download + parsing do XML de Marcas |
| `RpiPatentes.gs` | Download + parsing do XML de Patentes + extração de prazo |
| `RpiDesenho.gs` | Stub controlado (pendente) |
| `Matching.gs` | Cruza número de processo com a base de clientes |
| `Historico.gs` | Grava despacho no histórico com checagem de idempotência |
| `FaseEAcao.gs` | Aplica as tabelas `CONFIG_DESPACHO_*` e atualiza a fase do processo |
| `Prazos.gs` | Calcula data fatal e grava em `PAINEL_PRAZOS` |
| `Notificacoes.gs` | E-mails de aviso de falha e resumo semanal |
| `Main.gs` | `rotinaSemanalRPI()` — orquestra tudo |
| `Menu.gs` | Menu manual na planilha + criação do gatilho semanal |
