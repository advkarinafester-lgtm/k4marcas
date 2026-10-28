// Site de escolha de produtos para registro de marca (K4 Marcas).
// Publicado como Web App do Apps Script: o cliente marca os produtos e o
// resultado é enviado por e-mail para ele e para o escritório.

const NOME_ESCRITORIO = 'K4 Marcas';
const ABA_SOLICITACOES = 'SOLICITACOES_PRODUTOS';
const MAX_PRODUTOS = 1000;

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(`${NOME_ESCRITORIO} — Produtos para registro de marca`)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(nomeArquivo) {
  return HtmlService.createHtmlOutputFromFile(nomeArquivo).getContent();
}

// Chamado pelo navegador via google.script.run.
function enviarSelecao(dados) {
  if (dados.site) return { ok: true }; // honeypot preenchido: robô, ignora em silêncio

  const pedido = validarPedido_(dados);
  const emailEscritorio = getEmailEscritorio_();
  const protocolo = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'yyyyMMdd-HHmmss');
  const assunto = `Produtos para registro da marca "${pedido.marca}" — ${pedido.nome}`;
  const corpo = montarEmailHtml_(pedido, protocolo);

  MailApp.sendEmail({
    to: pedido.email,
    subject: assunto,
    htmlBody:
      `<p>Olá, ${escapar_(pedido.nome)}!</p>` +
      `<p>Recebemos a sua escolha de produtos/serviços para o registro da marca. ` +
      `Nossa equipe vai analisar e entrar em contato. Confira abaixo o que foi enviado:</p>` +
      corpo,
    name: NOME_ESCRITORIO,
    replyTo: emailEscritorio,
  });

  MailApp.sendEmail({
    to: emailEscritorio,
    subject: `[Site] ${assunto}`,
    htmlBody: `<p>Nova escolha de produtos enviada pelo site.</p>${corpo}`,
    name: `Site ${NOME_ESCRITORIO}`,
    replyTo: pedido.email,
  });

  registrarNaPlanilha_(pedido, protocolo);
  return { ok: true, protocolo };
}

function validarPedido_(d) {
  const texto = v => String(v || '').trim().slice(0, 500);
  const pedido = {
    nome: texto(d.nome),
    documento: texto(d.documento),
    email: texto(d.email).toLowerCase(),
    telefone: texto(d.telefone),
    marca: texto(d.marca),
    outros: String(d.outros || '').trim().slice(0, 5000),
    observacoes: String(d.observacoes || '').trim().slice(0, 5000),
    selecao: {},
  };

  if (!pedido.nome) throw new Error('Informe o seu nome.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pedido.email)) throw new Error('Informe um e-mail válido.');
  if (!pedido.marca) throw new Error('Informe o nome da marca.');

  // Só aceita produtos que existem na lista da classe — evita texto
  // arbitrário entrando como "produto escolhido".
  const listas = carregarListas_();
  let total = 0;
  Object.keys(d.selecao || {}).forEach(classe => {
    const permitidos = new Set(listas[classe] || []);
    const itens = (d.selecao[classe] || []).filter(p => permitidos.has(p));
    if (itens.length) {
      pedido.selecao[classe] = itens;
      total += itens.length;
    }
  });
  if (total > MAX_PRODUTOS) throw new Error('Quantidade de produtos acima do permitido.');
  if (total === 0 && !pedido.outros) {
    throw new Error('Escolha ao menos um produto ou descreva-o no campo "Outros produtos".');
  }
  return pedido;
}

// Lê a mesma lista que o navegador recebe (Produtos.html).
function carregarListas_() {
  const html = include('Produtos');
  const json = html.slice(html.indexOf('{'), html.lastIndexOf('}') + 1);
  return JSON.parse(json);
}

function montarEmailHtml_(p, protocolo) {
  const linha = (rotulo, valor) =>
    valor ? `<tr><td style="padding:4px 12px 4px 0;color:#555"><b>${rotulo}</b></td><td>${escapar_(valor)}</td></tr>` : '';

  const classes = Object.keys(p.selecao).sort((a, b) => a - b);
  const blocos = classes.map(c =>
    `<h3 style="margin:16px 0 4px;color:#8321b7">Classe ${c} — ${p.selecao[c].length} item(ns)</h3>` +
    `<ul style="margin:0;padding-left:20px">${p.selecao[c].map(i => `<li>${escapar_(i)}</li>`).join('')}</ul>`
  ).join('');

  const textoLivre = (titulo, valor) =>
    valor ? `<h3 style="margin:16px 0 4px">${titulo}</h3><p style="white-space:pre-wrap;margin:0">${escapar_(valor)}</p>` : '';

  return (
    `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222;border-top:4px solid #8321b7;padding-top:12px">` +
    `<p style="margin:0 0 12px;font-size:16px;font-weight:bold;color:#3b0ca4">K4 Marcas · <span style="color:#e5176b">Propriedade Intelectual</span></p>` +
    `<table style="border-collapse:collapse">` +
    linha('Protocolo', protocolo) +
    linha('Marca', p.marca) +
    linha('Nome', p.nome) +
    linha('CPF/CNPJ', p.documento) +
    linha('E-mail', p.email) +
    linha('Telefone', p.telefone) +
    `</table>` +
    (blocos || '<p><i>Nenhum produto marcado na lista.</i></p>') +
    textoLivre('Outros produtos/serviços (não listados)', p.outros) +
    textoLivre('Observações', p.observacoes) +
    `</div>`
  );
}

// Opcional: se a propriedade PLANILHA_ID estiver configurada, guarda cada
// envio numa aba da planilha (útil caso algum e-mail se perca).
function registrarNaPlanilha_(p, protocolo) {
  const id = PropertiesService.getScriptProperties().getProperty('PLANILHA_ID');
  if (!id) return;
  const planilha = SpreadsheetApp.openById(id);
  let aba = planilha.getSheetByName(ABA_SOLICITACOES);
  if (!aba) {
    aba = planilha.insertSheet(ABA_SOLICITACOES);
    aba.appendRow(['Data', 'Protocolo', 'Marca', 'Nome', 'CPF/CNPJ', 'E-mail', 'Telefone',
      'Classes', 'Produtos', 'Outros produtos', 'Observações']);
  }
  const classes = Object.keys(p.selecao).sort((a, b) => a - b);
  aba.appendRow([
    new Date(), protocolo, p.marca, p.nome, p.documento, p.email, p.telefone,
    classes.join(', '),
    classes.map(c => `Classe ${c}: ${p.selecao[c].join('; ')}`).join('\n'),
    p.outros, p.observacoes,
  ]);
}

function getEmailEscritorio_() {
  const email = PropertiesService.getScriptProperties().getProperty('EMAIL_ESCRITORIO');
  if (!email) throw new Error('Site não configurado: defina a propriedade EMAIL_ESCRITORIO.');
  return email;
}

function escapar_(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
