const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
        : undefined
});

const sendMail = async ({ to, subject, html }) => {
    if (!to) {
        return null;
    }

    return transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@shubhmuhurat.local',
        to,
        subject,
        html
    });
};

exports.sendBookingConfirmation = async (booking) => {
    return sendMail({
        to: booking.email,
        subject: 'Booking received - Shubh Muhurat',
        html: `<p>Hi ${booking.name}, we've received your booking request for ${new Date(booking.date).toLocaleDateString()}.</p><p>Your tracking code is <strong>${booking.trackingCode || 'N/A'}</strong>.</p>`
    });
};

exports.sendBookingStatusUpdate = async (booking) => {
    return sendMail({
        to: booking.email,
        subject: 'Your booking update - Shubh Muhurat',
        html: `<p>Hi ${booking.name}, your booking status is now <strong>${booking.status}</strong>.</p><p>Track it here: ${process.env.PUBLIC_BASE_URL || ''}/booking-track.html?code=${booking.trackingCode || ''}</p>`
    });
};