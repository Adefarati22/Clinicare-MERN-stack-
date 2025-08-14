import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/user.js";
import tryCatchFn from "../utils/tryCatchFn.js";
import responseHandler from "../utils/responseHandler.js";
const { forbiddenResponse, unauthorizedResponse } = responseHandler;

export const verifyAuth = tryCatchFn(async (req, res, next) => {
  // check if a token exists - let bcs we are still going to change the value
  let token;
  // checking for our token in the request headers object and ensuring it starts with the Bearer signature word ensuring its jwt type token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(' ')[1]//extract the token or separating the token from the bearer,split will convert it to an array so you have to signify the number position
  }
  if (!token) {
    return next(
      unauthorizedResponse(
        "You are not logged in!, please log in to gain access"
      )
    );
  }
  //   verify the token
  // promisify is used to await a promise from a callback
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
// check if a user exists with our decoded id
const currentUser = await User.findById(decoded.id)
if(!currentUser) {
    return next(unauthorizedResponse("The user belonging to this token no longer exists."));
}
// assign user to our request object
req.user = currentUser;
next(); //pass to the next event
});

// role based authentication
export const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(forbiddenResponse("you do not have permission to perform this action")
    );
    }
    next();
  };
}; //here we are checking if the user role is included in the roles array passed to the middleware function, if not we return a forbidden response indicating that the user does not have permission to perform the action. - this is used to restrict access to certain routes based on user roles.
//the roles argument is spread because it allows us to pass multiple roles/argument as an array to the middleware function without explicitly defining each one as a separate parameter.
