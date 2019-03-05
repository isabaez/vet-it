var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	email: {
		type: String
	},
	password: {
		type: String
	},
	facebookId: {
		type: String
	},
	pocName: {
		type: String,
	},
	pocDLine: {
		type: String,
	},
	linkedinId: {
		type: String
	},
	picture: {
		type: String
	},
	date: {
		type: Date
	},
	verified: {
		type: Boolean
	},
	userType: {
		type: String,
		required: true,
		default: "Veteran",
		enum: ['Veteran', 'Company']
	}
});

var veteranSchema = mongoose.Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	location: {
		type: String
	},
	userId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: "User"
	},
	status: {
		type: String
	},
	branch: {
		type: String
	},
	ETS:{
		type: Date
	},
	payGrade: {
		type: String
	},
	MOS: {
		type: String
	},
	gender: {
		type: String
	},
	race: {
		type: String
	},
	TCE: {
		type: String
	},
	companiesWorked: {
		type: Array
	},
	companiesInterviewed: {
		type: Array
	},
	eduAttended: {
		type: Array
	},
	eduInterviewed: {
		type: Array
	},
	companiesInterested: {
		type: Array
	},
	eduInterested: {
		type: Array
	},
	functions: {
		type: Array
	},
	upvotes: [{
		type: mongoose.Schema.ObjectId,
		ref: "Question"
	}]
});

var companySchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	userId: {
		type: mongoose.Schema.ObjectId,
		ref: "User"
	},
	profilePic: {
		type: String,
		default: "https://s3-us-west-2.amazonaws.com/vetit/logo-14.png"
	},
	blog: {
		type: String
	},
	location: {
		type: String
	},
	claimed: {
		type: Boolean
	},
	type: {
		type: String,
		required: true,
		enum: ['Employer', 'Educator']
	}
});

var companyReviewSchema = mongoose.Schema({
	companyId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: "Company"
	},
	positionTitle: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	afterDuty: {
		type: String,
		required: true
	},
	howLong: {
		type: String,
		required: true
	},
	OE: {
		type: Number,
		required: true
	},
	CM: {
		type: Number,
		required: true
	},
	CC: {
		type: Number,
		required: true
	},
	OP: {
		type: Number,
		required: true
	},
	PDP: {
		type: Number,
		required: true
	},
	CEO: {
		type: Number,
		required: true
	},
	salary: {
		type: Number,
		required: true
	},
	bonuses: {
		type: Number,
		required: true
	},
	tips: {
		type: Number,
		required: true
	},
	salesComm: {
		type: Number,
		required: true
	},
	whyLeft: {
		type: String,
		required: true
	},
	militaryBack: {
		type: String,
		required: true
	},
	eduBack: {
		type: String,
		required: true
	},
	posFeed: {
		type: String,
		required: true
	},
	negFeed: {
		type: String,
		required: true
	},
	employer: {
		type: Boolean,
		required: true
	},
	date: {
		type: Date
	},
	vetId: {
		type: mongoose.Schema.ObjectId,
		ref: "User"
	}
});

var interviewReviewSchema = mongoose.Schema({
	companyId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: "Company"
	},
	positionTitle: {
		type: String,
		required: true
	},
	year: {
		type: String,
		required: true
	},
	OE: {
		type: Number,
		required: true
	},
	secureJob: {
		type: String,
		required: true
	},
	proDura: {
		type: String,
		required: true
	},
	proDesc: {
		type: String,
		required: true
	},
	questionAnswer: {
		type: Array,
		required: true
	},
	intDiff: {
		type: Number,
		required: true
	},
	posFeed: {
		type: String,
		required: true
	},
	negFeed: {
		type: String,
		required: true
	},
	gotIt: {
		type: Boolean,
		required: true
	},
	date: {
		type: Date
	},
	vetId: {
		type: mongoose.Schema.ObjectId,
		ref: "User"
	}
});

var educationReviewSchema = mongoose.Schema({
	companyId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: "Company"
	},
	programTitle: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	trainType: {
		type: String,
		required: true
	},
	funding: {
		type: String,
		required: true
	},
	GIBill: {
		type: String,
		required: true
	},
	pocket: {
		type: Number,
		required: true
	},
	allowance: {
		type: Number,
		required: true
	},
	understand: {
		type: Number,
		required: true
	},
	complete: {
		type: String,
		required: true
	},
	result: {
		type: String,
		required: true
	},
	afterCred: {
		type: String,
		required: true
	},
	OPE: {
		type: Number,
		required: true
	},
	SQ: {
		type: Number,
		required: true
	},
	FQ: {
		type: Number,
		required: true
	},
	RQ: {
		type: Number,
		required: true
	},
	CQ: {
		type: Number,
		required: true
	},
	CSL: {
		type: Number,
		required: true
	},
	militaryBack: {
		type: String,
		required: true
	},
	eduBack: {
		type: String,
		required: true
	},
	posFeed: {
		type: String
	},
	negFeed: {
		type: String
	},
	employer: {
		type: Boolean,
		required: true
	},
	date: {
		type: Date
	},
	vetId: {
		type: mongoose.Schema.ObjectId,
		ref: "User"
	}
});

var followsSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'User'
	},
	following: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Company'
	}]
});

var questionSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'User'
	},
	companyId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Company'
	},
	subject: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	answers: [{
		type: mongoose.Schema.ObjectId,
		ref: 'Reply'
	}],
	score: {
		type: Number,
		required: true
	},
	date: {
		type: Date,
		required: true
	}
});

var replySchema = mongoose.Schema({
	questionId: {
		type: mongoose.Schema.ObjectId,
		ref: 'Question'
	},
	body: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	}
});

var jobOpeningSchema = mongoose.Schema({
	jobType: {
		type: String,
		required: true
	},
	positionTitle: {
		type: String,
		required: true
	},
	businessUnit: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	companyId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: "Company"
	},
	date: {
		type: Date
	}
}); 

var programSchema = mongoose.Schema({
	programType: {
		type: String,
		required: true
	},
	programTitle: {
		type: String,
		required: true
	},
	nextDeadline: {
		type: Date,
		required: true
	},
	companyId: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: "Company"
	},
	date: {
		type: Date
	}
}); 

module.exports = {
	User: mongoose.model('User', userSchema),
	Veteran: mongoose.model('Veteran', veteranSchema),
	Company: mongoose.model('Company', companySchema),
	CompanyReview: mongoose.model('CompanyReview', companyReviewSchema),
	InterviewReview: mongoose.model('InterviewReview', interviewReviewSchema),
	EducationReview: mongoose.model('EducationReview', educationReviewSchema),
	Follow: mongoose.model('Follows', followsSchema),
	Question: mongoose.model('Question', questionSchema),
	Reply: mongoose.model('Reply', replySchema),
	JobOpening: mongoose.model('JobOpening', jobOpeningSchema),
	Program: mongoose.model('Program', programSchema)
}