import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, plan } = await req.json();

    if (!userId || !plan) {
      return NextResponse.json(
        { error: "UserId and Plan are required" },
        { status: 400 }
      );
    }

    const accountType = plan === "vip" ? "vip_athlete" : plan === "pro" ? "pro_athlete" : "basic_athlete";

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: plan,
        accountType: accountType,
        subscriptionStatus: "ACTIVE",
        paymentStatus: "PAID",
        subscriptionStart: new Date(),
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      user: {
        ...userWithoutPassword,
        status: "approved"
      },
    });
  } catch (error: any) {
    console.error("[Upgrade API Error]", error);
    return NextResponse.json(
      { error: "Failed to upgrade subscription", details: error.message },
      { status: 500 }
    );
  }
}
