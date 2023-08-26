let spinner = document.getElementById("spinner");
const contenedorModal = document.getElementsByClassName('modal-contenedor')[0]
const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonVaciar = document.getElementById('vaciar-carrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const cantidad = document.getElementById('cantidad');
const precioTotal = document.getElementById('precioTotal');
const cantidadTotal = document.getElementById('cantidadTotal');
let alertExito = document.getElementById("alertExito");
let CartMessage = document.getElementById("CartMessage");


let carrito = [];
let stockProductos = [];
const URL_STOCK_PRODUCTOS = '/productos/';
let URL_MAIN = "/pedidos/arreglo";

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        actualizarCarrito();
    }

    contenedorCarrito.addEventListener('input', handleCantidadInputChange);
});

function handleCantidadInputChange(event) {
    const { target } = event;

    if (target.classList.contains('cantidad-input')) {
        const prodId = parseInt(target.getAttribute('data-prod-id'), 10);
        const newQuantity = parseInt(target.value, 10);
        actualizarCantidadEnCarrito(prodId, newQuantity);
    }
}

// Obtener el stock de productos desde el fetch
fetch(URL_STOCK_PRODUCTOS)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        stockProductos = json;
        // Después de obtener el stock de productos, generamos el HTML de los productos
        generarProductosHTML();
        spinner.setAttribute("hidden", true); // Ocultar el spinner
    })
    .catch(function (err) {
        console.log(err);
    });

// Generar el HTML de los productos
function generarProductosHTML() {
    stockProductos.forEach((producto) => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <div class="cajitas container" >
                <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="imagen">
                <div class="card-body">
                    <h5 class="card-title nombre">${producto.nombre}</h5>
                    <p class="card-text text-justify">${producto.descripcion}</p>
                    <p class="card-text text-justify">Stock: ${producto.stock}</p>
                    <p class="card-text text-justify">Solo efectivo 💵</p>
                    <div style="display: flex; align-items: center; justify-content: space-around;">
                    <div class="input-group mb-3">
                    <input type="number" class="form-control" id="cantidad${producto.id}" min="1" value="1">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" id="agregar${producto.id}">Agregar al carrito</button>
                    </div>
                </div>
                    <h5 class="card-title" style="padding-left: 13px; padding-bottom: 10px;">$${producto.precio}</h5>
                    </div>
                </div>
                </div>
            </div>
            `;

        contenedorProductos.appendChild(div);
        const boton = document.getElementById(`agregar${producto.id}`);
        boton.addEventListener('click', () => {
            const cantidadInput = document.getElementById(`cantidad${producto.id}`);
            const cantidadValue = cantidadInput.value.trim(); // Trim whitespace
            if (cantidadValue === '' || isNaN(cantidadValue) || parseInt(cantidadValue, 10) <= 0) {
                Swal.fire('Cantidad inválida', 'La cantidad debe ser un número mayor que cero', 'error');
                return;
            }
            const cantidadSeleccionada = parseInt(cantidadValue, 10);

            // Verificar si el usuario ha iniciado sesión antes de agregar al carrito
            if (usuarioHaIniciadoSesion()) {
                agregarAlCarrito(producto.id, cantidadSeleccionada);
            } else {
                Swal.fire({
                    title: 'Debe iniciar sesión',
                    text: 'Para agregar productos al carrito, debe iniciar sesión primero.',
                    icon: 'warning',
                    confirmButtonText: 'Iniciar Sesión',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Redireccionar a la página de inicio de sesión
                        window.location.href = './login.html';
                    }
                });
            }
        });


    });
}


const usuarioHaIniciadoSesion = () => {
    // Obtener el "idUsuario" del localStorage
    var idUsuario = localStorage.getItem("idUsuario");

    // Verificar si el "idUsuario" existe y no es nulo
    return idUsuario !== null;
};



botonVaciar.addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito();
});

const agregarAlCarrito = (prodId, cantidadSeleccionada) => {
    const existe = carrito.some((prod) => prod.id === prodId);

    if (existe) {
        carrito.map((prod) => {
            if (prod.id === prodId) {
                prod.cantidad += cantidadSeleccionada;
            }
        });
    } else {
        const item = stockProductos.find((prod) => prod.id === prodId);
        item.cantidad = cantidadSeleccionada; // Agregar la cantidad seleccionada al producto
        carrito.push(item);
    }

    let timerInterval
    Swal.fire({
        title: '¡Tu producto se ha agregado con éxito!✅',
        icon: 'info',
        html: `<p>Confirma tu pedido en el carrito o sigue comprando :)</p><br><button type="button" class="btn btn-primary position-relative" data-bs-toggle="modal"
      data-bs-target="#exampleModal" onclick="Swal.close()">
      Ir a Carrito
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart4"
          viewBox="0 0 16 16" style="margin-bottom: 5px;">
          <path
              d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z" />
      </svg>
      <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
      id="contadorCarrito">
      +1
  </span>
  </button>`,
        timer: 9000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
        }
    })


    actualizarCarrito();
};


const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId);
    const indice = carrito.indexOf(item);

    carrito.splice(indice, 1);
    actualizarCarrito();
};

const actualizarCarrito = () => {
    // Check if there are any items in the cart
    const hasItemsInCart = carrito.length > 0;

    // Generate an HTML table for the cart items
    let tableHTML = "<table>";

    // Add table header if there are items in the cart
    if (hasItemsInCart) {
        tableHTML += "<tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th></th></tr>";
    }

    carrito.forEach((prod) => {
        // Ensure the quantity is a valid number
        // const cantidad = !isNaN(prod.cantidad) && parseInt(prod.cantidad, 10) > 0 ? parseInt(prod.cantidad, 10) : 0;

        // Construct the table rows for each product
        tableHTML += "<tr>";
        tableHTML += `<td>${prod.nombre}</td>`;
        tableHTML += `<td>$${prod.precio}</td>`;
        tableHTML += `<td>
            <input type="number" class="form-control cantidad-input" value="${prod.cantidad}" min="1" data-prod-id="${prod.id}">
        </td>`;
        tableHTML += `
            <td>
            <button type="button" class="btn btn-outline-danger" onclick="eliminarDelCarrito(${prod.id})">Eliminar</button>
            </td>`;
        tableHTML += "</tr>";
    });

    tableHTML += "</table>";

    // Apply styles for better readability
    tableHTML = '<style>table { width: 100%; border-collapse: collapse; } th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }</style>' + tableHTML;

    // Display the table in the HTML
    contenedorCarrito.innerHTML = tableHTML;

    // Show/hide CartMessage based on whether there are items in the cart
    if (hasItemsInCart) {
        CartMessage.setAttribute("hidden", true);
    } else {
        CartMessage.removeAttribute("hidden");
    }
    contadorCarrito.innerText = carrito.length;
    // Calculate and display total price
    const totalPrice = carrito.reduce((acc, prod) => acc + (parseInt(prod.cantidad, 10) || 0) * prod.precio, 0);
    precioTotal.innerText = `${totalPrice}`;
};



function realizarCompra() {
    // Obtener el "idUsuario" del localStorage
    var idUsuario = localStorage.getItem("idUsuario");


    // Validate quantity for each item in the cart
    for (const item of carrito) {
        if (isNaN(item.cantidad) || parseInt(item.cantidad, 10) <= 0) {
            Swal.fire('Cantidad inválida', 'La cantidad debe ser un número mayor que cero', 'error');
            return;
        }
    }

    // Verificar si el "idUsuario" existe en el localStorage
    if (idUsuario) {

        if (carrito.length > 0) {

            // Crear el arreglo de pedidos a enviar
            var pedidos = carrito.map(function (item) {
                return {
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    fecha: obtenerFechaActual(),
                    status: "En Proceso",
                    idUsuario: idUsuario
                };
            });

            fetch(URL_MAIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidos)
            })
                .then(response => response.json())
                .then(responseData => {
                    console.log('Respuesta del servidor:', responseData);
                    // Limpiar el carrito y actualizar la interfaz
                    carrito.length = 0;
                    actualizarCarrito();
                    alertExito.style.display = "block";


                    let timerInterval
                    Swal.fire({
                        title: '¡Hemos recibido con exito tu pedido!',
                        icon: 'success',
                        html: `<p>Puedes consultar tus pedidos en la sección de Mi Cuenta</p><br><button type="button" class="btn btn-primary" onclick="window.location.href='./micuenta.html';">Ir a Mi Cuenta</button>`,
                        timer: 15000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading()
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then((result) => {
                        /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                        }
                    })

                    idTimeout = setTimeout(function () {
                        alertExito.style.display = "none";
                    }, 10000);
                })
                .catch((error) => {
                    console.error('Error al enviar la solicitud POST:', error);
                });

        } else {
            Swal.fire(
                'Carrito de compras vacío:(',
                'Agrega productos al carrito de compras para confirmar tu pedido',
                'info'
            )
        }

    } else {
        Swal.fire({
            title: 'Debe iniciar sesión',
            text: 'Para confirmar tu pedido, debe iniciar sesión primero.',
            icon: 'warning',
            confirmButtonText: 'Iniciar Sesión',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redireccionar a la página de inicio de sesión
                window.location.href = './login.html';
            }
        });
    }
}

function obtenerFechaActual() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var hh = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');

    return dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;
}


function actualizarCantidadEnCarrito(prodId, newQuantity) {
    const prodIndex = carrito.findIndex((prod) => prod.id === prodId);
    if (prodIndex !== -1) {
        carrito[prodIndex].cantidad = newQuantity;
        actualizarCarrito();
    }
}