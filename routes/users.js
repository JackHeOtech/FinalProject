const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ username, password });
    await newUser.save();
    req.flash('success_msg', 'Registration complete. Please log in.');
    res.redirect('/users/login');
  } catch (error) {
    req.flash('error_msg', 'Error registering user.');
    res.redirect('/users/register');
  }
});

router.get('/login', (req, res) => {
  res.render('users/login', { title: 'Login' });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/surveys',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
);

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/users/login');
  });
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/surveys',
    failureRedirect: '/users/login',
  })
);

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/surveys',
    failureRedirect: '/users/login',
  })
);

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: '/surveys',
    failureRedirect: '/users/login',
  })
);

router.get('/error', (req, res) => {
  res.render('users/error', { title: 'Error' });
});

module.exports = router;
