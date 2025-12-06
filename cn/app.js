// ===== PRO フラグキー =====
const PRO_KEY = "steplingo_pro_chinese";

// ===== Stripe 決済URL =====
const STRIPE_URL_TEST = "https://buy.stripe.com/test_9B6dR83007ep8eG3R6bQY01";
const STRIPE_URL_PROD = "https://buy.stripe.com/7sYaEW1VJfgA6lF9bPcZa00";  // 本番
const USE_TEST_STRIPE = true; // ← テスト中は true
// const USE_TEST_STRIPE = false; // 本番にする時

const STRIPE_URL = USE_TEST_STRIPE ? STRIPE_URL_TEST : STRIPE_URL_PROD;


// ===== PRO 判定 =====
function isProUser() {
  return localStorage.getItem(PRO_KEY) === "true";
}


// ===== DOM 読み込み =====
document.addEventListener("DOMContentLoaded", () => {

  // Stripe success
  const params = new URLSearchParams(window.location.search);
  if (params.get("pro") === "1") {
    localStorage.setItem(PRO_KEY, "true");
    window.location.replace("/cn/#home");
    return;
  }

  const pro = isProUser();
  console.log("[Steplingo] PRO:", pro);

  // FREE ステップ
  const FREE_STEPS = ["0", "1", "2", "3", "4", "5"];
  
  document.querySelectorAll(".step-btn a").forEach(a=>{
  a.addEventListener("click", e=> e.preventDefault());
});


  // === div.step-btn クリックで判定 ===
  document.querySelectorAll(".step-btn[data-go-step]").forEach(card => {
    const stepId = card.getAttribute("data-go-step");
    const isFree = FREE_STEPS.includes(stepId);

    if (!isFree && !pro) {
      // ロック見た目
      card.classList.add("locked");

      // card 全体をクリック禁止→Stripeへ
      card.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = STRIPE_URL;
      });
    }
  });
});


// ===== 全体 API =====
window.SteplingoPro = isProUser();

window.isStepUnlocked = function(stepId) {
  const FREE_STEPS = ["0", "1", "2", "3", "4", "5"];
  return FREE_STEPS.includes(String(stepId)) || window.SteplingoPro;
};
