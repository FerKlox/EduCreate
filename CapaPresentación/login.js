document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Email:', email);
        console.log('Passworrd', password);

        // Obtiene todos los usuarios
        fetch(`http://localhost:3000/usuarios`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching users');
            }
            return response.json();
        })
        .then(users => {
            // Filtra localmente por correo electrónico y contraseña

            const user = users.find(user => user.correoElectronico === email && user.contrasena === password);
            console.log(users[0]._id);

            if (user) {
                alert("Login successful!");
                localStorage.setItem('userId', user._id);
                window.location.href = `/dashboard.html?userId=${user._id}`; // Ajusta esta URL a tu página de destino
            } else {
                throw new Error('Login failed: Incorrect email or password.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed: Incorrect email or password.');
        });
    });
});