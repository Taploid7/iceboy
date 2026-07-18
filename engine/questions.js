// engine/questions.js - Complete Frontend API Call Layer
import { GameState } from './game.js';

/**
 * Fetches a dynamic multiple-choice question from the Vercel AI backend.
 * @param {string} difficulty - "easy" | "normal" | "hard"
 * @param {string} locationName - The name of the node (e.g., "Refrigerator")
 * @param {string} targetState - The scientific transition state ("freeze" | "melt" | "evaporate")
 * @returns {Promise<Object>} The parsed question object structure
 */
export async function fetchAIQuestion(difficulty, locationName, targetState) {
  // Ensure we fall back to a safe property name if targetState is missing
  const stateTopic = targetState || "melt"; 
  
  const payload = {
    difficulty: difficulty || "normal",
    location: locationName || "Unknown Area",
    topic: stateTopic
  };

  try {
    const response = await fetch('https://iceboy1.vercel.app/api/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server responded with status code: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Network fetch failed. Activating local template fallback router.", error);
    return fallbackToLocalQuestion(locationName, stateTopic);
  }
}

/**
 * Generates an instant local fallback question if the network drops or requests are blocked.
 */
function fallbackToLocalQuestion(location, topic) {
  let determinedIndex = 1; // Default to melt
  let questionEn = `What will happen to Ice Boy at the ${location}?`;
  let questionZh = `當 Ice Boy 到達 ${location}，會發生什麼事呢？`;
  let expEn = "Correct! The thermal balance shifted.";
  let expZh = "答對了！熱量平衡發生了變化。";

  if (topic === "freeze") {
    determinedIndex = 0;
    expEn = "Correct! Cold ambient conditions cause water molecules to form a crystalline solid structure.";
    expZh = "答對了！寒冷的環境使水分子聚集成結晶固體結構。";
  } else if (topic === "evaporate") {
    determinedIndex = 2;
    expEn = "Correct! High thermal energy forces liquid water to turn into an invisible gas phase.";
    expZh = "答對了！高熱能促使液態水轉化為氣態分子。";
  } else {
    expEn = "Correct! Warm parameters break down solid intermolecular bonds into a liquid phase.";
    expZh = "答對了！溫暖的環境破壞了固體的分子鍵結，轉化為液體。";
  }

  return {
    question_en: questionEn,
    question_zh: questionZh,
    choices: [
      { en: "freeze into ice", zh: "結冰成固體" },
      { en: "melt into water", zh: "融化成液體" },
      { en: "evaporate into steam", zh: "蒸發成氣體" }
    ],
    answer: determinedIndex,
    explanation_en: expEn,
    explanation_zh: expZh
  };
}