// Entry point of the process
let selectedCycle = null;

async function processEndPromos(files) {

  // Load and parse the data from each file
  // loop over files and load each one, the first file is r389, the second is index, the third is codes
  // load the files using the loadAndParseFile function

  const r389Data = await loadAndParseFile(files[0]);
  const indexData = await loadAndParseFile(files[1]);
  const codesData = await loadAndParseFile(files[2]);

  // Define an object to store the required column indexes
  const columnIndexes = {
    r389AccountNumber: findColumnIndex(r389Data, 'Account Number'),
    r389DataPromotionCode: findColumnIndex(r389Data, 'Promotion Code'),
    r398PromoExpiteDate: findColumnIndex(r389Data, 'Promo Expire Date'),
    r389PromotionSeq: findColumnIndex(r389Data, 'Promotion Seq'),
    r389BillingCycle: findColumnIndex(r389Data, 'Billing Cycle'),
    indexDataPromotionCode: findColumnIndex(indexData, 'PROMOTION_CODE'),
    indexDataTreatMethod: findColumnIndex(indexData, 'אופן טיפול- מבצע'),
    indexDataExtantionPeriod: findColumnIndex(indexData, 'תקופת הארכה'),
    codesDataPromotionCode: findColumnIndex(codesData, 'Promotion Code'),
    codesDataNewPromoCode: findColumnIndex(codesData, 'קוד מבצע חדש')
  };


  // Compare data points from different objects and store the crossed data to a new object
  const crossedData = compareData(r389Data, indexData, codesData, columnIndexes);
  // Save the crossed data to a new file
  await saveToFile(crossedData, 'output.xlsx');
}

// Helper functions
async function loadAndParseFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      resolve(parsedData);
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}

function handleCycle(event) {
  selectedCycle = event.target.value;
  console.log(selectedCycle)
}

function findColumnIndex(data, column) {
  try {
    const row = data[0];
    const index = row.findIndex((cell) => cell === column);
    if (index === -1) {
      console.error('Error:', error, '\n', 'Column:', column, '\n', 'Data:', data);
    }  else {
     console.error('Error:', error, '\n', 'Column:', column, '\n', 'Data:', data);
    }
    return index;
  } catch (error) {
    console.error('Error:', error, '\n', 'Column:', column, '\n', 'Data:', data);
  }

}

function compareData(r389Data, indexData, codesData, columnIndexes) {
  try {
    if (!r389Data || !indexData || !codesData || !columnIndexes || !selectedCycle) {
      throw new Error('Missing data');
    }

    const crossedData = [];

    // Loop over the r389Data and compare it by the promotion code to the indexData,
    // if there is a match, add the data from the r389Data and the indexDataTreatMethod from the indexData to the crossedData array
    
    // call saveToFile function with the crossedData array and the filename 'output.xlsx'
    
    for (let i = 1; i < r389Data.length; i++) {
      const r389Row = r389Data[i];
      const r389PromotionCode = r389Row[columnIndexes.r389DataPromotionCode];
      const r389AccountNumber = r389Row[columnIndexes.r389AccountNumber];
      const r389PromotionSeq = r389Row[columnIndexes.r389PromotionSeq];
      const r389Bi = r389Row[columnIndexes.r389BillingCycle];
      const r389PromoExpiteDate = r389Row[columnIndexes.r398PromoExpiteDate];

      for (let j = 1; j < indexData.length; j++) {
        const indexRow = indexData[j];
        const indexDataPromotionCode = indexRow[columnIndexes.indexDataPromotionCode];
        const indexDataTreatMethod = indexRow[columnIndexes.indexDataTreatMethod];
        const indexDataExtantionPeriod = indexRow[columnIndexes.indexDataExtantionPeriod];
        if (r389PromotionCode === indexDataPromotionCode && selectedCycle === r389Bi) {
          crossedData.push({
            r389AccountNumber ,
            r389DataPromotionCode,
            r389PromotionSeq,
            r389Bi,
            indexDataTreatMethod,
            indexDataExtantionPeriod,
            r389PromoExpiteDate
          });
        }
      }
    }
    return crossedData;

  } catch (error) {
    console.error('Error:', error);
    return;
  }

  // Compare data points from the different objects and return the crossed data as a new object
  // create an empty array to store the crossed data
  // do an equelent to excel vlookup function on the r389Data and indexData by the promotion code and if there is a match, add to the array the data from the r389Data and the indexData.
  // the crossed data array should look like this:
  // r389AccountNumber, r389DataPromotionCode, r389PromotionSeq, r389Bi

}

async function saveToFile(data, filename) {
  try {
    if (!data || !filename) {
      throw new Error('Missing data');
    }
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error:', error);
  }
}