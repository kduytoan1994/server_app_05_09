$(document).ready(function () {

  var showResultGetHost = function(data) {    
    $("#modalHost_name").html(data.host.name);
    $("#modalHost_address").html(data.host.address);
    $("#modalHost_phonenumber").html(data.host.phone_number);
    $("#modalHost_email").html(data.host.email);
    $("#modalHost_registeredLoan").html(data.host.number_registered_loan);
    $("#modalHost_currentLoan").html(data.host.number_current_loan);
    $("#modalHost_completedLoan").html(data.host.number_completed_loan);
    $("#modalHost_availableMoney").html(makeMoneyForm(data.host.available_money));
    $("#modalHost_debtMoney").html(makeMoneyForm(data.host.total_debt_money));
    
    $("#hostInformationModal").modal("toggle");
  }

  var getInformationHost = function(id) {
    startLoading();

    $.ajax({
      url: "/host/getInformation/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
        id: id,
      },
      cache: false,
      success: function (response) {        
        if (response.status == success_code) {
          showResultGetHost(response.data);
          callOnClick(".manage-wallet-modal", function(element) {
            location.replace("wallet_host?host="+id);
          });
        } else {
          checkResultPost(response.result);  
        }
      },
      error: function (e) {
        alertCommonError();       
      },
      complete: function () {
        endLoading();
      }
    });
  }

  var showErrorAddHost = function(error, focus) {
    $(".warning-add-host").html(error);
    $('.warning-add-host').attr('style','display:block !important');
    $(focus).focus();
  }

  var submitAddHost = function() {
    // check before:

    var name = $.trim($("#nameAddHost").val());
    var email = $.trim($("#emailAddHost").val());
    var phonenumber = $.trim($("#phoneNumberAddHost").val());
    var address = $.trim($("#addressAddHost").val());
    var id_number = $.trim($("#idNumberAddHost").val());

    $(".warning-add-host").hide();

    if (name.length == 0) {
      showErrorAddHost("Please input host's name.", "input#nameAddHost");
      return;
    } else if (email.length == 0) {
      showErrorAddHost("Please input host's email.", "input#emailAddHost");
      return;
    } else if (!isEmail(email)) {
      showErrorAddHost("Host's email is invalid.", "input#emailAddHost");
      return;
    } else if (phonenumber.length == 0) {
      showErrorAddHost("Please input host's phone number.", "input#phoneNumberAddHost");
      return;
    } else if (!isPhoneNumber(phonenumber)) {
      showErrorAddHost("Host's phone number is invalid.", "input#phoneNumberAddHost");
      return;
    } else if (address.length == 0) {
      showErrorAddHost("Please input host's address.", "input#addressAddHost");
      return;
    } else if (id_number.length == 0) {
      showErrorAddHost("Please input host's id number.", "input#idNumberAddHost");
      return;
    } else if ($("#userPhotoAddHost").val() == "") {
      showErrorAddHost("Please input host's photo.", "input#userPhotoAddHost");
      return;
    } else if ($("#idPhotoFirstAddHost").val() == "") {
      showErrorAddHost("Please input host's id photo 1.", "input#idPhotoFirstAddHost");
      return;
    } else if ($("#idPhotoSecondAddHost").val() == "") {
      showErrorAddHost("Please input host's id photo 2.", "input#idPhotoSecondAddHost");
      return;
    }

    var userPhoto = $('#userPhotoAddHost')[0].files[0];
    var idPhotoFirst = $('#idPhotoFirstAddHost')[0].files[0];
    var idPhotoSecond = $('#idPhotoSecondAddHost')[0].files[0];
    var formData = new FormData();
    formData.append('hostPhoto', userPhoto);
    formData.append('idPhotoFirst', idPhotoFirst);
    formData.append('idPhotoSecond', idPhotoSecond);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phonenumber', phonenumber);
    formData.append('address', address);
    formData.append('id_number', id_number);
    startLoading();
    $.ajax({
      url: "/host/addHost/",
      type: "POST",
      contentType: false,
      timeout: 2000,
      processData: false,
      data: formData,
      cache: false,
      success:function(data){
        if (data.status == success_code) {
          $("#addHostModal").modal("toggle");
          openNotificationBox("Add Host successful. At that moment, you can access this host 's wallet, register a loan or pay for their loan.", 1, "primary", false, function(){location.reload()});
        } else {
          showErrorAddHost("Host Email is duplicate or some thing went wrong with your action.", "input#idPhotoSecondAddHost");
        }
      },
      error: function(error){
        showErrorAddHost("Some thing went wrong with your action. Please try again later.", "input#idPhotoSecondAddHost");
      },
      complete: function() {
        endLoading();
      }
    });
  }

  var checkForAddHost = function() {
    $("#nameAddHost").val("Host");
    $("#emailAddHost").val("host@gmail.com");
    $("#phoneNumberAddHost").val("0986303495");
    $("#addressAddHost").val("Ha Noi");
    $("#userPhotoAddHost").val(null);
    $("#idNumberAddHost").val("1234566789");
    $("#idPhotoFirstAddHost").val(null);
    $("#idPhotoSecondAddHost").val(null);

    $("#addHostModal").modal("toggle");

    callOnClick("#submitAddHost", function(element) {
      submitAddHost();
    });
  }

  callOnClick(".see-host-detail", function(element) {
    let host_id = $(element).data("id");

    getInformationHost(host_id);
  });

  callOnClick("#addHost", function(element) {
    checkForAddHost();
  });
});
