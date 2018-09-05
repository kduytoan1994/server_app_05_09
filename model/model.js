var loan = {   
  id: "1",  
  avatar: "img/demo/homestay.jpg", 
  name: "A Vien Homestay", 
  address: "Ha Noi", 
  type: "Normal", 
  description: "Very beautiful home stay in SP",
  money: 90,
  called: 70, 
  due_date: "20/12/2018", 
  range_time: 5, 
  interest: 5,
  list_photos: ["img/demo/homestay.jpg", "img/demo/homestay2.jpg"],
};

var investor = {
  name: "Nguyen Huy Hoang",
  lended_money: 100, 
  avatar: "img/demo/avatar.jpg",
};
var homestay = {
  id: "1",  
  name: "A Vien Homestay", 
  address: "A Vien Homestay", 
  type: "Normal Homestay", 
  description: "Very beautiful home stay in SP",
  list_photos: ["img/demo/homestay.jpg"],
  host_name: "Nguyen Manh Duy", 
  host_address: "Ha Noi", 
  phonenumber: "0986303495",
};
var package = {
  id: "1",
  money: 26, 
  chosen: 1,
};
var unchosen_package = {
  id: "1",
  money: 26, 
  chosen: 0,
};
var interest = {
  id_lend: "1",
  date: "20/10/2012",
  money: 12,
  status: 2,
};
var host = {
  id: "1",
  name: "Nguyen Manh Duy",
  avatar: "img/demo/avatar.jpg",
  email: "kevin@gmail.com",
  available_money: 12,
  next_interest_date: "20/12/2012", 
  next_interest_money: 1,
  phone_number: "0984",
  address: "Ha Giang",
  number_registered_loan: 2, 
  number_current_loan:1,
  number_completed_loan:5,
  total_debt_money: 13,
};
var response_auth = {
  token: "1232132131312",
  ttl: 86400,
  name: "Duy",
  type: 1,
  userId: "1",
};
var register_lend = {
  loan: loan,
  total_my_chosen_money: 12,
  list_packages: [package],
  interst: 5,
};
var register_loan = {
  loan: loan,
  list_packages: [package],
  called: 50,
};
var on_going_lend = {
  loan: loan,
  total_lend_money: 12,
  interest: 4,
  start_time: "12/1/2018",
  end_time: "12/2/2018",
  total_money_will_receive: 14,
  total_money_received: 4,
  next_interest_money: 1,
  next_interest_date: "20/12/2017",
  list_interest: [interest],
};
var completed_lend = {
  loan: loan,
  total_lend_money: 12,
  interest: 5,
  start_time: "20/12/2012",
  end_time: "20/3/2013",
  total_money_received: 14,
  list_interest: [interest, interest],
};
var withdraw = {
  money: 1,
  name_bank: "Vietcombank",
  bank_branch: "Cau Giay",
  account_number: "12321212311131",
  name_receiver: "NGUYEN MANH DUY",
};

module.exports.loan = loan;  
module.exports.investor = investor;  
module.exports.withdraw = withdraw;  
module.exports.completed_lend = completed_lend;  
module.exports.on_going_lend = on_going_lend;  
module.exports.register_lend = register_lend;  
module.exports.register_loan = register_loan;  
module.exports.homestay = homestay;  
module.exports.package = package;  
module.exports.unchosen_package = unchosen_package;  
module.exports.interest = interest;  
module.exports.host = host;  
module.exports.response_auth = response_auth;  


