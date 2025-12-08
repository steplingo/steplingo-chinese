// ===== PRO フラグキー =====
const PRO_KEY = "steplingo_pro_chinese";


// ===== Stripe 決済URL =====
const STRIPE_URL_TEST = "https://buy.stripe.com/test_9B6dR83007ep8eG3R6bQY01";
const STRIPE_URL_PROD = "https://buy.stripe.com/7sYaEW1VJfgA6lF9bPcZa00";  // 本番

// ★開発者用スイッチ
const USE_TEST_STRIPE = true;  // ← テスト中は true
// const USE_TEST_STRIPE = false; // 本番にする時

const STRIPE_URL = USE_TEST_STRIPE ? STRIPE_URL_TEST : STRIPE_URL_PROD;


// ====== PRO 判定 ======
function isProUser() {
  return localStorage.getItem(PRO_KEY) === "true";
}


// ====== DOM 読み込み ======
document.addEventListener("DOMContentLoaded", () => {

  // === Stripe 購入後（success.html→戻って来た時） ===
  const params = new URLSearchParams(window.location.search);
  if (params.get("pro") === "1") {
    localStorage.setItem(PRO_KEY, "true");
    window.location.replace("/cn/#home");
    return;
  }

  const pro = isProUser();
  console.log("[Steplingo] PRO:", pro);

  // === ロック処理（PRO ではない場合のみ） ===
  document.querySelectorAll("[data-pro]").forEach(btn => {
    const requirePro = btn.getAttribute("data-pro") === "true";

    if (!requirePro) return; // 無料ステップ

    if (!pro) {
      btn.classList.add("locked");
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.href = STRIPE_URL;
      });
    }
  });


  // === Paywall モーダル（purchase ボタン） ===
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = STRIPE_URL;
    });
  }
});


// ====== 全体で使う PRO API ======
window.SteplingoPro = isProUser();


// ====== ステップ解放チェック関数 ======
window.isStepUnlocked = function(stepId) {
  const FREE_STEPS = ["0-1", "0-2", "0-3", "1", "2", "3"];
  if (FREE_STEPS.includes(stepId)) return true;
  return window.SteplingoPro;
};
