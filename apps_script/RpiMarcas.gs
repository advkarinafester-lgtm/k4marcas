// ATENÇÃO — schema assumido por analogia: os nomes de tag abaixo
// (<despacho>, <codigo>, <titulo>, <comentario>, <processo-marca><numero>)
// foram inferidos a partir do XML de Patentes, que FOI validado com um
// arquivo real (P2893.zip — ver RpiPatentes.gs). O XML de Marcas
// (RM<edição>.xml) ainda não foi inspecionado diretamente nesta
// implementação. Na primeira execução real, confira a estrutura do XML
// baixado e ajuste as constantes RM_TAG abaixo se os nomes forem
// diferentes — o resto do parser não precisa mudar.
const RM_TAG = {
  DESPACHO: 'despacho',
  CODIGO: 'codigo',
  TITULO: 'titulo',
  COMENTARIO: 'comentario',
  PROCESSO: 'processo-marca',
  NUMERO: 'numero',
};

function baixarEParsearMarcas(edicao) {
  const url = `https://revistas.inpi.gov.br/txt/RM${edicao}.zip`;
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) {
    throw new Error(`RPI Marcas edição ${edicao} indisponível (HTTP ${response.getResponseCode()})`);
  }

  const files = Utilities.unzip(response.getBlob());
  const xmlFile = files.find(f => f.getName().toLowerCase().endsWith('.xml'));
  if (!xmlFile) throw new Error(`ZIP da edição ${edicao} (Marcas) não contém XML`);

  const root = XmlService.parse(xmlFile.getDataAsString('UTF-8')).getRootElement();
  const despachoElements = getElementsRecursive_(root, RM_TAG.DESPACHO);

  return despachoElements
    .map(el => {
      const processoEl = el.getChild(RM_TAG.PROCESSO);
      const numeroEl = processoEl ? processoEl.getChild(RM_TAG.NUMERO) : null;
      return {
        edicao,
        processo: numeroEl ? numeroEl.getText().trim() : '',
        despacho: getChildText_(el, RM_TAG.TITULO),
        textoComplementar: getChildText_(el, RM_TAG.COMENTARIO),
      };
    })
    .filter(d => d.processo);
}
