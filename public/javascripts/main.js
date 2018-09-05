// Create a closure
(function ($) {
  "use strict"; // Start of use strict

  $(document).ready(function () {

    // For mainNav:

    $('.image-container').find('img').each(function () {
      var imgClass = (this.width / this.height > 1) ? 'wide' : 'tall';
      $(this).addClass(imgClass);
    })

    $('[data-toggle="tooltip"]').tooltip();

    // $('.modal').on('shown.bs.modal', function () {
    //   $(this).animate({ scrollTop: 0 }, 'slow');
    // });


    // var fixBrokenImages = function( ){
    //   var img = document.getElementsByTagName('img');
    //   var i=0, l=img.length;
    //   for(;i<l;i++){
    //       var t = img[i];
    //       if(t.naturalWidth === 0){
    //           //this image is broken
    //           t.src = "img/icon/no-photo.png";
    //       }
    //   }
    // }

    // fixBrokenImages();

    // $(".modal").on('shown.bs.modal', function(){
    //   fixBrokenImages();
    // });
  });

})(jQuery); // End of use strict
