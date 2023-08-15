const Datauri = require("datauri");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function uploader(img, res) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(img, (err, url) => {
      if (err) {
        return reject(err);
      }
      return resolve(url);
    });
  });
}

const sender = nodemailer.createTransport({
  service: "gmail",
  secureConnection: true,
  logger: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

function sendEmail({ to, from, subject, html }) {
  const mail = {
    from: `Abhishek <${process.env.NODEMAILER_EMAIL}>`,
    to,
    subject: subject,
    html: `${html}`,
  };

  sender.sendMail(mail, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully: " + info.response);
    }
  });
}

module.exports = { uploader, sendEmail };
