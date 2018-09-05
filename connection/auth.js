var config = require('./config');

module.exports = {
  success: 200,

  checkLogin: function(email, password, success, fail) {
    config.templatePostFunction(  config.command.login, 
      {email: email, password: password}, 
      success, 
      fail
    );
  },

  createAccount: function(name, email, password, success, fail) {
    config.templatePostFunction(  config.command.register, 
      {name:name, email: email, password: password}, 
      success, 
      fail
    );
  },

  checkToken: function(token, success, fail) {
    config.templatePostFunction(  config.command.checkToken, 
      {token: token}, 
      success, 
      fail
    );
  },
}