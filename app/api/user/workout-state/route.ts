import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch user with their custom splits and workout logs
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        activeSplitId: true,
        customSplits: {
          include: {
            exercises: true,
          }
        },
        workoutLogs: {
          include: {
            sets: true,
          },
          orderBy: {
            date: "desc",
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      activeSplitId: user.activeSplitId,
      customSplits: user.customSplits,
      workoutLogs: user.workoutLogs,
    });
  } catch (error: any) {
    console.error("[Workout State API GET Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    if (action === "set_active_split") {
      const { activeSplitId } = body;
      await prisma.user.update({
        where: { id: userId },
        data: { activeSplitId },
      });
      return NextResponse.json({ success: true, activeSplitId });
    }

    if (action === "save_custom_split") {
      const { split } = body; // { name, description, days: [{ dayNumber, label, exercises: [...] }] }
      
      const customSplit = await prisma.customSplit.create({
        data: {
          userId,
          name: split.name,
          description: split.description || "",
          days: JSON.stringify(split.days), // serialize split days with their exercises directly as a robust JSON string inside the text field
        }
      });

      return NextResponse.json({ success: true, split: customSplit });
    }

    if (action === "save_workout_log") {
      const { exercises, date } = body; // exercises: [{ exerciseName, sets: [{ setNumber, reps, weight }] }]
      
      const savedLogs = [];

      for (const ex of exercises) {
        const log = await prisma.workoutLog.create({
          data: {
            userId,
            date: date ? new Date(date) : new Date(),
            exerciseName: ex.exerciseName,
            sets: {
              create: ex.sets.map((s: any) => ({
                setNumber: s.setNumber,
                reps: parseInt(s.reps) || 0,
                weight: parseFloat(s.weight) || 0,
              }))
            }
          },
          include: {
            sets: true,
          }
        });
        savedLogs.push(log);
      }

      return NextResponse.json({ success: true, workoutLogs: savedLogs });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[Workout State API POST Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
