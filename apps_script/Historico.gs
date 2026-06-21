// Idempotência: identifica um despacho pela combinação edição + processo +
// despacho/código, para não duplicar histórico se o trigger rodar mais de
// uma vez na mesma semana.
function jaRegistrado_(sheetName, edicao, processo, identificadorCampo, identificador) {
  const rows = readRows_(sheetName);
  return rows.some(r =>
    Number(r['Nº RPI']) === edicao &&
    String(r['Nº do processo']).trim() === String(processo).trim() &&
    String(r[identificadorCampo]).trim() === String(identificador).trim()
  );
}

function gravar(secao, despacho) {
  if (secao === 'marcas') return gravarMarcas_(despacho);
  if (secao === 'patentes') return gravarPatentes_(despacho);
  throw new Error('Seção sem rotina de gravação de histórico: ' + secao);
}

function gravarMarcas_(d) {
  if (jaRegistrado_(SHEETS.DESPACHOS_MARCAS, d.edicao, d.processo, 'Despacho', d.despacho)) return false;
  appendRow_(SHEETS.DESPACHOS_MARCAS, {
    'Nº RPI': d.edicao,
    'Data da RPI': new Date(),
    'Nº do processo': d.processo,
    'Despacho': d.despacho,
    'Texto complementar': d.textoComplementar,
    'Nome': d._processoCadastro['Nome/Cliente'] || '',
    'E-mail': d._processoCadastro['E-mail'] || '',
    'Cliente comunicado': 'Não',
    'Data da leitura (automática)': new Date(),
  });
  return true;
}

function gravarPatentes_(d) {
  if (jaRegistrado_(SHEETS.DESPACHOS_PATENTES, d.edicao, d.processo, 'Código', d.codigo)) return false;
  appendRow_(SHEETS.DESPACHOS_PATENTES, {
    'Nº RPI': d.edicao,
    'Data da RPI': new Date(),
    'Nº do processo': d.processo,
    'Código': d.codigo,
    'Título do despacho': d.titulo,
    'Comentário (texto)': d.comentario,
    'Prazo extraído (dias)': d.prazoDias || '',
    'Data fatal calculada': d.prazoDias ? calcularDataFatal_(new Date(), d.prazoDias) : '',
    'Cliente comunicado': 'Não',
    'Data da leitura (automática)': new Date(),
  });
  return true;
}
