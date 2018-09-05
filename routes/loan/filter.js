var express = require('express');
var router = express.Router();
var response = require('./../tools/response');
var config = require('../../connection/config');
var session_manager = require('../session/session_manager');
var model = require('../../model/model');
var validate_data = require('../tools/validate_data');
var multer = require('multer');
var random = require('randomstring');

/* GET for filter lending. */
router.get('/', function(req, res) {

  var session_information = session_manager.getTotalInformation(req);

  res.render( 'filter_lending', 
    { session: session_information }
  );
});

/* GET manage host. */
router.post('/getListLoan', function(req, res) {
  var type = req.body.type;
  var page = req.body.page;
  var perPage = req.body.perPage;

  config.templatePostFunction(  
    config.command.getListLoan, 
    {
      type : type,
      page : page,
      perPage : perPage,
    }, 
    function(result) {
      result.data.lend_available = (session_manager.getPermission(req) == session_manager.INVESTOR);
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: {list_loans: [model.loan, model.loan, model.loan, model.loan, model.loan], total_page: 2}};
      // result.data.lend_available = (session_manager.getPermission(req) == session_manager.INVESTOR);
      
      // response.returnFormPOST(res, result);
      response.returnErrorConnect(res);
    }
  );

});

module.exports = router;