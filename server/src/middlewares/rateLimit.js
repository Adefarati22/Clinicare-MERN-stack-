import {rateLimit, ipKeyGenerator} from "express-rate-limit"

// general rate limit for authentication endpoints
export const rateLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, //1 min
    max: 5, //attempts within a 2 min window
    message: "Too many requests, please try again later",
    standardHeaders: true, //return rate limit info in the headers so it can be seen on the client side
    keyGenerator: (req)=> {
        // use ip address + user agent to identify unique clients
        return `${ipKeyGenerator (req.ip)}-${req.headers["user-agent"] || "unknown-user-agent"}`
    },
    legacyHeaders: false, //disable x-RateLimit headers
    trustProxy: true, //trust the x-Forwarded-For header
});

// rate limit for refresh token endpoint
export const refreshTokenLimit = rateLimit({
     windowMs: 15 * 60 * 1000, //1 min
    max: 30, //attempts within a 1 min window
    message: "Too many requests, please try again later",
    standardHeaders: true, //return rate limit info in the headers so it can be seen on the client side
    keyGenerator: (req)=> {
        // use ip address + user agent to identify unique clients
        return `${ipKeyGenerator(req.ip)}-${req.headers["user-agent"] || "unknown-user-agent"}`
    },
    legacyHeaders: false, //disable x-RateLimit headers
    trustProxy: true, //trust the x-Forwarded-For header
})