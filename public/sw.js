const CACHE_NAME = 'offline-cache-v5';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/header.html',
    '/footer.html',
    '/contacts.html',
    '/offline.html',
    '/css/style.css',
    '/css/base.css',
    '/css/layout.css',
    '/css/home.css',
    '/css/contacts.css',
    '/css/pages.css',
    '/css/offline.css',
    '/js/main.js',
    '/js/menu.js',
    '/js/i18n.js',
    '/js/cookie-consent.js',
    '/lang/it.json',
    '/lang/en.json'
];

// 1. INSTALLAZIONE
self.addEventListener('install', (event) => {
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// 2. ATTIVAZIONE
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// 3. FETCH
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
        .then((response) => {
            return response;
        })
        .catch(() => {
            return caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
                
                return null;
            });
        })
    );
});