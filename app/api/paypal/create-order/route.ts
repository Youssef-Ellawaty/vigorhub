import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "USD", planId, billingCycle } = body;

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required to create a PayPal order." },
        { status: 400 }
      );
    }

    // PayPal does not support EGP natively. 
    // If the currency is EGP, we automatically convert to USD (e.g., 1 USD = 50 EGP)
    let finalAmount = parseFloat(amount);
    let finalCurrency = currency;

    if (currency === "EGP" || currency === "ج.م") {
      finalAmount = parseFloat((finalAmount / 50).toFixed(2)); // Standard conversion rate
      finalCurrency = "USD";
    } else {
      // Ensure the amount is rounded to 2 decimal places as required by PayPal
      finalAmount = parseFloat(finalAmount.toFixed(2));
    }

    // If for some reason the converted amount is 0, set a minimum of 0.99 USD
    if (finalAmount <= 0) {
      finalAmount = 0.99;
    }

    console.log(`[PayPal API] Creating order for Plan: ${planId || "unknown"} (${billingCycle || "unknown"})`);
    console.log(`[PayPal API] Original: ${amount} ${currency} -> Charged: ${finalAmount} ${finalCurrency}`);

    const order = await createPayPalOrder(finalAmount.toString(), finalCurrency);

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      chargedAmount: finalAmount,
      chargedCurrency: finalCurrency,
    });
  } catch (error: any) {
    console.error("[PayPal API Error] Failed to create order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create PayPal order." },
      { status: 500 }
    );
  }
}
