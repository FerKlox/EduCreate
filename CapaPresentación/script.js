document.addEventListener('DOMContentLoaded', function() {    
    fetchUsersData();
    fetchCursosData();
    fetchContenidoCursosData();
    fetchUsuariosCursoData();
    fetchNotificacionesData();
});

//USUARIOS

document.getElementById('usuarioForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const correoElectronico = document.getElementById('correo_electronico').value;

    // Primero, verifica si el correo ya está registrado
    fetch(`http://localhost:3000/usuarios?correoElectronico=${correoElectronico}`)
    .then(response => response.json())
    .then(data => {
        console.log(data); // Agregado para depurar la respuesta de la API
        // Asegúrate de que esta condición refleje correctamente cómo la API indica un correo ya registrado
        const emailExist = data.find(user => user.correoElectronico === correoElectronico);

        if (emailExist) {
            alert('The email is already registered');
            return;
        }
        // Si no se encuentra el correo, procede con el registro
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
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
            fetchUsersData(); // Recargar lista de usuarios
            // Limpiar campos
            document.getElementById('nombre').value = '';
            document.getElementById('apellido').value = '';
            document.getElementById('correo_electronico').value = '';
            document.getElementById('contrasena').value = '';
            document.getElementById('genero').value = '';
            document.getElementById('numero_telefono').value = '';
            alert('Successfully registered');
            window.location.href = 'login.html';
        })
        .catch(error => console.error('Error al agregar usuario:', error));
    })
    .catch(error => console.error('Error al verificar el correo electrónico:', error));
});

function fetchUsersData() {
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
                <th>Contraseña</th>
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
                    <td>${item.nombre} <button onclick="editUserName('${item._id}', '${item.nombre}')">Editar</button></td>
                    <td>${item.apellido} <button onclick="editUserApellido('${item._id}', '${item.apellido}')">Editar</button></td>
                    <td>${item.correoElectronico} <button onclick="editUserCorreoElectronico('${item._id}', '${item.correoElectronico}')">Editar</button></td>
                    <td>${item.contrasena} <button onclick="editUserContrasena('${item._id}', '${item.contrasena}')">Editar</button></td>
                    <td>${item.genero} <button onclick="editUserGenero('${item._id}', '${item.genero}')">Editar</button></td>
                    <td>${item.numeroTelefono} <button onclick="editUserNumeroTelefono('${item._id}', '${item.numeroTelefono}')">Editar</button></td>
                    <td>                        
                        <button onclick="deleteUser('${item._id}')">Eliminar</button>
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

function editUserName(id, currentNombre) {
    const newName = prompt("Editar elemento", currentNombre);
    if (newName) {
        // Asegurarse de que la solicitud PUT use la estructura correcta
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre: newName }), // Consistente con la estructura de los elementos
        })
        .then(() => fetchUsersData())
        .catch(error => console.error('Error al editar elemento:', error));
    }
}

function editUserApellido(id, currentApellido) {
    const newApellido = prompt("Editar apellido", currentApellido);
    if (newApellido) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apellido: newApellido }),
        })
        .then(() => fetchUsersData())
        .catch(error => console.error('Error al editar apellido:', error));
    }
}

function editUserCorreoElectronico(id, currentCorreoElectronico) {
    const newCorreoElectronico = prompt("Editar correo electrónico", currentCorreoElectronico);
    if (newCorreoElectronico) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correoElectronico: newCorreoElectronico }),
        })
        .then(() => fetchUsersData())
        .catch(error => console.error('Error al editar correo electrónico:', error));
    }
}
function editUserContrasena(id, currentContrasena) {
    const newContrasena = prompt("Editar contraseña", currentContrasena);
    if (newContrasena) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contrasena: newContrasena }),
        })
        .then(() => fetchUsersData())
        .catch(error => console.error('Error al editar contraseña:', error));
    }
}
function editUserGenero(id, currentGenero) {
    const newGenero = prompt("Editar género", currentGenero);
    if (newGenero) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ genero: newGenero }),
        })
        .then(() => fetchUsersData())
        .catch(error => console.error('Error al editar género:', error));
    }
}

function editUserNumeroTelefono(id, currentNumeroTelefono) {
    const newNumeroTelefono = prompt("Editar número de teléfono", currentNumeroTelefono);
    if (newNumeroTelefono) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numeroTelefono: newNumeroTelefono }),
        })
        .then(() => fetchUsersData())
        .catch(error => console.error('Error al editar número de teléfono:', error));
    }
}

function deleteUser(id) {
    if (confirm("¿Estás seguro de querer eliminar este usuario?")) {
        fetch(`http://localhost:3000/usuarios/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchUsersData())
        .catch(error => console.error('Error al eliminar usuario:', error));
    }
}

//CURSOS

document.getElementById('cursoForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Recolectar los datos del formulario
    const cursoData = {
        titulo: document.getElementById('titulo').value,
        descripcion: document.getElementById('curso_descripcion').value,
        fechaCreacion: document.getElementById('fechaCreacion').value,
        duracion: parseInt(document.getElementById('duracion').value, 10),
        materiaCurs: parseInt(document.getElementById('materiaCurs').value, 10),
        urlVideo: document.getElementById('urlVideo').value
    };

    // Enviar los datos al API
fetch('http://localhost:3000/cursos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(cursoData)
})
.then(response => response.json())
.then(data => {
    console.log('Curso agregado:', data);
    fetchCursosData(); // Recargar lista de cursos
    // Limpiar campos
    document.getElementById('titulo').value = '';
    document.getElementById('curso_descripcion').value = '';
    document.getElementById('fechaCreacion').value = '';
    document.getElementById('duracion').value = '';
    document.getElementById('materiaCurs').value = '';
    document.getElementById('urlVideo').value = '';
})
.catch(error => console.error('Error al agregar curso:', error));
});

function fetchCursosData() {
    fetch('http://localhost:3000/cursos')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('cursosData');
            list.innerHTML = ''; // Limpiar lista anterior

            // Crear tabla y cabecera
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha de Creación</th>
                <th>Duración</th>
                <th>Materia</th>
                <th>URL del Video</th>
                <th>Acciones</th>
            </tr>`;
            table.appendChild(thead);

            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item._id}</td>
                    <td>${item.titulo} <button onclick="editCursoTitulo('${item._id}', '${item.titulo}')">Editar</button></td>
                    <td>${item.descripcion} <button onclick="editCursoDescripcion('${item._id}', '${item.descripcion}')">Editar</button></td>
                    <td>${new Date(item.fechaCreacion).toLocaleDateString()} <button onclick="editCursoFechaCreacion('${item._id}', '${item.fechaCreacion}')">Editar</button></td>
                    <td>${item.duracion} horas <button onclick="editCursoDuracion('${item._id}', '${item.duracion}')">Editar</button></td>
                    <td>${item.materiaCurs} <button onclick="editCursoMateriaCurs('${item._id}', '${item.materiaCurs}')">Editar</button></td>
                    <td>${item.urlVideo} <button onclick="editCursoUrlVideo('${item._id}', '${item.urlVideo}')">Editar</button></td>                    
                    <td>                        
                        <button onclick="deleteCurso('${item._id}')">Eliminar</button>
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

function editCursoTitulo(id, currentTitulo) {
    const newTitulo = prompt("Editar título", currentTitulo);
    if (newTitulo) {
        fetch(`http://localhost:3000/cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ titulo: newTitulo }),
        })
        .then(() => fetchCursosData())
        .catch(error => console.error('Error al editar título:', error));
    }
}

function editCursoDescripcion(id, currentDescripcion) {
    const newDescripcion = prompt("Editar descripción", currentDescripcion);
    if (newDescripcion) {
        fetch(`http://localhost:3000/cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ descripcion: newDescripcion }),
        })
        .then(() => fetchCursosData())
        .catch(error => console.error('Error al editar descripción:', error));
    }
}

function editCursoFechaCreacion(id, currentFechaCreacion) {
    const newFechaCreacion = prompt("Editar fecha de creación", currentFechaCreacion);
    if (newFechaCreacion) {
        fetch(`http://localhost:3000/cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fechaCreacion: newFechaCreacion }),
        })
        .then(() => fetchCursosData())
        .catch(error => console.error('Error al editar fecha de creación:', error));
    }
}

function editCursoDuracion(id, currentDuracion) {
    const newDuracion = prompt("Editar duración", currentDuracion);
    if (newDuracion) {
        fetch(`http://localhost:3000/cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ duracion: newDuracion }),
        })
        .then(() => fetchCursosData())
        .catch(error => console.error('Error al editar duración:', error));
    }
}

function editCursoMateriaCurs(id, currentMateriaCurs) {
    const newMateriaCurs = prompt("Editar materia", currentMateriaCurs);
    if (newMateriaCurs) {
        fetch(`http://localhost:3000/cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ materiaCurs: newMateriaCurs }),
        })
        .then(() => fetchCursosData())
        .catch(error => console.error('Error al editar materia:', error));
    }
}

function editCursoUrlVideo(id, currentUrlVideo) {
    const newUrlVideo = prompt("Editar URL del video", currentUrlVideo);
    if (newUrlVideo) {
        fetch(`http://localhost:3000/cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urlVideo: newUrlVideo }),
        })
        .then(() => fetchCursosData())
        .catch(error => console.error('Error al editar URL del video:', error));
    }
}

function deleteCurso(id) {
    if (confirm("¿Estás seguro de querer eliminar este curso?")) {
        fetch(`http://localhost:3000/cursos/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchCursosData())
        .catch(error => console.error('Error al eliminar curso:', error));
    }
}

//CONTENIDO CURSOS

document.getElementById('contenidoCursoForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Recoger los valores del formulario
    const cursoID = document.getElementById('curso_ID').value;
    const tipoContenido = document.getElementById('tipo_contenido').value;
    const descripcion = document.getElementById('contenido_curso_descripcion').value;
    const urlVideo = document.getElementById('url_video').value;

    // Crear el objeto de datos para enviar
    const data = {
        cursoID: cursoID,
        tipoContenido: tipoContenido,
        descripcion: descripcion,
        urlVideo: urlVideo
    };

    // Enviar los datos al API
    fetch('http://localhost:3000/contenido-cursos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Contenido del curso agregado:', data);
        fetchContenidoCursosData(); // Recargar lista de contenidos de cursos
        // Limpiar campos
        document.getElementById('curso_ID').value = '';
        document.getElementById('tipo_contenido').value = '';
        document.getElementById('contenido_curso_descripcion').value = '';
        document.getElementById('url_video').value = '';
    })
    .catch(error => {
        console.error('Error al agregar contenido del curso:', error);
    });
});

function fetchContenidoCursosData() {
    fetch('http://localhost:3000/contenido-cursos')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('contenidoCursosData');
            list.innerHTML = ''; // Limpiar lista anterior

            // Crear tabla y cabecera
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr>
                <th>ID</th>
                <th>ID del Curso</th>
                <th>Tipo de Contenido</th>
                <th>Descripción</th>
                <th>URL del Video</th>
                <th>Acciones</th>
            </tr>`;
            table.appendChild(thead);

            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item._id}</td>
                    <td>${item.cursoID}<button onclick="editContenidoCursoID('${item._id}', '${item.cursoID}')">Editar</button></td>
                    <td>${item.tipoContenido}<button onclick="editContenidoCursoTipoContenido('${item._id}', '${item.tipoContenido}')">Editar</button></td> 
                    <td>${item.descripcion}<button onclick="editContenidoCursoDescripcion('${item._id}', '${item.descripcion}')">Editar</button></td>
                    <td>${item.urlVideo}<button onclick="editContenidoCursoUrlVideo('${item._id}', '${item.urlVideo}')">Editar</button></td>                    
                    <td>                        
                        <button onclick="deleteContenidoCurso('${item._id}')">Eliminar</button>
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

function editContenidoCursoID(id, currentID) {
    const newID = prompt("Editar ID del curso", currentID);
    if (newID) {
        fetch(`http://localhost:3000/contenido-cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cursoID: newID }),
        })
        .then(() => fetchContenidoCursosData())
        .catch(error => console.error('Error al editar ID del curso:', error));
    }
}
function editContenidoCursoTipoContenido(id, currentTipoContenido) {
    const newTipoContenido = prompt("Editar tipo de contenido", currentTipoContenido);
    if (newTipoContenido) {
        fetch(`http://localhost:3000/contenido-cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tipoContenido: newTipoContenido }),
        })
        .then(() => fetchContenidoCursosData())
        .catch(error => console.error('Error al editar tipo de contenido:', error));
    }
}
function editContenidoCursoDescripcion(id, currentDescripcion) {
    const newDescripcion = prompt("Editar descripción", currentDescripcion);
    if (newDescripcion) {
        fetch(`http://localhost:3000/contenido-cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ descripcion: newDescripcion }),
        })
        .then(() => fetchContenidoCursosData())
        .catch(error => console.error('Error al editar descripción:', error));
    }
}
function editContenidoCursoUrlVideo(id,currentUrlVideo) {
    const newUrlVideo = prompt("Editar URL del video", currentUrlVideo);
    if (newUrlVideo) {
        fetch(`http://localhost:3000/contenido-cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urlVideo: newUrlVideo }),
        })
        .then(() => fetchContenidoCursosData())
        .catch(error => console.error('Error al editar URL del video:', error));
    }
}

function deleteContenidoCurso(id) {
    if (confirm("¿Estás seguro de querer eliminar este contenido del curso?")) {
        fetch(`http://localhost:3000/contenido-cursos/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchContenidoCursosData())
        .catch(error => console.error('Error al eliminar contenido del curso:', error));
    }
}

//usuarioCursos

document.getElementById('usuarioCursoForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Recoger los valores del formulario
    const usuarioID = document.getElementById('uc_usuario_ID').value;
    const cursoID = document.getElementById('uc_curso_ID').value;
    const fechaInscripcion = document.getElementById('fecha_inscripcion').value;

    // Crear el objeto de datos para enviar
    const data = {
        usuarioID: usuarioID,
        cursoID: cursoID,
        fechaInscripcion: fechaInscripcion
    };

    // Enviar los datos al API
    fetch('http://localhost:3000/usuario-cursos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Inscripción agregada:', data);
        // Aquí puedes agregar código para manejar la respuesta, como actualizar la UI
        fetchUsuariosCursoData();
    })
    .catch(error => {
        console.error('Error al agregar inscripción:', error);
    });
});

function fetchUsuariosCursoData() {
    fetch('http://localhost:3000/usuario-cursos')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('usuariosCursoData');
            list.innerHTML = ''; // Limpiar lista anterior

            // Crear tabla y cabecera
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr>
                <th>ID</th>
                <th>ID del Usuario</th>
                <th>ID del Curso</th>
                <th>Fecha de Inscripción</th>
                <th>Acciones</th>
            </tr>`;
            table.appendChild(thead);

            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item._id}</td>
                    <td>${item.usuarioID} <button onclick="editUsuarioCurso_usuarioID('${item._id}', '${item.usuarioID}')">Editar</button></td>
                    <td>${item.cursoID} <button onclick="editUsuarioCurso_cursoID('${item._id}', '${item.cursoID}')">Editar</button></td>
                    <td>${item.fechaInscripcion} <button onclick="editUsuarioCurso_fechaInscripcion('${item._id}', '${item.fechaInscripcion}')">Editar</button></td>
                    <td>
                        <button onclick="deleteUsuarioCurso('${item._id}')">Eliminar</button>
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

function editUsuarioCurso_usuarioID(id, currentUsuarioID) {
    const newUsuarioID = prompt("Editar ID del usuario", currentUsuarioID);
    if (newUsuarioID) {
        fetch(`http://localhost:3000/usuario-cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuarioID: newUsuarioID }),
        })
        .then(() => fetchUsuariosCursoData())
        .catch(error => console.error('Error al editar ID del usuario:', error));
    }
}

function editUsuarioCurso_cursoID(id, currentCursoID) {
    const newCursoID = prompt("Editar ID del curso", currentCursoID);
    if (newCursoID) {
        fetch(`http://localhost:3000/usuario-cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cursoID: newCursoID }),
        })
        .then(() => fetchUsuariosCursoData())
        .catch(error => console.error('Error al editar ID del curso:', error));
    }
}

function editUsuarioCurso_fechaInscripcion(id, currentFechaInscripcion) {
    const newFechaInscripcion = prompt("Editar fecha de inscripción", currentFechaInscripcion);
    if (newFechaInscripcion) {
        fetch(`http://localhost:3000/usuario-cursos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fechaInscripcion: newFechaInscripcion }),
        })
        .then(() => fetchUsuariosCursoData())
        .catch(error => console.error('Error al editar fecha de inscripción:', error));
    }
}

function deleteUsuarioCurso(id) {
    if (confirm("¿Estás seguro de querer eliminar esta inscripción?")) {
        fetch(`http://localhost:3000/usuario-cursos/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchUsuariosCursoData())
        .catch(error => console.error('Error al eliminar inscripción:', error));
    }
}

//NOTIFICAIONES

document.getElementById('notificacionForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el envío tradicional del formulario

    // Recoger los valores del formulario
    const usuarioID = document.getElementById('n_usuario_ID').value;
    const descripcion = document.getElementById('n_descripcion').value;
    const fechaEnvio = document.getElementById('fecha_envio').value;
    const horaEnvio = document.getElementById('hora_envio').value;

    // Construir el cuerpo de la solicitud
    const data = {
        usuarioID: usuarioID,
        descripcion: descripcion,
        fechaEnvio: fechaEnvio,
        horaEnvio: horaEnvio
    };

    // Realizar la solicitud POST
    fetch('http://localhost:3000/notificaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function fetchNotificacionesData() {
    fetch('http://localhost:3000/notificaciones')
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('notificacionesData'); // Asegúrate de tener este ID en tu HTML
            list.innerHTML = ''; // Limpiar lista anterior

            // Crear tabla y cabecera
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            thead.innerHTML = `<tr>
                <th>ID</th>
                <th>ID del Usuario</th>
                <th>Descripción</th>
                <th>Fecha de Envío</th>
                <th>Hora de Envío</th>
                <th>Acciones</th>
            </tr>`;
            table.appendChild(thead);

            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item._id}</td>
                    <td>${item.usuarioID} <button onclick="editNotificacion_usuarioID('${item._id}', '${item.usuarioID}')">Editar</button></td>
                    <td>${item.descripcion} <button onclick="editNotificacion_descripcion('${item._id}', '${item.descripcion}')">Editar</button></td>
                    <td>${item.fechaEnvio} <button onclick="editNotificacion_fechaEnvio('${item._id}', '${item.fechaEnvio}')">Editar</button></td>
                    <td>${item.horaEnvio} <button onclick="editNotificacion_horaEnvio('${item._id}', '${item.horaEnvio}')">Editar</button></td>
                    <td>                        
                        <button onclick="deleteNotificacion('${item._id}')">Eliminar</button>
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

function editNotificacion_usuarioID(id, currentUsuarioID) {
    const newUsuarioID = prompt("Editar ID del usuario", currentUsuarioID);
    if (newUsuarioID) {
        fetch(`http://localhost:3000/notificaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuarioID: newUsuarioID }),
        })
        .then(() => fetchNotificacionesData())
        .catch(error => console.error('Error al editar ID del usuario:', error));
    }
}

function editNotificacion_descripcion(id, currentDescripcion) {
    const newDescripcion = prompt("Editar descripción", currentDescripcion);
    if (newDescripcion) {
        fetch(`http://localhost:3000/notificaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ descripcion: newDescripcion }),
        })
        .then(() => fetchNotificacionesData())
        .catch(error => console.error('Error al editar descripción:', error));
    }
}

function editNotificacion_fechaEnvio(id, currentFechaEnvio) {
    const newFechaEnvio = prompt("Editar fecha de envío", currentFechaEnvio);
    if (newFechaEnvio) {
        fetch(`http://localhost:3000/notificaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fechaEnvio: newFechaEnvio }),
        })
        .then(() => fetchNotificacionesData())
        .catch(error => console.error('Error al editar fecha de envío:', error));
    }
}

function editNotificacion_horaEnvio(id, currentHoraEnvio) {
    const newHoraEnvio = prompt("Editar hora de envío", currentHoraEnvio);
    if (newHoraEnvio) {
        fetch(`http://localhost:3000/notificaciones/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ horaEnvio: newHoraEnvio }),
        })
        .then(() => fetchNotificacionesData())
        .catch(error => console.error('Error al editar hora de envío:', error));
    }
}

function deleteNotificacion(id) {
    if (confirm("¿Estás seguro de querer eliminar esta notificación?")) {
        fetch(`http://localhost:3000/notificaciones/${id}`, {
            method: 'DELETE',
        })
        .then(() => fetchNotificacionesData())
        .catch(error => console.error('Error al eliminar notificación:', error));
    }
}   