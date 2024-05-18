import crypto from "crypto";
import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// uncomment for testing on localhost
// const linkURL = 'http://localhost:5000';
const linkURL = "https://user-auth-server-three.vercel.app";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const templatePath = path.join(
//   process.cwd(),
//   "emailTemplates",
//   "email_template_2.html"
// );
// console.log(templatePath);

const getHtmlFile = (num) => {
  let filePath = path.join(
    __dirname,
    `../emailTemplates/email_template_${num}.html`
  );
  let file = fs.readFileSync(filePath, "utf8");
  return file;
};

// Function to replace placeholders with dynamic variables
const fillTemplate = (template, variables) => {
  let filledTemplate = template;
  for (const [key, value] of Object.entries(variables)) {
    filledTemplate = filledTemplate.replace(
      new RegExp(`{{${key}}}`, "g"),
      value
    );
  }
  return filledTemplate;
};

function generateRandomSixDigitNumber() {
  // Use crypto.randomInt to generate a random integer between 100000 and 999999
  const min = 100000;
  const max = 1000000; // The upper limit is exclusive, so use 1000000 instead of 999999
  const randomSixDigitNumber = crypto.randomInt(min, max).toString();

  return randomSixDigitNumber;
}

////////// Send Verify Email
function verifyEmail(email, code) {
  // get verify email template file
  const source = getHtmlFile(1);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL, // user company email if it exists
    to: email,
    subject: "Verification Code Test",
    html: fillTemplate(source, {
      username: email,
      verificationCode: code,
    }),
  };

  return transporter.sendMail(mailOptions);
}

////////// Send Password Reset Email
async function resetPasswordEmail(email, resetToken) {
  // get password reset email template file
  const source = getHtmlFile(2);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL, // user company email if it exists
    to: email,
    subject: "Password Reset Test",
    html: fillTemplate(source, {
      token: resetToken,
      serverURL: linkURL,
    }),
  };

  return transporter.sendMail(mailOptions);
}

export { generateRandomSixDigitNumber, verifyEmail, resetPasswordEmail };
