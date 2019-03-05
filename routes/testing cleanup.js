router.get('/companyProfile/:id', function(req, res, next) {
	Company.findById(req.params.id, function(err, company) {
		if (err) {
			return res.render('error', {
				message: err.message,
				error: err
			});
		} else {
			InterviewReview.find( {companyId: req.params.id}, function(err, IntReviews) {
				if (err) {
					return res.render('error', {
						message: err.message,
						error: err
					});
				} else if(company.type==="educator") {
					EducationReview.find({ companyId: req.params.id }, function(err, EdReviews) {
						if (err) {
							return res.render('error', {
								message: err.message,
								error: err
							});
						} else {
							Program.find( {companyId: req.params.id}, function(err, programs) {
								if (err) {
									return res.render('error', {
										message: err.message,
										error: err
									});
								} else if (req.user.userType === 'veteran') {
									Follow.findOne({ userId: req.user._id }, function(err, follow) {
										if (err) {
											return res.render('error', {
												message: err.message,
												error: err
											});
										} else if (follow.following.indexOf(req.params.id) === -1) {
											return res.render('companyProfile', {
												company: company,
												EducationReviews: EdReviews,
												InterviewReviews: IntReviews,
												educator: true,
												isFollowing: false,
												currPrograms: programs
											});
										} else {
											return res.render('companyProfile', {
												company: company,
												EducationReviews: EdReviews,
												InterviewReviews: IntReviews,
												educator: true,
												isFollowing: true,
												currPrograms: programs
											});
										}
									})
								} else if (req.user._id.equals(company.userId)) {
									return res.render('companyProfile', {
										company: company,
										EducationReviews: EdReviews,
										InterviewReviews: IntReviews,
										educatorOwner: true,
										currPrograms: programs
									})
								}
							})
						}
					})
				} else {
					CompanyReview.find( {companyId: req.params.id}, function(err, CompReviews) {
						if (err) {
							return res.render('error', {
								message: err.message,
								error: err
							});
						} else {
							JobOpening.find( {companyId: req.params.id}, function(err, jobOpens) {
								if (err) {
									return res.render('error', {
										message: err.message,
										error: err
									});
								} else if (req.user.userType === 'veteran') {
									Follow.findOne({ userId: req.user._id }, function(err, follow) {
										if (err) {
											return res.render('error', {
												message: err.message,
												error: err
											});
										} else if (follow.following.indexOf(req.params.id) === -1) {
											return res.render('companyProfile', {
												company: company,
												CompanyReviews: CompReviews,
												InterviewReviews: IntReviews,
												employer: true,
												isFollowing: false,
												jobOpenings: jobOpens
											});
										} else {
											return res.render('companyProfile', {
												company: company,
												CompanyReviews: CompReviews,
												InterviewReviews: IntReviews,
												employer: true,
												isFollowing: true,
												jobOpenings: jobOpens
											});
										}
									})
								} else if (req.user._id.equals(company.userId)) {
									res.render('companyProfile', {
										company: company,
										CompanyReviews: CompReviews,
										InterviewReviews: IntReviews,
										employerOwner: true,
										jobOpenings: jobOpens
									})
								}
							})
						}
					})
				}
			})
		}
	});
