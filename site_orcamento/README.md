# Site de Orçamento — K4 Marcas

Site estático (HTML/CSS/JS, sem build) baseado na apresentação "Proposta Comercial".

## Páginas
- `gerador.html` — **uso interno**. Preencha cliente, marca, classes, plano recomendado,
  desconto, validade e consultor(a). Gera o link personalizado (1 a 9 classes, com tabela progressiva) e a mensagem pronta para
  enviar pelo WhatsApp.
- `index.html` — **página que o cliente recebe**. Mostra toda a apresentação (sobre, cases,
  processo INPI, vantagens, resultados, Mercado Livre, investimento, documentos, serviços)
  com simulador de plano × classes, trâmite prioritário opcional, resumo de valores,
  botão "Aceitar proposta pelo WhatsApp" e "Salvar em PDF".

## Dois formatos de proposta
No gerador, escolha no topo:
- **E-commerce (forma 1):** apresentação completa, com 7 vantagens, Mercado Livre
  (gráfico e três camadas) e trâmite prioritário opcional.
- **Outros nichos (forma 2):** mesma proposta sem as seções de marketplace e sem o
  trâmite prioritário.

As seções exclusivas de e-commerce estão marcadas com `data-tipo="ecom"` no `index.html`.

## Seções em todas as propostas
- Classes de Nice: a equipe marca as classes no gerador e o cliente vê somente essas,
  com o resumo de cada uma (sem classes marcadas, a seção não aparece). Tabela progressiva até 9 classes, plano de monitoramento
  (Vigilância Start e Completa, mensalidade por faixa de processos) e serviços avulsos.
- Textos e valores ficam em `config.js` (`ncl`, `vigilancia`, `avulsos`).

## Campanha (Black Friday)
Configurada em `config.js` → `campanha`. Vale para os dois formatos:
- 1 classe: preço fechado (Start 12x 99,90 · Intermediário 12x 150,40 · Avançado 12x 189,90);
- 2 a 7 classes: 20% sobre a tabela progressiva.
Para encerrar a campanha, mude `ativa` para `false`.

## Onde alterar preços e contatos
Tudo em `config.js` (parcelas por plano/classe, itens da tabela, taxa INPI, trâmite
prioritário, WhatsApp, e-mail etc.).

## Publicar (GitHub Pages)
1. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
2. Branch: `claude/funny-babbage-lqpjjk` · pasta `/ (root)` → **Save**.
3. Em 1–2 minutos o site fica em:
   - Gerador (interno): https://advkarinafester-lgtm.github.io/k4marcas/site_orcamento/gerador.html
   - Proposta (cliente): https://advkarinafester-lgtm.github.io/k4marcas/site_orcamento/

Outras opções: Qualquer hospedagem estática serve (GitHub Pages, Netlify, Vercel, Hostinger…): basta
subir a pasta `site_orcamento/` inteira. Para testar localmente:

    cd site_orcamento && python3 -m http.server 8000
    # abra http://localhost:8000/gerador.html

## Observações
- Os dados da proposta vão codificados no link (`?p=...`). Isso não é criptografia:
  o valor final sempre deve ser confirmado pela equipe no fechamento.
- A página tem `noindex` para não aparecer no Google.
- Os valores da tabela de planos são **sem desconto**. O gerador já vem com 20% (campanha);
  o desconto vale para os honorários do plano, não para as taxas do INPI.
- Trâmite prioritário: honorários de R$ 798/classe **incluídos no plano e parcelados em 12x**.
  Ao contratá-lo, o cliente paga as duas taxas do INPI: R$ 440/classe (pedido) +
  R$ 445/classe (trâmite prioritário). Por padrão o desconto não se aplica ao prioritário
  (`descontoAplica` em `config.js`).
