const axios = require('axios');

module.exports = {
  server_link: "http://107.113.186.155:8008/api/",
  proxy: "107.113.186.155",
  host: "8008",
  command:  { login: "login",
              register: "register",
              checkToken: "checkToken",

              getHomeInformation: "informationHome",
              getHomestay: "loan/homestay",
              getLoanInformation: "loan/fullInformation",
              getPackageInformation: "loan/packages",

              getListHost: "host/listHost",
              getHostInformation: "host/getHost",
              addNewHost: "host/addHost",

              getHostWallet: "wallet/getWalletHost",
              getRegisteredLoan: "wallet/getListRegisteredLoan",
              deleteLoan: "loan/deleteLoan",
              getOnGoingLoan: "wallet/getListOnGoingLoan",
              getCompletedLoan: "wallet/getListCompletedLoan",
              payInterestForLoan: "loan/interestPay",

              getTableInterest: "loan/getTableInterest",
              calculatePackage: "loan/calculatePackage",
              addLoan: "loan/addLoan",
              getListLoan: "loan/listLoan",

              getBalanceInvestor: "wallet/getBalanceInvestor",
              submitPurchaseLend: "lend/submitLend",

              getInvestorWallet: "wallet/getWalletInvestor",
              getRegisteredLend: "wallet/getListRegisteredLend",
              getOnGoingLend: "wallet/getListOnGoingLend",
              getCompletedLend: "wallet/getListCompletedLend",

              requestWithDrawInvestor: "wallet/withdraw/investor",
              requestWithDrawHost: "wallet/withdraw/host",
              addToWalletInvestor: "wallet/addToWallet/investor",
              addToWalletHost: "wallet/addToWallet/host",
              
            },

  templateGetFunction: function(command, param, success, fail) {
    axios({
      method: 'GET',
      url: this.server_link + command,

      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      param: param,
      withCredentials: true,
      timeout: 1000,
    })  
    .then(function(response) {
      success(response);
    })
    .catch(function (error) {
      fail(error);
    });
  },

  templatePostFunction: function(command, data, success, fail) {
    axios({
      method: 'POST',
      url: this.server_link + command,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      credentials: 'same-origin',
      data: data,
      timeout: 2000,      
    })  
    .then(function(result) {
      console.log(result.data);      
      success(result.data);
    })
    .catch(function (error) {
      console.log(error);
      fail(error);
    });
  },
}