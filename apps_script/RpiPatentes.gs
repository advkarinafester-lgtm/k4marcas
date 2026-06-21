// Schema validado com arquivo real (P2893.zip → Patente_2893_16062026.xml):
// <despacho><codigo>...</codigo><titulo>...</titulo>
//   <processo-patente><numero>...</numero></processo-patente>
//   <comentario>...</comentario></despacho>
//
// Regex de prazo validada contra os 86 códigos da edição 2893: encontrou
// padrão consistente em 6 códigos (2.5, 28.21, 100.1, 121, 15.22, 1.5
// parcial) — ver CONFIG_DESPACHO_PATENTE para a lista completa e quais
// códigos ainda precisam de confirmação manual.
const PRAZO_REGEX = /prazo.{0,40}?(\d+)\s*\(?\s*\w*\)?\s*dias/i;

function baixarEParsearPatentes(edicao) {
  const url = `https://revistas.inpi.gov.br/txt/P${edicao}.zip`;
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) {
    throw new Error(`RPI Patentes edição ${edicao} indisponível (HTTP ${response.getResponseCode()})`);
  }

  const files = Utilities.unzip(response.getBlob());
  const xmlFile = files.find(f => f.getName().toLowerCase().endsWith('.xml'));
  if (!xmlFile) throw new Error(`ZIP da edição ${edicao} (Patentes) não contém XML`);

  const root = XmlService.parse(xmlFile.getDataAsString('UTF-8')).getRootElement();
  const despachoElements = getElementsRecursive_(root, 'despacho');

  return despachoElements
    .map(el => {
      const processoEl = el.getChild('processo-patente');
      const numeroEl = processoEl ? processoEl.getChild('numero') : null;
      const comentario = getChildText_(el, 'comentario');
      const prazoMatch = PRAZO_REGEX.exec(comentario);
      return {
        edicao,
        processo: numeroEl ? numeroEl.getText().trim() : '',
        codigo: getChildText_(el, 'codigo'),
        titulo: getChildText_(el, 'titulo'),
        comentario,
        prazoDias: prazoMatch ? Number(prazoMatch[1]) : null,
      };
    })
    .filter(d => d.processo);
}
