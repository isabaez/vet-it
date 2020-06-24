var express = require('express');
var session = require('express-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var FacebookStrategy = require('passport-facebook');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo/es5')(session);
var routes = require('./routes/index');
var auth = require('./routes/auth');

var User = require('./models/models').User;
var Follow = require('./models/models').Follow;
var Veteran = require('./models/models').Veteran;

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.mlab);

app.use(session({
    secret: "secret",
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Local strategy
passport.use(new LocalStrategy(function(email, password, done) {
    // Find the user with the given email
    User.findOne({ email: email }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      // if passwords do not match, auth failed
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // auth has succeeded
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.faceBookClientID,
    clientSecret: process.env.faceBookClientSecret,
    callbackURL: "https://vetit.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'name', 'email', 'picture']
  },
  function(accessToken, refreshToken, profile, cb) {
      //check user table for anyone with a facebook ID of profile.id
      console.log(profile)
      User.findOne({ email: profile.emails[0].value }, function(err, user) {
          if (err) {
              return cb(err);
          }
          //No user was found... so create a new user with values from Facebook (all the profile. stuff)
          if (!user) {
            u = new User({
              email: profile.emails[0].value,
              facebookId: profile.id,
              picture: profile.photos[0].value,
              date: new Date()
            });
            u.save(function(err, user) {
                if (err) {
                  cb(err)
                }
                else {
                  var v = new Veteran({
                    userId: user._id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName
                  })
                  v.save(function(err, veteran) {
                    if(err) {
                      cb(err)
                    }
                    var f = new Follow({
                      userId: user._id,
                      following: []
                    })
                    f.save(function(err, follow) {
                      if (err) {
                        cb(err)
                      } else {
                        return cb(err, u);
                      }
                    })
                  })
                }
            })
          } else {
            //found user. Return
            return cb(err, user);
          }
      });
    }
));

passport.use(new LinkedInStrategy({
  clientID: process.env.linkedInClientID,
  clientSecret: process.env.linkedInClientSecret,
  callbackURL: "https://vetit.herokuapp.com/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
    //check user table for anyone with a facebook ID of profile.id
    User.findOne({ email: profile.emails[0].value }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
          u = new User({
            email: profile._json.email,
            linkedinId: profile._json.id,
            picture: profile._json.pictureUrls.values[0],
            date: new Date()
          });
          u.save(function(err, user) {
              if (err) {
                done(err)
              }
              else {
                var v = new Veteran({
                  userId: user._id,
                  firstName: profile._json.firstName,
                  lastName: profile._json.lastName
                })
                v.save(function(err, veteran) {
                  if(err) {
                    done(err)
                  }
                  var f = new Follow({
                    userId: user._id,
                    following: []
                  })
                  f.save(function(err, follow) {
                    if (err) {
                      done(err)
                    } else {
                      return done(err, u);
                    }
                  })
                })
              }
          })
        } else {
          //found user. Return
          return done(err, user);
        }
    });
  }));

app.use('/', auth(passport));
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
