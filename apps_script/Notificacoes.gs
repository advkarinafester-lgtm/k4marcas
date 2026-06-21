function avisarFalhaDownload(secao, edicao, erro) {
  const destinatario = getEmailEquipe_();
  if (!destinatario) return;
  MailApp.sendEmail(
    destinatario,
    `RPI ${SECAO_LABEL[secao]}: edição ${edicao} não processada`,
    `Falha ao processar a edição ${edicao} da seção ${SECAO_LABEL[secao]}.\n\n` +
      `Erro: ${erro.message}\n\n` +
      `O sistema tenta novamente na próxima execução do gatilho semanal.`
  );
}

function enviarResumoSemanal(resumo) {
  const destinatario = getEmailEquipe_();
  if (!destinatario || resumo.length === 0) return;

  const linhas = resumo.map(r =>
    `- ${r.secao}: edição ${r.edicao} — ${r.despachosEncontrados} despacho(s) de clientes, ${r.prazosGerados} prazo(s) criado(s).`
  );

  MailApp.sendEmail(
    destinatario,
    'Resumo semanal RPI — K4 Marcas',
    `Processamento da RPI desta semana:\n\n${linhas.join('\n')}\n\n` +
      `Confira a aba PAINEL_PRAZOS para os prazos em aberto.`
  );
}
