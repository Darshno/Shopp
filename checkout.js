// checkout.js

const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  toast.warning("Cart is empty");
  setTimeout(() => window.location.href = "index.html", 1500);
}

// Render order summary
const summaryDiv = document.getElementById("summary");

let subtotal = 0;
cart.forEach(item => {
  subtotal += item.price * item.qty;

  summaryDiv.innerHTML += `
    <p style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef;">
      <span>${item.name} × ${item.qty}</span>
      <span style="font-weight: 600;">Rs.${item.price * item.qty}</span>
    </p>
  `;
});

const taxRate = 0.18; // 18% GST
const taxAmount = subtotal >= 200 ? 0 : subtotal * taxRate; // No tax for orders Rs.200+
const total = subtotal + taxAmount;

summaryDiv.innerHTML += `
  <hr style="margin: 15px 0;">
  <p style="display: flex; justify-content: space-between; padding: 8px 0;">
    <span>Subtotal:</span>
    <span style="font-weight: 600;">Rs.${subtotal.toFixed(2)}</span>
  </p>
  ${subtotal >= 200 ? `
    <p style="display: flex; justify-content: space-between; padding: 8px 0; color: #28a745; font-weight: 600;">
      <span>Tax Waived (Order Rs.200+):</span>
      <span>-Rs.${(subtotal * taxRate).toFixed(2)}</span>
    </p>
  ` : `
    <p style="display: flex; justify-content: space-between; padding: 8px 0;">
      <span>Tax (GST 18%):</span>
      <span style="font-weight: 600; color: #11998e;">Rs.${taxAmount.toFixed(2)}</span>
    </p>
    <p style="font-size: 12px; color: #666; margin-top: 5px;">
      Spend Rs.${(200 - subtotal).toFixed(2)} more to get tax-free shopping
    </p>
  `}
  <hr style="margin: 15px 0;">
  <h3 style="display: flex; justify-content: space-between; color: #11998e;">
    <span>Total:</span>
    <span>Rs.${total.toFixed(2)}</span>
  </h3>
`;

// Place order
async function placeOrder() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !phone || !address) {
    toast.warning("Please fill all details");
    return;
  }

  // Check if user has enough coins
  const gameState = localStorage.getItem("gameState");
  if (!gameState) {
    toast.error("Play the game first to earn coins!");
    setTimeout(() => window.location.href = "game.html", 1500);
    return;
  }

  const state = JSON.parse(gameState);
  if (state.coins < total) {
    toast.error(`Not enough coins! You have ${Math.floor(state.coins)} coins but need ${Math.floor(total)} coins.`);
    setTimeout(() => window.location.href = "game.html", 2000);
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to place order");
    setTimeout(() => window.location.href = "client.html", 1500);
    return;
  }

  // Deduct coins
  state.coins -= total;
  localStorage.setItem("gameState", JSON.stringify(state));

  // FINAL ORDER OBJECT
  const order = {
    customer: {
      name,
      phone,
      address
    },
    items: cart,
    subtotal: subtotal,
    tax: taxAmount,
    total: total,
    status: "placed",
    createdAt: new Date()
  };

  console.log("ORDER:", order);

  try {
    const response = await fetch(API_ENDPOINTS.orders, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(order)
    });

    // Check if response is ok before parsing JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", errorText);
      toast.error("Error placing order. Please try again.");
      return;
    }

    const result = await response.json();

    toast.success(`Order placed successfully! ${Math.floor(total)} coins deducted.`);

    localStorage.removeItem("cart");
    setTimeout(() => window.location.href = "orders.html", 1500);
  } catch (err) {
    console.error("Error:", err);
    toast.error("Error placing order: " + err.message);
  }
}
