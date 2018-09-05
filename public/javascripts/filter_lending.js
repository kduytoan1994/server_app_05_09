const perPage = 5;

var totalPage = 1;
var currentPage = 1;
var type;

$(document).ready(function () {

  var disablePrevious = function() {
    $("#previousButton").addClass("disabled");
    callOnClick("#previousButton", doNothing);
  }

  var disableNext = function() {
    $("#nextButton").addClass("disabled");
    callOnClick("#nextButton", doNothing);
  }

  var enablePrevious = function() {
    $("#previousButton").removeClass("disabled");
    callOnClick("#previousButton", function() { disablePrevious(); disableNext(); currentPage--; getForLoanList(); });
  }

  var enableNext = function() {
    $("#nextButton").removeClass("disabled");
    callOnClick("#nextButton", function() { disablePrevious(); disableNext(); currentPage++; getForLoanList(); });
  }

  var showResultGetLoanList = function(data) {    
    totalPage = data.total_page;
    $("#numberPage").html(currentPage);
    $("#totalPage").html(totalPage);
    if (totalPage == 0) {
      $(".have-element").hide();
      $(".not-have-element").show();
      return;
    }
    if (data.list_loans == undefined || data.list_loans.length == 0) {
      $(".not-have-element").show();
      disableNext();
      return;
    }
    $("#tableLoan").empty();
    $(".have-element").show();
    $(".not-have-element").hide();
    var lendAvailable = data.lend_available;

    data.list_loans.forEach(loan => {
      var type_text = "danger";
      if (loan.called > 0) {
        type_text = "white";
      }
      
      var element = '<div class="row not-margin-row element-table-booking">' + 
                      '<div class="col-list-item col-lg-3 col-md-4 col-5 click-see-homestay" data-id="' +loan.id+ '">' +
                        '<div class="center-horizontal">' + 
                          '<span class="font-weight-bold text-primary">' +loan.name+ '</span>' + 
                          '<hr class="hr-tiny">' + 
                          '<span class="text-muted">' +loan.address+ '</span>' + 
                        '</div>' + 
                      '</div>' + 
                      '<div class="col-list-item col-lg-1 col-md-2 d-none d-md-block">' + 
                        '<span class="center-horizontal font-weight-bold">' +loan.type+ '</span>' + 
                      '</div>' + 
                      '<div class="col-list-item col-lg-3 col-md-3 col-4 click-see-loan-package" data-id="' +loan.id+ '">' + 
                        '<div class="center-horizontal">' +
                          '<span class="font-weight-bold text-primary">' +makeMoneyForm(loan.money)+ '</span>' +
                          '<hr class="hr-tiny">' +
                          '<div class="progress w-100">' +
                            '<div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="' +loan.called+ '" aria-valuemin="0" aria-valuemax="100" style="width:' +loan.called+ '%">' +
                              '<span class="text-' +type_text+ '">' +loan.called+ '%</span>' +
                            '</div>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                      '<div class="col-list-item col-lg-2 d-none d-lg-block">' +
                        '<div class="center-horizontal">' +
                          '<span class="font-weight-bold">' +loan.due_date+ '</span>' +
                          '<hr class="hr-tiny">' +
                          '<span class="font-weight-bold">' +loan.range_time+ ' months</span>' +
                        '</div>' +
                      '</div>' +
                      '<div class="col-list-item col-lg-1 col-md-1 d-none d-md-block">' +
                        '<span class="center-horizontal font-weight-bold">' +loan.interest+ '%</span>' +
                      '</div>' +
                      '<div class="col-list-item col-lg-2 col-md-2 col-3">' +
                        '<div class="center-total">' +
                        (lendAvailable ? 
                          ('<a class="btn btn-danger btn-sm button-lending" href="submit_lending?loan=' +loan.id+ '">Lend now</a>')
                          :
                          ('<a class="btn btn-warning btn-sm text-muted" title="This function is only for investor.">Not available</a>')
                        )
                        + '</div>' +
                      '</div>' +
                    '</div>';

      $("#tableLoan").append(element);
    });

    if (currentPage > 1) {
      enablePrevious();
    } else {
      disablePrevious();
    }

    if (currentPage < totalPage) {
      enableNext();
    } else {
      disableNext();      
    }
  }

  var getForLoanList = function() {
    $(".have-element").hide();
    startLoading();
    
    $.ajax({
      url: "/filter_lending/getListLoan/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
        type: type, 
        perPage: perPage,
        page: currentPage,
      },
      cache: false,
      success: function (response) {        
        if (response.status == success_code) {
          showResultGetLoanList(response.data);
        } else {
          checkResultPost(response.result);  
          $(".have-element").hide();
          $(".not-have-element").show();
        }
      },
      error: function (e) {
        alertCommonError();       
        $(".have-element").hide();
        $(".not-have-element").show();
      },
      complete: function () {
        endLoading();
      }
    });
  }
  
  type = $("#typeHomestay option:selected").text();
  getForLoanList();

  $(document).off("change", "#typeHomestay").on("change", "#typeHomestay", function() {
    type = $("#typeHomestay option:selected").text();
    currentPage = 1;
    getForLoanList();
  }); 
});
