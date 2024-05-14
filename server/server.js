import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose"; // for DB
import cors from "cors";
import userRoute from "./routes/user.js";
import authRoute from "./routes/auth.js";
import verifyRoute from "./routes/verificationRequest.js";
import cookieParser from "cookie-parser";

////////////// express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

///////////// cors connection to frontend
app.use(
  cors({
    origin: "",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);
// use below when testing on local
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: "GET, POST, PUT, DELETE",
//     credentials: true,
//   })
// );

// app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());

///////////// routes
app.use("/api/user", userRoute);
app.use("/auth", authRoute);
app.use("/verification", verifyRoute);

///////////// connection to mongoose
let port = process.env.port || 5000;
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
mongoose
  .connect(process.env.MONGO_URI, {
    // .connect("mongodb://127.0.0.1:27017/jwtAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // listen for requests
    app.listen(port, () => {
      // use when in local
      // console.log(`Connected to db & server is running on port: ${port}.`);
      res.json(`Connected to db & server is running.`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

app.get("/", (req, res) => {
  // use when in local
  // res.send("Server up and running");
  res.json("Sever up and running");
});
