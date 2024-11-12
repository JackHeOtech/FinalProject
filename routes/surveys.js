const express = require('express');
const router = express.Router();

let surveys = [];

router.get('/', (req, res) => {
  res.render('surveys/list', { title: 'Survey List', surveys });
});

router.get('/create', (req, res) => {
  res.render('surveys/create', { title: 'Create Survey' });
});

router.post('/create', (req, res) => {
  const { title, description } = req.body;
  const newSurvey = { id: Date.now(), title, description };
  surveys.push(newSurvey);
  res.redirect('/surveys');
});

router.get('/edit/:id', (req, res) => {
  const survey = surveys.find(s => s.id === parseInt(req.params.id));
  res.render('surveys/edit', { title: 'Edit Survey', survey });
});

router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const survey = surveys.find(s => s.id === parseInt(id));
  if (survey) {
    survey.title = title;
    survey.description = description;
  }
  res.redirect('/surveys');
});

router.post('/delete/:id', (req, res) => {
  surveys = surveys.filter(s => s.id !== parseInt(req.params.id));
  res.redirect('/surveys');
});

module.exports = router;
