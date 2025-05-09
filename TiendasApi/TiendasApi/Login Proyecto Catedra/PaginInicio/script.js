// vars
'use strict'
var	testim = document.getElementById("testim"),
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
;

window.onload = function() {

    // Testim Script
    function playSlide(slide) {
        for (var k = 0; k < testimDots.length; k++) {
            testimContent[k].classList.remove("active");
            testimContent[k].classList.remove("inactive");
            testimDots[k].classList.remove("active");
        }

        if (slide < 0) {
            slide = currentSlide = testimContent.length-1;
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
        testimTimer = setTimeout(function() {
            playSlide(currentSlide += 1);
        }, testimSpeed)
    }

    testimLeftArrow.addEventListener("click", function() {
        playSlide(currentSlide -= 1);
    })

    testimRightArrow.addEventListener("click", function() {
        playSlide(currentSlide += 1);
    })    

    for (var l = 0; l < testimDots.length; l++) {
        testimDots[l].addEventListener("click", function() {
            playSlide(currentSlide = testimDots.indexOf(this));
        })
    }

    playSlide(currentSlide);

    // keyboard shortcuts
    document.addEventListener("keyup", function(e) {
        switch (e.keyCode) {
            case 37:
                testimLeftArrow.click();
                break;
                
            case 39:
                testimRightArrow.click();
                break;

            case 39:
                testimRightArrow.click();
                break;

            default:
                break;
        }
    })
		
		testim.addEventListener("touchstart", function(e) {
				touchStartPos = e.changedTouches[0].clientX;
		})
	
		testim.addEventListener("touchend", function(e) {
				touchEndPos = e.changedTouches[0].clientX;
			
				touchPosDiff = touchStartPos - touchEndPos;
			
				console.log(touchPosDiff);
				console.log(touchStartPos);	
				console.log(touchEndPos);	

			
				if (touchPosDiff > 0 + ignoreTouch) {
						testimLeftArrow.click();
				} else if (touchPosDiff < 0 - ignoreTouch) {
						testimRightArrow.click();
				} else {
					return;
				}
			
		})
}
document.body.classList.add("light-theme");

document.getElementById("theme-toggle").addEventListener("click", () => {
	document.body.classList.toggle("dark-theme");
	document.body.classList.toggle("light-theme");
});

// Duplicate cards for infinite scroll loop
const track = document.getElementById("cards-track");
track.innerHTML += track.innerHTML;


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