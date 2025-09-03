import userService from "../services/user.service.js";
import tryCatchFn from "../utils/tryCatchFn.js";
import { createSendToken } from "../utils/token.js";
import responseHandler from "../utils/responseHandler.js";
const { successResponse } = responseHandler;

export const register = tryCatchFn(async (req, res, next) => {
  // req.body handles form collection from the client
  // req.validatedData is the data that has passed zod's validation received from the req.body
  const user = await userService.register(req.body, next);
  // handle accessToken generation - we send the user to our createSendToken which extracts the id for jwt to sign
  if (!user) return;
  const { accessToken, refreshToken, cookieOptions } = createSendToken(user);
  //send the cookie, refreshToken is the value we want to save
  res.cookie("userRefreshToken", refreshToken, cookieOptions);
  return successResponse(res, { accessToken }, "Registration successful", 201);
});

export const login = tryCatchFn(async (req, res, next) => {
  const user = await userService.login(req.body, next);
  if (!user) return;
  const { accessToken, refreshToken, cookieOptions } = createSendToken(user);
  res.cookie("userRefreshToken", refreshToken, cookieOptions);
  return successResponse(res, { accessToken }, "Login successful", 200);
  // next go and form the route
});

export const authenticateUser = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user; //extract user id from the request.user - we are just giving the id a new name of userId
  const user = await userService.authenticateUser(userId, next);
  return successResponse(res, user, "User authenticated", 200);
});

// export const logoutUser = tryCatchFn(async (req, res, next) => {
//   const user = await userService.logoutUser(req, res, next);
//   if (!user) return;
//   return successResponse(res, user, "Logged out successfully", 200);
// });

export const refreshAccessToken = tryCatchFn(async (req, res, next) => {
  // get the refreshToken from the cookie and send to our userService
  const refreshToken = req.cookies?.userRefreshToken;
  const user = await userService.refreshAccessToken(refreshToken, next);
  if (!user) return;
  const tokenData = createSendToken(user);
  if (!tokenData) return;
  const { accessToken } = tokenData;
  return successResponse(
    res,
    { accessToken },
    "AccessToken refreshed successfully",
    200
  );
});

export const verifyUserAccount = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user; //extract userId from the request.user
  const data = await userService.verifyUserAccount(
    { userId, ...req.body },
    next
  );
  if (!data) return;
  return successResponse(res, data, "Account verified successfully", 200);
});

export const resendVerificationToken = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user; //extract userId from the request.user
  const user = await userService.resendVerificationToken(userId, next);
  if (!user) return;
  return successResponse(
    res,
    null,
    "Verification token has been sent to your email",
    200
  );
});

export const forgotPassword = tryCatchFn(async (req, res, next) => {
  const user = await userService.forgotPassword(req.body, next);
  if (!user) return;
  return successResponse(
    res,
    null,
    "Password reset link has been sent to your email",
    200
  );
});

export const resetPassword = tryCatchFn(async (req, res, next) => {
  const email = req.query.email || "";
  const passwordResetToken = req.query.token || "";
  const responseData = await userService.resetPassword(
    { ...req.body, email, passwordResetToken },
    next
  );
  if (!responseData) return;
  return successResponse(res, null, "Password reset successfully", 200);
});

export const logout = tryCatchFn(async (req, res, next) => {
  const responseData = await userService.logout(req, res, next);
  if (!responseData) return;
  return successResponse(res, responseData, "Logged out successfully", 200);
});

export const uploadAvatar = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  console.log("ee", req.body);
  const user = await userService.uploadAvatar(userId, req.body.avatar, next);
  return successResponse(res, user, "Image uploaded successfully", 200);
});

export const updateUserPassword = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await userService.updateUserPassword(
    userId,
    req.body,
    next
  );
  return successResponse(
    res,
    responseData,
    "User password updated successfully",
    200
  );
});

export const updateUser = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user;
  const responseData = await userService.updateUser(userId, req.body, next);
  if (!responseData) return;
  return successResponse(
    res,
    responseData,
    "Profile updated successfully",
    200
  );
});

export const deleteAccount = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.user; //req.user is used to get the already logged in user like if the user wants to delete their account
  const responseData = await userService.deleteAccount(userId, next);
  return successResponse(
    res,
    responseData,
    "User account deleted successfully",
    200
  );
});


export const getAllUsers = tryCatchFn(async (req, res, next) => {
  const { page, limit, query, role, sort } = req.query;
  const responseData = await userService.getAllUsers(
    parseInt(page),
    parseInt(limit),
    query,
    role,
    sort,
    next
  );
  return successResponse(res, responseData, "Users data fetched successfully", 200);
});

export const deleteAccountAdmins = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.params; //req.params is used to delete multiple user not minding if they are already logged in or not - it is going to be params because it takes a parameter value which is userid of what we are deleting, it is dynamic
  const responseData = await userService.deleteAccountAdmins(userId, next);
  return successResponse(
    res,
    responseData,
    "User account deleted successfully",
    200
  );
});

export const updateUserRole = tryCatchFn(async (req, res, next) => {
  const { id: userId } = req.params;
  const responseData = await userService.updateUserRole(userId, req.body, next);
  if(!responseData) return
  return successResponse(res, responseData, "User updated successfully", 200);
});

export const createUserAdmins = tryCatchFn(async (req, res, next) => {
  const user = await userService.createUserAdmins(req.body, next);
  if (!user) return;
  return successResponse(res, user.fullname, "User created successfully", 201);
});