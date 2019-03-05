$(document).ready(function() {
	var afters = ["NA-Never Served Active Duty", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
	var howLongsItBeen = ["0-2 Months", "2-6 Months", "6-12 Months", "12-18 Months", "18-24 Months", "24-36 Months", "3-5 Years", "5-10 Years", "10+ Years"];
	var whyYouLeft = ["I was laid off", "Disability Related", "I wanted more money", "I wanted more responsibility", "I wanted better skill alignment",
	"I did not like the culture", "I wanted better training", "I wanted a better professional development program",
	"I decided I didn't like the mission", "I wanted a better chance for promotion", "I wanted a different position", "I wanted a better boss"];
	var wouldWouldNot = ["would strongly not", "would not", "would maybe", "would", "would strongly"];
	for(var i=0; i<afters.length; i++) {
		$('#afterDuty').append('<option value="'+afters[i]+'">'+afters[i]+'</option>')
	};

	for(var j=0; j<howLongsItBeen.length; j++) {
		$('#howLong').append('<option value="'+howLongsItBeen[j]+'">'+howLongsItBeen[j]+'</option>')
	};

	for(var k=0; k<whyYouLeft.length; k++) {
		$('#whyLeft').append('<option value="'+whyYouLeft[k]+'">'+whyYouLeft[k]+'</option>')
	};

	for(var l=0; l<wouldWouldNot.length; l++) {
		$('#militaryBack').append('<option value="'+wouldWouldNot[l]+'">'+wouldWouldNot[l]+'</option>')
		$('#eduBack').append('<option value="'+wouldWouldNot[l]+'">'+wouldWouldNot[l]+'</option>')
	};

});
