var countdownTime = localStorage.getItem('countdownTime');
var timeInput = document.getElementById('time1');
var countdownInterval;

if (countdownTime) {
  timeInput.value = countdownTime;
}

document.getElementById('countdownForm').addEventListener('submit', function(event) {
  event.preventDefault();

  resetTimer();

  countdownTime = timeInput.value;
  localStorage.setItem('countdownTime', countdownTime);

  var currentTime = new Date();
  var targetTime = new Date(currentTime.toDateString() + ' ' + countdownTime);
  targetTime.setHours(targetTime.getHours() + 8);
  targetTime.setMinutes(targetTime.getMinutes() + 36);

  var remainingTimeInSeconds = Math.floor((targetTime.getTime() - currentTime.getTime()) / 1000);
  startWorktimeCounter(remainingTimeInSeconds);
});

document.getElementById('countdownForm').addEventListener('reset', function(event) {
  event.preventDefault();
  resetTimer();
  localStorage.removeItem('countdownTime');
});

function startWorktimeCounter(remainingTimeInSeconds) {
  var countdownElement = document.getElementById('countdown');
  countdownElement.textContent = formatTime(remainingTimeInSeconds);

  countdownInterval = setInterval(function() {
    remainingTimeInSeconds--;

    if (remainingTimeInSeconds < 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = "Time is up!";
      showPopup();
    } else {
      countdownElement.textContent = formatTime(remainingTimeInSeconds);
      applyBlinkColor(remainingTimeInSeconds);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(countdownInterval);
  var countdownElement = document.getElementById('countdown');
  countdownElement.textContent = '';
  removeBlinkColor();
}

function formatTime(timeInSeconds) {
  var hours = Math.floor(timeInSeconds / 3600);
  var minutes = Math.floor((timeInSeconds % 3600) / 60);
  var seconds = timeInSeconds % 60;

  return padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);
}

function padZero(number) {
  return number.toString().padStart(2, "0");
}

function applyBlinkColor(remainingTimeInSeconds) {
  var countdownElement = document.getElementById('countdown');
  var timerRow = countdownElement.parentElement;
  
  if (remainingTimeInSeconds <= 0) {
    timerRow.classList.remove('warning');
  } else if (remainingTimeInSeconds <= 1800 && remainingTimeInSeconds % 2 === 0) {
    timerRow.classList.remove('warning');
    timerRow.classList.add('work-timer');
  } else if (remainingTimeInSeconds <= 3600 && remainingTimeInSeconds % 2 === 0) {
    timerRow.classList.remove('work-timer');
    timerRow.classList.add('warning');
  } else {
    timerRow.classList.remove('work-timer');
    timerRow.classList.remove('warning');
  }
}

function removeBlinkColor() {
  var timerRow = document.querySelector('.work-timer');
  timerRow.classList.remove('work-timer');
  timerRow.classList.remove('warning');
}

function showPopup() {
  // Implement your popup logic here
  alert("Time is up! Go Home!!");
}