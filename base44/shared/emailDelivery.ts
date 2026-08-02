type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  senderEmail?: string;
};

type DeliveryResult = {
  provider: "resend" | "gmail";
  messageId: string;
};

async function sendWithResend({ to, subject, html }: EmailMessage): Promise<DeliveryResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const senderDomain = Deno.env.get("RESEND_EMAIL_DOMAIN");
  if (!apiKey || !senderDomain) throw new Error("La configuration Resend est incomplète");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `ClearBank <noreply@${senderDomain}>`,
      to: [to],
      subject,
      html,
    }),
  });
  if (!response.ok) throw new Error(`Resend API error: ${await response.text()}`);

  const result = await response.json();
  return { provider: "resend", messageId: result.id };
}

async function sendWithGmail(base44: any, { to, subject, html, senderEmail }: EmailMessage): Promise<DeliveryResult> {
  const rawMessage = [
    ...(senderEmail ? [`From: ClearBank <${senderEmail}>`] : []),
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    "Content-Type: text/html; charset=UTF-8",
    "MIME-Version: 1.0",
    "",
    html,
  ].join("\r\n");

  const { accessToken } = await base44.asServiceRole.connectors.getConnection("gmail");
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: btoa(unescape(encodeURIComponent(rawMessage))) }),
  });
  if (!response.ok) throw new Error(`Gmail API error: ${await response.text()}`);

  const result = await response.json();
  return { provider: "gmail", messageId: result.id };
}

export async function deliverEmail(base44: any, message: EmailMessage): Promise<DeliveryResult> {
  try {
    return await sendWithResend(message);
  } catch (resendError) {
    try {
      return await sendWithGmail(base44, message);
    } catch (gmailError) {
      throw new Error(
        `Échec Resend: ${resendError instanceof Error ? resendError.message : String(resendError)}; ` +
          `échec Gmail: ${gmailError instanceof Error ? gmailError.message : String(gmailError)}`,
      );
    }
  }
}
