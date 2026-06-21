function lerUltimasEdicoes() {
  const rows = readRows_(SHEETS.CONFIG_RPI);
  const result = { marcas: 0, patentes: 0, desenho: 0 };
  rows.forEach(r => {
    const secao = String(r['Seção']).trim();
    const edicao = Number(r['Última edição processada']) || 0;
    if (secao === 'Marcas') result.marcas = edicao;
    if (secao === 'Patentes') result.patentes = edicao;
    if (secao === 'Desenho Industrial') result.desenho = edicao;
  });
  return result;
}

function atualizarUltimaEdicao(secaoLabel, edicao, status) {
  const rows = readRows_(SHEETS.CONFIG_RPI);
  const row = rows.find(r => String(r['Seção']).trim() === secaoLabel);
  if (!row) throw new Error('Seção não cadastrada em CONFIG_RPI: ' + secaoLabel);
  updateCell_(SHEETS.CONFIG_RPI, row.__rowIndex, 'Última edição processada', edicao);
  updateCell_(SHEETS.CONFIG_RPI, row.__rowIndex, 'Data da última execução', new Date());
  updateCell_(SHEETS.CONFIG_RPI, row.__rowIndex, 'Status (ok/falha)', status);
}

function lerConfigDespachoMarca() {
  return readRows_(SHEETS.CONFIG_DESPACHO_MARCA);
}

function lerConfigDespachoPatente() {
  return readRows_(SHEETS.CONFIG_DESPACHO_PATENTE);
}

function getEmailEquipe_() {
  return PropertiesService.getScriptProperties().getProperty('EMAIL_EQUIPE') || '';
}
