const nodemailer = require("nodemailer");

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.warn("Warning: SMTP configuration not set. Email functionality will be disabled.");
}

exports.sendContactResponseEmail = async (contactName, contactEmail, subject, response) => {
  if (!transporter) {
    console.warn("Email transporter not configured. Skipping email send.");
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || "Mentor App <noreply@mentor.com>",
      to: contactEmail,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Response to Your Contact Request</h2>
          <p>Dear ${contactName},</p>
          <p>Thank you for contacting us. We have received your message and here is our response:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${response}</p>
          </div>
          <p>If you have any further questions, please don't hesitate to contact us again.</p>
          <p>Best regards,<br>The Mentor Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Contact response email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending contact response email:", error);
    return false;
  }
};

exports.sendCourseRegistrationEmail = async (userName, userEmail, courseTitle, courseSchedule) => {
  if (!transporter) {
    console.warn("Email transporter not configured. Skipping email send.");
    return false;
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || "Mentor App <noreply@mentor.com>",
      to: userEmail,
      subject: `Course Registration Confirmation: ${courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Course Registration Confirmation</h2>
          <p>Dear ${userName},</p>
          <p>Congratulations! You have successfully registered for the following course:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #28a745;">${courseTitle}</h3>
            <p><strong>Schedule:</strong> ${courseSchedule}</p>
          </div>
          <p>We're excited to have you join us! You will receive further details about the course via email.</p>
          <p>If you have any questions, please feel free to contact us.</p>
          <p>Best regards,<br>The Mentor Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Course registration email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending course registration email:", error);
    return false;
  }
};

