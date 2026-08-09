    # Migration Plan to PHP Webhook Server

    This document outlines the approach to rewrite the existing Node.js Express webhook server into a modern PHP application.

    ## User Review Required

    > [!CAUTION]
    > **Clarification Needed**: You asked for "the plan in the php format". I have assumed you meant a plan to **rewrite this Node.js webhook server in PHP**. If instead you meant you wanted this readable plan document itself literally formatted as PHP code (e.g. inside `<?php /* ... */ ?>`), please let me know!

    > [!WARNING]
    > Moving from Node.js (which runs continuously) to a traditional PHP setup means that execution happens per-request (unless using a long-running framework like Swoole/FrankenPHP). This plan assumes a standard per-request PHP setup (e.g., Apache/Nginx or PHP's built-in dev server).

    ## Proposed Architecture & Dependencies

    To keep the PHP application lightweight and conceptually equivalent to the Express.js app:

    1. **Routing**: A lightweight router like `bramus/router` or simply native PHP `switch` statements, instead of `express.Router()`.
    2. **Environment Variables**: Use `vlucas/phpdotenv` to load configurations identically to the Node.js `.env` file.
    3. **HTTP Requests (MSG91 API)**: Use PHP's built-in `cURL` extension or `file_get_contents` with stream contexts.
    4. **JSON Parsing**: Extract payloads securely using `file_get_contents("php://input")` and `json_decode`.

    ## Proposed Changes

    ---

    ### 1. Project Initialization

    #### [NEW] `composer.json`
    Define the project requirements and autoloading.
    ```json
    {
        "require": {
            "vlucas/phpdotenv": "^5.5",
            "bramus/router": "^1.6"
        }
    }
    ```

    #### [NEW] `index.php` (Entry Point)
    Act as the front-controller (equivalent to `server.ts`). It will initialize environment variables, instantiate the router, and include route definitions.

    ---

    ### 2. Route Definitions (Equivalent to `routes.ts`)

    #### [NEW] `routes.php`
    Define all endpoints (Payments, CI/CD, E-Comm, CRM, Extras, etc.).

    *   **Standard Webhooks** (e.g., Stripe, PayPal, GitHub):
        Map endpoints like `/stripe-webhooks-endpoint` to receive POST requests, read `php://input`, log the data, and respond with HTTP 200.

    *   **Shopify Authentication**:
        Replicate `verifyShopifySignature` using `hash_hmac('sha256', $body, $secret)`. Compare it with `$_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256']` using `hash_equals()`.

    *   **Facebook Lead Form Webhook**:
        *   **GET `/facebook-lead-webhook`**: Handle Facebook verification challenge checking `$_GET['hub_mode']` and `$_GET['hub_verify_token']`.
        *   **POST `/facebook-lead-webhook`**: Read the payload, extract `name` and `email`, and invoke the MSG91 service.

    ---

    ### 3. MSG91 Email Service

    #### [NEW] `services/Msg91Service.php`
    Translate the `sendEmailViaMSG91Template` logic.
    *   Fetch `VITE_MSG91_API_KEY`, etc.
    *   Use `curl_init()`, `curl_setopt()`, and `curl_exec()` to make the POST request to `https://control.msg91.com/api/v5/email/send`.
    *   Handle and log success/failure responses.

    ---

    ## Open Questions

    > [!IMPORTANT]
    > 1. **Framework Preferences**: Do you want to build this entirely using "Vanilla PHP" with no dependencies, or is using Composer with lightweight libraries (for `.env` and routing) acceptable?
    > 2. **Server Runtime**: Will this be deployed on a standard LAMP/LEMP stack, or do you require a specific containerized setup (e.g., Docker with PHP-FPM)?
    > 3. **Are there any other Node.js specific libraries** used in other parts of the codebase that I need to factor into the PHP migration?

    ## Verification Plan

    ### Manual Verification
    1. Start the PHP built-in server: `php -S localhost:1337 -t public/`
    2. Test the base `GET /` endpoint using curl or a browser.
    3. Test Facebook verification: `curl "http://localhost:1337/facebook-lead-webhook?hub.mode=subscribe&hub.verify_token=my_secure_verify_token&hub.challenge=1158201444"`
    4. Test a webhook payload locally using Postman or cURL.
    5. Provide you with the complete zip or code structure to try locally with tools like Ngrok.
