import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required to capture the payment." },
        { status: 400 }
      );
    }

    console.log(`[PayPal API] Capturing PayPal order with ID: ${orderId}`);
    const captureResult = await capturePayPalOrder(orderId);

    const captureStatus = captureResult.status;
    const purchaseUnit = captureResult.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];

    if (captureStatus === "COMPLETED") {
      return NextResponse.json({
        success: true,
        orderId: captureResult.id,
        status: captureStatus,
        transactionId: capture?.id,
        amount: capture?.amount?.value,
        currency: capture?.amount?.currency_code,
        payer: captureResult.payer,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: captureStatus,
        message: "Payment authorized but not completed successfully on PayPal.",
      });
    }
  } catch (error: any) {
    console.error("[PayPal API Error] Failed to capture order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to capture PayPal payment." },
      { status: 500 }
    );
  }
}
