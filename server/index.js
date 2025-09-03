import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import {
  globalErrorHandler,
  catchNotFound,
} from "./src/middlewares/errorHandler.js";
import cors from "cors";

//api routes
import userRoutes from "./src/routes/userRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import paymentsRoutes from "./src/routes/paymentRoutes.js";
import inpatientRoutes from "./src/routes/inpatientRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js"

// initialize express app
const app = express();

// middelwares - functions that have access to the req and res obj and can perform any task specified. - execute a piece of code, make changes to the req or res obj, call the next handler function, it basically helps to add and reuse functions across the appRoutes and endpoints. The flow -
// 1 request received by server
// 2 req is passed through each middleware specified
// 3 route handler processes the request
// 4 response is sent back through the middleware
// 5 response is finally sent to the client
// we have route and app middleware, this one that we did will affect all the app, this are the inbuilt middleware from express
app.use(
  cors({
    origin: ["http://localhost:4800", "https://clinicare-esther-client.vercel.app"],
    credentials: true, //to allow cookies to be sent with requests
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], //permitted http methods
    optionsSuccessStatus: 200, //default status
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //log http requests to terminal in dev mode
}
app.use(cookieParser()); //initialize cookie in our app, its a type of middle ware
app.use(express.json({ limit: "25mb" })); //parses request gotten from client side in a body is no greater than 25mb.
//anytime we want sent something to the client side convert it to a json format, that is what the middleware is doing, that before you send your file convert it first, and the limit is saying that our response must not be greater than 25mb in size
app.use(express.urlencoded({ extended: true, limit: "25mb" })); //useful for getting the large form submission in encoded format such as base64 url strings, where we set the content type of the request body
app.disabled("x-powered-by"); // used to disable the tech stack used when sending response to the client, it security if we don't want people to see what we used to build our application

// get request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// test our api route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: req.requestTime,
  });
});

//assemble our api routes
app.use("/api/v1/auth", userRoutes); //anytime we look into the api/v1(version 1, bcs its our first launch)/auth we want to look into userRoutes file, and based on endpoint we have created in will invoke the one we have done in the file
app.use("/api/v1/patients", patientRoutes); //anytime we look into the api/v1(version 1, bcs its our first launch)/patients we want to look into patientRoutes file, and based on endpoint we have created in will invoke the one we have done in the file
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/inpatients", inpatientRoutes);
app.use("/api/v1/dashboard", dashboardRoutes)
// handle route errors
app.use(catchNotFound);

// global error handler
app.use(globalErrorHandler);

// database connection
const connectDb = async () => {
  const connectionOptions = {
    dbName: process.env.MONGODB_DB_NAME, // used to read env file in nodes
    serverSelectionTimeoutMs: 45000, //MAX time to wait for a server to be selected or connected (45secs in ours), if no server selection a timeout error is thrown
    socketTimeoutMs: 5000, //max time (due to inactivity) to wait if we have established connection and there no activity, it is useful to avoid hanging connections
    retryWrites: true, //enables automatic retry of some writes operations like insert or update a document
    retryReads: true, //enables automatic retry of read operations
    maxPoolSize: 50, //max number of connections in the mongodb connection pool that it can take at the same time (so if 100 users make a connection requests it will take the first 50 then come back for the second). helps manage concurrent requests.
    minPoolSize: 1,
  };
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      connectionOptions
    );
    console.log(`👍👌 Mongodb Connected: ${conn.connection.host}`);
    // connection event handlers (to not break connections and to catch connection errors)
    mongoose.connection.on("error", (err) =>
      console.error("❌ Mongodb Connection error", err)
    );
    // console.log is not an error is just to help you know when you have been disconnected
    mongoose.connection.on("disconnected", () =>
      console.log("ℹ️ Mongodb disconnected")
    );
    // handle graceful shutdown, we want to stop our mongodb from running before we shutdown
    const gracefulShutdown = async () => {
      await mongoose.connection.close();
      console.log("ℹ️ Mongodb connection closed through app termination");
      process.exit(0);
    };
    process.on("SIGINT", gracefulShutdown); // this is your ctrl + c in nodes
    process.on("SIGTERM", gracefulShutdown); //a signal to terminate a process
    return conn;
  } catch (error) {
    console.error("❌ Mongodb connection failed", error.message);
    process.exit(1); // exit the process, 1 usually indicates error/failure while 0 indicates success, it just saying the reason why the  connection did not work is because it failed to connect
  }
};

// server configuration
const PORT = process.env.PORT || 5400;

// handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! ⚠️ Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    // INVOKE OUR DB CONNECTION
    await connectDb(); //invoking the function unless it won't work
    // server needs to run on a port number
    const server = app.listen(PORT, () => {
      console.log(
        `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      console.log(`🌍 http://localhost:${PORT}`);
    });
    // handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("❌UNHANDLED REJECTION shutting down...");
      console.error(err.name, err.message);

      // closing server gracefully
      server.close(() => {
        console.log("🧨Process terminated due to unhandled rejection");
        process.exit(1);
      });
    });
    // handle graceful shutdown
    const shutdown = async () => {
      console.log("⚠️ Received shutdown signal. Closing server...");
      server.close(() => {
        console.log("✅ Server closed");
        process.getMaxListeners(0);
      });
      // force close if server doesn't close in time
      setTimeout(() => {
        console.error("⚠️ Forcing server shutdown");
        process.exit(0);
      }, 10000);
    };
    // handle termination signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// start server
startServer();
