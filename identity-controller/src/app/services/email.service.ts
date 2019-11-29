import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');
import { emailTemplate } from './invitation_email';

const adminEmail = process.env.ADMIN_EMAIL;

export class EmailService {
  transporter: Mail;
  adminEmail: string | undefined;
  constructor(opts: {
    host: string;
    port: number;
    user: string;
    pass: string;
  }) {
    const { host, port, user, pass } = opts;
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
    this.adminEmail = adminEmail;
  }

  async mailInvite(opts: { address: string; url: string }) {
    const { address, url } = opts;
    try {
      const mail = await this.transporter.sendMail({
        from: 'Identity Kit POC <no-reply@gov.bc.ca>',
        to: address,
        subject: 'Welcome to the Identity Kit POC test.',
        // TODO: @SH - change this to an env variable
        html: emailTemplate(url, 'peter.Watkins@gov.bc.ca'),
      });
      return mail;
    } catch (err) {
      console.log(err);
    }
  }
}
