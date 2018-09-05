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

  config.templatePostFunction(  
    config.command.getListHost, 
    { token: session_manager.getToken(req) }, 
    function(result) {
      if (result.status != response.status.success) {
        res.render( 'error', {message: "Ops. Something when wrong."});
        return;
      }

      var session_information = session_manager.getTotalInformation(req);

      if (result.data.list_hosts.length > 0) {
        result.data.list_hosts.forEach(host => {
          host.available_money = validate_data.standardMoney(host.available_money);
        });
      }

      res.render( 'manage_host', { session: session_information,
                             result: result.data 
                           }
                );
    }, 
    function(error) {

      // // for test
      // var session_information = session_manager.getTotalInformation(req);

      // var host = JSON.parse(JSON.stringify(model.host));

      // result = {list_hosts: [host]};

      // result.list_hosts.forEach(host => {
      //   host.available_money = validate_data.standardMoney(host.available_money);
      //   host.next_interest_money = validate_data.standardMoney(host.next_interest_money);
      // });
      
      // res.render( 'manage_host', {session: session_information, result: result });
      response.returnErrorGetPage();
    }
  ); 
});

/* GET information host for modal */
router.post('/getInformation', function (req, res) {
  var id = req.body.id;

  if (typeof id !== "string")     response.returnWrongPOST(res);

  config.templatePostFunction(  
    config.command.getHostInformation, 
    {token: session_manager.getToken(req), id: id}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: {host: model.host}};
      // response.returnFormPOST(res, result);
      
      response.returnErrorConnect(res);
    }
  );
});

const dir_file_upload = './public/uploads/host';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir_file_upload);
  },
  filename: function (req, file, cb) {
    cb(null, 'host_' + random.generate(16) + Date.now() + ".jpg");
  }
});

var uploadHostInformation = multer({ storage: storage }).fields([{ name: 'hostPhoto', maxCount: 1 },{ name: 'idPhotoFirst', maxCount: 1 },{ name: 'idPhotoSecond', maxCount: 1 }]);

/* POST add new host */
router.post('/addHost', function (req, res) {
  uploadHostInformation(req, res, function(err) {
    if (err) {
      response.returnWrongPOST(res);
      return;
    }

    var file_host_photo = req.files['hostPhoto'];
    var file_id_photo_first = req.files['idPhotoFirst'];
    var file_id_photo_second = req.files['idPhotoSecond'];

    if (file_host_photo.length * file_id_photo_first.length * file_id_photo_second.length == 0) {
      response.returnWrongPOST(res);
      return;
    } 

    var name_host = req.body.name;
    var email_host = req.body.email;
    var phonenumber_host = req.body.phonenumber;
    var address_host = req.body.address;
    var id_number_host = req.body.id_number;

    if (name_host == undefined || name_host.length == 0 || 
        email_host == undefined || email_host.length == 0 || 
        phonenumber_host == undefined || phonenumber_host.length == 0 || 
        address_host == undefined || address_host.length == 0 ||
        id_number_host == undefined || id_number_host.length == 0 ) {
      return response.returnWrongPOST(req);
    }

    var host_photo = "host_image/" + req.files['hostPhoto'][0].filename;
    var id_photo_first = "host_image/" + req.files['idPhotoFirst'][0].filename;
    var id_photo_second = "host_image/" + req.files['idPhotoSecond'][0].filename;
    
    config.templatePostFunction(  
      config.command.addNewHost, 
      {
        token: session_manager.getToken(req),
        name: name_host,
        email: email_host,
        phone_number: phonenumber_host,
        address: address_host,
        user_photo: host_photo,
        id_number: id_number_host,
        id_photo_1: id_photo_first,
        id_photo_2: id_photo_second,
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