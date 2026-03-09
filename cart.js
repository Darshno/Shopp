// cart.js

document.addEventListener("DOMContentLoaded", renderCart);

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cart");
  const totalDiv = document.getElementById("total");

  container.innerHTML = "";
  totalDiv.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-message"><h3>Your cart is empty</h3><p>Start shopping to add items!</p></div>';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    // Validate item data
    const imgage = item.image;
    const itemName = item.name || "Unknown Product";
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.qty) || 1;

    total += itemPrice * itemQty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
    <div>
    <img src="${imgage}" alt="Product: ${itemName}" style="width:100px" class="product-image"></div>
      <div class="item-details">
      <h3>${itemName}</h3>     
      </div>
      <div class="item-actions">
      <button onclick="inc('${item._id}')" style="background: #1c9911; color: white;  border: none;  cursor: pointer;">+</button>
       <p style="margin:5px 0px;">${itemQty}</p>
      <button onclick="dec('${item._id}')" style="background: #ff0707; color: white; ; border: none;  cursor: pointer;">−</button>
      <button onclick="removeItem('${item._id}')" style="background: #f07380; color: white; padding: 3px 8px; border: none;  cursor: pointer;"><span class="material-symbols-outlined">
delete
</span></button>
    <p style="font-size: 30px; color: #417f7a; font-weight: bold;">Rs.${itemPrice}</p>
      </div>
    `;

    container.appendChild(div);
  });

  totalDiv.innerText = "Total: Rs." + total;
}

function inc(id) {
  const cart = getCart();
  const item = cart.find(p => p._id === String(id));

  if (!item) return;

  item.qty++;
  saveCart(cart);
  renderCart();
}

function dec(id) {
  let cart = getCart();
  const item = cart.find(p => p._id === String(id));

  if (!item) return;

  if (item.qty > 1) {
    item.qty--;
  } else {
    cart = cart.filter(p => p._id !== String(id));
  }

  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter(p => p._id !== id);
  saveCart(cart);
  renderCart();
}
