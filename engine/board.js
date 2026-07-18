let gameMapData = null;

export function initBoard(mapData) {
  gameMapData = mapData;
}

export function renderBoard() {
  const track = document.getElementById("board-track");
  if (!track || !gameMapData) return;
  track.innerHTML = "";

  gameMapData.locations.forEach((loc, index) => {
    const node = document.createElement("div");
    node.className = `board-node ${loc.temp}`;
    node.id = `node-${index}`;
    node.innerHTML = `<div>${index + 1}</div><div>${loc.name}</div>`;
    track.appendChild(node);
  });
}

export function moveCharacterToNode(index) {
  const charElem = document.getElementById("ice-boy-character");
  const targetNode = document.getElementById(`node-${index}`);
  if (charElem && targetNode) {
    const offsetLeft = targetNode.offsetLeft + 10;
    charElem.style.left = `${offsetLeft}px`;
  }
}