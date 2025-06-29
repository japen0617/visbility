// Replace with your destination spreadsheet information
const SHEET_ID = 'REPLACE_WITH_SHEET_ID';
const SHEET_NAME = 'Sheet1';

function doGet(e) {
  return HtmlService.createHtmlOutput('Apps Script is running');
}

function doPost(e) {
  var data = {};
  if (e.postData && e.postData.contents) {
    data = JSON.parse(e.postData.contents);
  }
  var result = saveToSheet(data);
  var output = ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return output;
}

function doOptions() {
  var output = ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON);
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return output;
}

function saveToSheet(data) {
  // Use the provided spreadsheet ID or fall back to the active spreadsheet
  var ss = (SHEET_ID === 'REPLACE_WITH_SHEET_ID')
    ? SpreadsheetApp.getActiveSpreadsheet()
    : SpreadsheetApp.openById(SHEET_ID);

  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
  sheet.appendRow([new Date(), JSON.stringify(data)]);
  return {status: 'success'};
}

