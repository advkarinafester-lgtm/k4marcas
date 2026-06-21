function calcularDataFatal_(dataBase, dias) {
  const data = new Date(dataBase.getTime());
  data.setDate(data.getDate() + Number(dias));
  return data;
}

function criar(despacho, acao, secao) {
  if (!acao.geraPrazo) return;
  const cadastro = despacho._processoCadastro;
  const dataFatal = acao.prazoDias ? calcularDataFatal_(new Date(), acao.prazoDias) : '';

  appendRow_(SHEETS.PAINEL_PRAZOS, {
    'Nº do processo': despacho.processo,
    'Cliente': cadastro['Nome/Cliente'] || cadastro['Cliente'] || '',
    'Marca': cadastro['Marca'] || cadastro['Marca/objeto'] || '',
    'Módulo de origem': secao === 'marcas' ? 'Despacho Marca' : 'Despacho Patente',
    'Despacho/motivo': despacho.despacho || despacho.titulo,
    'Data do despacho': new Date(),
    'Prazo escritório': '',
    'Prazo fatal INPI': dataFatal,
    'Dias restantes': '',
    'Responsável': cadastro['Vendedor'] || '',
    'Status': 'Aberto',
  });
}
