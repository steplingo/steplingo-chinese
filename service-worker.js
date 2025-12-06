// =========================
// Steplingo - Disable SW
// 全機能を停止して常に最新のファイルを読む
// =========================

// install 時：即座にこの SW を適用
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// activate 時：全クライアントに即反映
self.addEventListener("activate", (event) => {
  self.clients.claim();
});

// fetch 時：キャッシュを一切使わず、常にネットワークから取得
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
