document.addEventListener('DOMContentLoaded', function () {
    // CERRAR MENU HAMBURGUESA
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuCollapse = document.getElementById('menuPrincipal');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const bsCollapse = bootstrap.Collapse.getInstance(menuCollapse);
            if (bsCollapse) bsCollapse.hide();
        });
    });

    // Logica de sesion y navbar dinamico desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuarioSesion'));
    const sesionActiva = localStorage.getItem('sesionActiva');
    const navPerfil = document.getElementById('navPerfil');

    if (sesionActiva === 'true' && usuario && navPerfil) {
        // Muestra el enlace de perfil si hay sesion
        navPerfil.classList.remove('d-none');

        if (usuario.rol === 'admin') {
            navPerfil.href = 'admin/admin.html';
            navPerfil.innerHTML = '<span class="material-symbols-outlined">admin_panel_settings</span>Panel de Control';
        } else {
            navPerfil.href = 'perfil/perfil.html';
            navPerfil.innerHTML = '<span class="material-symbols-outlined">person</span>Mi Perfil';
        }
    }

    // Juegos precargados
    inicializarJuegosPredeterminados();

    // Renderizado dinamico de secciones
    renderizarTodoElInventario();

    // Logica de Carrito
    window.carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Boton pagar global
    const btnPagar = document.getElementById('btnPagar');
    if (btnPagar) {
        btnPagar.addEventListener('click', procesarPago);
    }

    // Logica formulario de registro
    const form = document.getElementById('formRegistro');
    if (form) {
        const btnLimpiar = document.getElementById('btnLimpiar');
        const mensajeExito = document.getElementById('mensajeExito');
        // Validacion email
        const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        /*
        * Validacion contraseña:
        * Entre 8 y 20 caracteres {8,20}
        * Al menos una mayuscula (?=.*[A-Z])
        * Al menos un numero (?=.*\d)
        * Al menos un caracter especial (?=.*[\W_])
        */
        const validarPassword = (password) => {
            const pass = String(password);
            const regexSeguridad = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
            return regexSeguridad.test(pass);
        };

        // Calculo de edad
        const calcularEdad = (fechaNacimiento) => {
            const hoy = new Date();
            const fechaNac = new Date(fechaNacimiento);
            // Verificar que sea una fecha valida
            if (isNaN(fechaNac.getTime())) return -1;

            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const m = hoy.getMonth() - fechaNac.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) edad--;
            return edad;
        };

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let esValido = true;
            // Oculta mensaje de envio anterior si es que hubiera
            mensajeExito.classList.add('d-none');

            // Aplicar validacion con Bootstrap
            const validarCampo = (id, condicion) => {
                const campo = document.getElementById(id);
                if (!campo) return;
                if (!condicion) {
                    campo.classList.add('is-invalid');
                    campo.classList.remove('is-valid');
                    esValido = false;
                } else {
                    campo.classList.remove('is-invalid');
                    campo.classList.add('is-valid');
                }
            };

            // Ejecucion de validaciones
            validarCampo('nombre', document.getElementById('nombre')?.value.trim() !== '');
            validarCampo('usuario', document.getElementById('usuario')?.value.trim() !== '');
            validarCampo('email', validarEmail(document.getElementById('email')?.value.trim() || ''));

            const password = document.getElementById('password');
            validarCampo('password', validarPassword(password?.value || ''));

            const confirmPassword = document.getElementById('confirmPassword');
            validarCampo('confirmPassword', confirmPassword?.value !== '' && confirmPassword?.value === password?.value);

            // Validacion edad (13 años)
            const fechaNacimiento = document.getElementById('fechaNacimiento');
            const edadError = document.getElementById('edadError');

            if (!fechaNacimiento?.value) {
                validarCampo('fechaNacimiento', false);
                if (edadError) edadError.innerText = "Debes ingresar una fecha.";
            } else {
                const edad = calcularEdad(fechaNacimiento.value);
                if (edad < 13) {
                    validarCampo('fechaNacimiento', false);
                    if (edadError) edadError.innerText = "Debes tener al menos 13 años.";
                } else {
                    validarCampo('fechaNacimiento', true);
                }
            }

            // Mensaje de registro exitoso y limpieza de formulario
            if (esValido) {
                if (mensajeExito) mensajeExito.classList.remove('d-none');
                form.reset();
                // Quitar bordes verdes
                form.querySelectorAll('.form-control').forEach(input => input.classList.remove('is-valid'));
                // Ocultar mensaje despues de 4 seg
                setTimeout(() => { if (mensajeExito) mensajeExito.classList.add('d-none'); }, 4000);
            }
        });

        // Limpieza de campos con boton limpiar
        btnLimpiar?.addEventListener('click', function () {
            form.querySelectorAll('.form-control').forEach(input => input.classList.remove('is-invalid', 'is-valid'));
            if (mensajeExito) mensajeExito.classList.add('d-none');
        });
    }

});

// Renderiza el catalogo de productos
function renderizarTodoElInventario() {
    const contenedorPrincipal = document.getElementById('seccionesCategorias');
    if (!contenedorPrincipal) return;

    let juegos = JSON.parse(localStorage.getItem('juegos')) || [];

    if (juegos.length === 0) {
        contenedorPrincipal.innerHTML = '<p class="text-center p-5">No hay juegos cargados aún.</p>';
        return;
    }

    const categorias = [...new Set(juegos.map(j => j.categoria))];

    contenedorPrincipal.innerHTML = '';

    categorias.forEach(cat => {
        const juegosDeCat = juegos.filter(j => j.categoria === cat);
        const section = document.createElement('section');
        section.className = 'seccion py-5';
        section.id = cat.toLowerCase().replace(/\s+/g, '-');

        // Generacion de tarjetas de productos
        section.innerHTML = `
            <div class="container">
                <div class="seccion-header">
                    <h2>${cat}</h2>
                </div>
                <div class="row g-4 mt-3">
                    ${juegosDeCat.map(juego => {
            const sinStock = juego.stock <= 0;
            const ultimaUnidad = juego.stock === 1;

            // Verificacion de rol
            const usuario = JSON.parse(localStorage.getItem('usuarioSesion'));
            const esAdmin = usuario && usuario.rol === 'admin';

            // Solo mostramos comprar si hay stock Y NO ES ADMIN
            const mostrarBotonComprar = !sinStock && !esAdmin;

            return `
                        <div class="col-12 col-md-6 col-lg-4">
                            <article class="tarjeta">
                                <img src="${juego.img}" alt="${juego.nombre}">
                                <div class="tarjeta-contenido">
                                    <h3>${juego.nombre}</h3>
                                    <p class="descripcion">${juego.desc}</p>
                                    <div class="precio-contenedor">
                                        <p class="precio">${juego.precio}</p>
                                        <p class="small fw-bold ${ultimaUnidad ? 'text-warning' : 'text-danger'}">
                                        ${sinStock ? 'Sin stock' : (ultimaUnidad ? '¡Última unidad!' : `Stock: ${juego.stock}`)}
                                    </p>
                                    ${mostrarBotonComprar ?
                                        `<button class="btn btn-outline-success btn-sm" onclick="agregarAlCarrito(${juego.id})">Comprar</button>` :
                                        ''}
                                        <p class="${juego.tieneDescuento ? 'descuento' : 'sin-descuento'}">
                                            ${juego.textoDescuento}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>`;
        }).join('')}
                </div>
            </div>
        `;
        contenedorPrincipal.appendChild(section);
    });
}

// Agregar productos al carrito de compras y reducir stock
function agregarAlCarrito(idJuego) {
    let juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    const juego = juegos.find(j => j.id === idJuego);

    if (juego && juego.stock > 0) {
        juego.stock--;
        localStorage.setItem('juegos', JSON.stringify(juegos));

        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.push(juego);
        localStorage.setItem('carrito', JSON.stringify(carrito));

        renderizarTodoElInventario();
        alert("Agregado al carrito: " + juego.nombre);
    }
}

// Finalizar compra. Si es un usuario logueado guarda historial
function procesarPago() {
    const sesionActiva = localStorage.getItem('sesionActiva');
    const usuario = JSON.parse(localStorage.getItem('usuarioSesion'));
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) return;

    if (sesionActiva === 'true' && usuario) {
        let historial = JSON.parse(localStorage.getItem('historialCompras')) || [];
        carrito.forEach(juego => {
            historial.push({
                ...juego,
                username: usuario.username,
                fecha: new Date().toLocaleDateString()
            });
        });
        localStorage.setItem('historialCompras', JSON.stringify(historial));
        alert("¡Muchas gracias por tu compra!");
    } else {
        alert("¡Muchas gracias por tu compra!. Te invitamos a registrarte y poder llevar el historial de tus compras.");
    }

    localStorage.removeItem('carrito');
    window.location.reload();
}

// Carga inicial de inventario de juegos
function inicializarJuegosPredeterminados() {
    if (!localStorage.getItem('juegos')) {
        const juegosIniciales = [
            { nombre: "Catán", categoria: "Estrategia", precio: "$45.000", stock: 50, desc: "Construye rutas y poblados negociando recursos.", img: "img/catan.jpg", tieneDescuento: true, textoDescuento: "¡10% de descuento!" },
            { nombre: "Scythe", categoria: "Estrategia", precio: "$85.000", stock: 23, desc: "Estrategia 4X en una Europa alternativa.", img: "img/scythe.jpg", tieneDescuento: true, textoDescuento: "¡Envío Gratis!" },
            { nombre: "Terraforming Mars", categoria: "Estrategia", precio: "$65.000", stock: 20, desc: "Dirige una corporación para hacer habitable el planeta rojo. Complejo e inmersivo.", img: "img/terraforming-mars.jpg", tieneDescuento: false, textoDescuento: "Precio normal." },
            { nombre: "Carcassonne", categoria: "Familiar", precio: "$35.000", stock: 1, desc: "Crea un mapa medieval con losetas.", img: "img/carcassonne.jpg", tieneDescuento: false, textoDescuento: "Precio normal." },
            { nombre: "Aventureros al Tren", categoria: "Familiar", precio: "$50.000", stock: 10, desc: "Conecta ciudades norteamericanas con tus rutas de trenes. Diversión para todos.", img: "img/aventureros.jpg", tieneDescuento: true, textoDescuento: "¡15% de descuento por esta semana!" },
            { nombre: "Dixit", categoria: "Familiar", precio: "$38.000", stock: 10, desc: "Un juego de deducción y creatividad donde una imagen vale mil palabras.", img: "img/dixit.jpg", tieneDescuento: false, textoDescuento: "Precio normal." },
            { nombre: "Exploding Kittens", categoria: "Cartas", precio: "$20.000", stock: 5, desc: "Una versión gatuna de la ruleta rusa. Roba cartas hasta que  alguien explote.", img: "img/exploding.jpeg", tieneDescuento: true, textoDescuento: "¡20% Dcto en segunda unidad!" },
            { nombre: "Virus!", categoria: "Cartas", precio: "$15.000", stock: 30, desc: "Contagia los órganos de tus rivales y protege los tuyos en este rápido juego.", img: "img/virus.jpg", tieneDescuento: false, textoDescuento: "Precio normal." },
            { nombre: "Sushi Go!", categoria: "Cartas", precio: "$18.000", stock: 40, desc: "Pasa y escoge cartas para crear el mejor menú de sushi. Rápido y divertido.", img: "img/sushi-go.jpg", tieneDescuento: false, textoDescuento: "Precio normal." },
            { nombre: "Código Secreto", categoria: "Fiesta", precio: "$25.000", stock: 3, desc: "Encuentra agentes usando pistas.", img: "img/codigo-secreto.jpg", tieneDescuento: true, textoDescuento: "¡10% Dcto!" },
            { nombre: "Just One", categoria: "Fiesta", precio: "$22.000", stock: 2, desc: "Juego cooperativo donde debes escribir una pista para adivinar la palabra secreta.", img: "img/just-one.jpg", tieneDescuento: false, textoDescuento: "Precio normal." },
            { nombre: "Dobble", categoria: "Fiesta", precio: "$15.000", stock: 1, desc: "Pon a prueba tus reflejos visuales encontrando el símbolo idéntico.", img: "img/dobble.jpg", tieneDescuento: false, textoDescuento: "Precio normal." }
        ];
        localStorage.setItem('juegos', JSON.stringify(juegosIniciales));
    }
}