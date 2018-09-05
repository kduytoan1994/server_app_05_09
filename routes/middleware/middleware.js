var auth = require('../../connection/auth');
var response = require('../tools/response');
var session_manager = require('../session/session_manager');

module.exports = {
  checkLogin: function(req, res, next) { 
    if (!session_manager.getLoginStatus(req)) {
      return next();
    }

    let checkSuccess = function(result) {
      if (result.status == response.status.success) {
        return next();
      } else {
        session_manager.logout(req);        
        return next();
      }
    }

    auth.checkToken(req.session.token, checkSuccess, next);
  },

  needLogin: function(req, res, next) {    
    if (!session_manager.getLoginStatus(req)) {
      response.returnByType(req, res, response.error.need_login);
      return;      
    }

    let checkSuccess = function(result) {
      if (result.status == response.status.success) {
        return next();
      } else {
        session_manager.logout(req);        
        response.returnByType(req, res, response.error.need_login);
        return;
      }
    }

    let checkFail = function(error) {
      session_manager.logout(req);        
      response.returnByType(req, res, response.error.need_login);
      return;
    }

    auth.checkToken(req.session.token, checkSuccess, checkFail);
  },

  needBeAgency: function(req, res, next) {        
    if (!session_manager.getLoginStatus(req)) {
      response.returnByType(req, res, response.error.need_permission);
      return;      
    }

    let checkSuccess = function(result) {
      if (result.status == response.status.success && session_manager.getPermission(req) == session_manager.AGENCY) {
        return next();
      } else {
        session_manager.logout(req);        
        response.returnByType(req, res, response.error.need_permission);
        return;        
      }
    }

    let checkFail = function(error) {
      session_manager.logout(req);        
      response.returnByType(req, res, response.error.need_permission);
      return;      
    }

    auth.checkToken(req.session.token, checkSuccess, checkFail);
  },

  needBeInvestor: function(req, res, next) {    
    if (!session_manager.getLoginStatus(req)) {
      response.returnByType(req, res, response.error.need_permission);
      return;      
    }

    let checkSuccess = function(result) {
      if (result.status == response.status.success && session_manager.getPermission(req) == session_manager.INVESTOR) {
        return next();
      } else {
        session_manager.logout(req);        
        response.returnByType(req, res, response.error.need_permission);
        return;        
      }
    }

    let checkFail = function(error) {
      session_manager.logout(req);        
      response.returnByType(req, res, response.error.need_permission);
      return;      
    }

    auth.checkToken(req.session.token, checkSuccess, checkFail);
  },
};