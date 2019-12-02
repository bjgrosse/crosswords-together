
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '847675267519'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

console.log("initializing messaging sw")
messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "https://crosswordstogether.com/logo192.png",
    badge: "/badge-72.png",
    timestamp: payload.data.timestamp,
    tag: payload.data.activityId,
    data: payload.data
  };


  return registration.getNotifications().then(function (notifications) {
    for (item of notifications) {

      if (item.title === notificationTitle) {
        notificationOptions.body = notificationOptions.body + ",\n" + item.body
        item.close()
      }
    }

    return self.registration.showNotification(notificationTitle,
      notificationOptions);
  })




});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  let url = event.notification.data.puzzleId ? '/puzzle/' + event.notification.data.puzzleId : "/"
  event.waitUntil(

    clients.matchAll().then(matchedClients => {
      for (let client of matchedClients) {
        if (client.url === url) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

