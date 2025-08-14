import express from "express";
import {
  register,
  login,
  authenticateUser,
  // logoutUser,
  refreshAccessToken,
  verifyUserAccount,
  resendVerificationToken,
  forgotPassword,
  resetPassword,
  logout
} from "../controller/userController.js";
import { validateFormData } from "../middlewares/validateForm.js";
import {
  validatedSignUpSchema,
  validatedSignInSchema,
  validateAccountSchema,
  forgotPasswordSchema,
  validatedResetSchema,
} from "../utils/dataSchema.js";
import { verifyAuth } from "../middlewares/authenticate.js";
import { rateLimiter, refreshTokenLimit } from "../middlewares/rateLimit.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";

const router = express.Router();
// we didn't want to destructure it so we made it a function
// by default forms are post request
// all form are post method, it here we are to specify the type of method and our endpoint name - before we can register we need to pass a middleware which is th validateFormData
router.post(
  "/create",
  rateLimiter,
  validateFormData(validatedSignUpSchema),
  register
);
// the middleware will be passed b4 the register bcs middlewares are actions you pass b4 the initial action takes place
router.post(
  "/login",
  rateLimiter,
  validateFormData(validatedSignInSchema),
  login
);
// a get request bcs we just want to read back our user
router.get(
  "/user",
  verifyAuth,
  cacheMiddleware("auth_user", 3600),
  authenticateUser
);
// router.post("/logout", verifyAuth, clearCache("auth_user"), logoutUser);
router.post("/refresh-token", refreshTokenLimit, refreshAccessToken);
//patch method is used to update a resource or part of a document - we are updating the user account by verifying it while put is used to update a resource completely
router.patch(
  "/verify-account",
  rateLimiter,
  verifyAuth,
  validateFormData(validateAccountSchema),
  clearCache("auth_user"),
  verifyUserAccount
);
// the rateLimiter is used to limit the number of requests a user can make to the server in a given time period, this is to prevent abuse of the endpoint, verifyAuth is used to check if the user is authenticated or logged in before they can verify their account, validateFormData is used to validate the data sent from the client, clearCache is used to clear the cache for the authenticated user after verification (this are all middlewares), verifyUserAccount is the controller function that handles the verification of the user account
router.post(
  "/resend/verify-token",
  rateLimiter,
  verifyAuth,
  resendVerificationToken
);
// this endpoint is used to resend the verification token to the user, it is a post request - whenever you see verifyAuth it means the user must be authenticated or logged in before they can access the endpoint, resendVerificationToken is the controller function that handles the resending of the verification token to the user

router.post(
  "/forgot-password",
  rateLimiter,
  validateFormData(forgotPasswordSchema),
  forgotPassword
);
//we are not using verifyauth because the user is not logged in

router.patch(
  "/reset-password",
  rateLimiter,
  validateFormData(validatedResetSchema),
  resetPassword
);
//its because we are updating our password thats why its a patch request

router.post("/logout", verifyAuth, clearCache("auth_user"), logout);
//its a post method because we sending back the cookie to the client side so it can be cleared, the reason why our cookies can e sent to the client is because we sent credentials to true and it saved bcs in our client side we set our withCredentials to true, we introduced our verifyAuth so we can clear the cookie for a single user, the verifyAuth is used to identify the user making the request

export default router;
