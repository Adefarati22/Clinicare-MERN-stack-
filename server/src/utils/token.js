import jwt from "jsonwebtoken";

export const signToken = (id) => {
    const accessToken = jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
    });
    const refreshToken = jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
    });
    return {accessToken, refreshToken};
};

export const createSendToken = (user) => {
    if(!user) return; //making sure we have a user
    const token = signToken(user._id) //this is from mongodb id doc
    //create cookie to store our refresh token in order to prevent browser access on client side, first we need to install the cookie package from npmjs
    const isProduction = process.env.NODE_ENV === "production"
    const cookieOptions = {
        httpOnly: true, //cookie is not accessible in js
        secure: isProduction, //sends cookie over HTTPS only when in production mode or environment
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie valid for 7days
        path: "/api/v1/auth/refresh-token", //cookie valid only on this path across your domain, we can also specify other point at which we want the cookie to be valid
        sameSite: isProduction ? "none" : "lax"  //is required when the cookie is being used on diff domains. we want to adjust the cross-site request policy. Our app is both client/server  which has 2 diff address or domains so we want to ensures that in production mode the cookie can be passed over a secure relay by setting the secure option to be true (ensuring cookie is sent over HTTPS), but in dev mode we specify lax because we need to use it locally. if sameSit is set to none and secure is set to false, the browser will reject the cookie
    };
    return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        cookieOptions,
    };
};