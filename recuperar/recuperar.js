document.getElementById('formRecuperar').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('recuperarEmail');
    const mensaje = document.getElementById('mensajeRecuperacion');
    // Validacion de formato email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Ocultar el mensaje de exito previo antes de nueva validación
    mensaje.classList.add('d-none');

    // Validacion de entrada
    if (!regexEmail.test(email.value)) {
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');
    } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');

        // Simulacion de proceso exitoso
        mensaje.classList.remove('d-none');
        // Limpieza del input
        email.value = '';
        // Quitar el borde verde
        email.classList.remove('is-valid');

        // Oculta el mensaje despues de 5 segundos
        setTimeout(() => {
            mensaje.classList.add('d-none');
        }, 5000);
    }
});