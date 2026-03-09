document.addEventListener("DOMContentLoaded", renderWishlist);

function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function renderWishlist() {
    const wishlist = getWishlist();
    const container = document.getElementById("wishlist");

    container.innerHTML = "";

    if (wishlist.length === 0) {
        container.innerHTML = '<div class="empty-message"><h3>Your wishlist is empty</h3><p>Add products you love to your wishlist!</p></div>';
        return;
    }

    wishlist.forEach(item => {
        const div = document.createElement("div");
        div.className = "wishlist-item";
        div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>${item.description || ''}</p>
        <p><strong>Rs.${item.price}</strong></p>
        <p>Type: ${item.type}</p>
      </div>
      <div class="item-actions">
        <button class="btn-cart" onclick="moveToCart('${item._id}')">Add to Cart</button>
        <button class="btn-remove" onclick="removeFromWishlist('${item._id}')">Remove</button>
      </div>
    `;
        container.appendChild(div);
    });
}

function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(item => item._id !== productId);
    saveWishlist(wishlist);
    renderWishlist();
}

function moveToCart(productId) {
    const wishlist = getWishlist();
    const product = wishlist.find(item => item._id === productId);

    if (!product) return;

    // Add to cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find(p => p._id === productId);

    if (cartItem) {
        cartItem.qty++;
    } else {
        cart.push({
            _id: product._id,
            name: product.name,
            price: Number(product.price),
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Remove from wishlist
    removeFromWishlist(productId);

    toast.success("Moved to cart!");
}
