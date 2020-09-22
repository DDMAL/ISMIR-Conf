$('.poster-buttons button').on('click', function() {
  var target = $(this).attr('data-target');
  $(this).siblings().removeClass('active');
  if ($(target).hasClass('show')) {
    $(target).addClass('show');
  } else {
    $('.collapse.show').removeClass('show');
  }

});
