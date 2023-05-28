function startWorktimeCounter() {
  var hoursInput = document.getElementById("hours");
  var minutesInput = document.getElementById("minutes");
  var secondsInput = document.getElementById("seconds");
  var countdownElement = document.getElementById("countdown");

  var hours = parseInt(hoursInput.value) || 0;
  var minutes = parseInt(minutesInput.value) || 0;
  var seconds = parseInt(secondsInput.value) || 0;

  // Calculate the total time in seconds
  var totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;

  // Calculate the target time in seconds (8 hours and 36 minutes)
  var targetTimeInSeconds = (8 * 3600) + (36 * 60);

  var remainingTimeInSeconds = targetTimeInSeconds - totalTimeInSeconds;

  // Display the countdown
  countdownElement.textContent = formatTime(remainingTimeInSeconds);

  // Update the countdown every second
  var countdownInterval = setInterval(function() {
    remainingTimeInSeconds--;

    if (remainingTimeInSeconds < 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = "Time is up!";
    } else {
      countdownElement.textContent = formatTime(remainingTimeInSeconds);
    }
  }, 1000);
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
