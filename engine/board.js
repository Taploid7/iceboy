// engine/board.js - Layout Rendering & Dynamic Target Scrolling

/**
 * Dynamically builds and draws the track nodes onto the game board wrapper
 * @param {Object} mapData The data config loaded from map.json
 */
export function renderBoard(mapData) {
  const track = document.getElementById("board-track");
  if (!track) {
    console.error("Critical Error: #board-track container element was not found in the DOM.");
    return;
  }

  // Clear any existing boilerplate items before drawing nodes
  track.innerHTML = "";

  if (!mapData || !mapData.locations) {
    console.warn("No location tracks found inside mapData parameters.");
    return;
  }

  // Loop through and append nodes to the visible track timeline
  mapData.locations.forEach((loc, index) => {
    const node = document.createElement("div");
    node.className = `board-node ${loc.temp || 'warm'}`;
    
    // Create label strings
    node.innerHTML = `
      <div class="node-index">${index + 1}</div>
      <div class="node-name" style="font-size: 11px; margin-top: 4px;">${loc.name}</div>
    `;

    track.appendChild(node);
  });

  // Create the Ice Boy character container if it doesn't already exist on the board
  let character = document.getElementById("ice-boy-character");
  if (!character) {
    character = document.createElement("div");
    character.id = "ice-boy-character";
    character.className = "character-base";
    character.innerHTML = `<div class="character-sprite">❄️</div>`;
    track.appendChild(character);
  }
}

// Alias export to fully prevent any 'initBoard' vs 'renderBoard' mismatches across main scripts
export { renderBoard as initBoard };

/**
 * Relocates the character element over the current node spot and centers the viewport scroll
 * @param {number} nodeIndex The current active stage state index
 */
export function moveCharacterToNode(nodeIndex) {
  const nodes = document.querySelectorAll(".board-node");
  const character = document.getElementById("ice-boy-character");
  const screen = document.getElementById("game-screen");

  if (!nodes || nodes.length === 0 || !character || nodeIndex >= nodes.length) {
    return;
  }

  const targetNode = nodes[nodeIndex];
  
  // Calculate relative layout offset coordinates
  const nodeLeft = targetNode.offsetLeft;
  const nodeTop = targetNode.offsetTop;
  const nodeWidth = targetNode.offsetWidth;
  const nodeHeight = targetNode.offsetHeight;

  // Position character centered relative to the target node
  const finalX = nodeLeft + (nodeWidth / 2) - (character.offsetWidth / 2);
  const finalY = targetNode.parentElement.offsetHeight - nodeTop - (nodeHeight / 2);

  character.style.left = `${finalX}px`;
  character.style.bottom = `${finalY}px`;

  // Clean auto-scroll calculation to center the active node in the screen window
  if (screen) {
    const screenWidth = screen.clientWidth;
    const targetScrollLeft = nodeLeft - (screenWidth / 2) + (nodeWidth / 2);
    
    screen.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth"
    });
  }
}