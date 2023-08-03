function handleGoBtnClick(processName, event) {
	// event.preventDefault()
	let loadedFiles
	console.log('process: ', processName, 'were called')
	switch (processName) {

		case 'countdownForm':
			applyCountDown()
			break;

		case 'campaigns':
			try {
				loadedFiles = [
					file1 = document.getElementById('connectionsFile').files[0],
					file2 = document.getElementById('campaignsFile').files[0]
				]

				if (!loadedFiles.file1 && !loadedFiles.file2) {
					throw new Error('Please select Both Files')
				} else if (!loadedFiles.file1) {
					throw new Error('You forget the connections file!')
				} else if (!loadedFiles.file2) {
					throw new Error('You forget the campaign file!')
				}
			} catch (error) {
				console.error('לא שכחנו משהו?', error)
				return
			}
			processCampaigns(loadedFiles.file1, loadedFiles.file2)
			break;

		case 'smileyOps':
			try {
				loadedFiles =[ 
					file1 = document.getElementById('smileyOpsFile').files[0]				
					]
				console.log('smile file', loadedFiles)
				if (!loadedFiles) {
					throw new Error('smile file missing')
				}
			} catch (error) {
				console.error('לא שכחנו משהו?', error)
				return
			}
			processSmiley()
			break;

		case 'endPromos':

			try {
				console.log('endPromos')
				loadedFiles = [
					file1 = document.getElementById('r389File').files[0],
					file2 = document.getElementById('indexFile').files[0],
					file3 = document.getElementById('codesFile').files[0]
				]

				if (!loadedFiles[0] && !loadedFiles[1] && !loadedFiles[2]) {
					throw new Error('Please select files')
				}
				if (!loadedFiles[0]) {
					throw new Error('You forget the r389 file!')
				}
				if (!loadedFiles[1]) {
					throw new Error('You forget the index file!')
				}
				if (!loadedFiles[2]) {
					throw new Error('You forget the codes file!')
				}
			} catch (error) {
				console.error('Error:', error);
				return;
			}
			processEndPromos(loadedFiles)
			break;
		default:
			console.log('Invalid process')
			break;
	}
}


const foxDreams = document.querySelector('.fox-dreams');

const backgroundImages = [
	'imgs/foxDreams1.jpeg',
	'imgs/foxDreams2.jpeg',
	'imgs/foxDreams3.jpeg',
	// Add more image URLs as needed
];

// function setRandomBackground() {
//	const randomIndex = Math.floor(Math.random() * backgroundImages.length);
//	const randomImage = backgroundImages[randomIndex];
//	foxDreams.style.backgroundImage = url(${randomImage});
// }

// setRandomBackground();


const today = new Date();
const day = today.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6
if (day === 0 || day === 4) { // Highlight on Sunday and Thursday
	const hotnetOperation = document.getElementById('hotnet-operation');
	hotnetOperation.classList.add('highlight-green');
}

const date = today.getDate();

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
  // Example usage: removeHighlight('hotnet-operation');


// Register the function as the form submit event handler
// const countdownForm = document.getElementById('countdownForm');
// countdownForm.addEventListener('submit', applySchedule);

//const backgroundImages = [
//	'imgs/foxDreams1.jpeg',
//	'imgs/foxDreams2.jpeg',
//	'imgs/foxDreams3.jpeg',
	// Add more image URLs as needed
//];

//function setRandomBackground() {
//	const randomIndex = Math.floor(Math.random() * backgroundImages.length);
//	const randomImage = backgroundImages[randomIndex];
//	foxDreams.style.backgroundImage = url(${randomImage});
//}

//setRandomBackground();
