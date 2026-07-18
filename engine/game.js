import { moveCharacterToNode } from './board.js';
import { fetchAIQuestion } from './questions.js';
import { showText } from './dialogue.js';

export const GameState = {
  currentIndex: 0,
  difficulty: "normal",
  lastTime: 0,
  timerInterval: null,
  mapData: null,
  currentQuestion: null,
  isTransitioning: false 
};

export function initGameLoop(mapData) {
  GameState.mapData = mapData;
  setupEventHandlers();
  loadCurrentLocation();
}

function setupEventHandlers() {
  const langBtn = document.getElementById("lang-toggle-btn");
  if (langBtn) {
    langBtn.onclick = () => { document.body.classList.toggle("alt-lang"); };
  }

  const choiceButtons = document.querySelectorAll(".choice-btn");
  choiceButtons.forEach(btn => {
    btn.onclick = (e) => {
      if (GameState.isTransitioning) return; 
      const selected = parseInt(e.currentTarget.getAttribute("data-choice"));
      verifySelection(selected);
    };
  });

  const iceBoy = document.getElementById("ice-boy-character");
  if (iceBoy) {
    iceBoy.onclick = () => { triggerBilingualScienceSign(); };
  }
}

async function loadCurrentLocation() {
  if (GameState.timerInterval) clearInterval(GameState.timerInterval);
  GameState.isTransitioning = false;
  toggleButtonsDisabled(false);

  if (GameState.currentIndex >= GameState.mapData.locations.length) {
    triggerGameCompletion();
    return;
  }

  // Moves sprite and automatically centers viewport camera smoothly
  moveCharacterToNode(GameState.currentIndex);
  
  const loc = GameState.mapData.locations[GameState.currentIndex];
  showText(`What will happen to Ice Boy at the ${loc.name}?`, `當 Ice Boy 到達 ${loc.name}，會發生什麼事呢？`);
  applyChoiceButtonLabels();

  const choicesContainer = document.getElementById("choice-buttons-container");
  if (choicesContainer) choicesContainer.classList.remove("hidden");

  try {
    const questionObj = await fetchAIQuestion(GameState.difficulty, loc.name, loc.state);
    if (questionObj) {
      GameState.currentQuestion = questionObj;
      showText(questionObj.question_en, questionObj.question_zh);
    }
  } catch (err) {
    console.warn("API handling disconnected. Falling back onto backup execution structures.", err);
    GameState.currentQuestion = null;
  }

  startInactivityCountdown(loc.temp);
}

function applyChoiceButtonLabels() {
  const labels = [
    { en: "freeze into ice", zh: "結冰成固體" },
    { en: "melt into water", zh: "融化成液體" },
    { en: "evaporate into steam", zh: "蒸發成氣體" }
  ];
  labels.forEach((lbl, idx) => {
    const btn = document.querySelector(`.choice-btn[data-choice="${idx}"]`);
    if (btn) {
      const enSpan = btn.querySelector('.label-en');
      const zhSpan = btn.querySelector('.label-zh');
      if (enSpan) enSpan.textContent = lbl.en;
      if (zhSpan) zhSpan.textContent = lbl.zh;
    }
  });
}

function startInactivityCountdown(temperatureZone) {
  const bar = document.getElementById("countdown-timer-fill");
  let timeLeft = 100;
  GameState.lastTime = Date.now();

  GameState.timerInterval = setInterval(() => {
    timeLeft -= 2; 
    if (bar) bar.style.width = `${timeLeft}%`;
    if (timeLeft <= 0) {
      clearInterval(GameState.timerInterval);
      triggerHintFallback(temperatureZone);
    }
  }, 100);
}

function triggerHintFallback(temp) {
  if (temp === "cold") {
    showText("Think about temperature. Is this place freezing cold?", "想一想溫度的變化。這個地方是不是非常寒冷呢？");
  } else if (temp === "warm") {
    showText("Would Ice Boy stay solid here, or start to melt?", "Ice Boy 在這裡會保持固體，還是會開始融化呢？");
  } else {
    showText("What happens to water when it gets hotter and hotter?", "當水變得越來越熱時，會發生什麼事呢？");
  }
}

function verifySelection(choiceIndex) {
  clearInterval(GameState.timerInterval);
  GameState.isTransitioning = true; 
  toggleButtonsDisabled(true);

  const loc = GameState.mapData.locations[GameState.currentIndex];
  
  let correctIndex = 1; 
  if (loc.state === "freeze") correctIndex = 0;
  if (loc.state === "evaporate") correctIndex = 2;

  if (GameState.currentQuestion && GameState.currentQuestion.answer !== undefined) {
    correctIndex = GameState.currentQuestion.answer;
  }

  const container = document.getElementById("game-container");
  const sprite = document.getElementById("ice-boy-character");
  const duration = (Date.now() - GameState.lastTime) / 1000;

  if (choiceIndex === correctIndex) {
    if (duration < 3) GameState.difficulty = "hard";
    const diffBadge = document.getElementById("current-diff");
    if (diffBadge) diffBadge.textContent = GameState.difficulty.toUpperCase();

    if (container) {
      container.classList.remove("flash-red", "flash-green");
      void container.offsetWidth; 
      container.classList.add("flash-green");
    }

    if (sprite) sprite.className = "character-base jump-success";
    
    const expEn = GameState.currentQuestion?.explanation_en || "Correct! Excellent observation!";
    const expZh = GameState.currentQuestion?.explanation_zh || "答對了！觀察得太仔細了！";
    showText(expEn, expZh);

    setTimeout(() => {
      if (sprite) sprite.className = "character-base";
      if (container) container.classList.remove("flash-green");
      GameState.currentIndex++;
      loadCurrentLocation();
    }, 2500);

  } else {
    if (container) {
      container.classList.remove("flash-red", "flash-green");
      void container.offsetWidth; 
      container.classList.add("flash-red");
    }

    if (sprite) sprite.className = "character-base";
    showText("That wasn't quite right for this climate environment! Try again!", "在這個環境下不是這樣變化的喔！再試一次看看！");
    
    setTimeout(() => {
      if (container) container.classList.remove("flash-red");
      GameState.isTransitioning = false; 
      toggleButtonsDisabled(false);
      startInactivityCountdown(loc.temp);
    }, 1500);
  }
}

function toggleButtonsDisabled(disabledState) {
  const buttons = document.querySelectorAll(".choice-btn");
  buttons.forEach(btn => btn.disabled = disabledState);
}

function triggerGameCompletion() {
  const sprite = document.getElementById("ice-boy-character");
  if (sprite) {
    sprite.innerHTML = `<div class="character-sprite" style="filter: drop-shadow(0 0 20px #00ffff); font-size:68px; animation: idle 1s ease-in-out infinite alternate;">💎</div>`;
  }
  showText(
    "Best day ever! I'm free! You unlocked the legendary Crystal Ice Boy form!", 
    "最棒的一天！我完全自由了！你成功解鎖了傳說中的『水晶冰男孩』型態！"
  );
  const choicesContainer = document.getElementById("choice-buttons-container");
  if (choicesContainer) choicesContainer.classList.add("hidden");
}

function triggerBilingualScienceSign() {
  const scienceFacts = [
    { en: "Ice is hard. It is a solid.", zh: "冰是堅硬的固體。" },
    { en: "Density is how much stuff is packed tightly inside.", zh: "密度是指物質被緊密堆積的程度。" }
  ];
  const item = scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
  showText(item.en, item.zh);
}