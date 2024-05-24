// listen for messages/events from the popup

// let data = {
//   "event": "onStart/onStop",
//   "prefs": {
//     "locationId": "locationId",
//     "startDate": "startDate",
//     "endDate": "endDate"
//   }
// }

import { fetchLocations } from './api/fetchLocations.js';
import { fetchOpenSlots } from './api/fetchOpenSlots.js';
import { createNotification } from './lib/createNotification.js';


const ALARM_JOB_NAME = 'GlobalEntryAlarm';
let cachedPrefs = {};
let firstApptTimeStamp = null;


// fetchLocations() is called when the extension is installed
chrome.runtime.onInstalled.addListener(details => {
  handleOnStop();
  fetchLocations();
});


// Listen for messages from the popup
chrome.runtime.onMessage.addListener(data => {
  const { event, prefs } = data;
  switch (event) {
    case 'onStart':
      handleOnStart(prefs);
      break;
    case 'onStop':
      handleOnStop();
      break;
    default:
      console.log('Unknown event', data.event);
      break
  }
});


// notification click event
chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({
    url: 'https://ttp.cbp.dhs.gov/schedulerapi/locations/9240/slots?startTimestamp=2023-02-11T00%3A00%3A00&endTimestamp=2023-03-22T00%3A00%3A00'}
  );
});


chrome.alarms.onAlarm.addListener(() => {
  console.log('onAlarm...');
  openSlotsJob();
});

const handleOnStop = () => {
  setRunningStatus(false);
  stopAlarm();
  cachedPrefs = {};
  console.log('onStop');
  firstApptTimeStamp = null;
}


// Save the prefs to the storage
const handleOnStart = (prefs) => {
  console.log('onStart:', prefs);
  cachedPrefs = prefs;
  chrome.storage.local.set( prefs );
  setRunningStatus(true);
  createAlarm();
}


const setRunningStatus = (isRunning) => {
  chrome.storage.local.set({ isRunning });
}


const createAlarm = () => {
  chrome.alarms.get(ALARM_JOB_NAME, existingAlarm => {
    if (!existingAlarm) {
      openSlotsJob();
      chrome.alarms.create(
        ALARM_JOB_NAME, { periodInMinutes: 0.5 }
      )
    }
  })
};


const stopAlarm = () => {
  chrome.alarms.clearAll();
  console.log('Alarm stopped');
};


const openSlotsJob = () => {
  fetchOpenSlots(cachedPrefs)
    .then(data => handleOpenSlots(data))
}


const handleOpenSlots = (openSlots) => {
  if (openSlots && openSlots.length > 0 && openSlots[0].timestamp !== firstApptTimeStamp) {
    firstApptTimeStamp = openSlots[0].timestamp;
    createNotification(openSlots[0], openSlots.length, cachedPrefs);
  }
};