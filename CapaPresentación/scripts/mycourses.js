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
    const userID = localStorage.getItem('userId');
    console.log('Intentando dejar curso:', cursoID, 'para el usuario:', userID);

    // Paso 1: Buscar todos los cursos del usuario
    fetch(`http://localhost:3000/usuario-cursos?usuarioID=${userID}`)
        .then(response => response.json())
        .then(cursos => {
            // Paso 2: Filtrar para encontrar el curso específico
            const cursoUsuario = cursos.find(curso => curso.cursoID === cursoID && curso.usuarioID === userID);
            if (!cursoUsuario) {
                console.error('Curso no encontrado para el usuario:', userID);
                return;
            }

            // Paso 3: Obtener el ID del curso-usuario
            const cursoUsuarioID = cursoUsuario._id;

            // Paso 4: Realizar la solicitud DELETE usando el ID obtenido
            fetch(`http://localhost:3000/usuario-cursos/${cursoUsuarioID}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    console.log('Curso dejado exitosamente.');
                    location.reload();
                } else {
                    console.error('Error al dejar el curso.');
                }
            })
            .catch(error => console.error('Error al dejar el curso:', error));
        })
        .catch(error => console.error('Error buscando cursos del usuario:', error));
}
