import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose"; // for DB
import cors from "cors";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import verifyRoute from "./routes/verificationRequest.js";
import cookieParser from "cookie-parser";

////////////// express app
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Trust the first proxy, required for secure cookies on Heroku/Vercel
app.set("trust proxy", 1);

///////////// cors connection to frontend
// const corsOptions = {
//   origin: "https://user-auth-frontend-teal.vercel.app", // Explicitly allow your frontend domain
//   methods: "GET, POST, PUT, DELETE, OPTIONS", // Specify allowed methods as needed
//   credentials: true, // If your frontend needs to send cookies or credentials with the request
//   allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"], // Specify allowed headers
// };
// app.use(cors(corsOptions));

// use below when testing on local
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);

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
    // await mongoose.connect(process.env.MONGO_URI, {
    await mongoose.connect("mongodb://127.0.0.1:27017/jwtAuth", {
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
