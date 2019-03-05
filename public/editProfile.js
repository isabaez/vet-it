// POPULATE DEMOGRAPHIC MODALS WITH USER INFO
$(document).ready(function() {
  var statuses = ['Veteran', 'Active Duty', 'Reserves', 'National Guard'];
  var branches = ['Air Force', 'Army', 'Coast Guard', 'Marines', 'Navy'];
  var payGrades = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'W1', 'W2', 'W3', 'W4', 'W5', 'O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10']
  var ethnicities =['American Indian or Alaskan Native','Asian','Black or African American','Hispanic or Latino','Native Hawaiian or Other Pacific Islander','White']
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var currYear = new Date().getFullYear();
  for (var i = currYear - 50; i <= currYear; i++) {
   $('#ETSYear').append('<option value="'+i+'">'+i+'</option>')
 }
 for(var j = 1; j < 32; j++) {
   $('#ETSDay').append('<option value="'+j+'">'+j+'</option>')
 }
 for(var k = 0; k < months.length; k++) {
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
 $("#demographics").click(function() {
   var dateSplit = $('#ets').text().split(" ");
   $('#firstName').val($('#fName').text());
   $('#lastName').val($('#lName').text());
   $('#location').val($('#loc').text());
   $("#status").val($('#stat').text());
   $("#ETSMonth").val(months.indexOf(dateSplit[0]));
   $("#ETSDay").val(dateSplit[1].slice(0, -1));
   $("#ETSYear").val(dateSplit[2]);
   $("#branch").val($('#bran').text());
   $("#payGrade").val($('#pGrade').text());
   $("#MOS").val($('#mos').text());
   if($('#gend').text()==='Male') {
    $('#genderMale').attr('checked', true);
  } else if($('#gend').text()==='Female') {
    $('#genderFemale').attr('checked', true);
  }
  $("#race").val($('#ethnic').text());
  if($('#tce').text()==='Yes') {
    $('#TCEYes').attr('checked', true);
  } else if($('#tce').text()==='No') {
    $('#TCENo').attr('checked', true);
  }
  $("#demographicsModal").modal('show');
});
    // MODAL SUBMIT HANDLER
    $("#demographicsForm").on('submit', function(e){
    	e.preventDefault();
    	$.ajax("/demographics", {
    		method: "POST",
    		data: {
    			firstName: $("#firstName").val(),
    			lastName: $("#lastName").val(),
    			location: $("#location").val(),
    			status: $("#status").val(),
    			ETS: new Date($("#ETSYear").val(), $("#ETSMonth").val(), $("#ETSDay").val()),
    			branch: $("#branch").val(),
    			payGrade: $("#payGrade").val(),
    			MOS: $("#MOS").val(),
    			gender: $("input[name='gender']:checked").val(),
    			race: $("#race").val(),
    			TCE: $("input[name='TCE']:checked").val()
    		},
    		success: function(data) {
    			$("#demographicsModal").modal('hide');
    			window.location.reload();
    		}
    	})
    });
    // JOBS, EDUCATION, INTERVIEWS MODAL HANDLER
    $("#jobsEdInt").click(function() {
      $("#jobsEdIntModal").modal('show');
    });
  });
// JQUERY FOR ADDING COMPANIES WORKED
$(document).ready(function() {
  var currArr = $("[data-name='cWorked']").toArray();
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap_companiesWorked"); //Fields wrapper
    var add_button = $(".add_field_button_companiesWorked"); //Add button ID
    var x = currArr.length; //initlal text box count
    //place current info
    $(wrapper).append('<div class="input-group"><span><input class="form-control" type="text" name="companiesWorked" value="'+$(currArr[0]).text()+'"/></span><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>')
    for(var i=1; i<x; i++){
      $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="companiesWorked" value="'+$(currArr[i]).text()+'"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>');
    }
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
      if($('#companiesWorked span:nth-last-of-type(1)').children().last().val().trim()) {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment
                $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="companiesWorked"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>'); //add input box
                $('#companiesWorked span:nth-last-of-type(1)').children().last().focus();
              }
            }
          });
    $(wrapper).on("click",".remove_field", function(e) { //user click on remove text
      e.preventDefault();
      $(this).parent('div').remove();
      x--;
    })
  });
// JQUERY FOR ADDING COMPANIES INTERVIEWED FOR
$(document).ready(function() {
  var currArr = $("[data-name='cInt']").toArray();
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap_companiesInterviewed"); //Fields wrapper
    var add_button = $(".add_field_button_companiesInterviewed"); //Add button ID
    var x = currArr.length; //initlal text box count
    //place current info
    $(wrapper).append('<div class="input-group"><span><input class="form-control" type="text" name="companiesInterviewed" value="'+$(currArr[0]).text()+'"/></span><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>')
    for(var i=1; i<x; i++){
      $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="companiesInterviewed" value="'+$(currArr[i]).text()+'"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>');
    }
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
      if($('#companiesInterviewed span:nth-last-of-type(1)').children().last().val().trim()) {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment
                $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="companiesInterviewed"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>'); //add input box
                $('#companiesInterviewed span:nth-last-of-type(1)').children().last().focus();
              }
            }
          });
    $(wrapper).on("click",".remove_field", function(e) { //user click on remove text
      e.preventDefault();
      $(this).parent('div').remove();
      x--;
    })
  });
// JQUERY FOR ADDING EDUCATIONAL PROGRAMS ATTENDED
$(document).ready(function() {
  var currArr = $("[data-name='eAttend']").toArray();
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap_eduAttended"); //Fields wrapper
    var add_button = $(".add_field_button_eduAttended"); //Add button ID
    var x = currArr.length; //initlal text box count
    //place current info
    $(wrapper).append('<div class="input-group"><span><input class="form-control" type="text" name="eduAttended" value="'+$(currArr[0]).text()+'"/></span><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>')
    for(var i=1; i<x; i++){
      $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="eduAttended" value="'+$(currArr[i]).text()+'"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>');
    }
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
      if($('#eduAttended span:nth-last-of-type(1)').children().last().val().trim()) {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment
                $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="eduAttended"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>'); //add input box
                $('#eduAttended span:nth-last-of-type(1)').children().last().focus();
              }
            }
          });
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
      e.preventDefault(); $(this).parent('div').remove(); x--;
    })
  });
// JQUERY FOR ADDING EDUCATIONAL PROGRAMS INTERVIEWED FOR
$(document).ready(function() {
  var currArr = $("[data-name='eInt']").toArray();
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap_eduInterviewed"); //Fields wrapper
    var add_button = $(".add_field_button_eduInterviewed"); //Add button ID
    var x = currArr.length; //initlal text box count
    //place current info
    $(wrapper).append('<div class="input-group"><span><input class="form-control" type="text" name="eduInterviewed" value="'+$(currArr[0]).text()+'"/></span><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>')
    for(var i=1; i<x; i++){
    	$(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="eduInterviewed" value="'+$(currArr[i]).text()+'"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>');
    }
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
      if($('#eduInterviewed span:nth-last-of-type(1)').children().last().val().trim()) {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment
                $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="eduInterviewed"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>'); //add input box
                $('#eduInterviewed span:nth-last-of-type(1)').children().last().focus();
              }
            }
          });
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
      e.preventDefault();
      $(this).parent('div').remove();
      x--;
    })
  });
// EDIT JOBS, EDUCATION, INTERVIEWS MODAL SUBMIT HANDLER
$(document).ready(function() {
  $("#jobsEdIntForm").on('submit', function(e){
   e.preventDefault();
   var worked=$("[name='companiesWorked']").toArray();
   var interviewed=$("[name='companiesInterviewed']").toArray();
   var attended=$("[name='eduAttended']").toArray();
   var eduInterviewed=$("[name='eduInterviewed']").toArray();
   var arrWorked=[];
   var arrInterviewed=[];
   var arrAttended=[];
   var arrEduInterviewed=[];
   for(var i=0; i<worked.length; i++){
    arrWorked.push($(worked[i]).val());
  }
  for(var j=0; j<interviewed.length; j++){
    arrInterviewed.push($(interviewed[j]).val());
  }
  for(var k=0; k<attended.length; k++){
    arrAttended.push($(attended[k]).val());
  }
  for(var l=0; l<eduInterviewed.length; l++){
    arrEduInterviewed.push($(eduInterviewed[l]).val());
  }
  $.ajax("/jobsEdInt", {
    method: "POST",
    data: {
     companiesWorked: JSON.stringify(arrWorked),
     companiesInterviewed: JSON.stringify(arrInterviewed),
     eduAttended: JSON.stringify(arrAttended),
     eduInterviewed: JSON.stringify(arrEduInterviewed)
   },
   success: function(data) {
     $("#jobsEdIntModal").modal('hide');
     window.location.reload();
   }
 })
});

// EDIT INTERESTS MODAL HANDLER
$("#interests").click(function() {
	$("#interestsModal").modal('show');
});
});
// JQUERY FOR ADDING COMPANIES INTERESTED IN
$(document).ready(function() {
  var currArr = $("[data-name='cRested']").toArray();
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap_companiesInterested"); //Fields wrapper
    var add_button = $(".add_field_button_companiesInterested"); //Add button ID
    var x = currArr.length; //initlal text box count
    //place current info
    $(wrapper).append('<div class="input-group"><span><input class="form-control" type="text" name="companiesInterested" value="'+$(currArr[0]).text()+'"/></span><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>')
    for(var i=1; i<x; i++){
    	$(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="companiesInterested" value="'+$(currArr[i]).text()+'"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>');
    }
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
      if($('#companiesInterested span:nth-last-of-type(1)').children().last().val().trim()) {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment
                $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="companiesInterested"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>'); //add input box
                $('#companiesInterested span:nth-last-of-type(1)').children().last().focus();
              }
            }
          });
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
      e.preventDefault(); $(this).parent('div').remove(); x--;
    })
  });
// JQUERY FOR ADDING EDUCATIONAL PROGRAMS INTERESTED IN
$(document).ready(function() {
  var currArr = $("[data-name='eRested']").toArray();
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap_eduInterested"); //Fields wrapper
    var add_button = $(".add_field_button_eduInterested"); //Add button ID
    var x = currArr.length; //initlal text box count
    //place current info
    $(wrapper).append('<div class="input-group"><span><input class="form-control" type="text" name="eduInterested" value="'+$(currArr[0]).text()+'"/></span><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>')
    for(var i=1; i<x; i++){
    	$(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="eduInterested" value="'+$(currArr[i]).text()+'"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>');
    }
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
      if($('#eduInterested span:nth-last-of-type(1)').children().last().val().trim()) {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment
                $(wrapper).append('<div class="input-group"><input class="form-control" type="text" name="eduInterested"/><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div></div>'); //add input box
                $('#eduInterested span:nth-last-of-type(1)').children().last().focus();
              }
            }
          });
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
      e.preventDefault(); $(this).parent('div').remove(); x--;
    })
  });
// JQUERY FOR ADDING FIELDS INTERESTED IN
$(document).ready(function() {
  var currArr = $("[data-name='fRested']").toArray();
    var max_fields = 10; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap_functions"); //Fields wrapper
    var add_button = $(".add_field_button_functions"); //Add button ID
	var x = currArr.length; //initlal text box count
	//place current info
  $(wrapper).append('<div class="input-group"><span><select id="functions0" name="functions"><option value="">----Please Select a Function----</option><option value="Accounting and Finance">Accounting and Finance</option><option value="Administration">Administration</option><option value="Architecture and Engineering">Architecture and Engineering</option><option value="Banking and Mortgage">Banking and Mortgage</option><option value="Construction">Construction</option><option value="Consulting">Consulting</option><option value="Customer Service">Customer Service</option><option value="Entertainment and Media">Entertainment and Media</option><option value="Entrepreneurship">Entrepreneurship</option><option value="Health Care">Health Care</option><option value="Hospitality">Hospitality</option><option value="Human Resources">Human Resources</option><option value="Information Technology">Information Technology</option><option value="Legal">Legal</option><option value="Maintenance">Maintenance</option><option value="Manufacturing">Manufacturing</option><option value="Marketing">Marketing</option><option value="Operations">Operations</option><option value="Research">Research</option><option value="Retail">Retail</option><option value="Safety and Security">Safety and Security</option><option value="Sales">Sales</option><option value="Transportation">Transportation</option></select></span><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>');
  $("#functions0").val($(currArr[0]).text());
  for(var i=1; i<x; i++){
   $(wrapper).append('<div class="input-group"><select id="functions'+i+'" name="functions"><option value="">----Please Select a Function----</option><option value="Accounting and Finance">Accounting and Finance</option><option value="Administration">Administration</option><option value="Architecture and Engineering">Architecture and Engineering</option><option value="Banking and Mortgage">Banking and Mortgage</option><option value="Construction">Construction</option><option value="Consulting">Consulting</option><option value="Customer Service">Customer Service</option><option value="Entertainment and Media">Entertainment and Media</option><option value="Entrepreneurship">Entrepreneurship</option><option value="Health Care">Health Care</option><option value="Hospitality">Hospitality</option><option value="Human Resources">Human Resources</option><option value="Information Technology">Information Technology</option><option value="Legal">Legal</option><option value="Maintenance">Maintenance</option><option value="Manufacturing">Manufacturing</option><option value="Marketing">Marketing</option><option value="Operations">Operations</option><option value="Research">Research</option><option value="Retail">Retail</option><option value="Safety and Security">Safety and Security</option><option value="Sales">Sales</option><option value="Transportation">Transportation</option></select><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>');
   $("#functions"+i+"").val($(currArr[i]).text());
 }
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
      if($('#functions span:nth-last-of-type(1)').children().last().val()) {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment
                $(wrapper).append('<div class="input-group"><select name="functions"><option value="">----Please Select a Function----</option><option value="Accounting and Finance">Accounting and Finance</option><option value="Administration">Administration</option><option value="Architecture and Engineering">Architecture and Engineering</option><option value="Banking and Mortgage">Banking and Mortgage</option><option value="Construction">Construction</option><option value="Consulting">Consulting</option><option value="Customer Service">Customer Service</option><option value="Entertainment and Media">Entertainment and Media</option><option value="Entrepreneurship">Entrepreneurship</option><option value="Health Care">Health Care</option><option value="Hospitality">Hospitality</option><option value="Human Resources">Human Resources</option><option value="Information Technology">Information Technology</option><option value="Legal">Legal</option><option value="Maintenance">Maintenance</option><option value="Manufacturing">Manufacturing</option><option value="Marketing">Marketing</option><option value="Operations">Operations</option><option value="Research">Research</option><option value="Retail">Retail</option><option value="Safety and Security">Safety and Security</option><option value="Sales">Sales</option><option value="Transportation">Transportation</option></select><div class="input-group-addon remove_field"><i class="fa fa-times" aria-hidden="true"></i></div></div>'); //add select box
              }
            }
          });
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
      e.preventDefault(); $(this).parent('div').remove(); x--;
    })
  });
// EDIT INTERESTS MODAL SUBMIT HANDLER
$(document).ready(function() {
  $("#interestsForm").on('submit', function(e){
   e.preventDefault();
   var companies=$("[name='companiesInterested']").toArray();
   var edu=$("[name='eduInterested']").toArray();
   var functions=$("[name='functions']").toArray();
   var arrCompanies=[];
   var arrEdu=[];
   var arrFunctions=[];
   for(var i=0; i<companies.length; i++){
    arrCompanies.push($(companies[i]).val());
  }
  for(var j=0; j<edu.length; j++){
    arrEdu.push($(edu[j]).val());
  }
  for(var k=0; k<functions.length; k++){
    arrFunctions.push($(functions[k]).val());
  }
  $.ajax("/interests", {
    method: "POST",
    data: {
     companiesInterested: JSON.stringify(arrCompanies),
     eduInterested: JSON.stringify(arrEdu),
     functions: JSON.stringify(arrFunctions)
   },
   success: function(data) {
     $("#jobsEdIntModal").modal('hide');
     window.location.reload();
   }
 })
});
});

// EDIT COMPANY USER MODAL HANDLER
$(document).ready(function() {
  $("#cUser").click(function() {
    $('#pocName').val($('#pointName').text());
    $('#pocDLine').val($('#pointDLine').text());
    $("#cUserModal").modal('show');
  });

  $("#cUserForm").on('submit', function(e){
    e.preventDefault();
    $.ajax("/companyUserEdit", {
      method: "POST",
      data: {
       pocName: $('#pocName').val(),
       pocDLine: $('#pocDLine').val()
      },
      success: function(data) {
       window.location.reload();
      }
    })
  });
});
