

// function to process the input file
function processSmileFile(file) {
  // load the xlsx file
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, {type: 'array'});

    // process each sheet
    workbook.SheetNames.forEach(function(sheetName) {
      var sheet = workbook.Sheets[sheetName];

      // locate the headers and store their column letters
      var headerCols = findHeaderCols(sheet);
      // locate and process the rows with empty cells under the 'כללי שירות' header
      var dataRows = findDataRows(sheet, headerCols);
	
      // create and write the output file for this sheet
      writeOutputFile(sheetName, dataRows);
    });
  };
  reader.readAsArrayBuffer(file);
}

// function to find the header columns
function findHeaderCols(sheet) {
  var headerCols = {};
  var range = XLSX.utils.decode_range(sheet['!ref']);
  // iterate over the range of cells in the sheet
  for (var col = range.s.c; col <= range.e.c; col++) {
    var cellAddress = XLSX.utils.encode_cell({c: col, r: 3});
    var cell = sheet[cellAddress];
	console.log('address: ', cellAddress, `cell: `, cell)
    // check if the cell value matches the header name
    if (cell && cell.v === 'הוכנס טיפול') {
      // store the column letter for the header and the other columns of interest
      headerCols.service = XLSX.utils.encode_col(col);
      headerCols.case = XLSX.utils.encode_col(col + 1);
      headerCols.site = XLSX.utils.encode_col(col + 2);

      break;
    }
  }
  console.log('headerCols', headerCols)
  return headerCols;
}

// function to find the rows with empty cells under the 'הוכנס טיפול' header
function findDataRows(sheet, headerCols) {
  var dataRows = [];

  // iterate over the range of cells in the sheet
  var range = XLSX.utils.decode_range(sheet['!ref']);
  for (var row = range.s.r; row <= range.e.r; row++) {
	// console.log('asd', headerCols.service, row )
	// console.log(headerCols.service + row)
    var cellAddress = XLSX.utils.encode_cell({c: headerCols.service, r: row});
	// console.log('cellAddress ', cellAddress )
    var serviceCell = sheet[cellAddress];
	// console.log(XLSX.utils.encode_cell({c: headerCols.service}))
    // check if the cell value is empty and the row is not a header or footer row
    if (serviceCell && !serviceCell.v && row > 3 && row < range.e.r) {
      var dataRow = {};

      // store the values under the columns of interest
      dataRow.case = sheet[XLSX.utils.encode_cell({r: row, c: headerCols.case})].v;
      dataRow.site = sheet[XLSX.utils.encode_cell({r: row, c: headerCols.site})].v;
	console.log('dataRow', dataRow)
      dataRows.push(dataRow);
    }
  }

  return dataRows;
}


function writeOutputFile(sheetName, data) {
  var ws = XLSX.utils.json_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, sheetName + ".xlsx");
}



