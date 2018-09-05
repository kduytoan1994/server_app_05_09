var auth = require('../../connection/auth');
var response = require('../tools/response');
var url = require("url");

module.exports = {

  INVESTOR: 2,
  AGENCY: 1,
  ADMIN: 0,
  
  logout: function(req) {
    if (req.session) {
      req.session.destroy();
    }
  },

  getPermission: function(req) {
    return (req.session.permission);
  },

  getName: function(req) {
    return (req.session.name);
  },

  getToken: function(req) {
    return (req.session.token);
  },

  getLoginStatus: function(req) {
    return (req.session !== undefined && req.session.token !== undefined && req.session.token != null && req.session.token != "");
  },

  getTotalInformation: function(req) {
    return {
      INVESTOR: this.INVESTOR, 
      AGENCY: this.AGENCY, 
      ADMIN: this.ADMIN, 
      login_status: this.getLoginStatus(req), 
      permission: this.getPermission(req), 
      name: this.getName(req),
    };
  },

  createSession: function(req, data) {
    req.session.name = data.name;
    req.session.permission = data.type;
    req.session.token = data.token;
    req.session.userId = data.userId;
  },
};