let connectionFile = null;

function loadConnections(file) {
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    connectionFile  = processConnectionHeaders(worksheet);
  };

  reader.readAsArrayBuffer(file);
}

function processConnectionHeaders(worksheet) {
  const headers = {
    siteNumber: null,
    serviceCategory: null,
    tvIndication: null,
    internetIndication: null,
    telephoneIndication: null,
    combinationChangeValue: null
  };

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
        default:
          break;
      }
    }
  }

  console.log(headers); // Display the column numbers

  // Pass the headers object to the next step, such as filtering or further processing
}

function handleConnectionLoad(event) {
	const file = event.target.files[0];
	loadConnections(file);
}


function handleGoClick() {
	if (connectionsFile) {
		console.log('filter here')
	} else {
		console.log('Please load the connections file')
	}

// const goButton = document.getElementById
	