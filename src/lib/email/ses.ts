import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@bandencentrale.be";
const COMPANY_NAME = "BandenCentrale";

interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

// Email verification template
const getVerificationEmailTemplate = (name: string, verificationUrl: string): EmailTemplate => ({
  subject: `Verify your ${COMPANY_NAME} account`,
  htmlBody: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Account</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">${COMPANY_NAME}</div>
        <h1>Verify Your Account</h1>
      </div>
      <div class="content">
        <p>Hello ${name},</p>
        <p>Welcome to ${COMPANY_NAME}! To complete your registration and start shopping for premium tires, please verify your email address by clicking the button below:</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e5e5e5; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
        <p><strong>This verification link will expire in 24 hours.</strong></p>
        <p>If you didn't create an account with ${COMPANY_NAME}, you can safely ignore this email.</p>
        <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
      </div>
      <div class="footer">
        <p>© 2025 ${COMPANY_NAME}. All rights reserved.<br>
        123 Main Street, Ghent, Belgium | +32 467 87 1205</p>
      </div>
    </body>
    </html>
  `,
  textBody: `
Hello ${name},

Welcome to ${COMPANY_NAME}! To complete your registration and start shopping for premium tires, please verify your email address by visiting this link:

${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create an account with ${COMPANY_NAME}, you can safely ignore this email.

Best regards,
The ${COMPANY_NAME} Team

© 2025 ${COMPANY_NAME}. All rights reserved.
123 Main Street, Ghent, Belgium | +32 467 87 1205
  `
});

// Password reset template
const getPasswordResetTemplate = (name: string, resetUrl: string): EmailTemplate => ({
  subject: `Reset your ${COMPANY_NAME} password`,
  htmlBody: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .warning { background: #fef3cd; border: 1px solid #fce571; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">${COMPANY_NAME}</div>
        <h1>Reset Your Password</h1>
      </div>
      <div class="content">
        <p>Hello ${name},</p>
        <p>We received a request to reset the password for your ${COMPANY_NAME} account. Click the button below to create a new password:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" class="button">Reset Password</a>
        </p>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; background: #e5e5e5; padding: 10px; border-radius: 5px;">${resetUrl}</p>
        <div class="warning">
          <p><strong>⚠️ Important Security Information:</strong></p>
          <ul>
            <li>This password reset link will expire in 1 hour</li>
            <li>The link can only be used once</li>
            <li>If you didn't request this password reset, please ignore this email</li>
            <li>Consider enabling two-factor authentication for added security</li>
          </ul>
        </div>
        <p>If you need help or have questions, contact our support team at info@bandencentrale.be</p>
        <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
      </div>
      <div class="footer">
        <p>© 2025 ${COMPANY_NAME}. All rights reserved.<br>
        123 Main Street, Ghent, Belgium | +32 467 87 1205</p>
      </div>
    </body>
    </html>
  `,
  textBody: `
Hello ${name},

We received a request to reset the password for your ${COMPANY_NAME} account. Visit this link to create a new password:

${resetUrl}

⚠️ Important Security Information:
- This password reset link will expire in 1 hour
- The link can only be used once
- If you didn't request this password reset, please ignore this email
- Consider enabling two-factor authentication for added security

If you need help or have questions, contact our support team at info@bandencentrale.be

Best regards,
The ${COMPANY_NAME} Team

© 2025 ${COMPANY_NAME}. All rights reserved.
123 Main Street, Ghent, Belgium | +32 467 87 1205
  `
});

// Order confirmation template
const getOrderConfirmationTemplate = (customerName: string, orderNumber: string, orderDetails: any): EmailTemplate => ({
  subject: `Order Confirmation #${orderNumber} - ${COMPANY_NAME}`,
  htmlBody: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .status { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">${COMPANY_NAME}</div>
        <h1>Order Confirmed!</h1>
      </div>
      <div class="content">
        <p>Dear ${customerName},</p>
        <p>Thank you for your order! We've received your purchase and are preparing it for processing.</p>
        <div class="status">
          <strong>✅ Order #${orderNumber} Confirmed</strong>
        </div>
        <div class="order-details">
          <h3>Order Summary</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> €${orderDetails.total}</p>
          <!-- Add more order details here -->
        </div>
        <p>We'll send you another email with tracking information once your order ships.</p>
        <p>If you have any questions about your order, please contact us at info@bandencentrale.be or call +32 467 87 1205</p>
        <p>Thank you for choosing ${COMPANY_NAME}!</p>
        <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
      </div>
      <div class="footer">
        <p>© 2025 ${COMPANY_NAME}. All rights reserved.<br>
        123 Main Street, Ghent, Belgium | +32 467 87 1205</p>
      </div>
    </body>
    </html>
  `,
  textBody: `
Dear ${customerName},

Thank you for your order! We've received your purchase and are preparing it for processing.

✅ Order #${orderNumber} Confirmed

Order Summary:
- Order Number: ${orderNumber}
- Order Date: ${new Date().toLocaleDateString()}
- Total Amount: €${orderDetails.total}

We'll send you another email with tracking information once your order ships.

If you have any questions about your order, please contact us at info@bandencentrale.be or call +32 467 87 1205

Thank you for choosing ${COMPANY_NAME}!

Best regards,
The ${COMPANY_NAME} Team

© 2025 ${COMPANY_NAME}. All rights reserved.
123 Main Street, Ghent, Belgium | +32 467 87 1205
  `
});

// Generic send email function
const sendEmail = async (
  to: string,
  template: EmailTemplate,
  replyTo?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const params: SendEmailCommandInput = {
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      ReplyToAddresses: replyTo ? [replyTo] : undefined,
      Message: {
        Subject: {
          Data: template.subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: template.htmlBody,
            Charset: "UTF-8",
          },
          Text: {
            Data: template.textBody,
            Charset: "UTF-8",
          },
        },
      },
      Tags: [
        {
          Name: "Company",
          Value: COMPANY_NAME,
        },
        {
          Name: "Environment",
          Value: process.env.NODE_ENV || "development",
        },
      ],
    };

    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);

    console.log("Email sent successfully:", result.MessageId);
    return {
      success: true,
      messageId: result.MessageId,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Exported functions
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const template = getVerificationEmailTemplate(name, verificationUrl);
  return sendEmail(email, template);
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const template = getPasswordResetTemplate(name, resetUrl);
  return sendEmail(email, template);
};

export const sendOrderConfirmationEmail = async (
  email: string,
  customerName: string,
  orderNumber: string,
  orderDetails: any
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const template = getOrderConfirmationTemplate(customerName, orderNumber, orderDetails);
  return sendEmail(email, template);
};

export const sendAppointmentConfirmationEmail = async (
  email: string,
  customerName: string,
  appointmentDetails: {
    appointmentNumber: string;
    serviceName: string;
    date: string;
    time: string;
    technician?: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const template = {
    subject: `Appointment Confirmed #${appointmentDetails.appointmentNumber} - ${COMPANY_NAME}`,
    htmlBody: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Appointment Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .status { background: #d4edda; color: #155724; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">${COMPANY_NAME}</div>
          <h1>Appointment Confirmed!</h1>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          <p>Your service appointment has been confirmed. We look forward to serving you!</p>
          <div class="status">
            <strong>✅ Appointment #${appointmentDetails.appointmentNumber} Confirmed</strong>
          </div>
          <div class="appointment-details">
            <h3>Appointment Details</h3>
            <p><strong>Service:</strong> ${appointmentDetails.serviceName}</p>
            <p><strong>Date:</strong> ${appointmentDetails.date}</p>
            <p><strong>Time:</strong> ${appointmentDetails.time}</p>
            ${appointmentDetails.technician ? `<p><strong>Technician:</strong> ${appointmentDetails.technician}</p>` : ''}
            <p><strong>Location:</strong> 123 Main Street, Ghent, Belgium</p>
          </div>
          <p><strong>Please arrive 10 minutes early</strong> to allow time for check-in.</p>
          <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          <p>Questions? Call us at +32 467 87 1205 or email info@bandencentrale.be</p>
          <p>Thank you for choosing ${COMPANY_NAME}!</p>
          <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
        </div>
        <div class="footer">
          <p>© 2025 ${COMPANY_NAME}. All rights reserved.<br>
          123 Main Street, Ghent, Belgium | +32 467 87 1205</p>
        </div>
      </body>
      </html>
    `,
    textBody: `
Dear ${customerName},

Your service appointment has been confirmed. We look forward to serving you!

✅ Appointment #${appointmentDetails.appointmentNumber} Confirmed

Appointment Details:
- Service: ${appointmentDetails.serviceName}
- Date: ${appointmentDetails.date}
- Time: ${appointmentDetails.time}
${appointmentDetails.technician ? `- Technician: ${appointmentDetails.technician}` : ''}
- Location: 123 Main Street, Ghent, Belgium

Please arrive 10 minutes early to allow time for check-in.

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Questions? Call us at +32 467 87 1205 or email info@bandencentrale.be

Thank you for choosing ${COMPANY_NAME}!

Best regards,
The ${COMPANY_NAME} Team

© 2025 ${COMPANY_NAME}. All rights reserved.
123 Main Street, Ghent, Belgium | +32 467 87 1205
    `
  };

  return sendEmail(email, template);
};

// Newsletter welcome email
export const sendNewsletterWelcomeEmail = async (
  email: string,
  firstName?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const name = firstName || 'Valued Customer';
  const template = {
    subject: `Welcome to ${COMPANY_NAME} Newsletter! 🎉`,
    htmlBody: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Our Newsletter</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .discount { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">${COMPANY_NAME}</div>
          <h1>Welcome to Our Newsletter!</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Welcome to the ${COMPANY_NAME} family! Thank you for subscribing to our newsletter.</p>
          <div class="discount">
            🎁 Your 10% Discount Code: <strong>WELCOME10</strong>
          </div>
          <div class="benefits">
            <h3>What You'll Receive:</h3>
            <ul>
              <li>🔧 Expert tire maintenance tips and advice</li>
              <li>💰 Exclusive discounts and special offers</li>
              <li>🚗 Seasonal driving safety tips</li>
              <li>🆕 First access to new products and services</li>
              <li>📅 Personalized maintenance reminders</li>
            </ul>
          </div>
          <p>Use your discount code <strong>WELCOME10</strong> on your next purchase to save 10%!</p>
          <p>We're committed to keeping you safe on the road with premium tires and expert service.</p>
          <p>Best regards,<br>The ${COMPANY_NAME} Team</p>
        </div>
        <div class="footer">
          <p>© 2025 ${COMPANY_NAME}. All rights reserved.<br>
          123 Main Street, Ghent, Belgium | +32 467 87 1205</p>
          <p><small>You can unsubscribe from these emails at any time.</small></p>
        </div>
      </body>
      </html>
    `,
    textBody: `
Hello ${name},

Welcome to the ${COMPANY_NAME} family! Thank you for subscribing to our newsletter.

🎁 Your 10% Discount Code: WELCOME10

What You'll Receive:
- 🔧 Expert tire maintenance tips and advice
- 💰 Exclusive discounts and special offers
- 🚗 Seasonal driving safety tips
- 🆕 First access to new products and services
- 📅 Personalized maintenance reminders

Use your discount code WELCOME10 on your next purchase to save 10%!

We're committed to keeping you safe on the road with premium tires and expert service.

Best regards,
The ${COMPANY_NAME} Team

© 2025 ${COMPANY_NAME}. All rights reserved.
123 Main Street, Ghent, Belgium | +32 467 87 1205

You can unsubscribe from these emails at any time.
    `
  };

  return sendEmail(email, template);
};
