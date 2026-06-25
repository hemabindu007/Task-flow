import nodemailer from "nodemailer";
import path from 'path';
import fs from 'fs'

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || "gmail",
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string,
  firstName: string
) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@taskflow.com";
  const templatePath = path.join(__dirname, '../../email-template/forgot-password.html');
  let emailTemplate = fs.readFileSync(templatePath, 'utf8');
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !emailTemplate) {
          return;
        }
          let replacedTemplate = emailTemplate
                .replace('{{firstName}}', firstName)
                .replace('{{resetUrl}}', resetUrl)
                .replace('{{date}}', new Date().getFullYear().toString());
                if(!replacedTemplate){
                  return;
                }
                await transporter.sendMail({
                    from,
                    to: email,
                    subject: "Reset your TaskFlow password",
                    html: replacedTemplate,
                });
};
