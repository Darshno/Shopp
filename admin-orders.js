let allOrders = [];

document.addEventListener("DOMContentLoaded", loadAllOrders);

async function loadAllOrders() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "seller-login.html";
        return;
    }

    try {
        const res = await fetch(API_ENDPOINTS.allOrders, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Failed to fetch orders");
        }

        allOrders = await res.json();
        updateStats();
        renderOrders(allOrders);
    } catch (err) {
        console.error(err);
        document.getElementById("orders").innerHTML = '<div class="empty-message"><h3>Error loading orders</h3><p>' + err.message + '</p></div>';
    }
}

function updateStats() {
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);

    document.getElementById("totalOrders").innerText = totalOrders;
    document.getElementById("totalRevenue").innerText = "Rs." + totalRevenue;
}

function renderOrders(orders) {
    const container = document.getElementById("orders");

    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-message"><h3>No orders yet</h3></div>';
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
        <strong>Customer Details:</strong><br>
        Name: ${order.customer.name}<br>
        Phone: ${order.customer.phone}<br>
        Address: ${order.customer.address}
      </div>

      <div class="order-items">
        <strong>Items:</strong>
        ${itemsHTML}
      </div>

      <div class="order-total">
        Subtotal: Rs.${order.subtotal || order.total}<br>
        ${order.tax ? `Tax: Rs.${order.tax.toFixed(2)}<br>` : ''}
        <span style="font-size: 28px;">Total: Rs.${order.total}</span>
      </div>
    `;

        container.appendChild(div);
    });
}

function filterOrders() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();

    if (!searchTerm) {
        renderOrders(allOrders);
        return;
    }

    const filtered = allOrders.filter(order => {
        const orderId = order._id.toLowerCase();
        const customerName = order.customer.name.toLowerCase();
        const customerPhone = order.customer.phone.toLowerCase();

        return orderId.includes(searchTerm) ||
            customerName.includes(searchTerm) ||
            customerPhone.includes(searchTerm);
    });

    renderOrders(filtered);
}

function clearFilter() {
    document.getElementById("searchInput").value = "";
    renderOrders(allOrders);
}
