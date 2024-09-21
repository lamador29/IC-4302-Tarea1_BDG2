document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('username');
    const recommendationsBox = document.querySelector('.repositories-box');

    const data = {
      username: localStorage.getItem('username')
    };
  
    console.log('Buscando recomendaciones para: ', username);
    if (!username) {
      recommendationsBox.innerHTML = '<p>Por favor, inicie sesión para ver las recomendaciones.</p>';
      return;
    }
  
    try {
      console.log('Enviando datos de usuario:', data); 
      const response = await fetch('/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data) 
      });
      console.log('Log <---------------------------------------------------->');

      const contentType = response.headers.get('content-type');
      const recommendedRepos = await response.json();

      if (contentType && contentType.includes('application/json')) { 
  
        if (response.ok && recommendedRepos.length > 0) {
          recommendationsBox.innerHTML = '';
          console.log('Repositorios cargados exitosamente', repositories);


          /*
          recommendedRepos.forEach(repo => {
            const repoDiv = document.createElement('div');
            repoDiv.classList.add('repository-item');
            repoDiv.innerHTML = `
              <h4>${repo.title}</h4> <!-- Adjust property names as needed -->
              <p>Description: ${repo.description || 'No description available'}</p>
              <p>Stars: ${repo.stars || 0}</p>
              <p>Forks: ${repo.forks || 0}</p>
            `;
            recommendationsBox.appendChild(repoDiv);
          });*/
          

        } else {
          recommendationsBox.innerHTML = '<p>No hay repositorios recomendados disponibles.</p>';
        }
      } else {/* Not JSON*/
        console.error('Formato de respuesta inesperado:', response);
        recommendationsBox.innerHTML = '<p>Error: Se recibió un formato de respuesta inesperado.</p>';
      }
    } catch (error) {
      console.error('Error al obtener los repositorios recomendados:', error);
      recommendationsBox.innerHTML = '<p>Error al cargar los repositorios recomendados.</p>';
    }
  });