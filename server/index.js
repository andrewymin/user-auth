// import dotenv from "dotenv";
// dotenv.config();
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

///////////// cors connection to frontend
const corsOptions = {
  origin:
    "https://user-auth-frontend-iub0vod93-andrewymins-projects.vercel.app", // Explicitly allow your frontend domain
  methods: "GET, POST, PUT, DELETE", // Specify allowed methods as needed
  credentials: true, // If your frontend needs to send cookies or credentials with the request
  allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
};
app.use(cors(corsOptions));

// use below when testing on local
// app.use(
//   cors(corsOptions)
// );

// app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());

///////////// routes
app.use("/api/user", userRoute);
app.use("/auth", authRoute);
app.use("/verification", verifyRoute);

///////////// connection to mongoose
let port = process.env.port || 5000;
// mongoose.set("strictQuery", true);
// mongoose
//   .connect(process.env.MONGO_URI, {
//     // .connect("mongodb://127.0.0.1:27017/jwtAuth", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     // listen for requests
//     app.listen(port, () => {
//       // use when in local
//       console.log(`Connected to db & server is running on port: ${port}.`);

//       // res.json(`Connected to db & server is running on port: ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

const startServer = async () => {
  try {
    mongoose.set("strictQuery", true);
    /*
When the strict option is set to true, 
Mongoose will ensure that only the fields that are specified 
in your schema will be saved in the database, and all other 
fields will not be saved (if some other fields are sent).

Right now, this option is enabled by default, 
but it will be changed in Mongoose v7 to false by 
default. That means that all the fields will be 
saved in the database, even if some of them are not 
specified in the schema model.

*/
    await mongoose.connect(process.env.MONGO_URI, {
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

startServer();

app.get("/", (req, res) => {
  // use when in local
  res.send("Server up and running");

  // res.json("Sever up and running");
});
