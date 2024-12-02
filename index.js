function principal() {
    let productos = [
        { id: 1, nombre: "Jabón de Carbón Activado", categoria: "jabon", stock: 20, precio: 60, ruta_img: "jabon_carbon.jpeg" },
        { id: 2, nombre: "Jabón de Lavanda", categoria: "jabon", stock: 25, precio: 60, ruta_img: "jabon_lavanda.jpg" },
        { id: 3, nombre: "Jabón de Limón", categoria: "jabon", stock: 25, precio: 60, ruta_img: "jabon_limon.jpg" },
        { id: 4, nombre: "Jabón de Miel", categoria: "jabon", stock: 25, precio: 60, ruta_img: "jabon_miel.jpg" },
        { id: 5, nombre: "Shampoo estimulante de crecimiento", categoria: "shampoo", stock: 10, precio: 100, ruta_img: "shampoo_limpieza.jpeg" },
        { id: 6, nombre: "Shampoo limpieza profunda", categoria: "shampoo", stock: 10, precio: 100, ruta_img: "shampoo_limpieza.jpeg" }
    ];

    carrito = cargarCarritoDeStorage();
    crear_tarjetas(productos);
    inicializarBotones(productos);
}

function crear_tarjetas(productos) {
    let contenedor = document.getElementById("contenedor_productos");
    contenedor.innerHTML = "";

    productos.forEach(({ stock, id, ruta_img, nombre, precio }) => {
        let mensaje = stock < 5 ? "Quedan pocas unidades" : "Unidades disponibles: " + stock;
        let tarjetaProducto = document.createElement("div");
        tarjetaProducto.className = "producto";

        tarjetaProducto.innerHTML = `
            <img src="../img/jabones/${ruta_img}" alt="${nombre}" />
            <h3>${nombre}</h3>
            <p>Precio: $${precio}</p>
            <p>${mensaje}</p>
            <button class="botonAgregarAlCarrito" data-id="${id}">Agregar al carrito</button>
        `;

        contenedor.appendChild(tarjetaProducto);
    });
}

let carrito = [];

function inicializarBotones(productos) {
    const botonCarrito = document.getElementById("botonCarrito");
    const contenedorCarrito = document.getElementById("contenedorCarrito");
    botonCarrito.addEventListener("click", () => {
        contenedorCarrito.classList.toggle("visible");
        renderizarCarrito();
    });

    document.querySelectorAll(".botonAgregarAlCarrito").forEach(boton => {
        boton.addEventListener("click", () => {
            const idProducto = parseInt(boton.dataset.id);
            agregarProductoAlCarrito(idProducto, productos);
        });
    });

    const botonIrAPagar = document.getElementById("botonIrAPagar");
    botonIrAPagar.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
        } else {
            alert("Redirigiendo a la página de pago...");
        }
    });
}

function agregarProductoAlCarrito(idProducto, productos) {
    const productoExistente = carrito.find(p => p.id === idProducto);

    if (productoExistente) {
        // Verifica si la cantidad en el carrito supera el stock disponible
        if (productoExistente.cantidad < productoExistente.stock) {
            productoExistente.cantidad += 1;
        } else {
            alert(`Solo puedes agregar un máximo de ${productoExistente.stock} unidades de este producto.`);
        }
    } else {
        // Si no está en el carrito, lo agrega si hay stock disponible
        const producto = productos.find(p => p.id === idProducto);
        if (producto) {
            carrito.push({ ...producto, cantidad: 1 });
        }
    }

    guardarCarritoEnStorage();
    renderizarCarrito();
}


function renderizarCarrito() {
    const itemsCarrito = document.getElementById("itemsCarrito");
    itemsCarrito.innerHTML = "";

    if (carrito.length === 0) {
        itemsCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        guardarCarritoEnStorage();
        return;
    }

    carrito.forEach((producto, index) => {
        const itemCarrito = document.createElement("div");
        itemCarrito.className = "itemCarrito";
        itemCarrito.innerHTML = `
            <p>${producto.nombre} - $${producto.precio} (x${producto.cantidad})</p>
            <button class="botonQuitar" data-index="${index}">Quitar</button>
        `;
        itemsCarrito.appendChild(itemCarrito);
    });

    document.querySelectorAll(".botonQuitar").forEach(boton => {
        boton.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            const producto = carrito[index];
            if (producto.cantidad > 1) {
                producto.cantidad -= 1;
            } else {
                carrito.splice(index, 1);
            }
            guardarCarritoEnStorage();
            renderizarCarrito();
        });
    });
}

function guardarCarritoEnStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDeStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

principal();
