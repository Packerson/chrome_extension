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


const performOnStartValidation = () => {
  // Validate the form
  if (!locationIdElement.value) {
    showElement(locationError)
  } else {
    hideElement(locationError)
  }

  if (!startDateElement.value) {
    showElement(startDateError)
  } else {
    hideElement(startDateError)
  }

  if (!endDateElement.value) {
    showElement(endDateError)
  } else {
    hideElement(endDateError)
  }

  return locationIdElement.value && startDateElement.value && endDateElement.value;
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
