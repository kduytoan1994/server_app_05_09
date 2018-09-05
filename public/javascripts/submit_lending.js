$(document).ready(function () {

  var rate = 0;
  var totalMoneyChosen = 0;
  var interestChosen = 0;
  var totalMoneyReceive = 0;
  var maxAvailableChoose = 0;
  var chosenPackage = [];

  var interestTable = [];
  const rangeTime = $("#rangeTime").val();
  const id = $("#idLoan").val();
  
  var totalMoneyChosenElement = $("#totalChosenMoney");
  var interestLendElement = $("#interestLend");
  var totalReceiveMoneyElement = $("#totalReceiveMoney");
  var profitMarginElement = $("#profitMargin");

  var resetMoney = function() {
    totalMoneyChosen = 0;
    rate = 0;

    $(".checkbox-package").attr("checked", false);

    maxAvailableChoose = 0;
    $('.checkbox-package').each(function (index, obj) {
      maxAvailableChoose += parseInt($(this).val());
    });
  }

  var calculateReceiveMoney = function() {
    totalMoneyReceive = 0;
    var tempTotal = totalMoneyChosen * 1000000;

    for (var i=0; i<rangeTime; i++) {
      var littleRoot = totalMoneyChosen * 1000000/ rangeTime;
      totalMoneyReceive += tempTotal * (interestChosen / 100) + littleRoot;
    }
    totalMoneyReceive = Math.round(totalMoneyReceive / 10000) * 10000;
    totalMoneyReceive /= 1000000;
  }

  var calculateChosenMoney = function() {
    totalMoneyChosen = 0;

    $('.checkbox-package').each(function (index, obj) {
      if (this.checked === true) {
        totalMoneyChosen += parseInt($(this).val());
      }
    });

    totalMoneyChosenElement.html(makeMoneyForm(totalMoneyChosen));

    if (interestTable.length > 0) {
      if (totalMoneyChosen < interestTable[0].money) {
        interestChosen = interestTable[0].interest;
      } else if (totalMoneyChosen >= interestTable[interestTable.length-1].money) {
        interestChosen = interestTable[interestTable.length-1].interest;
      } else {
        for (var i=1; i<interestTable.length; i++) { 
          if (totalMoneyChosen >= interestTable[i-1].money && totalMoneyChosen < interestTable[i].money) {
            interestChosen = interestTable[i-1].interest;
          }
        }
      }

      interestLendElement.html(interestChosen + "% / month");

      calculateReceiveMoney();

      totalReceiveMoneyElement.html("&#8776; " + makeMoneyForm(totalMoneyReceive));
      var profitMargin = 0;

      if (totalMoneyChosen > 0) {
        profitMargin = Math.round(totalMoneyReceive*100 / totalMoneyChosen) - 100;
      }

      profitMarginElement.html("&#8776; " + profitMargin + " %");
    }
  }

  var calculateLendingFee = function() {
    return 0;
  }

  var handleCheckBox = function() {
    callOnClick(".checkbox-package", function(element) {
      calculateChosenMoney();
    });
  }

  var showResultGetTableInterest = function(data) {
    interestTable = data;
    
    if (data.length == 0) {
      $(".for-table-interest").hide();
      return;
    } 

    $(".for-table-interest").show();    
    $("#listMoneyInterest").empty();    

    var i = 1;
    data.forEach(interest => {
      $("#listMoneyInterest").append("<tr class='" +(i%2 == 1 ? "bg-white" : "")+ "'><td>" +makeMoneyForm(interest.money, true)+ "</td><td>" +interest.interest+ "%</td></tr>")
      i++;
    });
  }

  var getInterestTable = function() {
    startLoading();

    $.ajax({
      url: "/submit_lending/getInterestInformation/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
      },
      cache: false,
      success: function (response) {        
        if (response.status == success_code) {
          showResultGetTableInterest(response.data);
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

  var startSubmitLending = function() {
    startLoading();

    $.ajax({
      url: "/submit_lending/getWalletInvestor/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
      },
      cache: false,
      success: function (response) {        
        if (response.status == success_code) {
          $("#modalSubmit_ListChosenPackages").empty();

          chosenPackage.forEach(package => {
            $("#modalSubmit_ListChosenPackages").append('<div class="package-element-available text-primary">&#9745; &nbsp ' +makeMoneyForm(package.money)+ '</div>');
          });

          $("#modalSubmit_TotalMoney").html(makeMoneyForm(totalMoneyChosen));

          var lendingFee = calculateLendingFee();
          $("#modalSubmit_LendingFee").html(makeMoneyForm(lendingFee));
          $("#modalSubmit_TotalPurchase").html(makeMoneyForm(totalMoneyChosen + lendingFee));
          $("#modalSubmit_Balance").html(makeMoneyForm(response.data.available_money));

          if (response.data.available_money >= lendingFee + totalMoneyChosen) {
            $("#modalSubmit_NotEnoughNotice").hide();
            $("#modalSubmit_PurchaseNotice").show();
            $("#modalSubmit_Balance").addClass("text-primary");
            $("#modalSubmit_Balance").removeClass("text-danger");
            $("#actionButton").addClass("btn-primary");
            $("#actionButton").removeClass("btn-warning");
            $("#actionButton").html("Purchase now");

            callOnClick("#actionButton", function() {
              startLoading();
              var packages = [];
              chosenPackage.forEach(package => {
                packages.push(package.id);
              });

              $.ajax({
                url: "/submit_lending/submitPurchaseLend/",
                type: "POST",
                crossDomain: true,
                dataType: "json",
                timeout: 2000,

                data: {
                  id_loan: id,
                  list_chosen_package: JSON.stringify(packages),
                },
                cache: false,
                success: function (response) {    
                  if (response.status == success_code) {
                    $("#submitPurchaseModal").modal("toggle");
                    openNotificationBox("Your purchase is submitted. <br><br>When the loan is invested fully, your lend will start have interest fund back. You can follow your lend in wallet registered lending list.<br><br>Thank you!", 1, "primary", false, function() {
                      location.replace("manage_wallet");
                    });
                  } else {
                    $("#submitPurchaseModal").modal("toggle");                    
                    checkResultPost(response.result);  
                  }
                },
                error: function (e) {
                  $("#submitPurchaseModal").modal("toggle");                  
                  alertCommonError();       
                },
                complete: function () {
                  endLoading();
                }
              });
            });
          } else {
            $("#modalSubmit_Balance").addClass("text-danger");
            $("#modalSubmit_Balance").removeClass("text-primary");
            $("#modalSubmit_NotEnoughNotice").show();
            $("#modalSubmit_PurchaseNotice").hide();
            $("#actionButton").removeClass("btn-primary");
            $("#actionButton").addClass("btn-warning");
            $("#actionButton").html("Add to wallet");

            callOnClick("#actionButton", function() {
              location.replace("manage_wallet");
            });
          }
          $("#submitPurchaseModal").modal("toggle");
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

  var handleSubmit = function() {
    callOnClick("#submitButton", function() {
      chosenPackage = [];

      $('.checkbox-package').each(function (index, obj) {
        if (this.checked === true) {
          chosenPackage.push({id: $(this).data("id"), money: $(this).val()});
        }
      });

      if (chosenPackage.length == 0) {
        openNotificationBox("Please choose your lending package before submit.", 1, "danger", false, function() {
          $(".checkbox-package").focus();
        });
        return;
      } else if (totalMoneyChosen > maxAvailableChoose) {
        location.reload();
        return;
      }

      startSubmitLending();
    });
  }

  getInterestTable();
  resetMoney();
  handleCheckBox();
  handleSubmit();
});