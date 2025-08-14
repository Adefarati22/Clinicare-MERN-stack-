import responseHandler from "../utils/responseHandler.js";
const { errorResponse } = responseHandler;

// error handler for dev environment. (development mode is when we code while production mode is when we host)
const sendErrorDev = (err, res) => {
  const errResponse = {
    status: err.status || "error",
    message: err.message,
    stack: err.stack, //its like a trace, for examole when you have a bug and your code breaks and the console helps you trace it back
    error: {
      name: err.name,
      statusCode: err.statusCode,
      isOperational: err.isOperational,
    },
  };
  console.error("ERROR", err);
  res.status(err.statusCode || 500).json(errResponse);
};

// error handler for production environment
const sendErrorProd = (err, res) => {
  //if operational is set to true, then we send a msg to the client
  if (err.isOperational) {
   const errResponse = {
    status: err.status || "error",
    message: err.message,
   };
   return res.status(err.statusCode || 500).json(errResponse);
  }
  //   programming errors for unknown errors: don't leak errors to client
  console.error("ERROR", err);
  return res.statusCode(err.statusCode).json({
    status: "error",
    message: "Something went wrong",
  });
};

// handle jwt (json web token) errors
const handleJWTError = () => {
  return errorResponse("Invalid token. Please log in again", 401);
};
const handleJWTExpiredError = () => {
  return errorResponse("Your token has expired! please login again", 401);
};

// Main error handler for our index file middleware
export const globalErrorHandler = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.status = err.status || "error");
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, message: err.message, name: err.name };
    if (error.name === "JsonWebTokenError") error = handleJWTError(); // if its showing this error then run handleJWTError function
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};

// catch 404 error routes
export const catchNotFound = (req, res) => {
  errorResponse(
    `can't find ${req.originalUrl} on this server!`,
    404
  );
};
