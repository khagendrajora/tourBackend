import nodemailer from "nodemailer";

export const sendEmail = (options: any) => {
  let nodemailers = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: "ae7e97c689918e",
      pass: "a6b23360b72cf8",
    },
  });
  const mailOptions = {
    from: "beta_toursewa@gmail.com",
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  nodemailers.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log("Error", error);
    } else {
      console.log("Email Sent", info.response);
    }
  });
};
