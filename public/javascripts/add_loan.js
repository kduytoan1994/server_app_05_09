$(document).ready(function () {
  var showResultGetTableInterest = function(data) {
    if (data.length == 0) {
      $(".for-table-interest").hide();
      return;
    } 

    $(".for-table-interest").show();    
    $("#listMoneyInterest").empty();    

    data.forEach(interest => {
      $("#listMoneyInterest").append("<tr class='bg-white'><td>" +makeMoneyForm(interest.money, true)+ "</td><td>" +interest.interest+ "%</td></tr>")
    });
  }
  
  var showPackageList = function(data) {
    if (data.length == 0) {
      $(".for-package-list").hide();
      return;
    } 

    $(".for-package-list").show();    
    $("#listPackages").empty();    

    data.forEach(money => {
      $("#listPackages").append('<div class="text-primary">&#9745; &nbsp ' +makeMoneyForm(money)+ '</div>');
    });
  }

  var setImageForPreview = function(index, input) {
    if (index == input.files.length) {
      $("#loanFullInformationModal").modal("toggle");
      endLoading();      
      return;
    }
    var reader = new FileReader();

    reader.onload = function(event) {
      $("#previewImageAddLoan_" + index).attr('src', event.target.result);
      setImageForPreview(index+1, input);
    }

    reader.readAsDataURL(input.files[index]);
  }
  
  var id = $("#idHost").val();
  var nameHomestay = $("#nameHomestay");
  var typeHomestay = $("#typeHomestay");
  var addressHomestay = $("#addressHomestay");
  var descriptionHomestay = $("#descriptionHomestay");
  var photoHomestay = $("#photoHomestay");
  var loanMoney = $("#loanMoney");
  var dueDate = $("#dueDate");
  var rangeTime = $("#rangeTime");
  var distanceToCenter = $("#distanceToCenter");
  var distanceToMainRoad = $("#distanceToMainRoad");
  var distanceToDiffHomestay = $("#distanceToDiffHomestay");

  var getInterestTable = function() {
    startLoading();

    $.ajax({
      url: "/add_loan/getInterestInformation/",
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

  var getPackageList = function(money) {
    startLoading();

    $.ajax({
      url: "/add_loan/getPackageList/",
      type: "POST",
      crossDomain: true,
      dataType: "json",
      timeout: 2000,

      data: {
        money: money,
      },
      cache: false,
      success: function (response) {        
        if (response.status == success_code) {
          var list_packages = response.data;
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

  var showErrorAddLoan = function(message, element) {
    openNotificationBox(message, 1, "danger", false, function() {
      element.focus();
    });
  }

  var index = 0;

  var setForSubmitAddLoan = function() {
    callOnClick("#submitAddLoan", function() {
      var name = $.trim(nameHomestay.val());
      var type = typeHomestay.val();
      var address = $.trim(addressHomestay.val());
      var description = $.trim(descriptionHomestay.val());
      var photos = photoHomestay.val();
      var money = convertMoney(loanMoney.val());
      var date = dueDate.val();
      var range = rangeTime.val();
      var distance_center = distanceToCenter.val();
      var distance_mainroad = distanceToMainRoad.val();
      var distance_diff_homestay = distanceToDiffHomestay.val();

      if (distance_center == "" || distance_center < 0) {
        distance_center = "NA";
      } else {
        distance_center+= " km";
      }
      if (distance_mainroad == "" || distance_mainroad < 0) {
        distance_mainroad = "NA";
      } else {
        distance_mainroad+= " km";
      }
      if (distance_diff_homestay == "" || distance_diff_homestay < 0) {
        distance_diff_homestay = "NA";
      } else {
        distance_diff_homestay+= " km";
      }

      if (name.length == 0) {
        showErrorAddLoan("Please input homestay's name for loan.", nameHomestay);
      } else if (type < 1) {
        showErrorAddLoan("Please select homestay's type for loan.", typeHomestay);
      } else if (address.length == 0) {
        showErrorAddLoan("Please input homestay's address for loan.", addressHomestay);
      } else if (description.length == 0) {
        showErrorAddLoan("Please input homestay's description for loan.", descriptionHomestay);
      } else if (photos == "") {
        showErrorAddLoan("Please add homestay's photos for loan.", photoHomestay);
      } else if (photoHomestay[0].files.length <=0 || photoHomestay[0].files.length >4) {
        showErrorAddLoan("Please add 1-4 photos of homestay for loan.", photoHomestay);
      } else if (money % 1000000 != 0 || money <= 0) {
        showErrorAddLoan("Please input valid money.", loanMoney);
      } else if (date.length == 0) {
        showErrorAddLoan("Please input valid due date.", dueDate);
      } else if (range < 3) {
        showErrorAddLoan("Please input valid range time.", rangeTime);
      } else {
        date = calculateDateFromString(date);
        startLoading();

        $.ajax({
          url: "/add_loan/getPackageList/",
          type: "POST",
          crossDomain: true,
          dataType: "json",
          timeout: 2000,

          data: {
            money: money/1000000,
          },
          cache: false,
          success: function (response) {        
            if (response.status == success_code) {
              showPackageList(response.data.listMoney);
              
              $("#loanFullInformation_money").html(makeMoneyForm(money / 1000000));
              $("#loanFullInformation_dueDate").html(date);
              $("#loanFullInformation_rangeTime").html(range + " months");
              $("#loanFullInformation_type").html($("#typeHomestay option:selected").text());
              $("#loanFullInformation_address").html(address);
              $("#loanFullInformation_description").html(description);
              $("#loanFullInformation_name").html(name);
              $("#loanFullInformation_distance_center").html(distance_center);
              $("#loanFullInformation_distance_mainroad").html(distance_mainroad);
              $("#loanFullInformation_diff_homestay").html(distance_diff_homestay);
              
              var temp_input = $("#photoHomestay")[0];
              if (temp_input.files) {
                var filesAmount = temp_input.files.length;
                $("#loanFullInformation_listPhotos").empty();

                for (index = 0; index < filesAmount; index++) {
                  $("#loanFullInformation_listPhotos").append('<div class="col-md-6 image-box"><img src="img/icon/icon_loading.gif" class="image-description" id="previewImageAddLoan_' +index+ '" /></div>');
                }

                setImageForPreview(0, temp_input);
              }

              callOnClick("#submitRegisterLoan", function() {
                var formData = new FormData();
                
                for (index = 0; index < $("#photoHomestay")[0].files.length; index++) {
                  formData.append('list_photos', $("#photoHomestay")[0].files[index]);
                }
                
                formData.append('name', name);
                formData.append('type', $("#typeHomestay option:selected").text());
                formData.append('address', address);
                formData.append('description', description);
                formData.append('money', money/1000000);
                formData.append('date', date);
                formData.append('range', range);
                formData.append('id_host', id);
                formData.append('distanceCenter', distance_center);
                formData.append('distanceMainRoad', distance_diff_homestay);
                formData.append('distanceDiffHomestay', distance_diff_homestay);
                startLoading();

                $.ajax({
                  url: "/add_loan/submitAddLoan/",
                  type: "POST",
                  contentType: false,
                  timeout: 2000,
                  processData: false,
                  data: formData,
                  cache: false,
                  success:function(data){
                    if (data.status == success_code) {
                      $("#loanFullInformationModal").modal("toggle");
                      openNotificationBox("Create loan for host successful.", 1, "primary", false, function(){location.replace("wallet_host?host="+id)});
                    } else {
                      $("#loanFullInformationModal").modal("toggle");
                      alertCommonError();
                    }
                  },
                  error: function(error){
                    $("#loanFullInformationModal").modal("toggle");
                    alertCommonError();  
                  },
                  complete: function() {
                    endLoading();
                  }
                });
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
    });
  }

  var setForAddLoan = function() {
    nameHomestay.val("");
    typeHomestay.val(1);
    addressHomestay.val("");
    descriptionHomestay.val("");
    loanMoney.val("");
    rangeTime.val(6);
    distanceToCenter.val("");
    distanceToMainRoad.val("");
    distanceToDiffHomestay.val("");

    setForSubmitAddLoan();
  }
    
  getInterestTable();
  setForAddLoan();
});