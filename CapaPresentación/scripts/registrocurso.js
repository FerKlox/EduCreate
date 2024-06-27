function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

window.onload = function() {
    var takeCourseButton = document.querySelector('.take-course-button');
    if (takeCourseButton) {
        takeCourseButton.addEventListener('click', function() {
            // Verificar si el userId y cursoId existen
            const cursoId = getQueryParam('cursoId');
            console.log('ID del curso:', cursoId);
            const userId = localStorage.getItem('userId');
            console.log('ID del usuario:', userId);

            if (userId && cursoId) {
                // Verificar si el usuario ya está inscrito en el curso
                fetch('http://localhost:3000/usuario-cursos')
                .then(response => response.json())
                .then(data => {
                    const yaInscrito = data.find(curso => curso.usuarioID === userId && curso.cursoID === cursoId);
                    if (yaInscrito) {
                        throw new Error('El usuario ya está inscrito en este curso');
                    } else {
                        const fechaInscripcion = new Date().toISOString();
                        // Enviar una solicitud POST para registrar el curso para el usuario
                        return fetch('http://localhost:3000/usuario-cursos', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ usuarioID: userId, cursoID: cursoId, fechaInscripcion: fechaInscripcion }),
                        });
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al registrar el curso');
                    }
                    return response.json();
                })
                .then(data => {
                    alert('Curso registrado exitosamente');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(error.message);
                });
            } else {
                alert('Error: Falta el ID del usuario o del curso');
            }
        });
    }
};

