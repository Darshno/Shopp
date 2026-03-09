// Game state
let gameState = {
    coins: 0,
    highScore: 0
};

// Load game state
function loadGame() {
    const saved = localStorage.getItem("gameState");
    if (saved) {
        gameState = JSON.parse(saved);
    }
    updateDisplay();
}

// Save game state
function saveGame() {
    localStorage.setItem("gameState", JSON.stringify(gameState));
}

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gridSize = 30;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let food = { x: 15, y: 15, type: 'coin' };
let score = 0;
let gameRunning = false;
let gameSpeed = 100;
let speedBoostActive = false;

// Food types
const foodTypes = {
    coin: { emoji: '💰', value: 10, chance: 0.7 },
    diamond: { emoji: '💎', value: 50, chance: 0.15 },
    speedBoost: { emoji: '⚡', value: 5, chance: 0.15 }
};

// Initialize snake with 3 segments
function initSnake() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameSpeed = 100;
    speedBoostActive = false;
    spawnFood();
}

// Spawn food
function spawnFood() {
    const rand = Math.random();
    let type = 'coin';

    if (rand < foodTypes.diamond.chance) {
        type = 'diamond';
    } else if (rand < foodTypes.diamond.chance + foodTypes.speedBoost.chance) {
        type = 'speedBoost';
    }

    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        type: type
    };

    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            spawnFood();
            return;
        }
    }
}

// Change direction
function changeDirection(dir) {
    if (!gameRunning) return;

    switch (dir) {
        case 'UP':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            break;
        case 'DOWN':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            break;
        case 'LEFT':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            break;
        case 'RIGHT':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            break;
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection('UP');
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection('DOWN');
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection('LEFT');
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection('RIGHT');
            break;
        case ' ':
            e.preventDefault();
            if (!gameRunning) startGame();
            break;
    }
});

// Start game
function startGame() {
    if (gameRunning) return;

    initSnake();
    gameRunning = true;
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('startBtn').textContent = '⏸️ Playing...';
    document.getElementById('startBtn').disabled = true;

    gameLoop();
}

// Game loop
let lastTime = 0;
function gameLoop(currentTime = 0) {
    if (!gameRunning) return;

    const deltaTime = currentTime - lastTime;

    if (deltaTime >= gameSpeed) {
        lastTime = currentTime;
        update();
        draw();
    }

    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    direction = nextDirection;

    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Check self collision
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        const foodType = foodTypes[food.type];
        score += foodType.value;

        if (food.type === 'speedBoost') {
            speedBoostActive = true;
            gameSpeed = 70;
            setTimeout(() => {
                speedBoostActive = false;
                gameSpeed = 100;
            }, 5000);
            showMessage('⚡ Speed Boost! +5 coins');
        } else if (food.type === 'diamond') {
            showMessage('💎 Diamond! +50 coins');
        } else {
            showMessage('💰 +10 coins');
        }

        spawnFood();
    } else {
        snake.pop();
    }

    // Update survival bonus (1 coin per 10 moves)
    if (snake.length > 3 && Math.random() < 0.1) {
        score += 1;
    }

    updateDisplay();
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#f1f8f4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e8f5e9';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            ctx.fillStyle = '#11998e';
            ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
            ctx.fillStyle = 'white';
            ctx.fillRect(segment.x * gridSize + 8, segment.y * gridSize + 8, 6, 6);
            ctx.fillRect(segment.x * gridSize + 16, segment.y * gridSize + 8, 6, 6);
        } else {
            // Body
            const gradient = ctx.createLinearGradient(
                segment.x * gridSize, segment.y * gridSize,
                (segment.x + 1) * gridSize, (segment.y + 1) * gridSize
            );
            gradient.addColorStop(0, '#11998e');
            gradient.addColorStop(1, '#38ef7d');
            ctx.fillStyle = gradient;
            ctx.fillRect(segment.x * gridSize + 3, segment.y * gridSize + 3, gridSize - 6, gridSize - 6);
        }
    });

    // Draw food
    ctx.font = `${gridSize - 8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        foodTypes[food.type].emoji,
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2
    );

    // Draw speed boost indicator
    if (speedBoostActive) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// End game
function endGame() {
    gameRunning = false;

    // Calculate coins earned
    const coinsEarned = score;
    gameState.coins += coinsEarned;

    if (score > gameState.highScore) {
        gameState.highScore = score;
    }

    saveGame();

    // Show game over screen
    document.getElementById('finalScore').textContent = `Final Score: ${score}`;
    document.getElementById('coinsEarned').textContent = `Coins Earned: ${coinsEarned} 💰`;
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('startBtn').textContent = '▶️ Start Game';
    document.getElementById('startBtn').disabled = false;

    updateDisplay();
}

// Update display
function updateDisplay() {
    document.getElementById('totalCoins').textContent = Math.floor(gameState.coins);
    document.getElementById('currentScore').textContent = score;
    document.getElementById('highScore').textContent = gameState.highScore;
    document.getElementById('snakeLength').textContent = snake.length;
}

// Show message
function showMessage(text) {
    const existing = document.getElementById("gameMessage");
    if (existing) existing.remove();

    const message = document.createElement("div");
    message.id = "gameMessage";
    message.textContent = text;
    message.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
    z-index: 10000;
    animation: slideDown 0.3s ease-out;
  `;

    document.body.appendChild(message);

    setTimeout(() => {
        message.style.animation = "slideUp 0.3s ease-out";
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

// Load game on start
loadGame();

// Draw initial state
draw();
