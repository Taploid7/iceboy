// engine/board.js - Character Movement & Viewport Tracking
export function moveCharacterToNode(nodeIndex) {
  const nodes = document.querySelectorAll(".board-node");
  const character = document.getElementById("ice-boy-character");
  const screen = document.getElementById("game-screen");

  if (!nodes || nodes.length === 0 || !character || nodeIndex >= nodes.length) {
    return;
  }

  const targetNode = nodes[nodeIndex];
  
  // Calculate coordinates relative to parent viewport offset layers
  const nodeLeft = targetNode.offsetLeft;
  const nodeTop = targetNode.offsetTop;
  const nodeWidth = targetNode.offsetWidth;
  const nodeHeight = targetNode.offsetHeight;

  // Position character centered relative to the node base
  const finalX = nodeLeft + (nodeWidth / 2) - (character.offsetWidth / 2);
  const finalY = targetNode.parentElement.offsetHeight - nodeTop - (nodeHeight / 2);

  character.style.left = `${finalX}px`;
  character.style.bottom = `${finalY}px`;

  // Auto-scroll the viewport wrapper to center the character cleanly
  if (screen) {
    const screenWidth = screen.clientWidth;
    const targetScrollLeft = nodeLeft - (screenWidth / 2) + (nodeWidth / 2);
    
    screen.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth"
    });
  }
}