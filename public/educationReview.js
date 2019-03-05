$(document).ready(function() {
	var trainTypes = ["Professional Training", "Certificate Program", "Certification Program", "Other Credential", "Associate Degree", "Bachelor Degree", 
									"Master Degree", "Doctoral Degree"];
	var fundings = ["None - Self", "DoD Tuition Assistance", "Vocational Rehab", "Post-9/11 GI Bill", "Montgomery GI Bill", "Yellow Ribbon Program", "Grant"];
	var bills = ["None - 0%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];
	// var wouldWouldNot = ["would strongly not", "would not", "would maybe", "would", "would strongly"];

	for(var i=0; i<trainTypes.length; i++) {
	    $('#trainType').append('<option value="'+trainTypes[i]+'">'+trainTypes[i]+'</option>')
	};
	for(var j=0; j<fundings.length; j++) {
	    $('#funding').append('<option value="'+fundings[j]+'">'+fundings[j]+'</option>')
	};
	for(var k=0; k<bills.length; k++) {
	    $('#GIBill').append('<option value="'+bills[k]+'">'+bills[k]+'</option>')
	};
	// for(var l=0; l<wouldWouldNot.length; l++) {
	// 	$('#militaryBack').append('<option value="'+wouldWouldNot[l]+'">'+wouldWouldNot[l]+'</option>')
	// 	$('#eduBack').append('<option value="'+wouldWouldNot[l]+'">'+wouldWouldNot[l]+'</option>')
	// };
});