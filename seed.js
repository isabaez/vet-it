var mongoose = require('mongoose');
var Company = require('./models/models').Company;
var CompanyReview = require('./models/models').CompanyReview;
var InterviewReview = require('./models/models').InterviewReview;
var EducationReview = require('./models/models').EducationReview;
var JobOpening = require('./models/models').JobOpening;
var Program = require('./models/models').Program;
mongoose.connect(process.env.theGoose);

var companies = require('./companies.json');

companies.forEach(function(company, index) {
	var c = new Company({
		name: company.name,
		blog: company.blog,
		location: company.location,
		claimed: false,
		type: company.type
	})
	c.save(function(err, savedCompany) {
		if (err) {
			console.log(err);
		} else if (company.type === "Employer") {
			for (var i = 0; i < 5; i++) {
				var compReview = new CompanyReview({
					companyId: savedCompany._id,
					positionTitle: company.positionTitle,
					type: company.positionType,
					afterDuty: company.afterDuty,
					howLong: company.howLong,
					OE: company.OE,
					CM: company.CM,
					CC: company.CC,
					OP: company.OP,
					PDP: company.PDP,
					CEO: company.CEO,
					salary: company.salary,
					bonuses: company.bonuses,
					tips: company.tips,
					salesComm: company.salesComm,
					whyLeft: company.whyLeft,
					militaryBack: company.militaryBack,
					eduBack: company.eduBack,
					posFeed: company.posFeed,
					negFeed: company.negFeed,
					employer: true,
					date: new Date()
				})
				compReview.save(function(err, savedReview) {
					if (err) {
						console.log(err)
					} else {
						var intReview = new InterviewReview({
							companyId: savedCompany._id,
							positionTitle: "Software Engineer",
							year: "2016",
							OE: 4,
							secureJob: "Online Job Board - LinkedIn",
							proDura: "2-4 Weeks",
							proDesc: "Submit resume, phone interview, on-site interview",
							intDiff: 4,
							questionAnswer: [{
									            "answer": "I have completed a coding bootcamp and worked on several projects with teams.",
									            "question": "Tell us about your experience for this position?"
									        }],
							posFeed: "The process was very thorough.",
							negFeed: "I didn't get the job.",
							gotIt: false,
							date: new Date(),

						})
						intReview.save(function(err, savedIntReview) {
							if (err) {
								console.log(err)
							} else {
								var job = new JobOpening({
									companyId: savedCompany._id,
									jobType: "Engineer",
									positionTitle: "Software Engineer",
									businessUnit: "Product Development",
									location: "Philadelphia, PA",
									date: new Date()
								})
								job.save(function(err, savedJob) {
									if (err) {
										console.log(err)
									} else {
										console.log("Company, Reviews, and Jobs Saved!", index)
									}
								})
							}
						})
					}
				})
			}
		} else if (company.type === "Educator") {
			for (var i = 0; i < 5; i++) {
				var eduReview = new EducationReview({
					companyId: savedCompany._id,
					programTitle: company.programTitle,
					type: company.programType,
					trainType: company.trainType,
					funding: company.funding,
					GIBill: company.GIBill,
					pocket: company.pocket,
					allowance: company.allowance,
					understand: company.understand,
					complete: company.complete,
					result: company.result,
					afterCred: company.afterCred,
					OPE: company.OPE,
					SQ: company.SQ,
					FQ: company.FQ,
					RQ: company.RQ,
					CQ: company.CQ,
					CSL: company.CSL,
					militaryBack: company.militaryBack,
					eduBack: company.eduBack,
					posFeed: company.posFeed,
					negFeed: company.negFeed,
					employer: false,
					date: new Date()
				})
				eduReview.save(function(err, savedReview) {
					if (err) {
						console.log(err)
					} else {
						var intReview = new InterviewReview({
							companyId: savedCompany._id,
							positionTitle: "Software Engineer",
							year: "2016",
							OE: 4,
							secureJob: "Online Job Board - LinkedIn",
							proDura: "2-4 Weeks",
							proDesc: "Submit resume, phone interview, on-site interview",
							intDiff: 4,
							questionAnswer: [{
									            "answer": "I have completed a coding bootcamp and worked on several projects with teams.",
									            "question": "Tell us about your experience for this position?"
									        }],
							posFeed: "The process was very thorough.",
							negFeed: "I didn't get the job.",
							gotIt: false,
							date: new Date(),

						})
						intReview.save(function(err, savedIntReview) {
							if (err) {
								console.log(err)
							} else {
								var program = new Program({
									companyId: savedCompany._id,
									programType: "B.S.E",
									programTitle: "Computer Science Major",
									nextDeadline: new Date(2016, 9, 15),
									date: new Date()
								})
								program.save(function(err, savedProgram) {
									if (err) {
										console.log(err)
									} else {
										console.log("Company, Reviews, and Programs Saved!", index)
									}
								})
							}

						})
					}
				})
			}
		}
	})
})