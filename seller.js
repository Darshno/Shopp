const API = API_ENDPOINTS.products.replace('/products', '');

// Check authentication
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
  window.location.href = "seller-login.html";
}

document.getElementById("sellerName").innerText = `Welcome, ${user.name}`;

async function uploadProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;
  const type = document.getElementById("type").value;

  if (!name || !price || !description || !image || !type) {
    toast.warning("Please fill all fields");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first");
    setTimeout(() => window.location.href = "client.html", 1500);
    return;
  }

  const res = await fetch(`${API}/add-product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, price, description, image, type })
  });

  const data = await res.json();

  if (res.ok) {
    toast.success("Product uploaded successfully");
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("description").value = "";
    document.getElementById("image").value = "";
    document.getElementById("type").value = "";
    loadProducts();
  } else {
    toast.error(data.message || "Failed to upload product");
  }
}

async function loadProducts() {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first");
    setTimeout(() => window.location.href = "client.html", 1500);
    return;
  }

  const res = await fetch(`${API}/seller-products`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const products = await res.json();
  const container = document.getElementById("productList");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products yet</p>";
    return;
  }

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <h3>${p.name}</h3>
      <p>Price: Rs.${p.price}</p>
      <p>${p.description}</p>
      <p>Type: ${p.type}</p>
      <button class="btn-primary" onclick="editProduct('${p._id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.description.replace(/'/g, "\\'")}', '${p.image}', '${p.type}')">Edit</button>
      <button class="btn-danger" onclick="deleteProduct('${p._id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

function editProduct(id, name, price, description, image, type) {
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Fill form with product data
  document.getElementById("name").value = name;
  document.getElementById("price").value = price;
  document.getElementById("description").value = description;
  document.getElementById("image").value = image;
  document.getElementById("type").value = type;

  // Change button to update mode
  const uploadBtn = document.querySelector('.btn-primary[onclick="uploadProduct()"]');
  uploadBtn.textContent = 'Update Product';
  uploadBtn.onclick = () => updateProduct(id);

  // Add cancel button
  if (!document.getElementById('cancelEdit')) {
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelEdit';
    cancelBtn.className = 'btn-secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = cancelEdit;
    uploadBtn.parentNode.insertBefore(cancelBtn, uploadBtn.nextSibling);
  }
}

function cancelEdit() {
  // Clear form
  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  document.getElementById("image").value = "";
  document.getElementById("type").value = "";

  // Reset button
  const uploadBtn = document.querySelector('.btn-primary');
  uploadBtn.textContent = 'Upload Product';
  uploadBtn.onclick = uploadProduct;

  // Remove cancel button
  const cancelBtn = document.getElementById('cancelEdit');
  if (cancelBtn) cancelBtn.remove();
}

async function updateProduct(id) {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const image = document.getElementById("image").value;
  const type = document.getElementById("type").value;

  if (!name || !price || !description || !image || !type) {
    toast.warning("Please fill all fields");
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/update-product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, price, description, image, type })
  });

  const data = await res.json();

  if (res.ok) {
    toast.success("Product updated successfully");
    cancelEdit();
    loadProducts();
  } else {
    toast.error(data.message || "Failed to update product");
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/delete-product/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  toast.success(data.message);
  loadProducts();
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "seller-login.html";
}

loadProducts();