

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
	console.log(dataRows)

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
    var cellAddress = XLSX.utils.encode_cell({r: 3, c: col});
    var cell = sheet[cellAddress];
	console.log('cell', cell.v )
    // check if the cell value matches the header name
    if (cell && cell.v === 'כללי שירות') {
      // store the column letter for the header and the other columns of interest
	console.log('column', XLSX.utils.encode_col(col))
      headerCols.service = XLSX.utils.encode_col(col);
      headerCols.case = XLSX.utils.encode_col(col + 1);
      headerCols.site = XLSX.utils.encode_col(col + 2);

      break;
    }
  }
console.log('headeCols',headerCols)
  return headerCols;
}

// function to find the rows with empty cells under the 'כללי שירות' header
function findDataRows(sheet, headerCols) {
  var dataRows = [];

  // iterate over the range of cells in the sheet
  var range = XLSX.utils.decode_range(sheet['!ref']);
  for (var row = range.s.r; row <= range.e.r; row++) {
    var cellAddress = XLSX.utils.encode_cell({r: row, c: headerCols.service});
    var serviceCell = sheet[cellAddress];

    // check if the cell value is empty and the row is not a header or footer row
    if (serviceCell && !serviceCell.v && row > 3 && row < range.e.r) {
      var dataRow = {};
	console.log('1')
      // store the values under the columns of interest
      dataRow.case = sheet[XLSX.utils.encode_cell({r: row, c: headerCols.case})].v;
      dataRow.site = sheet[XLSX.utils.encode_cell({r: row, c: headerCols.site})].v;
	console.log(dataRow)
      dataRows.push(dataRow);
    }
  }
  return dataRows;
}

// function to write the output file for the sheet
function writeOutputFile(sheetName, data) {
  var worksheet = XLSX.utils.json_to_sheet(data);
  var workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, sheetName + ".xlsx");
}
