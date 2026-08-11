import express, { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { IncomingHttpHeaders } from "http";
import { Request as ExpressRequest } from "express";

const router = express.Router();



router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Webhooks API");
});

router.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("pong");
});

// TEST
router.post(
  "/testing",
  (req: Request, res: Response) => {
    console.log(req.headers);
    res.send("Tested");
  }
);

// PAYMENTS
router.post(
  "/stripe-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Stripe: Successfully received Webhook request");
  }
);

router.post(
  "/paypal-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Paypal: Successfully received Webhook request");
  }
);

router.post(
  "/paddle-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Paddle: Successfully received Webhook request");
  }
);

router.post(
  "/checkout-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Checkout: Successfully received Webhook request");
  }
);

// CI/CD
router.post(
  "/github-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("GitHub: Successfully received Webhook request");
  }
);

router.post(
  "/gitlab-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Gitlab: Successfully received Webhook request");
  }
);

router.post(
  "/bitbucket-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Bitbucket: Successfully received Webhook request");
  }
);

router.post(
  "/docker-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Docker: Successfully received Webhook request");
  }
);

// E-COMM
function verifyShopifySignature(req, res, next) {
  const sigHeaderName = "x-shopify-hmac-sha256";
  const secret = process.env.VITE_SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.log("No Shopify secret configured");
    return next();
  }
  if (!req.rawBody) {
    return next("Request body empty");
  }
  const body = req.rawBody;
  const hmacHeader = req.get(sigHeaderName);

  // Create a hash based on the parsed body
  const hash = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  // Compare the created hash with the value of the X-Shopify-Hmac-Sha256 Header
  if (hash !== hmacHeader) {
    return next(
      `Request body digest (${hash}) did not match ${sigHeaderName} (${hmacHeader})`
    );
  } else {
    console.log("Shopify: Signature is valid, accepted");
  }
  return next();
}

router.post(
  "/shopify-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Shopify: Successfully received Webhook request");
  }
);

router.post(
  "/bigcommerce-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("BigCommerce Successfully received Webhook request");
  }
);

router.post(
  "/woocommerce-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("WooCommerce: Successfully received Webhook request");
  }
);

router.post(
  "/commercelayer-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Commerce Layer: Successfully received Webhook request");
  }
);

// CRM
router.post(
  "/hubspot-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("HubSpot: Successfully received Webhook request");
  }
);

router.post(
  "/pipedrive-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Pipedrive: Successfully received Webhook request");
  }
);

// EXTRAS
router.post(
  "/okta-webhooks-endpoint",
  (req: Request, res: Response) => {
    console.log(req.body);
    res.send("Okta Event hook Successfully received");
  }
);



// MSG91 SMTP Email Service
// const sendEmailViaMSG91SMTP = async (recipientEmail: string, leadName: string, leadEmail: string): Promise<boolean> => {
//   try {
//     const MSG91_SMTP_HOST = process.env.VITE_MSG91_SMTP_HOST;
//     const MSG91_SMTP_PORT = process.env.VITE_MSG91_SMTP_PORT || "587";
//     const MSG91_SMTP_USER = process.env.VITE_MSG91_SMTP_USER;
//     const MSG91_SMTP_PASSWORD = process.env.VITE_MSG91_SMTP_PASSWORD;
//     const MSG91_SENDER_EMAIL = process.env.VITE_MSG91_SENDER_EMAIL;
//     const MSG91_SENDER_NAME = process.env.VITE_MSG91_SENDER_NAME || "Webhook Server";

//     // Validate SMTP credentials
//     if (!MSG91_SMTP_HOST || !MSG91_SMTP_USER || !MSG91_SMTP_PASSWORD) {
//       console.error("❌ MSG91 SMTP credentials not configured in .env");
//       return false;
//     }

//     // Configure Nodemailer for MSG91 SMTP
//     const transporter = nodemailer.createTransport({
//       host: MSG91_SMTP_HOST,
//       port: parseInt(MSG91_SMTP_PORT),
//       secure: MSG91_SMTP_PORT === "587", // true for 465, false for other ports like 587
//       auth: {
//         user: MSG91_SMTP_USER,
//         pass: MSG91_SMTP_PASSWORD,
//       },
//     });

//     const emailSubject = "Thank You for Your Interest - Lead Form Received";
//     const emailBody = `
//       <h2>Thank You, ${leadName}!</h2>
//       <p>We have successfully received your form submission.</p>
//       <p><strong>Your Email:</strong> ${leadEmail}</p>
//       <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
//       <p>Our team will get back to you shortly.</p>
//       <p>Best regards,<br/>${MSG91_SENDER_NAME}</p>
//     `;

//     // Send the email
//     const info = await transporter.sendMail({
//       from: `"${MSG91_SENDER_NAME}" <${MSG91_SENDER_EMAIL}>`,
//       to: recipientEmail,
//       subject: emailSubject,
//       html: emailBody,
//     });

//     console.log("✅ Email sent successfully via MSG91 SMTP. Message ID:", info.messageId);
//     return true;
//   } catch (error) {
//     console.error("❌ Error sending email via MSG91 SMTP:", error);
//     return false;
//   }
// };

// MSG91 Email Template API Service (Proper Format)
const sendEmailViaMSG91Template = async (
  recipientEmail: string,
  leadName: string,
  leadEmail: string,
): Promise<boolean> => {
  try {
    const MSG91_API_KEY = process.env.VITE_MSG91_API_KEY;
    const MSG91_TEMPLATE_ID = process.env.VITE_MSG91_TEMPLATE_ID;
    const MSG91_FROM_EMAIL = process.env.VITE_MSG91_FROM_EMAIL;
    const MSG91_REGISTERED_DOMAIN = process.env.VITE_MSG91_REGISTERED_DOMAIN;
    console.log(MSG91_FROM_EMAIL);

    // Validate template configuration
    if (!MSG91_API_KEY) {
      console.error("❌ MSG91_API_KEY not configured in .env");
      console.error("   Please add: VITE_MSG91_API_KEY=your_actual_api_key");
      return false;
    }

    if (!MSG91_TEMPLATE_ID) {
      console.error("❌ MSG91_TEMPLATE_ID not configured in .env");
      console.error("   Please add: VITE_MSG91_TEMPLATE_ID=your_template_id");
      return false;
    }

    console.log("📧 Attempting to send email via MSG91 Template API...");

    // Prepare email payload in the correct MSG91 format
    const emailPayload = {
      recipients: [
        {
          to: [
            {
              email: recipientEmail,
              name: leadName,
            },
          ],
          variables: {
            // Template variable for name
            otp: 123456,        // Template variable for email
            submission_time: new Date().toLocaleString(),  // Template variable for timestamp
          },
        },
      ],
      from: {
        email: MSG91_FROM_EMAIL || "noreply@example.com",
      },
      domain: MSG91_REGISTERED_DOMAIN || "example.com",
      template_id: MSG91_TEMPLATE_ID,
    };

    // Make API request to MSG91 with proper headers
    const response = await fetch("https://control.msg91.com/api/v5/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authkey": MSG91_API_KEY,
      },
      body: JSON.stringify(emailPayload),
    });

    const responseData = await response.json();

    console.log("📥 Response Status:", response.status);
    // console.log("📥 Response Data:", responseData);

    // Check various success responses
    if (
      response.ok ||
      responseData.request_id ||
      responseData.type === "success" ||
      (responseData.status && responseData.status !== "fail")
    ) {
      console.log("✅ Email sent successfully via MSG91 Template API");
      return true;
    } else {
      console.error("❌ MSG91 Template API error:");
      console.error("   Status:", responseData.status);
      console.error("   Error:", responseData.errors);
      console.error("   Code:", responseData.code);
      console.error("   API Error:", responseData.apiError);

      // Provide specific guidance
      if (responseData.code === "401" || responseData.apiError === "418") {
        console.error("\n🔧 TROUBLESHOOTING:");
        console.error("   1. Check your API Key is correct: VITE_MSG91_API_KEY");
        console.error("   2. Your API Key may be expired - get a new one from MSG91 dashboard");
        console.error("   3. Make sure the API Key is active and not revoked");
      }

      return false;
    }
  } catch (error) {
    console.error("❌ Error sending email via MSG91 Template API:", error);
    return false;
  }
};

// FACEBOOK LEAD FORM WEBHOOK
// Handle Facebook Webhook Verification (Required by Meta)
router.get("/facebook-lead-webhook", (req: Request, res: Response) => {
  const VERIFY_TOKEN = process.env.VITE_FACEBOOK_VERIFY_TOKEN || "my_secure_verify_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Facebook Webhook Verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.status(400).send("Missing parameters");
  }
});

router.post(
  "/facebook-lead-webhook",
  async (req: Request, res: Response) => {
    try {
      console.log("📱 Facebook Lead Form Webhook Received");
      // console.log("Payload:", JSON.stringify(req.body, null, 2));
      console.log

      // Extract lead data from Facebook webhook
      const leadData = req.body.entry?.[0]?.changes?.[0]?.value;
      console.log("📥 Response Data From Facebook:", leadData);

      const leadgenId = leadData?.leadgen_id;
      console.log("🔑 Leadgen ID:", leadgenId);

      if (!leadData || !leadgenId) {
        console.warn("⚠️  Invalid lead data structure: missing leadgen_id");
        return res.status(400).send("Invalid lead data");
      }

      let leadName = leadData.name || "Unknown";
      let leadEmail = leadData.email || "no-email@provided.com";
      console.log("Lead Name:", leadName);
      console.log("Lead Email:", leadEmail);

      // If the payload already contains name and email (e.g., from a test payload), skip the Graph API fetch
      if (leadName !== "Unknown" && leadEmail !== "no-email@provided.com") {
        console.log("🛠️  Testing/Mock payload detected, bypassing Graph API fetch.");
      } else {
        const PAGE_ACCESS_TOKEN = process.env.VITE_FACEBOOK_PAGE_ACCESS_TOKEN;
        if (!PAGE_ACCESS_TOKEN) {
          console.error("❌ VITE_FACEBOOK_PAGE_ACCESS_TOKEN not configured in .env");
          return res.status(500).send("Server configuration error");
        }

        // Fetch the actual lead details (name, email) from Facebook Graph API
        const graphApiUrl = `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${PAGE_ACCESS_TOKEN}`;
        console.log(`🌐 Fetching actual lead payload from Facebook URL: https://graph.facebook.com/v19.0/${leadgenId}...`);

        const graphResponse = await fetch(graphApiUrl);
        const graphData = await graphResponse.json();

        if (!graphResponse.ok) {
          console.error("❌ Error fetching from Facebook Graph API:", graphData);
          return res.status(500).send("Failed to fetch lead data from Facebook");
        }

        console.log("📥 Actual Lead Payload from Facebook Graph API:", JSON.stringify(graphData, null, 2));

        if (graphData.field_data && Array.isArray(graphData.field_data)) {
          for (const field of graphData.field_data) {
            if (field.name === "email" && field.values && field.values.length > 0) {
              leadEmail = field.values[0];
            } else if ((field.name === "full_name" || field.name === "name" || field.name === "first_name") && field.values && field.values.length > 0) {
              leadName = field.name === "first_name" ? (leadName === "Unknown" ? field.values[0] : `${field.values[0]} ${leadName}`) : field.values[0];
            } else if (field.name === "last_name" && field.values && field.values.length > 0) {
              leadName = leadName === "Unknown" ? field.values[0] : `${leadName} ${field.values[0]}`;
            }
          }
        }
      }

      console.log(`📧 Sending email to lead: ${leadName} (${leadEmail})`);

      // Send email to the LEAD via MSG91 Email Template API
      const emailSent = await sendEmailViaMSG91Template(leadEmail, leadName, leadEmail);

      if (emailSent) {
        res.status(200).send("Facebook Lead: Successfully processed and confirmation email sent to lead via MSG91 Template API");
      } else {
        res.status(500).send("Facebook Lead: Received but email sending failed");
      }
    } catch (error) {
      console.error("❌ Error processing Facebook lead webhook:", error);
      res.status(500).send("Error processing webhook");
    }
  }
);

export default router;
