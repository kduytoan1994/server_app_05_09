$(document).ready(function () {

  var showResultGetLoanPackages = function(data) {      
    $("#modalLoanInformation_Total").html(makeMoneyForm(data.loan.money));
    $("#modalLoanInformation_DueDate").html(data.loan.due_date);
    $("#modalLoanInformation_Interest").html(data.loan.interest);
    $("#modalLoanInformation_RangeTime").html(data.loan.range_time);
    
    $("#modalLoanInformation_CalledPackage").empty();
    $("#modalLoanInformation_RemainPackage").empty();

    data.list_packages.forEach(function(package) {
      let class_called = "package-element-not-available";
      let before_called = "&#215; &nbsp&nbsp ";
      
      let class_remain = "package-element-available";
      let before_remain = "&#10003 &nbsp ";

      if (package.chosen == 1) {
        $("#modalLoanInformation_CalledPackage").append('<div class="' + class_called +'">' + before_called + makeMoneyForm(package.money) + '</div>');       
      } else {
        $("#modalLoanInformation_RemainPackage").append('<div class="' + class_remain +'">' + before_remain + makeMoneyForm(package.money) + '</div>');       
      }
    });

    if ($("#modalLoanInformation_CalledPackage").children().length == 0) {
      $("#modalLoanInformation_CalledPackage").html("<span class='text-muted'> NA </span>");
    }
    
    $(".choose-loan-button").attr("href", "/submit_lending?loan=" + data.loan.id);

    $("#packageLoanInformationModal").modal("toggle");
  }
 
  var getLoanPackages = function (id) {
    if (typeof id !== "string") {
      location.reload();
      return;
    }
    startLoading();

    $.ajax({
      url: "/loan/getMoneyInformation/",
      type: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
        id: id,
      },
      cache: false,
      success: function (response) {       
        if (response.status == success_code) {
          showResultGetLoanPackages(response.data);
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
  };

  callOnClick(".click-see-loan-package", function(element) {
    // get information
    var loan_id = $(element).data("id");
    getLoanPackages(loan_id);
  });
});
