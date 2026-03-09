// Chatbot functionality
const chatbotData = {
    greetings: [
        "Hi! I'm here to help. What can I assist you with?",
        "Hello! How can I help you today?",
        "Hey there! Need help with something?"
    ],

    faqs: {
        // Account & Login Issues
        "login": {
            keywords: ["login", "log in", "sign in", "can't login", "cannot login", "password"],
            response: "Having trouble logging in? Here's what you can do:\n\n1. Make sure you're using the correct email and password\n2. Try clearing your browser cache\n3. If you forgot your password, you'll need to sign up again\n4. Make sure you're on the correct page (client.html for customers, seller-login.html for sellers)"
        },

        "signup": {
            keywords: ["sign up", "signup", "register", "create account", "new account"],
            response: "To create an account:\n\n1. Click 'Sign Up' in the header\n2. Enter your name, email, and password\n3. Click the Sign Up button\n4. You'll be automatically logged in!\n\nFor sellers, use the 'Seller' link to create a seller account."
        },

        // Coins & Game
        "coins": {
            keywords: ["coins", "money", "earn", "balance", "how to get coins"],
            response: "💰 About Coins:\n\n1. Play the Snake game to earn coins (🎮 Play Game)\n2. Collect gold coins (+10), diamonds (+50), and speed boosts (+5)\n3. Your coin balance shows in the header\n4. Use coins to buy products from the store\n5. Coins are deducted only at checkout, not when adding to cart"
        },

        "game": {
            keywords: ["game", "snake", "play", "how to play", "controls"],
            response: "🎮 Snake Game Guide:\n\n1. Click '🎮 Play Game' in the header\n2. Use arrow keys (desktop) or swipe (mobile) to control\n3. Collect: 💰 coins (+10), 💎 diamonds (+50), ⚡ speed boosts (+5)\n4. Avoid hitting walls or yourself\n5. Longer survival = more bonus coins\n6. Your high score is saved automatically"
        },

        // Shopping
        "cart": {
            keywords: ["cart", "shopping cart", "add to cart", "remove from cart"],
            response: "🛒 Shopping Cart Help:\n\n1. Click 'Add to Cart' on any product\n2. View your cart by clicking '🛒 Cart' in header\n3. Adjust quantities with +/- buttons\n4. Remove items with the Remove button\n5. Click 'Proceed to Checkout' when ready\n6. Coins are only deducted at checkout"
        },

        "checkout": {
            keywords: ["checkout", "buy", "purchase", "order", "place order"],
            response: "💳 Checkout Process:\n\n1. Add items to your cart\n2. Go to cart and click 'Proceed to Checkout'\n3. Enter your shipping details (name, phone, address)\n4. Review your order summary (includes 18% tax)\n5. Click 'Place Order'\n6. Coins will be deducted from your balance\n7. View your orders in '📦 Orders'"
        },

        "wishlist": {
            keywords: ["wishlist", "wish list", "save for later", "favorites"],
            response: "❤️ Wishlist Features:\n\n1. Click '♥ Wishlist' button on any product\n2. View saved items in '❤️ Wishlist'\n3. Move items to cart when ready to buy\n4. Remove items you no longer want\n5. Wishlist is saved in your browser"
        },

        // Orders
        "orders": {
            keywords: ["my orders", "order history", "track order", "view orders"],
            response: "📦 Your Orders:\n\n1. Click '📦 Orders' in the header\n2. View your last 5 orders\n3. See order details, items, and total\n4. Check order status\n5. Orders are saved to your account"
        },

        // Seller
        "seller": {
            keywords: ["seller", "sell", "upload product", "add product", "become seller"],
            response: "🏢 Seller Guide:\n\n1. Click '🏢 Seller' to create a seller account\n2. Login to your seller dashboard\n3. Upload products with name, price, description, image URL, and type\n4. View and manage your products\n5. See all customer orders in 'View All Orders'\n6. Edit or delete your products anytime"
        },

        // Search & Navigation
        "search": {
            keywords: ["search", "find product", "looking for", "where is"],
            response: "🔍 Search & Navigation:\n\n1. Use the search bar in the header\n2. Type product name and press Enter\n3. Browse by categories in the sidebar (Home page)\n4. Click on product names/images for details\n5. Use navigation links in header to move between pages"
        },

        // Theme
        "theme": {
            keywords: ["theme", "color", "pink", "green", "change theme", "girl theme"],
            response: "🎨 Theme Options:\n\n1. Click 'Girl theme' button in header to switch to pink theme\n2. Click 'Default theme' to switch back to green\n3. Your theme preference is saved automatically\n4. Theme applies to all pages"
        },

        // Technical Issues
        "not working": {
            keywords: ["not working", "broken", "error", "bug", "problem", "issue"],
            response: "🔧 Troubleshooting:\n\n1. Refresh the page (F5 or Ctrl+R)\n2. Clear browser cache and cookies\n3. Make sure you're logged in\n4. Check if you have enough coins for purchase\n5. Try a different browser\n6. Make sure JavaScript is enabled\n\nIf issues persist, try logging out and back in."
        },

        "logout": {
            keywords: ["logout", "log out", "sign out"],
            response: "To logout:\n\n1. Click the 'Logout' button in the header\n2. You'll be redirected to the login page\n3. Your cart and wishlist are saved locally\n4. Your orders are saved to your account"
        }
    }
};

class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatbotUI();
        this.attachEventListeners();
        this.addMessage('bot', this.getRandomGreeting());
    }

    createChatbotUI() {
        const chatbotHTML = `
      <div id="chatbot-container" class="chatbot-closed">
        <div id="chatbot-button" class="chatbot-button">
          <span class="chatbot-icon">💬</span>
          <span class="chatbot-text">Help</span>
        </div>
        
        <div id="chatbot-window" class="chatbot-window">
          <div class="chatbot-header">
            <div>
              <h3>🤖 Support Bot</h3>
              <p>Ask me anything!</p>
            </div>
            <button id="chatbot-close" class="chatbot-close-btn">✕</button>
          </div>
          
          <div id="chatbot-messages" class="chatbot-messages"></div>
          
          <div class="chatbot-quick-replies">
            <button class="quick-reply" data-query="How do I earn coins?">💰 Earn Coins</button>
            <button class="quick-reply" data-query="How to checkout?">🛒 Checkout</button>
            <button class="quick-reply" data-query="Login issues">🔐 Login Help</button>
            <button class="quick-reply" data-query="How to play game?">🎮 Game Guide</button>
          </div>
          
          <div class="chatbot-input-area">
            <input 
              type="text" 
              id="chatbot-input" 
              placeholder="Type your question..."
              autocomplete="off"
            />
            <button id="chatbot-send" class="chatbot-send-btn">Send</button>
          </div>
        </div>
      </div>
    `;

        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    attachEventListeners() {
        const button = document.getElementById('chatbot-button');
        const closeBtn = document.getElementById('chatbot-close');
        const sendBtn = document.getElementById('chatbot-send');
        const input = document.getElementById('chatbot-input');
        const quickReplies = document.querySelectorAll('.quick-reply');

        button.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.toggleChatbot());
        sendBtn.addEventListener('click', () => this.handleUserMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });

        quickReplies.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.target.getAttribute('data-query');
                this.handleUserMessage(query);
            });
        });
    }

    toggleChatbot() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbot-container');

        if (this.isOpen) {
            container.classList.remove('chatbot-closed');
            container.classList.add('chatbot-open');
            document.getElementById('chatbot-input').focus();
        } else {
            container.classList.remove('chatbot-open');
            container.classList.add('chatbot-closed');
        }
    }

    handleUserMessage(predefinedMessage = null) {
        const input = document.getElementById('chatbot-input');
        const message = predefinedMessage || input.value.trim();

        if (!message) return;

        this.addMessage('user', message);
        input.value = '';

        setTimeout(() => {
            const response = this.getResponse(message);
            this.addMessage('bot', response);
        }, 500);
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}-message`;

        const avatar = sender === 'bot' ? '🤖' : '👤';
        messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">${text.replace(/\n/g, '<br>')}</div>
    `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    getResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Check each FAQ category
        for (const [key, faq] of Object.entries(chatbotData.faqs)) {
            if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return faq.response;
            }
        }

        // Default response
        return `I'm not sure about that. Here are some common topics I can help with:\n\n💰 Earning coins\n🛒 Shopping & checkout\n🎮 Playing the game\n🔐 Login issues\n🏢 Becoming a seller\n📦 Viewing orders\n\nTry asking about any of these!`;
    }

    getRandomGreeting() {
        return chatbotData.greetings[Math.floor(Math.random() * chatbotData.greetings.length)];
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
