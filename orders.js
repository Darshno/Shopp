document.addEventListener("DOMContentLoaded", loadOrders);

async function loadOrders() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "client.html";
    return;
  }

  try {
    const res = await fetch(API_ENDPOINTS.orders, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const orders = await res.json();
    renderOrders(orders);
  } catch (err) {
    console.error(err);
    document.getElementById("orders").innerHTML = '<div class="empty-message"><h3>Error loading orders</h3><p>' + err.message + '</p></div>';
  }
}

function renderOrders(orders) {
  const container = document.getElementById("orders");

  if (orders.length === 0) {
    container.innerHTML = '<div class="empty-message"><h3>No orders yet</h3><p>Start shopping to place your first order!</p></div>';
    return;
  }

  container.innerHTML = "";

  orders.forEach(order => {
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const div = document.createElement("div");
    div.className = "order-card";

    let itemsHTML = "";
    order.items.forEach(item => {
      itemsHTML += `
        <div class="order-item">
          <span>${item.name} × ${item.qty}</span>
          <span>Rs.${item.price * item.qty}</span>
        </div>
      `;
    });

    div.innerHTML = `
      <div class="order-header">
        <div>
          <div class="order-id">Order #${order._id.slice(-8).toUpperCase()}</div>
          <small>${orderDate}</small>
        </div>
        <div class="order-status">${order.status.toUpperCase()}</div>
      </div>

      <div class="customer-details">
        <strong>Delivery Details:</strong><br>
        ${order.customer.name}<br>
        ${order.customer.phone}<br>
      </div>

      <div class="order-items">
        <strong>Items:</strong>
        ${itemsHTML}
      </div>

      <div class="order-total">
        Subtotal: Rs.${order.subtotal || order.total}<br>
        ${order.tax ? `Tax: Rs.${order.tax.toFixed(2)}<br>` : ''}
        <span >Total: Rs.${order.total}</span>
      </div>
    `;

    container.appendChild(div);
  });
}
