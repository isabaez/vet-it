$(document).ready(function() {
	var statuses = ['Veteran', 'Active Duty', 'Reserves', 'National Guard'];
	var branches = ['Air Force', 'Army', 'Coast Guard', 'Marines', 'Navy'];
	var payGrades = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'W1', 'W2', 'W3', 'W4', 'W5', 'O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10']
	var ethnicities =['American Indian or Alaskan Native','Asian','Black or African American','Hispanic or Latino','Native Hawaiian or Other Pacific Islander','White']
	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
	var currYear = new Date().getFullYear();

	for (var i = currYear-50; i <= currYear; i++) {
		$('#ETSYear').append('<option value="'+i+'">'+i+'</option>') 
	}

	for(var j = 1; j<32; j++) {
		$('#ETSDay').append('<option value="'+j+'">'+j+'</option>')
	}

	for(var k=0; k<months.length; k++) {
		$('#ETSMonth').append('<option value="'+k+'">'+months[k]+'</option>')
	}

	for(var l=0; l<statuses.length; l++) {
		$('#status').append('<option value="'+statuses[l]+'">'+statuses[l]+'</option>')
	}
	for(var m=0; m<branches.length; m++) {
		$('#branch').append('<option value="'+branches[m]+'">'+branches[m]+'</option>')
	}
	for(var n=0; n<payGrades.length; n++) {
		$('#payGrade').append('<option value="'+payGrades[n]+'">'+payGrades[n]+'</option>')
	}
	for(var o=0; o<ethnicities.length; o++) {
		$('#race').append('<option value="'+ethnicities[o]+'">'+ethnicities[o]+'</option>')
	}
});