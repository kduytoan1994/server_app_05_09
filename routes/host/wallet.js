var express = require('express');
var router = express.Router();
var response = require('./../tools/response');
var config = require('../../connection/config');
var session_manager = require('../session/session_manager');
var model = require('../../model/model');
var validate_data = require('../tools/validate_data');

/* GET manage host. */
router.get('/', function(req, res) {
  var id = req.query.host;

  if (!validate_data.checkIdGet(id)) {
    response.returnWrongGET(res);
    return;
  }

  config.templatePostFunction(  
    config.command.getHostWallet, 
    { 
      token: session_manager.getToken(req),
      id: id,
    }, 
    function(result) {
      if (result.status != response.status.success) {
        res.render( 'error', {message: "Ops. Something when wrong."});
        return;
      }

      var session_information = session_manager.getTotalInformation(req);

      result.data.host.available_money = validate_data.standardMoney(result.data.host.available_money);
      result.data.borrowed_money = validate_data.standardMoney(result.data.borrowed_money);
      result.data.borrowing_money = validate_data.standardMoney(result.data.borrowing_money);

      res.render( 'manage_wallet_borrower', 
        { 
          id: id,
          session: session_information,
          result: result.data 
        }
      );
    }, 
    function(error) {
      // //for test

      // var session_information = session_manager.getTotalInformation(req);

      // var host = JSON.parse(JSON.stringify(model.host));

      // result = {host: host, borrowed_money: 12, borrowing_money: 14};

      // result.host.available_money = validate_data.standardMoney(host.available_money);
      // result.host.next_interest_money = validate_data.standardMoney(host.next_interest_money);
      // result.borrowed_money = validate_data.standardMoney(result.borrowed_money);
      // result.borrowing_money = validate_data.standardMoney(result.borrowing_money);
      
      // res.render( 'manage_wallet_borrower', 
      //   { 
      //     id: id,
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
router.post('/getRegisteredLoan', function (req, res) {
  var id = req.body.id;

  if (typeof id !== "string")     response.returnWrongPOST(res);

  config.templatePostFunction(  
    config.command.getRegisteredLoan, 
    {token: session_manager.getToken(req), id: id}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // for test
      // var result = {status: response.status.success, data: [model.loan]};
      // response.returnFormPOST(res, result);

      response.returnErrorConnect(res);
    }
  );
});

/* GET registed loan. */
router.post('/deleteLoan', function (req, res) {
  var id = req.body.id;

  if (typeof id !== "string")     response.returnWrongPOST(res);

  config.templatePostFunction(  
    config.command.deleteLoan, 
    {token: session_manager.getToken(req), id: id}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // for test
      // var result = {status: response.status.success, data: {}};
      // response.returnFormPOST(res, result);

      response.returnErrorConnect(res);
    }
  );
});

/* GET on-going loan. */
router.post('/getOnGoingLoan', function (req, res) {
  var id = req.body.id;

  if (typeof id !== "string")     response.returnWrongPOST(res);

  config.templatePostFunction(  
    config.command.getOnGoingLoan, 
    {token: session_manager.getToken(req), id: id}, 
    function(result) {
      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: [model.on_going_lend, model.on_going_lend]};
      // response.returnFormPOST(res, result);

      response.returnErrorConnect(res);
    }
  );
});

/* pay for interest */

router.post('/payInterestLoan', function (req, res) {
  var id = req.body.id;

  if (typeof id !== "string")     response.returnWrongPOST(res);

  config.templatePostFunction(  
    config.command.payInterestForLoan, 
    {token: session_manager.getToken(req), id: id}, 
    function(result) {
      if (result.status == "not need") {
        return response.returnByType(req, res, "not need");
      } else if (result.status == "not enough money") {
        return response.returnByType(req, res, "not enough money");
      }

      response.returnFormPOST(res, result);
    },
    function(error) {
      // // for test
      // var result = {status: response.status.success, data: [model.on_going_lend, model.on_going_lend]};
      // response.returnFormPOST(res, result);

      response.returnErrorConnect(res);
    }
  );
});


/* GET completed loan. */
router.post('/getCompletedLoan', function (req, res) {
  var id = req.body.id;

  if (typeof id !== "string")     response.returnWrongPOST(res);

  config.templatePostFunction(  
    config.command.getCompletedLoan, 
    {token: session_manager.getToken(req), id: id}, 
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
  var id = req.body.id;

  if (typeof id !== "string")     response.returnWrongPOST(res);

  var money = req.body.money;

  if (money == 0 || money == undefined || money % 10000 > 0) {
    response.returnWrongPOST(res);
    return;
  }

  // TODO call to payment system.

  // TEMP: add direct:

  config.templatePostFunction(  
    config.command.addToWalletHost, 
    {
      token: session_manager.getToken(req),
      money: money/1000000,
      id: id,
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
  var id = req.body.id;

  if (typeof id !== "string")     response.returnWrongPOST(res);

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
    config.command.requestWithDrawHost, 
    {
      token: session_manager.getToken(req),
      id: id,
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