const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');
const { ensureAuthenticated } = require('../middlewares/auth');

// Protect survey routes to make sure only logged in users can access them.
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const surveys = await Survey.find();
    res.render('surveys/list', { title: 'Survey List', surveys });
  } catch (error) {
    res.status(500).send("Could not receive Survey. Error.");
  }
});

router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('surveys/create', { title: 'Create Survey' });
});

router.post('/create', ensureAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  try {
    const newSurvey = new Survey({ title, description });
    await newSurvey.save();
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send("Survey could not be created. Error.");
  }
});

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    res.render('surveys/edit', { title: 'Edit Survey', survey });
  } catch (error) {
    res.status(500).send("Survey could not be received. Error.");
  }
});

router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  try {
    await Survey.findByIdAndUpdate(req.params.id, { title, description });
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send("Survey was not updated. Error.");
  }
});

router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Survey.findByIdAndDelete(req.params.id);
    res.redirect('/surveys');
  } catch (error) {
    res.status(500).send("Survey could not be deleted. Error.");
  }
});

module.exports = router;
