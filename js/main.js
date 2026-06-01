document.addEventListener('DOMContentLoaded', function () {
    // CERRAR MENU HAMBURGUESA
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuCollapse = document.getElementById('menuPrincipal');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(menuCollapse) || new bootstrap.Collapse(menuCollapse, { toggle: false });
                bsCollapse.hide();
            }
        });
    });

    const form = document.getElementById('formRegistro');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const mensajeExito = document.getElementById('mensajeExito');

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validarPassword = (password) => /^(?=.*[A-Z])(?=.*\d).{6,18}$/.test(password);

    // CALCULA EDAD PARA VALIDACION
    const calcularEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const m = hoy.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
        return edad;
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let esValido = true;
        // OCULTA MENSAJE DE ENVIO ANTERIOR SI ES QUE HUBIERA
        mensajeExito.classList.add('d-none');

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

        const nombre = document.getElementById('nombre');
        validarCampo('nombre', nombre.value.trim() !== '');

        const usuario = document.getElementById('usuario');
        validarCampo('usuario', usuario.value.trim() !== '');

        const email = document.getElementById('email');
        validarCampo('email', validarEmail(email.value.trim()));

        const password = document.getElementById('password');
        validarCampo('password', validarPassword(password.value));

        const confirmPassword = document.getElementById('confirmPassword');
        validarCampo('confirmPassword', confirmPassword.value !== '' && confirmPassword.value === password.value);

        // VALIDACION MAYOR DE 13 AÑOS
        const fechaNacimiento = document.getElementById('fechaNacimiento');
        if (fechaNacimiento.value === '') {
            validarCampo('fechaNacimiento', false);
            document.getElementById('edadError').innerText = "Debes ingresar una fecha.";
        } else {
            const edad = calcularEdad(fechaNacimiento.value);
            if (edad < 13) {
                validarCampo('fechaNacimiento', false);
                document.getElementById('edadError').innerText = "Debes tener al menos 13 años para registrarte.";
            } else {
                validarCampo('fechaNacimiento', true);
            }
        }

        // MENSAJE DE REGISTRO EXITOSO Y LIMPIEZA DE FORMULARIO
        if (esValido) {
            mensajeExito.classList.remove('d-none');
            form.reset();

            // QUITA LOS BORDES VERDES DEL REGISTRO EXITOSO
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => input.classList.remove('is-valid'));

            // OCULTA EL MENSAJE DESPUES DE 4 SEGUNDOS
            setTimeout(() => {
                mensajeExito.classList.add('d-none');
            }, 4000);
        }
    });

    btnLimpiar.addEventListener('click', function () {
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => input.classList.remove('is-invalid', 'is-valid'));
        mensajeExito.classList.add('d-none');
    });

});
