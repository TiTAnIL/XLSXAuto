function downloadFile(data, filename) {
  var csvContent = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(data);
  var link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename + '.csv');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function processFile() {
  var fileInput = document.getElementById('file-input');
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });

    for (var sheetName in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheetName)) {
        var sheet = workbook.Sheets[sheetName];
        var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        var headerRow = jsonData[3];
        var colTreat, colSiteNumInq, colSiteNum, colRepId, colInqNum;

        headerRow.forEach(function (headerCellValue, index) {
          switch (headerCellValue) {
            case 'הוכנס טיפול':
              colTreat = index;
              break;
            case 'מספר אתר לפניה':
              colSiteNumInq = index;
              break;
            case 'תז נציג יוצר פניה':
              colRepId = index;
              break;
            case 'מספר פניה':
              colInqNum = index;
              break;
            default:
              break;
          }
        });

        var uniqueValues = new Set();
        var modifiedRows = [];
        var deletedRows = [];

        for (var i = 0; i < jsonData.length; i++) {
          var row = jsonData[i];
          var hasValue = false;

          if (row[colTreat]) {
            hasValue = true;
          }

          var siteNumInq = row[colSiteNumInq];
          var repId = row[colRepId];

          if (typeof row[colInqNum] !== 'undefined' && typeof siteNumInq !== 'undefined' && typeof repId !== 'undefined') {
            if (!uniqueValues.has(siteNumInq)) {
              if (hasValue) {
                // Add the row to the deleted rows array
                // deletedRows.push(row);
              } else {
                uniqueValues.add(siteNumInq);
                var modifiedRow = {};

                modifiedRow['מספר פניה'] = row[colInqNum];
                modifiedRow['מספר אסמכתא'] = '';
                modifiedRow['מספר לקוח'] = '';
                modifiedRow['מספר אתר'] = siteNumInq;
                modifiedRow['קוד מהיר'] = '';
                modifiedRow['מחלקה'] = '';
                modifiedRow['תחום'] = '';
                modifiedRow['סיווג ראשי'] = '';
                modifiedRow['סיווג משני'] = '';
                modifiedRow['סיווג מפורט'] = '';
                modifiedRow['תקציר'] = '';
                modifiedRow['גורם מטפל'] = '';
                modifiedRow['נציג מטפל'] = repId;
		modifiedRow['מספר פק"ע'] = '';
		modifiedRow['פניה מקושרת'] = '';
		modifiedRow['זיהוי נציג מוכר'] = '';
                modifiedRow['זיהוי טיפול'] = sheetName === 'CSR' ? 31250 : 31251;
                modifiedRow['תקציר טיפול'] = '';
                modifiedRow['OPRID'] = repId;
                modifiedRow['תאריך יצירה'] = '';
                modifiedRow['ללא יצירת פניה חוזרת'] = '';
                modifiedRow['חשבונות משניים'] = '';
		modifiedRow['קוד מבצע'] = '';
		modifiedRow['תאריך סיום'] = '';
                modifiedRows.push(modifiedRow);
              }
            }
          }
        }

        if (modifiedRows.length > 0) {
          var csvContent = '';

          csvContent += 'מספר פניה,מספר אסמכתא,מספר לקוח,מספר אתר,קוד מהיר,מחלקה,תחום,סיווג ראשי,סיווג משני,סיווג מפורט,תקציר,גורם מטפל,נציג מטפל,מספר פק"ע,פניה מקושרת,זיהוי נציג מוכר,זיהוי טיפול,תקציר טיפול,OPRID,תאריך יצירה,ללא יצירת פניה חוזרת,חשבונות משניים,קוד מבצע,תאריך סיום מבצע\n';

          for (var i = 0; i < modifiedRows.length; i++) {
            var row = modifiedRows[i];
            csvContent += Object.values(row).map(cell => '"' + cell + '"').join(',') + '\n';
	
          }
          downloadFile(csvContent, sheetName);
        }
      }
    }
  };

  reader.readAsArrayBuffer(file);
}
// the good one (for now)