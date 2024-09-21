const username = localStorage.getItem('username');
const repositoryId = getRepositoryIdFromURL();

if (!username) {
  window.location.href = 'login.html';
}

function getRepositoryIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id'); 
}

async function fetchComments() {
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
    console.error('Error al obtener los comentarios:', error);
  }
  }

fetchComments();

document.getElementById('commentForm').addEventListener('submit', async (e) => {
e.preventDefault();
const content = document.getElementById('commentContent').value;

try {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repositoryId, username, content }) 
  });

  const result = await response.json();

  if (response.ok) {
    document.getElementById('commentContent').value = '';
    fetchComments();
  } else {
    console.error('Error al agregar el comentario:', result.error);
  }
} catch (error) {
  console.error('Error en el envío del comentario:', error);
}
});
