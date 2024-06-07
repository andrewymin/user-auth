import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose"; // for DB
import cors from "cors";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import verifyRoute from "./routes/verificationRequest.js";
import cookieParser from "cookie-parser";

////////////// procces.env.NODE_ENV is evaluated once delpoyed to see if its
//////////////  set to production or not

////////////// express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Trust the first proxy, required for secure cookies on Heroku/Vercel
app.set("trust proxy", 1);

///////////// cors option for Production (Vercel)
const corsOptionsProd = {
  origin: "https://user-auth-frontend-teal.vercel.app", // Explicitly allow your frontend domain
  methods: "GET, POST, PUT, DELETE, OPTIONS", // Specify allowed methods as needed
  credentials: true, // If your frontend needs to send cookies or credentials with the request
  allowedHeaders: [
    "X-Requested-With",
    "Content-Type",
    "Authorization",
    "Accept",
  ], // Specify allowed headers
};

///////////// cors option for Localhost
const corsOptionsLocal = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE",
  credentials: true,
};
///////////// mongoose Production uri
const mongoose_prod = process.env.MONGO_URI;
///////////// mongoose Localhost uri

///// COOKIE AUTH
// const mongoose_local = "mongodb://127.0.0.1:27017/jwtAuth";
//// TOKEN AUTH LOCALSTORAGE
const mongoose_local = "mongodb://127.0.0.1:27017/localStorageToken";

///////////// Setting cors_option based on NODE_ENV value
const CORS_OPTIONS =
  process.env.NODE_ENV === "production" ? corsOptionsProd : corsOptionsLocal;

///////////// Setting mongoose_connection based on NODE_ENV value
const MONGOOSE_CONNECTION =
  process.env.NODE_ENV === "production" ? mongoose_prod : mongoose_local;

app.use(cors(CORS_OPTIONS));

// app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());

///////////// routes
app.use("/api/user", userRoute);
app.use("/auth", authRoute);
app.use("/verification", verifyRoute);

///////////// connection to mongoose
let port = process.env.port || 5000;

const startServer = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(MONGOOSE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

startServer(); // placed mongoose connection in function for async/await for deployment server (vercel)

app.get("/", (req, res) => {
  // use when in local
  res.send("Server up and running");
});
