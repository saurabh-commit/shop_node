const bcrypt =  require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = 
  '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';
 
sgMail.setApiKey(SENDGRID_API_KEY);
 
const msg = {
  to: 'saurabhshukl@juniper.net',
  from: 'saurabhshukla19011993@gmail.com',  //use the email you used to signup to sendgrid
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
 
// sgMail.send(msg);

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password!');
        return req.session.save(err => {
          res.redirect('/login');
        });
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password!');
          return req.session.save(err => {
            res.redirect('/login');
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email: email})
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-mail already exists, please enter different email!');
        return req.session.save(err => {
          res.redirect('/signup');
        });
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.redirect('/login');
          return sgMail.send(msg);
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
