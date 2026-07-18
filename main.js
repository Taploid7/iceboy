// main.js - Application Bootstrapper
import { initBoard } from './engine/board.js';
import { initGameLoop } from './engine/game.js';

console.log("Ice Boy Engine Launching...");

// Initialize the game when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Changed from './map.json' to 'map.json' to prevent subdirectory 404 pathing bugs
  fetch('map.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch map.json configuration: ${response.status}`);
      }
      return response.json();
    })
    .then(mapData => {
      // 1. Build and render the board nodes track
      initBoard(mapData);
      
      // 2. Start core event handlers, countdowns, and question tracking loops
      initGameLoop(mapData);
    })
    .catch(error => {
      console.error("Critical error during Ice Boy lifecycle initialization:", error);
    });
});