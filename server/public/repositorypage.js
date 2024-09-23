const username = localStorage.getItem('username');
const repositoryId = getRepositoryIdFromURL();

if (!username) {
  window.location.href = 'login.html';
}

function getRepositoryIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('repo');  // Cambia 'id' por 'repo' si pasas el nombre del repositorio
}


async function fetchComments() {
  const repositoryId = getRepositoryIdFromURL();

  try {
    const response = await fetch(`/api/comments/${repositoryId}`);
    const comments = await response.json();

    const commentSection = document.querySelector('.comment-box');
    commentSection.innerHTML = '';

    if (comments.length > 0) {
      comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `
          <p><strong>${comment.username}:</strong> ${comment.content}</p>
          <p class="text-muted">${new Date(comment.createdAt).toLocaleString()}</p>
        `;
        commentSection.appendChild(commentDiv);
      });
    } else {
      commentSection.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

fetchComments();

function getRepositoryIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id'); 
}

document.getElementById('commentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = document.getElementById('commentContent').value.trim(); // Get the comment content
  const repositoryId = getRepositoryIdFromURL(); // Get the repository ID from the URL
  const username = localStorage.getItem('username'); // Get the logged-in username

  if (!content) {
    alert('Comment cannot be empty');
    return;
  }

  try {
    // Send the POST request to the API to add a new comment
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repositoryId, username, content }) 
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('commentContent').value = ''; // Clear the textarea
      fetchComments(); // Refresh comments section
    } else {
      console.error('Error adding comment:', result.error);
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
  }
});











document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('likeButton').addEventListener('click', async () => {
    await handleRating('like');
  });

  document.getElementById('dislikeButton').addEventListener('click', async () => {
    await handleRating('dislike');
  });

  document.getElementById('subscribeButton').addEventListener('click', async () => {
    await subscribe();
  });
});


async function handleRating(type) {
  try {
    console.log('Intentando añadir relacion: ', type)

    if (type == 'like'){
      const response = await fetch('/relationship/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryName: 'Repositorio de xd', //------------------------------------------
          username: username,
        })
      });


    } else if (type == 'dislike') {
      const response = await fetch('/relationship/dislike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repositoryName: 'Repositorio de xd', //------------------------------------------
          username: username,
        })
      });


    } else {
      throw new Error('Type no tiene un tipo apropiado de relacion: ', type);
    }

    

    if (response.ok) {
      const result = await response.json();
      console.log(`${type} registered successfully`);
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error(`Error during ${type} process:`, error);
  }
}

async function subscribe() {
  try {
    console.log('Intentando añadir relacion de suscripcion')


    const response = await fetch('/relationship/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        repositoryName: 'Repositorio de xd', //------------------------------------------
        username: username,
      })
    });


    if (response.ok) {
      const result = await response.json();
      console.log('Subscribe registered successfully');
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error(`Error during subscribe process:`, error);
  }
}