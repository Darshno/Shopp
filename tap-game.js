// Tap Game Logic
let gameState = JSON.parse(localStorage.getItem("gameState")) || {
    coins: 0,
    highScore: 0,
    bestCombo: 0
};

let gameActive = false;
let currentScore = 0;
let combo = 0;
let timeLeft = 60;
let spawnInterval;
let timerInterval;
let comboTimeout;

const coinTypes = [
    { emoji: '💰', value: 5, weight: 50 },
    { emoji: '⭐', value: 10, weight: 30 },
    { emoji: '💎', value: 20, weight: 15 },
    { emoji: '🎁', value: 15, weight: 5 }
];

function updateDisplay() {
    document.getElementById('totalCoins').textContent = Math.floor(gameState.coins);
    document.getElementById('currentScore').textContent = currentScore;
    document.getElementById('highScore').textContent = gameState.highScore;
    document.getElementById('bestCombo').textContent = gameState.bestCombo + 'x';
}

function startGame() {
    if (gameActive) return;

    gameActive = true;
    currentScore = 0;
    combo = 0;
    timeLeft = 60;

    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('gameCanvas').innerHTML = `
    <div class="timer-display" id="timer">60s</div>
    <div class="combo-display" id="combo">Combo: 0x</div>
  `;

    updateDisplay();
    updateComboDisplay();

    // Start spawning coins
    spawnInterval = setInterval(spawnCoin, 800);

    // Start timer
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function spawnCoin() {
    if (!gameActive) return;

    const canvas = document.getElementById('gameCanvas');
    const coin = document.createElement('div');
    coin.className = 'coin-item';

    // Select coin type based on weight
    const coinType = selectWeightedCoin();
    coin.textContent = coinType.emoji;
    coin.dataset.value = coinType.value;

    // Random position
    const maxX = canvas.offsetWidth - 50;
    coin.style.left = Math.random() * maxX + 'px';
    coin.style.top = '-50px';

    // Random fall duration
    const duration = 3 + Math.random() * 2;
    coin.style.animationDuration = duration + 's';

    canvas.appendChild(coin);

    // Click/tap handler
    coin.addEventListener('click', (e) => collectCoin(e, coin));
    coin.addEventListener('touchstart', (e) => {
        e.preventDefault();
        collectCoin(e, coin);
    });

    // Remove coin after animation
    setTimeout(() => {
        if (coin.parentNode) {
            coin.remove();
            resetCombo();
        }
    }, duration * 1000);
}

function selectWeightedCoin() {
    const totalWeight = coinTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;

    for (const type of coinTypes) {
        if (random < type.weight) {
            return type;
        }
        random -= type.weight;
    }

    return coinTypes[0];
}

function collectCoin(e, coin) {
    if (!gameActive) return;

    const value = parseInt(coin.dataset.value);
    combo++;

    // Calculate score with combo multiplier
    const multiplier = Math.min(Math.floor(combo / 5) + 1, 5);
    const earnedCoins = value * multiplier;

    currentScore += earnedCoins;
    gameState.coins += earnedCoins;

    // Update best combo
    if (combo > gameState.bestCombo) {
        gameState.bestCombo = combo;
    }

    // Show tap effect
    showTapEffect(e, `+${earnedCoins}`);

    // Remove coin
    coin.remove();

    // Update displays
    updateDisplay();
    updateComboDisplay();

    // Reset combo timeout
    clearTimeout(comboTimeout);
    comboTimeout = setTimeout(resetCombo, 2000);

    // Save state
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function showTapEffect(e, text) {
    const effect = document.createElement('div');
    effect.className = 'tap-effect';
    effect.textContent = text;

    const rect = document.getElementById('gameCanvas').getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    effect.style.left = x + 'px';
    effect.style.top = y + 'px';

    document.getElementById('gameCanvas').appendChild(effect);

    setTimeout(() => effect.remove(), 800);
}

function updateComboDisplay() {
    const comboElement = document.getElementById('combo');
    if (comboElement) {
        const multiplier = Math.min(Math.floor(combo / 5) + 1, 5);
        comboElement.textContent = `Combo: ${combo}x (${multiplier}x multiplier)`;

        if (combo >= 10) {
            comboElement.style.background = 'linear-gradient(135deg, #ff6b6b, #feca57)';
            comboElement.style.color = 'white';
        } else {
            comboElement.style.background = 'rgba(255,255,255,0.9)';
            comboElement.style.color = '#11998e';
        }
    }
}

function resetCombo() {
    combo = 0;
    updateComboDisplay();
}

function endGame() {
    gameActive = false;
    clearInterval(spawnInterval);
    clearInterval(timerInterval);
    clearTimeout(comboTimeout);

    // Update high score
    if (currentScore > gameState.highScore) {
        gameState.highScore = currentScore;
    }

    localStorage.setItem('gameState', JSON.stringify(gameState));

    // Show game over screen
    const gameOverScreen = document.getElementById('gameOver');
    document.getElementById('finalScore').textContent = `Final Score: ${currentScore} coins`;
    document.getElementById('coinsEarned').textContent = `Total Coins: ${Math.floor(gameState.coins)}`;
    gameOverScreen.style.display = 'block';

    document.getElementById('startBtn').style.display = 'block';

    updateDisplay();
}

// Initialize
updateDisplay();
