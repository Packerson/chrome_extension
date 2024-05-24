export const createNotification = (openSlot, numberOfSlots, prefs) => {
  const { tzData } = prefs;

  let message = `Found an open interview at ${openSlot.timestamp} (${tzData}) timezone`
  if (numberOfSlots > 1) {
    message = `${message} nad ${numberOfSlots - 1} additional slots`;
  }


  chrome.notifications.create({
    title: 'Open Interview Slots Available',
    message,
    iconUrl: 'images/ur_48.png',
    type: 'basic'
  })
};


