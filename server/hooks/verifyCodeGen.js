import crypto from "crypto";
import nodemailer from "nodemailer";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log("what folder am I in for vercel: ", __dirname);
// const source = fs.readFileSync(
//   path.join(process.cwd(), "/emailTemplates/email_template_1.html"),
//   "utf8"
// );

// const source2 = fs.readFileSync(
//   path.join(process.cwd(), "/emailTemplates/email_template_2.html"),
//   "utf8"
// );

// const templatePath = path.join(
//   process.cwd(),
//   "emailTemplates",
//   "email_template_2.html"
// );
// console.log(templatePath);

const getHtmlFile = (num) => {
  let filePath = path.join(
    process.cwd(),
    `emailTemplates`,
    `email_template_${num}.html`
  );
  let file = fs.readFileSync(filePath, "utf8");
  return file;
};

// let test = path.join(process.cwd(), "/emailTemplates/email_template_2.html");
// console.log(test);

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

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}\nCode is: ${code}.`);
    }
  });
}

////////// Send Password Reset Email
function resetPasswordEmail(email, resetToken) {
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
    }),
  };

  transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
    }
  });
}

export { generateRandomSixDigitNumber, verifyEmail, resetPasswordEmail };
