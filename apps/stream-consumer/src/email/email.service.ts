import {Injectable} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtp(email: string, code: string, expires: string) {
    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: `${code} is your Inventory System login code`,
      html: `
        <h2>Your login code</h2>
        <p>Enter this code to log in: <strong>${code}</strong></p>
        <p>This code expires in ${expires}.</p>
      `,
    });
  }
}
