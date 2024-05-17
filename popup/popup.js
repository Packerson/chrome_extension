// ELEMENTS
const locationIdElement = document.getElementById('locationId');
const startDateElement = document.getElementById('startDate');
const endDateElement = document.getElementById('endDate');

// Buttons elements
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById('stopButton');

startButton.onclick = () => {
  const prefs = {
    locationId: locationIdElement.value,
    startDate: startDateElement.value,
    endDate: endDateElement.value,
    tzData: locationIdElement.options[locationIdElement.selectedIndex].getAttribute('data-tz')
  };
  // Send the message to the background.js
  chrome.runtime.sendMessage({
    event: 'onStart', prefs
  });
}

stopButton.onclick = function() {
  chrome.runtime.sendMessage({
    event: 'onStop'
  });
}

// Get the values from the storage
chrome.storage.local.get(['locationId', 'startDate', 'endDate', 'locations', 'isRunning' ], (result) => {
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

  console.log('isRunning:', isRunning);
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

