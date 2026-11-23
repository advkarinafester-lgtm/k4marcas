/*
 * K4 Marcas — configuração central do site de orçamento.
 * Altere aqui preços, taxas e contatos. As duas páginas (index.html e
 * gerador.html) leem tudo deste arquivo.
 */
window.K4_CONFIG = {
  contato: {
    whatsapp: "5511910877780",          // só dígitos, com DDI 55
    telefone: "(11) 91087-7780",
    email: "contato@k4brands.com.br",
    instagram: "k4marcas",
    site: "k4marcas.com.br",
    endereco: "Rua Giovanni Battista Pirelli, 271 - Vila Homero Thon, Santo André - SP, 09111-340",
  },

  parcelas: 12,

  // Valor de CADA parcela (honorários), por plano e por número de classes.
  planos: [
    {
      id: "start",
      nome: "Start",
      resumo: "O essencial para proteger sua marca com segurança.",
      parcela: { 1: 137.0, 2: 229.5, 3: 312.66 },
    },
    {
      id: "intermediario",
      nome: "Intermediário",
      resumo: "Proteção completa com 1 recurso incluso.",
      parcela: { 1: 188.0, 2: 315.0, 3: 429.0 },
      destaque: "Mais escolhido",
    },
    {
      id: "avancado",
      nome: "Avançado",
      resumo: "Blindagem total + identidade visual da marca.",
      parcela: { 1: 252.0, 2: 493.41, 3: 701.75 },
    },
  ],

  // Linhas da tabela comparativa. Valor por plano: true = Sim, false = Não, ou texto.
  itens: [
    { nome: "Consultivo de Viabilidade Completo", start: true, intermediario: true, avancado: true },
    { nome: "Elaboração de documentos + Cadastros", start: true, intermediario: true, avancado: true },
    { nome: "Protocolo INPI", start: true, intermediario: true, avancado: true },
    { nome: "Acompanhamento + Relatórios Técnicos", start: true, intermediario: true, avancado: true },
    { nome: "Emissão e envio do certificado válido por 10 anos", start: true, intermediario: true, avancado: true },
    { nome: "Recurso contra indeferimento ou novo protocolo", start: false, intermediario: "Apenas 1", avancado: "Recurso + Novo Protocolo" },
    { nome: "Logotipo + Guia da Marca", start: false, intermediario: false, avancado: true },
  ],

  // Taxa federal do INPI por classe (paga diretamente ao órgão — ME, EPP e MEI).
  taxaInpiPorClasse: 440.0,

  // Trâmite prioritário (Portaria INPI nº 066/2026) — opcional.
  prioritario: {
    honorariosPorClasse: 798.0,
    taxaInpiPorClasse: 445.0,
    prazo: "180 a 240 dias após deferimento da prioridade",
    proximasVagas: "Janeiro 2027",
  },
};
