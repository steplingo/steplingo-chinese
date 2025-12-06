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


// ====== DOM 読み込み後にロック処理を適用 ======
document.addEventListener("DOMContentLoaded", () => {

  // --- Stripe 購入後（success.html → /cn/?pro=1 で戻って来た時） ---
  try {
    const url = new URL(window.location.href);
    const proParam = url.searchParams.get("pro");
    if (proParam === "1") {
      // PRO フラグを保存
      localStorage.setItem(PRO_KEY, "true");

      // URL から ?pro=1 を消して #home へ
      url.searchParams.delete("pro");
      url.hash = "#home";
      window.location.replace(url.toString());
      return;
    }
  } catch (_) {
    // 何かあってもアプリ本体は動くようにしておく
  }

  const pro = isProUser();
  console.log("[Steplingo] PRO:", pro);

  // --- FREE ステップ（index.html の data-go-step と一致） ---
  // Step0-1 → 0, Step0-2 → 1, Step0-3 → 2, Step1 → 3, Step2 → 4, Step3 → 5
  const FREE_STEP_CODES = ["0", "1", "2", "3", "4", "5"];

  // --- Step 一覧のボタンにロックを適用 ---
  document.querySelectorAll("[data-go-step]").forEach((btn) => {
    const stepCode = btn.getAttribute("data-go-step");
    const isFree = FREE_STEP_CODES.includes(stepCode);
    const card = btn.closest(".card");

    // 一旦きれいに
    btn.classList.remove("locked");
    if (card) card.classList.remove("locked");

    // 未購入 & PRO ステップ → ロック
    if (!isFree && !pro) {
      btn.classList.add("locked");
      if (card) card.classList.add("locked");  // PRO バッジ用

      btn.addEventListener(
        "click",
        (ev) => {
          ev.preventDefault();
          // Stripe へ遷移
          window.location.href = STRIPE_URL;
        },
        { once: true }
      );
    }
  });

  // --- CTA セクションの「購入ボタン」 ---
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      window.location.href = STRIPE_URL;
    });
  }
});


// ====== 全体で使う PRO API ======
window.SteplingoPro = isProUser();


// ====== ステップ解放チェック関数（将来用） ======
window.isStepUnlocked = function (stepId) {
  // 論理ステップID → data-go-step の対応
  const MAP = {
    "0-1": "0",
    "0-2": "1",
    "0-3": "2",
    "1": "3",
    "2": "4",
    "3": "5",
  };

  const FREE_STEP_CODES = ["0", "1", "2", "3", "4", "5"];

  const code = MAP[stepId] ?? String(stepId);
  if (FREE_STEP_CODES.includes(code)) return true;

  return window.SteplingoPro;
};
