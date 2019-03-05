$(document).ready(function() {
    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap_companiesInterested"); //Fields wrapper
    var add_button      = $(".add_field_button_companiesInterested"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input type="text" name="companiesInterested"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
          }
        });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
      e.preventDefault(); $(this).parent('div').remove(); x--;
    })
  });

$(document).ready(function() {
    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap_eduInterested"); //Fields wrapper
    var add_button      = $(".add_field_button_eduInterested"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
        if(x < max_fields){ //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input type="text" name="eduInterested"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
          }
        });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
      e.preventDefault(); $(this).parent('div').remove(); x--;
    })
  });

$(document).ready(function() {
    var max_fields      = 10; //maximum input boxes allowed
    var wrapper         = $(".input_fields_wrap_functions"); //Fields wrapper
    var add_button      = $(".add_field_button_functions"); //Add button ID
    
    var x = 1; //initlal text box count
    $(add_button).click(function(e){ //on add input button click
      e.preventDefault();
      if($('#functions').last().val() !== '') {
            if(x < max_fields){ //max input box allowed
                x++; //text box increment
                $(wrapper).append('<div><select name="functions"><option value=null>----Please Select a Function----</option><option value="Accounting and Finance">Accounting and Finance</option><option value="Administration">Administration</option><option value="Architecture and Engineering">Architecture and Engineering</option><option value="Banking and Mortgage">Banking and Mortgage</option><option value="Construction">Construction</option><option value="Consulting">Consulting</option><option value="Customer Service">Customer Service</option><option value="Entertainment and Media">Entertainment and Media</option><option value="Entrepreneurship">Entrepreneurship</option><option value="Health Care">Health Care</option><option value="Hospitality">Hospitality</option><option value="Human Resources">Human Resources</option><option value="Information Technology">Information Technology</option><option value="Legal">Legal</option><option value="Maintenance">Maintenance</option><option value="Manufacturing">Manufacturing</option><option value="Marketing">Marketing</option><option value="Operations">Operations</option><option value="Research">Research</option><option value="Retail">Retail</option><option value="Safety and Security">Safety and Security</option><option value="Sales">Sales</option><option value="Transportation">Transportation</option></select><a href="#" class="remove_field">Remove</a></div>'); //add select box
              }
            }
          });
    
    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
      e.preventDefault(); $(this).parent('div').remove(); x--;
    })
  });

$(document).ready(function() {
  var functionsInterest = ["Accounting and Finance", "Administration", "Architecture and Engineering", "Banking and Mortgage", "Construction",
  "Consulting", "Customer Service", "Entertainment and Media", "Entrepreneurship", "Health Care", "Hospitality", 
  "Human Resources", "Information Technology", "Legal", "Maintenance", "Manufacturing", "Marketing", "Operations", 
  "Research", "Retail", "Safety and Security", "Sales", "Transportation"];
  for(var i=0; i<functionsInterest.length; i++) {
    $('#functions').append('<option value="'+functionsInterest[i]+'">'+functionsInterest[i]+'</option>')
  }
});