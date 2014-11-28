$(function() {
  var carousel, select;
  select = $('.select');
  carousel = $('.jcarousel').jcarousel({
    wrap: 'both',
    animation: {
      duration: 600,
      easing: 'linear'
    }
  }).jcarouselAutoscroll({
    interval: 3000,
    target: '+=1',
    autostart: false
  }).on('jcarousel:targetin', '.item', function() {
    var targetIndex;
    targetIndex = $(this).index();
    select.removeClass('active');
    return select.eq(targetIndex).addClass('active');
  }).data('jcarousel');
  return select.click(function() {
    var targetIndex;
    targetIndex = $(this).index();
    return carousel.scroll(targetIndex);
  });
});
