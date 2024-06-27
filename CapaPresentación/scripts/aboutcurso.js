document.addEventListener("DOMContentLoaded", function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const cursoId = getQueryParam('cursoId');
    console.log('ID del curso:', cursoId);

    // Suponiendo que esta función obtiene los detalles del curso basados en cursoId
    fetchCourseDetails(cursoId).then(courseData => {
        updateCourseContent(courseData);
    }).catch(error => {
        console.error("Error al cargar los detalles del curso:", error);
    });
    // Suponiendo que esta función obtiene los detalles del Contenidocurso basados en cursoId
    fetchContenidoCursoDetails(cursoId).then(ContentcourseData => {
        updateContentCourseContent(ContentcourseData);
    }).catch(error => {
        console.error("Error al cargar los detalles del Contenido del curso:", error);
    });
});

// Función para simular la obtención de datos del curso
function fetchCourseDetails(cursoId) {
    return fetch('http://localhost:3000/cursos') // Realiza la solicitud a la misma URL
        .then(response => response.json())
        .then(data => {
            // Filtra para encontrar el curso específico por su ID
            const curso = data.find(c => c._id === cursoId);
            if (!curso) {
                throw new Error('Curso no encontrado');
            }
            // Transforma los datos del curso al formato esperado
            return {
                title: curso.titulo,
                description: curso.descripcion,
                duration: `${curso.duracion} Minutes`,
                videoSrc: curso.urlVideo
            };
        });
}

function fetchContenidoCursoDetails(cursoId) {
    return fetch('http://localhost:3000/contenido-cursos') // Realiza la solicitud a la URL de contenido de cursos
        .then(response => response.json())
        .then(data => {
            // Filtra para encontrar el contenido específico por el ID del curso
            const contenido = data.find(c => c.cursoID === cursoId);
            if (!contenido) {
                throw new Error('Contenido del curso no encontrado');
            }
            // Transforma los datos del contenido del curso al formato esperado
            return {
                id: contenido.id,
                cursoId: contenido.cursoId,
                tipoContenido: contenido.tipoContenido,
                descripcion: contenido.descripcion,
                videoSrc: contenido.urlVideo
            };
        });
}

// Función para actualizar el contenido de la página con los datos del curso
function updateCourseContent(courseData) {
    document.querySelector('.header-content h1').textContent = courseData.title;
    document.querySelector('.course-info h2').textContent = courseData.description;    
    document.querySelectorAll('.course-details span')[0].textContent =`Duration: ${courseData.duration}`;
    document.querySelector('.course-video img').src = courseData.videoSrc;
}

// Función para actualizar el contenido de la página con los datos del curso
function updateContentCourseContent(ContentcourseData) {        
    document.querySelectorAll('.course-details span')[1].textContent =`Language: ${ContentcourseData.tipoContenido}`;
    document.querySelector('.course-info p').textContent = `Description: ${ContentcourseData.descripcion}`;
    // Encuentra el botón de reproducción y asigna un controlador de eventos de clic
    const playButton = document.querySelector('.video-overlay .play-button');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Abre el URL del video en una nueva ventana/pestaña del navegador cuando se hace clic en el botón de reproducción
            window.open(ContentcourseData.videoSrc, '_blank');
        });
    }
}