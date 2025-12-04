// ============================
// EMAIL API FOR VERCEL
// Bot Fixred Beckk v3.0
// ============================

const nodemailer = require('nodemailer');

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Main handler
module.exports = async (req, res) => {
  // Handle OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.',
      error: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const {
      api_key,
      to,
      subject,
      body,
      from_email,
      from_password
    } = req.body;

    // Validate API key
    const VALID_API_KEY = process.env.API_KEY || 'beckk001';
    if (api_key !== VALID_API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'API key tidak valid',
        error: 'INVALID_API_KEY'
      });
    }

    // Validate required fields
    if (!to || !subject || !body || !from_email || !from_password) {
      return res.status(400).json({
        success: false,
        message: 'Parameter tidak lengkap',
        error: 'MISSING_PARAMS',
        required: ['api_key', 'to', 'subject', 'body', 'from_email', 'from_password']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to) || !emailRegex.test(from_email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid',
        error: 'INVALID_EMAIL'
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: from_email,
        pass: from_password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      return res.status(401).json({
        success: false,
        message: 'Gmail authentication failed. Pastikan menggunakan App Password.',
        error: 'INVALID_PASSWORD',
        details: verifyError.message
      });
    }

    // Mail options
    const mailOptions = {
      from: `"WhatsApp Appeal" <${from_email}>`,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Email berhasil terkirim!',
      data: {
        to: to,
        subject: subject,
        messageId: info.messageId,
        sent_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error sending email:', error);

    // Error response
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirim email',
      error: 'SMTP_ERROR',
      details: error.message
    });
  }
};

// Export with CORS
module.exports = async (req, res) => {
  // Set CORS headers
  Object.keys(corsHeaders).forEach(key => {
    res.setHeader(key, corsHeaders[key]);
  });

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      error: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const {
      api_key,
      to,
      subject,
      body,
      from_email,
      from_password
    } = req.body;

    // Validate API key
    const VALID_API_KEY = process.env.API_KEY || 'beckk001';
    if (api_key !== VALID_API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'API key tidak valid',
        error: 'INVALID_API_KEY'
      });
    }

    // Validate required
    if (!to || !subject || !body || !from_email || !from_password) {
      return res.status(400).json({
        success: false,
        message: 'Parameter tidak lengkap',
        error: 'MISSING_PARAMS'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to) || !emailRegex.test(from_email)) {
      return res.status(400).json({
        success: false,
        message: 'Format email tidak valid',
        error: 'INVALID_EMAIL'
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: from_email,
        pass: from_password
      }
    });

    // Verify
    await transporter.verify();

    // Send
    const info = await transporter.sendMail({
      from: from_email,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    });

    return res.status(200).json({
      success: true,
      message: 'Email berhasil terkirim!',
      data: {
        to: to,
        subject: subject,
        messageId: info.messageId,
        sent_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengirim email',
      error: 'SMTP_ERROR',
      details: error.message
    });
  }
};
