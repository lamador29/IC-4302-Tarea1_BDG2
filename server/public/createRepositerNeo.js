const form = document.querySelector('form')
const messageDiv = document.createElement('div');
const repoNameInput = document.getElementById("repo-name");

messageDiv.style.textAlign = 'center';
messageDiv.style.marginTop = '20px';
document.body.appendChild(messageDiv);


form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const username = localStorage.getItem('username');
  
  const formData = new FormData(form);
  const data = {
    repoName: formData.get('repo-name'),
    username: username
  };
  
  try {
    const response = await fetch('/createRepositerNeo', {
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
    console.error('Error during repository creation:', error);
    messageDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
});