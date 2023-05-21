


// spliting functionality ONLY!
function splitCsvFile() {
  const maxRowsPerFile = 499;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv';
  input.addEventListener('change', function() {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function() {
      const csv = reader.result;
      const rows = csv.split('\n');
      const headers = rows[0]; // Get the headers from the first row
      let fileIndex = 0;
      let rowCount = 0;
      let currentFileRows = [headers]; // Start with the headers in the first file
      const files = [currentFileRows];
      const fileName = file.name.split('.csv')[0]; // Get the original file name without the extension
      for (let i = 1; i < rows.length; i++) {
        if (rowCount < maxRowsPerFile) {
          currentFileRows.push(rows[i]);
          rowCount++;
        } else {
          currentFileRows = [headers]; // Start a new file with the headers
          currentFileRows.push(rows[i]);
          rowCount = 1;
          files.push(currentFileRows);
          fileIndex++;
        }
      }

      // Save all files
      files.forEach((fileRows, index) => {
        const blob = new Blob([`\uFEFF${fileRows.join('\n')}`], { type: 'text/csv;charset=utf-8' });
        const filename = `${fileName}${index+1}.csv`; // Set the filename dynamically
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      });
    };
    reader.readAsText(file, 'ISO-8859-8');
  });
  input.click();
}

