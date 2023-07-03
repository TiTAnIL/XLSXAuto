
function handleGoBtnClick(processName) {
	let file1, file2
	console.log('process: ', processName, 'were called')
	switch (processName) {
		
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

//function handleGoClick(processType) {
//	const fileInput = document.getElemntById('file-input')
//	const file = fileInput.files[0]
//	handleFileLoad(file, processType)
//	}

// const goButton = docuemnet.getElementById('go-button')
// goButton.addEventListener('click', function() {
//	handleGoButtonClick('