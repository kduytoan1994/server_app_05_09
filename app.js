var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var app = express();
var session = require('express-session');
var middleware = require('./routes/middleware/middleware');

app.use(session({
  secret: 'asio lending 02121995',
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(__dirname + '/public/images/icon/home-logo.png'));

app.use('*/vendor', express.static('public/vendor'));
app.use('*/css', express.static('public/stylesheets'));
app.use('*/js', express.static('public/javascripts'));
app.use('*/img', express.static('public/images'));
app.use('*/host_image', express.static('public/uploads/host'));
app.use('*/homestay_image', express.static('public/uploads/homestay'));

// route
var indexRouter = require('./routes/index');
var homestayRouter = require('./routes/loan/homestay');
var loanRouter = require('./routes/loan/loan');
var hostRouter = require('./routes/host/host');
var walletHostRouter = require('./routes/host/wallet');
var addLoanRouter = require('./routes/loan/add');
var filterLendingRouter = require('./routes/loan/filter');
var submitLendingRouter = require('./routes/investor/submit_lending');
var walletInvestorRouter = require('./routes/investor/manage_wallet');


// all
app.use('/', middleware.checkLogin, indexRouter);

// all
app.use('/homestay', homestayRouter);

// all
app.use('/loan',  loanRouter);

// agency
app.use('/host', middleware.needBeAgency, hostRouter);

// agency
app.use('/wallet_host', middleware.needBeAgency, walletHostRouter);

// logged_in
app.use('/filter_lending', middleware.needLogin, filterLendingRouter);

// investor
app.use('/add_loan', middleware.needBeAgency, addLoanRouter);

// investor
app.use('/submit_lending', middleware.needBeInvestor,  submitLendingRouter);

// investor
app.use('/manage_wallet', middleware.needBeInvestor,  walletInvestorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
