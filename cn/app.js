// cn/app.js
const userHasPro =
  localStorage.getItem("userHasPro") === "true" ||
  localStorage.getItem("steplingo_pro") === "true" ||
  localStorage.getItem("steplingo_pro_chinese") === "true";

// 中国語アプリ用の PRO フラグキー
const PRO_KEY = "steplingo_pro_chinese";

// ===== Stripe 決済URL =====
const STRIPE_URL_TEST = "https://buy.stripe.com/test_9B6dR83007ep8eG3R6bQY01";
const STRIPE_URL_PROD = "https://buy.stripe.com/7sYaEW1VJfgA6LF9bPcZa00";  // 本番リンク

// ★ここだけ true/false を手で切り替える（開発者用）
const USE_TEST_STRIPE = true;   // テスト中
// const USE_TEST_STRIPE = false; // 本番運用するとき

const STRIPE_URL = USE_TEST_STRIPE ? STRIPE_URL_TEST : STRIPE_URL_PROD;

function isProUser() {
  return localStorage.getItem(PRO_KEY) === "true" || localStorage.getItem(PRO_KEY) === "1";
}

// ページ読み込み時に状態を確認
document.addEventListener("DOMContentLoaded", () => {
  // === Stripe 購入後の処理 ===
  const params = new URLSearchParams(window.location.search);
  if (params.get("pro") === "1") {
    localStorage.setItem(PRO_KEY, "true");
    window.location.href = "/cn/#home";
  }
  const pro = isProUser();

  console.log("[Steplingo] Chinese PRO status:", pro ? "PRO ユーザー" : "通常ユーザー");
// FREE / PRO ロック処理
document.querySelectorAll("[data-pro]").forEach(btn => {
  const requirePro = btn.getAttribute("data-pro") === "true";

  // 無料ステップ
  if (!requirePro) return;

  // 無料ユーザーはロック
  if (!userHasPro) {
    btn.classList.add("locked");  // CSSのグレー化用（あとで追加可）
    btn.addEventListener("click", () => {
     btn.addEventListener("click", () => {
  window.location.href = STRIPE_URL;

});
 
      // → 後で Stripe Payment Link に直リンク or pricing ページで誘導
    });
  }
});

  // ここに「ロック解除」「バッジ表示」などを今後追加していきます
  // 例：
  // if (pro) {
  //   document.body.classList.add("is-pro-user");
  // } else {
  //   document.body.classList.remove("is-pro-user");
  // }
});
/* ====== PRO フラグ読み込み ====== */
window.SteplingoPro = isProUser();

/* ====== ステップ解放チェック関数（必要なら他でも使える） ====== */
window.isStepUnlocked = function(stepId) {
    const FREE_STEPS = ["0-1","0-2","0-3","1","2","3"];
    if (FREE_STEPS.includes(stepId)) return true;
    return window.SteplingoPro;
};
