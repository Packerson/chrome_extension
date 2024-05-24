// ELEMENTS
const locationIdElement = document.getElementById('locationId');
const startDateElement = document.getElementById('startDate');
const endDateElement = document.getElementById('endDate');

// Buttons elements
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById('stopButton');

const runningSpan = document.getElementById('runningSpan');
const stoppedSpan = document.getElementById('stoppedSpan');

// Error elements
const locationError = document.getElementById('locationIdError');
const startDateError = document.getElementById('startDateError');
const endDateError = document.getElementById('endDateError');


const hideElement = (element) => {
  element.style.display = 'none';
}

const showElement = (element) => {
  element.style.display = '';
}

const enableElement = (button) => {
  button.disabled = false;
}

const disbleElement = (button) => {
  button.disabled = true;
}

const handleOnStartState = () => {
  // spans
  showElement(runningSpan);
  hideElement(stoppedSpan);
  // buttons
  enableElement(stopButton);
  disbleElement(startButton);
  // inputs
  disbleElement(locationIdElement);
  disbleElement(startDateElement);
  disbleElement(endDateElement);
}

const handleOnStopState = () => {
  // spans
  showElement(stoppedSpan);
  hideElement(runningSpan);
  // buttons
  enableElement(startButton);
  disbleElement(stopButton);
  // inputs
  enableElement(locationIdElement);
  enableElement(startDateElement);
  enableElement(endDateElement);
}


const showDateError = (dateErrorElement, errorMessage) => {
  dateErrorElement.innerHTML = errorMessage;
  showElement(dateErrorElement);
}


const validateStartDate = (today, startDate) => {
  const isAfterToday = startDate.isAfter(today, 'date');

  if (!startDateElement.value) {
    showDateError(startDateError, 'Please enter a start date')
  } else if (!isAfterToday) {
    showDateError(startDateError, 'Start date must be after today')
  } else {
    hideElement(startDateError)
  }

  return startDateElement.value && isAfterToday;
}

const validateEndDate = (today, startDate, endDate) => {
  const isAfterStartDate = endDate.isAfter(startDate, 'date');
  const isAfterToday = endDate.isAfter(today, 'date');

  if (!endDateElement.value) {
    showDateError(endDateError, 'Please enter an end date')
  } else if (!isAfterStartDate) {
    showDateError(endDateError, 'End date must be after start date')
  } else if (!isAfterToday) {
    showDateError(endDateError, 'End date must be after today')
  } else {
    hideElement(endDateError)
  }

  return endDateElement.value && isAfterStartDate && isAfterToday;

}


const validateDate = () => {
  // today <= startDate < endDate
  const today = spacetime.now().startOf('day');
  const startDate = spacetime(startDateElement.value).startOf('day');
  const endDate = spacetime(endDateElement.value).startOf('day');

  const isStartDateValid = validateStartDate(today, startDate);
  const isEndDateValid = validateEndDate(today, startDate, endDate);

  return isStartDateValid && isEndDateValid;
};


const performOnStartValidation = () => {
  const isDateValid = validateDate();

  // Validate the form
  if (!locationIdElement.value) {
    showElement(locationError)
  } else {
    hideElement(locationError)
  }

  return locationIdElement.value && isDateValid
}

startButton.onclick = () => {
  const allFieldsValied = performOnStartValidation();
  if (!allFieldsValied) {
    return;
  }

  handleOnStartState();
  const prefs = {
    locationId: locationIdElement.value,
    startDate: startDateElement.value,
    endDate: endDateElement.value,
    tzData: locationIdElement.options[
      locationIdElement.selectedIndex
    ].getAttribute('data-tz')
  };
  // Send the message to the background.js
  chrome.runtime.sendMessage({
    event: 'onStart', prefs
  });
}

stopButton.onclick = function() {
  handleOnStopState();
  chrome.runtime.sendMessage({
    event: 'onStop'
  });
}

// Get the values from the storage
chrome.storage.local.get(
  ['locationId', 'startDate', 'endDate', 'locations', 'isRunning' ],
  (result) => {
    const { locationId, startDate, endDate, locations, isRunning } = result;

    setLocations(locations);

    if (locationId) {
      locationIdElement.value = locationId;
    }
    if (startDate) {
      startDateElement.value = startDate;
    }
    if (endDate) {
      endDateElement.value = endDate;
    }

    if (isRunning) {
      handleOnStartState()
    } else {
      handleOnStopState()
    }
});


// {
//   'id': 'number',
//   'name': 'string',
//   'shortName': 'string',
//   'tzData': 'string',
// }

const setLocations = (locations) => {
  locations.forEach(loc => {
    const option = document.createElement('option');
    option.value = loc.id;
    option.innerHTML = loc.name;
    option.setAttribute('data-tz', loc.tzData);
    locationIdElement.appendChild(option);
  })
};


const today = spacetime.now().startOf('day').format();
startDateElement.setAttribute('min', today);
endDateElement.setAttribute('min', today);

// https://github.com/nfzohar/chrome-extension-with-modal/blob/main/res/content/html/index.html