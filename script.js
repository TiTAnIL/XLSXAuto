1. 
function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const workbook = XLSX.read(reader.result, { type: 'binary' });
      const data = {};
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const headerRange = XLSX.utils.decode_range(worksheet['!ref']).s.r;
        const headerRow = []
//      for (let col = 0; col <= headerRange; col++) {
//        const headerCell = worksheet[XLSX.utils.encode_cell({ c: col, r: headerRange })];
//        headerRow.push(headerCell ? headerCell.v : null);
//        console.log('headerCell', headerCell, 'push headerRow', headerRow)
//        }
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: headerRow });
        data[sheetName] = sheetData;
console.log(data)
console.log(sheetData)
      });
      resolve(data);
    };
    reader.onerror = () => {
      reject('Error reading Excel file.');
    };
  });
}

2.
//function filterData(sheetData) {
  // Get the header row of the sheet data
//  const headerRow = sheetData[3];
  
  // Check that the header row contains the expected column name
//  if (!headerRow.hasOwnProperty('הוכנס טיפול')) {
//    throw new Error(`Expected column 'הוכנס טיפול' not found in sheet data`);
//  }
  
//  const filteredData = sheetData.filter((row) => {
//	console.log(row)
//    return row['הוכנס טיפול'] === '';
//  }).map((row) => {
//    return {
//      'מספר פניה': row['מספר פניה'],
  //    'נציג יוצר פניה': row['נציג יוצר פניה'],
 //     'מספר אתר לפניה': row['מספר אתר לפניה'],
//    };
//  });
//  return filteredData;
//}	


function filterData(sheetData) {
  const headerRow = sheetData[3];
  const filteredData = sheetData.filter((row, index) => {
    return row[headerRow.indexOf('הוכנס טיפול')] === '';
  }).map((row) => {
	console.log(row)
    return {
      'מספר פניה': row[headerRow.indexOf('מספר פניה')],
      'נציג יוצר פניה': row[headerRow.indexOf('נציג יוצר פניה')],
      'מספר אתר לפניה': row[headerRow.indexOf('מספר אתר לפניה')],
    };
  });
  return filteredData;
}



// 3. Remove duplicates by 'מספר אתר לפניה' column
function removeDuplicates(filteredData) {
  const uniqueData = [];
  const uniqueIds = new Set();
  filteredData.forEach((row) => {
    if (!uniqueIds.has(row['מספר אתר לפניה'])) {
      uniqueIds.add(row['מספר אתר לפניה']);
      uniqueData.push(row);
    }
  });
  return uniqueData;
}

// 4. Save data to separate output files based on the sheet name
function saveData(data, sheetName) {
  // Create a new workbook for this sheet
  let newWorkbook = XLSX.utils.book_new();
  
  // Add a new worksheet with the same name as the original sheet
  let newSheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, sheetName);
  
  // Save the workbook to a file with the same name as the sheet
  XLSX.writeFile(newWorkbook, `${sheetName}.xlsx`);
}

// 5. Process the loaded Excel file
function processSmileFile(file) {
  parseExcelFile(file)
    .then((data) => {
      console.log('data', data);
      for (let sheetName in data) {
        console.log('sheetName', sheetName);
        console.log('data[sheetName]', data[sheetName]);
        let sheetData = data[sheetName];
	console.log('sheetdata', sheetData)
        let filteredData = filterData(sheetData);
         console.log('filterData', filteredData); // add console log to check the output
        let uniqueData = removeDuplicates(filteredData);
        saveData(uniqueData, sheetName);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}


function getHeaderRow(sheetData) {
	console.log('getHeaderRow got called')
  let headerRow;
  sheetData.some((row, index) => {
    if (Object.values(row).some((cellValue) => cellValue === 'הוכנס טיפול')) {
console.log('row', row, 'index', index)
      headerRow = sheetData[index];
console.log('headerRow from get header row', headerRow)
      return true;
    }
  });
console.log('headerRow from get header row', headerRow)
  return headerRow;
}


// Tests
// 1.
//const sampleInput = [  { 'מספר פניה': '123', 'נציג יוצר פניה': 'John', 'מספר אתר לפניה': '456', 'הוכנס טיפול': '' },  { 'מספר פניה': '234', 'נציג יוצר פניה': 'Jane', 'מספר אתר לפניה': '789', 'הוכנס טיפול': 'yes' },  { 'מספר פניה': '345', 'נציג יוצר פניה': 'Bob', 'מספר אתר לפניה': '123', 'הוכנס טיפול': '' },];
//const expectedOutput = [  { 'מספר פניה': '123', 'נציג יוצר פניה': 'John', 'מספר אתר לפניה': '456' },  { 'מספר פניה': '345', 'נציג יוצר פניה': 'Bob', 'מספר אתר לפניה': '123' },];
// Run the function with the sample input
//const actualOutput = filterData(sampleInput);
// Check that the output matches the expected output
//console.log(actualOutput); // output should be the same as expectedOutput
//console.log('expected', expectedOutput)

