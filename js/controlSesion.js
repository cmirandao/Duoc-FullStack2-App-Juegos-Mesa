/*
 * Logica de control de sesion
 * Gestiona la visualizacion de los elementos del menu de navegacion
 * segun si el usuario ha iniciado sesion o no.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Recuperacion de datos desde localStorage
    const usuarioSesion = JSON.parse(localStorage.getItem('usuarioSesion'));
    const sesionActiva = localStorage.getItem('sesionActiva');

    // Elementos del DOM
    const navLogin = document.getElementById('navLogin');
    const navRegistro = document.getElementById('navRegistro');
    const navPerfil = document.getElementById('navPerfil');
    const navCerrarSesion = document.getElementById('navCerrarSesion');
    const navCarrito = document.getElementById('navCarrito');

    // Mostrar/ocultar elementos, asegurando la alineacion
    const mostrarElemento = (elemento, mostrar) => {
        if (!elemento) return;
        if (mostrar) {
            elemento.classList.remove('d-none');
            elemento.style.display = 'flex';
        } else {
            elemento.classList.add('d-none');
            elemento.style.display = 'none';
        }
    };

    // Verifico si es una sesion valida
    if (sesionActiva === 'true' && usuarioSesion) {
        /*
        * --- CASO: SESION ACTIVA ---
        * Se ocultan inicio de sesion, registro y se muestran mi perfil y cerrar sesion
         */
        mostrarElemento(navLogin, false);
        mostrarElemento(navRegistro, false);
        mostrarElemento(navPerfil, true);
        mostrarElemento(navCerrarSesion, true);

        // Ocultar carro de compras si es admin
        if (usuarioSesion.rol === 'admin') {
            mostrarElemento(navCarrito, false);
        } else {
            mostrarElemento(navCarrito, true);
        }

        // Redireccion de Mi Perfil
        if (navPerfil) {
            navPerfil.style.display = 'flex';
            navPerfil.addEventListener('click', (e) => {
                e.preventDefault();
                // Redireccion segun rol
                window.location.href = usuarioSesion.rol === 'admin' ? '../admin/admin.html' : '../perfil/perfil.html';
            });
        }

        // Funcionalidad Cerrar Sesion
        if (navCerrarSesion) {
            navCerrarSesion.onclick = (e) => {
                e.preventDefault();
                // Limpieza de datos
                localStorage.removeItem('sesionActiva');
                localStorage.removeItem('usuarioSesion');
                // Redirección al index principal
                window.location.href = '../index.html';
            };
        }
    } else {
        /*
        * --- CASO: NO HAY SESION ---
        * Se ocultan mi perfil y cerrar sesion y se muestran inicio de sesion, registro
         */
        mostrarElemento(navLogin, true);
        mostrarElemento(navRegistro, true);
        mostrarElemento(navPerfil, false);
        mostrarElemento(navCerrarSesion, false);
        mostrarElemento(navCarrito, true);
    }
});