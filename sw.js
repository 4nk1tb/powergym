const CACHE_NAME = "powergym-v2";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "https://4nk1tb.github.io/rutina-cliente1/img/logo.png",
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=SF+Mono&display=swap"
];

// Evento de Instalación: Guarda todos los assets críticos en la caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Instalando y registrando caché estática v2");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de Activación: Limpia cachés antiguas para evitar conflictos de datos obsoletos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Eliminando caché obsoleta:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Evento Fetch: Estrategia diferenciada para máximo rendimiento y actualización instantánea
self.addEventListener("fetch", (event) => {
  // Solo procesar peticiones GET
  if (event.request.method !== "GET") return;

  const url = event.request.url;

  // Si es un recurso mutable de la aplicación (HTML, CSS, JS, manifest o raíz), usar Network-First.
  // Esto garantiza que si el usuario tiene internet, siempre use la última versión con tus cambios,
  // y si está en el gimnasio sin conexión, caiga instantáneamente a la versión de la caché.
  if (
    url.includes("index.html") || 
    url.includes("app.js") || 
    url.includes("styles.css") || 
    url.includes("manifest.json") ||
    url.endsWith("/") ||
    url.endsWith("/proyecto") ||
    url.endsWith("/proyecto/")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Guardar una copia actualizada en la caché para la próxima vez offline
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Si está offline, servir desde la caché
          return caches.match(event.request);
        })
    );
  } else {
    // Para recursos estáticos pesados o externos (logo remoto, fuentes de Google), usar Cache-First.
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(event.request).then((networkResponse) => {
            if (url.includes("fonts.gstatic.com") || url.includes("fonts.googleapis.com") || url.includes("logo.png")) {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          });
        })
    );
  }
});

// Manejar click en la notificación para abrir o enfocar la aplicación
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Si hay una pestaña abierta de PowerGym, enfocarla
        for (const client of clientList) {
          if (client.url && "focus" in client) {
            return client.focus();
          }
        }
        // Si no está abierta, abrirla
        if (clients.openWindow) {
          return clients.openWindow("./");
        }
      })
  );
});
