// Pendente — item 15 do plano. Falta o PDF de exemplo
// (Desenhos_Industriais<edição>.pdf) para desenhar a extração via OCR
// (Drive converte PDF em Google Doc) e o fluxo de revisão humana
// (DESPACHOS_PENDENTES_CONFIRMACAO). Até lá, esta função sinaliza falha
// de forma controlada — processarSecao_ trata isso como "edição não
// disponível" e não trava o processamento de Marcas/Patentes.
function baixarEParsearDesenho(edicao) {
  throw new Error(
    `RpiDesenho ainda não implementado — pendente do PDF de exemplo (item 15 do plano). Edição ${edicao} não processada.`
  );
}
