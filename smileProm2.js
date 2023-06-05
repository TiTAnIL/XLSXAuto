function downloadFile(data, filename) {
  var element = document.createElement('a');
  element.setAttribute('href', data);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function processFile() {
  var fileInput = document.getElementById('file-input');
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });
    
    // Step 1: Iterate over each sheet in the workbook
    for (var sheetName in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheetName)) {
        var sheet = workbook.Sheets[sheetName];
        
        // Step 2: Convert the sheet to JSON format
        var jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Step 3: Extract the header row to retrieve column indices
        var headerRow = jsonData[3];
        var colTreat, colSiteNumInq, colSiteNum, colRepId, colInqNum;

        // Step 4: Find the column indices based on header names
        headerRow.forEach(function (headerCellValue, index) {
          switch (headerCellValue) {
            case 'הוכנס טיפול':
              colTreat = index;
              break;
            case 'מספר אתר לפניה':
              colSiteNumInq = index;
              break;
            case 'מספר אתר':
              colSiteNum = index;
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

        for (var i = 1; i < jsonData.length; i++) {
          var row = jsonData[i];
          var hasValue = false;

          // Check if any cell under the column "הוכנס טיפול" has a value
          if (row[colTreat]) {
            hasValue = true;
          }

          // Check if the value under the column "מספר אתר לפניה" is a duplicate
          var siteNumInq = row[colSiteNumInq];

          if (!uniqueValues.has(siteNumInq)) {
            if (hasValue) {
              deletedRows.push(row); // Add the row to the deleted rows array
            } else {
              uniqueValues.add(siteNumInq); // Add the value to the set of unique values

              var modifiedRow = {};

              modifiedRow['הוכנס טיפול'] = row[colTreat];
              modifiedRow['מספר אתר לפניה'] = row[colSiteNumInq];
              modifiedRow['מספר אתר'] = row[colSiteNum];
              modifiedRow['תז נציג יוצר פניה'] = row[colRepId];
              modifiedRow['מספר פניה'] = row[colInqNum];

              modifiedRows.push(modifiedRow);
            }
          }
        }

        // Log the deleted rows
        console.log('Deleted Rows:', deletedRows);

        // Log the modified rows
        console.log('Modified Rows:', modifiedRows);

        // Step 9: Save each modified sheet as a separate file
        if (modifiedRows.length > 0) {
          var newWorkbook = XLSX.utils.book_new();
          var newSheet = XLSX.utils.json_to_sheet(modifiedRows, {
            header: ['הוכנס טיפול', 'מספר אתר לפניה', 'מספר אתר', 'תז נציג יוצר פניה', 'מספר פניה']
          });

          XLSX.utils.book_append_sheet(newWorkbook, newSheet, sheetName);
          var newWorkbookData = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
          var blob = new Blob([newWorkbookData], { type: 'application/octet-stream' });
          var url = URL.createObjectURL(blob);
          downloadFile(url, sheetName + '.xlsx');
        }
      }
    }
  };

  reader.readAsArrayBuffer(file);
}
