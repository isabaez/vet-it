$(document).ready(function(){
	$("#addCompany").click(function() {
		$("#addCompanyModal").modal('show');
	});

	$("#addCompanyForm").on('submit', function(e){
		e.preventDefault();
		console.log($("input[name='type']:checked").val());
		$.ajax("/addCompany", {
			method: "POST",
			data: {
				name: $("#name").val(),
				type: $("input[name='type']:checked").val()
			},
			success: function(data) {
				$("#addCompanyModal").modal('hide');
				window.location = "/companyProfile/" + data
			},
			error: function(err) {
				console.log(err);
				alert(err.responseText);			}
		})
	});

	//alternating backgrounds for myFilterItems in accordion
	// $(".myFilterItems a:odd").css("background-color", "#edeeef");

	//collapse following
$( "#clickme" ).click(function() {
  $( "#book" ).slideToggle( "slow", function() {
  });
});

$(".well:odd").css("background-color", "#ebeff2");

$(".well edu:odd").css("background-color", "#ebeff2");

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

//each review collapse individually
$( 'label').click(function() {
		$(this).closest('div').find(".collapse").slideToggle();
	});

});
//filter
$(document).ready(function(){
	var alphabet = ["ALL", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
 	$('.myFilters').append('<li class="page-item"><button class="page-link disabled" href="#">'+alphabet[0]+'</button></li>');
 	for(var i=1; i<alphabet.length; i++){
 		$('.myFilters').append('<li class="page-item"><button class="page-link" href="#">'+alphabet[i]+'</button></li>');
 	};
	$('.myFilters button').click(function(){
		console.log('clicked');
		$.each($('.myFilters button'), function(){
			$(this).prop('disabled', false);
		})
	   var v = $(this).text();
	  if(v==='ALL') {
			$.each($('.myFilterItems li'), function(){
				$(this).show();
			})
		} else{
		 	$('.myFilterItems li').hide().filter(function(){
		    return $($(this).children().toArray()[0]).text().toUpperCase()[0] === v;
		 	}).show()
		}
	   $(this).attr('disabled', true);
	});
});

// $(document).ready(function() {
//   var win = $(window);
//   var type = 'emp';
// 	var loading = false;

// 	//click events
// 	$('#empl').click(function(e){
// 		type = 'emp';
// 		console.log(type);
// 	});
// 	$('#educ').click(function(e){
// 		type = 'edu';
// 		console.log(type);
// 	});

//   // Each time the user scrolls
//   win.scroll(function() {
//     // End of the document reached?
//     if(window.scrollY>=$(document).height()-window.innerHeight && !loading) {
//     	loading = true;
//       counter= $('.'+type).length/10;
//       if (counter !== Math.ceil(counter)){
//       	loading = false;
//       	return;
//       };
//       $.ajax({
//           url: '/scrollMore/'+type+'/'+counter,
//           dataType: 'json',
//           success: function(nextTen) {
//           	for(var i=0; i<nextTen.length; i++) {
//           		if(type ==='emp') {
//           			$('#scrollEmployers').append('<div class="well emp"><div class="media"><div class="media-left"><a href="#"><img class="media-object" src="/images/logo-14.png" alt="logo"></a></div><div class="media-body"><h4 class="media-heading"><a href="/companyProfile/'+nextTen[i].companyId._id+'">'+nextTen[i].companyId.name+'</a></h4><p>Position: '+nextTen[i].type+' '+nextTen[i].positionTitle+'</p><div class="rating"><div class="stars"><span class="stars2" style="margin-left: 15px">'+nextTen[i].OE+'</span></div><div class="review"><div class="rev col-xs-8 col-sm-6"><span><i class="fa fa-plus-circle" aria-hidden="true" style="color: #5acac7"></i></span> Positive Feedback: <p>'+nextTen[i].posFeed+'</p></div><div class="rev col-xs-8 col-sm-6"><span><i class="fa fa-minus-circle" aria-hidden="true" style="color: #e37674"></i></span> Negative Feedback: <p>'+nextTen[i].negFeed+'</p></div></div></div></div></div></div>');
//           		} else if(type ==='edu') {
//           			$('#scrollEducators').append('<div class="well edu"><div class="media"><div class="media-left"><a href="#"><img class="media-object" src="/images/logo-14.png" alt="..."></a></div><div class="media-body"><h4 class="media-heading"><a href="/companyProfile/'+nextTen[i].companyId._id+'">'+nextTen[i].companyId.name+'</a></h4><p>Program: '+nextTen[i].programTitle+'</p><div class="stars"><span class="stars2" style="margin-left: 15px">'+nextTen[i].OPE+'</span></div><div class="review"><div class="rev col-xs-8 col-sm-6"><span><i class="fa fa-plus-circle" aria-hidden="true" style="color: #5acac7"></i></span> Positive Feedback: <p>'+nextTen[i].posFeed+'</p></div><div class="rev col-xs-8 col-sm-6"><span><i class="fa fa-minus-circle" aria-hidden="true" style="color: #e37674"></i></span> Negative Feedback: <p>'+nextTen[i].negFeed+'</p></div></div></div></div></div>');
//           		}
//           	}
//           	$(".well:odd").css("background-color", "#ebeff2");
//           	loading = false;
//           },
//           failure: function(err) {
//           	console.log(err);
//           }
//       });
//     }
//   });
// });
