const express = require('express');
const path = require('path');
const port = 8000;

const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const db = require('./config/mongoose');

app.use(session({
  secret: 'DTUFTE',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());

app.use(function (req, res, next) {
  res.locals.flash = {
    'success': req.flash('success'),
    'error': req.flash('error')
  }
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded());
app.use('/', require('./routes'));
app.use(express.static(path.join(__dirname, 'assests')));

app.listen(port, function (err) {
  if (err) {
    console.log('Error in opening server');
    return;
  }
  console.log('server is serving');
  return;
})