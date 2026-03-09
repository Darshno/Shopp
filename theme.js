// Theme toggle functionality
function swapStyleSheet() {
    const styleLink = document.getElementById("pageStyle");
    const currentTheme = styleLink.getAttribute("href");
    const button = event.target;

    if (currentTheme === 'styles.css') {
        styleLink.setAttribute("href", 'girl.css');
        button.textContent = 'Default theme';
        localStorage.setItem('theme', 'girl.css');
    } else {
        styleLink.setAttribute("href", 'styles.css');
        button.textContent = 'Girl theme';
        localStorage.setItem('theme', 'styles.css');
    }
}

// Initialize theme button text
function initThemeButton() {
    const savedTheme = localStorage.getItem('theme');
    const button = document.querySelector('.theme-toggle');

    if (button && savedTheme) {
        button.textContent = savedTheme === 'girl.css' ? 'Default theme' : 'Girl theme';
    }
}

// Logout function
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "client.html";
}

// Display user coins
function displayUserCoins() {
    const gameState = localStorage.getItem("gameState");
    if (gameState) {
        const state = JSON.parse(gameState);
        const coinElement = document.getElementById("userCoins");
        if (coinElement) {
            coinElement.textContent = Math.floor(state.coins);
        }
    }
}

// Update coins every second
setInterval(displayUserCoins, 1000);

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
    initThemeButton();
    displayUserCoins();

    // Display welcome message
    const user = JSON.parse(localStorage.getItem("user"));
    const welcomeElement = document.getElementById("welcome");
    if (user && welcomeElement) {
        welcomeElement.innerText = "Welcome, " + user.name;
    }
});

// Load chatbot CSS and JS
function loadChatbot() {
    // Only load chatbot on index.html
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        return;
    }

    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'chatbot.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'chatbot.js';
    document.body.appendChild(script);
}

// Load chatbot only on index page
loadChatbot();
