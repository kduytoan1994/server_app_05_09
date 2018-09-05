(function ($) {
  "use strict"; // Start of use strict

  $(document).ready(function () {
    $("#submitStep1").on("click", function () {
      $("#verifyUserSecond").show();
      $("#verifyUserFirst").hide();

    });
  });

})(jQuery); // End of use strict
