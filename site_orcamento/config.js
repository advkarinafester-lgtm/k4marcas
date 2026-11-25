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

  // Valor de CADA parcela (honorários), por plano e por número de classes (tabela progressiva:
  // quanto mais classes, menor o valor por classe). Para oferecer mais classes, basta
  // acrescentar a chave (8, 9…) em todos os planos.
  planos: [
    {
      id: "start",
      nome: "Start",
      resumo: "O essencial para proteger sua marca com segurança.",
      parcela: { 1: 137.0, 2: 229.5, 3: 312.66, 4: 386.0, 5: 451.2, 6: 509.0, 7: 561.0, 8: 607.0, 9: 649.0 },
    },
    {
      id: "intermediario",
      nome: "Intermediário",
      resumo: "Proteção completa com 1 recurso incluso.",
      parcela: { 1: 188.0, 2: 315.0, 3: 429.0, 4: 532.0, 5: 624.0, 6: 706.0, 7: 780.0, 8: 845.0, 9: 905.0 },
      destaque: "Mais escolhido",
    },
    {
      id: "avancado",
      nome: "Avançado",
      resumo: "Blindagem total + identidade visual da marca.",
      parcela: { 1: 252.0, 2: 493.41, 3: 701.75, 4: 868.41, 5: 993.41, 6: 1076.75, 7: 1160.08, 8: 1230.0, 9: 1290.0 },
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

  // Taxa federal do INPI por classe para solicitar o pedido (valor com desconto — MEI, ME e EPP).
  // Paga diretamente ao órgão. Os valores das parcelas acima são SEM desconto de campanha.
  taxaInpiPorClasse: 440.0,

  // Trâmite prioritário (Portaria INPI nº 066/2026) — opcional.
  // Os honorários são incluídos no plano e parcelados no mesmo nº de parcelas.
  // Quem contrata o prioritário paga AS DUAS taxas do INPI: a do pedido (acima) + esta.
  prioritario: {
    honorariosPorClasse: 798.0,
    taxaInpiPorClasse: 445.0,      // taxa INPI do trâmite prioritário (com desconto — MEI, ME e EPP)
    descontoAplica: false,         // true = o % de desconto da proposta também vale para o prioritário
    prazo: "180 a 240 dias após deferimento da prioridade",
    proximasVagas: "Janeiro 2027",
  },

  // Vigilância de marca (plano de monitoramento) — contratação opcional, mensal.
  // Faixa de preço pelo nº de processos (cada classe = 1 processo no INPI).
  vigilancia: {
    planos: [
      {
        id: "essencial",
        nome: "Vigilância Start",
        inclui: [
          "Radar semanal da RPI",
          "Vigilância de novos pedidos publicados (oposição)",
          "Vigilância de marcas concedidas (PAN)",
          "50% de desconto em manutenção, recursos ou exigências",
        ],
        faixas: [ { ate: 2, valor: 89 }, { ate: 5, valor: 119 }, { ate: 10, valor: 168 }, { ate: 20, valor: 237 } ],
      },
      {
        id: "completa",
        nome: "Vigilância Completa",
        inclui: [
          "Área do cliente",
          "Radar semanal da RPI",
          "Vigilância de novos pedidos publicados (oposição)",
          "Vigilância de marcas concedidas (PAN)",
          "Petições de manifestação, recursos ou exigências inclusas",
          "50% de desconto em peças processuais",
          "30% de desconto em ação judicial de nulidade",
        ],
        faixas: [ { ate: 2, valor: 229 }, { ate: 5, valor: 278 }, { ate: 10, valor: 330 }, { ate: 20, valor: 450 } ],
        destaque: "Mais completa",
      },
    ],
    condicoes: [
      "12 meses a partir do protocolo",
      "Pagamento por boleto",
      "Renovação automática",
      "Cancelamento: 40% sobre o saldo remanescente",
    ],
  },

  // Serviços avulsos (honorários; taxas do INPI à parte quando indicado).
  avulsosValidade: "Válido até dezembro/2026",
  avulsos: [
    { nome: "Recurso contra indeferimento", inclui: "Análise do despacho, tese jurídica e protocolo no INPI", valor: 1500, obs: "Não inclui taxa do INPI" },
    { nome: "Manifestação em exigência", inclui: "Resposta a exigência formal ou técnica do INPI", valor: 890, obs: "Conforme complexidade" },
    { nome: "Defesa em oposição", inclui: "Elaboração de defesa contra oposição de terceiro", valor: 890, obs: "Por processo" },
    { nome: "Apresentação de oposição", inclui: "Protocolo de oposição contra marca de terceiro", valor: 1350, obs: "Não inclui taxa" },
    { nome: "Pedido de nulidade administrativa", inclui: "Análise, elaboração e protocolo de nulidade no INPI", valor: 2200, obs: "Alta complexidade" },
    { nome: "Defesa em nulidade", inclui: "Defesa contra pedido de nulidade", valor: 2200, obs: "Pode variar conforme volume" },
    { nome: "Pedido de caducidade", inclui: "Protocolo de caducidade por falta de uso", valor: 1750, obs: "Não inclui taxa" },
    { nome: "Defesa em caducidade", inclui: "Defesa contra pedido de caducidade", valor: 1750, obs: "Inclui análise de provas" },
    { nome: "Transferência de titularidade", inclui: "Elaboração de procuração no INPI", valor: 340, obs: "+ taxa" },
  ],

  // Classificação de Nice (NCL) — descrição resumida de cada classe.
  ncl: [
    "Produtos químicos", "Tintas e vernizes", "Cosméticos e produtos de limpeza", "Óleos e combustíveis",
    "Produtos farmacêuticos", "Metais comuns", "Máquinas e motores", "Ferramentas manuais",
    "Eletrônicos e software", "Aparelhos médicos", "Iluminação, aquecimento e refrigeração", "Veículos e peças",
    "Armas e explosivos", "Joias e relógios", "Instrumentos musicais", "Papelaria e impressos",
    "Borracha e plásticos", "Couro e bolsas", "Construção não metálica", "Móveis e colchões",
    "Utensílios domésticos", "Cordas, redes e barracas", "Fios e linhas", "Tecidos e roupa de cama",
    "Vestuário e calçados", "Aviamentos e armarinho", "Tapetes e revestimentos", "Jogos e brinquedos",
    "Carnes e laticínios", "Café, doces e farinhas", "Produtos agrícolas e animais", "Cervejas e bebidas não alcoólicas",
    "Bebidas alcoólicas", "Tabaco e artigos para fumantes",
    "Comércio e publicidade", "Finanças e seguros", "Construção e reparos", "Telecomunicações",
    "Transporte e logística", "Tratamento de materiais", "Educação e entretenimento", "TI e tecnologia",
    "Alimentação e hospedagem", "Saúde e beleza", "Jurídico e segurança",
  ],

  // Campanha vigente (vale para todas as propostas: e-commerce e outros nichos).
  // - 1 classe: preço fechado da campanha (precoFixo1Classe);
  // - 2 ou mais classes: "desconto" % sobre a tabela progressiva.
  // Para encerrar a campanha, mude "ativa" para false.
  campanha: {
    ativa: true,
    nome: "Black Friday",
    desconto: 20,
    precoFixo1Classe: { start: 99.9, intermediario: 150.4, avancado: 189.9 },
    chamada: "Fechando em novembro/2026",
  },
};

/*
 * Valor de cada parcela de honorários do plano.
 *   planoId: "start" | "intermediario" | "avancado"
 *   n: nº de classes
 *   opt.bf: true = campanha (ex.: Black Friday); opt.d = desconto % manual (quando sem campanha)
 */
window.K4_PARCELA = function (planoId, n, opt) {
  var CFG = window.K4_CONFIG;
  var plano = CFG.planos.filter(function (p) { return p.id === planoId; })[0];
  var cheia = plano.parcela[n];
  opt = opt || {};
  var camp = CFG.campanha;
  if (opt.bf && camp) {
    if (n === 1 && camp.precoFixo1Classe && camp.precoFixo1Classe[planoId]) return camp.precoFixo1Classe[planoId];
    return cheia * (1 - camp.desconto / 100);
  }
  return cheia * (1 - (opt.d || 0) / 100);
};
