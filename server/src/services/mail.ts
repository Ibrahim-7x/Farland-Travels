import nodemailer, { type Transporter } from "nodemailer";
import { env, isSmtpConfigured } from "../config/env";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!isSmtpConfigured()) return null;
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
    });
  }
  return cachedTransporter;
}

export interface EnquiryEmailInput {
  type: string;
  name: string;
  email: string;
  phone?: string | null;
  sourcePage?: string | null;
  payload?: Record<string, unknown> | null;
}

/**
 * Send a new-enquiry notification to NOTIFY_EMAIL. Degrades gracefully: if
 * SMTP or NOTIFY_EMAIL is not configured (or sending fails) it logs a warning
 * and returns false — the caller has already persisted the enquiry.
 */
export async function sendEnquiryNotification(
  enquiry: EnquiryEmailInput,
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter || !env.NOTIFY_EMAIL) {
    console.warn(
      "[mail] SMTP/NOTIFY_EMAIL not configured — enquiry stored but no email sent.",
    );
    return false;
  }

  const lines = [
    `New ${enquiry.type} enquiry from the website`,
    "",
    `Name:   ${enquiry.name}`,
    `Email:  ${enquiry.email}`,
    `Phone:  ${enquiry.phone ?? "—"}`,
    `Page:   ${enquiry.sourcePage ?? "—"}`,
  ];
  if (enquiry.payload && Object.keys(enquiry.payload).length > 0) {
    lines.push("", "Details:");
    for (const [key, value] of Object.entries(enquiry.payload)) {
      lines.push(`  ${key}: ${JSON.stringify(value)}`);
    }
  }

  try {
    await transporter.sendMail({
      from: env.SMTP_USER ?? env.NOTIFY_EMAIL,
      to: env.NOTIFY_EMAIL,
      replyTo: enquiry.email,
      subject: `New ${enquiry.type} enquiry — ${enquiry.name}`,
      text: lines.join("\n"),
    });
    return true;
  } catch (error) {
    console.warn("[mail] Failed to send enquiry notification:", error);
    return false;
  }
}
