import mongoose from "mongoose";
import bycrpt from "bcrypt";
import validator from "validator";
import {
  generateRandomSixDigitNumber,
  verifyEmail,
} from "../hooks/verifyCodeGen.js";

const EXPIRE_AGE = 180; // in sec

const resetEmail = new mongoose.Schema({
  // for when user requests password reset link, later deleted on completion or expried time reached
  email: String,
  token: String,
  expireAt: {
    type: Date,
    default: Date.now,
    expires: EXPIRE_AGE, // Document will expire after 180 sec
  },
});

const verificationRequest = new mongoose.Schema({
  // for sign up verification code input to see if email is real
  vCode: String,
  expireAt: {
    type: Date,
    default: Date.now,
    expires: EXPIRE_AGE, // Document will expire after 180 sec
  },
});

const userSchema = new mongoose.Schema({
  // user db modal and its data blueprint
  createdAt: { type: Date, required: true, default: Date.now },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  verified: {
    type: Boolean,
  },
  verificationCode: verificationRequest,
});

// Used for temp storing if GOOGLE user exists but they're trying to
//  use same email for regular sign-in, thus temp while user hasn't completed verification code to link accounts
const tempUserSchema = new mongoose.Schema({
  googleUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  verified: {
    type: Boolean,
  },
  verificationCode: verificationRequest,
});

const TempUser = mongoose.model("tempUser", tempUserSchema); // creating model of temp user here to be used in functions below for error corrections

///////////// static signup method/function being created
// to be able to use the this keyword MUST use a regular function instead of an arrow funnction
// userSchema.statics.signup = async function (email, password) {
//   // Validation

//   // commented out for oauth integration for no password requirement
//   if (!email || !password) {
//     throw Error("All fields must be filled"); // even though password isn't required in modal this prevents any empty password
//   }
//   if (!validator.isEmail(email)) {
//     throw Error("Email is not valid");
//   }
//   // commented out this for testing the jwt in userController
//   // if (!validator.isStrongPassword(password)) {
//   //   throw Error("Password not strong enough");
//   // }

//   const exists = await this.findOne({ email });

//   if (exists) {
//     throw Error("Email already in use");
//   }
//   // const salt = await bycrpt.genSalt(saltRounds);
//   const hash = await bycrpt.hash(password, 10);

//   // console.log(email)
//   // console.log(hash)

//   // input passport validation here since if the logic gets here
//   //   then it has passed all the errors

//   const newUser = await this.create({
//     email,
//     password: hash,
//   });
//   return newUser;
// };

userSchema.statics.signup = async function (email, password) {
  // even though password isn't required in modal this prevents any empty password
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  // commented out this for testing the jwt in userController
  // if (!validator.isStrongPassword(password)) {
  //   throw Error("Password not strong enough");
  // }

  const exists = await this.findOne({ email }); // checking to see if user already exists
  const tempExists = await TempUser.findOne({ email: email }); // checking if user didn't complete verify code input and trying again before tempUser expires

  if (exists) {
    if (exists.verified) throw Error("Email already in use");

    if (exists.googleId) {
      // checking if exsiting user has logged in with google
      const verifyCode = generateRandomSixDigitNumber();
      console.log("this is code if user google linked: ", verifyCode);
      const hash = await bycrpt.hash(password, 10); // hashing password for security with 10 salt rounds

      const newTempUser = await TempUser.create({
        googleUserId: exists._id,
        email: email,
        password: hash,
        verified: false, // this needs to change to true if it gets verified
        verificationCode: { vCode: verifyCode }, // update this to NULL for it not to expire
      });

      return newTempUser; // user already logged in previously through google thus email will already be saved in db thus sending temp user until verification is complete
      // throw Error("User already exists please use social login.");
    }
  }

  // Check if tempuser exists from not completing verify before it has expired from before
  if (tempExists) {
    const newCode = generateRandomSixDigitNumber();
    console.log("This is new code if temp already exists: ", newCode);
    const updatedTempUser = await TempUser.findOneAndUpdate(
      { email: tempExists.email },
      {
        verificationCode: { vCode: newCode, expireAt: EXPIRE_AGE },
      },
      { new: true }
    );
    return updatedTempUser;
  }

  const verifyCode = generateRandomSixDigitNumber(); // generating 6 digit crypto number for security
  console.log("This is code for new user: ", verifyCode);

  // const salt = await bycrpt.genSalt(saltRounds);
  const hash = await bycrpt.hash(password, 10); // hashing password for security

  const newUser = await this.create({
    email: email,
    password: hash,
    verified: false, // this needs to change to true if it gets verified
    verificationCode: { vCode: verifyCode }, // update this to NULL for it not to expire
  });

  ///////////////////  Uncomment when ready to email
  // Here send a email for verification with crypto code
  // let emailRes = await verifyEmail(email, verifyCode);
  // if (emailRes.messageId)
  //   return newUser
  // throw Error("Verify email couldn't be sent.");

  return newUser; // return created user with all its data from db
};

userSchema.statics.googleSignup = async function (email, google_id) {
  if (!email || !google_id) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  const newUser = await this.create({
    email,
    googleId: google_id,
  });

  return newUser;
};

///////////// static login method/function being created
// to be able to use the this keyword MUST use a regular function instead of an arrow funnction
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  // check if there is email but not verified
  if (!user.verified) {
    throw Error("Must verify email first");
  }

  // check if email is verified but no password.
  //   meaning it's already been verified through google but no password
  if (user.verified && !user.password) {
    // TODO: Later once "create password" page/component is made, send
    //   different error. On F.E. redirect them to verifypage with new code
    //   sent to email and once done redirect them again to "create password"
    //   page and update exisiting user
    throw Error(
      "Email alread exists. Please use social sign-in to \
      login and create password for this login method."
    );
  }

  const match = await bycrpt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

///////////// static google link method/function being created if email
//   exists already from regular sign-in
// To be able to use the this keyword MUST use a
//   regular function instead of an arrow funnction
userSchema.statics.googleLink = async function (googleUser, id_token) {
  // Add mongodb update function here to update the existing user if exists
  //  WITHOUT google_id add the user_id to this.findOne({email}) for linking
  //  BUT make pop-up first to ask user!
  if (!googleUser) {
    throw Error("Need params to look for user.");
  }

  const user = await this.findOne({ email: googleUser.email }); // checking db if user exists from regular login

  if (!user) {
    // there wasn't user already in db thus create new user with google data
    const NewUser = await User.googleSignup(googleUser.email, id_token);
    console.log("new user created with google login");
    return NewUser;
  }

  if (user && user.googleId) return user; // user has both google and regular user connected in db thus return user

  if (user && !user.googleId) {
    // user exists but not connected with google user
    // user has not completed regular sign-in a.k.a didn't do code verification
    if (!user.verified) {
      const NewUser = await User.googleSignup({
        email: googleUser.email,
        googleId: id_token,
      });
      console.log("User needs to do verification for google and acct to link");
      return NewUser;
    }
    // user has already completed regular sign-in at this point thus update existing user with googleid: token
    return user;
  }
};

const ResetEmail = mongoose.model("resetEmail", resetEmail);
const User = mongoose.model("User", userSchema);
export { User, TempUser, ResetEmail };
