function getSheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Aba não encontrada: ' + name);
  return sheet;
}

function getHeaders_(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

// Lê uma aba inteira como lista de objetos {cabeçalho: valor}, ignorando
// linhas totalmente vazias. __rowIndex guarda a linha real na planilha
// (1-based, já considerando o cabeçalho) para permitir update posterior.
function readRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  return values.slice(1)
    .map((row, i) => ({ row, rowIndex: i + 2 }))
    .filter(({ row }) => row.some(v => v !== '' && v !== null))
    .map(({ row, rowIndex }) => {
      const obj = { __rowIndex: rowIndex };
      headers.forEach((h, c) => { obj[h] = row[c]; });
      return obj;
    });
}

function appendRow_(sheetName, rowObject) {
  const sheet = getSheet_(sheetName);
  const headers = getHeaders_(sheet);
  const row = headers.map(h => (rowObject[h] !== undefined ? rowObject[h] : ''));
  sheet.appendRow(row);
}

function updateCell_(sheetName, rowIndex, columnHeader, value) {
  const sheet = getSheet_(sheetName);
  const headers = getHeaders_(sheet);
  const col = headers.indexOf(columnHeader);
  if (col === -1) throw new Error('Coluna não encontrada: "' + columnHeader + '" em ' + sheetName);
  sheet.getRange(rowIndex, col + 1).setValue(value);
}
