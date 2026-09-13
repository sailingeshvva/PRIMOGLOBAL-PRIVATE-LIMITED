const emailRoutes = {
  general: "info@primeglobal.org.in",
  product: "sales@primeglobal.org.in",
  supplier: "sales@primeglobal.org.in",
  technical: "tech@primeglobal.org.in",
  career: "hr@primeglobal.org.in"
};

function clean(value) {
  return String(value || "").trim().slice(0, 2000);
}

function response(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    response(res, 405, { ok: false, message: "Method not allowed" });
    return;
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    response(res, 400, { ok: false, message: "Invalid request" });
    return;
  }

  const startedAt = Number(body.startedAt || 0);
  const elapsed = Date.now() - startedAt;
  if (clean(body.website) || elapsed < 2200) {
    response(res, 400, { ok: false, message: "Spam check failed" });
    return;
  }

  const route = emailRoutes[clean(body.type)] || emailRoutes.general;
  const subject = `Primoglobal enquiry - ${clean(body.company) || clean(body.name) || "Website"}`;
  const text = [
    `Enquiry type: ${clean(body.type)}`,
    `Name: ${clean(body.name)}`,
    `Company: ${clean(body.company)}`,
    `Country: ${clean(body.country)}`,
    `Business email: ${clean(body.email)}`,
    `Phone/WhatsApp: ${clean(body.phone)}`,
    `Product interested in: ${clean(body.product)}`,
    `Required quantity: ${clean(body.quantity)}`,
    `Expected purchase frequency: ${clean(body.frequency)}`,
    `Specification: ${clean(body.specification)}`,
    `Packaging requirement: ${clean(body.packaging)}`,
    `Destination port/country: ${clean(body.destination)}`,
    `Message: ${clean(body.message)}`
  ].join("\n");

  if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
    response(res, 202, {
      ok: true,
      route,
      message: "Enquiry received. Email service is not configured in this environment."
    });
    return;
  }

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to: [route],
      reply_to: clean(body.email),
      subject,
      text
    })
  });

  if (!emailResponse.ok) {
    response(res, 502, { ok: false, message: "Email service failed" });
    return;
  }

  response(res, 200, { ok: true, route, message: "Enquiry submitted" });
};
