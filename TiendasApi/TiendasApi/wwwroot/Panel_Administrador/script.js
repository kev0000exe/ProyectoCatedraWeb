const rolUsuario = localStorage.getItem('userRole');

if (rolUsuario === 'Admin') {
    // Validar si el elemento existe antes de cambiar su estilo para evitar errores
    const pestanaAdmin = document.getElementById('pestana-admin');
    if (pestanaAdmin) {
        pestanaAdmin.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();
    cargarResumenDashboard(); // <--- AQUÍ MANDAMOS A LLAMAR LOS NÚMEROS
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

            // --- PASO 3: VARIABLES REALES PARA LA TABLA ---
            const totalGastado = usuario.totalGastado ? usuario.totalGastado.toFixed(2) : "0.00";
            const cantidadPedidos = usuario.cantidadPedidos || 0;
            const fechaUltimo = usuario.ultimoPedido ? new Date(usuario.ultimoPedido).toLocaleDateString() : "N/A";
            // ----------------------------------------------

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
                <td><span class="mono-num">$${totalGastado}</span></td>
                <td><span class="mono-num">${cantidadPedidos}</span></td>
                <td style="color:var(--color-text-secondary);font-size:11px;">${fechaUltimo}</td>
                <td><span class="status-pill ${claseEstado}">${iconoEstado} ${tipo}</span></td>
                <td>
                    <div class="progress-cell">
                        <div class="prog-bar"><div class="prog-fill" style="width:70%;"></div></div>
                        <span class="prog-pct">70%</span>
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

// --- FUNCIÓN PARA EL DASHBOARD DE NÚMEROS ---
async function cargarResumenDashboard() {
    console.log("Intentando cargar resumen...");
    try {
        // Usamos el mismo puerto que ya tenías: 7151
        const urlResumen = 'https://localhost:7151/api/Dashboard/resumen';

        const response = await fetch(urlResumen);

        if (!response.ok) {
            throw new Error("Error al consultar la API de resumen");
        }

        const data = await response.json();
        console.log("Resumen recibido:", data);

        // Inyectamos los datos en el HTML
        document.getElementById('dash-ganancias').innerText = `$${data.ganancias.toFixed(2)}`;
        document.getElementById('dash-clientes').innerText = data.clientes;
        document.getElementById('dash-pedidos').innerText = data.pedidos;
        document.getElementById('dash-ticket').innerText = `$${data.ticket.toFixed(2)}`;

    } catch (error) {
        console.error("Error cargando el dashboard:", error);
    }
}