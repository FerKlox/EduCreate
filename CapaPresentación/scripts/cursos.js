document.addEventListener('DOMContentLoaded', function() {        
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
                courseDuration.textContent = `Duración: ${curso.duracion} minutos`;

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