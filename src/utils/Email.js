const nodemailer = require("nodemailer");
const _transporter = new WeakMap();
const dotenv = require("dotenv");
dotenv.config();

class Email {
  constructor() {
    _transporter.set(
      this,
      nodemailer.createTransport(JSON.parse(process.env.email_transporter_credentials))
    );
  }

  send(to, subject, text, HtmlContent) {
    return new Promise((resolve) => {
      _transporter.get(this).sendMail(
        {
          from: `"Inventory Mind" <${
            JSON.parse(process.env.email_transporter_credentials).auth.user
          }>`,
          to: to,
          subject: subject,
          text: text,
          html: HtmlContent,
        },
        (err, info) => {
          console.log(err);
          console.log(info);
          if (err) resolve({ err });
          resolve({ info });
        }
      );
    });
  }
}

module.exports = Email;
