var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
<<<<<<< HEAD
=======
// Trong app.js
var inventoryRouter = require("./routes/inventories");
>>>>>>> 59da6ab0a490567b8d59e52fac75788fd9a327c8

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
//localhost:3000/users
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/roles", require("./routes/roles"));
app.use("/api/v1/products", require("./routes/products"));
app.use("/api/v1/categories", require("./routes/categories"));
app.use("/api/v1/auth", require("./routes/auth"));
<<<<<<< HEAD
app.use("/api/v1/carts", require("./routes/cart"));
app.use("/api/v1/upload", require("./routes/upload"));

const importUsers = require("./utils/importUser");

// Đảm bảo file user.xlsx nằm cùng thư mục với file app.js
importUsers("./user.xlsx");

=======
app.use("/api/v1/inventories", inventoryRouter);

>>>>>>> 59da6ab0a490567b8d59e52fac75788fd9a327c8
mongoose.connect("mongodb://localhost:27017/NNPTUD-C4");
mongoose.connection.on("connected", function () {
  console.log("connected");
});
mongoose.connection.on("disconnected", function () {
  console.log("disconnected");
});
mongoose.connection.on("disconnecting", function () {
  console.log("disconnecting");
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
<<<<<<< HEAD
  res.send(err.message);
=======
  res.render("error");
>>>>>>> 59da6ab0a490567b8d59e52fac75788fd9a327c8
});

module.exports = app;
