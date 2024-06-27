document.addEventListener('DOMContentLoaded', function() {
    fetchData();
    fetchUserData();
});

document.getElementById('crudForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('inputNombre').value;
    const apellido = document.getElementById('inputApellido').value;
    const edad = document.getElementById('inputEdad').value;
    
    fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellido, edad }), // Incluir los nuevos campos
    })
    .then(response => response.json())
    .then(() => {
        fetchData(); // Recargar lista
        document.getElementById('inputNombre').value = ''; // Limpiar campos
        document.getElementById('inputApellido').value = '';
        document.getElementById('inputEdad').value = '';
    })
    .catch(error => console.error('Error al agregar elemento:', error));
});

function fetchData() {
    fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('itemsData');
            list.innerHTML = ''; // Limpiar lista anterior

            // Crear tabla y cabecera
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr>
                <th>ID</th> <!-- Nueva columna para ID -->
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Edad</th>
                <th>Acciones</th>
            </tr>`;
            table.appendChild(thead);

            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item._id}</td> <!-- Mostrar el _id aquí -->
                    <td>${item.nombre}</td>
                    <td>${item.apellido}</td>
                    <td>${item.edad}</td>
                    <td>
                        <button onclick="editItem('${item._id}', '${item.nombre}')">Editar</button>
                        <button onclick="deleteItem('${item._id}')">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            // Agregar la tabla al div
            list.appendChild(table);
        })
        .catch(error => console.error('Error al acceder a la API:', error));
}

function editItem(id, currentName) {
    const newName = prompt("Editar elemento", currentName);
    if (newName) {
        // Asegurarse de que la solicitud PUT use la estructura correcta
        fetch(`http://localhost:3000/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: newName }), // Consistente con la estructura de los elementos
        })
        .then(() => fetchData())
        .catch(error => console.error('Error al editar elemento:', error));
    }
}

function deleteItem(id) {
    if (confirm("¿Estás seguro de querer eliminar este elemento?")) {
        fetch(`http://localhost:3000/items/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchData())
        .catch(error => console.error('Error al eliminar elemento:', error));
    }
}

document.getElementById('usuarioForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correoElectronico = document.getElementById('correo_electronico').value;
    const contrasena = document.getElementById('contrasena').value;
    const genero = document.getElementById('genero').value;
    const numeroTelefono = document.getElementById('numero_telefono').value;
    
    fetch('http://localhost:3000/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellido, correoElectronico, contrasena, genero, numeroTelefono }),
    })
    .then(response => response.json())
    .then(() => {
        fetchUserData(); // Recargar lista de usuarios
        // Limpiar campos
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('correo_electronico').value = '';
        document.getElementById('contrasena').value = '';
        document.getElementById('genero').value = '';
        document.getElementById('numero_telefono').value = '';
    })
    .catch(error => console.error('Error al agregar usuario:', error));
});

function fetchUserData() {
    fetch('http://localhost:3000/usuarios')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('usersData');
            list.innerHTML = ''; // Limpiar lista anterior

            // Crear tabla y cabecera
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo Electrónico</th>
                <th>Género</th>
                <th>Número de Teléfono</th>
                <th>Acciones</th>
            </tr>`;
            table.appendChild(thead);

            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item._id}</td>
                    <td>${item.nombre}</td>
                    <td>${item.apellido}</td>
                    <td>${item.correoElectronico}</td>
                    <td>${item.genero}</td>
                    <td>${item.numeroTelefono}</td>
                    <td>
                        <button onclick="editItem('${item._id}')">Editar</button>
                        <button onclick="deleteItem('${item._id}')">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            // Agregar la tabla al div
            list.appendChild(table);
        })
        .catch(error => console.error('Error al acceder a la API:', error));
}

function deleteUser(id) {
    if (confirm("¿Estás seguro de querer eliminar este usuario?")) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchData())
        .catch(error => console.error('Error al eliminar usuario:', error));
    }
}