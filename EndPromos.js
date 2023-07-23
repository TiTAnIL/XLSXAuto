
// Load File 1 button
document.getElementById("file1-btn").addEventListener("click", function() {
  loadExcelFile("file1.xlsx", function(data) {
    // Do something with the data, e.g. extract a column
    var column = extractColumn(data, "Column1");
    console.log(column);
  });
});

// Load File 2 button
document.getElementById("file2-btn").addEventListener("click", function() {
  loadExcelFile("file2.xlsx", function(data) {
    // Do something with the data, e.g. filter rows
    var filteredData = filterRows(data, function(row) {
      return row["Column2"] === "Value1";
    });
    console.log(filteredData);
  });
});

// Load File 3 button
document.getElementById("file3-btn").addEventListener("click", function() {
  loadExcelFile("file3.xlsx", function(data) {
    // Do something with the data, e.g. perform a VLOOKUP
    var lookupValue = "Value1";
    var lookupResult = vlookup(data, "Column1", "Column2", lookupValue);
    console.log(lookupResult);
  });
});

// Load an Excel file and parse it into a 2D array
function loadExcelFile(filename, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", filename, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function(e) {
    var arrayBuffer = xhr.response;
    var data = parseExcelFile(arrayBuffer);
    callback(data);
  };
  xhr.send();
}

// Parse an Excel file (in XLSX format) into a 2D array
function parseExcelFile(arrayBuffer) {
  var workbook = XLSX.read(arrayBuffer, {type:"array"});
  var worksheet = workbook.Sheets[workbook.SheetNames[0]];
  var data = XLSX.utils.sheet_to_json(worksheet, {header:1});
  return data;
}

// Extract a column from an Excel data array
function extractColumn(data, columnName) {
  var column = [];
  var headerRow = data[0];
  var columnIndex = headerRow.indexOf(columnName);
  if (columnIndex >= 0) {
    for (var i = 1; i < data.length; i++) {
      column.push(data[i][columnIndex]);
    }
  }
  return column;
}

// Filter rows in an Excel data array based on a filter function
function filterRows(data, filterFunction) {
  var filteredData = [data[0]];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (filterFunction(row)) {
      filteredData.push(row);
    }
  }
  return filteredData;
}

// Perform a VLOOKUP-like operation on an Excel data array
function vlookup(data, lookupColumn, resultColumn, lookupValue) {
  var headerRow = data[0];
  var lookupIndex
}

const clearFilesBtn = document.getElementById('clearFilesBtn')
clearFilesBtn.addEventListener('click'), function() {
document.getElemntById('file1').value = ''
document.getElemntById('file2').value = ''
document.getElemntById('file3').value = ''
}