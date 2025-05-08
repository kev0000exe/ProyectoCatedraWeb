const videoContainer = document.querySelector('.video-container');
const footer = document.querySelector('footer');
const navbar = document.querySelector('.navbar_container'); // Selecciona el navbar
const video = document.querySelector('#Menu2');

window.addEventListener('scroll', () => {
  const footerTop = footer.getBoundingClientRect().top;
  const navbarBottom = navbar.getBoundingClientRect().bottom;

  if (navbarBottom <= 0 && footerTop > window.innerHeight) {
    // Si el navbar ya no es visible y el footer no está visible, fija el video
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.bottom = 'auto';
    video.style.zIndex = '1'; // Asegura que el video esté detrás del footer
  } else if (footerTop <= window.innerHeight) {
    // Si el footer es visible, permite que el footer lo cubra
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.zIndex = '-1'; // Envía el video detrás del footer
  } else {
    // Si el navbar es visible, regresa el video a su posición original
    video.style.position = 'absolute';
    video.style.top = '0';
    video.style.bottom = 'auto';
    video.style.zIndex = '1'; // Restaura el z-index del video
  }
});




function addToCart(product) {
  // Obtener el carrito actual desde localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Buscar si el producto ya existe en el carrito
  const existing = cart.find(p => p.name === product.name);
  if (existing) {
    // Si el producto ya existe, incrementar su cantidad
    existing.quantity += 1;
  } else {
    // Si el producto no existe, agregarlo con cantidad inicial de 1
    cart.push({ ...product, quantity: 1 });
  }

  // Guardar el carrito actualizado en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Actualizar la burbuja del carrito
  updateCartBubble();

  // Mostrar una alerta opcional
  alert("Producto agregado al carrito");
}

// Función para actualizar la burbuja del carrito
function updateCartBubble() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);

  const cartBubble = document.getElementById("cart-bubble");
  if (cartBubble) {
    cartBubble.textContent = cartCount;
    cartBubble.style.display = cartCount > 0 ? "flex" : "none";
  }
}

// Inicializar la burbuja del carrito al cargar la página
document.addEventListener("DOMContentLoaded", updateCartBubble);