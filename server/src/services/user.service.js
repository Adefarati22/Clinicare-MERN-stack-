import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import mailService from "./email.service.js";
import responseHandler from "../utils/responseHandler.js";
import jwt from "jsonwebtoken";
const { errorResponse, notFoundResponse } = responseHandler;

// here we interact the model we are going created

const userService = {
  // we going to hold the data sent from the frontend signup form to the prop name userData, next is a type of middleware used to call or trigger the global error response if an error occurs, the next is not just for error handling it like our return in frontend, check google
  register: async (userData, next) => {
    // check if email already exists, by looking at the database model because its the model that hold the database, findOne method is used to find one document that matches the parameter or argument being passed
    const emailExists = await User.findOne({ email: userData.email });
    if (emailExists) {
      return next(errorResponse("Email already exist", 400));
    }
    // if after checking if the email exist and its false, then we can  its fresh new userData-email, then we proceed to  creating our user
    // handle VerificationCode to be sent to user email
    const verificationCode = crypto.randomInt(100000, 999999).toString(); //this will give us six random numbers because the digits are in total 6, the max numbers contain 6 in total so as the min
    // here we are going to use crypto to generate random sequencetial digits, the first number represent the minimum number and the 2nd is for the max number, if you want to add letters then you will have to add the floor and math method
    const verificationCodeExpiry = new Date(Date.now() + 3600000); //1hr to expire

    // handle password encryption - to encrypt your password for people to be unable to see and hack the password
    const salt = await bcrypt.genSalt(10); //degree of encryption
    const hashPassword = await bcrypt.hash(userData.password, salt);
    // proceed to creating our user
    const user = await User.create({
      ...userData, //this includes all our userdata
      password: hashPassword,
      verificationToken: verificationCode,
      verificationTokenExpiry: verificationCodeExpiry,
      // anything that we don't want to send to our database then you don't include it here
    });
    // proceed to sending email to user
    // we are going to use the process from node process.nextTick - this allows us to not block synchronous operations - the api response won't wait for the email to be sent, even if email fails it won't affect the creation of the user.
    process.nextTick(() => {
      mailService.sendWelcomeMail(user).catch(console.error); //catch email sending error
    });

    // if user could not be registered, then we send a server error
    if (!user) {
      return next(errorResponse("User registration failed"));
    }
    return user; //send user to our controller
  },
  //   login user, process for login the user
  login: async (userData, next) => {
    // find our user with email from the form - select is for we want to reveal the password we hid on the client side to be true or seen on the server side
    const user = await User.findOne({ email: userData.email }).select(
      "+password"
    );
    // select includes the field we want to have access to, in this case the password
    if (!user) {
      return next(errorResponse("Account not found", 401));
    }
    // handle password - to check if your password is correct by using bcrypt to decode it
    const isPasswordCorrect = await bcrypt.compare(
      userData.password,
      user.password
    );
    // userData.password is for the form, while user.password is the password saved about the user in the database
    if (!isPasswordCorrect) {
      return next(errorResponse("Incorrect email or password", 401));
    }
    return user;
  },
  authenticateUser: async (userId, next) => {
    // get userId from our jwt decoded token
    const user = await User.findById(userId);
    if (!user) {
      return next(notFoundResponse("User not found"));
    }
    return user;
  },
  // logoutUser: async (req, res, next) => {
  //   // reset the cookie maxAge value - userRefreshToken is the name we gave our cookie at the userController
  //   res.cookie("userRefreshToken", "", {
  //     maxAge: 0,
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //     sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  //     path: "/",
  //   });
  //   return true;
  // },
  // get a new accessToken when current one expires
  refreshAccessToken: async (refreshToken, next) => {
    if (!refreshToken) {
      return next(errorResponse("Refresh token is required", 401));
    }
    // verify the refresh token - each time we need to verify the token to check if its valid we need our secret key to decode it
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return next(errorResponse("Invalid refresh token", 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(notFoundResponse("User not found"));
    }
    return user; //return user to our controller to generate a new accessToken
  },
  verifyUserAccount: async (data, next) => {
    // this function is used to verify the user account after registration - you need to be login and must provide the verification code sent to your email
    // we will get the userId from the decoded token, then we will find the user using the verification code sent to the user email to verify the account
    //destructure the data
    const { userId, verificationToken } = data;
    // find our user with the userId and get the verificationToken/Expiry saved to the user
    const user = await User.findById(userId).select(
      "+verificationToken +verificationTokenExpiry"
    ); //remember  use the select method for the verificationToken and verificationTokenExpiry because we want to access them
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    // check if user is already verified - isVerified is a boolean field in our user model
    if (user.isVerified) {
      return next(errorResponse("Account is already verified", 400));
    }
    // check if verificationToken saved in the db is the same as the one sent to the user email from the form
    if (user.verificationToken !== verificationToken) {
      return next(errorResponse("Invalid verification token", 400));
    }
    // check for token expiry
    if (user.verificationTokenExpiry < new Date()) {
      user.verificationToken = undefined; // reset the verificationToken
      user.verificationTokenExpiry = undefined; // reset the verificationTokenExpiry
      await user.save(); // save the changes to the user
      return next(
        errorResponse(
          "verification token has expired, please request a new one",
          400
        )
      );
    }
    // verify user if token has not expired
    user.isVerified = true; // set the isVerified to true
    user.verificationToken = undefined; // we default them back to undefined so that they won't be able to use the same token again and since the verificationToken is not needed anymore bcs the user is verified
    user.verificationTokenExpiry = undefined;
    await user.save();
    return user; // return the user to our controller
  },
  resendVerificationToken: async (userId, next) => {
    const user = await User.findById(userId).select(
      "+verificationToken +verificationTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    if (user.isVerified) {
      return next(errorResponse("Account is already verified"));
    }
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpiry = new Date(Date.now() + 3600000); //1 hr to expire
    user.verificationToken = verificationCode;
    user.verificationTokenExpiry = verificationCodeExpiry;
    await user.save();
    // send verification email to user
    process.nextTick(() => {
      mailService.sendVerificationCode(user).catch(async (error) => {
        //if email sending fails, reset the verificationToken and verificationTokenExpiry
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();
        console.error("Failed to send verification token", error);
      });
    });
    return user;
  },
  forgotPassword: async (userData, next) => {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return next(notFoundResponse("Account not found"));
    }
    //generate reset code
    const resetCode = crypto.randomInt(100000, 999999).toString();
    const resetCodeExpiry = new Date(Date.now() + 900000); //15mins
    user.passwordResetToken = resetCode;
    user.passwordResetTokenExpiry = resetCodeExpiry;
    await user.save();
    process.nextTick(() => {
      mailService.sendPasswordResetEmail(user).catch(async (error) => {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;
        await user.save();
        console.error("Failed to send password token", error);
      });
    });
    return user;
  },
  resetPassword: async (userData, next) => {
    const { email, password, confirmPassword, passwordResetToken } = userData;
    if (password !== confirmPassword) {
      return next(errorResponse("Passwords do not match", 400));
    }
    const user = await User.findOne({ email }).select(
      "+password +passwordResetToken +passwordResetTokenExpiry"
    );
    if (!user) {
      return next(notFoundResponse("Account not found with that email"));
    }
    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== passwordResetToken
    ) {
      return next(errorResponse("Password reset token not found", 400));
    }
    const isPasswordSame = await bcrypt.compare(password, user.password);
    if (isPasswordSame) {
      return next(
        errorResponse("New password must be different from old password", 400)
      );
    }
    if (user.passwordResetTokenExpiry < new Date()) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
      await user.save();
      return next(errorResponse("Password reset token has expired", 400));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();
    return user;
  },
  logout: async(req, res, next)=> {
    res.cookie("userRefreshToken", "",  {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/v1/auth/refresh-token",
    });
    return true;
  }, //for clearing the cookie during logout, bcs our cookie contains our refresh token, we don't want to make our cookie to be seen every where only on the specified path
};

export default userService;
