const gridSize = 30;
const gameContainer = document.getElementById('game-container');


const TILE_TYPES = {
  0: 'grass',
  1: 'tree',
  2: 'house'
};

let mapData = []; // to be loaded

const player = document.getElementById('player');
// No need to reassign player.id since it’s already in HTML

// Start at center of grid:
let playerX = Math.floor(gridSize / 2);
let playerY = Math.floor(gridSize / 2);

function drawMap() {
  // Instead of clearing the whole container,
  // remove only the tile elements so the player stays in the DOM.
  const tiles = gameContainer.querySelectorAll('.tile');
  tiles.forEach(tile => tile.remove());

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = document.createElement('div');
      const tileCode = mapData[y][x];
      tile.classList.add('tile', TILE_TYPES[tileCode]); // fallback
      gameContainer.appendChild(tile);
    }
  }
  updatePlayerPosition();
}

function updatePlayerPosition() {
  // Use grid properties so the player is aligned with the grid cells:
  player.style.gridColumnStart = playerX + 1; // grid is 1-indexed
  player.style.gridRowStart = playerY + 1;
}

function tryMove(dx, dy) {
  const newX = playerX + dx;
  const newY = playerY + dy;

  if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
    playerX = newX;
    playerY = newY;
    updatePlayerPosition();
  }
}

document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault(); // stop page scroll
    switch (e.key) {
      case 'ArrowUp':    tryMove(0, -1); break;
      case 'ArrowDown':  tryMove(0, 1); break;
      case 'ArrowLeft':  tryMove(-1, 0); break;
      case 'ArrowRight': tryMove(1, 0); break;
    }
  }
});

function scaleToFitScreen() {
  const baseWidth = 16 * gridSize;
  const baseHeight = 16 * gridSize;

  const scaleX = window.innerWidth / baseWidth;
  const scaleY = window.innerHeight / baseHeight;
  const scale = Math.floor(Math.min(scaleX, scaleY)); // integer scale

  gameContainer.style.transform = `scale(${scale})`;
  gameContainer.style.transformOrigin = 'center';
}

window.addEventListener('resize', scaleToFitScreen);

fetch('maps/map01.json')
  .then(res => res.json())
  .then(data => {
    mapData = data.tiles;
    drawMap();
    updatePlayerPosition();
    scaleToFitScreen();
  })
  .catch(err => console.error("Failed to load map:", err));

