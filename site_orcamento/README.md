# Site de Orçamento — K4 Marcas

Site estático (HTML/CSS/JS, sem build) baseado na apresentação "Proposta Comercial".

## Páginas
- `gerador.html` — **uso interno**. Preencha cliente, marca, classes, plano recomendado,
  desconto, validade e consultor(a). Gera o link personalizado e a mensagem pronta para
  enviar pelo WhatsApp.
- `index.html` — **página que o cliente recebe**. Mostra toda a apresentação (sobre, cases,
  processo INPI, vantagens, resultados, Mercado Livre, investimento, documentos, serviços)
  com simulador de plano × classes, trâmite prioritário opcional, resumo de valores,
  botão "Aceitar proposta pelo WhatsApp" e "Salvar em PDF".

## Onde alterar preços e contatos
Tudo em `config.js` (parcelas por plano/classe, itens da tabela, taxa INPI, trâmite
prioritário, WhatsApp, e-mail etc.).

## Publicar
Qualquer hospedagem estática serve (GitHub Pages, Netlify, Vercel, Hostinger…): basta
subir a pasta `site_orcamento/` inteira. Para testar localmente:

    cd site_orcamento && python3 -m http.server 8000
    # abra http://localhost:8000/gerador.html

## Observações
- Os dados da proposta vão codificados no link (`?p=...`). Isso não é criptografia:
  o valor final sempre deve ser confirmado pela equipe no fechamento.
- A página tem `noindex` para não aparecer no Google.
- O desconto (%) é aplicado sobre os honorários do plano; taxas do INPI não têm desconto.
