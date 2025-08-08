const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { convert } = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Vishu Patil <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  loadTemplate(templateName, data = {}) {
    const templatePath = path.join(
      __dirname,
      `../../frontend/src/Email/${templateName}.html`,
    );
    let html = fs.readFileSync(templatePath, 'utf-8');
    html = html.replace(/{{firstName}}/g, this.firstName);
    html = html.replace(/{{url}}/g, this.url);
    html = html.replace(/{{message}}/g, data.message || '');

    return html;
  }

  async send(templateName, subject, data = {}) {
    const html = this.loadTemplate(templateName, data);

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('WelcomeEmail', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'PasswordReset',
      'Your password reset token (valid for 10 min)',
      {
        message: `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${this.url}.\nIf you didn't forget your password, please ignore this email!`,
      },
    );
  }
};
