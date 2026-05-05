// --- LÓGICA DEL VIDEO ---
window.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    const navbar = document.querySelector('.navbar_container');
    const video = document.querySelector('#Menu2');
    if (!footer || !navbar || !video) return;

    const footerTop = footer.getBoundingClientRect().top;
    if (footerTop <= window.innerHeight) {
        video.style.zIndex = '-1';
    } else {
        video.style.zIndex = '1';
    }
});

// --- LÓGICA DEL CARRITO ---
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.name === product.name);
    if (existing) { existing.quantity += 1; }
    else { cart.push({ ...product, quantity: 1 }); }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBubble(); // Solo actualiza el número, no abre el modal
}

function toggleCartModal() {
    const modal = document.getElementById('cart-modal-overlay');
    if (modal) {
        const isActive = modal.classList.toggle('active');
        if (isActive) renderCartInModal();
    }
}

function updateCartBubble() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const bubble = document.getElementById("cart-bubble");
    if (bubble) {
        bubble.textContent = total;
        bubble.style.display = total > 0 ? "flex" : "none";
    }
}

// 1. Nueva función para eliminar un producto específico
function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Filtramos el carrito para quitar el producto que coincida con el nombre
    cart = cart.filter(item => item.name !== productName);

    // Guardamos el nuevo carrito y actualizamos todo
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBubble();
    renderCartInModal(); // Refrescamos el modal para que desaparezca la fila
}

// 2. Función renderizar actualizada con el botón eliminar
function renderCartInModal() {
    const container = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = '<p style="color: #9B9189; padding: 20px; text-align: center;">Tu carrito está vacío</p>';
        totalPriceElement.textContent = "$0.00";
        return;
    }

    cart.forEach(item => {
        const productRow = document.createElement('div');
        productRow.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #EDE8DF;";

        productRow.innerHTML = `
            <div style="text-align: left; display: flex; align-items: center; gap: 10px;">
                <img src="${item.image}" style="width: 40px; height: 40px; border-radius: 5px; object-fit: cover;">
                <div>
                    <div style="font-weight: 700; color: #2C1A0E; font-size: 0.95rem;">${item.name}</div>
                    <div style="color: #8B6340; font-size: 0.85rem;">${item.quantity} x $${item.price.toFixed(2)}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-weight: 700; color: #2C1A0E;">$${(item.price * item.quantity).toFixed(2)}</div>
                <button onclick="removeFromCart('${item.name}')" style="background: none; border: none; color: #e74c3c; cursor: pointer; font-size: 1.2rem; padding: 0 5px;">
                    &times;
                </button>
            </div>
        `;
        container.appendChild(productRow);
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}