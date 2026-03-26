import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'mail.privateemail.com'),
      port: this.configService.get<number>('SMTP_PORT', 465),
      secure: true, // SSL on port 465
      auth: {
        user: this.configService.get<string>('SMTP_USER', 'contact@mirhapret.com'),
        pass: this.configService.get<string>('SMTP_PASS', '(Mirha123)'),
      },
    });
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"MirhaPret" <${this.configService.get<string>('SMTP_USER', 'contact@mirhapret.com')}>`,
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
    }
  }

  async sendOrderConfirmation(params: {
    to: string;
    firstName: string;
    orderNumber: string;
    items: { name: string; size: string; quantity: number; price: number }[];
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
    trackingUrl: string;
  }): Promise<void> {
    const itemRows = params.items.map(item => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
          <strong>${item.name}</strong><br/>
          <span style="color:#999;font-size:12px;">Size: ${item.size} × ${item.quantity}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">
          PKR ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:600px;margin:40px auto;background:#fff;">
          <!-- Header -->
          <div style="background:#0e0e0e;padding:32px 40px;">
            <p style="color:#c8a96e;font-size:20px;font-weight:800;letter-spacing:2px;margin:0;">MirhaPret</p>
          </div>
          <!-- Body -->
          <div style="padding:40px;">
            <h1 style="font-size:22px;font-weight:800;color:#000;margin:0 0 8px;">Order Confirmed</h1>
            <p style="color:#666;font-size:14px;margin:0 0 32px;">Hi ${params.firstName}, thank you for your order!</p>

            <div style="background:#f9f9f9;padding:16px 20px;margin-bottom:32px;">
              <p style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 4px;">Order Number</p>
              <p style="font-size:18px;font-weight:800;color:#000;margin:0;">${params.orderNumber}</p>
            </div>

            <!-- Items -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              ${itemRows}
            </table>

            <!-- Totals -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
              <tr>
                <td style="padding:6px 0;color:#666;font-size:13px;">Subtotal</td>
                <td style="padding:6px 0;text-align:right;font-size:13px;">PKR ${params.subtotal.toLocaleString()}</td>
              </tr>
              ${params.discount > 0 ? `<tr><td style="padding:6px 0;color:#666;font-size:13px;">Discount</td><td style="padding:6px 0;text-align:right;font-size:13px;color:#c8a96e;">- PKR ${params.discount.toLocaleString()}</td></tr>` : ''}
              <tr>
                <td style="padding:6px 0;color:#666;font-size:13px;">Shipping</td>
                <td style="padding:6px 0;text-align:right;font-size:13px;">PKR ${params.shipping.toLocaleString()}</td>
              </tr>
              <tr style="border-top:2px solid #000;">
                <td style="padding:12px 0 6px;font-weight:800;font-size:15px;">Total</td>
                <td style="padding:12px 0 6px;text-align:right;font-weight:800;font-size:15px;">PKR ${params.total.toLocaleString()}</td>
              </tr>
            </table>

            <!-- Track button -->
            <div style="text-align:center;margin:32px 0;">
              <a href="${params.trackingUrl}" style="display:inline-block;padding:14px 32px;background:#000;color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                Track Your Order
              </a>
            </div>

            <p style="font-size:12px;color:#999;text-align:center;line-height:1.7;">
              Questions? Reply to this email or contact us at contact@mirhapret.com
            </p>
          </div>
          <!-- Footer -->
          <div style="background:#f5f5f5;padding:24px 40px;text-align:center;">
            <p style="font-size:11px;color:#aaa;margin:0;">© 2026 MirhaPret. Pakistan's premium pret boutique.</p>
          </div>
        </div>
      </body>
      </html>`;

    await this.send(params.to, `Order Confirmed — ${params.orderNumber}`, html);
  }

  async sendPasswordResetOtp(params: { to: string; firstName: string; otp: string }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#fff;">
          <div style="background:#0e0e0e;padding:24px 32px;">
            <p style="color:#c8a96e;font-size:18px;font-weight:800;letter-spacing:2px;margin:0;">MirhaPret</p>
          </div>
          <div style="padding:40px;text-align:center;">
            <h1 style="font-size:20px;font-weight:800;color:#000;margin:0 0 8px;">Reset Your Password</h1>
            <p style="color:#666;font-size:14px;margin:0 0 32px;">Hi ${params.firstName}, use the code below to reset your password. It expires in 15 minutes.</p>
            <div style="background:#f9f9f9;padding:24px;margin:0 auto 32px;display:inline-block;min-width:200px;">
              <p style="font-size:36px;font-weight:900;letter-spacing:12px;color:#000;margin:0;">${params.otp}</p>
            </div>
            <p style="font-size:12px;color:#999;">If you didn't request this, ignore this email.</p>
          </div>
          <div style="background:#f5f5f5;padding:16px 32px;text-align:center;">
            <p style="font-size:11px;color:#aaa;margin:0;">© 2026 MirhaPret</p>
          </div>
        </div>
      </body>
      </html>`;

    await this.send(params.to, 'Your MirhaPret Password Reset Code', html);
  }

  async sendContactFormEmail(params: { name: string; email: string; phone?: string; message: string }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:24px;">
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:700;width:120px;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${params.name}</td></tr>
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:700;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${params.email}</td></tr>
          ${params.phone ? `<tr><td style="padding:8px;background:#f5f5f5;font-weight:700;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;">${params.phone}</td></tr>` : ''}
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:700;vertical-align:top;">Message</td><td style="padding:8px;">${params.message.replace(/\n/g, '<br>')}</td></tr>
        </table>
      </body>
      </html>`;

    await this.send('contact@mirhapret.com', `Contact Form: ${params.name}`, html);
  }

  async sendGuestOrderTrackingEmail(params: {
    to: string;
    firstName: string;
    orderNumber: string;
    trackingUrl: string;
  }): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#fff;">
          <div style="background:#0e0e0e;padding:24px 32px;">
            <p style="color:#c8a96e;font-size:18px;font-weight:800;letter-spacing:2px;margin:0;">MirhaPret</p>
          </div>
          <div style="padding:40px;">
            <h1 style="font-size:20px;font-weight:800;color:#000;margin:0 0 8px;">Track Your Order</h1>
            <p style="color:#666;font-size:14px;margin:0 0 24px;">Hi ${params.firstName}, you can track your order <strong>${params.orderNumber}</strong> using the link below.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${params.trackingUrl}" style="display:inline-block;padding:14px 32px;background:#000;color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                Track Order
              </a>
            </div>
            <p style="font-size:12px;color:#999;text-align:center;">Or copy this link: <a href="${params.trackingUrl}" style="color:#000;">${params.trackingUrl}</a></p>
          </div>
          <div style="background:#f5f5f5;padding:16px 32px;text-align:center;">
            <p style="font-size:11px;color:#aaa;margin:0;">© 2026 MirhaPret</p>
          </div>
        </div>
      </body>
      </html>`;

    await this.send(params.to, `Your Order Tracking Link — ${params.orderNumber}`, html);
  }
}
