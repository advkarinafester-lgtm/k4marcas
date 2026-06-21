function rotinaSemanalRPI() {
  const ultimas = lerUltimasEdicoes();

  const resumo = [
    processarSecao_('marcas', ultimas.marcas + 1, baixarEParsearMarcas),
    processarSecao_('patentes', ultimas.patentes + 1, baixarEParsearPatentes),
    processarSecao_('desenho', ultimas.desenho + 1, baixarEParsearDesenho),
  ].filter(Boolean);

  enviarResumoSemanal(resumo);
}

function processarSecao_(secao, edicao, funcaoDeParsing) {
  let despachos;
  try {
    despachos = funcaoDeParsing(edicao);
  } catch (e) {
    avisarFalhaDownload(secao, edicao, e);
    return null; // não trava as outras seções; tenta de novo na próxima execução
  }

  const doEscritorio = filtrarPorProcessosConhecidos(secao, despachos);
  let prazosGerados = 0;

  doEscritorio.forEach(d => {
    const novo = gravar(secao, d);
    if (!novo) return; // já registrado nesta edição — idempotência
    const acao = aplicar(secao, d);
    if (acao.geraPrazo) {
      criar(d, acao, secao);
      prazosGerados++;
    }
  });

  atualizarUltimaEdicao(SECAO_LABEL[secao], edicao, 'OK');
  return { secao: SECAO_LABEL[secao], edicao, despachosEncontrados: doEscritorio.length, prazosGerados };
}
