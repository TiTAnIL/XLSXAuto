// Entry point of the process
async function processEndPromos(files, cycle) {

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
	const selectedOption = event.target.value;
	console.log("Chosen Option:", selectedOption);
}

function findColumnIndex(data, column) {
  try {
    const row = data[0];
    const index = row.findIndex((cell) => cell === column);
    if (index === -1) {
      throw new Error(`Column ${column} not found`);
    } // else {
    //  console.log(`Column ${column} found at index ${index}`);
    // }
    return index;
  } catch (error) {
    console.error('Error:', error, '\n', 'Column:', column, '\n', 'Data:', data);
  }

}

function compareData(r389Data, indexData, codesData, columnIndexes) {
  // Compare data points from the different objects and return the crossed data as a new object
  // create an empty array to store the crossed data
  // do an equelent to excel vlookup function on the r389Data and indexData by the promotion code and if there is a match, add to the array the data from the r389Data and the indexData.
  // the crossed data array should look like this:
  // r389AccountNumber, r389DataPromotionCode, r389PromotionSeq, r389Bi

}

async function saveToFile(data, filename) {
  // Save the data to a new file using xlsx
}
