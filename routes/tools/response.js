module.exports = {
  error: {need_login: -500, need_permission: -400, wrong_post: -300, error_connect_server: -200, error_not_enough_money: -100 },
  success: {ok: 200},
  status: {success: "success", fail: "fail"},

  returnFormPOST: function(res, result) {
    if (result.status == this.status.success) {
      res.send({status: this.success.ok, data: result.data});
    } else {
      this.returnWrongPOST(res);
    }
  },

  returnSucessPOST: function(res) {
    res.send({status: this.success.ok});
  },

  returnNeedSignInPOST: function(res) {
    res.send({status: this.error.need_login});
  },

  returnNeedPermissionPOST: function(res) {
    res.send({status: this.error.need_permission});
  },

  returnWrongGET: function(res) {
    res.redirect("/");
  },

  returnWrongPOST: function(res) {
    res.send({status: this.error.wrong_post});
  },

  returnErrorConnect: function(res) {
    res.send({status: this.error.error_connect_server});
  },

  returnErrorNotMoney: function(res) {
    res.send({status: this.error.error_not_enough_money});
  },

  returnByType: function(req, res, message) {
    if (req.method == "POST") {
      res.send({status: message});
    } else {
      this.returnWrongGET(res);
    }
  },

  returnErrorGetPage: function(res) {
    res.render( 'error', {message: "Ops. Something when wrong."});
  }
}