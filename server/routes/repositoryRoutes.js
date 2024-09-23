const express = require('express');
const router = express.Router();
const {
  createRepository,
  RepositoriesOfAnUser,
  search,
  addFileToRepositoryFolder,
  makeCommit,
  makeComment,
  getCommentsFromRepository,
  downloadFiles,
  fork
} = require('../controllers/RepositoryController.cjs');

// Route to create a repository
router.post('/create', async (req, res) => {
  const { repoName, isPublic, username } = req.body; // Changed 'title' to 'repoName'
  
  try {
    console.log(repoName, ' ', username); // Logging repoName instead of title
    const newRepository = await createRepository(repoName, 1, username, req.body.tagsString); // Ensure tagsString is sent
    res.status(200).send(`Repository "${newRepository.title}" created successfully!`);
  } catch (error) {
    res.status(500).send('Error creating repository: ' + error.message);
  }
});


// Route to get repositories of a user
router.get('/user-repos/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const repos = await RepositoriesOfAnUser(username);
    res.status(200).json(repos);
  } catch (error) {
    res.status(500).send('Error fetching repositories: ' + error.message);
  }
});

// Route for searching repositories by title
router.get('/search', async (req, res) => {
  const { query } = req; // Use `query` to match your frontend code

  // Check if the search term is provided
  if (!query || !query.query) {
    return res.status(400).send('Search term is required.'); // Bad Request
  }
  try {
    const repos = await search(query.query); // Use the correct property for the search term
    console.log(repos);
    res.status(200).json(repos);
  } catch (error) {
    console.error('Error during search:', error); // Log the error for debugging
    res.status(500).send('Error during search: ' + error.message);
  }
});

// Route to add a file to a repository
router.post('/add-file', async (req, res) => {
  const { repositoryId, filePath } = req.body;

  try {
    const updatedRepository = await addFileToRepositoryFolder(repositoryId, filePath);
    res.status(200).send(`File added to repository "${updatedRepository.title}"`);
  } catch (error) {
    res.status(500).send('Error adding file: ' + error.message);
  }
});

// Route to make a commit
router.post('/commit', async (req, res) => {
  const { repositoryId } = req.body;
  
  try {
    const updatedRepository = await makeCommit(repositoryId);
    res.status(200).send(`Commit created for repository "${updatedRepository.title}"`);
  } catch (error) {
    res.status(500).send('Error creating commit: ' + error.message);
  }
});

// Route to make a comment
router.post('/comment', async (req, res) => {
  const { repositoryId, username, commentText } = req.body;
  
  try {
    const updatedRepository = await makeComment(repositoryId, username, commentText);
    res.status(200).send(`Comment added to repository "${updatedRepository.title}"`);
  } catch (error) {
    res.status(500).send('Error adding comment: ' + error.message);
  }
});

// Route to get comments from a repository
router.get('/comments/:repositoryId', async (req, res) => {
  const { repositoryId } = req.params;
  
  try {
    const comments = await getCommentsFromRepository(repositoryId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).send('Error fetching comments: ' + error.message);
  }
});

// Route to download repository files as a zip
router.get('/download/:repositoryId', async (req, res) => {
  const { repositoryId } = req.params;
  const zipFilePath = `/tmp/repo_${repositoryId}.zip`; // Adjust this path as needed
  
  try {
    const zipPath = await downloadFiles(repositoryId, zipFilePath);
    res.download(zipPath, (err) => {
      if (err) {
        console.error('Error sending the file:', err);
        res.status(500).send('Error downloading files');
      }
    });
  } catch (error) {
    res.status(500).send('Error retrieving files: ' + error.message);
  }
});

// Route to fork a repository
router.post('/fork', async (req, res) => {
  const { repositoryId, userId } = req.body;
  
  try {
    const forkedRepository = await fork(repositoryId, userId);
    res.status(200).send(`Repository forked successfully as "${forkedRepository.title}"`);
  } catch (error) {
    res.status(500).send('Error forking repository: ' + error.message);
  }
});

module.exports = router;
