// we want to construct or customize our error from js default error constructor which is the Error in this example
// we want to use the default error that exist in js and reconstruct it to our own message and format
// (this) is referencing the status in this example

// classes are like templates for creating js objects. they can inherit existing prototypes of objects. They usually get initialized with a constructor.
// A constructor is a method for creating and initializing an object instance of a class, while the super keyword is used to call and invoke the parent class which gives it access to its properties and methods
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message); // invokes the message that will be passed
    this.statusCode = statusCode; // reference our statusCode received from the Error constructor
    this.status = `${statusCode}.startsWith("4") ? "fail" : "error"`; //we want to determine the error type, if it starts with 4, then we assign a status of fail, otherwise we assign a status of error
    this.success = false; //we default to false in this case because we are handling errors
    this.isOperational = true // to distinguish btw operation errors, such as server shutdown, validation errors, authentication error while programmer errors should not be sent to the client- bugs, syntax error,type errors (if its false then it form our side but if its true its from the server)
  }
}

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; //status code to be sent
    this.data = data; //api data to be sent to the client
    this.message = message; // custom msg to be passed if we don't  pass a message it will show the success message by default
    this.success = statusCode < 400; //auto sets success to true for statusCode less than 400
  }
}

// res.status(200 or any statusCode).json{{ success : true, message: success }} instead of this which we have to do over again for any api call we want to do, we decide to create a function to handle api response, so it will be handled automatically instead of write it over again and edit it based on on the error we want it to show.
//  message = "An error occurred",
//   statusCode = 500, for example if we don't edit it the default message will be 500
//   data = null, all this are static message that can change when we doing our api call, if we want to

const sendResponse = (res, statusCode, data = null, message = null) => {
  const response = new ApiResponse(statusCode, data, message);
  return res.status(statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
};

const successResponse = (
  res,
  data,
  message = "Request successful",
  statusCode = 200
) => {
  return sendResponse(res, statusCode, data, message);
};
const errorResponse = (
  message = "An error occurred",
  statusCode = 500,
  data = null
) => {
  return new AppError(message, statusCode, data);
};

const notFoundResponse = (message = "Resource not found") => {
    return errorResponse(message, 404);
};

const unauthorizedResponse = (message = "Unauthorized") => {
    return errorResponse(message, 401);
}

const forbiddenResponse = (message = "Forbidden") => {
    return errorResponse(message, 403);
} // you are logged in and you are trying to perform roles that you are not allowed to, like a user trying to perform an admin role

export default {
    ApiResponse,
    sendResponse,
    successResponse,
    errorResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse
}
