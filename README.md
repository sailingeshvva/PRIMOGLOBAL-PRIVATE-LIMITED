# Primoglobal Private Limited Website

Premium B2B import/export website for Primoglobal Private Limited.

## Preview

Run locally from this folder:

```bash
python -m http.server 4173
```

Open `http://localhost:4173/`.

## Enquiry Email Routing

The frontend posts to `api/enquiry.js`, which routes:

- General enquiry: `info@primeglobal.org.in`
- Product/buyer enquiry: `sales@primeglobal.org.in`
- Supplier partnership: `sales@primeglobal.org.in`
- Technical issue: `tech@primeglobal.org.in`
- Career enquiry: `hr@primeglobal.org.in`

For automatic email sending, deploy on a serverless host that supports Node functions and set:

- `RESEND_API_KEY`
- `FROM_EMAIL`

Use an email sender/domain owned by Primoglobal. Do not put email API keys in frontend code.

## Product CMS Readiness

Product publishing is intentionally data-driven. Use `cms/product-schema.json` and `data/products.json` as the starting structure for:

`Admin -> Products -> Add Product -> Upload Photo -> Description -> Specifications -> Publish`

Only publish product pages after Primoglobal confirms actual supply readiness, specifications, packaging, MOQ where applicable and quality information.

## Launch Checklist

- Replace the temporary text wordmark with the official Primoglobal logo asset.
- Add the official business phone/WhatsApp number.
- Configure DNS and SSL for `www.primeglobal.org.in`.
- Verify Google Search Console and submit `sitemap.xml`.
- Add the Google Analytics tag only under a Primoglobal-controlled account.
- Confirm website backups and administrator access remain under Primoglobal control.
