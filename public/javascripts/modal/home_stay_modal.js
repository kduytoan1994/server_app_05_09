$(document).ready(function () {

  var showResultGetHomeStay = function(data) {    
    $("#modalHomeStay_Name").html(data.homestay.name);
    $("#modalHomeStay_HostName").html(data.homestay.host_name);
    $("#modalHomeStay_HostAddress").html(data.homestay.host_address);
    $("#modalHomeStay_HostPhone").html(data.homestay.phonenumber);
    $("#modalHomeStay_Type").html(data.homestay.type);
    $("#modalHomeStay_Address").html(data.homestay.address);
    $("#modalHomeStay_Description").html(data.homestay.description);
    $("#modalHomeStay_distance_center").html(data.homestay.distanceCenter);
    $("#lmodalHomeStay_distance_mainroad").html(data.homestay.distanceMainRoad);
    $("#modalHomeStay_diff_homestay").html(data.homestay.distanceDiffHomestay);

    $("#modalHomeStay_ListPhotos").empty();

    if (data.homestay.list_photos != undefined && data.homestay.list_photos.length > 0) {
      $("#modalHomeStay_ListPhotos").empty();
      $("#modalHomeStay_ListPhotos").show();
      $("#modalHomeStay_NoPhoto").hide();
      data.homestay.list_photos.forEach(function(photo) {
        $("#modalHomeStay_ListPhotos").append('<div class="image-box"><img class="image-description" src="' + photo + '"/> </div>');
      });
    } else {
      $("#modalHomeStay_ListPhotos").hide();
      $("#modalHomeStay_NoPhoto").show();
    }
    $(".choose-loan-button").attr("href", "/submit_lending?loan=" + data.homestay.id);
    $("#homestayInformationModal").modal("toggle");
  }
 
  var getHomeStayInformation = function (id) {
    startLoading();

    $.ajax({
      url: "/homestay/getInformation/",
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
          showResultGetHomeStay(response.data);
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

  callOnClick(".click-see-homestay", function(element) {
    // get information
    var loan_id = $(element).data("id");
    if (loan_id=="" || loan_id===undefined) {
      alertCommonError();     
      return;
    }
    getHomeStayInformation(loan_id);
  });
});
