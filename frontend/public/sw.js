const CACHE_NAME = 'copperhead-ci-v1';
const urlsToCache = [
  '/',
  '/about',
  '/services',
  '/contact',
  '/assets/67eb2953665127110d87b36c_CCI-Logo1-Or-White-Horizontal.png',
  '/assets/67eec2d5a5a87300d777cd9f_CCI-Favicon.png',
  // Add other critical assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});