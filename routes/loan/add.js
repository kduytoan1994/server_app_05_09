var express = require('express');
var router = express.Router();
var response = require('./../tools/response');
var config = require('../../connection/config');
var session_manager = require('../session/session_manager');
var model = require('../../model/model');
var validate_data = require('../tools/validate_data');
var multer = require('multer');
var random = require('randomstring');

/* GET manage host. */
router.get('/', function(req, res) {
  var id = req.query.host;

  if (!validate_data.checkIdGet(id)) {
    response.returnWrongGET(res);
    return;
  }

  config.templatePostFunction(  
    config.command.getHostInformation, 
    { 
      token: session_manager.getToken(req),
      id: id, 
    }, 
    function(result) {
      if (result.status != response.status.success) {
        response.returnWrongGET(res);
        return;
      }

      var session_information = session_manager.getTotalInformation(req);

      res.render( 'add_loan', { 
          session: session_information,
          host: result.data.host,
          id: id,
        }
      );
    }, 
    function(error) {
      // // for test
      // var session_information = session_manager.getTotalInformation(req);

      // var host = JSON.parse(JSON.stringify(model.host));

      // result = {host: host};
      
      // res.render( 'add_loan', {session: session_information, host: result.host, id: id });
      res.render( 'error', {message: "Ops. Something when wrong."});
    }
  ); 
});

/* GET information host for modal */
router.post('/getInterestInformation', function (req, res) {
  config.templatePostFunction(  
    config.command.getTableInterest, 
    {}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: [{money: 10,interest: 3}, {money: 50, interest: 5}, {money: 100, interest: 10}]};
      // response.returnFormPOST(res, result);
      response.returnErrorConnect(res);
    }
  );
});

/* GET package list for money */
router.post('/getPackageList', function (req, res) {
  var money = req.body.money;

  config.templatePostFunction(  
    config.command.calculatePackage, 
    {money: money}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: [1,3,6]};
      // response.returnFormPOST(res, result);

      response.returnErrorConnect(res);
    }
  );
});

const dir_file_upload = './public/uploads/homestay';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir_file_upload);
  },
  filename: function (req, file, cb) {
    cb(null, 'homestay_' + random.generate(16) + Date.now() + ".jpg");
  }
});

var uploadLoanInformation = multer({ storage: storage }).array('list_photos', 4);

/* POST add new loan */
router.post('/submitAddLoan', function (req, res) {
  uploadLoanInformation(req, res, function(err) {
    if (err) {
      response.returnWrongPOST(res);
      return
    }

    var listPhotos = req.files;
    
    if (listPhotos.length == 0) {
      response.returnWrongPOST(res);
      return;
    } 

    var list_photos = [];

    for (var i=0; i<listPhotos.length; i++) {
      list_photos.push("homestay_image/" + listPhotos[i].filename);
    }

    var hostId = req.body.id_host;
    var name = req.body.name;
    var amount = req.body.money;
    var typeHome = req.body.type;
    var address = req.body.address;
    var descriptions = req.body.description;
    var dueDate = req.body.date;
    var rangeTime = req.body.range;
    var distance_center = req.body.distance_center;
    var distance_diff_homestay = req.body.distance_diff_homestay;
    var distance_mainroad = req.body.distance_mainroad;

    if (name == undefined || name.length == 0 || 
      typeHome == undefined || typeHome.length == 0 || 
      address == undefined || address.length == 0 || 
      descriptions == undefined || descriptions.length == 0 ||
      dueDate == undefined || dueDate.length == 0 ||
      rangeTime == undefined || rangeTime <= 0 ||
      amount == undefined || amount < 0 ) {
      return response.returnWrongPOST(req);
    }

    var endDate = validate_data.calculateDate(dueDate, rangeTime);
    config.templatePostFunction(  
      config.command.addLoan, 
      {
        token: session_manager.getToken(req),
        hostId: hostId,
        name: name,
        amount: amount,
        typeHome: typeHome,
        address: address,
        descriptions: descriptions,
        dueDate: dueDate,
        rangeTime: rangeTime,
        list_photos: list_photos,
        endDate: endDate,
      }, 
      function(result) {
        response.returnFormPOST(res, result);
      },
      function(error) {
        // // for test
        // var result = {status: response.status.success, data: {}};
        // response.returnFormPOST(res, result);

        response.returnErrorConnect(res);
      }
    );
  })
});

module.exports = router;