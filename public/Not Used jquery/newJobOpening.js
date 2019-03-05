$(document).ready(function() {
  $(".target").change(function() {
    if($(this).val()==='Other') {
      $("#newPosition").slideDown(function() {
        $('#newPositionVal').focus();
      })
    } else {
      $("#newPositionOption").slideUp();
    }
  });

  var max_fields      = 10; //maximum input boxes allowed
  var wrapper         = $(".input_Position_wrap"); //Fields wrapper
  var add_button      = $(".add_Position_button"); //Add button ID
  
  var x = 1; //initlal text box count
  $(add_button).click(function(e){ //on add input button click
    e.preventDefault();
      if(x < max_fields){ //max input box allowed
          x++; //text box increment
          $('<option selected="selected" value="'+$("#newPositionVal").val()+'">'+$("#newPositionVal").val()+'</option>').insertBefore(".other"); //add input box
          $("#newPosition").slideUp();
          $("#newPositionVal").val("");
        }
      });

  $("#postJob").click(function(e) {
    if($("#positionType").val()==='Other'){
      e.preventDefault();
          //send error
          alert("Please add the position type.");
        } else {
          return;
        }
      });
});