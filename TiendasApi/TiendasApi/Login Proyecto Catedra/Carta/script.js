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
    updateCartBubble();
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

function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBubble();
    renderCartInModal();
}

// --- FUNCIÓN PROCESAR COMPRA CORREGIDA ---
const procesarCompra = async () => {
    // ESTA ES LA LÍNEA QUE FALTABA: Obtener el carrito antes de usarlo
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Ajustado a los nombres exactos de tu clase DetallePedido en C#
    const datosPedido = cart.map(item => ({
        // Ponemos el ID 3 porque es el primero que aparece en tu SQL
        ProductoId: 3,
        Cantidad: item.quantity,
        PrecioUnitario: item.price
    }));

    try {
        const response = await fetch('https://localhost:7151/api/Carrito/finalizar-compra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPedido)
        });

        if (response.ok) {
            alert("¡Compra procesada con éxito!");
            localStorage.removeItem("cart");
            location.reload();
        } else {
            const errorMsg = await response.text();
            console.error("Error del servidor:", errorMsg);
            alert("Hubo un error al guardar la compra.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }
};

// --- RENDERIZAR EN EL MODAL ---
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

// Inicializar la burbuja al cargar la página
document.addEventListener('DOMContentLoaded', updateCartBubble);

// Asignar el evento al botón de finalizar compra (asegúrate de que el ID coincida en tu HTML)
// Si tu botón de compra ya tiene un onclick="procesarCompra()" en el HTML, esta parte no es necesaria.