const CACHE_PREFIX = `big-trip-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(caches.open(CACHE_NAME)
    .then((cache) => {
      return cache.addAll([
        `/`,
        `/index.html`,
        `/bundle.js`,
        `/css/style.css`,
        `/fonts/montserrat-v14-cyrillic_latin-500.woff`,
        `/fonts/montserrat-v14-cyrillic_latin-500.woff2`,
        `/fonts/montserrat-v14-cyrillic_latin-600.woff`,
        `/fonts/montserrat-v14-cyrillic_latin-600.woff2`,
        `/fonts/montserrat-v14-cyrillic_latin-700.woff`,
        `/fonts/montserrat-v14-cyrillic_latin-700.woff2`,
        `/fonts/montserrat-v14-cyrillic_latin-800.woff`,
        `/fonts/montserrat-v14-cyrillic_latin-800.woff2`,
        `/fonts/montserrat-v14-cyrillic_latin-regular.woff`,
        `/fonts/montserrat-v14-cyrillic_latin-regular.woff2`,
        `/img/icons/bus.png`,
        `/img/icons/check-in.png`,
        `/img/icons/drive.png`,
        `/img/icons/flight.png`,
        `/img/icons/restaurant.png`,
        `/img/icons/ship.png`,
        `/img/icons/sightseeing.png`,
        `/img/icons/taxi.png`,
        `/img/icons/train.png`,
        `/img/icons/transport.png`,
        `/img/icons/trip.png`,
        `/img/header-bg.png`,
        `/img/header-bg@2x.png`,
        `/img/logo.png`,
      ]);
    }))
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys
      .reduce((acc, key) => {
        if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
          acc.push(caches.delete(key));
        }
        return acc;
      }, []))));
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(caches.match(request)
    .then((cacheResponse) => cacheResponse ? cacheResponse : fetch(request)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== `basic`) {
          return response;
        }
        const cloneResponse = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(request, cloneResponse));
        return response;
      })));
});
