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
        var columnIndices = {};
        
	// Step 4: Find the column indices based on header names
// Step 5: Process each row in the sheet
for (var i = 1; i < jsonData.length; i++) {
  var row = jsonData[i];
  var modifiedRow = {};

  // Retrieve specific values based on desired indices
  var colTreatValue = row[colTreat];
  var colSiteNumInqValue = row[colSiteNumInq];
  var colSiteNumValue = row[colSiteNum];
  var colRepIdValue = row[colRepId];
  var colInqNumValue = row[colInqNum];

  // Add the desired values to the modifiedRow object
  modifiedRow['הוכנס טיפול'] = colTreatValue;
  modifiedRow['מספר אתר לפניה'] = colSiteNumInqValue;
  modifiedRow['מספר אתר'] = colSiteNumValue;
  modifiedRow['תז נציג יוצר פניה'] = colRepIdValue;
  modifiedRow['מספר פניה'] = colInqNumValue;

  modifiedRows.push(modifiedRow);
}

        var modifiedRows = [];

        // Step 5: Process each row in the sheet
        for (var i = 1; i < jsonData.length; i++) {
          var row = jsonData[i];
	console.log(row)
          var modifiedRow = {};

          // Step 6: Map the values to their corresponding header names
          for (var columnIndex in columnIndices) {
            var headerName = columnIndices[columnIndex];
            modifiedRow[headerName] = row[columnIndex];
          }

          var columnMValue = modifiedRow['M'];

          // Step 7: Check if the M column value is empty or not a string
          if (!columnMValue || typeof columnMValue !== 'string') {
            var columnAValue = modifiedRow['A'];
            var columnCValue = modifiedRow['C'];
            var columnFValue = modifiedRow['F'];

            // Step 8: Construct the modified row with desired columns
            modifiedRows.push({
              'A': columnAValue,
              'M': columnMValue,
              'C': columnCValue,
              'F': columnFValue
            });
          }
        }

        // Step 9: Check if there are any modified rows
        if (modifiedRows.length > 0) {
          // Step 10: Create a new workbook and sheet
          var newWorkbook = XLSX.utils.book_new();
          var newSheet = XLSX.utils.json_to_sheet(modifiedRows, {
            header: ['A', 'M', 'C', 'F']
          });

          // Step 11: Add the sheet to the workbook
          XLSX.utils.book_append_sheet(newWorkbook, newSheet, sheetName);

          // Step 12: Save the new workbook as a new file
          XLSX.writeFile(newWorkbook, sheetName + '.xlsx');
        }
      }
    }
  };
  reader.readAsArrayBuffer(file);
}
