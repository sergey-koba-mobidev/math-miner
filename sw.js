const CACHE_NAME = 'math-miner-cache-v1';
// This list includes all the essential files that make up your app's "shell".
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/services/mathService.ts',
  '/components/TopBar.tsx',
  '/components/Mine.tsx',
  '/components/MathModal.tsx',
  '/components/ShopModal.tsx',
  '/components/BestiaryModal.tsx',
  '/components/CharacterDisplay.tsx',
  '/components/Tile.tsx',
  '/data/equipment.ts',
  '/data/mobs.ts',
  '/data/mobSprites.ts',
  'https://cdn.tailwindcss.com/',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/'
];

// Install event: opens a cache and adds the app shell files to it.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: intercepts network requests and serves them from the cache if available.
// This is what enables offline functionality.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If we find a match in the cache, return it.
        if (response) {
          return response;
        }
        // Otherwise, fetch from the network.
        return fetch(event.request);
      }
    )
  );
});
