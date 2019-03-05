var express = require('express');
var router = express.Router();
var User = require('../models/models').User;
var Veteran = require('../models/models').Veteran;
var Company = require('../models/models').Company;
var Follow = require('../models/models').Follow;
var helper = require('sendgrid').mail;
var sendgrid = require("sendgrid")(process.env.sendgridAPIKey);

// Password Validation
var validateReq = function(userData) {
    return (userData.password === userData.verifyPassword);
};

module.exports = function(passport) {

    //GET registration page
    router.get('/register', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/');
        } else {
            res.render('register');
        }
    });

    //POST registration page
    router.post('/register', function(req, res) {
        if (!validateReq(req.body)) {
            return res.render('register', {
                error: "Passwords don't match"
            });
        } else if (!req.body.email || !req.body.password) {
            return res.render('register', {
                error: "Must fill out all fields to continue"
            });
        } else if (req.body.password.length < 6) {
            return res.render('register', {
                error: "Password must be at least 6 characters long"
            });
        } else if (!req.body.terms) {
            return res.render('register', {
                error: "Must accept terms and conditions to continue"
            });
        }
        User.findOne({ email: req.body.email }, function(err, user) {
            if (err) {
                return res.status(500).redirect('/register');
            } else if (user) {
                return res.render('register', {
                    error: "Account already exists with that email"
                });
            } else {
                var u = new User({
                    email: req.body.email,
                    password: req.body.password,
                    date: new Date(),
                    userType: "Veteran",
                    verified: false
                });
                u.save(function(err, user) {
                    if (err) {
                        return res.status(500).redirect('/register');
                    }
                    var v = new Veteran({
                        userId: user._id,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName
                    })
                    v.save(function(err, veteran) {
                        if(err) {
                            return res.status(500).redirect('/register');
                        }
                        var f = new Follow({
                            userId: user._id,
                            following: []
                        })
                        f.save(function(err, follow) {
                            if (err) {
                            res.status(500).redirect('/register')
                            } else {
                                from_email = new helper.Email("info@admin.vetit.com");
                                to_email = new helper.Email(user.email);
                                subject = "IMPORTANT: Please Verify Your VetIt Account";
                                content = new helper.Content("text/html", "<html><body>Please verify your account in the next 24 hours or else your account will be deleted! <a class='btn btn-default' style='padding-right:25px; display: inline-block; margin: 5px 10px; font-weight: 200; text-align: center; text-transform: capitalize; vertical-align: middle; -ms-touch-action: manipulation; touch-action: manipulation; cursor: pointer; background-image: none; border: 1px solid transparent; white-space: nowrap; padding: 9px 25px; font-size: 14px; line-height: 1.42857143; border-radius: 5px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;' href='http://vetit.herokuapp.com/verifyAccount/"+user._id+"'>Verify</a></body></html>");
                                mail = new helper.Mail(from_email, subject, to_email, content);
                                var requestBody = mail.toJSON();
                                var request = sendgrid.emptyRequest();
                                request.method = 'POST';
                                request.path = '/v3/mail/send';
                                request.body = requestBody;
                                sendgrid.API(request, function (err, response) {
                                    console.log(err);
                                    console.log(response);
                                    console.log(response.body);
                                });
                                req.login(user, function(err) {
                                  if (err) { return res.status(500).redirect('/register'); }
                                  return res.redirect('/registerdemos/'+user._id);
                                });
                            }
                        })
                    })
                });
            }
        })
    });
    
    router.get('/registerdemos/:id', function(req, res, next) {
        User.findById(req.params.id, function(err, user) {
            if (err) {
                res.status(500).redirect('/register')
            } else if (!user) {
                res.redirect('/register')
            } else {
                res.render('registerdemos');
            }
        })
    })

    router.post('/registerdemos/:id', function(req, res, next){
        var update = {$set: {status: req.body.status, ETS: new Date(req.body.ETSYear, req.body.ETSMonth, req.body.ETSDay), branch: req.body.branch, MOS: req.body.MOS}}
        Veteran.findOneAndUpdate({ userId: req.params.id }, update, function(err, veteran) {
            if (err) {
                return res.status(500).redirect('/registerdemos/'+req.params.id)
            } else {
                res.redirect('/login')
            }
        })
    })

    //GET company registration page
    router.get('/companyRegister', function(req, res, next) {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        else {
            res.render('companyRegister');
        }
    });

    //POST company registration page
    router.post('/companyRegister', function(req, res) {
        if (!validateReq(req.body)) {
            return res.render('companyRegister', {
                error: "Passwords don't match."
            });
        } else if (!req.body.pocName || !req.body.pocEmail || !req.body.pocDLine || !req.body.password) {
            return res.render('companyRegister', {
                error: "Must fill out all fields to continue."
            });
        } else if (req.body.password.length < 6) {
            return res.render('companyRegister', {
                error: "Password must be at least 6 characters long"
            });
        } else if (!req.body.terms) {
            return res.render('companyRegister', {
                error: "Must accept terms and conditions to continue."
            });
        } else {
            User.findOne({ email: req.body.pocEmail }, function(err, company) {
                if (err) {
                    return res.status(500).redirect('/companyRegister');
                } else if (company) {
                    return res.render('companyRegister', {
                        error: "Account already exists with that email"
                    })
                } else {
                    var u = new User({
                        email: req.body.pocEmail,
                        password: req.body.password,
                        pocName: req.body.pocName,
                        pocDLine: req.body.pocDLine,
                        date: new Date(),
                        userType: "Company",
                        verified: false
                    });
                    u.save(function(err, user) {
                        if (err) {
                            console.log(err);
                            return res.status(500).redirect('/companyRegister');
                        } else {
                            from_email = new helper.Email("info@admin.vetit.com");
                            to_email = new helper.Email(user.email);
                            subject = "IMPORTANT: Please Verify Your VetIt Account";
                            content = new helper.Content("text/html", "<html><body>Please verify your account in the next 24 hours or else your account will be deleted! <a class='btn btn-default' style='padding-right:25px; display: inline-block; margin: 5px 10px; font-weight: 200; text-align: center; text-transform: capitalize; vertical-align: middle; -ms-touch-action: manipulation; touch-action: manipulation; cursor: pointer; background-image: none; border: 1px solid transparent; white-space: nowrap; padding: 9px 25px; font-size: 14px; line-height: 1.42857143; border-radius: 5px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;' href='http://vetit.herokuapp.com/verifyAccount/"+user._id+"'>Verify</a></body></html>");
                            mail = new helper.Mail(from_email, subject, to_email, content);
                            var requestBody = mail.toJSON();
                            var request = sendgrid.emptyRequest();
                            request.method = 'POST';
                            request.path = '/v3/mail/send';
                            request.body = requestBody;
                            sendgrid.API(request, function (err, response) {
                                console.log(err);
                                console.log(response);
                                console.log(response.body);
                            });
                            return res.redirect('/');
                        }
                    });
                }
            })
        }
    });


    // GET Login page
    router.get('/login', function(req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/')
        } else {
            res.render('login')
        }
    });


    // POST Login page
    router.post('/login', passport.authenticate('local', { 
        successRedirect: '/dashboard',
        failureRedirect: '/loginredirect'
    }));

    router.get('/loginredirect', function(req, res) {
        res.render('loginfail')
    })

    router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

    router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });

  router.get('/auth/linkedin', passport.authenticate('linkedin'));

    router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }), function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });

    // GET Logout page
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}
