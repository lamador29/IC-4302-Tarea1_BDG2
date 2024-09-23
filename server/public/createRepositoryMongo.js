const form = document.querySelector('form');
const messageDiv = document.createElement('div');

form.addEventListener('submit', async function(event) {
  event.preventDefault();

  const username = localStorage.getItem('username');
  
  const formData = new FormData(form);
  const data = {
    repoName: formData.get('repo-name'),
    isPublic: formData.get('isPublic') === 'on',
    username: username,
    tagsString: formData.get('repo-tags') // Ensure this is sent
  };
  
  try {
    const response = await fetch('/repositoryFunction/create', {
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
      setTimeout(() => {
        window.location.href = 'usermainpage.html';
      }, 1000);
    } else {
      messageDiv.innerHTML = `Error: ${result}`;
      messageDiv.style.color = 'red';
    }
  } catch (error) {
    console.error('Error during repository creation:', error);
    messageDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
});
