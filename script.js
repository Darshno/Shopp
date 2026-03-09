const API = API_ENDPOINTS.products;
let allProducts = [];
let currentCategory = 'all';
let searchQuery = '';

// Theme management
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

// Initialize theme button text on index page
function initThemeButton() {
  const savedTheme = localStorage.getItem('theme');
  const button = document.querySelector('button[onclick="swapStyleSheet()"]');

  if (button && savedTheme) {
    button.textContent = savedTheme === 'girl.css' ? 'Default theme' : 'Girl theme';
  }
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

// Filter products by search and category
function filterProducts(search = '') {
  searchQuery = search.toLowerCase();

  let filtered = allProducts;

  // Filter by category
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.type === currentCategory);
  }

  // Filter by search
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery) ||
      (p.description && p.description.toLowerCase().includes(searchQuery)) ||
      (p.type && p.type.toLowerCase().includes(searchQuery))
    );
  }

  renderProducts(filtered);
}

async function loadProducts() {
  const res = await fetch(API);
  allProducts = await res.json();

  loadCategories();
  renderProducts(allProducts);

  // Check for search query in URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  if (searchParam) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = searchParam;
      filterProducts(searchParam);
    }
  }
}

function loadCategories() {
  const categories = [...new Set(allProducts.map(p => p.type).filter(Boolean))];
  const categoriesContainer = document.getElementById("categories");

  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    li.onclick = () => filterByCategory(cat);
    categoriesContainer.appendChild(li);
  });
}

function filterByCategory(category) {
  currentCategory = category;

  const allItems = document.querySelectorAll("#categories li");
  allItems.forEach(item => item.classList.remove("active"));
  event.target.classList.add("active");

  filterProducts(searchQuery);
}

function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found</p>";
    return;
  }

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3 onclick="openProduct('${p._id}')">${p.name}</h3>
      <p>Rs.${p.price}</p>
      <p>${p.type} </p>
      <img src="${p.image}" onclick="openProduct('${p._id}')"/>
      <button onclick="addToCart('${p._id}')">Add to Cart</button>
      <button onclick="addToWishlist('${p._id}')">Wishlist</button>
    `;
    container.appendChild(div);
  });
}
function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function addToCart(productId) {
  const product = allProducts.find(p => p._id === productId);

  if (!product) {
    toast.error("Product not found");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const id = String(product._id);

  const item = cart.find(p => p._id === id);

  if (item) {
    item.qty++;
    // Update name and price in case they changed
    item.name = product.name;
    item.price = Number(product.price);
  } else {
    cart.push({
      _id: id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  toast.success("Added to cart!");
}

function addToWishlist(productId) {
  const product = allProducts.find(p => p._id === productId);

  if (!product) {
    toast.error("Product not found");
    return;
  }

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  const id = String(product._id);

  const item = wishlist.find(p => p._id === id);

  if (item) {
    toast.info("Already in wishlist!");
    return;
  }

  wishlist.push({
    _id: id,
    name: product.name,
    price: Number(product.price),
    description: product.description,
    image: product.image,
    type: product.type
  });

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  toast.success("Added to wishlist!");
}

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "client.html";
} else {

  document.getElementById("welcome").innerText =
    "Welcome, " + user.name;
}
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "client.html";
}

displayUserCoins();
loadProducts();
initThemeButton();
