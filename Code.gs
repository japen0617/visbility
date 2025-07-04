// Google Apps Script for processing questionnaire results
// Replace with your destination spreadsheet information
const SHEET_ID = '1NEwWidB8E6W_i6UIoPtX9B-pUHpuPylVXlfGOCetBFU';
const SHEET_NAME = 'record';

function doGet() {
  return HtmlService.createHtmlOutput('Apps Script is running');
}

function doPost(e) {
  var data = {};
  if (e.postData && e.postData.contents) {
    data = JSON.parse(e.postData.contents);
  }

  var result;
  if (data.type === 'pdf') {
    result = savePdfToDrive(data);
  } else {
    result = saveToSheet(data);
  }

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
  var ss;
  if (SHEET_ID && SHEET_ID !== "REPLACE_WITH_SHEET_ID") {
    ss = SpreadsheetApp.openById(SHEET_ID);
  } else {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  }
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();

  var row = [];
  row.push(new Date());
  row.push(data.userName || '');
  row.push(data.userContactPhone || '');
  row.push(data.userMobilePhone || '');
  row.push(data.userCompany || '');
  row.push(data.userEmail || '');

  if (data.answers) {
    var keys = Object.keys(data.answers).sort();
    keys.forEach(function(key) {
      row.push(data.answers[key]);
    });
  }

  sheet.appendRow(row);
  return {status: 'success'};
}

function savePdfToDrive(data) {
  try {
    var folder = DriveApp.getFolderById('1uKpHSmWycbZ0LdNCsVR80tswREEMuMwG');
    var bytes = Utilities.base64Decode(data.pdfBase64 || '');
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
    var filename = (data.userCompany || 'company') + '_' + (data.userName || 'user') + '_報告_' + timestamp + '.pdf';
    var blob = Utilities.newBlob(bytes, 'application/pdf', filename);
    folder.createFile(blob);
    return {status: 'success'};
  } catch (err) {
    return {status: 'error', message: err.toString()};
  }
}
