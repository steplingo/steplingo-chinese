// ==== Cache versioning ====
const CACHE_VERSION = 'v5';                 // ← 変更時は v5, v6…と上げる
const CACHE_NAME    = `steplingo-${CACHE_VERSION}`;
const CORE = [
  '/',                 // Cloudflare 側のルート。必要に応じて外してもOK
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// install: コア資産をキャッシュしてすぐ waiting に
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

// activate: 古いキャッシュの掃除 & すぐ全タブに適用
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

// fetch: 同一オリジンのみを対象に stale-while-revalidate で配信
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // 同一オリジンのみ

  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(resp => {
        // GET のみキャッシュ更新
        if (e.request.method === 'GET') {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, respClone));
        }
        return resp;
      });

      // キャッシュがあれば即返し、裏で更新（stale-while-revalidate）
      return cached || fetchPromise;
    }).catch(() => caches.match('/index.html'))
  );
});
