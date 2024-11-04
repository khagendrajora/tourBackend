import nodemailer from "nodemailer";

export const sendEmail = (options: any) => {
  let nodemailers = nodemailer.createTransport({
    host: "gmail",
    port: 465,
    secure: true,
    auth: {
      // user: "ae7e97c689918e",
      // pass: "a6b23360b72cf8",
      user: "khagijora2074@gmail.com",
      pass: "vwuvzacadvyyyogx",
    },
  });
  const mailOptions = {
    from: options.from,
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
