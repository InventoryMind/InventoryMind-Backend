const nodemailer = require("nodemailer");
const config = require("config");
const _transporter = new WeakMap();

class Email {
  constructor() {
    _transporter.set(
      this,
      nodemailer.createTransport(config.get("email_transporter_credentials"))
    );
  }

  send(to, subject, text, HtmlContent) {
    return new Promise((resolve) => {
      _transporter.get(this).sendMail(
        {
          from: `"Emission Test Center" <${
            config.get("email_transporter_credentials").auth.user
          }>`,
          to: to,
          subject: subject,
          text: text,
          html: HtmlContent,
        },
        (err, info) => {
          if (err) resolve({ err });
          resolve({ info });
        }
      );
    });
  }
}

module.exports = Email;
