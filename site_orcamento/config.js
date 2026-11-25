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
  // nome curto + resumo do que a classe protege (exibido ao cliente para as classes escolhidas).
  ncl: [
    { nome: "Produtos químicos", resumo: "Produtos químicos para indústria, ciência, fotografia e agricultura; adubos, resinas artificiais em bruto, adesivos para uso industrial." },
    { nome: "Tintas e vernizes", resumo: "Tintas, vernizes e lacas; protetores contra ferrugem e deterioração da madeira; corantes; tintas para impressão." },
    { nome: "Cosméticos e produtos de limpeza", resumo: "Cosméticos e produtos de higiene não medicinais; perfumaria e óleos essenciais; dentifrícios; produtos de limpeza, polimento e branqueamento." },
    { nome: "Óleos e combustíveis", resumo: "Óleos e graxas industriais, ceras; lubrificantes; combustíveis; velas e pavios para iluminação." },
    { nome: "Produtos farmacêuticos", resumo: "Produtos farmacêuticos e veterinários; suplementos alimentares; produtos de higiene para uso médico; fraldas; desinfetantes." },
    { nome: "Metais comuns", resumo: "Metais comuns e suas ligas; materiais de construção metálicos; ferragens e pequenos artigos metálicos; recipientes metálicos; cofres." },
    { nome: "Máquinas e motores", resumo: "Máquinas, máquinas-ferramenta e ferramentas elétricas; motores (exceto para veículos terrestres); equipamentos agrícolas e industriais." },
    { nome: "Ferramentas manuais", resumo: "Ferramentas e utensílios manuais; cutelaria; talheres; aparelhos de barbear e de depilação manuais." },
    { nome: "Eletrônicos e software", resumo: "Aparelhos eletrônicos, de áudio e imagem; computadores, celulares e acessórios; software e aplicativos; óculos; equipamentos de proteção." },
    { nome: "Aparelhos médicos", resumo: "Aparelhos e instrumentos médicos, cirúrgicos, odontológicos e veterinários; artigos ortopédicos; dispositivos para pessoas com deficiência." },
    { nome: "Iluminação, aquecimento e refrigeração", resumo: "Aparelhos de iluminação, aquecimento, refrigeração, cozimento, ventilação e secagem; instalações sanitárias e de abastecimento de água." },
    { nome: "Veículos e peças", resumo: "Veículos e aparelhos de locomoção por terra, ar ou água; peças e acessórios para veículos." },
    { nome: "Armas e explosivos", resumo: "Armas de fogo; munições e projéteis; explosivos; fogos de artifício." },
    { nome: "Joias e relógios", resumo: "Metais e pedras preciosas; joias e bijuterias; relógios e instrumentos cronométricos." },
    { nome: "Instrumentos musicais", resumo: "Instrumentos musicais; estantes e suportes para instrumentos." },
    { nome: "Papelaria e impressos", resumo: "Papel e papelão; impressos, livros e revistas; papelaria e material de escritório; material didático e de desenho; embalagens de papel ou plástico." },
    { nome: "Borracha e plásticos", resumo: "Borracha e plásticos semiacabados; materiais para vedação, calafetação e isolamento; tubos flexíveis não metálicos." },
    { nome: "Couro e bolsas", resumo: "Couro e imitações de couro; bolsas, malas, mochilas e carteiras; guarda-chuvas; artigos de selaria; coleiras e roupas para animais." },
    { nome: "Construção não metálica", resumo: "Materiais de construção não metálicos (pisos, revestimentos, madeira, cimento, vidro para construção); tubos rígidos não metálicos." },
    { nome: "Móveis e colchões", resumo: "Móveis, espelhos e molduras; colchões e travesseiros; recipientes não metálicos para armazenagem; artigos de madeira, bambu e plástico." },
    { nome: "Utensílios domésticos", resumo: "Utensílios e recipientes para casa e cozinha; panelas, louças e copos; escovas e artigos de limpeza; vidro, porcelana e cerâmica." },
    { nome: "Cordas, redes e barracas", resumo: "Cordas, barbantes e redes; barracas, toldos e lonas; sacos para transporte e armazenagem; materiais de enchimento." },
    { nome: "Fios e linhas", resumo: "Fios e linhas para uso têxtil." },
    { nome: "Tecidos e roupa de cama", resumo: "Tecidos; roupa de cama, mesa e banho; cortinas." },
    { nome: "Vestuário e calçados", resumo: "Roupas, calçados e chapéus." },
    { nome: "Aviamentos e armarinho", resumo: "Rendas, fitas e bordados; botões, zíperes, alfinetes e agulhas; flores artificiais; acessórios e postiços para cabelo." },
    { nome: "Tapetes e revestimentos", resumo: "Tapetes, capachos e esteiras; revestimentos de pisos; papéis de parede não têxteis." },
    { nome: "Jogos e brinquedos", resumo: "Jogos, brinquedos e videogames; artigos de ginástica e esporte; enfeites para árvores de Natal." },
    { nome: "Carnes e laticínios", resumo: "Carnes, peixes e aves; frutas e legumes em conserva ou processados; ovos, leite e laticínios; óleos e gorduras comestíveis." },
    { nome: "Café, doces e farinhas", resumo: "Café, chá e cacau; arroz, massas e farinhas; pães, bolos, doces e chocolates; sorvetes; açúcar e mel; temperos e molhos." },
    { nome: "Produtos agrícolas e animais", resumo: "Produtos agrícolas, hortícolas e florestais in natura; frutas e legumes frescos; sementes, plantas e flores naturais; animais vivos; ração." },
    { nome: "Cervejas e bebidas não alcoólicas", resumo: "Cervejas; águas minerais; refrigerantes, sucos e outras bebidas não alcoólicas; xaropes para bebidas." },
    { nome: "Bebidas alcoólicas", resumo: "Bebidas alcoólicas (exceto cervejas): vinhos, destilados e licores." },
    { nome: "Tabaco e artigos para fumantes", resumo: "Tabaco; cigarros e charutos; cigarros eletrônicos; artigos para fumantes; fósforos." },
    { nome: "Comércio e publicidade", resumo: "Publicidade e marketing; gestão e administração de negócios; comércio varejista e atacadista, inclusive lojas virtuais e marketplaces." },
    { nome: "Finanças e seguros", resumo: "Serviços financeiros, bancários e de pagamento; seguros; negócios imobiliários." },
    { nome: "Construção e reparos", resumo: "Construção civil; instalação, manutenção e reparação; limpeza de edifícios." },
    { nome: "Telecomunicações", resumo: "Telecomunicações; transmissão de dados, som e imagem; streaming; fornecimento de acesso a redes e plataformas." },
    { nome: "Transporte e logística", resumo: "Transporte; entrega, embalagem e armazenagem de mercadorias; organização de viagens." },
    { nome: "Tratamento de materiais", resumo: "Tratamento e transformação de materiais; fabricação sob encomenda para terceiros; impressão; reciclagem." },
    { nome: "Educação e entretenimento", resumo: "Educação, cursos e treinamentos; entretenimento; atividades esportivas e culturais; organização de eventos; publicação de conteúdo." },
    { nome: "TI e tecnologia", resumo: "Serviços científicos e tecnológicos; desenvolvimento de software e SaaS; design; hospedagem de sites; consultoria em TI." },
    { nome: "Alimentação e hospedagem", resumo: "Restaurantes, bares, cafeterias, buffets e delivery de refeições; hotéis, pousadas e hospedagem temporária." },
    { nome: "Saúde e beleza", resumo: "Serviços médicos, odontológicos e veterinários; clínicas de estética, salões de beleza e spas; serviços de agricultura e jardinagem." },
    { nome: "Jurídico e segurança", resumo: "Serviços jurídicos; segurança de pessoas e bens; licenciamento de propriedade intelectual; serviços pessoais e sociais." },
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
