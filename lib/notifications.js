export const handleNotification = (activeApointments) => {
  if (activeApointments.length > 0) {
    createNotification(activeApointments[0]);
  }
};

const createNotification = (activeApointment) => {
  chrome.notifications.create({
    title: 'Open Interview Slots Available',
    message: `Found an open interview at ${activeApointment.timestamp}`,
    iconUrl: 'images/ur_48.png',
    type: 'basic'
  })
};