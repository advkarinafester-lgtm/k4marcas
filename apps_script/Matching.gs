function filtrarPorProcessosConhecidos(secao, despachos) {
  const sheetName = SHEET_PROCESSOS_POR_SECAO[secao];
  const processos = readRows_(sheetName);
  const porNumero = {};
  processos.forEach(p => { porNumero[String(p['Nº do processo']).trim()] = p; });

  return despachos
    .map(d => {
      const cadastro = porNumero[String(d.processo).trim()];
      return cadastro ? Object.assign({}, d, { _processoCadastro: cadastro }) : null;
    })
    .filter(Boolean);
}
