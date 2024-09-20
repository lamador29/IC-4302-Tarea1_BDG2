const form = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

form.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const formData = new FormData(form);
    const data = {
        username: formData.get('username'),
    };

    try {
        const response = await fetch('/loginNeo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        });

        const result = await response.text();

        if (response.ok) {
            window.location.href = 'usermainpage.html'; // Redirect on successful login
        } else {
            messageDiv.innerHTML = `<p style="color: red;">Error: ${result}</p>`; // Display error message
        }
    } catch (error) {
        console.error('Error en el envío del formulario:', error);
        messageDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`; // Handle fetch errors
    }
});