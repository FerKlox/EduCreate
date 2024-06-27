document.addEventListener('DOMContentLoaded', fetchData);

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
            const list = document.getElementById('apiData');
            list.innerHTML = ''; // Limpiar lista anterior

            // Crear tabla y cabecera
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr>
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
                    <td>${item.nombre}</td>
                    <td>${item.apellido}</td> <!-- Corregido de 'apeliido' a 'apellido' -->
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

//USUARIO

document.getElementById('usuarioForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const usuario_ID = document.getElementById('usuario_ID').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo_electronico = document.getElementById('correo_electronico').value;
    const contrasena = document.getElementById('contrasena').value;
    const genero = document.getElementById('genero').value;
    const numero_telefono = document.getElementById('numero_telefono').value;

    const url = usuario_ID ? `http://localhost:3000/usuarios/${usuario_ID}` : 'http://localhost:3000/usuarios';
    const method = usuario_ID ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, apellido, correo_electronico, contrasena, genero, numero_telefono }),
    })
    .then(response => response.json())
    .then(() => {
        // Recargar los datos del usuario o limpiar el formulario
        console.log('Usuario agregado/actualizado con éxito');        
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('correo_electronico').value = '';
        document.getElementById('contrasena').value = '';
        document.getElementById('genero').value = '';
        document.getElementById('numero_telefono').value = '';
    })
    .catch(error => console.error('Error:', error));
});

function fetchUsers() {
    fetch('http://localhost:3000/usuarios')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('userData');
            list.innerHTML = ''; // Limpiar lista anterior

            // Crear tabla y cabecera
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr>
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
            data.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.nombre}</td>
                    <td>${user.apellido}</td>
                    <td>${user.correo_electronico}</td>
                    <td>${user.genero}</td>
                    <td>${user.numero_telefono}</td>
                    <td>
                        <button onclick="editUser('${user._id}', '${user.nombre}')">Editar</button>
                        <button onclick="deleteUser('${user._id}')">Eliminar</button>
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

function editUser(id, currentName) {
    const newName = prompt("Editar nombre del usuario", currentName);
    if (newName && newName !== currentName) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: newName }) // Asumiendo que solo se edita el nombre
        })
        .then(response => {
            if (response.ok) {
                fetchUsers(); // Recargar la lista de usuarios
                console.log('Usuario actualizado con éxito');
            } else {
                throw new Error('Error al actualizar el usuario');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

function deleteUser(id) {
    if (confirm("¿Estás seguro de querer eliminar este usuario?")) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                fetchUsers(); // Recargar la lista de usuarios
                console.log('Usuario eliminado con éxito');
            } else {
                throw new Error('Error al eliminar el usuario');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

//CURSO

