let connectionHeaders = null;
let filteredRows = [];
let firstRow = null;

function handleGoCampaigns(connectionsFile, campaignsFile) {
  if (connectionsFile && campaignsFile) {
    console.log('Starting the campaigns process...');
    loadConnections(connectionsFile);
    // Add your logic to initiate the process using the loaded files
  } else {
    console.log('Please load both the connections file and the campaigns file');
  }
}

function loadConnections(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    processConnectionHeaders(worksheet);
  };

  reader.readAsArrayBuffer(file);
}

function loadCampaigns(file) {
  console.log('Campaigns file loaded', file);
  // Add your logic for processing the campaigns file here
  campaignsFile = file;
}

function processConnectionHeaders(worksheet) {
  console.log('Processing connection headers');
  const headers = {
    siteNumber: null,
    serviceCategory: null,
    tvIndication: null,
    internetIndication: null,
    telephoneIndication: null,
    combinationChangeValue: null,
    SalesExe: null,
    DCRDIH: null,
    SiteType: null,
    ProductCode: null,
    WorkOrderCode: null
  };

  // Extract the first row
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const firstRowRange = { s: { r: range.s.r, c: range.s.c }, e: { r: range.s.r, c: range.e.c } };
  const firstRowData = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: firstRowRange });
  if (firstRowData.length > 0) {
    firstRow = firstRowData[0];
  }

console.log(firstRowData)

  // Loop over the header values and set variables for column numbers
  for (const cell in worksheet) {
    const cellRef = XLSX.utils.decode_cell(cell);
    if (cellRef.r === 0) {
      const headerValue = worksheet[cell].v;
      switch (headerValue) {
        case 'מס אתר בילי':
          headers.siteNumber = cellRef.c;
          break;
        case 'קטגורית שרות':
          headers.serviceCategory = cellRef.c;
          break;
        case 'אינדיקציה ל-TV':
          headers.tvIndication = cellRef.c;
          break;
        case 'אינדיקציה ל-INTERNET':
          headers.internetIndication = cellRef.c;
          break;
        case 'אינדיקציה ל-TELEPHONE':
          headers.telephoneIndication = cellRef.c;
          break;
        case 'ערך השינוי בקומבינציה':
          headers.combinationChangeValue = cellRef.c;
          break;
        case 'כמות ביצוע מכירות':
          headers.SalesExe = cellRef.c;
          break;
        case 'מחלקה נציג מתוגמל מפורט כולל הסטוריה':
          headers.DCRDIH = cellRef.c;
          break;
        case 'קוד סוג אתר':
          headers.SiteType = cellRef.c;
          break;
        case 'קוד מוצר בסיס':
          headers.ProductCode = cellRef.c;
          break;
        case 'קוד סוג הפקע':
          headers.WorkOrderCode = cellRef.c;
          break;
        default:
          break;
      }
    }
  }

  console.log('Connection headers:', headers); // Display the connection headers
  connectionHeaders = headers;

  filterConnectionData(worksheet, headers);
  saveFilteredDataToXLSX();
}

function filterConnectionData(worksheet, headers) {
  console.log('Filtering connection data');
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Filter conditions
  filteredRows = rows.filter((row) => {
    const salesExe = row[headers.SalesExe];
    const dcrdih = row[headers.DCRDIH];
    const siteType = row[headers.SiteType];
    const productCode = row[headers.ProductCode];
    const workOrderCode = row[headers.WorkOrderCode];
    const isSalesExeOne = salesExe === 1;
    const isDcrdihNotResellers = dcrdih !== 'Resellers';
    const isSiteTypeNotABAOrBEN = siteType !== 'ABA' && siteType !== 'BEN';
    const isProductCodeNotUNT = productCode !== 'UNT';
    const isWorkOrderCodeCN = workOrderCode === 'CN';
	console.log(filteredRows)
  groupedRows = {};
  filteredRows.forEach((row) => {
    const siteNumber = row[connectionHeaders.siteNumber];
    if (!groupedRows[siteNumber]) {
      groupedRows[siteNumber] = [];
    }
    groupedRows[siteNumber].push(row);
  });
	 processMatchingValues()
    return (
      isSalesExeOne &&
      isDcrdihNotResellers &&
      isSiteTypeNotABAOrBEN &&
      isProductCodeNotUNT &&
      isWorkOrderCodeCN
    );
  });
}

function saveFilteredDataToXLSX() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([firstRow, ...filteredRows]);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Data');
  const binaryData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  const blob = new Blob([s2ab(binaryData)], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);

  // Trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'filtered_data.xlsx';
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(url);
}

// Utility function to convert string to ArrayBuffer
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}
