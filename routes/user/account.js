var session_manager = require('../session/session_manager');
var auth = require('../../connection/auth');
var response = require('../tools/response');

module.exports = {  
  signup: function(req, res, email, name, password) {
    auth.createAccount ( 
      name,
      email, 
      password, 
      function(result) { 
        let data = result.data;

        if (data && data.token) {
          session_manager.createSession(req, data);
          response.returnSucessPOST(res);
        } else {
          response.returnWrongPOST(res);
        }
      }, 
      function(error) {
        response.returnWrongPOST(res);
      },
    );

    if (res && res.id) {
      session_manager.createSession(req, res);

      return true;
    }

    return false;
  },
};