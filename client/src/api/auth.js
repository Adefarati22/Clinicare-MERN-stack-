import axiosInstances from "@/utils/axiosInstances";
import { headers } from "@/utils/constant";

export const registerUser = async (formData) => {
  return await axiosInstances.post("/auth/create", formData);
};

export const loginUser = async (formData) => {
  return await axiosInstances.post("/auth/login", formData);
};

export const getAuthenticatedUser = async (accessToken) => {
  return await axiosInstances.get("/auth/user", headers(accessToken));
};

export const refreshAccessToken = async () => {
  return await axiosInstances.post("/auth/refresh-token", {
    withCredentials: true, //to allow cookies to be sent with the request or to inject cookie value automatically to the server
  });
};

export const verifyAccount = async ({ verificationToken, accessToken }) => {
  return await axiosInstances.patch(
    "/auth/verify-account",
    { verificationToken }, //we passed this in a curly bracket so it can be seen as the key and the value
    headers(accessToken)
  );
};

export const resendVerificationCode = async (accessToken) => {
  return await axiosInstances.post(
    "/auth/resend/verify-token",
    {},
    headers(accessToken)
  );
};

export const forgotPassword = async (email) => {
  return await axiosInstances.post("/auth/forgot-password", email); //we are not using our headers because we are not logged in yet
};

export const resetPassword = async (userData) => {
  return await axiosInstances.patch(
    `/auth/reset-password?email=${userData.email}&token=${userData.token}`,
    userData
  ); //we are passing the email and token as query parameters that why we are using backtick, the userData contain password and confirmPassword, - this is how we pass data for multiple params
};

export const logout = async (accessToken) => {
  return await axiosInstances.post(
    "/auth/logout",
    {},
    headers(accessToken), //we are passing an empty object as the body because we are not sending any data, the headers function is used to pass the access token to the server
    // the reason why we are passing the accessToken is to clear the cookie for a single user
    {
      withCredentials: true,
    }
  );
};
//when the body of your form is meant to be empty then you pass an empty objects, now because the logout is not meant to have a body that is why its empty and the reason why we have withCredentials is because we want store the cookie on the client side

export const uploadAvatar = async ({ formData, accessToken }) => {
  return await axiosInstances.patch(
    "/auth/upload-avatar",
    formData,
    headers(accessToken)
  );
};

export const updateUserPassword = async ({ userData, accessToken }) => {
  return await axiosInstances.patch(
    "/auth/update-password",
    userData,
    headers(accessToken)
  );
};

//learn when to use a curly bracket, normal how to write the api call

export const updateUserProfile = async ({ userData, accessToken }) => {
  return await axiosInstances.patch(
    "/auth/update-user",
    userData,
    headers(accessToken)
  );
};

export const deleteAccount = async (accessToken) => {
  return await axiosInstances.delete(
    "/auth/delete-account",
    headers(accessToken)
  );
};

export const getAllUsers = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const params = new URLSearchParams(); //js
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (role) params.append("role", role);
  return await axiosInstances.get(
    `/auth/all?${params.toString()}`,
    headers(accessToken)
  );
};

export const deleteAccountAdmins = async ({userId, accessToken}) => {
  return await axiosInstances.delete(
    `/auth/${userId}/delete-account`,
    headers(accessToken)
  );
};

export const updateUserRole = async ({ userId, role, accessToken }) => {
  const response = await axiosInstances.patch(
    `/auth/${userId}/update`,
    role,
    headers(accessToken)
  );
  return response.data;
};

export const createUserAdmins = async ({userData, accessToken}) => {
  return await axiosInstances.post(
    "/auth/create-user",
    userData,
    headers(accessToken)
  );
};