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

const ALARM_JOB_NAME = 'GlobalEntryAlarm';
let cachedPrefs = {};


// fetchLocations() is called when the extension is installed
chrome.runtime.onInstalled.addListener(details => {
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


const handleOnStop = () => {
  setRunningStatus(false);
  stopAlarm();
  cachedPrefs = {};
  console.log('onStop');
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
      chrome.alarms.create(
        ALARM_JOB_NAME, { periodInMinutes: 0.5 }
      )
    }
  })
};


const stopAlarm = () => {
  chrome.alarms.clearAll();
  console.log('Alarm stopped');
}


chrome.alarms.onAlarm.addListener(() => {
  fetchOpenSlots(cachedPrefs);
  console.log('onAlarm...');
});
