$(document).ready(function () {

  var showErrorSignUp = function(error, focus) {
    $(".warning-signup").html(error);
    $('.warning-signup').attr('style','display:block !important');
    $(focus).focus();
  }

  var signup = function () {
    var name = $.trim($("input#name_register").val());
    var email = $.trim($("input#email_register").val());
    var password = $.trim($("input#password_register").val());
    var password_retype = $.trim($("input#password_retype").val());

    $(".warning-signup").hide();

    if (name.length == 0) {
      showErrorSignUp("Please input your name.", "input#name_register");

      return;
    } else if (email.length == 0) {
      showErrorSignUp("Please input your email.", "input#email_register");

      return;
    } else if (!isEmail(email)) {
      showErrorSignUp("Your email is invalid.", "input#email_register");

      return;
    } else if (password.length == 0) {
      showErrorSignUp("Please input your password.", "input#password_register");

      return;
    } else if (password_retype.length == 0) {
      showErrorSignUp("Please input your password.", "input#password_retype");

      return;
    } else if (password.length < 6) {
      showErrorSignUp("Your password is too short.", "input#password_register");

      return;
    } else if (password != password_retype) {
      showErrorSignUp("Your confirm password is not match.", "input#password_retype");

      return;
    } 

    startLoading();

    $.ajax({
      url: "/signUp",
      type: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      crossDomain: true,
      dataType: "json",

      data: {
        name: name,
        email: email,
        password: password,
      },
      cache: false,
      timeout: 2000,
      success: function (data) {
        if (data.status == success_code) {
          $("#signUpModal").modal("toggle");
          openNotificationBox("Your account is now already to use. <br>Hope you have a good experience with our application. <br> <br>Thank you!", 1, "primary", false, function(){location.reload()});
        } else {
          showErrorSignUp("Your email is duplicate or something when wrong.", "input#email_register");
        }
      },
      error: function (e) {
        showErrorSignUp("Something went wrong on connecting to server.", "");        
      },
      complete: function () {
        endLoading();
      }
    });
  };

  callOnClick(".sign-up-button", function() {
    $("#signInModal").modal("hide");
    $("#signUpModal").modal("toggle");

    $("input#name_register").val("");
    $("input#email_register").val("");
    $("input#password_register").val("");
    $("input#password_retype").val("");
    
    callOnClick("#signup", signup);
  });
});
