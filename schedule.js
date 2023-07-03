
const today = new Date();
const day = today.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6

if (day === 0 || day === 4) { // Highlight on Sunday and Thursday
	const hotnetOperation = document.getElementById('hotnet-operation');
	hotnetOperation.classList.add('highlight-green');
	}


const date = today.getDate()

if (date === 1 || date === 16) {
	const masiyamebatsaOperation = document.getElementById('masiyamebatsa-operation');
	masiyamebatsaOperation.classList.add('highlight-green');
	}


	// Function to remove the highlight from an operation
function removeHighlight(operationId) {
	const operation = document.getElementById(operationId);
	operation.classList.remove('highlight-green');
	operation.classList.remove('completed');
	}

