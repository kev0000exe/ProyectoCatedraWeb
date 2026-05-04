// Simulamos que al iniciar sesión guardaste el rol en el LocalStorage
const rolUsuario = localStorage.getItem('userRole'); // Ejemplo: 'Admin' o 'User'

if (rolUsuario === 'Admin') {
    // Si es administrador, buscamos la pestaña y la mostramos
    document.getElementById('pestana-admin').style.display = 'block'; // o 'list-item'
}
// Componente Header

// 1. VALIDACIÓN DE ADMINISTRADOR (La ponemos primero)
document.addEventListener("DOMContentLoaded", function () {
    const correo = localStorage.getItem("correoUsuario");
    console.log("Correo detectado:", correo); // Te ayudará a ver en consola si guardó bien el correo

    if (correo === "kevin@hotmail.com") {
        const pestanaAdmin = document.getElementById("pestana-admin");
        if (pestanaAdmin) {
            // Usamos 'list-item' en vez de 'block' para que no rompa el diseño de tu menú
            pestanaAdmin.style.display = "list-item";
        }
    }
});