import { env } from "../../config/env";
import type { RightsRequestRecord, RightsRequestStatus } from "./rights.types";
const nodemailer = require("nodemailer") as {
  createTransport: (config: Record<string, unknown>) => {
    sendMail: (payload: Record<string, unknown>) => Promise<unknown>;
    verify: () => Promise<unknown>;
  };
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const clean = (value: string | undefined) => (value || "").trim();
let missingSmtpConfigWarned = false;
let smtpVerified = false;

const formatDateTime = (isoValue: string) => {
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) return isoValue;
  return parsed.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const createSmtpTransport = () => {
  const user = clean(env.EMAIL_USER);
  const pass = clean(env.EMAIL_PASS);
  if (!user || !pass) {
    if (!missingSmtpConfigWarned) {
      console.warn("Skipping SMTP email: missing configuration -> EMAIL_USER, EMAIL_PASS");
      missingSmtpConfigWarned = true;
    }
    return null;
  }

  const host = clean(env.SMTP_HOST) || "smtp.gmail.com";
  const port = env.SMTP_PORT || 587;
  const secure = Boolean(env.SMTP_SECURE) || port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

const sendViaSmtp = async (input: { to: string; subject: string; html: string; text: string }) => {
  const transport = createSmtpTransport();
  if (!transport) return false;

  if (!smtpVerified) {
    try {
      await transport.verify();
      smtpVerified = true;
    } catch (error) {
      console.error("SMTP verification failed:", error);
      return false;
    }
  }

  const from = clean(env.EMAIL_FROM) || clean(env.EMAIL_USER);
  if (!from) {
    console.warn("Skipping SMTP email: missing EMAIL_FROM or EMAIL_USER");
    return false;
  }

  await transport.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
  return true;
};

const sendEmail = async (input: { to: string; subject: string; html: string; text: string }) => {
  await sendViaSmtp(input);
};

const buildUserEmail = (record: RightsRequestRecord) => {
  const submittedOn = formatDateTime(record.createdAt);
  const requestType = clean(record.requestType);
  const requestId = clean(record.id);
  const userName = escapeHtml(clean(record.fullName) || "User");
  const supportEmail = clean(env.RIGHTS_MANAGER_EMAIL) || clean(env.ADMIN_EMAIL) || "contact@protecciodata.com";

  const subject = "Your Request Has Been Received - Proteccio";
  const text = [
    `Dear ${clean(record.fullName) || "User"},`,
    "",
    "Thank you for submitting your User Rights Management request with Proteccio.",
    "",
    "We have successfully received your request and it is currently under review by our administrative team.",
    "",
    "Request Details:",
    "--------------------------------------------------",
    `Request ID: ${requestId || "-"}`,
    `Request Type: ${requestType || "-"}`,
    `Submitted On: ${submittedOn || "-"}`,
    "--------------------------------------------------",
    "",
    "Our team will review your request and get back to you if any further information is required.",
    "",
    "If you did not submit this request, please contact our support team immediately.",
    "",
    "Best Regards,",
    "Proteccio Support Team",
    supportEmail ? `Contact: ${supportEmail}` : "",
    "",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color:#0f172a; line-height:1.5;">
      <p>Dear ${userName},</p>
      <p>Thank you for submitting your User Rights Management request with Proteccio.</p>
      <p>We have successfully received your request and it is currently under review by our administrative team.</p>
      <p style="margin: 12px 0 8px 0;"><strong>Request Details:</strong></p>
      <div style="font-family: 'Courier New', monospace;">--------------------------------------------------</div>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; margin-top: 6px;">
        <tr><td><strong>Request ID</strong></td><td>${escapeHtml(requestId || "-")}</td></tr>
        <tr><td><strong>Request Type</strong></td><td>${escapeHtml(requestType || "-")}</td></tr>
        <tr><td><strong>Submitted On</strong></td><td>${escapeHtml(submittedOn || "-")}</td></tr>
      </table>
      <div style="font-family: 'Courier New', monospace; margin-top: 4px;">--------------------------------------------------</div>
      <p>Our team will review your request and get back to you if any further information is required.</p>
      <p>If you did not submit this request, please contact our support team immediately.</p>
      <p style="margin-bottom: 0;">Best Regards,<br/>Proteccio Support Team</p>
      ${supportEmail ? `<p style="margin-top: 6px;">Contact: ${escapeHtml(supportEmail)}</p>` : ""}
    </div>
  `;

  return { subject, text, html };
};

const buildManagerEmail = (record: RightsRequestRecord) => {
  const submittedOn = formatDateTime(record.createdAt);
  const requestId = clean(record.id);
  const subject = "New User Rights Management Request Submitted";
  const text = [
    "Hello Admin,",
    "",
    "A new User Rights Management request has been submitted.",
    "",
    "User Details:",
    "--------------------------------------------------",
    `Name: ${clean(record.fullName) || "-"}`,
    `Email: ${clean(record.email) || "-"}`,
    `Phone: ${clean(record.phone) || "-"}`,
    `Request Type: ${clean(record.requestType) || "-"}`,
    `Request ID: ${requestId || "-"}`,
    `Submitted On: ${submittedOn || "-"}`,
    "--------------------------------------------------",
    "",
    "Please log in to the admin dashboard to review and take appropriate action.",
    "",
    "Proteccio System Notification",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color:#0f172a; line-height:1.5;">
      <p>Hello Admin,</p>
      <p>A new User Rights Management request has been submitted.</p>
      <p style="margin: 12px 0 8px 0;"><strong>User Details:</strong></p>
      <div style="font-family: 'Courier New', monospace;">--------------------------------------------------</div>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse; margin-top: 6px;">
        <tr><td><strong>Name</strong></td><td>${escapeHtml(clean(record.fullName) || "-")}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(clean(record.email) || "-")}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(clean(record.phone) || "-")}</td></tr>
        <tr><td><strong>Request Type</strong></td><td>${escapeHtml(clean(record.requestType) || "-")}</td></tr>
        <tr><td><strong>Request ID</strong></td><td>${escapeHtml(requestId || "-")}</td></tr>
        <tr><td><strong>Submitted On</strong></td><td>${escapeHtml(submittedOn || "-")}</td></tr>
      </table>
      <div style="font-family: 'Courier New', monospace; margin-top: 4px;">--------------------------------------------------</div>
      <p>Please log in to the admin dashboard to review and take appropriate action.</p>
      <p>Proteccio System Notification</p>
    </div>
  `;

  return { subject, text, html };
};

const statusLabel = (status: RightsRequestStatus) => {
  if (status === "in_progress") return "In Progress";
  if (status === "completed") return "Completed";
  return "Pending";
};

const buildUserStatusUpdateEmail = (
  record: RightsRequestRecord,
  previousStatus: RightsRequestStatus,
  nextStatus: RightsRequestStatus
) => {
  const requestId = clean(record.id);
  const requestType = clean(record.requestType);
  const updatedOn = formatDateTime(new Date().toISOString());
  const supportEmail = clean(env.RIGHTS_MANAGER_EMAIL) || "contact@protecciodata.com";
  const subject = `Update on Your Privacy Rights Request [${requestId}]`;

  const text = [
    `Hi ${clean(record.fullName) || "User"},`,
    "",
    "Your privacy rights request status has been updated.",
    `Request ID: ${requestId}`,
    `Request Type: ${requestType || "-"}`,
    `Previous Status: ${statusLabel(previousStatus)}`,
    `Current Status: ${statusLabel(nextStatus)}`,
    `Updated On: ${updatedOn}`,
    "",
    `For support, contact: ${supportEmail}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color:#0f172a; line-height:1.5;">
      <p>Hi ${escapeHtml(clean(record.fullName) || "User")},</p>
      <p>Your privacy rights request status has been updated.</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Request ID</strong></td><td>${escapeHtml(requestId)}</td></tr>
        <tr><td><strong>Request Type</strong></td><td>${escapeHtml(requestType || "-")}</td></tr>
        <tr><td><strong>Previous Status</strong></td><td>${escapeHtml(statusLabel(previousStatus))}</td></tr>
        <tr><td><strong>Current Status</strong></td><td>${escapeHtml(statusLabel(nextStatus))}</td></tr>
        <tr><td><strong>Updated On</strong></td><td>${escapeHtml(updatedOn)}</td></tr>
      </table>
      <p>For support, contact: ${escapeHtml(supportEmail)}</p>
    </div>
  `;

  return { subject, text, html };
};

const buildManagerStatusUpdateEmail = (
  record: RightsRequestRecord,
  previousStatus: RightsRequestStatus,
  nextStatus: RightsRequestStatus
) => {
  const requestId = clean(record.id);
  const dashboardUrl = clean(env.DASHBOARD_URL) || `${clean(env.FRONTEND_URL).replace(/\/$/, "")}/dashboard`;
  const subject = `Rights Request Status Updated [${requestId}] ${statusLabel(previousStatus)} -> ${statusLabel(nextStatus)}`;

  const text = [
    "A rights request status was updated from the admin dashboard.",
    "",
    `Request ID: ${requestId}`,
    `Request Type: ${clean(record.requestType) || "-"}`,
    `User: ${clean(record.fullName)} (${clean(record.email)})`,
    `Previous Status: ${statusLabel(previousStatus)}`,
    `Current Status: ${statusLabel(nextStatus)}`,
    `Dashboard: ${dashboardUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color:#0f172a; line-height:1.5;">
      <p>A rights request status was updated from the admin dashboard.</p>
      <table cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
        <tr><td><strong>Request ID</strong></td><td>${escapeHtml(requestId)}</td></tr>
        <tr><td><strong>Request Type</strong></td><td>${escapeHtml(clean(record.requestType) || "-")}</td></tr>
        <tr><td><strong>User</strong></td><td>${escapeHtml(`${clean(record.fullName)} (${clean(record.email)})`)}</td></tr>
        <tr><td><strong>Previous Status</strong></td><td>${escapeHtml(statusLabel(previousStatus))}</td></tr>
        <tr><td><strong>Current Status</strong></td><td>${escapeHtml(statusLabel(nextStatus))}</td></tr>
      </table>
      <p style="margin-top:14px;">
        <a href="${escapeHtml(dashboardUrl)}" style="color:#16a34a; text-decoration:none;">Open Dashboard</a>
      </p>
    </div>
  `;

  return { subject, text, html };
};

export const rightsEmailService = {
  async sendSubmissionNotifications(record: RightsRequestRecord) {
    if (!env.ENABLE_RIGHTS_EMAIL_NOTIFICATIONS) return;
    const managerEmail = clean(env.ADMIN_EMAIL) || clean(env.RIGHTS_MANAGER_EMAIL) || "contact@protecciodata.com";
    const userEmail = clean(record.email);

    const promises: Promise<void>[] = [];

    if (userEmail) {
      const userTemplate = buildUserEmail(record);
      promises.push(
        sendEmail({
          to: userEmail,
          subject: userTemplate.subject,
          html: userTemplate.html,
          text: userTemplate.text,
        })
      );
    }

    if (managerEmail) {
      const managerTemplate = buildManagerEmail(record);
      promises.push(
        sendEmail({
          to: managerEmail,
          subject: managerTemplate.subject,
          html: managerTemplate.html,
          text: managerTemplate.text,
        })
      );
    }

    if (!promises.length) return;

    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Rights-request email dispatch failed:", result.reason);
      }
    });
  },

  async sendStatusUpdateNotifications(
    record: RightsRequestRecord,
    previousStatus: RightsRequestStatus,
    nextStatus: RightsRequestStatus
  ) {
    if (!env.ENABLE_RIGHTS_EMAIL_NOTIFICATIONS) return;
    if (previousStatus === nextStatus) return;

    const managerEmail = clean(env.ADMIN_EMAIL) || clean(env.RIGHTS_MANAGER_EMAIL) || "contact@protecciodata.com";
    const userEmail = clean(record.email);
    const promises: Promise<void>[] = [];

    if (userEmail) {
      const userTemplate = buildUserStatusUpdateEmail(record, previousStatus, nextStatus);
      promises.push(
        sendEmail({
          to: userEmail,
          subject: userTemplate.subject,
          html: userTemplate.html,
          text: userTemplate.text,
        })
      );
    }

    if (managerEmail) {
      const managerTemplate = buildManagerStatusUpdateEmail(record, previousStatus, nextStatus);
      promises.push(
        sendEmail({
          to: managerEmail,
          subject: managerTemplate.subject,
          html: managerTemplate.html,
          text: managerTemplate.text,
        })
      );
    }

    if (!promises.length) return;
    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("Rights-status email dispatch failed:", result.reason);
      }
    });
  },
};
