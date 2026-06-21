function aplicar(secao, despacho) {
  if (secao === 'marcas') return aplicarMarcas_(despacho);
  if (secao === 'patentes') return aplicarPatentes_(despacho);
  throw new Error('Seção sem regra de fase/ação: ' + secao);
}

function aplicarMarcas_(despacho) {
  const config = lerConfigDespachoMarca();
  const regra = config.find(r =>
    String(r['Despacho']).trim().toLowerCase() === String(despacho.despacho).trim().toLowerCase()
  );
  const fase = regra ? regra['Fase resultante'] : 'Não mapeado — revisar CONFIG_DESPACHO_MARCA';
  const geraPrazo = regra ? String(regra['Gera prazo de ação?']).trim().toLowerCase().startsWith('sim') : false;
  const submodulo = regra ? regra['Submódulo a abrir'] : '—';

  updateCell_(SHEETS.PROCESSOS_MARCA, despacho._processoCadastro.__rowIndex, 'Fase atual', fase);
  return { fase, geraPrazo, submodulo, prazoDias: null };
}

function aplicarPatentes_(despacho) {
  const config = lerConfigDespachoPatente();
  const regra = config.find(r => String(r['Código']).trim() === String(despacho.codigo).trim());
  const fase = regra ? regra['Fase resultante'] : 'Não mapeado — revisar CONFIG_DESPACHO_PATENTE';
  const submodulo = regra ? regra['Submódulo a abrir/atualizar'] : '—';
  const geraPrazo = despacho.prazoDias !== null;

  updateCell_(SHEETS.PROCESSOS_PATENTE, despacho._processoCadastro.__rowIndex, 'Fase atual', fase);
  return { fase, geraPrazo, submodulo, prazoDias: despacho.prazoDias };
}
