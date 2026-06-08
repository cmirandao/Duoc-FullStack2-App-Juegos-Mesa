/*
 * Logica para el Panel de Administracion
 * Gestiona el inventario de juegos, la lista de usuarios y roles.
 */
document.addEventListener('DOMContentLoaded', () => {
    const sesionActiva = localStorage.getItem('sesionActiva');
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));

    // Verifico sesion, si no esta logueado lo devuelvo al catalogo
    if (sesionActiva !== 'true' || !usuarioSesion || usuarioSesion.rol !== 'admin') {
        window.location.href = '../index.html';
        return;
    }

    /*
     * INICIALIZACION 
     */
    // Me aseguro de que los juegos tengan id
    inicializarIdsJuegos();
    // Renderizo el dashboard al cargar la pagina
    renderizarDashboard();
    // Renderizo las tablas al cargar la pagina
    renderizarTablaAdmin();
    renderizarTablaUsuarios();

    const displayNombre = document.getElementById('displayNombre');

    // Muestra el nombre del administrador logueado
    if (displayNombre) displayNombre.innerText = usuarioSesion.nombre || 'Usuario';

    // Alternar vistas de tablas (Inventario y Usuarios)
    const linkInventario = document.querySelector('a[href="admin.html"]');
    const linkUsuarios = document.getElementById('linkUsuarios');
    const secInv = document.getElementById('seccionInventario');
    const secUsu = document.getElementById('seccionUsuarios');
    
    if (linkInventario && secInv && secUsu) {
        linkInventario.addEventListener('click', (e) => {
            e.preventDefault();
            secInv.style.display = 'block';
            secUsu.style.display = 'none';
        });
    }

    if (linkUsuarios && secInv && secUsu) {
        linkUsuarios.addEventListener('click', (e) => {
            e.preventDefault();
            secInv.style.display = 'none';
            secUsu.style.display = 'block';
        });
    }
});

// Si los juegos no poseen id le creo uno (index+1)
function inicializarIdsJuegos() {
    let juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    let modificado = false;

    juegos = juegos.map((juego, index) => {
        if (!juego.id) {
            modificado = true;
            return { ...juego, id: index + 1, stock: parseInt(juego.stock) || 0 };
        }
        return juego;
    });

    if (modificado) {
        localStorage.setItem('juegos', JSON.stringify(juegos));
    }
}

// Actualizacion del dashboard
function renderizarDashboard() {
    const juegos = JSON.parse(localStorage.getItem('juegos')) || [];

    // Contar productos con stock < 5
    const stockBajo = juegos.filter(j => j.stock < 5).length;
    const statStock = document.getElementById('statStockBajo');

    const statUser = document.getElementById('statUsuarios');

    if (statStock) statStock.innerText = `${stockBajo} Juegos`;

    // Cuenta la cantidad de usuarios registrados
    const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    if (statUser) statUser.innerText = `${usuarios.length} Usuarios`;
}

// Renderizado de la tabla de Usuarios
function renderizarTablaUsuarios() {
    const tbody = document.querySelector('.tabla-usuarios tbody');
    if (!tbody) return;

    const usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));
    const esAdminMaestro = usuarioSesion && usuarioSesion.email === 'admin@sev.cl';

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay usuarios registrados.</td></tr>';
        return;
    }
    tbody.innerHTML = '';

    usuarios.forEach(u => {
        const esAdmin = u.rol === 'admin';
        const tr = document.createElement('tr');
        // Solo si es el admin maestro puede editar roles, otro admin solo puede visualizarlos
        const celdaAccion = esAdminMaestro
            ? `<button class="btn btn-sm ${esAdmin ? 'btn-danger' : 'btn-success'}" onclick="toggleRol('${u.username}')">
                 ${esAdmin ? 'Admin' : 'Cliente'}
               </button>`
            : `<span class="badge ${esAdmin ? 'bg-danger' : 'bg-success'}">${esAdmin ? 'Admin' : 'Cliente'}</span>`;

        tr.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.username}</td>
            <td>${u.email}</td>
            <td class="text-center">${celdaAccion}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Cambiar rol por defecto cliente por admin y viveversa
function toggleRol(username) {
    // Privilegio solo de admin maestro
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));
    if (!usuarioSesion || usuarioSesion.email !== 'admin@sev.cl') return;

    let usuarios = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
    const userIndex = usuarios.findIndex(u => u.username === username);

    // No permitir cambios si es el admin maestro
    if (userIndex !== -1 && usuarios[userIndex].email !== 'admin@sev.cl') {
        usuarios[userIndex].rol = (usuarios[userIndex].rol === 'admin') ? 'cliente' : 'admin';
        localStorage.setItem('usuariosRegistrados', JSON.stringify(usuarios));

        renderizarTablaUsuarios();
    }
}

// Inicializacion de tooltips
function inicializarTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Renderizado tabla juegos
function renderizarTablaAdmin() {
    const tbody = document.querySelector('.tabla-admin tbody');
    if (!tbody) return;
    const juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    tbody.innerHTML = juegos.length === 0
        ? '<tr><td colspan="6" class="text-center">No hay juegos registrados.</td></tr>'
        : juegos.map(juego => `
            <tr>
                <td>#${juego.id}</td>
                <td class="fw-bold">${juego.nombre}</td>
                <td>${juego.categoria}</td>
                <td>${juego.precio}</td>
                <td><span class="badge ${juego.stock < 5 ? 'bg-danger' : 'bg-success'}">${juego.stock}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" 
                    onclick="confirmarEliminar(${juego.id})"
                    data-bs-toggle="tooltip" 
                    data-bs-placement="top" 
                    title="Eliminar Item">
                        <span class="material-symbols-outlined fs-6">delete</span>
                    </button>
                </td>
            </tr>`).join('');
    inicializarTooltips();
}

// Confirmacion antes de eliminar un juego
function confirmarEliminar(idJuego) {
    if (confirm(`¿Estás seguro de que deseas eliminar el juego con ID #${idJuego}?. Esto eliminara todo el stock disponible`)) {
        // Obtener lista actual
        let juegos = JSON.parse(localStorage.getItem('juegos')) || [];

        // Filtrar el juego (se elimina el que coincide con el ID)
        // Comparación de tipos (id puede venir como número o string)
        juegos = juegos.filter(j => j.id != idJuego);

        // Guardar la nueva lista en localStorage
        localStorage.setItem('juegos', JSON.stringify(juegos));

        // Recargar la tabla sin recargar toda la página
        renderizarTablaAdmin();
    }
}

// Cierre de sesion y redireccion al login
function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuarioSesion');
    window.location.href = '../login/login.html';
}