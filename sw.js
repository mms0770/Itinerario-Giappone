// Service worker minimo: serve a rendere l'app installabile (Android) e a ricevere la condivisione.
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) { /* nessuna cache: i dati restano sempre aggiornati */ });
