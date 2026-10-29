import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const recipientEmail = "office@nwdagency.com";
const turnstileVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileVerificationResponse = {
  success: boolean;
  "error-codes"?: string[];
};

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

function getClientIp(request: Request) {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
}

async function verifyTurnstile(formData: FormData, request: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing environment variable: TURNSTILE_SECRET_KEY");
    }

    return true;
  }

  const token = getField(formData, "cf-turnstile-response");
  if (!token) {
    return false;
  }

  const verificationData = new FormData();
  verificationData.append("secret", secret);
  verificationData.append("response", token);

  const remoteIp = getClientIp(request);
  if (remoteIp) {
    verificationData.append("remoteip", remoteIp);
  }

  const response = await fetch(turnstileVerifyUrl, {
    method: "POST",
    body: verificationData
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as TurnstileVerificationResponse;

  if (!result.success) {
    console.warn("Turnstile verification failed", result["error-codes"]);
  }

  return result.success;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeHtmlWithBreaks(value: string) {
  return escapeHtml(value).replaceAll(/\r?\n/g, "<br>");
}

function renderEmailTemplate(
  lines: string[][],
  email: string,
  company: string,
  engagement: string
) {
  const appUrl = (process.env.APP_URL ?? "").replace(/\/$/, "");
  const logoUrl = appUrl ? `${appUrl}/assets/email-logo.png` : "";
  const replyHref = email
    ? `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
        `Re: NWD contact form${company ? ` - ${company}` : ""}`
      )}`
    : `mailto:${recipientEmail}`;
  const submittedAt = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Belgrade"
  }).format(new Date());

  const fieldRows = lines
    .map(
      ([label, value]) => `
        <tr>
          <td class="email-label" width="190" valign="top" style="border-bottom:1px solid #d9d5cc;padding:18px 0;vertical-align:top;width:190px;">
            <span style="color:#ff4c1f;display:block;font-family:'JetBrains Mono','Courier New',monospace;font-size:11px;font-weight:600;letter-spacing:3px;line-height:16px;mso-line-height-rule:exactly;text-transform:uppercase;">${escapeHtml(label)}</span>
          </td>
          <td class="email-field" valign="top" style="border-bottom:1px solid #d9d5cc;padding:18px 0;vertical-align:top;">
            <span style="color:#101010;display:block;font-family:Inter,Arial,Helvetica,sans-serif;font-size:18px;line-height:28px;mso-line-height-rule:exactly;">${escapeHtmlWithBreaks(value || "-")}</span>
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
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <title>New NWD contact form submission</title>
    <style>
      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }

      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }

      table,
      td {
        mso-table-lspace: 0pt !important;
        mso-table-rspace: 0pt !important;
      }

      table {
        border-collapse: collapse !important;
        border-spacing: 0 !important;
      }

      img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        display: block;
        line-height: 100%;
        outline: none;
        text-decoration: none;
      }

      a {
        color: inherit;
      }

      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }

      @media screen and (max-width: 640px) {
        .email-shell {
          padding: 24px 14px !important;
        }

        .email-container {
          width: 100% !important;
        }

        .email-card {
          padding-left: 24px !important;
          padding-right: 24px !important;
        }

        .email-logo-cell,
        .email-date-cell,
        .email-label,
        .email-field {
          display: block !important;
          width: 100% !important;
        }

        .email-date-cell {
          padding-top: 16px !important;
          text-align: left !important;
        }

        .email-h1 {
          font-size: 34px !important;
          line-height: 38px !important;
        }

        .email-engagement {
          font-size: 20px !important;
          line-height: 27px !important;
        }

        .email-field {
          padding-top: 8px !important;
        }

        .email-field span {
          font-size: 16px !important;
          line-height: 25px !important;
        }
      }
    </style>
    <!--[if mso]>
      <style>
        .email-body-font {
          font-family: Arial, Helvetica, sans-serif !important;
        }
      </style>
    <![endif]-->
  </head>
  <body class="email-body-font" bgcolor="#f3f0e8" style="background-color:#f3f0e8;color:#101010;margin:0;padding:0;width:100%;">
    <div style="color:#f3f0e8;display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;mso-hide:all;opacity:0;overflow:hidden;">
      New NWD contact form submission${company ? ` from ${escapeHtml(company)}` : ""}.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f0e8" style="background-color:#f3f0e8;border-collapse:collapse;margin:0;padding:0;width:100%;">
      <tr>
        <td class="email-shell" align="center" style="padding:36px 18px;">
          <table class="email-container" role="presentation" width="760" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 auto;max-width:760px;width:760px;">
            <tr>
              <td style="padding:6px 0 42px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
                  <tr>
                    <td class="email-logo-cell" valign="middle" style="vertical-align:middle;">
                      ${
                        logoUrl
                          ? `<img src="${escapeHtml(logoUrl)}" width="180" height="47" alt="New Direction" style="border:0;display:block;height:auto;max-width:180px;outline:none;text-decoration:none;width:180px;">`
                          : `<span style="color:#101010;font-family:Inter,Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.02em;line-height:24px;mso-line-height-rule:exactly;">New Direction</span>`
                      }
                    </td>
                    <td class="email-date-cell" align="right" valign="middle" style="text-align:right;vertical-align:middle;">
                      <span style="color:#66635d;font-family:'JetBrains Mono','Courier New',monospace;font-size:11px;letter-spacing:2px;line-height:16px;mso-line-height-rule:exactly;text-transform:uppercase;">${escapeHtml(submittedAt)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-card" bgcolor="#111111" style="background-color:#111111;border-radius:18px 18px 0 0;padding:38px 42px 36px;">
                <p style="color:#ff4c1f;font-family:'JetBrains Mono','Courier New',monospace;font-size:12px;font-weight:600;letter-spacing:5px;line-height:18px;margin:0 0 20px;mso-line-height-rule:exactly;text-transform:uppercase;">Contact</p>
                <h1 class="email-h1" style="color:#f3f0e8;font-family:Inter,Arial,Helvetica,sans-serif;font-size:44px;font-weight:700;letter-spacing:-1.7px;line-height:46px;margin:0;max-width:560px;mso-line-height-rule:exactly;">New brand growth inquiry</h1>
                <p class="email-engagement" style="color:#f3f0e8;font-family:Inter,Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;line-height:30px;margin:26px 0 0;max-width:580px;mso-line-height-rule:exactly;">${escapeHtml(engagement || "-")}</p>
                <p style="color:#d9d5cc;font-family:Inter,Arial,Helvetica,sans-serif;font-size:18px;line-height:28px;margin:24px 0 0;max-width:560px;mso-line-height-rule:exactly;">Someone submitted the NWD contact form. Reply directly to continue the conversation.</p>
              </td>
            </tr>
            <tr>
              <td class="email-card" bgcolor="#e7e4dd" style="background-color:#e7e4dd;border-radius:0 0 18px 18px;padding:34px 42px 40px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%;">
                  ${fieldRows}
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:34px;">
                  <tr>
                    <td>
                      <a href="${escapeHtml(replyHref)}" style="color:#000000;display:inline-block;font-family:Inter,Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;line-height:25px;mso-line-height-rule:exactly;text-decoration:underline;">Reply to sender</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 0 0;text-align:center;">
                <p style="color:#66635d;font-family:Inter,Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;margin:0;mso-line-height-rule:exactly;">NWD Brand Growth System</p>
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

    const isTurnstileValid = await verifyTurnstile(formData, request);
    if (!isTurnstileValid) {
      return NextResponse.json(
        { message: "Verification failed. Please refresh and try again." },
        { status: 400 }
      );
    }

    const smtpPort = Number(getRequiredEnv("SMTP_PORT"));
    const transporter = nodemailer.createTransport({
      host: getRequiredEnv("SMTP_HOST"),
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: smtpPort !== 465,
      auth: {
        user: getRequiredEnv("SMTP_USER"),
        pass: getRequiredEnv("SMTP_PASS")
      },
      authMethod: "LOGIN"
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

    const html = renderEmailTemplate(lines, email, company, engagement);

    await transporter.sendMail({
      from: getRequiredEnv("SMTP_FROM"),
      to: recipientEmail,
      replyTo: recipientEmail,
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
