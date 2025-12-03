// ======================================================
//   Steplingo Chinese - app.js（完全安定版）
// ======================================================

// ---- 1. PRO 状態の判定 ----
const PRO_KEY = "steplingo_pro_chinese";

function isProUser() {
  return (
    localStorage.getItem(PRO_KEY) === "true" ||
    localStorage.getItem(PRO_KEY) === "1"
  );
}

// ---- 2. Stripe 決済 URL ----
const STRIPE_URL_TEST = "https://buy.stripe.com/test_9B6dR83007ep8eG3R6bQY01";
const STRIPE_URL_PROD = "https://buy.stripe.com/7sYaEW1VJfgA6LF9bPcZa00";

// ★ この1行だけ切り替える
const USE_TEST_STRIPE = true;   // ← テストモード
// const USE_TEST_STRIPE = false; // ← 本番のとき

// 最終的な決済 URL（TEST / PROD 自動切替）
const STRIPE_URL = USE_TEST_STRIPE ? STRIPE_URL_TEST : STRIPE_URL_PROD;

// 読みやすくするため、一度だけ定義
window.SteplingoPro = isProUser();


// ======================================================
//   ページ読み込み後の処理
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

  // ---- 3. Stripe 購入後の処理 ----
  const params = new URLSearchParams(window.location.search);
  if (params.get("pro") === "1") {
    localStorage.setItem(PRO_KEY, "true");
    window.location.href = "/cn/#home";
    return;
  }

  const pro = isProUser();
  console.log("[Steplingo] Chinese PRO status:", pro ? "PRO ユーザー" : "通常ユーザー");


  // ======================================================
  //   4. FREE / PRO ステップ ロック処理
  // ======================================================
  document.querySelectorAll("[data-pro]").forEach((btn) => {
    const requirePro = btn.dataset.pro === "true";

    // FREE ステップはそのまま
    if (!requirePro) return;

    // PRO が必要 → まだ PRO でない場合はロック
    if (!pro) {
      btn.classList.add("locked");

      // ロックされたステップを押すと Paywall へ
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        // Stripe 決済ページへ
        window.location.href = STRIPE_URL;
      });
    }
  });


  // ======================================================
  //   5. Paywall モーダルの「購入」ボタン
  // ======================================================
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = STRIPE_URL;
    });
  }

  // モーダルを閉じるボタン（必要なら）
  const closePaywallBtn = document.getElementById("closePaywallBtn");
  if (closePaywallBtn) {
    closePaywallBtn.addEventListener("click", () => {
      const modal = document.getElementById("paywallModal");
      if (modal) modal.classList.remove("show");
    });
  }


  // ======================================================
  //   6. PRO の見た目や UI 切替（必要なら）
  // ======================================================
  if (pro) {
    document.body.classList.add("is-pro-user");
  } else {
    document.body.classList.remove("is-pro-user");
  }
});


// ======================================================
//   7. ステップ解放チェック関数
// ======================================================
window.isStepUnlocked = function (stepId) {
  const FREE_STEPS = ["0-1", "0-2", "0-3", "1", "2", "3"];
  if (FREE_STEPS.includes(stepId)) return true;
  return isProUser();
};
