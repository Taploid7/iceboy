import { moveCharacterToNode } from './board.js';
import { fetchAIQuestion } from './questions.js';
import { showText } from './dialogue.js';

export const GameState = {
  currentIndex: 0,
  difficulty: "normal",
  lastTime: 0,
  timerInterval: null,
  mapData: null
};

export function initGameLoop(mapData) {
  GameState.mapData = mapData;
  setupEventHandlers();
  loadCurrentLocation();
}

function setupEventHandlers() {
  const langBtn = document.getElementById("lang-toggle-btn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      document.body.classList.toggle("alt-lang");
    });
  } else {
    console.warn("Element 'lang-toggle-btn' not found in HTML.");
  }

  const choiceButtons = document.querySelectorAll(".choice-btn");
  choiceButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const selected = parseInt(e.currentTarget.getAttribute("data-choice"));
      verifySelection(selected);
    });
  });

  const iceBoy = document.getElementById("ice-boy-character");
  if (iceBoy) {
    iceBoy.addEventListener("click", () => {
      triggerBilingualScienceSign();
    });
  } else {
    console.warn("Element 'ice-boy-character' not found in HTML.");
  }
}

async function loadCurrentLocation() {
  if (GameState.timerInterval) clearInterval(GameState.timerInterval);
  moveCharacterToNode(GameState.currentIndex);

  const loc = GameState.mapData.locations[GameState.currentIndex];
  showText(`What will happen to Ice Boy at the ${loc.name}?`, `當 Ice Boy 到達 ${loc.name}，會發生什麼事呢？`);

  // Reveal choices box UI container
  document.getElementById("choice-buttons-container").classList.remove("hidden");

  // Fetch from live network or run backup
  const questionObj = await fetchAIQuestion(GameState.difficulty, loc.name, loc.state);
  GameState.currentQuestion = questionObj;

  startInactivityCountdown(loc.temp);
}

function startInactivityCountdown(temperatureZone) {
  const bar = document.getElementById("countdown-timer-fill");
  let timeLeft = 100;
  GameState.lastTime = Date.now();

  GameState.timerInterval = setInterval(() => {
    timeLeft -= 2; // 5 Seconds total deployment window
    if(bar) bar.style.width = `${timeLeft}%`;

    if (timeLeft <= 0) {
      clearInterval(GameState.timerInterval);
      triggerHintFallback(temperatureZone);
    }
  }, 100);
}

function triggerHintFallback(temp) {
  if (temp === "cold") {
    showText("Think about temperature. Is this place cold, warm, or very hot?", "想一想溫度的變化。這個地方是冷、溫暖、還是非常熱呢？");
  } else if (temp === "warm") {
    showText("Would Ice Boy stay solid here, or start to melt?", "Ice Boy 在這裡會保持固體，還是會開始融化呢？");
  } else {
    showText("What happens to water when it gets hotter and hotter?", "當水變得越來越熱時，會發生什麼事呢？");
  }
}

function verifySelection(choiceIndex) {
  clearInterval(GameState.timerInterval);
  const correct = GameState.currentQuestion?.answer ?? 1; 
  const duration = (Date.now() - GameState.lastTime) / 1000;
  const sprite = document.getElementById("ice-boy-character");

  if (choiceIndex === correct) {
    if (duration < 3) GameState.difficulty = "hard";
    document.getElementById("current-diff").textContent = GameState.difficulty.toUpperCase();

    sprite.className = "character-base jump-success";
    showText("Ta-Da! It feels good!", "鏘鏘！感覺太舒服了！");

    setTimeout(() => {
      sprite.className = "character-base";
      GameState.currentIndex = (GameState.currentIndex + 1) % GameState.mapData.locations.length;
      loadCurrentLocation();
    }, 2000);
  } else {
    showText("Am I dense, or did I become a liquid again? Try again!", "我很笨拙（密度大）嗎？還是我又變成液體了？再試一次！");
  }
}

function triggerBilingualScienceSign() {
  const scienceFacts = [
    { en: "Ice is hard. It is a solid.", zh: "冰是堅硬的固體。" },
    { en: "Density is how much stuff is packed tightly inside.", zh: "密度是指物質被緊密堆積的程度。" }
  ];
  const item = scienceFacts[Math.floor(Math.random() * scienceFacts.length)];
  showText(item.en, item.zh);
}                                                                               