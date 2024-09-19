const form = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

messageDiv.style.textAlign = 'center'; 
messageDiv.style.marginTop = '20px';

form.addEventListener('submit', async function(event) {
  event.preventDefault(); 

  const formData = new FormData(form);
  const data = {
    email: formData.get('email'),
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    });

    const result = await response.text();

    if (response.ok) {
      messageDiv.innerHTML = result;
      messageDiv.style.color = 'green'; 
      form.reset();
    } else {
      messageDiv.innerHTML = `Error: ${result}`;
      messageDiv.style.color = 'red'; 
    }
  } catch (error) {
    console.error('Error en el envío del formulario:', error);
    messageDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
});
