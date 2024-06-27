document.addEventListener('DOMContentLoaded', function() {        
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const userId = getQueryParam('userId');
    console.log('ID del usuario:', userId);
    fetchUserDetails(userId).then(userData => {
        updateUserData(userData);
    }).catch(error => {
        console.error("Error al cargar los detalles del usuario:", error);
    });

    fetchCursosData();    
});

function fetchCursosData() {
    fetch('http://localhost:3000/cursos') // URL actualizada
        .then(response => response.json())
        .then(data => {
            const coursesSection = document.querySelector('.courses');
            // Limpiar la sección de cursos antes de agregar nuevos
            coursesSection.innerHTML = '';

            data.forEach(curso => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';

                const courseImage = document.createElement('img');
                courseImage.src = curso.urlVideo; // Actualizado para usar urlVideo como fuente de la imagen
                courseImage.alt = 'Course Thumbnail';

                const courseInfo = document.createElement('div');
                courseInfo.className = 'course-info';

                const courseTitle = document.createElement('h3');
                courseTitle.textContent = curso.titulo; // Actualizado para usar titulo

                const courseID = document.createElement('h3');
                courseID.textContent = curso._id; // Actualizado para usar titulo

                const courseDescription = document.createElement('p');
                courseDescription.textContent = curso.descripcion;

                const courseDuration = document.createElement('p');
                courseDuration.textContent = `Duración: ${curso.duracion} horas`;

                const courseCreationDate = document.createElement('p');
                const formattedDate = new Date(curso.fechaCreacion).toLocaleDateString();
                courseCreationDate.textContent = `Fecha de Creación: ${formattedDate}`;
                
                // Suponiendo que curso.id contiene la ID del curso actual
                const courseButton = document.createElement('a'); // Usamos un enlace para facilitar la redirección
                courseButton.textContent = "Más información";
                courseButton.href = `/aboutcurso.html?cursoId=${curso._id}`; // Construimos la URL con la ID del curso
                courseButton.classList.add('course-button'); // Opcional: Agregar clase para estilos

                // Agregar los elementos al courseInfo
                courseInfo.appendChild(courseTitle);                
                courseInfo.appendChild(courseDescription);
                courseInfo.appendChild(courseDuration);
                courseInfo.appendChild(courseCreationDate);

                // Agregar courseImage y courseInfo al courseCard
                courseCard.appendChild(courseImage);
                courseCard.appendChild(courseInfo);

                // Finalmente, agregar courseCard a coursesSection
                coursesSection.appendChild(courseCard);
                // Agregar el botón al courseInfo o directamente al courseCard, según la estructura deseada
                courseCard.appendChild(courseButton);
            });
        })
        .catch(error => console.error('Error al cargar los cursos:', error));
}

// Función para simular la obtención de datos del curso
function fetchUserDetails(userId) {
    return fetch('http://localhost:3000/usuarios') // Realiza la solicitud a la misma URL
        .then(response => response.json())
        .then(data => {
            // Filtra para encontrar el curso específico por su ID
            const user = data.find(u => u._id === userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            // Transforma los datos del curso al formato esperado
            return {
                username: `${user.nombre} ${user.apellido} `            
            };
        });
}

// Función para actualizar el contenido de la página con los datos del curso
function updateUserData(userData) {
    // Selecciona todos los botones dentro de .user-detail
    const userButtons = document.querySelectorAll('.user-detail a');

    // Verifica si hay al menos dos botones antes de intentar establecer su textContent
    if (userButtons.length > 1) {
        // El segundo botón es el índice 1, ya que los índices comienzan en 0
        userButtons[1].textContent = userData.username; // Actualiza el texto del segundo botón
    } else {
        console.error('El segundo botón no se encontró en el DOM.');
    }
}


  // Selecciona el input de rango y el span donde se mostrará el valor
  const durationInput = document.getElementById('duration_course');
  const durationValue = document.getElementById('duration_course-value');

  // Función para actualizar el span con el valor actual del input de rango
  function updateDurationValue() {
    durationValue.textContent = durationInput.value;
  }

  // Actualiza el span con el valor inicial del input de rango
  updateDurationValue();

  // Escucha el evento 'input' en el input de rango
  durationInput.addEventListener('input', updateDurationValue);

  document.getElementById('filterform').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir la recarga de la página

    // Obtener los valores de los filtros
    const duration = document.getElementById('duration_course').value;
    console.log(duration);
    const language = document.getElementById('language_course').value;    
    console.log(language);

    // Llamar a fetchCursosData con los valores de los filtros
    fetchFilteredCursosData(duration, language);
});

function fetchFilteredCursosData(duration, language) {
    let url1 = 'http://localhost:3000/cursos';
    let url2 = 'http://localhost:3000/contenido-cursos';

    Promise.all([
        fetch(url1).then(response => response.json()),
        fetch(url2).then(response => response.json())
    ])
    .then(([cursos, contenidoCursos]) => {
        const coursesSection = document.querySelector('.courses');
        coursesSection.innerHTML = ''; // Limpiar la sección de cursos antes de agregar nuevos

        // Filtrar los cursos por duración
        let filteredData = cursos.filter(curso => curso.duracion <= duration);

        // Filtrar por tipo de contenido (lenguaje) solo si language no está vacío
        if (language) {
            filteredData = filteredData.filter(curso => {
                const contenido = contenidoCursos.find(contenidoCurso => 
                    contenidoCurso.cursoId && curso._id && // Ensure both IDs are defined
                    contenidoCurso.cursoId.toString() === curso._id.toString()
                );
                return contenido && contenido.tipoContenido.toLowerCase() === language.toLowerCase();
            });
        }


        
        if (filteredData.length === 0) {
            console.log('No se encontraron cursos que coincidan con los criterios de filtrado.');
        }
        // Procesar y mostrar los cursos filtrados
        filteredData.forEach(curso => {
            const courseCard = document.createElement('div');
            courseCard.className = 'course-card';

            const courseImage = document.createElement('img');
            courseImage.src = curso.urlVideo;
            courseImage.alt = 'Course Thumbnail';

            const courseInfo = document.createElement('div');
            courseInfo.className = 'course-info';

            const courseTitle = document.createElement('h3');
            courseTitle.textContent = curso.titulo;

            const courseDescription = document.createElement('p');
            courseDescription.textContent = curso.descripcion;

            const courseDuration = document.createElement('p');
            courseDuration.textContent = `Duración: ${curso.duracion} horas`;

            const courseCreationDate = document.createElement('p');
            const formattedDate = new Date(curso.fechaCreacion).toLocaleDateString();
            courseCreationDate.textContent = `Fecha de Creación: ${formattedDate}`;

            const courseButton = document.createElement('a');
            courseButton.textContent = "Más información";
            courseButton.href = `/aboutcurso.html?cursoId=${curso._id}`;
            courseButton.classList.add('course-button');

            // Agregar elementos al DOM
            courseCard.appendChild(courseImage);
            courseCard.appendChild(courseInfo);
            courseInfo.appendChild(courseTitle);
            courseInfo.appendChild(courseDescription);
            courseInfo.appendChild(courseDuration);
            courseInfo.appendChild(courseCreationDate);
            courseInfo.appendChild(courseButton);
            coursesSection.appendChild(courseCard);
        });
    })
    .catch(error => console.error('Error al cargar los cursos:', error));

    // Limpiar los valores de los filtros después de la solicitud
    document.getElementById('duration_course').value = '';
    document.getElementById('language_course').value = '';
}

