document.addEventListener('DOMContentLoaded', async () => {
    const username = localStorage.getItem('username');
    const recommendationsBox = document.querySelector('#recommendationsBox');

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
      const response = await fetch('/recommendationRoutes', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data) 
      });

      const contentType = response.headers.get('content-type');
      const recommendedRepos = await response.json();

      if (contentType && contentType.includes('application/json')) { 
  
        if (response.ok && recommendedRepos.length > 0) {
          recommendationsBox.innerHTML = '';
          console.log('Repositorios cargados exitosamente', recommendedRepos);

          
          recommendedRepos.forEach(record => {
            const id = (record.id && record.id.toNumber) ? record.id.toNumber() : record.id;
            const repositoryName = record.repositoryName;

            const repoElement = document.createElement('p');
            repoElement.textContent = `${repositoryName}`;
      
            recommendationsBox.appendChild(repoElement);
          
            console.log(`Repository ID: ${id}, Repository Name: ${repositoryName}`);
          });
          

        } else {
          recommendationsBox.innerHTML = '<p>No hay repositorios recomendados.</p>';
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