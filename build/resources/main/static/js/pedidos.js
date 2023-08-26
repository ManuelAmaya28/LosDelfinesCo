const URL_MAIN2 = "/administradores/";

window.addEventListener("load", async function (event) {
    try {
        const idUsuario = localStorage.getItem("idUsuario");
        const isAdmin = await checkAdmins();
        if (!isAdmin) {
            const denegado = document.getElementById("enProceso");
            denegado.innerHTML = `
                <div class="bloqueo" style="padding: 80px;">
                    <h1>ACCESO DENEGADO</h1>
                </div>`;
        } else {
            // Llamar a las funciones para obtener los datos y mostrarlos en la tabla
            Promise.all([fetchPedidos(), fetchUsuarios()])
                .then(([pedidos, usuarios]) => displayData(pedidos, usuarios))
                .catch(error => console.error('Error:', error));
        }
    } catch (error) {
        console.log(error);
    }
});

async function checkAdmins() {
    try {
        const response = await fetch(URL_MAIN2, { method: "get" });
        const adminList = await response.json();

        const idUsuario = localStorage.getItem("idUsuario");
        const responseUser = await fetch(`/sfsrw3r/${idUsuario}`, { method: "get" });
        const user = await responseUser.json();

        return adminList.some(admin => admin.correo === user.correo);
    } catch (error) {
        console.log(error);
        return false;
    }
}



document.getElementById("actualizar").addEventListener("click", function () {
    location.reload();
});

// Función para realizar la solicitud GET de usuarios
function fetchUsuarios() {
    return fetch('/sfsrw3r/')
        .then(response => response.json());
}

// Función para realizar la solicitud GET de pedidos
function fetchPedidos() {
    return fetch('/pedidos/')
        .then(response => response.json());
}

function displayData(data, usuarios) {
    data.sort((a, b) => a.status.localeCompare(b.status));

    var entregadosHTML = '<div class="table-responsive"><table class="table">';
    entregadosHTML += '<thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Fecha / Hora</th><th>Nombre</th><th>Domicilio</th><th>Teléfono</th><th>Total</th><th>Estado</th></tr></thead><tbody>';

    var enProcesoHTML = '<div class="table-responsive"><table class="table">';
    enProcesoHTML += '<thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Fecha / Hora</th><th>Nombre</th><th>Domicilio</th><th>Teléfono</th><th>Total</th><th>Estado</th></tr></thead><tbody>';

    data.forEach((item) => {
        const usuario = usuarios.find(user => user.id === item.idUsuario);

        const rowStyle = item.status === 'Entregado' ? 'background-color: #58D68D;' : '';

        const total = item.cantidad * item.precio;

        const statusText = item.status === 'Entregado' ? 'Entregado' : 'Entregar';

        const rowHTML = `<tr style="${rowStyle}">
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio}</td>
            <td>${item.fecha}</td>
            <td>${usuario ? usuario.nombre : 'Desconocido'}</td>
            <td>${usuario ? usuario.domicilio : 'Desconocido'}</td>
            <td>${usuario ? usuario.telefono : 'Desconocido'}</td>
            <td>$${total}</td>
            <td>
                <button type="button" class="btn btn-success ${item.status === 'Entregado' ? 'disabled' : ''}"
                        onclick="actualizarEstado(${item.id})"
                        data-id="${item.id}">${statusText}</button>
            </td>
        </tr>`;

        if (item.status === 'Entregado') {
            entregadosHTML += rowHTML;
        } else {
            enProcesoHTML += rowHTML;
        }
    });

    entregadosHTML += '</tbody></table></div>';
    enProcesoHTML += '</tbody></table></div>';

    document.getElementById('entregados').innerHTML = entregadosHTML;
    document.getElementById('enProceso').innerHTML = enProcesoHTML;
}


function actualizarEstado(pedidoId) {
    // Agrega el spinner de carga al botón
    const button = document.querySelector(`button[data-id="${pedidoId}"]`);
    button.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Entregando...`;

    const url = '/pedidos/' + pedidoId;
    const newData = {
        status: 'Entregado'
    };

    const formData = new URLSearchParams();
    formData.append('status', newData.status);

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
        .then(response => response.json())
        .then(updatedPedido => {
            console.log('Pedido actualizado:', updatedPedido);
            // Llamar a fetchPedidos y fetchUsuarios para actualizar la tabla después de la actualización
            Promise.all([fetchPedidos(), fetchUsuarios()])
                .then(([pedidos, usuarios]) => displayData(pedidos, usuarios))
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error al actualizar el pedido:', error));
}
