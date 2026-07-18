// main.js - Application Bootstrapper with Fail-Safe Fallbacks
import { initBoard } from './engine/board.js';
import { initGameLoop } from './engine/game.js';

console.log("Ice Boy Engine Launching...");

document.addEventListener("DOMContentLoaded", () => {
  // Try fetching the local JSON configuration map file
  fetch('map.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch map.json configuration: ${response.status}`);
      }
      return response.json();
    })
    .then(mapData => {
      console.log("Successfully loaded map configuration file.");
      launchGame(mapData);
    })
    .catch(error => {
      console.warn("map.json not found or failed to load. Loading safe default game map layout instead...", error);
      
      // Fail-safe embedded map data configuration matching your game setup
      const fallbackMapData = {
        locations: [
          { name: "Sunny Playground Slide", temp: "warm", state: "melt" },
          { name: "Glacier Mountain peak", temp: "cold", state: "freeze" },
          { name: "Geothermal Boiling Springs", temp: "hot", state: "evaporate" },
          { name: "Deep Freeze Ice Caves", temp: "cold", state: "freeze" },
          { name: "Desert Sand Dunes", temp: "hot", state: "evaporate" }
        ]
      };
      
      launchGame(fallbackMapData);
    });
});

// Auxiliary structural workflow router
function launchGame(mapData) {
  // 1. Build and layout the track nodes
  initBoard(mapData);
  
  // 2. Start character tracking, event handlers, and core gameplay routines
  initGameLoop(mapData);
}