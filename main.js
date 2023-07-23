
function handleGoBtnClick(processName, event) {
	event.preventDefault()
	let file1, file2
	console.log('process: ', processName, 'were called')
	switch (processName) {
		case 'countdownForm':
			applyCountDown()
			break;
		case 'campaigns':
			try {
				file1 =  document.getElementById('connectionsFile').files[0]
				file2 =  document.getElementById('campaignsFile').files[0]
				if (!file1 && !file2) {
					throw new Error('Please select Both Files')
				} else if (!file1) {
					throw new Error('You forget the connections file!')
				} else if (!file2) {
					throw new Error('You forget the campaign file!')
				}
			} catch (error) {
				console.error('לא שכחנו משהו?', error)
				return
			}
			break;


		case 'smileyOps':
			try {
				file1 =  document.getElementById('smileyOpsFile').files[0]
				console.log('smile file', file1)
				if (!file1) {
					throw new Error('smile file missing')
				}
			} catch (error) {
				console.error('לא שכחנו משהו?', error)
				return
			}
			processSmiley()
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

function setRandomBackground() {
  const randomIndex = Math.floor(Math.random() * backgroundImages.length);
  const randomImage = backgroundImages[randomIndex];
  foxDreams.style.backgroundImage = `url(${randomImage})`;
}

setRandomBackground();


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
