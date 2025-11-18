// cn/app.js

// 中国語アプリ用の PRO フラグキー
const PRO_KEY = "steplingo_pro_chinese";

function isProUser() {
  return localStorage.getItem(PRO_KEY) === "true" || localStorage.getItem(PRO_KEY) === "1";
}

// ページ読み込み時に状態を確認
document.addEventListener("DOMContentLoaded", () => {
  const pro = isProUser();

  console.log("[Steplingo] Chinese PRO status:", pro ? "PRO ユーザー" : "通常ユーザー");

  // ここに「ロック解除」「バッジ表示」などを今後追加していきます
  // 例：
  // if (pro) {
  //   document.body.classList.add("is-pro-user");
  // } else {
  //   document.body.classList.remove("is-pro-user");
  // }
});
/* ====== PRO フラグ読み込み ====== */
window.SteplingoPro = localStorage.getItem("steplingo_pro") === "true";

/* ====== ステップ解放チェック関数（必要なら他でも使える） ====== */
window.isStepUnlocked = function(stepId) {
    const FREE_STEPS = ["0-1","0-2","0-3","1","2","3"];
    if (FREE_STEPS.includes(stepId)) return true;
    return window.SteplingoPro;
};
