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
  try {
    return localStorage.getItem(PRO_KEY) === "true";
  } catch (e) {
    console.error("[Steplingo] Failed to read PRO flag:", e);
    return false;
  }
}


// ====== DOM 読み込み ======
document.addEventListener("DOMContentLoaded", () => {
  // （オプション）?pro=1 で戻してくる古い動線にも一応対応しておく
  const params = new URLSearchParams(window.location.search);
  if (params.get("pro") === "1") {
    try {
      localStorage.setItem(PRO_KEY, "true");
    } catch (e) {
      console.error("[Steplingo] Failed to set PRO flag from ?pro=1:", e);
    }
    window.location.replace("/cn/#home");
    return;
  }

  const pro = isProUser();
  window.SteplingoPro = pro;
  console.log("[Steplingo] PRO:", pro);

  // === ステップカードのロック見た目処理 ===
  document.querySelectorAll("[data-pro]").forEach(card => {
    const requirePro = card.getAttribute("data-pro") === "true";

    // 無料ステップ（data-pro="false"）は常にロック解除
    if (!requirePro) {
      card.classList.remove("locked");
      return;
    }

    // PRO が必要なステップ（data-pro="true"）
    if (!pro) {
      // 未購入 → ロック見た目 & クリックでStripeへ
      card.classList.add("locked");

      const target = card.querySelector("[data-go-step]") || card;
      target.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = STRIPE_URL;
      });
    } else {
      // PROユーザー → ロック解除
      card.classList.remove("locked");
    }
  });

  // === （残してOK）「プレミアム版を購入」ボタン ===
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
// ここが「FREEステップ 0〜5」の定義ポイント
window.isStepUnlocked = function(stepId) {
  // ★ FREE ステップは data-go-step の値で表現：
  //   0 → Step0-1
  //   1 → Step0-2
  //   2 → Step0-3
  //   3 → Step1
  //   4 → Step2
  //   5 → Step3
  const FREE_STEPS = ["0", "1", "2", "3", "4", "5"];

  const id = String(stepId);

  // ① 無料ステップなら常に開放
  if (FREE_STEPS.includes(id)) return true;

  // ② PRO 購入済みなら全開放
  return window.SteplingoPro === true;
};
