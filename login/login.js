document.getElementById('formLogin').addEventListener('submit', function (e) {
    // Evita el envio por defecto del formulario para manejar la logica con JS
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const pass = document.getElementById('loginPassword');
    // Validacion de formato email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valido = true;

    // Valida que tenga la estructura de un email
    if (!regexEmail.test(email.value)) {
        email.classList.add('is-invalid');
        valido = false;
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }

    // Valida que la contraseña no este vacia
    if (pass.value.trim() === '') {
        pass.classList.add('is-invalid');
        valido = false;
    } else {
        pass.classList.remove('is-invalid');
        pass.classList.add('is-valid');
    }

    if (valido) {
        const emailIngresado = email.value;
        const passIngresada = pass.value;

        // Recuperar usuarios registrados
        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados')) || [];

        // Inicializar el admin en el array si no existe (solo una vez)
        const adminEmail = 'admin@sev.cl';
        if (!usuariosRegistrados.find(u => u.email === adminEmail)) {
            const adminBase = {
                username: 'admin',
                email: adminEmail,
                password: 'Admin123',
                rol: 'admin',
                nombre: 'Administrador',
                fechaNacimiento: '1986-01-11',
                direccion: 'Central'
            };
            usuariosRegistrados.push(adminBase);
            localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
        }

        // Buscar el usuario en la lista persistente (ya no uso el objeto en duro aqui)
        const usuarioEncontrado = usuariosRegistrados.find(u => u.email === emailIngresado);

        // Si no existe el correo, muestra mensaje de error
        if (!usuarioEncontrado) {
            alert("Error: Este correo no está registrado.");
            email.classList.add('is-invalid');
            return;
        }

        // Si la contraseña es incorrecta, muestra emnsaje de error
        if (usuarioEncontrado.password !== passIngresada) {
            alert("Error: La contraseña es incorrecta.");
            pass.classList.add('is-invalid');
            return;
        }

        // Iniciar sesion: Guardar estado y el usuario completo
        localStorage.setItem('sesionActiva', 'true');
        localStorage.setItem('usuarioSesion', JSON.stringify(usuarioEncontrado));

        // Redireccion segun rol
        if (usuarioEncontrado.rol === 'admin') {
            alert("¡Bienvenido Admin!");
            window.location.href = "../admin/admin.html";
        } else {
            alert("¡Bienvenido!");
            window.location.href = "../index.html";
        }
    }
});