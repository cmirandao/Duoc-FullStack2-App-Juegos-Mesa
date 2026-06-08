document.addEventListener('DOMContentLoaded', function () {
    // Cargar datos de usuario
    const usuario = JSON.parse(localStorage.getItem('usuarioSesion'));

    // Si no hay sesion iniciada, redirigir al login
    if (!usuario) {
        window.location.href = '../login/login.html';
        return;
    }

    // Si es usuario rol admin muestra panel de control para ir al dashboard (admin.html)
    if (usuario.rol === 'admin') {
        const navLinks = document.getElementById('navLinksPerfil');

        // Verificamos si existe el contenedor antes de intentar insertar
        if (navLinks) {
            const adminLink = document.createElement('a');
            adminLink.className = 'nav-link text-warning fw-bold';
            adminLink.href = '../admin/admin.html';
            adminLink.innerHTML = '<span class="material-symbols-outlined align-middle">admin_panel_settings</span> Panel de Control';
            navLinks.insertBefore(adminLink, navLinks.lastElementChild);
        }
    }

    // Llenado de campos
    const campos = {
        perfilNombre: document.getElementById('perfilNombre'),
        perfilEmail: document.getElementById('perfilEmail'),
        perfilUsuario: document.getElementById('perfilUsuario'),
        perfilFecha: document.getElementById('perfilFecha'),
        perfilDireccion: document.getElementById('perfilDireccion'),
        displayNombre: document.getElementById('displayNombre'),
        displayUsername: document.getElementById('displayUsername'),
        badgeRol: document.getElementById('badgeRol')
    };

    // Asignar valores desde los datos de sesion
    if (campos.perfilNombre) campos.perfilNombre.value = usuario.nombre || '';
    if (campos.perfilEmail) campos.perfilEmail.value = usuario.email || '';
    if (campos.perfilUsuario) campos.perfilUsuario.value = usuario.username || '';
    if (campos.perfilFecha) campos.perfilFecha.value = usuario.fechaNacimiento || '';
    if (campos.perfilDireccion) campos.perfilDireccion.value = usuario.direccion || '';

    // Asignar texto de visualización
    if (campos.displayNombre) campos.displayNombre.innerText = usuario.nombre || 'Usuario';
    if (campos.displayUsername) campos.displayUsername.innerText = '@' + (usuario.username || 'usuario');
    if (campos.badgeRol) campos.badgeRol.innerText = `Rol: ${usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}`;

    // Historial de compras
    const contenedorHistorial = document.getElementById('contenedorHistorial');

    // Si no es el admin maestro muestra el historial de compras
    if (usuario.email !== 'admin@sev.cl') {
        const historialCompleto = JSON.parse(localStorage.getItem('historialCompras')) || [];
        const misCompras = historialCompleto.filter(h => h.username === usuario.username);

        // Agrupacion de compras por juego
        const comprasAgrupadas = misCompras.reduce((acc, compra) => {
            const nombre = compra.nombre;
            if (!acc[nombre]) {
                acc[nombre] = { nombre: nombre, cantidad: 0 };
            }
            acc[nombre].cantidad += 1;
            return acc;
        }, {});

        // Renderizar el historial en la lista
        const listaJuegos = document.getElementById('listaJuegosComprados');

        if (listaJuegos) {
            listaJuegos.innerHTML = '';
            const keys = Object.keys(comprasAgrupadas);

            if (keys.length === 0) {
                listaJuegos.innerHTML = '<li class="p-2 text-muted small">Aún no has realizado compras.</li>';
            } else {
                keys.forEach(key => {
                    const item = comprasAgrupadas[key];
                    const li = document.createElement('li');
                    li.className = 'p-2 border-bottom d-flex justify-content-between align-items-center small';
                    li.innerHTML = `<strong>${item.nombre}</strong> <span class="badge bg-primary">Cant: ${item.cantidad}</span>`;
                    listaJuegos.appendChild(li);
                });
            }
        }
    } else {
        // Si es admin maestro indica que el historial no esta disponible
        const listaJuegos = document.getElementById('listaJuegosComprados');
        if (listaJuegos) listaJuegos.innerHTML = '<li class="p-2 text-muted small">Panel de Administrador: Historial no disponible.</li>';
    }

    // Si es usuario Admin maestro no puede editar nombre, usuario ni email
    if (usuario.email === 'admin@sev.cl') {
        [campos.perfilNombre, campos.perfilEmail, campos.perfilUsuario].forEach(el => { if (el) el.disabled = true; });
        const btnGuardar = document.querySelector('button[type="submit"]');
    }

});

// Guardar actualizacion realizadas
document.getElementById('formPerfil').addEventListener('submit', function (e) {
    e.preventDefault();
    let esValido = true;
    const mensajeExito = document.getElementById('mensajePerfilExito');
    mensajeExito.classList.add('d-none');

    // Validacion de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validacion contraseña: 8-20 caracteres, 1 Mayuscula, 1 Numero, 1 Simbolo
    const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

    const validarCampo = (id, condicion) => {
        const campo = document.getElementById(id);
        if (!condicion) {
            campo.classList.add('is-invalid');
            campo.classList.remove('is-valid');
            esValido = false;
        } else {
            campo.classList.remove('is-invalid');
            campo.classList.add('is-valid');
        }
    };

    // Validar campos obligatorios básicos
    validarCampo('perfilNombre', document.getElementById('perfilNombre').value.trim() !== '');
    validarCampo('perfilEmail', regexEmail.test(document.getElementById('perfilEmail').value.trim()));

    // Validar Edad (>13)
    const fechaVal = document.getElementById('perfilFecha').value;
    if (fechaVal === '') {
        validarCampo('perfilFecha', false);
    } else {
        const hoy = new Date();
        const fechaNac = new Date(fechaVal);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        if (hoy.getMonth() < fechaNac.getMonth() || (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        validarCampo('perfilFecha', edad >= 13);
    }

    // Validar Cambio de Contraseña (Opcional)
    const pass = document.getElementById('perfilPassword');
    const confirmPass = document.getElementById('perfilConfirmPassword');
    // Solo valida si el usuario escribio algo
    if (pass.value !== '') {
        validarCampo('perfilPassword', regexPassword.test(pass.value));
        validarCampo('perfilConfirmPassword', confirmPass.value !== '' && confirmPass.value === pass.value);
    } else {
        // Si estan vacios se quita cualquier error previo
        pass.classList.remove('is-invalid', 'is-valid');
        confirmPass.classList.remove('is-invalid', 'is-valid');
    }

    // Actualizar usuario en localStorage
    if (esValido) {
        // Obtener los valores actuales de los campos
        const nuevaDireccion = document.getElementById('perfilDireccion').value;
        const nuevaPassword = document.getElementById('perfilPassword').value;

        const usuarioActualizado = {
            ...JSON.parse(localStorage.getItem('usuarioSesion')),
            nombre: document.getElementById('perfilNombre').value,
            email: document.getElementById('perfilEmail').value,
            fechaNacimiento: document.getElementById('perfilFecha').value,
            direccion: nuevaDireccion,
            // Solo se actualiza password si el usuario ingresa una nueva
            password: nuevaPassword !== '' ? nuevaPassword : usuarioSesion.password
        };
        // Actualizar la sesion actual
        localStorage.setItem('usuarioSesion', JSON.stringify(usuarioActualizado));
        
        // Actualizar el array general de usuarios
        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        const index = usuariosRegistrados.findIndex(u => u.username === usuarioActualizado.username);

        if (index !== -1) {
            usuariosRegistrados[index] = usuarioActualizado;
            localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        } else {
            // Se agrega al arreglo de usuario el admin maestro
            usuariosRegistrados.push(usuarioActualizado);
            localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        }

        // Actualizar visualmente el nombre en la tarjeta lateral
        document.getElementById('displayNombre').innerText = usuarioActualizado.nombre;

        if (mensajeExito) {
            mensajeExito.classList.remove('d-none');
            setTimeout(() => mensajeExito.classList.add('d-none'), 4000);
        }
    }

});

function cerrarSesion() {
    // Limpieza de localStorage y redireccionamiento al login
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuarioSesion');
    window.location.href = '../login/login.html';
}