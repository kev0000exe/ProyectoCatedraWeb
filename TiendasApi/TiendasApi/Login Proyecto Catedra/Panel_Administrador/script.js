// Simulamos que al iniciar sesión guardaste el rol en el LocalStorage
const rolUsuario = localStorage.getItem('userRole'); // Ejemplo: 'Admin' o 'User'

if (rolUsuario === 'Admin') {
    // Si es administrador, buscamos la pestaña y la mostramos
    document.getElementById('pestana-admin').style.display = 'block'; // o 'list-item'
}