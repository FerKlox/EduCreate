function logout() {
    // Elimina la información del usuario del localStorage
    localStorage.removeItem('userID'); // Asume que 'userInfo' es la clave donde se almacena la información del usuario

    // Redirige al usuario a la página de inicio de sesión
    window.location.href = '/login.html'; // Asegúrate de reemplazar '/signin.html' con la ruta correcta a tu página de inicio de sesión
}