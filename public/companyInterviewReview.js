$(document).ready(function() {
  $(".target").change(function() {
    if($(this).val()==='Other') {
      $("#newOption").slideDown(function() {
          $('#newOptionVal').focus();
      })
    } else {
      $("#newOption").slideUp();
    }
  });
});

$(document).ready(function() {
    var wrapper         = $(".input_Option_wrap"); //Fields wrapper
    var add_button      = $(".add_Option_button"); //Add button ID

    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if($("#newOptionVal").val().trim()) {
            $('<option selected="selected" value="'+$("#newOptionVal").val()+'">'+$("#newOptionVal").val()+'</option>').insertBefore(".otherSecured"); //add input box
            $("#newOption").slideUp();
            $("#newOptionVal").val("");
        }
    });
});

$(document).ready(function() {
    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_QA_wrap"); //Fields wrapper
    var add_button      = $(".add_QA_button"); //Add button ID

    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
        e.preventDefault();
        if($('#QA div:nth-last-of-type(1)').children().first().val() && $('#QA div:nth-last-of-type(2)').children().first().val()) {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment

                $(wrapper).append('<div><hr style="border-top: 1px dashed #5fcac6;"><div><textarea class="form-control" name="question" id="question'+x+'" rows="2" cols="50" placeholder="Question"required></textarea><label>Question '+x+'</label></div><div><textarea class="form-control" name="answer" id="answer'+x+'" rows="4" cols="50" placeholder="Answer" required></textarea><label>Answer '+x+'</label><br></div><a href="#" class="remove_field">Remove</a></div>'); //add input boxes
            }
        }
    });

    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
        e.preventDefault();
        $(this).parent().remove();
        x--;
    })
});

$(document).ready(function() {
  $("#interviewReview").click(function(e) {
    if($("#secureJob").val()==='Other' || !($("#secureJob").val())){
      e.preventDefault();
      //send error
      alert("Please add how you secured the interview.");
    } else {
      return;
    }
  })
});

$(document).ready(function() {
  var currYear = new Date().getFullYear();
  var secured = ["Online Job Board - Company's Website", "Online Job Board - Career Builder", "Online Job Board - Glass Door", "Online Job Board - Indeed",
                  "Online Job Board - LinkedIn", "Online Job Board - Military.com", "Online Job Board - Monster", "Recruiting Firm - Alliance",
                  "Recruiting Firm - Bradley Morris", "Recruiting Firm - Cameron Brooks", "Recruiting Firm - Lucas Group", "Recruiting Firm - Orion",
                  "Job Fair - Chamber of Commerce", "Job Fair - Civilian Jobs", "Job Fair - Corporate Gray", "Job Fair - Job Zone",
                  "Job Fair - Military MOJO", "Job Fair - NCOA", "Job Fair - Recruit Military", "Job Fair - Service Academy Career Conference",
                  "Job Fair - Tech Expo", "Job Fair - Transition Careers", "Job Fair - Veteran Ready", "State Employment Services",
                  "Internal Employee Referral", "USAJobs.com"];
  var processDuration = ["0-2 Weeks", "2-4 Weeks", "1-2 Months", "2-3 Months", "3-4 Months", "4-6 Months", "6-8 Months", "8-12 Months", "1+ Year"];

  for (var i = currYear-50; i <= currYear; i++) {
      $('#year').append('<option value="'+i+'">'+i+'</option>')
  }
  for(var j=0; j<secured.length; j++) {
      $('<option value="'+secured[j]+'">'+secured[j]+'</option>').insertBefore(".otherSecured")
  }
  for(var k=0; k<processDuration.length; k++) {
      $('#proDura').append('<option value="'+processDuration[k]+'">'+processDuration[k]+'</option>')
  }
});
