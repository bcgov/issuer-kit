import * as nodemailer from 'nodemailer';
import Mail = require('nodemailer/lib/mailer');

export class EmailService {
  transporter: Mail;
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
      secure: false,
      auth: {
        user: user,
        pass: pass
      }
    });
    this.transporter = transport;
  }

  async mailInvite(opts: { address: string; url: string }) {
    const { address, url } = opts;
    const mail = await this.transporter.sendMail({
      from: 'Identity Kit POC <no-reply@gov.bc.ca>',
      to: address,
      subject: 'Welcome to the Identity Kit POC test.',
      html: `<h3>Welcome to identity kit POC test.<h3> <p>Click here to get started <a href="${url}">Link</a></p>`
    });
    return mail;
  }
}
