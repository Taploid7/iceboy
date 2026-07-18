import { renderBoard } from './engine/board.js';
import { initGameLoop } from './engine/game.js';
import { loadSave } from './engine/save.js';

window.addEventListener('DOMContentLoaded', async () => {
  console.log("Ice Boy Engine Launching...");
  
  // Load standard historical profile parameters
  loadSave();

  // Load baseline JSON configurations synchronously
  const mapResponse = await fetch('./data/map.json');
  const mapData = await mapResponse.json();

  // Bootstrap internal dependency states
  initBoard(mapData);
  renderBoard();
  initGameLoop(mapData);
});