const express = require('express');
const router = express.Router();
const Repository = require('../models/repository');

router.get('/user-repos/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const userRepos = await Repository.find({ username: username });

    if (userRepos.length > 0) {
      res.status(200).json(userRepos); 
    } else {
      res.status(404).json({ message: 'No se encontraron repositorios para este usuario' });
    }
  } catch (error) {
    console.error('Error al obtener los repositorios:', error);
    res.status(500).json({ error: 'Error al obtener los repositorios' });
  }
});

module.exports = router;
