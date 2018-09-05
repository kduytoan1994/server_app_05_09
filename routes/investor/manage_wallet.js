var express = require('express');
var router = express.Router();
var response = require('./../tools/response');
var config = require('../../connection/config');
var session_manager = require('../session/session_manager');
var model = require('../../model/model');
var validate_data = require('../tools/validate_data');

/* GET manage host. */
router.get('/', function(req, res) {
  config.templatePostFunction(  
    config.command.getInvestorWallet, 
    { 
      token: session_manager.getToken(req),
    }, 
    function(result) {
      if (result.status != response.status.success) {
        res.render( 'error', {message: "Ops. Something when wrong."});
        return;
      }

      var session_information = session_manager.getTotalInformation(req);

      result.data.available_money = validate_data.standardMoney(result.data.available_money);
      result.data.lended_money = validate_data.standardMoney(result.data.lended_money);
      result.data.lending_money = validate_data.standardMoney(result.data.lending_money);

      res.render( 'manage_wallet_investor', 
        { 
          session: session_information,
          result: result.data 
        }
      );
    }, 
    function(error) {
      // // for test
      // var session_information = session_manager.getTotalInformation(req);

      // result = {
      //   name: "Duy",
      //   avatar: "img/demo/avatar.jpg",
      //   email: "kevin@gmail.com",
      //   available_money: "112",
      //   lended_money: 0,
      //   lending_money: 10,
      //   next_interest_recv_date: "20/10/2018",
      //   next_interest_revc_money: 2,
      // };

      // result.available_money = validate_data.standardMoney(result.available_money);
      // result.next_interest_revc_money = validate_data.standardMoney(result.next_interest_revc_money);
      // result.lended_money = validate_data.standardMoney(result.lended_money);
      // result.lending_money = validate_data.standardMoney(result.lending_money);
      
      // res.render( 'manage_wallet_investor', 
      //   { 
      //     session: session_information,
      //     result: result 
      //   }
      // );
      res.render( 'error', {message: "Ops. Something when wrong."});
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

/* GET registed loan. */
router.post('/getRegisteredLend', function (req, res) {
  config.templatePostFunction(  
    config.command.getRegisteredLend, 
    {token: session_manager.getToken(req)}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: [model.loan]};
      // response.returnFormPOST(res, result);
      response.returnErrorConnect(res);
    }
  );
});

/* GET on-going loan. */
router.post('/getOnGoingLend', function (req, res) {
  config.templatePostFunction(  
    config.command.getOnGoingLend, 
    {token: session_manager.getToken(req)}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: [model.on_going_lend]};
      // response.returnFormPOST(res, result);
      response.returnErrorConnect(res);
    }
  );
});

/* GET completed loan. */
router.post('/getCompletedLend', function (req, res) {
  config.templatePostFunction(  
    config.command.getCompletedLend, 
    {token: session_manager.getToken(req)}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: [model.completed_lend, model.completed_lend]};
      // response.returnFormPOST(res, result);
      response.returnErrorConnect(res);
    }
  );
});

/* request add to wallet. */
router.post('/requestAddWallet', function (req, res) {
  var money = req.body.money;

  if (money == 0 || money == undefined || money % 10000 > 0) {
    response.returnWrongPOST(res);
    return;
  }

  // TODO call to payment system.

  // TEMP: add direct:

  config.templatePostFunction(  
    config.command.addToWalletInvestor, 
    {
      token: session_manager.getToken(req),
      money: money/1000000,
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
});

/* GET withdraw. */
router.post('/requestWithdraw', function (req, res) {
  var money = req.body.money;
  var name_bank= req.body.name_bank;
  var bank_branch= req.body.bank_branch;
  var account_number= req.body.account_number;
  var name_receiver= req.body.name_receiver;

  if (money == 0 || money == undefined || money % 10000 > 0) {
    response.returnWrongPOST(res);
    return;
  } else if (name_bank.length == 0) {
    response.returnWrongPOST(res);
    return;
  } else if (bank_branch.length == 0) {
    response.returnWrongPOST(res);
    return;
  } else if (account_number.length == 0) {
    response.returnWrongPOST(res);
    return;
  } else if (name_receiver.length == 0) {
    response.returnWrongPOST(res);
    return;
  } 
 
  config.templatePostFunction(  
    config.command.requestWithDrawInvestor, 
    {
      token: session_manager.getToken(req),
      money: money/1000000,
      name_bank: name_bank,
      bank_branch: bank_branch,
      account_number:account_number,
      name_receiver: name_receiver,
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
});

module.exports = router;