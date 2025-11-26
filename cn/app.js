// cn/app.js
const userHasPro =
  localStorage.getItem("userHasPro") === "true" ||
  localStorage.getItem("steplingo_pro") === "true" ||
  localStorage.getItem("steplingo_pro_chinese") === "true";

// 中国語アプリ用の PRO フラグキー
const PRO_KEY = "steplingo_pro_chinese";

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
  // === Paywall モーダルのボタン処理 ===
const buyNowBtn = document.getElementById("buyNowBtn");
const closePaywallBtn = document.getElementById("closePaywallBtn");

if (buyNowBtn) {
  buyNowBtn.addEventListener("click", () => {
    window.location.href = "https://buy.stripe.com/7sYaEW1VJfgA6LF9bPcZa00";
  });
}

if (closePaywallBtn) {
  closePaywallBtn.addEventListener("click", () => {
    document.getElementById("paywallModal").classList.remove("show");
  });
}

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
  window.location.href = "https://buy.stripe.com/7sYaEW1VJfgA6LF9bPcZa00";
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
    const FREE_STEPS = ["0","1","2","3","4","5"];
    if (FREE_STEPS.includes(stepId)) return true;
    return window.SteplingoPro;
};
