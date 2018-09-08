var express = require('express');
var router = express.Router();
var session_manager = require('./session/session_manager');
var response = require('./tools/response');
var validate_data = require('./tools/validate_data');
var auth = require('../connection/auth');
var config = require('../connection/config');
var model = require('../model/model');

/* GET home page. */
router.get('/', function(req, res){
  config.templatePostFunction(  
    config.command.getHomeInformation, 
    {}, 
    function(result) {
      if (result.status != response.status.success) {        
        response.returnErrorGetPage(res);
        return;
      }

      var session_information = session_manager.getTotalInformation(req);
      result.data.list_investors.forEach(investor => {
        investor.lended_money = validate_data.standardMoney(investor.lended_money);
        if (investor.avatar == undefined ||investor.avatar.length == 0) {
          investor.avatar = "img/icon/icons-user.png";
        }
      }); 
      result.data.list_loans.forEach(loan => {
        loan.money = validate_data.standardMoney(loan.money);
        if (loan.avatar == undefined ||loan.avatar.length == 0) {
          loan.avatar = "img/demo/homestay.jpg";
        }
      }); 

      res.render( 'index', { 
                            session: session_information,
                            result: result.data 
                           }
                );
    }, 
    function(error) {

      // for test
      // var session_information = session_manager.getTotalInformation(req);

      // var list_investors = [model.investor];
        
      // var list_loans =  [model.loan,model.loan,model.loan,model.loan,model.loan,model.loan,model.loan,model.loan,model.loan];  

      // result = {total_money: 13.8989, total_borrower: 12, total_investor: 4, total_transaction: 4, list_investors: list_investors, list_loans: list_loans};
      
      // result.list_investors.forEach(investor => {
      //   investor.lended_money = validate_data.standardMoney(investor.lended_money);
      // }); 

      // res.render( 'index', { session: session_information,
      //     result: result, 
      //   }
      // );
      response.returnErrorGetPage(res);
    }
  );
});

/* GET log out */
router.get('/logout', function(req, res) {
  session_manager.logout(req);
  res.redirect("/");
});

/* POST sign in. */
router.post('/signIn', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  auth.checkLogin ( 
    email, 
    password, 
    function(result) { 
      
      if (result.status == response.status.success) {
        let data = result.data;

        session_manager.createSession(req, data);
        response.returnSucessPOST(res);
      } else {
        response.returnWrongPOST(res);
      }
    }, 
    function(error) {

      // // for test
      // var result = { status: response.status.success, data: model.response_auth }; 
      
      // let data = result.data;

      // session_manager.createSession(req, data);
      // response.returnSucessPOST(res);

      response.returnErrorConnect(res);
      
    },
  );
});

/* POST sign up. */
router.post('/signUp', function(req, res) {
  var name = req.body.name;  
  var email = req.body.email;
  var password = req.body.password;

  auth.createAccount ( 
    name,
    email, 
    password, 
    function(result) { 
      if (result.status == response.status.success) {
        let data = result.data;
        
        session_manager.createSession(req, data);
        response.returnSucessPOST(res);
      } else {
        response.returnWrongPOST(res);
      }
    }, 
    function(error) {

      // // for test
      // var result = { status: response.status.success, data: model.response_auth }; 
      // response.returnFormPOST(res, result);

      response.returnErrorConnect(res);
    },
  );
});

module.exports = router;
