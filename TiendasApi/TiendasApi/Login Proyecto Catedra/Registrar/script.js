fetch("https://localhost:7151/api/usuarios/crearUsuario", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
})
.then(response => response.json())
.then(data => {
    console.log('Usuario creado:', data);
})
.catch(error => {
    console.error('Error al crear usuario:', error);
});


// Función para agregar productos al carrito
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