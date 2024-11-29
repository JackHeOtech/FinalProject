function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); //Saves middleware process
    }
    req.flash('error_msg', 'Please log in'); //Ensures that the user is authenticated first before being authorized on the site
    res.redirect('/users/login');
  }
  
  module.exports = { ensureAuthenticated };