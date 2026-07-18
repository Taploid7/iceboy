// engine/board.js - Character Movement & Viewport Tracking
export function moveCharacterToNode(nodeIndex) {
  const nodes = document.querySelectorAll(".board-node");
  const character = document.getElementById("ice-boy-character");
  const screen = document.getElementById("game-screen");

  if (!nodes || nodes.length === 0 || !character || nodeIndex >= nodes.length) {
    return;
  }

  const targetNode = nodes[nodeIndex];
  
  // Calculate horizontal and vertical coordinates relative to the track container
  const nodeLeft = targetNode.offsetLeft;
  const nodeTop = targetNode.offsetTop;
  const nodeWidth = targetNode.offsetWidth;
  const nodeHeight = targetNode.offsetHeight;

  // Center character directly over the node base
  const finalX = nodeLeft + (nodeWidth / 2) - (character.offsetWidth / 2);
  const finalY = targetNode.parentElement.offsetHeight - nodeTop - (nodeHeight / 2);

  character.style.left = `${finalX}px`;
  character.style.bottom = `${finalY}px`;

  // Auto-scroll the viewport container to center the character cleanly
  if (screen) {
    const screenWidth = screen.clientWidth;
    const targetScrollLeft = nodeLeft - (screenWidth / 2) + (nodeWidth / 2);
    
    screen.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: "smooth"
    });
  }
}