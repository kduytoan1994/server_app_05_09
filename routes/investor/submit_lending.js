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

  var id_loan = req.query.loan;

  if (!validate_data.checkIdGet(id_loan)) {
    response.returnWrongGET(res);
    return;
  }

  config.templatePostFunction(  
    config.command.getLoanInformation, 
    { 
      id: id_loan, 
    }, 
    function(result) {
      if (result.status != response.status.success) {
        response.returnWrongGET(res);
        return;
      }
      
      var count_chosen = 0;
      result.data.list_packages.forEach(package => {
        package.money_showing = validate_data.standardMoney(package.money)+ " VND";
        count_chosen += (package.chosen ? 1 : 0);
      });

      var session_information = session_manager.getTotalInformation(req);

      res.render( 'submit_lending', { 
          session: session_information,
          result: result.data,
          id: id_loan,
          count_chosen: count_chosen,
        }
      );
    }, 
    
    function(error) {
      // // for test
      // var session_information = session_manager.getTotalInformation(req);

      // result = {loan: model.loan, homestay: model.homestay, list_packages: [model.package, model.unchosen_package, model.package, model.unchosen_package]};
      
      // result.list_packages.forEach(package => {
      //   package.money_showing = validate_data.standardMoney(package.money)+ " VND";
      // });

      // res.render( 'submit_lending', {session: session_information, result: result, id: id_loan });
      res.render( 'error', {message: "Ops. Something when wrong."});
    }
  ); 
});

/* GET interest table */
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

/* GET wallet ballance */
router.post('/getWalletInvestor', function (req, res) {
  config.templatePostFunction(  
    config.command.getBalanceInvestor, 
    { token: session_manager.getToken(req) }, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: {available_money: 100}};
      // response.returnFormPOST(res, result);
      response.returnErrorConnect(res);
    }
  );
});

/* submit lend */
router.post('/submitPurchaseLend', function (req, res) {
  var id_loan = req.body.id_loan;
  var list_chosen_package = JSON.parse(req.body.list_chosen_package);

  if (list_chosen_package === undefined || list_chosen_package.length == 0) {
    response.returnWrongPOST(res);
    return;
  }

  config.templatePostFunction(  
    config.command.submitPurchaseLend, 
    { token: session_manager.getToken(req), list_chosen_package: list_chosen_package, id_loan: id_loan }, 
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
});

module.exports = router;