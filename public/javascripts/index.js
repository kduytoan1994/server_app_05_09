// Create a closure
(function ($) {
  "use strict"; // Start of use strict

  $(document).ready(function () {

    let navbarCollapse = function () {
      if ($("#mainNav").offset().top > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    };
    navbarCollapse();
    $(window).scroll(navbarCollapse);

    var table_swiper = new Swiper('#tableListLending', {
      loop: true,
      slidesPerView: 5,
      direction: 'vertical',
      height: 500,
      autoplay: {
        delay: 2000,
      },
      allowTouchMove: false
    });

    var investor_swiper = new Swiper('#investorSwiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows : true,
      },
      pagination: {
        el: '.swiper-pagination',
      },
    });
  });

})(jQuery); // End of use strict
