import { NextRequest, NextResponse } from "next/server";

const DEFAULT_CLIENT_ID = "Abbo_9yQS5bJRExYO4Wxq6-A1CTeU-smkV2oLMSdvQIgAJ9pK9A5iaQbAdvk77hP5lj1MvNmNK_LtKqY";
const DEFAULT_CLIENT_SECRET = "EPppTsH9Ve6jlEUaObN1pvqvvhvEKyNelt8CpD753DrNl_Vfnb2P5_03DETHkHPEIYwwc_ClSFBKGpyL";

export function getPayPalConfig() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || DEFAULT_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || DEFAULT_CLIENT_SECRET;
  const isSandbox = (process.env.NEXT_PUBLIC_PAYPAL_ENV || "sandbox") === "sandbox";

  // Check if credentials exist
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are missing. Please configure them in your environment.");
  }

  return {
    clientId,
    clientSecret,
    baseUrl: isSandbox ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com",
  };
}

/**
 * Retrieves a secure PayPal Access Token using standard OAuth 2.0 Client Credentials flow
 */
export async function getPayPalAccessToken(): Promise<string> {
  const { clientId, clientSecret, baseUrl } = getPayPalConfig();

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch PayPal Access Token: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Creates a PayPal Order for a specific subscription amount and currency
 */
export async function createPayPalOrder(amount: string, currency: string = "USD") {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
          description: `VigorHub subscription payment of ${amount} ${currency}`,
        },
      ],
      application_context: {
        brand_name: "VigorHub",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create PayPal Order: ${errorText}`);
  }

  return await response.json();
}

/**
 * Captures a PayPal Order to complete the payment after customer approval
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const { baseUrl } = getPayPalConfig();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to capture PayPal Order: ${errorText}`);
  }

  return await response.json();
}
