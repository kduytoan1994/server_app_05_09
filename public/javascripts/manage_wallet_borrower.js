$(document).ready(function () {

  const id_host = $("#idHost").val();  

  callOnClick(".btn-pref .btn", function(element) {
    $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
    // $(".tab").addClass("active"); // instead of this do the below 
    $(element).removeClass("btn-default").addClass("btn-primary");
  });

  var showLendFullInformationModal = function(lend, hide_for_completed) {
    if (hide_for_completed) {
      $(".hide-for-completed").hide();
    } else {
      $(".hide-for-completed").show();
    }

    $("#fullLendingModalTotalMoney").html(makeMoneyForm(lend.total_loan_money));
    $("#fullLendingModalStartTime").html(lend.start_time);
    $("#fullLendingModalTotalTime").html(lend.loan.range_time + " months");
    $("#fullLendingModalInterest").html(lend.interest + "%");

    if (!hide_for_completed) {
      $("#fullLendingModalNextInterestMoney").html(makeMoneyForm(lend.next_interest_money));
      $("#fullLendingModalNextInterestDate").html(lend.next_interest_date);
    }

    $("#fullLendingModalTableInterest").empty();

    var total_money_paid = 0;
    var total_money_unpaid = 0;

    lend.list_interest.forEach(interest => {
      var status_class = "paid_column";
      var text_class = "Paid";
      if (interest.status == 0) {
        status_class = "unpaid_column";
        text_class = "Unpaid";      
        total_money_unpaid += interest.money;
      } else {
        total_money_paid += interest.money;
      }
      $("#fullLendingModalTableInterest").append("<tr class='" +status_class+ "'><td>" +interest.date+ "</td><td>" +makeMoneyForm(interest.money, true)+ "</td><td>" +text_class+ "</td></tr>");
    });

    $("#fullLendingModalTotalPaid").html(makeMoneyForm(total_money_paid));
    $("#fullLendingModalTotalUnPaid").html(makeMoneyForm(total_money_unpaid));

    $("#fullLendingInformationModal").modal("toggle");
  }

  var showResultGetRegisteredList = function(data) {
    if (data.length > 0) {
      $('#contentTableRegistered').empty();
      var i = 0;

      data.forEach(loan => {
        var type_text = "danger";
        if (loan.loan.called > 0) {
          type_text = "white";
        }

        var element = '<div class="row not-margin-row element-table-loan ' +(i%2 == 0 ? 'even-index' : '')+ '">' + 
                        '<div class="col-list-item col-md-4 col-5 click-see-homestay" data-id=' +loan.loan.id+ '>' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold text-primary">' +loan.loan.name+ '</span>' + 
                            '<hr class="hr-tiny">' + 
                            '<span class="text-muted">' +loan.loan.address+ '</span>' + 
                          '</div>' + 
                        '</div>' + 
                        '<div class="col-list-item col-md-3 col-4 click-see-loan-package" data-id=' +loan.loan.id+ '>' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold text-primary">' +makeMoneyForm(loan.loan.money)+ '</span>' + 
                            '<hr class="hr-tiny">' + 
                            '<div class="progress w-100">' + 
                              '<div class="progress-bar progress-bar-warning progress-bar-striped" role="progressbar" aria-valuenow="' +loan.loan.called+ '" aria-valuemin="0" aria-valuemax="100" style="width:' +loan.loan.called+ '%">' + 
                                '<span class="text-'+type_text+'">' +loan.loan.called+ '%</span>' + 
                              '</div>' + 
                            '</div>' + 
                          '</div>' + 
                        '</div>' + 
                        '<div class="col-list-item col-md-3 d-none d-md-block">' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold">' +loan.loan.due_date+ '</span>' + 
                            '<hr class="hr-tiny">' + 
                            '<span class="text-muted">' +loan.loan.range_time+ ' months</span>' + 
                          '</div>' + 
                        '</div>' + 
                        '<div class="col-list-item col-md-2 col-3">' + 
                          '<div class="center-total">' + 
                            '<a class="btn btn-danger text-white btn-sm delete-loan" data-id=' +loan.loan.id+ '>Delete</a>' + 
                          '</div>' + 
                        '</div>' + 
                      '</div>';

        $('#contentTableRegistered').append(element);
        i++;

      });

      $(".have-element").show();
      $(".not-have-element").hide();
      
      callOnClick(".delete-loan", function(element) {
        var id = $(element).data("id");
        var deleteLoan = function() {
          startLoading();

          $.ajax({
            url: "/wallet_host/deleteLoan/",
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
                openNotificationBox("Delete loan successfully!", 1, "primary", false, getForRegisteredList);
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

        openNotificationBox("Do you want to delete this loan?", 2, "danger", true, doNothing, deleteLoan);
      });
    }
  }

  var showResultGetOnGoingList = function(data) {
    if (data.length > 0) {
      $('#contentTableOnGoing').empty();
      var i = 1;

      data.forEach(lend => {
        
        var element = '<div class="row not-margin-row element-table-loan ' +(i%2 == 0 ? 'even-index' : '')+ '">' + 
                        '<div class="col-list-item col-lg-4 col-md-4 col-4 click-see-homestay" data-id=' +lend.loan.id+ '>' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold text-primary">' +lend.loan.name+ '</span>' + 
                            '<hr class="hr-tiny">' + 
                            '<span class="text-muted">' +lend.loan.address+ '</span>' + 
                          '</div>' + 
                        '</div>' + 
                        '<div class="col-list-item col-lg-3 col-md-3 col-4 click-see-lend-full-information-ongoing" data-number=' +i+ '>' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold text-primary">' +makeMoneyForm(lend.total_loan_money)+ '</span>' + 
                            '<hr class="hr-tiny">' + 
                            '<span class="text-muted">' +lend.interest+ '%</span>' +
                          '</div>' + 
                        '</div>' + 
                        '<div class="col-list-item col-lg-3 col-md-3 d-none d-md-block">' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold"> '+makeMoneyForm(lend.next_interest_money)+' </span>' +
                            '<hr class="hr-tiny">' +
                            '<span class="font-weight-bold"> '+lend.next_interest_date+' </span>' +
                          '</div>' + 
                        '</div>' + 
                        '<div class="col-list-item col-lg-2 col-md-2 col-4">' +
                          '<div class="center-total">' + 
                            '<a class="btn btn-danger text-white btn-sm pay-interest-loan" data-id=' +lend.loan.id+ ' data-number=' +i+ '>Pay now</a>' + 
                          '</div>' + 
                        '</div>' +
                      '</div>';

        $('#contentTableOnGoing').append(element);
        i++;

      });

      $(".have-element").show();
      $(".not-have-element").hide();

      // handle click on click-see-lend-full-information button:

      callOnClick(".click-see-lend-full-information-ongoing", function(element) {
        var number = $(element).data('number');
        showLendFullInformationModal(data[number-1], false);
      });

      callOnClick(".pay-interest-loan", function(element) {
        
        var payInterestLoan = function() {
          startLoading();

          $.ajax({
            url: "/wallet_host/payInterestLoan/",
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
                openNotificationBox("Pay for loan successfully!", 1, "primary", false, function() { location.reload() });
              } else {
                if (response.status == "not need") {
                  openNotificationBox("All needed interest pay for this loan was completed before.", 1, "primary", false, doNothing);
                  return;
                } else if (response.status == "not enough money") {
                  openNotificationBox("Host doesn't have enough money to pay interest for this loan.", 1, "danger", false, doNothing);
                  return;
                }
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
        var id = $(element).data("id");
        var number = $(element).data("number");
        openNotificationBox("Do you want to pay interest for this loan?<br><br>Total interest: "+makeMoneyForm(data[number-1].next_interest_money), 2, "primary", false, doNothing, payInterestLoan);
      });
    }
  }

  var showResultGetCompletedList = function(data) {
    if (data.length > 0) {
      $('#contentTableCompleted').empty();
      var i = 1;

      data.forEach(lend => {
        
        var element = '<div class="row not-margin-row element-table-loan ' +(i%2 == 0 ? 'even-index' : '')+ '">' + 
                        '<div class="col-list-item col-4 click-see-homestay" data-id=' +lend.loan.id+ '>' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold text-primary">' +lend.loan.name+ '</span>' + 
                            '<hr class="hr-tiny">' + 
                            '<span class="text-muted">' +lend.loan.address+ '</span>' + 
                          '</div>' + 
                        '</div>' + 
                        '<div class="col-list-item col-4 click-see-lend-full-information-completed" data-number=' +i+ '>' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold text-primary">' +makeMoneyForm(lend.total_loan_money)+ '</span>' + 
                            '<hr class="hr-tiny">' + 
                            '<span class="text-muted">' +lend.interest+ '%</span>' +
                          '</div>' + 
                        '</div>' + 
                        '<div class="col-list-item col-4 d-none d-md-block">' + 
                          '<div class="center-horizontal">' + 
                            '<span class="font-weight-bold">' +lend.start_time+ '</span>' + 
                            '<hr class="hr-tiny">' + 
                            '<span class="font-weight-bold">' +lend.end_time+ '</span>' + 
                          '</div>' + 
                        '</div>' + 
                      '</div>';

        $('#contentTableCompleted').append(element);
        i++;

      });

      $(".have-element").show();
      $(".not-have-element").hide();

      callOnClick(".click-see-lend-full-information-completed", function(element) {
        var number = $(element).data('number');
        showLendFullInformationModal(data[number-1], true);
      });
    }
  }

  var getForRegisteredList = function() {
    $(".have-element").hide();
    $(".not-have-element").show();
    
    startLoading();
    
    $.ajax({
      url: "/wallet_host/getRegisteredLoan/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
        id: id_host,
      },
      cache: false,
      success: function (response) {   
        if (response.status == success_code) {
          showResultGetRegisteredList(response.data);
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

  var getForOnGoingList = function() {
    $(".have-element").hide();
    $(".not-have-element").show();
    
    startLoading();

    $.ajax({
      url: "/wallet_host/getOnGoingLoan/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
        id: id_host,
      },
      cache: false,
      success: function (response) {        
        if (response.status == success_code) {
          showResultGetOnGoingList(response.data);
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

  var getForCompletedList = function() {
    $(".have-element").hide();
    $(".not-have-element").show();
    
    startLoading();

    $.ajax({
      url: "/wallet_host/getCompletedLoan/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
        id: id_host,
      },
      cache: false,
      success: function (response) {        
        if (response.status == success_code) {
          showResultGetCompletedList(response.data);
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

  var setForAddToWallet = function() {
    $("#addMoney").val("");
    $("#errorMoney").hide();
    $("#addToWalletModal").modal("toggle");
    
    callOnClick("#submitAddToWallet", function() {
      var money = convertMoney($("#addMoney").val());

      if (money == 0 || money % 10000 > 0) {
        $("#addMoney").focus();
        $("#errorMoney").show();
        
        $("#addMoney").on("input", function(){ 
          $("#errorMoney").hide();
        });
        return;
      }

      startLoading();

      $.ajax({
        url: "/wallet_host/requestAddWallet/",
        type: "POST",
        crossDomain: true,
        dataType: "json",
        timeout: 2000,

        data: {
          money: money,
          id: id_host,
        },
        cache: false,
        success: function (response) {        
          if (response.status == success_code) {
            $("#addToWalletModal").modal("toggle");
            openNotificationBox("Your transaction is successful. <br> <br>Thank you for using our service.", 1, "primary", false, function(){location.reload()});
          } else {
            $("#addToWalletModal").modal("toggle");
            checkResultPost(response.result);  
          }
        },
        error: function (e) {
          $("#addToWalletModal").modal("toggle");
          alertCommonError();       
        },
        complete: function () {
          endLoading();
        }
      });
    });
  }

  var setForWithdraw = function() {
    $("#moneyWithdraw").val("");
    $("#nameBankWithdraw").val("VIETCOMBANK");
    $("#bankBranchWithdraw").val("Cau Giay");
    $("#accountNumberWithdraw").val("1235000091234");
    $("#nameRecipientWithdraw").val("NGUYEN MANH DUY");

    $("#errorWithdrawMoney").hide();
    $("#withdrawModal").modal("toggle");
    
    callOnClick("#registerWithdraw", function() {
      var money = convertMoney($.trim($("#moneyWithdraw").val()));
      var name_bank = $.trim($("#nameBankWithdraw").val());
      var bank_branch = $.trim($("#bankBranchWithdraw").val());
      var account_number = $.trim($("#accountNumberWithdraw").val());
      var name_receiver = $.trim($("#nameRecipientWithdraw").val());

      if (money == 0 || money % 10000 > 0) {
        $("#moneyWithdraw").focus();
        $("#errorWithdrawMoney").show();
        
        $("#moneyWithdraw").on("input", function(){ 
          $("#errorWithdrawMoney").hide();
        });
        return;
      }

      if (name_bank.length == 0) {
        $("#nameBankWithdraw").focus();
        return;
      } else if (bank_branch.length == 0) {
        $("#bankBranchWithdraw").focus();
        return;
      } else if (account_number.length == 0) {
        $("#accountNumberWithdraw").focus();
        return;
      } else if (name_receiver.length == 0) {
        $("#nameRecipientWithdraw").focus();
        return;
      } 

      startLoading();

      $.ajax({
        url: "/wallet_host/requestWithdraw/",
        type: "POST",
        crossDomain: true,
        dataType: "json",
        timeout: 2000,

        data: {
          id: id_host,          
          money: money,
          name_bank: name_bank,
          bank_branch: bank_branch,
          account_number: account_number,
          name_receiver: name_receiver,
        },
        cache: false,
        success: function (response) {        
          if (response.status == success_code) {
            $("#withdrawModal").modal("toggle");            
            openNotificationBox("The withdraw request of Host is saved successfully. We will sent to host Email notification when withdraw transaction is completed. <br> <br>Thank you for using our service.", 1, "primary", false, function(){location.reload()});
          } else {
            $("#withdrawModal").modal("toggle");
            checkResultPost(response.result);  
          }
        },
        error: function (e) {
          
          $("#withdrawModal").modal("toggle");
          alertCommonError();       
        },
        complete: function () {
          endLoading();
        }
      });
    });
  }

  getForOnGoingList();

  callOnClick(".click-registered", function() {
    getForRegisteredList();
  });

  callOnClick(".click-on-going", function() {
    getForOnGoingList();
  });

  callOnClick(".click-completed", function() {
    getForCompletedList();
  });

  callOnClick("#addToWallet", function() {
    setForAddToWallet();
  });

  callOnClick("#withdrawMoney", function() {
    setForWithdraw();
  });
});