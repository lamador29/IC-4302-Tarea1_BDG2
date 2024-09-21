const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const formData = new FormData(form);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        console.log('Enviando datos de login:', data); 
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        });
        console.log('Respuesta del servidor:', response.status);

        if (response.ok) {
            localStorage.setItem('username', formData.get('username'));
            console.log('Nombre de usuario guardado:', localStorage.getItem('username'));
            window.location.href = 'usermainpage.html';
        } else {
            const result = await response.text();
            console.log('Error en la respuesta del servidor:', result);
            messageDiv.innerHTML = `<p style="color: red;">Error: ${result}</p>`;
        }
    } catch (error) {
        console.error('Error en el envío del formulario:', error);
        messageDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`; 
    }
});