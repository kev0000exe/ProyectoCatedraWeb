'use strict';

// Seleccionamos los elementos del DOM
var testim = document.querySelector('.testim-wrap'), // Contenedor para gestos táctiles
    testimDots = Array.prototype.slice.call(document.getElementById("testim-dots").children),
    testimContent = Array.prototype.slice.call(document.getElementById("testim-content").children),
    testimLeftArrow = document.getElementById("left-arrow"),
    testimRightArrow = document.getElementById("right-arrow"),
    testimSpeed = 4500,
    currentSlide = 0,
    currentActive = 0,
    testimTimer,
    touchStartPos,
    touchEndPos,
    touchPosDiff,
    ignoreTouch = 30;

window.onload = function () {

    // --- LÓGICA DE TESTIMONIOS ---
    function playSlide(slide) {
        for (var k = 0; k < testimDots.length; k++) {
            testimContent[k].classList.remove("active");
            testimContent[k].classList.remove("inactive");
            testimDots[k].classList.remove("active");
        }

        if (slide < 0) {
            slide = currentSlide = testimContent.length - 1;
        }

        if (slide > testimContent.length - 1) {
            slide = currentSlide = 0;
        }

        if (currentActive != currentSlide) {
            testimContent[currentActive].classList.add("inactive");
        }
        testimContent[slide].classList.add("active");
        testimDots[slide].classList.add("active");

        currentActive = currentSlide;

        clearTimeout(testimTimer);
        testimTimer = setTimeout(function () {
            playSlide(currentSlide += 1);
        }, testimSpeed);
    }

    testimLeftArrow.addEventListener("click", function () {
        playSlide(currentSlide -= 1);
    });

    testimRightArrow.addEventListener("click", function () {
        playSlide(currentSlide += 1);
    });

    testimDots.forEach((dot, index) => {
        dot.addEventListener("click", function () {
            playSlide(currentSlide = index);
        });
    });

    playSlide(currentSlide);

    // --- ATAJOS DE TECLADO ---
    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 37: // Flecha Izquierda
                testimLeftArrow.click();
                break;
            case 39: // Flecha Derecha
                testimRightArrow.click();
                break;
        }
    });

    // --- GESTOS TÁCTILES (SWIPE) ---
    testim.addEventListener("touchstart", function (e) {
        touchStartPos = e.changedTouches[0].clientX;
    });

    testim.addEventListener("touchend", function (e) {
        touchEndPos = e.changedTouches[0].clientX;
        touchPosDiff = touchStartPos - touchEndPos;

        // Si el valor es positivo, deslizó a la izquierda -> Siguiente
        if (touchPosDiff > ignoreTouch) {
            testimRightArrow.click();
        }
        // Si el valor es negativo, deslizó a la derecha -> Anterior
        else if (touchPosDiff < -ignoreTouch) {
            testimLeftArrow.click();
        }
    });

    // --- MAPA (Leaflet) ---
    // Asegúrate de tener el CSS y JS de Leaflet en el <head>
    if (document.getElementById('map')) {
        var map = L.map('map').setView([40.7128, -74.0060], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        L.marker([40.7128, -74.0060]).addTo(map).bindPopup('AirRodCoffe Store').openPopup();

        // Forzar renderizado correcto por si el contenedor estaba oculto
        setTimeout(() => { map.invalidateSize(); }, 500);
    }
};

// --- CARRUSEL INFINITO (Duplicar tarjetas) ---
const track = document.getElementById("cardsTrack");
if (track) {
    track.innerHTML += track.innerHTML;
}

// --- LÓGICA DEL CARRITO ---
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(p => p.name === product.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBubble();
    alert("¡Producto añadido! ☕");
}

function updateCartBubble() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);
    const cartBubble = document.querySelector(".cart-bubble"); // Selecciona tu burbuja

    if (cartBubble) {
        cartBubble.textContent = cartCount;
        cartBubble.style.display = cartCount > 0 ? "flex" : "none";
    }
}

// Inicializar burbuja al cargar
document.addEventListener("DOMContentLoaded", updateCartBubble);

// --- API FETCH (CREAR USUARIO) ---
// Nota: 'usuario' debe estar definido para que esto no de error.
function enviarUsuario(usuario) {
    fetch("https://localhost:7151/api/usuarios/crearUsuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
        .then(response => response.json())
        .then(data => console.log('Usuario creado:', data))
        .catch(error => console.error('Error al crear usuario:', error));
}

// Simulamos que al iniciar sesión guardaste el rol en el LocalStorage
const rolUsuario = localStorage.getItem('userRole'); // Ejemplo: 'Admin' o 'User'

if (rolUsuario === 'Admin') {
    // Si es administrador, buscamos la pestaña y la mostramos
    document.getElementById('pestana-admin').style.display = 'block'; // o 'list-item'
}