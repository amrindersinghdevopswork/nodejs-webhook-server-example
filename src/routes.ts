import express, { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { IncomingHttpHeaders } from "http";
import { Request as ExpressRequest } from "express";

const router = express.Router();



router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Webhooks API");
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
//     const MSG91_SMTP_HOST = import.meta.env.VITE_MSG91_SMTP_HOST;
//     const MSG91_SMTP_PORT = import.meta.env.VITE_MSG91_SMTP_PORT || "587";
//     const MSG91_SMTP_USER = import.meta.env.VITE_MSG91_SMTP_USER;
//     const MSG91_SMTP_PASSWORD = import.meta.env.VITE_MSG91_SMTP_PASSWORD;
//     const MSG91_SENDER_EMAIL = import.meta.env.VITE_MSG91_SENDER_EMAIL;
//     const MSG91_SENDER_NAME = import.meta.env.VITE_MSG91_SENDER_NAME || "Webhook Server";

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
    const MSG91_API_KEY = import.meta.env.VITE_MSG91_API_KEY;
    const MSG91_TEMPLATE_ID = import.meta.env.VITE_MSG91_TEMPLATE_ID;
    const MSG91_FROM_EMAIL = import.meta.env.VITE_MSG91_FROM_EMAIL;
    const MSG91_REGISTERED_DOMAIN = import.meta.env.VITE_MSG91_REGISTERED_DOMAIN;

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
router.post(
  "/facebook-lead-webhook",
  async (req: Request, res: Response) => {
    try {
      console.log("📱 Facebook Lead Form Webhook Received");
      // console.log("Payload:", JSON.stringify(req.body, null, 2));

      // Extract lead data from Facebook webhook
      const leadData = req.body.entry?.[0]?.changes?.[0]?.value;

      if (!leadData) {
        console.warn("⚠️  Invalid lead data structure");
        return res.status(400).send("Invalid lead data");
      }

      const leadName = leadData.name || "Unknown";
      const leadEmail = leadData.email || "no-email@provided.com";

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
