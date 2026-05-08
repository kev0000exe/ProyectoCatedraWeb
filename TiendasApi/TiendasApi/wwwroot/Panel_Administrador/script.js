
const rolUsuario = localStorage.getItem('userRole'); 

if (rolUsuario === 'Admin') {
    
    document.getElementById('pestana-admin').style.display = 'block'; 
}

document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();
});

async function cargarClientes() {
    console.log("Intentando cargar clientes...");
    try {

        const urlApi = 'https://localhost:7151/api/Usuarios/obtener-todos';

        const respuesta = await fetch(urlApi);
        const usuarios = await respuesta.json();

        console.log("Usuarios recibidos:", usuarios);

        const tbody = document.getElementById('tabla-clientes');
        tbody.innerHTML = ''; 
        usuarios.forEach(usuario => {

            const nombres = usuario.nombre ? usuario.nombre.split(' ') : ['U'];
            let iniciales = nombres[0].charAt(0).toUpperCase();
            if (nombres.length > 1) iniciales += nombres[1].charAt(0).toUpperCase();

            const tipo = usuario.tipoUsuario || 'Normal';
            const esVip = tipo.toLowerCase() === 'vip';


            const claseEstado = esVip ? 's-active' : 's-pending';
            const iconoEstado = esVip ? '●' : '◐';
            const claseAvatar = esVip ? 'av-green' : 'av-blue';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>
                    <div class="client-cell">
                        <div class="av-sm ${claseAvatar}">${iniciales}</div>
                        <div>
                            <div class="client-name">${usuario.nombre}</div>
                            <div class="client-email">${usuario.email}</div>
                        </div>
                    </div>
                </td>
                <td><span class="mono-num">$0.00</span></td>
                <td><span class="mono-num">0</span></td>
                <td style="color:var(--color-text-secondary);font-size:11px;">N/A</td>
                <td><span class="status-pill ${claseEstado}">${iconoEstado} ${tipo}</span></td>
                <td>
                    <div class="progress-cell">
                        <div class="prog-bar"><div class="prog-fill" style="width:0%;"></div></div>
                        <span class="prog-pct">0%</span>
                    </div>
                </td>
                <td style="text-align:right;">
                    <button class="btn-sm" style="font-size:10px;padding:3px 8px;">Ver</button>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al conectar con la API:", error);
    }
}