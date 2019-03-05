function onReply() {
	$('#replyModal').modal('show')
	$('#replyModalTitle').text($('#' + $(event.target).attr('value')).text())
	$('#submitReply').attr('value', $(event.target).attr('value'))
};

function upVote() {
	$.ajax("/upvote/" + $(event.target).attr('value'), {
		method: "POST",
		success: function(data) {
			if (data === "You've already upvoted that!") {
				alert(data)
			} else {
				$('#score'+data._id).text(data.score + 1)
			}
		},
		error: function(err) {
			alert(err.responseText);
		}
	})
};

function edit() {
	$('#blogModal').modal('show')
	$("#blogBody").text($("#" + $(event.target).attr('value')).text())
	$('#submitBlog').attr('value', $(event.target).attr('value'))
};

$(document).ready(function() {
	var script = document.getElementById("companyProfile");
	var companyId = script.getAttribute('data-cID')

	$("#question").click(function() {
		$("#questionModal").modal('show')
	});
	$("#submit").click(function(){
		if (!$("#questionSubject").val()) {
			alert("A subject is required!")
		} else if (!$("#questionBody").val()) {
			alert("A body is required!")
		} else {
			$.ajax("/question/"+companyId, {
				method: "POST",
				data: {
					Subject: $("#questionSubject").val(),
					Body: $("#questionBody").val()
				},
				success: function(data) {
					$('#forum').prepend(
						'<div class="well">'+
							'<h3>'+$("#questionSubject").val()+'</h3>'+
							'<label id="'+data._id+'">'+$("#questionBody").val()+'</label>'+
							'<br>'+
							'<span id="score'+data._id+'">'+data.score+'</span> people found this question helpful'+
							'<br>'+
							'<br>'+
							'<a class="btn btn-default" onClick="onReply()" value="'+data._id+'">Reply</a>'+
							'<a role="button" class="btn btn-default" onClick="upVote()" value="'+data._id+'">Upvote</a>'+
							'<br>'+
							'<br>'+
							'<div id="replies'+data._id+'">'+
							'Replies:'+
							'</div>'+
						'</div>'
					);
					$("#questionSubject").val("");
					$("#questionBody").val("");
					$("#questionModal").modal('hide');
				},
				error: function(err) {
					alert(err.responseText);
				}
			})
		}
	});

	$("#submitReply").click(function() {
		if (!$("#replyBody").val()) {
			alert("Reply Required")
		} else {
			$.ajax("/reply/" + $(event.target).attr('value'), {
				method: "POST",
				data: {
					Body: $("#replyBody").val()
				},
				success: function(data) {
					console.log(data)
					$('#replies'+data.questionId).append(
						'<div style="margin-left: 20px">'+
                      		'<h4>'+data.body+'</h4>'+
                    	'</div>'
					)
					$("#replyBody").val("")
					$('#replyModal').modal('hide')
				},
				error: function(err) {
					alert(err.responseText);
				}
			})
		}
	});

	$("#submitBlog").click(function() {
		if (!$("#blogBody").val()) {
			alert("Blog Required")
		} else {
			$.ajax("/editBlog/" + $(event.target).attr('value'), {
				method: "POST",
				data: {
					Body: $("#blogBody").val()
				},
				success: function(data) {
					window.location.reload();
				}
			})
		}
	})
});

// newJobOpening
$(document).ready(function() {
  $(".target").change(function() {
    if($(this).val()==='Other') {
      $("#newPosition").slideDown(function() {
        $('#newPositionVal').focus();
      })
    } else {
      $("#newPosition").slideUp();
    }
  });

  var wrapper         = $(".input_Position_wrap"); //Fields wrapper
  var add_button      = $(".add_Position_button"); //Add button ID
  
  $(add_button).click(function(e){ //on add input button click
    e.preventDefault();
    if($("#newPositionVal").val().trim()) {
	    $('<option selected="selected" value="'+$("#newPositionVal").val()+'">'+$("#newPositionVal").val()+'</option>').insertBefore(".other"); //add input box
	    $("#newPosition").slideUp();
	    $("#newPositionVal").val("");
	  } else {
	  	alert('Please Enter a Position');
	  }
   });

	$("#postJobForm").on('submit', function(e){
   	e.preventDefault();
    if($("#positionType").val()==='Other' || !($("#positionType").val())){
      alert("Please add the position type.");
    } else {
	    	  console.log($('#positionType').val());
					console.log($('#positionTitle').val());
					console.log($('#unit').val());
					console.log($('#location').val());
    	var script = document.getElementById("companyProfile");
			var cID = script.getAttribute('data-cID');
  		$.ajax("/createJobOpening/"+cID, {
	    	method: "POST",
	    	data: {
	    	  jobType: $('#positionType').val(),
					positionTitle: $('#positionTitle').val(),
					businessUnit: $('#unit').val(),
					location: $('#location').val()
		   	},
		   	success: function(data) {
		     	window.location.reload();
		   	}
	 		})
  	}
  });

  $("#addJobOpening").click(function() {
    $("#addJobPostingModal").modal('show');
  });

  $("#addJobOpeningMobile").click(function() {
    $("#addJobPostingModal").modal('show');
  });
});

// newProgram
$(document).ready(function() {
  $(".target").change(function() {
    if($(this).val()==='Other') {
      $("#newProgram").slideDown(function() {
        $('#newProgramVal').focus();
      })
    } else {
      $("#newProgram").slideUp();
    }
  });

  var wrapper         = $(".input_Program_wrap"); //Fields wrapper
  var add_button      = $(".add_Program_button"); //Add button ID
  
  $(add_button).click(function(e){ //on add input button click
    e.preventDefault();
    $('<option selected="selected" value="'+$("#newProgramVal").val()+'">'+$("#newProgramVal").val()+'</option>').insertBefore(".other"); //add input box
    $("#newProgram").slideUp();
    $("#newProgramVal").val("");
  });
  
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var currYear = new Date().getFullYear();

  for (var i = currYear; i <= currYear+50; i++) {
    $('#deadlineYear').append('<option value="'+i+'">'+i+'</option>') 
  }

  for(var j = 1; j<32; j++) {
    $('#deadlineDay').append('<option value="'+j+'">'+j+'</option>')
  }

  for(var k=0; k<months.length; k++) {
    $('#deadlineMonth').append('<option value="'+k+'">'+months[k]+'</option>')
  }

  $("#addProgramForm").on('submit', function(e){
   	e.preventDefault();
    if($("#programType").val()==='Other' || !($("#programType").val())){
      alert("Please add the program type.");
    } else {
    	var script = document.getElementById("companyProfile");
			var cID = script.getAttribute('data-cID');
  		$.ajax("/createProgram/"+cID, {
	    	method: "POST",
	    	data: {
					programType: $('#programType').val(),
					programTitle: $('#programTitle').val(),
					deadlineMonth: $('#deadlineMonth').val(),
					deadlineDay: $('#deadlineDay').val(),
					deadlineYear: $('#deadlineYear').val(),
		   	},
		   	success: function(data) {
		     	window.location.reload();
		   	}
	 		})
  	}
  });

  $("#addProgram").click(function() {
    $("#addProgramModal").modal('show');
  });

  $("#addProgramMobile").click(function() {
    $("#addProgramModal").modal('show');
  });
});

$(document).ready(function() {
	$(".remove_program").on("click", function(e){ //user click on remove text
	  e.preventDefault();
	  $.ajax("/removeProgram/"+$(this).attr('value'), {
    	method: "POST",
	   	success: function(data) {
	   	},
			error: function(err) {
				alert(err.responseText);
			}
 		})
 		$(this).parent().remove();
	});

	$(".remove_jobOpening").on("click", function(e){ //user click on remove text
	  e.preventDefault();
	  $.ajax("/removeJobOpening/"+$(this).attr('value'), {
    	method: "POST",
	   	success: function(data) {
	   	},
			error: function(err) {
				alert(err.responseText);
			}
 		})
 		$(this).parent().remove();
	})
})


$(document).ready(function() {
	$("#profPic").click(function() {
		$("#profPicModal").modal('show')
	});
});