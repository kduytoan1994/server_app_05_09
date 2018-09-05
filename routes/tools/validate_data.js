module.exports = {
  convertStringToNumber: function (number) {
    var i = 1;
    var strResult = "";
    while (number > 0) {
      strResult = (number % 10) + strResult;
      number = Math.floor(number / 10);
      if (i % 3 == 0 && number > 0) {
        strResult = "." + strResult;
      }
      i++;
    }
    return strResult;
  },

  standardMoney : function(money) {
    if (money == 0) return 0;
    if (money=="" || money == null || money == undefined) return 0;
    return this.convertStringToNumber(money * 1000000);
  },

  checkIdGet : function(id) {
    if (id==null || id==undefined || id.length==0)  return false;
    return /^\w+$/.test(id);
  },

  getFullyNumber : function(number) {
    return (number >= 10 ? number+"" : "0"+number);
  },

  isLeapYear : function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
  },

  getDays : function (year, month) {
    return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
  },

  getDaysInMonth : function (date) { 
    return this.getDays(date.getFullYear(), date.getMonth());
  },

  addMonths : function (date, value) {
    var n = date.getDate();
    
    date.setMonth(date.getMonth() + parseInt(value));
    
    date.setDate(Math.min(n, this.getDaysInMonth(date)));

    return date;
  },

  calculateDate : function(dateInput, rangeTime) {
    var dateSplit = dateInput.split("/"); 

    var date = new Date(dateSplit[2], dateSplit[1]-1, dateSplit[0]);

    var nextDate = this.addMonths(date, rangeTime);

    return this.getFullyNumber(nextDate.getDate()) + "/" + this.getFullyNumber(nextDate.getMonth()+1) + "/" + nextDate.getFullYear();
  },
};