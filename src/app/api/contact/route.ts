import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const recipientEmail = "office@nwdagency.com";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderEmailTemplate(lines: string[][], email: string, company: string) {
  const appUrl = (process.env.APP_URL ?? "").replace(/\/$/, "");
  const logoUrl = appUrl ? `${appUrl}/assets/logo.svg` : "";
  const submittedAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Belgrade"
  }).format(new Date());

  const fieldRows = lines
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:18px 0;border-bottom:1px solid #d9d5cc;vertical-align:top;width:190px;">
            <span style="display:block;color:#ff4c1f;font-family:'JetBrains Mono','Courier New',monospace;font-size:11px;font-weight:600;letter-spacing:3px;line-height:1.4;text-transform:uppercase;">${escapeHtml(label)}</span>
          </td>
          <td style="padding:18px 0;border-bottom:1px solid #d9d5cc;vertical-align:top;">
            <span style="display:block;color:#101010;font-family:Inter,Arial,sans-serif;font-size:18px;line-height:1.55;white-space:pre-wrap;">${escapeHtml(value || "-")}</span>
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>New NWD contact form submission</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f0e8;color:#101010;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      New NWD contact form submission${company ? ` from ${escapeHtml(company)}` : ""}.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f0e8;border-collapse:collapse;margin:0;padding:0;width:100%;">
      <tr>
        <td align="center" style="padding:36px 18px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;max-width:760px;width:100%;">
            <tr>
              <td style="padding:0 0 22px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      ${
                        logoUrl
                          ? `<img src="${escapeHtml(logoUrl)}" width="180" alt="New Direction" style="border:0;display:block;height:auto;max-width:180px;">`
                          : `<span style="color:#101010;font-family:Inter,Arial,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.02em;">New Direction</span>`
                      }
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="color:#66635d;font-family:'JetBrains Mono','Courier New',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;">${escapeHtml(submittedAt)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#111;border-radius:18px 18px 0 0;padding:38px 42px 36px;">
                <p style="color:#ff4c1f;font-family:'JetBrains Mono','Courier New',monospace;font-size:12px;font-weight:600;letter-spacing:5px;line-height:1.4;margin:0 0 20px;text-transform:uppercase;">Contact</p>
                <h1 style="color:#f3f0e8;font-family:Inter,Arial,sans-serif;font-size:44px;font-weight:700;letter-spacing:-1.7px;line-height:1.05;margin:0;max-width:560px;">New brand growth inquiry</h1>
                <p style="color:#d9d5cc;font-family:Inter,Arial,sans-serif;font-size:18px;line-height:1.55;margin:24px 0 0;max-width:560px;">Someone submitted the NWD contact form. Reply directly to continue the conversation.</p>
              </td>
            </tr>
            <tr>
              <td style="background:#e7e4dd;border-radius:0 0 18px 18px;padding:34px 42px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;">
                  ${fieldRows}
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:34px;">
                  <tr>
                    <td style="background:#ff4c1f;border-radius:999px;">
                      <a href="mailto:${escapeHtml(email)}" style="color:#101010;display:inline-block;font-family:Inter,Arial,sans-serif;font-size:18px;font-weight:700;line-height:1;padding:18px 28px;text-decoration:none;">Reply to sender</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 0 0;text-align:center;">
                <p style="color:#66635d;font-family:Inter,Arial,sans-serif;font-size:13px;line-height:1.5;margin:0;">NWD Brand Growth System</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = getField(formData, "firstName");
    const lastName = getField(formData, "lastName");
    const email = getField(formData, "email");
    const company = getField(formData, "company");
    const challenge = getField(formData, "challenge");
    const engagement = getField(formData, "engagement");
    const message = getField(formData, "message");

    if (!email || !engagement) {
      return NextResponse.json(
        { message: "Please enter your email and choose how you would like to work with NWD." },
        { status: 400 }
      );
    }

    const smtpPort = Number(getRequiredEnv("SMTP_PORT"));
    const transporter = nodemailer.createTransport({
      host: getRequiredEnv("SMTP_HOST"),
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: getRequiredEnv("SMTP_USER"),
        pass: getRequiredEnv("SMTP_PASS")
      }
    });

    const lines = [
      ["First name", firstName],
      ["Last name", lastName],
      ["Email", email],
      ["Company / Brand", company],
      ["Challenge", challenge],
      ["Engagement", engagement],
      ["Message", message],
      ["Page", process.env.APP_URL ?? ""]
    ];

    const text = lines
      .map(([label, value]) => `${label}: ${value || "-"}`)
      .join("\n");

    const html = renderEmailTemplate(lines, email, company);

    await transporter.sendMail({
      from: getRequiredEnv("SMTP_FROM"),
      to: recipientEmail,
      replyTo: email,
      subject: `NWD contact form${company ? ` - ${company}` : ""}`,
      text,
      html
    });

    return NextResponse.json({ message: "Message sent. Thank you." });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { message: "Message could not be sent. Please try again later." },
      { status: 500 }
    );
  }
}
