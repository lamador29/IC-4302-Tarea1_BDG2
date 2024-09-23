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

// In your routes file
router.get('/user-repos/:username', async (req, res) => {
  console.log("Did this do anything?????");
  const { username } = req.params;
  try {
    console.log(username);
    const repos = await RepositoriesOfAnUser(username); // Fetch user repositories
    console.log("Yay2?");
    res.status(200).json(repos); // Send back as JSON
  } catch (error) {
    console.log("chanfle :(");
    res.status(500).send('Error fetching repositories: ' + error.message);
  }
});


module.exports = router;