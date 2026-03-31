self.addEventListener('push', function(event) {
  let data = { 
    title: 'Nueva Alerta', 
    body: 'Tienes una nueva notificación en el panel.', 
    url: '/admin' 
  };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/vite.svg', // Idealmente el logo de la empresa
    badge: '/vite.svg',
    data: data.url,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Si ya hay una ventana abierta con esa URL, la enfocamos
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        if (client.url.includes(event.notification.data) && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrimos una nueva ventana
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data);
      }
    })
  );
});
