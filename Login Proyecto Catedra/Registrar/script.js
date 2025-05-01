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
