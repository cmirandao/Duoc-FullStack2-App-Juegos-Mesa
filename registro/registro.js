document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formRegistro');
    const btnLimpiar = document.getElementById('btnLimpiar');
    const mensajeExito = document.getElementById('mensajeExito');

    // Validacion de formato de correo electronico
    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Validacion contraseña: 8-20 caracteres, 1 mayuscula, 1 numero, 1 simbolo especial
    const validarPassword = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/.test(password);

    // Función para calcular la edad exacta
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
        mensajeExito.classList.add('d-none');

        // Función auxiliar para aplicar feedback visual de Bootstrap (colores de los bordes)
        const validarCampo = (id, condicion, mensajeError = "") => {
            const campo = document.getElementById(id);
            if (!condicion) {
                campo.classList.add('is-invalid');
                campo.classList.remove('is-valid');
                if (mensajeError) {
                    const feedback = campo.nextElementSibling;
                    if (feedback && feedback.classList.contains('invalid-feedback')) {
                        feedback.innerText = mensajeError;
                    }
                }
                esValido = false;
            } else {
                campo.classList.remove('is-invalid');
                campo.classList.add('is-valid');
            }
        };

        // Captura de valores del formulario
        const nombreVal = document.getElementById('nombre').value.trim();
        const usuarioVal = document.getElementById('usuario').value.trim();
        const emailVal = document.getElementById('email').value.trim();
        const fechaVal = document.getElementById('fechaNacimiento').value;
        const passVal = document.getElementById('password').value;
        const dirVal = document.getElementById('direccion').value;

        // Comprobacion de duplicidad en LocalStorage
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];
        const usuarioExistente = usuariosRegistrados.find(u => u.username === usuarioVal);
        const emailExistente = usuariosRegistrados.find(u => u.email === emailVal);

        // Validaciones
        validarCampo('nombre', nombreVal !== '');
        validarCampo('usuario', usuarioVal !== '' && !usuarioExistente, usuarioExistente ? "Este usuario ya está registrado." : "El usuario es obligatorio.");
        validarCampo('email', validarEmail(emailVal) && !emailExistente, emailExistente ? "Este email ya está registrado." : "Ingresa un correo válido.");
        validarCampo('password', validarPassword(passVal));
        validarCampo('confirmPassword', document.getElementById('confirmPassword').value === passVal && passVal !== '');

        // Validación de edad mínima (13 años)
        const fechaNacimiento = document.getElementById('fechaNacimiento');
        if (fechaVal.value === '') {
            validarCampo('fechaNacimiento', false);
            document.getElementById('edadError').innerText = "Debes ingresar tu fecha de nacimiento.";
        } else {
            const edad = calcularEdad(fechaNacimiento.value);
            if (edad < 13) {
                validarCampo('fechaNacimiento', false);
                document.getElementById('edadError').innerText = "Debes tener al menos 13 años para registrarte.";
            } else {
                validarCampo('fechaNacimiento', true);
            }
        }

        // Si todo el formulario es válido
        if (esValido) {
            // Guardo los datos del usuario
            const nuevoUsuario = {
                nombre: nombreVal,
                username: usuarioVal,
                email: emailVal,
                password: passVal,
                fechaNacimiento: fechaVal,
                direccion: dirVal,
                rol: 'cliente' // Por defecto
            };

            usuariosRegistrados.push(nuevoUsuario);
            localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));

            // Inicio de sesion
            localStorage.setItem('usuarioSesion', JSON.stringify(nuevoUsuario));
            localStorage.setItem('sesionActiva', 'true');

            mensajeExito.classList.remove('d-none');
            form.reset();

            // Quitamos las clases de éxito visuales (bordes verdes)
            const inputs = form.querySelectorAll('.form-control');
            inputs.forEach(input => input.classList.remove('is-valid'));

            // Espera de 3 seg y redireccion al login
            setTimeout(() => {
                window.location.href = "../login/login.html";
            }, 3000);
        }
    });

    // Botón Limpiar, limpia el texto y quita estados de Bootstrap (rojo/verde)
    btnLimpiar.addEventListener('click', function () {
        const inputs = form.querySelectorAll('.form-control');
        inputs.forEach(input => input.classList.remove('is-invalid', 'is-valid'));
        mensajeExito.classList.add('d-none');
    });

});