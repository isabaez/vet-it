var express = require('express');
var router = express.Router();
var User = require('../models/models').User;
var Veteran = require('../models/models').Veteran;
var Company = require('../models/models').Company;
var CompanyReview = require('../models/models').CompanyReview;
var InterviewReview = require('../models/models').InterviewReview;
var EducationReview = require('../models/models').EducationReview;
var Follow = require('../models/models').Follow;
var Question = require('../models/models').Question;
var Reply = require('../models/models').Reply;
var JobOpening = require('../models/models').JobOpening;
var Program = require('../models/models').Program;
var _ = require('underscore');
var helper = require('sendgrid').mail;
var sendgrid = require("sendgrid")(process.env.sendgridAPIKey);

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var s3 = require('s3');
/*
Creating AWS S3 client for file upload and download. Defaults set until further
change needed.
*/

var client = s3.createClient({
  maxAsyncS3: 20,                            // this is the default
  s3RetryCount: 3,                           // this is the default
  s3RetryDelay: 1000,                        // this is the default
  multipartUploadThreshold: 20971520,        // this is the default (20 MB)
  multipartUploadSize: 15728640,             // this is the default (15 MB)
  s3Options: {
    accessKeyId: process.env.AWSKEY,
    secretAccessKey: process.env.AWSSecret,
    region: "us-east-1",
    signatureVersion:"v3"
    // endpoint: 's3.yourdomain.com',
    // sslEnabled: false
    // any other options are passed to new AWS.S3()
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  }
});

router.get('/home', function(req, res, next) {
	return res.render('index')
})

router.get('/FAQ', function(req, res, next) {
	return res.render('faq');
});

router.get('/Feedback', function(req, res, next) {
	return res.render('feedback');
});

router.get('/TermsOfUse', function(req, res, next) {
	return res.render('termsOfUse');
});

router.get('/CookiePolicy', function(req, res, next) {
	return res.render('cookiePolicy');
});

router.post('/Feedback', function(req, res, next) {
	if(!req.user) {
		res.render('feedback', {
			error: 'Please Log in First Before Sending Feedback'
		})
	} else {
		from_email = new helper.Email("feedback@admin.vetit.com");
		to_email = new helper.Email("vetitmail@gmail.com");
		subject = "Feedback from " + req.user.email;
		content = new helper.Content("text/plain", req.body.thoughts);
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
		return res.redirect('/ThanksForTheFeedback');
	}
});

router.get('/ThanksForTheFeedback', function(req, res, next){
	res.render('thanks');
});

router.get('/companies', function(req, res, next) {
	Company.find(function(err, companies) {
		var toRender = [];
		companies.forEach(function(company) {
			if (company.type === "Employer") {
				toRender.push(company);
			}
		})
		return res.render('dashboard', {
			companies: toRender.sort(function(a,b) {
			  if (a.name.toUpperCase() < b.name.toUpperCase())
			    return -1;
			  if (a.name.toUpperCase() > b.name.toUpperCase())
			    return 1;
			  return 0;
			}),
			search: true
		})
	})
});

router.post('/companies', function(req, res, next) {
	var type = encodeURIComponent(req.body.searchCompanyType);
	var name = encodeURIComponent(req.body.searchCompanyName);
	return res.redirect('/search/?type=' +type+'&name='+name);
});

router.get('/schools', function(req, res, next) {
	Company.find(function(err, companies) {
		var toRender = [];
		companies.forEach(function(company) {
			if (company.type === "Educator") {
				toRender.push(company);
			}
		})
		return res.render('dashboard', {
			companies: toRender.sort(function(a,b) {
			  if (a.name.toUpperCase() < b.name.toUpperCase())
			    return -1;
			  if (a.name.toUpperCase() > b.name.toUpperCase())
			    return 1;
			  return 0;
			}),
			search: true
		})
	})
});

router.post('/schools', function(req, res, next) {
	var type = encodeURIComponent(req.body.searchCompanyType);
	var name = encodeURIComponent(req.body.searchCompanyName);
	return res.redirect('/search/?type=' + type + '&name=' + name);
});

//Route for loading company profiles with company specific data
router.get('/companyProfile/:id', function(req, res, next) {
	//Find the company
	Company.findById(req.params.id, function(err, company) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			//Find this company's interview reviews
			InterviewReview.find( {companyId: req.params.id}, function(err, IntReviews) {
				if (err) {
					return res.render('error', {
						message: err.message,
						error: err
					});
				} else {
					//Find this company's forum Q&A's
					Question.find({ companyId: req.params.id }).populate('userId answers').exec(function(err, questions) {
						if (err) {
							return res.render('error', {
								message: err.message,
								error: err
							});
						} else if (company.type === "Educator") {
							// If company is an educator find the education reviews for it
							EducationReview.find({ companyId: req.params.id }, function(err, EdReviews) {
								if (err) {
									return res.render('error', {
										message: err.message,
										error: err
									});
								} else {
									//Find this educator's programs
									Program.find( {companyId: req.params.id}, function(err, programs) {
										if (err) {
											return res.render('error', {
												message: err.message,
												error: err
											});
										} else if(!req.user){
											res.render('companyProfile', {
												company: company,
												EducationReviews: EdReviews.reverse(),
												InterviewReviews: IntReviews,
												eduCompany: true,
												isFollowing: false,
												claimed: true,
												veteran: true,
												currPrograms: programs.reverse(),
												Questions: questions.reverse()
											})
										}	else if (req.user.userType === 'Veteran') {
											//If user is a veteran, check if they are following this company
											Follow.findOne({ userId: req.user._id }, function(err, follow) {
												if (err) {
													return res.render('error', {
														message: err.message,
														error: err
													});
												} else if (follow.following.indexOf(req.params.id) === -1) {
													//User is not following this company yet
													return res.render('companyProfile', {
														company: company,
														EducationReviews: EdReviews.reverse(),
														InterviewReviews: IntReviews,
														eduCompany: true,
														isFollowing: false,
														claimed: true,
														veteran: true,
														currPrograms: programs.reverse(),
														Questions: questions.reverse()
													});
												} else {
													//User is following this company
													return res.render('companyProfile', {
														company: company,
														EducationReviews: EdReviews.reverse(),
														InterviewReviews: IntReviews,
														eduCompany: true,
														isFollowing: true,
														claimed: true,
														veteran: true,
														currPrograms: programs.reverse(),
														Questions: questions.reverse()
													});
												}
											})
										} else if (req.user._id.equals(company.userId)) {
											//User type is 'Company' and created this company page
											Program.find({companyId: req.params.id}, function(err, programs) {
												if (err) {
													return res.render('error', {
														message: err.message,
														error: err
													});
												} else {
													var programTypes=new Object();
													for(var i=0; i<programs.length; i++) {
														programTypes[programs[i].programType] = true;
													}
													return res.render('companyProfile', {
														company: company,
														EducationReviews: EdReviews.reverse(),
														InterviewReviews: IntReviews,
														educatorOwner: true,
														eduCompany: true,
														claimed: true,
														owner: true,
														currPrograms: programs.reverse(),
														Questions: questions.reverse(),
														typesOfPrograms: Object.keys(programTypes)
													})
												}
											})
										} else {
											// User type is "Company", did not create this company page, and company has not been claimed
											return res.render('companyProfile', {
												company: company,
												EducationReviews: EdReviews.reverse(),
												InterviewReviews: IntReviews,
												eduCompany: true,
												claimed: company.claimed,
												currPrograms: programs.reverse(),
												Questions: questions.reverse()
											})
										}
									})
								}
							})
						} else {
							//This company is an employer, find its reviews
							CompanyReview.find( {companyId: req.params.id}, function(err, CompReviews) {
								if (err) {
									return res.render('error', {
										message: err.message,
										error: err
									});
								} else {
									//Find this company's job openings
									JobOpening.find( {companyId: req.params.id}, function(err, jobOpens) {
										if (err) {
											return res.render('error', {
												message: err.message,
												error: err
											});
										} else if(!req.user){
											res.render('companyProfile', {
												company: company,
												CompanyReviews: CompReviews,
												InterviewReviews: IntReviews,
												empCompany: true,
												isFollowing: false,
												jobOpenings: jobOpens.reverse(),
												claimed: true,
												veteran: true,
												Questions: questions.reverse()
											})
										}	else if (req.user.userType === 'Veteran') {
											//User is a veteran, check if they are following
											Follow.findOne({ userId: req.user._id }, function(err, follow) {
												if (err) {
													return res.render('error', {
														message: err.message,
														error: err
													});
												} else if (follow.following.indexOf(req.params.id) === -1) {
													//User is not following this company
													return res.render('companyProfile', {
														company: company,
														CompanyReviews: CompReviews,
														InterviewReviews: IntReviews,
														empCompany: true,
														isFollowing: false,
														jobOpenings: jobOpens.reverse(),
														claimed: true,
														veteran: true,
														Questions: questions.reverse()
													});
												} else {
													return res.render('companyProfile', {
														//User is following this company
														company: company,
														CompanyReviews: CompReviews,
														InterviewReviews: IntReviews,
														empCompany: true,
														isFollowing: true,
														claimed: true,
														veteran: true,
														jobOpenings: jobOpens.reverse(),
														Questions: questions.reverse()
													});
												}
											})
										} else if (req.user._id.equals(company.userId)) {
											//User type is "Company" and created this company page
											var jobTypes=new Object();
											for(var i=0; i<jobOpens.length; i++) {
												jobTypes[jobOpens[i].jobType] = true;
											}
											return res.render('companyProfile', {
												company: company,
												CompanyReviews: CompReviews,
												InterviewReviews: IntReviews,
												employerOwner: true,
												empCompany: true,
												claimed: true,
												owner: true,
												jobOpenings: jobOpens.reverse(),
												Questions: questions.reverse(),
												typesOfJobs: Object.keys(jobTypes)
											})
										} else {
											//User type is "Company", did not create the company page, and company has not been claimed
											return res.render('companyProfile', {
												company: company,
												CompanyReviews: CompReviews,
												InterviewReviews: IntReviews,
												empCompany: true,
												claimed: company.claimed,
												jobOpenings: jobOpens.reverse(),
												Questions: questions.reverse()
											})
										}
									})
								}
							})
						}
					})
				}
			})
		}
	})
});

router.post('/question/:id', function(req, res, next) {
	if(!req.user){
		res.status(400).send('Please Login Before Posting Questions')
	} else {
		var q = new Question({
			userId: req.user._id,
			companyId: req.params.id,
			subject: req.body.Subject,
			body: req.body.Body,
			answers: [],
			score: 0,
			date: new Date()
		});
		q.save(function(err, question) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				res.status(200).send(question)
			}
		})
	}
});

router.post('/reply/:id', function(req, res, next) {
	if(!req.user){
		res.status(400).send('Please Login Before Replying to Questions')
	} else {
		Question.findById(req.params.id, function(err, question) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				var r = new Reply({
					questionId: req.params.id,
					body: req.body.Body,
					score: 0,
					date: new Date()
				});
				question.answers = question.answers.concat(r._id)
				r.save(function(err, reply) {
					if (err) {
						return res.render('error', {
							message: err.message,
							error: err
						});
					} else {
						question.save(function(err, question) {
							if (err) {
								return res.render('error', {
									message: err.message,
									error: err
								});
							} else {
								res.status(200).send(reply);
							}
						})
					}
				})
			}
		})
	}
});

router.post('/upvote/:id', function(req, res, next) {
	if(!req.user){
		res.status(400).send('Please Login First Before Upvoting')
	} else {
		var update = {
			$inc: {score: 1}
		 }
		 Veteran.findOne({ userId: req.user._id }, function(err, veteran) {
			if (err) {
				return res.render('error', {
					message: err.message
				});
			} else if (veteran.upvotes.indexOf(req.params.id) === -1) {
				veteran.upvotes = veteran.upvotes.concat(req.params.id)
				Question.findByIdAndUpdate(req.params.id, update, function(err, savedQuestion) {
					if (err) {
						return res.render('error', {
							message: err.message
						});
					} else {
						veteran.save(function(err, savedVet) {
							if (err) {
								return res.render('error', {
									message: err.message
								});
							} else {
								res.status(200).send(savedQuestion)
							}
						})
					}
				})
			} else {
				res.status(200).send("You've already upvoted that!")
			}
		})
	}
})

//Search from Landing Page redirect to search route
router.post('/home', function(req, res, next){
	var type = encodeURIComponent('Both');
	var name = encodeURIComponent(req.body.searchCompanyName);
	return res.redirect('/search/?type=' +type+'&name='+name);
});

//Search handling route
router.post('/search', function(req, res, next) {
	var type = encodeURIComponent(req.body.searchCompanyType);
	var name = encodeURIComponent(req.body.searchCompanyName);
	return res.redirect('/search/?type=' +type+'&name='+name);
});

//Finding companies with search (and error handling)
router.get('/search', function(req, res, next) {
	var type = decodeURIComponent(req.query.type);
	var name = decodeURIComponent(req.query.name);
	if (type === 'Employer') {
		Company.find({
			"$text": {
				"$search": name
			},
			"type": "Employer"}, function(err, companies) {
				if (err) {
					return res.render('error', {
						message: err.message,
						error: err
					});
				} else {
					return res.render('dashboard', {
						companies: companies.sort(function(a,b) {
						  if (a.name.toUpperCase() < b.name.toUpperCase())
						    return -1;
						  if (a.name.toUpperCase() > b.name.toUpperCase())
						    return 1;
						  return 0;
						}),
						search: true
					});
				}
			})
	} else if (type === 'Educator') {
		Company.find({
			"$text": {
				"$search": name
			},
			"type": "Educator"}, function(err, companies) {
				if (err) {
					return res.render('error', {
						message: err.message,
						error: err
					});
				} else {
					return res.render('dashboard', {
						companies: companies.sort(function(a,b) {
						  if (a.name.toUpperCase() < b.name.toUpperCase())
						    return -1;
						  if (a.name.toUpperCase() > b.name.toUpperCase())
						    return 1;
						  return 0;
						}),
						search: true
					});
				}
			})
	} else if (type === 'Both') {
		Company.find({
			"$text": {
				"$search": name
			},
			"$or": [
			{type: "Educator"},
			{type: "Employer"}
			]}, function(err, companies) {
				if (err) {
					return res.render('error', {
						message: err.message,
						error: err
					});
				} else {
					return res.render('dashboard', {
						companies: companies.sort(function(a,b) {
						  if (a.name.toUpperCase() < b.name.toUpperCase())
						    return -1;
						  if (a.name.toUpperCase() > b.name.toUpperCase())
						    return 1;
						  return 0;
						}),
						search: true
					});
				}
			})
	} else if (!req.user){
		return res.render('index', {
			error: 'Please Choose a Company Type.'
		})
	} else if (req.user.userType === 'Veteran') {
		Follow.findOne({ userId: req.user._id }).populate('following').exec(function(err, follow) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				Promise.all([CompanyReview.find({'companyId': {"$in": follow.following}}).populate('companyId'),
					EducationReview.find({'companyId': {"$in": follow.following}}).populate('companyId')])
				.then(function(proArray) {
					var orderedReviews = _.sortBy(proArray[0].concat(proArray[1]), function(item) {return item.date;});
					return res.render('dashboard', {
						companies: follow.following,
						reviews: orderedReviews.reverse(),
						user: req.user,
						veteran: true,
						error: 'Please Choose a Company Type.'
					})
				})
				.catch(function(err){
					return res.render('error', {
						message: err.message,
						error: err
					});
				})
			};
		})
	} else {
		Company.find({ userId: req.user._id }, function(err, companies){
		var companiesIds = _.map(companies, '_id');
		Promise.all([CompanyReview.find({'companyId': {"$in": companiesIds}}).populate('companyId'),
			EducationReview.find({'companyId': {"$in": companiesIds}}).populate('companyId')])
			.then(function(proArray){
			var orderedReviews = _.sortBy(proArray[0].concat(proArray[1]), function(item) {return item.date;});
			return res.render('dashboard', {
				companies: companies,
				reviews: orderedReviews.reverse(),
				user: req.user
				})
			})
			.catch(function(err){
				console.log(err);
			})
		})
	}
});

//-------------- THE WALL ---------------------------
router.get('/', function(req, res, next){
	if(!req.user) {
		return res.redirect('/home');
	} else {
		return res.redirect('/dashboard/' + req.user._id)
	}
});

router.post('/addCompany', function(req, res, next) {
	if(!req.user) {
		return res.status(400).send('Please Log in Before Adding a Company');
	} else {
		Company.findOne({ name: req.body.name }, function(err, addCompany) {
			if (err) {
				console.log(err);
				res.status(500).redirect('/dashboard');
				return;
			} else if(addCompany) {
				return res.status(500).send('Company Already Exists');
			} else {
				var c = new Company({
					name: req.body.name,
					type: req.body.type,
					claimed: false
				});
				c.save(function(err, company) {
					if (err) {
						console.log(err);
	 					res.status(500).send('Please select Company Type');
					} else {
						return res.json(company._id);
					}
				})
			}
		});
	}
});

// User Verification
router.get('/verifyAccount/:id', function(req, res, next) {
	var update = {$set: {verified: true}};
	User.findByIdAndUpdate(req.params.id, update, function(err, user) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else if(!req.user) {
			res.render('verifyAccount');
		} else {
			return res.redirect('/dashboard/'+req.user._id)
		}
	});
});

// Delete Unverified Users after 24hrs
router.get('/cleanup', function(req, res, next){
	var unverifiedOverdueVets = [];
	var unverifiedOverdueComps = [];
	var d = new Date();
	var currentTime = d.getTime()
	User.find({verified: false}, function(err, unverifiedUsers) {
		if(err) {
			console.log(err);
			return;
		} else {
			for(var i=0; i<unverifiedUsers.length; i++) {
				if(currentTime - unverifiedUsers[i].date.getTime() >= 604800000) {
					if(unverifiedUsers[i].userType==='Veteran') {
						unverifiedOverdueVets.push(unverifiedUsers[i]._id);
					} else {
						unverifiedOverdueComps.push(unverifiedUsers[i]._id);
					}
				}
			}
			Promise.all([User.remove({'_id': {"$in": unverifiedOverdueVets}}),
				Veteran.remove({'userId': {"$in": unverifiedOverdueVets}}),
				Follow.remove({'userId': {"$in": unverifiedOverdueVets}}),
				User.remove({'_id': {"$in":unverifiedOverdueComps}})
				])
			.then(function(){
				console.log('finished cleanup');
			})
			.catch(function(err){
				console.log(err);
			})
		}
	})
});


// ---------------- Authentication wall ----------------
router.use(function(req, res, next) {
	if (!req.user) {
		return res.redirect('/login');
	} else {
		return next();
	}
});

// Redirects to user specific dashboard
router.get('/dashboard', function(req, res, next) {
	return res.redirect('/dashboard/' + req.user._id)
});

//Loads user's dashboard
router.get('/dashboard/:id', function(req, res, next) {
	// If user is a veteran, populate their follows and most recent reviews
	if(req.user.userType === 'Veteran') {
		Veteran.findOne({userId: req.user._id}, function(err, veteran){
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else { Follow.findOne({ userId: req.user._id }).populate('following').exec(function(err, follow) {
				if (err) {
					return res.render('error', {
						message: err.message,
						error: err
					});
				} else {
					var perPage = 10;
					Promise.all([CompanyReview.find({'companyId': {"$in": follow.following}}).limit(perPage).sort({'date': -1}).populate('companyId'),
						EducationReview.find({'companyId': {"$in": follow.following}}).limit(perPage).sort({'date': -1}).populate('companyId')])
					.then(function(proArray){
						return res.render('dashboard', {
							companies: follow.following,
							companyReviews: proArray[0],
							educationReviews: proArray[1],
							veteran: true,
							userInfo: veteran
						})
					})
					.catch(function(err){
						console.log(err);
					})
				};
			})
		}
	})
	} else {
		Company.find({ userId: req.user._id }, function(err, companies){
			var companiesIds = _.map(companies, '_id');
			Promise.all([CompanyReview.find({'companyId': {"$in": companiesIds}}).populate('companyId'),
						EducationReview.find({'companyId': {"$in": companiesIds}}).populate('companyId')])
					.then(function(proArray){
						var orderedReviews = _.sortBy(proArray[0].concat(proArray[1]), function(item) {return item.date;});
						return res.render('dashboard', {
							companies: companies,
							reviews: orderedReviews.reverse(),
							user: req.user
						})
					})
					.catch(function(err){
						console.log(err);
					})
		})
	}
});

router.get('/scrollMore/:type/:page', function(req, res, next){
	var perPage = 10;
	var page = Math.max(0, req.params.page);
	Follow.findOne({ userId: req.user._id }).populate('following').exec(function(err, follow) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			if(req.params.type === 'emp') {
				CompanyReview.find({'companyId': {"$in": follow.following}}).limit(perPage).sort({'date': -1}).skip(perPage * page).populate('companyId').exec(function(err, nextArray) {
					return res.json(nextArray);
				})
			} else if (req.params.type === 'edu') {
				EducationReview.find({'companyId': {"$in": follow.following}}).limit(perPage).sort({'date': -1}).skip(perPage * page).populate('companyId').exec(function(err, nextArray) {
					return res.json(nextArray);
				})
			}
		}
	})
});

// Search handling route
router.post('/dashboard/:id', function(req, res, next) {
	var type = encodeURIComponent(req.body.searchCompanyType);
	var name = encodeURIComponent(req.body.searchCompanyName);
	return res.redirect('/search/?type=' + type + '&name=' + name);
});

//Redirects to user specific page for editing profile information
router.get('/editProfile', function(req, res, next) {
	return res.redirect('/editProfile/' + req.user._id);
});

//Populates user's profile with their current information
router.get('/editProfile/:id', function(req, res, next) {
	if (req.user.userType === 'Veteran') {
		Veteran.findOne({ userId: req.params.id }, function(err, veteran) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else if (!veteran.ETS) {
				return res.render('editProfile', {
					veteranInfo: veteran,
					user: req.user,
					veteran: true
				});
			} else {
				var dateParsed = {};
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
				dateParsed.day = veteran.ETS.getDate();
				dateParsed.month = months[veteran.ETS.getMonth()];
				dateParsed.year = veteran.ETS.getFullYear();
				return res.render('editProfile', {
					veteranInfo: veteran,
					date: dateParsed,
					user: req.user,
					veteran: true
				});
			}
		})
	} else {
		return res.render('editProfile', {
			email: req.user.email,
			pocName: req.user.pocName,
			pocDLine: req.user.pocDLine
		})
	}
});

//Route for submitting demographics changes
router.post('/demographics', function(req, res, next) {
	Veteran.findOneAndUpdate({userId: req.user._id}, {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		location: req.body.location,
		userId: req.user._id,
		status: req.body.status,
		ETS: req.body.ETS,
		branch: req.body.branch,
		payGrade: req.body.payGrade,
		MOS: req.body.MOS,
		gender: req.body.gender,
		race: req.body.race,
		TCE: req.body.TCE
	}, function(err, veteran){
		if(err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			return res.redirect('/editProfile');
		}
	})
});

//Route for submitting jobs/education/interviews changes
router.post('/jobsEdInt', function(req, res, next) {
	Object.keys(req.body).map(function(key) {
		try {
			req.body[key] = JSON.parse(req.body[key])
		} catch(err) {
			console.error(err);
		}
	})
	var uniqueCompaniesWorked = _.uniq(req.body.companiesWorked);
	var uniqueCompaniesInterviewed =_.uniq(req.body.companiesInterviewed);
	var uniqueProgramsAttended = _.uniq(req.body.eduAttended);
	var uniqueProgramsIntereviewed = _.uniq(req.body.eduInterviewed);
	Veteran.findOneAndUpdate({userId: req.user._id}, {
		companiesWorked: uniqueCompaniesWorked,
		companiesInterviewed: uniqueCompaniesInterviewed,
		eduAttended: uniqueProgramsAttended,
		eduInterviewed: uniqueProgramsIntereviewed
	}, function(err, veteran){
		if(err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			return res.redirect('/editProfile');
		}
	})
});

//Route for submitting interest changes
router.post('/interests', function(req, res, next) {
	Object.keys(req.body).map(function(key) {
		try{
			req.body[key] = JSON.parse(req.body[key])
		} catch(err) {
			console.error(err);
		}
	})
	var uniqueCompanies = _.uniq(req.body.companiesInterested);
	var uniquePrograms = _.uniq(req.body.eduInterested);
	var uniqueFunctions = _.uniq(req.body.functions);
	Veteran.findOneAndUpdate({userId: req.user._id}, {
		companiesInterested: uniqueCompanies,
		eduInterested: uniquePrograms,
		functions: uniqueFunctions
	}, function(err, data){
		if(err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			return res.redirect('/editProfile');
		}
	})
});

router.post('/companyProfile/:id', function(req, res, next) {
	var update = {$set: {claimed: true}};
	Company.findByIdAndUpdate(req.params.id, update, function(err, company){
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			from_email = new helper.Email("info@admin.vetit.com");
			to_email = new helper.Email("vetitmail@gmail.com");
			subject = "Please verify company profile claim";
			content = new helper.Content("text/html", "<html><body>"+req.user.pocName+" would like to claim "+company.name+". Please verify:<div><a class='btn btn-default' style='padding-right:25px; display: inline-block; margin: 5px 10px; font-weight: 200; text-align: center; text-transform: capitalize; vertical-align: middle; -ms-touch-action: manipulation; touch-action: manipulation; cursor: pointer; background-image: none; border: 1px solid transparent; white-space: nowrap; padding: 9px 25px; font-size: 14px; line-height: 1.42857143; border-radius: 5px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;' href='http://vetit.herokuapp.com/verifyCompanyClaim/"+company._id+"/"+req.user._id+"'>Verify</a><a class='btn btn-default' href='http://vetit.herokuapp.com/denyCompanyClaim/"+company._id+"/"+req.user._id+"'>Deny</a></div></body></html>");
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
			return res.redirect('/companyProfile/'+req.params.id);
		}
	})
});

router.get('/verifyCompanyClaim/:cid/:vid', function(req, res, next) {
	//admin email
	if(req.user.email === 'vetitmail@gmail.com') {
		var update = {$set: {userId: req.params.vid}};
		Company.findByIdAndUpdate(req.params.cid, update, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				User.findById(req.params.vid, function(err, user) {
					if (err) {
						return res.render('error', {
							message: err.message,
							error: err
						});
					} else {
						from_email = new helper.Email("info@admin.vetit.com");
						to_email = new helper.Email(user.email);
						subject = "Your Profile Claim has been Verified!";
						content = new helper.Content("text/html", "<html><body>"+user.poNcame+", congratulations on successfully claiming "+company.name+".</body></html>");
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
						res.redirect('/verificationComplete');
					}
				})
			}
		})
	} else {
		return res.send(404);
	}
});

router.get('/denyCompanyClaim/:cid/:vid', function(req, res, next) {
	//admin email
	if(req.user.email === 'vetitmail@gmail.com') {
		var update = {$set: {claimed: false}};
		Company.findByIdAndUpdate(req.params.cid, update, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				User.findById(req.params.vid, function(err, user) {
					if (err) {
						return res.render('error', {
							message: err.message,
							error: err
						});
					} else {
						from_email = new helper.Email("info@admin.vetit.com");
						to_email = new helper.Email(user.email);
						subject = "Your Profile Claim has been Denied";
						content = new helper.Content("text/html", "<html><body>"+user.pocName+" , your claim to "+company.name+" has been denied.</body></html>");
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
						res.redirect('/verificationComplete');
					}
				})
			}
		})
	} else {
		return res.send(404);
	}
});

router.get('/verificationComplete', function(req, res, next){
	res.render('verificationComplete');
});

router.get('/createJobOpening/:id', function(req, res, next) {
	if (req.user.type ==='Veteran') {
		return res.redirect('/dashboard');
	} else {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else if(req.user._id.equals(company.userId)) {
				JobOpening.find({companyId: req.params.id}, function(err, jobs) {
					if (err) {
						return res.render('error', {
							message: err.message,
							error: err
						});
					} else {
						var jobTypes=new Object();
						for(var i=0; i<jobs.length; i++) {
							jobTypes[jobs[i].jobType] = true;
						}
						return res.render('newJobOpening', {
							company: company,
							typesOfJobs: Object.keys(jobTypes)
						})
					}
				})
			}
		})
	}
});

router.post('/createJobOpening/:id', function(req, res, next) {
	if(!req.body.jobType || !req.body.positionTitle || !req.body.businessUnit || !req.body.location) {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				res.redirect('/companyProfile/'+req.params.id)
			}
		})
	} else {
		var jobOpen = new JobOpening({
			jobType: req.body.jobType,
			positionTitle: req.body.positionTitle,
			businessUnit: req.body.businessUnit,
			location: req.body.location,
			companyId: req.params.id,
			date: new Date()
		})
		jobOpen.save(function(err, user) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			}
			return res.redirect('/companyProfile/' + req.params.id)
		});
	}
});

router.post('/createProgram/:id', function(req, res, next) {
	if(!req.body.programType || !req.body.programTitle || !req.body.deadlineMonth || !req.body.deadlineDay || !req.body.deadlineYear) {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				res.redirect('/companyProfile/'+req.params.id)
			}
		})
	} else {
		var programOpen = new Program({
			programType: req.body.programType,
			programTitle: req.body.programTitle,
			nextDeadline: new Date(req.body.deadlineYear, req.body.deadlineMonth, req.body.deadlineDay),
			companyId: req.params.id,
			date: new Date()
		})
		programOpen.save(function(err, user) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			}
			return res.send(200);
		});
	}
});

router.get('/companyReview/:id', function(req, res, next) {
	if(req.user.userType ==='Company') {
		return res.send(404);
	} else {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else if(company.type === 'Educator') {
				return res.send(404);
			} else {
				return res.render('companyReview', {company: company});
			}
		})
	}
});

router.post('/companyReview/:id', function(req, res, next) {
	if (!req.body.positionTitle || !req.body.type || !req.body.afterDuty || !req.body.howLong ||
		!req.body.OE || !req.body.CM || !req.body.CC || !req.body.OP || !req.body.PDP ||
		!req.body.CEO || !req.body.salary || !req.body.bonuses || !req.body.tips || !req.body.salesComm ||
		!req.body.whyLeft || !req.body.militaryBack || !req.body.eduBack || !req.body.posFeed ||
		!req.body.negFeed) {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				return res.render('companyReview', {company: company, error: "Please fill out all fields"});
			}
		})
} else {
	var review = new CompanyReview({
		companyId: req.params.id,
		positionTitle: req.body.positionTitle,
		type: req.body.type,
		afterDuty: req.body.afterDuty,
		howLong: req.body.howLong,
		OE: req.body.OE,
		CM: req.body.CM,
		CC: req.body.CC,
		OP: req.body.OP,
		PDP: req.body.PDP,
		CEO: req.body.CEO,
		salary: req.body.salary,
		bonuses: req.body.bonuses,
		tips: req.body.tips,
		salesComm: req.body.salesComm,
		whyLeft: req.body.whyLeft,
		militaryBack: req.body.militaryBack,
		eduBack: req.body.eduBack,
		posFeed: req.body.posFeed,
		negFeed: req.body.negFeed,
		employer: true,
		date: new Date(),
		vetId: req.user._id
	});
	review.save(function(err, user) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		}
		return res.redirect('/companyProfile/' + req.params.id)
	});
}
});

router.get('/interviewReview/:id', function(req, res, next) {
	if(req.user.userType ==='Company') {
		return res.send(404);
	} else {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				res.render('error', {
					message: err.message,
					error: err
				});
			} else if(company.type === 'Employer') {
				return res.render('interviewReview', {company: company, employer: true});
			} else {
				return res.render('interviewReview', {company: company, employer: false});
			}
		})
	}
});

router.post('/interviewReview/:id', function(req, res, next) {
	var questionAnswerArr = [];
	var gotJobIn = false;
	if(typeof(req.body.question) === 'string') {
		var qA = {question: req.body.question, answer: req.body.answer};
		questionAnswerArr.push(qA);
	} else {
		for(var i = 0; i < req.body.question.length; i++) {
			var qA = {question: req.body.question[i], answer: req.body.answer[i]};
			questionAnswerArr.push(qA);
		}
	}
	if(req.body.gotIt) {
		gotJobIn = true;
	}
	if (!req.body.positionTitle || !req.body.year || !req.body.OE || !req.body.secureJob ||
		!req.body.proDura || !req.body.proDesc || !questionAnswerArr[0].question ||
		!questionAnswerArr[0].answer || !req.body.intDiff || !req.body.posFeed || !req.body.negFeed) {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else if(company.type === 'Employer') {
				return res.render('interviewReview', {company: company, employer: true, error: "Please fill out all fields"});
			} else {
				return res.render('interviewReview', {company: company, employer: false, error: "Please fill out all fields"});
			}
		})
} else {
	var review = new InterviewReview({
		companyId: req.params.id,
		positionTitle: req.body.positionTitle,
		year: req.body.year,
		OE: req.body.OE,
		secureJob: req.body.secureJob,
		proDura: req.body.proDura,
		proDesc: req.body.proDesc,
		questionAnswer: questionAnswerArr,
		intDiff: req.body.intDiff,
		posFeed: req.body.posFeed,
		negFeed: req.body.negFeed,
		gotIt: gotJobIn,
		date: new Date(),
		vetId: req.user._id
	});
	review.save(function(err, user) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		}
		return res.redirect('/companyProfile/'+req.params.id)
	});
}
});

//Finds users follows and adds companyId to array, if no follows found for user, creates one
router.get('/follow/:id', function(req, res, next) {
	Follow.findOne({ userId: req.user._id }, function(err, follow) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			follow.following = follow.following.concat([req.params.id])
			follow.save(function(err, follow) {
				if (err) {
					return res.status(500).redirect('/companyProfile/' + req.params.id)
				} else {
					return res.redirect('/companyProfile/' + req.params.id)
				}
			})
		}
	})
});

router.get('/unfollow/:id', function(req, res, next) {
	Follow.findOne({ userId: req.user._id }, function(err, follow) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			follow.following.splice(follow.following.indexOf(req.params.id), 1);
			follow.save(function(err, follow) {
				if (err) {
					return res.status(500).redirect('/companyProfile/' + req.params.id)
				} else {
					return res.redirect('/companyProfile/' + req.params.id)
				}
			})
		}
	})
});

router.get('/educationReview/:id', function(req, res, next) {
	if(req.user.userType === 'Company') {
		return res.send(404);
	} else {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				return res.render('educationReview', {company: company});
			}
		})
	}
});

router.post('/educationReview/:id', function(req, res, next) {
	if (!req.body.programTitle || !req.body.type || !req.body.trainType || !req.body.funding ||
		!req.body.GIBill || !req.body.pocket || !req.body.allowance || !req.body.understand ||
		!req.body.complete || !req.body.result || !req.body.afterCred || !req.body.afterCredCompany || !req.body.OPE ||
		!req.body.SQ || !req.body.FQ || !req.body.RQ || !req.body.CQ || !req.body.CSL || !req.body.militaryBack ||
		!req.body.eduBack || !req.body.posFeed || !req.body.negFeed) {
		Company.findById(req.params.id, function(err, company) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				return res.render('educationReview', {company: company, error: "Please fill out all fields"});
			}
		})
} else {
	var after = req.body.afterCred+" "+req.body.afterCredCompany;
		var review = new EducationReview({
			companyId: req.params.id,
			programTitle: req.body.programTitle,
			type: req.body.type,
			trainType: req.body.trainType,
			funding: req.body.funding,
			GIBill: req.body.GIBill,
			pocket: req.body.pocket,
			allowance: req.body.allowance,
			understand: req.body.understand,
			complete: req.body.complete,
			result: req.body.result,
			afterCred: after,
			OPE: req.body.OPE,
			SQ: req.body.SQ,
			FQ: req.body.FQ,
			RQ: req.body.RQ,
			CQ: req.body.CQ,
			CSL: req.body.CSL,
			militaryBack: req.body.militaryBack,
			eduBack: req.body.eduBack,
			posFeed: req.body.posFeed,
			negFeed: req.body.negFeed,
			employer: false,
			date: new Date(),
			vetId: req.user._id
		});
		review.save(function(err, user) {
			if (err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			}
			return res.redirect('/companyProfile/'+req.params.id)
		});
	}
});

router.post('/editBlog/:id', function(req, res, next) {
	var update = { $set: {blog: req.body.Body} }
	Company.findByIdAndUpdate(req.params.id, update, function(err, company) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			res.redirect('/companyProfile/' + req.params.id);
		}
	})
})

router.post('/companyUserEdit', function(req, res, next) {
	var update = {$set: {pocName: req.body.pocName, pocDLine: req.body.pocDLine}};
	User.findByIdAndUpdate(req.user._id, update, function(err, user){
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			res.send(200);
		}
	})
});

router.post('/removeProgram/:id', function(req, res, next) {
	Program.findByIdAndRemove(req.params.id, function(err, program){
		if(err) {
			res.send(500);
		} else {
			res.send(200);
		}
	})
});

router.post('/removeJobOpening/:id', function(req, res, next) {
	JobOpening.findByIdAndRemove(req.params.id, function(err, jobOpening){
		if(err) {
			res.send(500);
		} else {
			res.send(200);
		}
	})
});

router.post('/addProfilePicture/:id/:name', upload.single('file'), function(req, res, next) {
	/*
Function to upload a file to AWS S3, return "true" if the file was uploaded
successfully, otherwise return "false".
*/
  var params = {
    localFile: req.file.path,

    s3Params: {
      Bucket: "vetit",
      ACL: "bucket-owner-full-control",
      ContentType: "image/png",
      Key: req.params.name
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    }
  };
  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
    return false;
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
    uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
    var update = {$set: {profilePic: "https://s3-us-west-2.amazonaws.com/vetit/"+req.params.name}};
		Company.findByIdAndUpdate(req.params.id, update, function(err, company) {
			console.log(company);
			if(err) {
				return res.render('error', {
					message: err.message,
					error: err
				});
			} else {
				return res.redirect('/companyProfile/'+req.params.id);
			}
		})
  });
});

module.exports = router;
