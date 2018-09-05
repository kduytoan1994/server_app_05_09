$(document).ready(function () {
  var showErrorLogin = function(error, focus) {
    $(".warning-signin").html(error);
    $('.warning-signin').attr('style','display:block !important');
    $(focus).focus();
  }
  var signIn = function () {
    var email = $.trim($("input#email").val());
    var password = $.trim($("input#password").val());
    $(".warning-signin").hide();

    if (email.length == 0) {
      showErrorLogin("Please input your email.", "input#email");

      return;
    } else if (password.length == 0) {
      showErrorLogin("Please input your password.", "input#password");

      return;
    } 
    startLoading();

    $.ajax({
      url: "/signIn",
      type: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      crossDomain: true,
      dataType: "json",
      timeout: 2000,
      data: {
        email: email,
        password: password,
      },
      xhrFields: {
        withCredentials: true
      },
      cache: false,
      success: function (data) {
        if (data.status == success_code) {
          location.reload();
        } else {
          showErrorLogin("Your email or password is incorect.", "");
        }
      },
      error: function (e) {
        showErrorLogin("Something went wrong on connecting to server.", "");        
      },
      complete: function () {
        endLoading();
      }
    });
  };

  var readyForSignIn = function() {
    $("#signInModal").modal("toggle");

    $("input#email").val("@gmail.com");
    $("input#password").val("123456");
    $(".warning-signin").hide();

    callOnClick("#login", signIn);
    callOnEnter("input#email", signIn);
    callOnEnter("input#password", signIn);
  }

  callOnClick(".sign-in-button", function(){
    readyForSignIn();
  });
});
