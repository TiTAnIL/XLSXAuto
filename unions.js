
// Function to load an Excel file
// Load and read Excel file
function loadUnions() {
console.log('un loaded')
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

// Function to read and log each row
function readExcelRows(data) {
event.preventDefault();
  data.forEach((row) => {
    console.log(row);
    // Do further processing or write logic here
  });
}

