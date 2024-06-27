document.addEventListener('DOMContentLoaded', function() {
    // Obtiene el userID del localStorage
    const userID = localStorage.getItem('userId'); 
    console.log('userID:', userID);
// Verifica si el userID existe antes de hacer la solicitud
    if (userID) {
        // Modifica la URL para incluir el userID en la solicitud
        fetch('http://localhost:3000/usuario-cursos')
            .then(response => response.json())
            .then(usuarioCursos => {
                console.log('Usuario cursos:', usuarioCursos);
                const cursosDelUsuario = usuarioCursos.filter(uc => uc.usuarioID === userID);
                console.log('Cursos del usuario:', cursosDelUsuario);

                const cursosIDs = cursosDelUsuario.map(uc => uc.cursoID);
                console.log('IDs de cursos:', cursosIDs);

                // Asumiendo que tienes una URL base para los cursos
                const baseURL = 'http://localhost:3000/cursos/';

                // Obtén todos los cursos disponibles
                fetch(baseURL)
                    .then(response => response.json())
                    .then(todosLosCursos => {
                        // Filtra para obtener solo los cursos del usuario
                        const cursosFiltrados = todosLosCursos.filter(curso => cursosIDs.includes(curso._id)); // Asegúrate de que 'id' sea la propiedad correcta

                        // Para cada curso del usuario, crea y agrega el elemento del curso al contenedor
                        if (cursosFiltrados.length === 0) {
                            const mensajeVacio = document.createElement('div');
                            mensajeVacio.className = 'empty-course-list';
                            mensajeVacio.innerHTML = `<p>Currently, there are no courses available.</p>`;
                            document.querySelector('#courses-container').appendChild(mensajeVacio);
                        } else {
                            cursosFiltrados.forEach(curso => {
                                console.log('Curso:', curso);
                                const cursoElement = document.createElement('div');
                                
                                const courseImage = document.createElement('img');
                                courseImage.src = curso.urlVideo; // Actualizado para usar urlVideo como fuente de la imagen

                                cursoElement.className = 'course-card';
                                cursoElement.innerHTML = `
                                    <!-- Aquí podrías optar por mostrar un enlace al video o una imagen predeterminada -->
                                    <div class="course-video">
                                        <a href="${curso.urlVideo}" target="_blank"><img src="${courseImage.src}" alt="Ver Video"></a>
                                    </div>
                                    <div class="course-details">
                                        <h3>${curso.titulo}</h3>
                                        <p><i class="date">${curso.fechaCreacion}</i></p>
                                        <p>${curso.descripcion}</p>
                                        <button class="drop-course-button" onclick="dejarCurso('${curso._id}')">Drop out of the course</button>
                                    </div>
                                `;
                                document.querySelector('#courses-container').appendChild(cursoElement); // Asegúrate de que el selector sea correcto
                            });
                        }
                    })
                    .catch(error => console.error('Error fetching courses:', error));
            })
            .catch(error => console.error('Error fetching user courses:', error));
    }
});

function dejarCurso(cursoID) {
    // Obtener usuarioId desde localStorage
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
        console.error('usuarioId no está disponible en localStorage');
        return;
    }

    fetch('http://localhost:3000/usuario-cursos/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(data => {
            // Usar .find para buscar el curso específico por cursoID y usuarioId
            
            const cursoUsuarioEncontrado = data.find(curso => curso.cursoID === cursoID && curso.usuarioId === usuarioId);
            console.log('Datos:', cursoUsuarioEncontrado);
            if (cursoUsuarioEncontrado) {
                console.log('Curso del usuario encontrado:', cursoUsuarioEncontrado);
                // Proceder a eliminar el curso
                eliminarCurso(cursoUsuarioEncontrado.id, usuarioId);
            } else {
                console.log('Curso del usuario no encontrado');
            }
        })
        .catch(error => console.error('Error:', error));
}

function eliminarCurso(cursoID, usuarioId) {
    // Asumiendo que el servidor requiere cursoID y usuarioId para eliminar un curso
    fetch(`http://localhost:3000/usuario-cursos/${cursoID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuarioId: usuarioId }) // Enviar usuarioId en el cuerpo si es necesario
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el curso');
        }
        console.log('Curso eliminado con éxito');
        // Actualizar la UI aquí o realizar otras acciones necesarias después de la eliminación
    })
    .catch(error => console.error('Error al eliminar el curso:', error));
}

