$(document).ready(function() {
  $(".target").change(function() {
    if($(this).val()==='Other') {
      $("#newProgram").slideDown(function() {
        $('#newProgramVal').focus();
      })
    } else {
      $("#newProgramOption").slideUp();
    }
  });

  var max_fields      = 10; //maximum input boxes allowed
  var wrapper         = $(".input_Program_wrap"); //Fields wrapper
  var add_button      = $(".add_Program_button"); //Add button ID
  
  var x = 1; //initlal text box count
  $(add_button).click(function(e){ //on add input button click
    e.preventDefault();
      if(x < max_fields){ //max input box allowed
          x++; //text box increment
          $('<option selected="selected" value="'+$("#newProgramVal").val()+'">'+$("#newProgramVal").val()+'</option>').insertBefore(".other"); //add input box
          $("#newProgram").slideUp();
          $("#newProgramVal").val("");
        }
      });

  $("#postProgram").click(function(e) {
    if($("#programType").val()==='Other'){
      e.preventDefault();
          //send error
          alert("Please add the program type.");
        } else {
          return;
        }
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
});