function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('RPI K4')
    .addItem('Rodar rotina semanal agora', 'rotinaSemanalRPI')
    .addItem('Criar/reinstalar gatilho semanal (terça-feira)', 'criarGatilhoSemanal')
    .addToUi();
}

function criarGatilhoSemanal() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'rotinaSemanalRPI')
    .forEach(t => ScriptApp.deleteTrigger(t));

  // Horário provisório (14h) — ajustar quando confirmarmos o horário real
  // de publicação da RPI (item 2 da seção 12.4 do plano).
  ScriptApp.newTrigger('rotinaSemanalRPI')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.TUESDAY)
    .atHour(14)
    .create();
}
