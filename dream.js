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
    
    processWorksheet(worksheet); // Call the function to process the worksheet
  };
  
  reader.readAsArrayBuffer(file);
}

// Process the worksheet to find the column letter of the header "מס אתר בילי"
function processWorksheet(worksheet) {
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
  logDuplicates(worksheet, headers, categoryColumnLetter);
}

// Log row numbers where values in the specified column repeat two or more times
function logDuplicates(worksheet, headers, categoryColumnLetter) {
  const columnLetter = Object.keys(headers)[0];
  const columnAddress = headers[columnLetter];
  const columnValues = {};

  const categoryColumnIndex = XLSX.utils.decode_col(categoryColumnLetter);

  const columnRange = XLSX.utils.decode_range(worksheet['!ref']);
  const columnIndex = XLSX.utils.decode_col(columnLetter);

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
      // console.log('Value:', value);
      // console.log('Count:', count);
      // console.log('Row numbers:', rows.join(', '));

      // Check the category values for the rows with duplicate values
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

      // console.log('Category Counts:', categoryCounts);
      // console.log('-------------------------');
    }
  }

  if (categoryColumnLetter) {
    // console.log('Category Column Letter:', categoryColumnLetter);
  }
}
