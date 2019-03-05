$(document).ready(function () {

  //SHOWING FULL MENU
  $(".toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  });

  //HAMBURGER ANIMATION
  $('.toggle').click(function(){
      $(this).toggleClass('open1');
  });

  //alternating backgrounds for reviews in dashboard
  $(".well:odd").css("background-color", "#ebeff2");

  //alternating backgrounds for profile in accordion
  $(".panel-heading:odd").css("background-color", "#edeeef");

  //getting stars for star rating
  $.each($('.stars2'),function(index, value){
      // console.log(parseInt(value.innerText));
      var star = parseInt(value.innerText);
      for(var i = 0; i < star; i++){
        $(value).after('<span><i class="fa fa-star" aria-hidden="true"></i></span>');
      }
  });

  //sliding tab for company profiletabSlide();
  $(function() {
    var $el, leftPos, newWidth;
    var $mainNav = $(".nav-tabs");
    var activeItem = $(".nav-tabs .active")[0] ? $($(".nav-tabs .active")[0]) : null;
    var itemLinks = $(".nav-tabs li a");

    $mainNav.append("<li id='magic-line'></li>");
    var $magicLine = $("#magic-line");

    if (activeItem) {
      $magicLine
        // .width(activeItem.width())
        .width('100vw')
        .css("left", activeItem.position().left)
        .data("orig-left", activeItem.position().left)
        .data("orig-width", $magicLine.width());
    } else {
      $magicLine.width(0);
    }

    itemLinks.hover(function() {
      $el = $(this);
      leftPos = $el.parent().position().left;
      newWidth = $el.parent().width();

      if (activeItem == null && $magicLine.position().left === 0) {
        $magicLine.css("left", leftPos + newWidth / 2);
      }

      $magicLine.stop().animate({
        left: leftPos,
        width: newWidth
      });
    }, function() {
      $magicLine.stop().animate({
        left: $magicLine.data("orig-left"),
        width: $magicLine.data("orig-width")
              // $magicLine.width(100%);
      });
    });
  });

  //back to top button appear on screen
  $(window).scroll(function() {
    if ($(this).scrollTop()) {
        $('#toTop').fadeIn();
    } else {
        $('#toTop').fadeOut();
    }
  });

  //back to top animation scroll
  $('#toTop').click(function(){
    $('html, body').animate({scrollTop : 0},400);
    return false;
  });

});
