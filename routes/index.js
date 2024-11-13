const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const surveys = []; 
  res.render('index', { title: 'Survey Site', surveys });
});

module.exports = router;
