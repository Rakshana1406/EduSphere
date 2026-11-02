// Sends email. Pick ONE option in backend/.env:
//   1) BREVO_API_KEY  (+ MAIL_FROM_EMAIL)  -> HTTPS API, works on Render free plan
//   2) SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS -> e.g. Gmail app password (local use; needs `npm i nodemailer`)
//   3) nothing set -> the email is printed in the backend terminal (handy for development)
const fromName = () => process.env.MAIL_FROM_NAME || "EduSphere";

async function sendViaBrevo({ to, subject, html, text }) {
  const sender = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;
  if (!sender) throw new Error("MAIL_FROM_EMAIL is not set");
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ sender: { name: fromName(), email: sender }, to: [{ email: to }], subject, htmlContent: html, textContent: text }),
  });
  if (!response.ok) throw new Error(`Brevo responded ${response.status}: ${await response.text()}`);
}

async function sendViaSmtp({ to, subject, html, text }) {
  const nodemailer = require("nodemailer"); // loaded only when SMTP is configured
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const email = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;
  await transporter.sendMail({ from: `"${fromName()}" <${email}>`, to, subject, text, html });
}

async function sendMail(message) {
  if (process.env.BREVO_API_KEY) return sendViaBrevo(message);
  if (process.env.SMTP_HOST) return sendViaSmtp(message);

  console.log("\n================ EMAIL (no mail service configured) ================");
  console.log(`To:      ${message.to}`);
  console.log(`Subject: ${message.subject}`);
  console.log(message.text);
  console.log("====================================================================\n");
}

module.exports = { sendMail };
