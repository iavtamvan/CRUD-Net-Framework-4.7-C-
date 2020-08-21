//library workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js');

// checking workbox
if (workbox) {
    console.log(`Workbox berhasil dimuat`);
}
else {
    console.log(`Workbox gagal dimuat`);
}

//Install stage sets up the index page (home page) in the cache and opens a new cache
self.addEventListener('install', function (event) {
    var indexPage = new Request('');
    event.waitUntil(
        fetch(indexPage).then(function (response) {
            return caches.open('MyApp-offline').then(function (cache) {
                console.log('[MyApp] Cached index page during Install' + response.url);
                return cache.put(indexPage, response);
            });
        }));
});

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function (event) {
    var updateCache = function (request) {
        return caches.open('MyApp-offline').then(function (cache) {
            return fetch(request).then(function (response) {
                console.log('[MyApp] add page to offline' + response.url)
                return cache.put(request, response);
            });
        });
    };

    event.waitUntil(updateCache(event.request));

    event.respondWith(
        fetch(event.request).catch(function (error) {
            console.log('[MyApp] Network request Failed. Serving content from cache: ' + error);

            //Check to see if you have it in the cache
            //Return response
            //If not in the cache, then return error page
            return caches.open('MyApp-offline').then(function (cache) {
                return cache.match(event.request).then(function (matching) {
                    var report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
                    return report
                });
            });
        })
    );
})

// push notification settings
// push notification mannuals
self.addEventListener('notificationclick', function (event) {
    // untuk close notif saat di sentuh
    event.notification.close();
    if (!event.action) {
        // Penguna menyentuh area notifikasi diluar action
        console.log('Notification Click.');
        return;
    }
    switch (event.action) {
        case 'yes-action':
            console.log('Pengguna memilih action yes.');
            // buka tab baru
            clients.openWindow('https://google.com');
            break;
        case 'no-action':
            console.log('Pengguna memilih action no');
            clients.openWindow('https://www.dicoding.com/');
            break;
        default:
            console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
            break;
    }
});

// push notification fcm
self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'img/notification.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification Service Worker', options)
    );
});