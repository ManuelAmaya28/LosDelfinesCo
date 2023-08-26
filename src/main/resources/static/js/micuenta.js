let idUsuario;
idUsuario = localStorage.getItem("idUsuario");
let mensaje = document.getElementById("mensaje");
let nombre;
let correo;
const URL_MAIN = `/sfsrw3r/${idUsuario}`;
let botonCerrar = document.getElementById("botonCerrarSesion");
let statusCompra = document.getElementById("statusCompra");
let URL_COMPRAS = `/pedidos/buscar?idUsuario=${idUsuario}`;

botonCerrar.addEventListener("click", function (event) {
    event.preventDefault();
    // Borrar el local storage
    localStorage.removeItem("idUsuario");

    // Recargar la página actual
    location.reload();
});

if (localStorage.getItem('idUsuario')) {
    window.addEventListener("load", function (event) {
        getUsuario().then((resultado) => {
            if (resultado) {
                view();
                mostrarCompra();
            } else {
                // Handle the case where fetching user data failed
            }
        }).catch((error) => {
            console.log(error);
        });
    });
}

async function getUsuario() {
    try {
        const response = await fetch(URL_MAIN, { method: 'get' });
        const json = await response.json();
        nombre = json.nombre;
        correo = json.correo;
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

function view() {
    mensaje.style.display = "none";
    botonCerrar.style.display = "block";
    const itemHTML = `
        <div class="micuenta">
            <h1>Has iniciado sesion como ${nombre}</h1>
            <h2>Correo electronico: ${correo}</h2>
        </div>`;
    const infocuenta = document.getElementById("infocuenta");
    infocuenta.innerHTML += itemHTML;
}

function mostrarCompra() {
    fetch(URL_COMPRAS)
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            stockCompras = json;
            // Generate HTML for the products
            generarProductosHTML();
        })
        .catch(function (err) {
            console.log(err);
        });
}

function generarProductosHTML() {
    // Generate an HTML table for the products
    var tablaHTML = "<div class='container'><h3>Pedidos</h3><table class='table'>";
    tablaHTML += "<thead><tr><th>Nombre producto</th><th>Precio</th><th>Cantidad</th><th>Total</th><th>Fecha</th><th>Estado del pedido</th></tr></thead><tbody>";
    
    stockCompras.forEach(function (producto) {
        tablaHTML += "<tr>";
        tablaHTML += "<td>" + producto.nombre + "</td>";
        tablaHTML += "<td>$" + producto.precio + "</td>";
        tablaHTML += "<td>" + producto.cantidad + "</td>";
        tablaHTML += "<td>$" + (producto.precio * producto.cantidad) + "</td>";
        tablaHTML += "<td>" + producto.fecha + "</td>";

        // Check the status and insert corresponding icon/emoji
        var statusHTML = "";
        if (producto.status === "Entregado") {
            statusHTML = '<span style="color: green;">✅</span> Entregado';
        } else if (producto.status === "En Proceso") {
            statusHTML = '<span style="color: yellow;">⏳</span> En Proceso';
        } else {
            statusHTML = producto.status;
        }
        tablaHTML += "<td>" + statusHTML + "</td>";

        tablaHTML += "</tr>";
    });

    tablaHTML += "</tbody></table></div>";

    // Display the table in the HTML
    document.getElementById("statusCompra").innerHTML = tablaHTML;
}


