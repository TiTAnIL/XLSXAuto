// Load and read Excel file
function loadDream() {
  event.preventDefault();
  var fileInput = document.getElementById('dream-file');
  var file = fileInput.files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    processWorksheet(workbook, worksheet); // Call the function to process the worksheet
  };

  reader.readAsArrayBuffer(file);
}

// Process the worksheet to find the column letter of the header "מס אתר בילי"
function processWorksheet(workbook, worksheet) {
  const headers = {};

  for (const cellAddress in worksheet) {
    if (cellAddress[0] === '!' || !worksheet.hasOwnProperty(cellAddress)) continue;

    const cell = worksheet[cellAddress];
    const cellValue = cell.w || cell.v; // Get the cell value, considering both formula and raw value

    if (cellValue === 'מס אתר בילי') {
      console.log(cellValue)
      const columnName = cellAddress.match(/[A-Z]+/)[0];
      headers[columnName] = cellAddress;
      console.log('header is: ', headers)
      console.log('cellAd is: ', cellAddress)
      break; // Assuming the header appears only once, exit loop once found
    }
  }

  const categoryColumnLetter = 'W'; // Replace with your desired category column letter

  // Call the function to log duplicate values and category counts
  logDuplicates(workbook, worksheet, headers, categoryColumnLetter);
}

// Log row numbers where values in the specified column repeat two or more times
function logDuplicates(workbook, worksheet, headers, categoryColumnLetter) {
  const columnLetter = Object.keys(headers)[0];
  const columnAddress = headers[columnLetter];
  const columnValues = {};

  const categoryColumnIndex = XLSX.utils.decode_col(categoryColumnLetter);

  const columnRange = XLSX.utils.decode_range(worksheet['!ref']);
  const columnIndex = XLSX.utils.decode_col(columnLetter);

  // Array to store the rows to be copied
  const rowsToCopy = [];

  for (let rowIndex = columnRange.s.r; rowIndex <= columnRange.e.r; rowIndex++) {
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex });
    const cell = worksheet[cellAddress];
    const cellValue = cell.w || cell.v;

    if (cellValue) {
      if (columnValues[cellValue]) {
        columnValues[cellValue].count++;
        columnValues[cellValue].rows.push(rowIndex + 1); // Add 1 to rowIndex to display 1-based row numbers
      } else {
        columnValues[cellValue] = {
          count: 1,
          rows: [rowIndex + 1], // Add 1 to rowIndex to display 1-based row numbers
        };
      }
    }
  }

  for (const value in columnValues) {
    const { count, rows } = columnValues[value];
    if (count >= 2) {
      const categoryCounts = {
        INT: 0,
        TV: 0,
        TEL: 0
      };

      for (const rowNumber of rows) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowNumber - 1, c: categoryColumnIndex });
        const cell = worksheet[cellAddress];
        const categoryValue = cell.w || cell.v;

        if (categoryValue === 'INT' || categoryValue === 'TV' || categoryValue === 'TEL') {
          categoryCounts[categoryValue]++;
        }
      }

      if (categoryCounts.INT >= 1 && categoryCounts.TV >= 1 && categoryCounts.TEL >= 1) {
        console.log('Value:', value);
        console.log('Count:', count);
        console.log('Row numbers:', rows.join(', '));
        console.log('Category Counts:', categoryCounts);
        console.log('-------------------------');

        // Add the rows to the array to be copied
        rowsToCopy.push(...rows);
      }
    }
  }

  if (categoryColumnLetter) {
    console.log('Category Column Letter:', categoryColumnLetter);
  }

  // Copy rows to a new sheet
  copyRowsToNewSheet(workbook, worksheet, rowsToCopy);
}

// Copy rows to a new sheet
function copyRowsToNewSheet(workbook, worksheet, rowsToCopy) {
  // Create a new worksheet for the copied rows
  const newWorksheetName = 'Copied Rows';
  const newWorksheet = XLSX.utils.aoa_to_sheet([]);

  // Add headers to the new worksheet
  const headers = Object.keys(worksheet);
  for (const header of headers) {
    if (header.startsWith('!')) {
      const cell = worksheet[header];
      const cellValue = cell.w || cell.v; // Use v property if w is undefined
      XLSX.utils.sheet_add_aoa(newWorksheet, [[cellValue]], { origin: header });
    }
  }

  // Copy rows to the new worksheet
  for (const row of rowsToCopy) {
    const rowRange = XLSX.utils.decode_range(worksheet['!ref']);
    const rowData = [];
    let shouldCopyRow = false;

    for (let colIndex = rowRange.s.c; colIndex <= rowRange.e.c; colIndex++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row - 1, c: colIndex });
      const cell = worksheet[cellAddress];
      const cellValue = cell && (cell.w || cell.v); // Check if cell exists before accessing properties

      if (colIndex === categoryColumnIndex) {
        if (cellValue === 'INT' || cellValue === 'TV' || cellValue === 'TEL') {
          shouldCopyRow = true;
        } else {
          shouldCopyRow = false;
          break; // Exit the loop if the category value does not match
        }
      }

      rowData.push(cellValue || '');
    }

    if (shouldCopyRow) {
      XLSX.utils.sheet_add_aoa(newWorksheet, [rowData]);
    }
  }

  // Add the new worksheet to the workbook
  workbook.SheetNames.push(newWorksheetName);
  workbook.Sheets[newWorksheetName] = newWorksheet;

  // Generate a new Excel file with the copied rows
  const newWorkbookOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Save the new Excel file
  saveWorkbook(newWorkbookOutput, 'copied_rows.xlsx');
}



// Save workbook to a file
function saveWorkbook(workbookOutput, filename) {
  const blob = new Blob([workbookOutput], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
