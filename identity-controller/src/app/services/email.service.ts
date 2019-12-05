import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { emailTemplate } from './invitation_email';

export class EmailService {
  transporter: Mail;
  adminEmail: string | undefined;

  from = 'Identity Kit POC <no-reply@gov.bc.ca>';
  constructor(opts: {
    host: string;
    port: number;
    user: string;
    pass: string;
  }) {
    const { host, port, user, pass } = opts;
    if (process.env.NODE_ENV === 'production') {
      const transport = nodemailer.createTransport({
        host: host,
        port: port,
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
        logger: true,
      });
      this.transporter = transport;
      this.adminEmail = process.env.ADMIN_EMAIL;
    } else {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '2525'),
        auth: {
          user: process.env.SMTP_USERNAME || '',
          pass: process.env.SMTP_PASS,
        },
        logger: true,
        secure: false,
      });
      this.transporter = transport;
      this.adminEmail = process.env.ADMIN_EMAIL;
      console.warn('dev e-mail mode');
    }
  }

  async mailInvite(opts: { address: string; url: string }) {
    const { address: to, url } = opts;
    const html = emailTemplate(url, this.adminEmail || '');
    const subject = 'Welcome to the Identity Kit POC test.';

    const from = 'Identity Kit POC <no-reply@gov.bc.ca>';
    if (process.env.NODE_ENV !== 'production') console.log(html);
    try {
      const mail = await this.transporter.sendMail({
        html,
        from,
        to,
        subject,
      });
      return mail;
    } catch (err) {
      console.log(err);
    }
  }
  async requestInvite(opts: { address: string; signUpAddress: string }) {
    const { address, signUpAddress } = opts;
    const subject = 'New token request';
    const text = `${address} has requested a new email token. They were signed up using the address: ${signUpAddress}`;
    const from = this.from;
    const to = this.adminEmail;
    if (process.env.NODE_ENV !== 'production') console.log(text);
    try {
      const mail = await this.transporter.sendMail({
        text,
        from,
        to,
        subject,
      });
      console.log(mail);
    } catch (err) {
      console.log(err);
    }
  }
}
