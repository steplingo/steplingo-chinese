// ===== PRO フラグキー（中国語専用）=====
const PRO_KEY = "steplingo_pro_chinese";

// ===== Stripe 決済URL =====
const STRIPE_URL_TEST = "https://buy.stripe.com/test_9B6dR83007ep8eG3R6bQY01";
const STRIPE_URL_PROD = "https://buy.stripe.com/7sYaEW1VJfgA6lF9bPcZa00";

// ★開発者用スイッチ
const USE_TEST_STRIPE = false;

const STRIPE_URL = USE_TEST_STRIPE ? STRIPE_URL_TEST : STRIPE_URL_PROD;

// ===== 共通 =====
function getProFlag() {
  try {
    return localStorage.getItem(PRO_KEY) === "true";
  } catch (_) {
    return false;
  }
}

function setProFlag(value) {
  try {
    if (value) {
      localStorage.setItem(PRO_KEY, "true");
    } else {
      localStorage.removeItem(PRO_KEY);
    }
  } catch (_) {}
}

function isProStepCard(card) {
  return card?.getAttribute("data-pro") === "true";
}

function getPaywallElements() {
  return {
    backdrop: document.getElementById("paywallBackdrop"),
    buyNowBtn: document.getElementById("buyNowBtn"),
  };
}

function openPaywall() {
  const { backdrop, buyNowBtn } = getPaywallElements();

  if (buyNowBtn) {
    buyNowBtn.setAttribute("href", STRIPE_URL);
  }

  if (backdrop) {
    backdrop.hidden = false;
    backdrop.style.display = "flex";
  } else {
    window.location.href = STRIPE_URL;
  }
}

function closePaywall() {
  const { backdrop } = getPaywallElements();
  if (backdrop) {
    backdrop.hidden = true;
    backdrop.style.display = "none";
  }
}

function bindPaywall() {
  const { backdrop, buyNowBtn } = getPaywallElements();

  if (buyNowBtn && !buyNowBtn.dataset.bound) {
    buyNowBtn.dataset.bound = "true";
    buyNowBtn.setAttribute("href", STRIPE_URL);
    buyNowBtn.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = STRIPE_URL;
    });
  }

  if (backdrop && !backdrop.dataset.bound) {
    backdrop.dataset.bound = "true";
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) {
        closePaywall();
      }
    });
  }
}

function applyStepLocks() {
  const pro = getProFlag();

  document.querySelectorAll(".step-btn[data-pro]").forEach((card) => {
    const requirePro = isProStepCard(card);
    const goLink = card.querySelector("[data-go-step]");

    if (!requirePro) {
      card.classList.remove("locked");
      return;
    }

    if (pro) {
      card.classList.remove("locked");
      if (goLink) {
        goLink.removeAttribute("aria-disabled");
      }
      return;
    }

    card.classList.add("locked");

    if (goLink && !goLink.dataset.boundLock) {
      goLink.dataset.boundLock = "true";
      goLink.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openPaywall();
      });
    }

    if (!card.dataset.boundLockCard) {
      card.dataset.boundLockCard = "true";
      card.addEventListener("click", (event) => {
        const clickedGo = event.target.closest("[data-go-step]");
        if (clickedGo) return;
        event.preventDefault();
        openPaywall();
      });
    }
  });
}

function guardLessonRoute() {
  const body = document.body;
  if (!body) return;

  const isLessonRoute =
    body.classList.contains("route-lesson") ||
    window.location.hash === "#lesson";

  if (!isLessonRoute) return;

  const lessonSel = document.getElementById("lessonSel");
  if (!lessonSel) return;

  const currentIndex = Number(lessonSel.value || 0);

  // 中国語版の無料範囲：step index 0〜5
  const isFreeLesson = currentIndex <= 5;
  const hasPro = getProFlag();

  if (isFreeLesson || hasPro) return;

  closePaywall();
  window.location.replace("/cn/#steps");
}

function syncProState() {
  window.SteplingoPro = getProFlag();
}

function runAllGuards() {
  syncProState();
  bindPaywall();
  applyStepLocks();
  guardLessonRoute();
}

// ===== 起動時 =====
document.addEventListener("DOMContentLoaded", () => {
  runAllGuards();
});

// ===== 戻る復元対策 =====
window.addEventListener("pageshow", () => {
  runAllGuards();
});

// ===== 外部から使うAPI =====
window.isStepUnlocked = function (stepId) {
  const FREE_STEPS = ["0-1", "0-2", "0-3", "1", "2", "3"];
  if (FREE_STEPS.includes(stepId)) return true;
  return getProFlag();
};

window.SteplingoSetPro = setProFlag;
window.SteplingoGetPro = getProFlag;
window.SteplingoRefreshGuards = runAllGuards;