/*
 * Logica para la gestion del carrito de compras
 * Permite renderizar productos, modificar cantidades y procesar pagos.
 */

// Inicializa el renderizado del carrito al cargar la pagina
document.addEventListener('DOMContentLoaded', renderizarCarrito);

// Renderiza los productos en el carrito y calcula el total
function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const tbody = document.getElementById('carritoBody');
    const totalDisplay = document.getElementById('totalCarrito');
    tbody.innerHTML = '';

    // Si el carrito esta vacio, mostramos el mensaje informativo
    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4">
                    <p class="text-muted">Aún no tienes productos en tu carrito, sigue visitando nuestro catálogo.</p>
                </td>
            </tr>
        `;
        totalDisplay.innerText = '$0';
        return;
    }

    // Agrupar productos para mostrar cantidades
    const carritoAgrupado = carrito.reduce((acc, item) => {
        acc[item.id] = acc[item.id] || { ...item, cantidad: 0 };
        acc[item.id].cantidad++;
        return acc;
    }, {});

    let granTotal = 0;

    // Creacion de filas de la tabla
    Object.values(carritoAgrupado).forEach(item => {
        // Limpia el formato de moneda para calcular el total (asumiendo formato "$1000")
        const precioNumerico = parseInt(item.precio.replace(/[^0-9]/g, '')) || 0;
        const subtotal = precioNumerico * item.cantidad;
        granTotal += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.precio}</td>
            <td>
                <button class="btn btn-sm btn-outline-secondary" onclick="modificarCantidad(${item.id}, -1)">-</button>
                ${item.cantidad}
                <button class="btn btn-sm btn-outline-secondary" onclick="modificarCantidad(${item.id}, 1)">+</button>
            </td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${item.id})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });

    totalDisplay.innerText = `$${granTotal.toLocaleString()}`;
}

// Modifica la cantidad de un producto del carrito
function modificarCantidad(id, delta) {
    let juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const juegoStock = juegos.find(j => j.id === id);

    if (delta > 0 && juegoStock.stock > 0) {
        // Aumentar cantidad: bajar stock
        juegoStock.stock--;
        carrito.push(juegoStock);
    } else if (delta < 0) {
        // Disminuir cantidad: devolver stock
        const index = carrito.findIndex(i => i.id === id);
        if (index > -1) {
            carrito.splice(index, 1);
            juegoStock.stock++;
        }
    }

    localStorage.setItem('juegos', JSON.stringify(juegos));
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

// Elimina por completo un producto del carrito y devuelve su stock
function eliminarDelCarrito(id) {
    let juegos = JSON.parse(localStorage.getItem('juegos')) || [];
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const juegoStock = juegos.find(j => j.id === id);

    // Filtrar elementos del carrito y devolver todo al stock
    const itemsAEliminar = carrito.filter(i => i.id === id);
    juegoStock.stock += itemsAEliminar.length;
    carrito = carrito.filter(i => i.id !== id);

    localStorage.setItem('juegos', JSON.stringify(juegos));
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

// Procesar la compra, gestiona historial y vacia el carrito una vez finalizado el proceso
function procesarPago() {
    const sesionActiva = localStorage.getItem('sesionActiva');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const usuario = JSON.parse(localStorage.getItem('usuarioSesion'));
    if (carrito.length === 0) return;

    // Si es un usuario logueado se guarda el historial de compra
    if (sesionActiva === 'true' && usuario) {
        // Recuperar historial existente o crear nuevo
        let historial = JSON.parse(localStorage.getItem('historialCompras')) || [];

        // Agregar compras actuales al historial con fecha
        carrito.forEach(item => {
            historial.push({
                username: usuario.username,
                nombre: item.nombre,
                fecha: new Date().toLocaleDateString()
            });
        });

        localStorage.setItem('historialCompras', JSON.stringify(historial));
        alert("¡Muchas gracias por tu compra!");
    } else {
        alert("¡Muchas gracias por tu compra!. Te invitamos a registrarte y poder llevar el historial de tus compras.");
    }

    // Vaciar carrito
    localStorage.removeItem('carrito');
    window.location.href = "../index.html";
}