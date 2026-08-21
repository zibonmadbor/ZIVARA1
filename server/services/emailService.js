const nodemailer = require('nodemailer');

// Initialize transporter with environment variables or fallback to Ethereal
let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  // Option 1: Direct Gmail (Recommended for ease of setup with App Password)
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      }
    });
    console.log(`✅ Nodemailer: Connected to Gmail SMTP service (${process.env.GMAIL_USER})`);
    return transporter;
  }

  // Option 2: Custom SMTP Host (SendGrid, Mailgun, Amazon SES, CPanel, etc.)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log(`✅ Nodemailer: Connected to custom SMTP host (${process.env.SMTP_HOST})`);
    return transporter;
  }

  // Option 3: Fallback to Ethereal Test Account
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
  console.log('⚠️ Nodemailer Notice: Real SMTP credentials not set in server/.env. Using Ethereal Test Mailer.');
  return transporter;
}

// Generate luxury HTML invoice template
function generateInvoiceHtml(order, storeSettings = {}) {
  const storeName = storeSettings.storeName || 'ZIVARA';
  const storeEmail = storeSettings.supportEmail || 'support@zivara.fashion';
  const storePhone = storeSettings.supportPhone || '+880 1700-000000';
  const storeAddress = storeSettings.address || 'House 42, Road 11, Banani, Dhaka, Bangladesh';
  
  const invoiceNumber = order.invoice_number || `INV-${order.order_number || order._id}`;
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const paymentStatusBadge = order.payment_status === 'paid' 
    ? '<span style="background:#10B981;color:#ffffff;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:bold;text-transform:uppercase;">PAID</span>'
    : '<span style="background:#F59E0B;color:#ffffff;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:bold;text-transform:uppercase;">UNPAID / COD</span>';

  const itemsRows = (order.items || []).map((item, idx) => `
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 12px 8px; color: #e4e4e7; font-size: 14px;">${idx + 1}</td>
      <td style="padding: 12px 8px; color: #ffffff; font-size: 14px; font-weight: 500;">
        ${item.name}
        ${item.size || item.color ? `<div style="font-size:12px;color:#a1a1aa;margin-top:2px;">Size: ${item.size || 'N/A'} | Color: ${item.color || 'Standard'}</div>` : ''}
      </td>
      <td style="padding: 12px 8px; color: #d4d4d8; font-size: 14px; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px 8px; color: #d4d4d8; font-size: 14px; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 12px 8px; color: #ffffff; font-size: 14px; font-weight: bold; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${invoiceNumber}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; margin: 0; padding: 24px; color: #f4f4f5;">
  <div style="max-width: 680px; margin: 0 auto; background-color: #121215; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #18181b 0%, #09090b 100%); padding: 32px; border-bottom: 2px solid #eab308;">
      <table style="width: 100%;">
        <tr>
          <td>
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #ffffff;">${storeName}</h1>
            <p style="margin: 4px 0 0 0; color: #eab308; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Wear The Future</p>
          </td>
          <td style="text-align: right;">
            <div style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1px;">INVOICE</div>
            <div style="color: #a1a1aa; font-size: 13px; margin-top: 4px;"># ${invoiceNumber}</div>
            <div style="margin-top: 8px;">${paymentStatusBadge}</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Info Grid -->
    <div style="padding: 24px 32px; border-bottom: 1px solid #27272a;">
      <table style="width: 100%;">
        <tr>
          <td style="width: 50%; vertical-align: top;">
            <div style="font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: bold; letter-spacing: 1px; margin-bottom: 6px;">BILL TO:</div>
            <div style="font-size: 15px; font-weight: bold; color: #ffffff;">${order.customer_name}</div>
            <div style="color: #a1a1aa; font-size: 13px; margin-top: 2px;">Email: ${order.customer_email}</div>
            <div style="color: #a1a1aa; font-size: 13px;">Phone: ${order.customer_phone}</div>
            ${order.shipping_address?.address ? `
              <div style="color: #a1a1aa; font-size: 13px; margin-top: 4px;">
                ${order.shipping_address.address}, ${order.shipping_address.city || ''} ${order.shipping_address.zip_code || ''}, ${order.shipping_address.country || 'Bangladesh'}
              </div>
            ` : ''}
          </td>
          <td style="width: 50%; vertical-align: top; text-align: right;">
            <div style="font-size: 11px; text-transform: uppercase; color: #a1a1aa; font-weight: bold; letter-spacing: 1px; margin-bottom: 6px;">ORDER DETAILS:</div>
            <div style="font-size: 13px; color: #e4e4e7;"><strong>Order Number:</strong> ${order.order_number}</div>
            <div style="font-size: 13px; color: #e4e4e7; margin-top: 2px;"><strong>Order Date:</strong> ${orderDate}</div>
            <div style="font-size: 13px; color: #e4e4e7; margin-top: 2px;"><strong>Payment Method:</strong> ${(order.payment_method || 'cod').toUpperCase()}</div>
            ${order.payment_details?.transaction_id ? `
              <div style="font-size: 12px; color: #eab308; margin-top: 2px;"><strong>Txn ID:</strong> ${order.payment_details.transaction_id}</div>
            ` : ''}
          </td>
        </tr>
      </table>
    </div>

    <!-- Items Table -->
    <div style="padding: 24px 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #1f1f23; border-bottom: 2px solid #3f3f46;">
            <th style="padding: 10px 8px; text-align: left; font-size: 11px; color: #a1a1aa; text-transform: uppercase;">#</th>
            <th style="padding: 10px 8px; text-align: left; font-size: 11px; color: #a1a1aa; text-transform: uppercase;">Item & Description</th>
            <th style="padding: 10px 8px; text-align: center; font-size: 11px; color: #a1a1aa; text-transform: uppercase;">Qty</th>
            <th style="padding: 10px 8px; text-align: right; font-size: 11px; color: #a1a1aa; text-transform: uppercase;">Price</th>
            <th style="padding: 10px 8px; text-align: right; font-size: 11px; color: #a1a1aa; text-transform: uppercase;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div style="padding: 0 32px 24px 32px;">
      <table style="width: 100%;">
        <tr>
          <td style="width: 50%; vertical-align: top;">
            <div style="background-color: #18181b; border: 1px dashed #3f3f46; padding: 12px; border-radius: 8px;">
              <div style="font-size: 11px; color: #eab308; font-weight: bold; text-transform: uppercase;">Thank you for your business!</div>
              <div style="font-size: 12px; color: #a1a1aa; margin-top: 4px;">
                For any support or exchange inquiries, please contact <strong>${storeEmail}</strong>.
              </div>
            </div>
          </td>
          <td style="width: 50%; vertical-align: top;">
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #a1a1aa;">Subtotal:</td>
                <td style="padding: 4px 0; text-align: right; color: #ffffff;">$${(order.subtotal || order.total).toFixed(2)}</td>
              </tr>
              ${order.discount ? `
                <tr>
                  <td style="padding: 4px 0; color: #10B981;">Discount:</td>
                  <td style="padding: 4px 0; text-align: right; color: #10B981;">-$${order.discount.toFixed(2)}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 4px 0; color: #a1a1aa;">Shipping Delivery:</td>
                <td style="padding: 4px 0; text-align: right; color: #ffffff;">${(order.shipping || 0) === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</td>
              </tr>
              <tr style="border-top: 1px solid #3f3f46;">
                <td style="padding: 10px 0; font-size: 16px; font-weight: bold; color: #ffffff;">Grand Total:</td>
                <td style="padding: 10px 0; text-align: right; font-size: 20px; font-weight: 800; color: #eab308;">$${order.total.toFixed(2)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="background-color: #09090b; padding: 20px 32px; border-top: 1px solid #27272a; text-align: center; font-size: 12px; color: #71717a;">
      <p style="margin: 0;"><strong>${storeName}</strong> • ${storeAddress} • Tel: ${storePhone}</p>
      <p style="margin: 4px 0 0 0;">This is an electronically generated authentic invoice. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
  `;
}

// Send invoice via email
async function sendOrderInvoiceEmail(order, storeSettings = {}) {
  try {
    const mailer = await getTransporter();
    const invoiceNumber = order.invoice_number || `INV-${order.order_number || order._id}`;
    const storeName = storeSettings.storeName || 'ZIVARA';
    const storeEmail = storeSettings.supportEmail || 'support@zivara.fashion';

    const htmlContent = generateInvoiceHtml(order, storeSettings);

    const mailOptions = {
      from: `"${storeName} Fashion" <${storeEmail}>`,
      to: order.customer_email,
      subject: `Official Invoice - #${invoiceNumber} for Order ${order.order_number} | ${storeName}`,
      html: htmlContent
    };

    const info = await mailer.sendMail(mailOptions);
    console.log(`✉️ Invoice Email successfully dispatched to ${order.customer_email} (MsgID: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 Ethereal Invoice Email Preview URL: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null
    };
  } catch (error) {
    console.error('Send Order Invoice Email Error:', error);
    throw error;
  }
}

module.exports = {
  getTransporter,
  generateInvoiceHtml,
  sendOrderInvoiceEmail
};
