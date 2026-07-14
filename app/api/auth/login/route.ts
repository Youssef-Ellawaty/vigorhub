// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { usernameOrEmail, password } = body;

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { 
          error: "يرجى إدخال اسم المستخدم/البريد الإلكتروني وكلمة المرور.",
          errorEn: "Username/Email and password are required." 
        },
        { status: 400 }
      );
    }

    // Try to find the user by username, email, or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
          { phone: usernameOrEmail },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { 
          error: "بيانات الدخول غير صحيحة. يرجى التأكد وإعادة المحاولة.",
          errorEn: "Invalid login credentials." 
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordCorrect = verifyPassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { 
          error: "بيانات الدخول غير صحيحة. يرجى التأكد وإعادة المحاولة.",
          errorEn: "Invalid login credentials." 
        },
        { status: 401 }
      );
    }

    // Check if subscription has expired and update status on the fly
    let updatedStatus = user.subscriptionStatus;
    if (user.subscriptionEnd && new Date() > new Date(user.subscriptionEnd) && user.subscriptionStatus === "ACTIVE") {
      updatedStatus = "EXPIRED";
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: "EXPIRED", accountType: "free_athlete" },
      });
      user.subscriptionStatus = "EXPIRED";
      user.accountType = "free_athlete";
    }

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    const userWithApprovedStatus = {
      ...userWithoutPassword,
      status: "approved", // compatible with existing authorization checks in page.tsx
    };

    console.log(`[Auth API] User logged in: ${user.username} (Subscription: ${user.subscriptionStatus})`);

    return NextResponse.json({
      success: true,
      user: userWithApprovedStatus,
    });
  } catch (error: any) {
    console.error("[Auth API Error] Login failed:", error);
    return NextResponse.json(
      { 
        error: "حدث خطأ أثناء تسجيل الدخول. يرجى مراجعة الدعم الفني.",
        errorEn: error.message || "Failed to log in." 
      },
      { status: 500 }
    );
  }
}
