import {PurchaseOrderCreatedEvent} from '@gddy-coding-exercise/shared-events';
import {Injectable, Logger} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger: Logger = new Logger(EmailService.name);

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

  async sendOrderApprovalNeeded(event: PurchaseOrderCreatedEvent) {
    if (!event.data.approvers?.length) {
      this.logger.warn(
        `received approval event with no approvers. purchase order # ${event.data.purchaseOrderId}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: event.data.approvers,
      subject: `Purchase Order # ${event.data.purchaseOrderId} Needs Approval`,
      html: `
        <h2>Purchase Order Needs Approval</h2>
        <p>The details are below:</p>
        <div>Vendor name: ${event.data.vendorName}</div>
        <div>Total Quantity: ${event.data.totalQuantity}</div>
        <div>Total Cost: $${event.data.totalCost}</div>
        <div>Expected Delivery Date: ${event.data.expectedDeliveryDate}</div>
        <div>Created by: ${event.data.createdBy}</div>
        <div>Line Item Count: ${event.data.items.length}</div>
        <br><br>
        <p><a href="http://localhost:4200/purchase-orders/${event.data.purchaseOrderId}">Click here to review</a></p>
      `,
    });
  }
}
