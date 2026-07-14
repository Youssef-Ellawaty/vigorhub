// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      username,
      email,
      phone,
      password,
      gender,
      height,
      weight,
      age,
      primaryGoal,
      accountType = "free_athlete",
      subscriptionStatus = "INACTIVE",
      subscriptionPlan = "free",
      billingCycle,
      paymentStatus = "UNPAID",
      paymentMethod,
      paidAmount,
      paidCurrency,
      paypalOrderId,
      paypalPayerEmail,
      paypalPayerId,
    } = body;

    // Basic Validation
    if (!fullName || !username || !password || !gender || !height || !weight || !age || !primaryGoal) {
      return NextResponse.json(
        { 
          error: "جميع الحقول الأساسية مطلوبة.",
          errorEn: "All basic fields are required." 
        },
        { status: 400 }
      );
    }

    // Check unique username
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { 
          error: "اسم المستخدم هذا مسجل بالفعل.",
          errorEn: "Username is already taken." 
        },
        { status: 409 }
      );
    }

    // Check unique email if provided
    if (email) {
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        return NextResponse.json(
          { 
            error: "البريد الإلكتروني هذا مسجل بالفعل.",
            errorEn: "Email is already registered." 
          },
          { status: 409 }
        );
      }
    }

    // Check unique phone if provided
    if (phone) {
      const existingUserByPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingUserByPhone) {
        return NextResponse.json(
          { 
            error: "رقم الهاتف هذا مسجل بالفعل.",
            errorEn: "Phone number is already registered." 
          },
          { status: 409 }
        );
      }
    }

    // Calculate Subscription Dates if active or paid
    let subscriptionStart: Date | null = null;
    let subscriptionEnd: Date | null = null;

    if (paymentStatus === "PAID" || subscriptionStatus === "ACTIVE") {
      subscriptionStart = new Date();
      subscriptionEnd = new Date();

      if (billingCycle === "month") {
        subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);
      } else if (billingCycle === "3months") {
        subscriptionEnd.setDate(subscriptionEnd.getDate() + 90);
      } else if (billingCycle === "year") {
        subscriptionEnd.setDate(subscriptionEnd.getDate() + 365);
      } else {
        // Default to 1 month if undefined but paid
        subscriptionEnd.setDate(subscriptionEnd.getDate() + 30);
      }
    }

    // Hash the password securely
    const passwordHash = hashPassword(password);

    // Create the user in SQLite database via Prisma Client
    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        email: email || null,
        phone: phone || null,
        passwordHash,
        gender,
        height: parseFloat(height.toString()),
        weight: parseFloat(weight.toString()),
        age: parseInt(age.toString()),
        primaryGoal,
        accountType,
        subscriptionStatus,
        subscriptionPlan,
        billingCycle: billingCycle || null,
        subscriptionStart,
        subscriptionEnd,
        paymentStatus,
        paymentMethod: paymentMethod || null,
        paidAmount: paidAmount ? parseFloat(paidAmount.toString()) : null,
        paidCurrency: paidCurrency || null,
        paypalOrderId: paypalOrderId || null,
        paypalPayerEmail: paypalPayerEmail || null,
        paypalPayerId: paypalPayerId || null,
      },
    });

    // Remove passwordHash before sending the response
    const { passwordHash: _, ...userWithoutPassword } = user;

    const userWithApprovedStatus = {
      ...userWithoutPassword,
      status: "approved", // compatible with existing authorization checks in page.tsx
    };

    console.log(`[Auth API] New user registered: ${username} with Plan: ${subscriptionPlan}`);

    return NextResponse.json({
      success: true,
      user: userWithApprovedStatus,
    });
  } catch (error: any) {
    console.error("[Auth API Error] Registration failed:", error);
    return NextResponse.json(
      { 
        error: "فشل إنشاء الحساب الرياضي. يرجى مراجعة البيانات والاتصال بالدعم الفني.",
        errorEn: error.message || "Failed to create account." 
      },
      { status: 500 }
    );
  }
}
